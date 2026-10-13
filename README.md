# my-app-expo

基于 Expo SDK 57、React Native 和 TypeScript 的相机与相册应用，使用 Expo Router、NativeWind 和 pnpm。真机开发使用 Development build（开发构建）。

## 环境与安装

需要 Node.js 22.13+ 和 pnpm。Android 本地构建需要 [Android Studio、SDK 和 JDK](https://docs.expo.dev/workflow/android-studio-emulator/)；iOS 本地构建需要 macOS 和 Xcode。

在项目根目录安装依赖：

```sh
pnpm install
```

## Android 真机运行

### USB 调试

手机开启「开发者选项 → USB 调试」，使用数据线连接电脑，并在手机上授权。将 Android SDK 的 `platform-tools` 加入 `PATH` 后检查：

```sh
adb devices -l
```

设备状态应为 `device`；显示 `unauthorized` 时需在手机上完成授权。

### Wi-Fi 调试（Android 11+）

手机和电脑连接同一 Wi-Fi，开启「无线调试」，选择「使用配对码配对设备」。将下列地址替换为手机显示的值：

```sh
adb pair 手机IP:配对端口
# 按提示输入配对码；未自动连接时执行下一条
adb connect 手机IP:连接端口
adb devices -l
```

配对端口来自配对弹窗，连接端口来自「无线调试」主页，两者通常不同。网络变化或重启后，应重新确认连接地址。

### 首次构建

设备连接成功后，编译并安装开发构建：

```sh
pnpm android --device
```

该命令会自动生成缺失的 Android 工程、编译 debug 版本并启动 Metro。

## 日常开发

开发构建已安装后，仅修改 JS/TS 或样式时，启动 Metro 即可：

```sh
pnpm start
```

在手机开发 App 中连接服务器或扫描终端二维码；终端按 `a` 可打开 Android App。通过 Wi-Fi 连接时，确保手机和电脑网络互通，并允许 Node.js 通过防火墙。

USB 连接时，若 App 无法访问 Metro，可停止原来的 Metro 后使用端口转发（仅一台设备在线时）：

```sh
adb reverse tcp:8081 tcp:8081
pnpm expo start --dev-client --localhost --port 8081 --android
```

其他命令：`pnpm ios --device` 在 iPhone 上构建运行（需要 macOS），`pnpm web` 启动 Web，`pnpm expo start --clear` 清理 Metro 缓存后启动。

## 依赖与检查

新增依赖时，通过 Expo CLI 安装兼容版本：

```sh
pnpm expo install <package>
```

增删或升级原生依赖、修改 `app.json` 中的原生配置或 config plugins、升级 Expo SDK 后，重新生成并安装开发构建：

```sh
pnpm expo prebuild --clean --platform android
pnpm android --device
```

`--clean` 会删除并重新生成原生目录。项目采用 CNG，`android/` 和 `ios/` 被 Git 忽略，原生定制写在 `app.json` 或 config plugins 中。

```sh
pnpm lint              # 代码规范检查
pnpm exec tsc --noEmit  # 类型检查
pnpm dlx expo-doctor    # Expo 依赖与配置诊断
```

仓库尚未配置 ESLint，首次运行 `pnpm lint` 会尝试初始化。

## 项目结构与文档

页面和导航布局放在 `src/app/`；组件、钩子、状态和数据逻辑分别放在 `src/components/`、`src/hooks/`、`src/atoms/`、`src/services/` 等路由目录之外。`assets/` 存放资源，`app.json` 管理 Expo 配置。

参考：[Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) · [Expo Router](https://docs.expo.dev/router/introduction/) · [开发构建](https://docs.expo.dev/develop/development-builds/introduction/) · [CNG](https://docs.expo.dev/workflow/continuous-native-generation/) · [ADB](https://developer.android.com/tools/adb) · [EAS Build](https://docs.expo.dev/build/setup/)
