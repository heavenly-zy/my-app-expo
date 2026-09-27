# my-app-expo

基于 Expo SDK 57、React Native 0.86、React 19 和 TypeScript 的移动应用，使用 pnpm 管理依赖、Expo Router 管理路由、NativeWind 编写样式。

目前包含相机预览、前后摄像头切换，以及待完善的相册页面。项目已安装 `expo-dev-client`，日常真机开发使用 **Development build（开发构建）**。

## 环境准备

- Node.js：满足 Expo SDK 57 的最低要求（22.13.x），建议使用满足要求的 LTS 版本。
- pnpm：使用仓库中的 `pnpm-lock.yaml`，统一通过 pnpm 安装依赖和运行脚本。
- 本地构建 Android：配置 Android Studio、Android SDK 和 JDK，具体步骤参考 [Android 开发环境](https://docs.expo.dev/workflow/android-studio-emulator/)。真机需要开启开发者选项，再按下文选择 USB 有线调试或无线调试。
- 本地构建 iOS：需要 macOS 和 Xcode；Windows 无法本地编译 iOS，可使用 EAS 云构建。

以下命令均在项目根目录执行。

## Android 真机连接：有线与无线

两种连接方式都通过 ADB（Android Debug Bridge）让电脑发现手机、安装 App 和读取调试信息。它们不改变 Debug / Release 构建模式；设备连接成功后，都可以使用 `pnpm android --device`。

可以先完成设备连接检查；执行下面的项目编译或启动命令前，请先按「首次在 Android 手机上运行」章节安装项目依赖。

先通过 Android Studio 的 SDK Manager 安装或更新 **Android SDK Platform-Tools**，并将 SDK 下的 `platform-tools` 目录加入 `PATH`。Windows 默认位置通常为 `%LOCALAPPDATA%\Android\Sdk\platform-tools`，以 Android Studio 显示的 SDK 路径为准。重新打开终端后检查：

```sh
adb version
```

如果提示找不到 `adb`，先检查 SDK 安装位置和 `PATH`；也可以进入 `platform-tools` 目录，在 PowerShell 中使用 `./adb.exe` 代替 `adb`。

### 方式一：USB 有线调试

1. 在手机设置中开启「开发者选项」（通常连续点击「版本号」七次），再打开「USB 调试」。不同品牌的设置入口可能不同。
2. 用支持数据传输的 USB 线连接手机和电脑，解锁手机，在「允许 USB 调试」弹窗中授权当前电脑。
3. 在电脑上检查连接：

   ```sh
   adb devices -l
   ```

   手机对应行的状态应为 `device`。如果显示 `unauthorized`，先在手机上完成授权；如果列表为空，检查数据线、USB 接口，并按手机厂商要求安装 Windows USB 驱动。

4. 首次安装或需要重新编译时，执行下面的命令并选择手机：

   ```sh
   pnpm android --device
   ```

有线连接不需要执行 `adb pair`。已经安装开发构建、只修改 JS/TS 时，按「日常开发」章节启动 Metro 即可；无需每次重新编译。

### 方式二：Wi-Fi 无线调试（Android 11 及以上）

手机和电脑连接同一个 Wi-Fi 网络，在手机「开发者选项」中打开「无线调试」。这种配对方式不需要先插 USB 线；Android 10 及以下可使用上面的有线流程。

**第一步：使用配对码授权电脑。** 在手机的「无线调试」页面选择「使用配对码配对设备」，保持弹窗打开，查看其中的 IP、配对端口和配对码。

例如，手机配对弹窗显示 `192.168.0.84:35753` 时，在电脑执行：

```sh
adb pair 192.168.0.84:35753
```

按提示输入手机显示的配对码，看到配对成功的提示即可。这里的地址只是示例，应替换成手机当前显示的值；命令前不需要输入终端提示符 `$`。

**第二步：确认已建立调试连接。** 配对后 ADB 通常会自动发现并连接手机，先检查：

```sh
adb devices -l
```

如果没有状态为 `device` 的对应设备，返回手机「无线调试」主页面，读取其中「IP 地址和端口」的连接地址，再手动连接。例如主页面显示 `192.168.0.84:41237` 时：

```sh
adb connect 192.168.0.84:41237
adb devices -l
```

**配对弹窗中的端口与无线调试主页面中的连接端口通常不同，不能直接混用。** 上面的 `41237` 也是示例，不要固定使用它或默认端口 `5555`。

| 地址或端口 | 从哪里获取 | 用途 |
| --- | --- | --- |
| 手机 IP + 配对端口，例如 `192.168.0.84:35753` | 「使用配对码配对设备」弹窗 | `adb pair`：建立配对授权 |
| 手机 IP + 连接端口，例如 `192.168.0.84:41237` | 「无线调试」主页面 | `adb connect`：建立调试连接 |
| 电脑 IP + Metro 端口，默认 `8081` | Expo CLI 启动后的输出 | 手机加载项目的 JS 代码 |

**第三步：安装或打开开发 App。** 设备状态为 `device` 后：

```sh
# 首次安装或原生代码有变化：编译并通过无线 ADB 安装
pnpm android --device

# 已安装开发构建，仅改 JS/TS：启动 Metro 并打开 Android App
pnpm expo start --dev-client --android
```

这两条命令按场景选用，不必每次连续执行。设备选择列表中的 ID 可能是 `IP:端口`，也可能是 ADB 自动发现的服务名，以实际列表为准。

配对授权通常会保留；后续使用先开启无线调试，检查 `adb devices -l`，未自动连接时再执行 `adb connect`。切换网络、重启手机或重新开启无线调试后，IP 和连接端口可能变化，应重新读取；只有授权失效、被撤销或忘记配对时，才需要重新 `adb pair`。

结束无线连接可以使用 `adb disconnect 192.168.0.84:41237`（替换为实际连接地址）。如果仍被自动发现并重连，可在手机上关闭「无线调试」；需要取消授权时，在已配对设备列表中选择忘记该电脑。

### 已连接手机，但 App 加载不了项目

ADB 连接与 Metro 连接用途不同：`adb devices` 显示 `device`，说明电脑可以操作手机，但不保证手机已能访问开发服务器。

- **通过 Wi-Fi 访问 Metro：** 保持电脑和手机网络互通，允许 Node.js / Metro 通过 Windows 防火墙的专用网络，检查终端显示的端口（默认 `8081`）。访客 Wi-Fi、设备隔离或 VPN 可能阻止互访。手机访问的是电脑的 Metro 地址，不是 `adb pair` 使用的手机地址。
- **通过 USB 访问 Metro：** 可使用 ADB 反向端口映射，让手机的 `localhost:8081` 转发到电脑的 `8081`，不依赖手机通过 Wi-Fi 访问电脑。

只有一台 ADB 设备在线时，可在 USB 连接并授权后执行：

```sh
adb reverse tcp:8081 tcp:8081
pnpm expo start --dev-client --localhost --port 8081 --android
```

如果已经有 Metro 在运行，请复用或先停止原来的进程，避免重复占用端口。若改用其他 Metro 端口，反向映射中的两个端口也应同步修改；断开后重新连接手机时，可能需要重新执行 `adb reverse`。

如果同时连接多台设备，或同一部手机同时通过 USB 和 Wi-Fi 连接，先用 `adb devices -l` 查看 ID，再显式指定目标。下面的「设备ID」需替换为列表中的实际 ID；使用 USB 转发时应选择 USB 那一行：

```sh
adb -s "设备ID" reverse tcp:8081 tcp:8081
pnpm android --device "设备ID"
```

上面的第二条命令用于需要编译安装时。日常启动 Metro 后，可按 `Shift+A` 选择要打开的 Android 设备。

无线配对成功但未出现在设备列表时，先尝试主页面地址对应的 `adb connect`；如果仍失败，检查无线调试是否开启、IP/端口是否已变化，以及局域网是否允许设备互访。

## 首次在 Android 手机上运行

安装已有依赖：

```sh
pnpm install
```

生成原生工程，再编译并安装到手机：

```sh
pnpm expo prebuild
pnpm android --device
```

- `prebuild` 根据应用配置和依赖生成原生工程，本身不编译或安装 App。
- `prebuild` 还会将 `package.json` 中的 `expo start --android` / `expo start --ios` 脚本自动改为 `expo run:android` / `expo run:ios`，方便本地编译安装。日常只启动开发服务器仍可使用 `pnpm start`。
- `pnpm android` 对应 `expo run:android`，默认编译 **debug** 版本，并启动 Metro 开发服务器。
- `--device` 用于选择设备，不会把构建模式改为 Release。
- 如果 `android/` 尚不存在，`expo run:android` 会自动执行 Android 的 prebuild，因此首次也可以直接运行 `pnpm android --device`。
- 手机上安装的是项目自己的开发 App，与 Expo Go 分开。第一次使用相机时，需要授予相机权限。

只生成 Android 工程时，可使用 `pnpm expo prebuild --platform android`。

## 日常开发

开发构建已安装后，只修改页面、业务逻辑、JS/TS 或样式，通常只需启动开发服务器：

```sh
pnpm expo start
```

也可以运行等价的项目脚本 `pnpm start`。由于已安装 `expo-dev-client`，CLI 会自动以 Development build 为启动目标，无须再次选择构建类型。

需要明确指定启动目标时：

```sh
# 在已安装的开发构建中打开项目
pnpm expo start --dev-client

# 在 Expo Go 中打开项目（仅适用于其内置原生能力支持的功能）
pnpm expo start --go
```

在手机上的开发 App 中连接开发服务器，或扫描终端提供的二维码。通过局域网连接时，确保手机和电脑网络互通。

终端常用快捷键：

| 按键 | 功能 |
| --- | --- |
| `a` | 在 Android 设备或模拟器上打开项目 |
| `i` | 在 iOS 模拟器上打开项目（需要 macOS） |
| `r` | 重新加载已连接的 App |
| `m` | 打开开发菜单 |
| `j` | 打开 React Native DevTools |
| `s` | 在 Expo Go 和 Development build 之间切换启动目标 |

**按 `s` 只改变用哪个 App 打开项目，不会重新编译，也不会把 Debug 变成 Release。**

其他平台的入口：

```sh
pnpm android       # 本地编译并运行 Android 开发构建
pnpm ios           # 本地编译并运行 iOS 开发构建，需要 macOS
pnpm ios --device  # 选择 iPhone 真机
pnpm web           # 启动 Web 开发服务器
```

Web 入口用于调试支持 Web 的功能；原生模块和设备能力仍应在目标手机上验证。

## Expo Go、Development build 与 Release build

| 类型 | 手机上运行的 App | 开发工具 | 原生能力 | JS 代码来源 |
| --- | --- | --- | --- | --- |
| Expo Go | Expo 提供的通用客户端 | 有 | 限于客户端预装的原生模块 | 开发时从 Metro 加载 |
| Development build | 为本项目编译的独立开发 App | 有 | 包含本项目编译进去的原生模块 | 日常开发时从 Metro 加载 |
| Release build | 为测试正式体验或发布编译的 App | 默认关闭 | 包含本项目编译进去的原生模块 | 构建时打包到安装包中 |

独立安装、有自己的图标，并不代表 App 已经是正式发布版。当前项目通过 `pnpm android --device` 构建时，默认使用 debug 模式，并包含 `expo-dev-client`，所以出现 Expo 开发启动器、调试菜单和刷新功能是正常现象。

这里需要区分两个选择：**Expo Go / Development build 是开发时的启动目标，Debug / Release 是编译 App 时的构建模式。**

Development build 适合日常开发，可以使用自定义原生模块并保留快速刷新；Release build 适合验证正式运行体验和准备发布。构建 Release 无须删除 `expo-dev-client` 依赖，默认会关闭其开发启动器和菜单。

## 原生配置变更与 `prebuild --clean`

以下变更通常需要重新生成原生工程，并重新编译、安装开发构建：

- 安装、删除或升级包含原生代码的依赖。
- 修改 `app.json` 中影响原生工程的配置，例如权限、图标、启动屏或应用标识。
- 修改 config plugins，或升级 Expo SDK。

```sh
pnpm expo prebuild --clean
pnpm android --device
```

`--clean` 会**先删除目标平台已有的原生目录，再根据当前应用配置和依赖重新生成**。不加 `--clean` 时，prebuild 会在现有原生文件上叠加变更，部分插件或旧配置可能产生残留。只处理 Android 时，可缩小范围：

```sh
pnpm expo prebuild --clean --platform android
pnpm android --device
```

项目采用 Continuous Native Generation（CNG），`android/` 和 `ios/` 已加入 Git 忽略规则。原生定制应保存在 `app.json` 和 config plugins 中；如果曾手动修改原生目录，执行 `--clean` 前需另行备份并迁移这些修改，普通 Git 提交不会保存被忽略的文件。

已有 `android/` 时，`pnpm android` 会复用原生工程，不会自动重新运行 prebuild 同步配置。因此，原生配置有变化时，应先执行上面的重新生成步骤。

仅修改 JS/TS 或样式无需运行 `prebuild --clean`。如果只是需要清理 Metro 缓存，使用：

```sh
pnpm expo start --clear
```

## 在手机上测试 Release 版本

需要体验没有开发菜单、无需电脑运行 Metro 的 App 时：

```sh
pnpm android --device --variant release
```

该命令会编译并安装 Release 版本，将 JS 和所需静态资源打包到安装包中。App 自身的联网功能仍需要网络。之后修改源码，需要重新构建安装才能反映到此 Release 包中。

这用于本地验证正式运行体验，不等同于已经完成商店发布准备。当前生成的 Android 工程使用调试签名进行本地 Release 测试；上架还需要配置正式签名、应用标识和版本等信息。

回到开发构建时重新安装 debug 版本：

```sh
pnpm android --device --variant debug
```

Debug 和 Release 默认使用相同应用标识；签名兼容时会更新同一个 App，签名不同则不能直接覆盖安装。如需在手机上同时保留两个版本，需要配置不同的应用标识。

## EAS 云构建与发布

EAS Build 可以在云端编译和签名，无需本机安装 Android 或 iOS 的编译工具。构建发生在本地还是云端，与使用 Development build 还是 Release build 是两个独立选择。

当前仓库尚未配置 `eas.json`。需要使用 EAS 时，先登录并初始化构建配置：

```sh
npx eas-cli@latest login
npx eas-cli@latest build:configure
```

确认生成的 `eas.json` 包含相应 profile 后，按用途选择命令：

```sh
# 云端构建开发包：development profile 应配置 developmentClient: true
npx eas-cli@latest build --platform android --profile development

# 云端构建用于商店发布的包
npx eas-cli@latest build --platform android --profile production
```

profile 名称本身不决定构建类型，实际行为取决于 `eas.json` 配置。Android 商店构建默认生成 AAB，不能像 APK 一样直接安装到手机；需要分享可安装的测试包时，参考 [Android APK 构建配置](https://docs.expo.dev/build-reference/apk/)。

本项目的依赖与本地脚本使用 pnpm；上面的 `npx eas-cli@latest` 按项目约定临时运行最新版 EAS CLI，无须全局安装。后续商店提交使用 EAS Submit；OTA 更新使用 EAS Update，均需完成各自的配置。

## 依赖管理与检查

新增依赖时通过 Expo CLI 选择与当前 SDK 兼容的版本，例如：

```sh
pnpm expo install expo-camera
```

如果新增依赖包含原生代码，还需要按前面的步骤重新生成和构建开发 App。将包安装到 `node_modules` 不会自动把原生代码加进手机上已经安装的 App。

常用检查命令：

```sh
pnpm expo lint          # 等价于 pnpm lint
pnpm exec tsc --noEmit  # TypeScript 类型检查
pnpm dlx expo-doctor    # 检查 Expo 依赖与配置
pnpm expo install --fix # 修正与当前 SDK 不兼容的依赖版本，会修改依赖及锁文件
```

当前仓库尚未提交 ESLint 配置，首次运行 lint 会尝试初始化。本地检查如遇 `ERR_PACKAGE_PATH_NOT_EXPORTED` 且涉及 `eslint/config`，需要先完成 ESLint 配置与版本对齐。

## 项目结构

```text
src/
  app/                   # Expo Router 路由，只放页面和导航布局
    _layout.tsx          # 根导航布局
    (tabs)/              # 底部标签页
      _layout.tsx        # 标签导航布局
      index.tsx          # 相机页面
      gallery.tsx        # 相册占位页面
  components/            # 可复用组件
  schemas/               # 数据结构与校验
  services/              # 数据访问
  utils/                 # 工具函数
assets/                  # 图片、图标等资源
app.json                 # Expo 应用配置与 config plugins
pnpm-workspace.yaml      # pnpm 配置
```

页面和导航布局放在 `src/app/`，组件、工具和数据逻辑放在路由目录外。生成的 `android/`、`ios/` 不作为手动维护的源码。

## 官方文档

- [Android ADB：USB 与无线调试](https://developer.android.com/tools/adb)
- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Development build 入门](https://docs.expo.dev/develop/development-builds/introduction/)
- [Expo SDK 57 DevClient](https://docs.expo.dev/versions/v57.0.0/sdk/dev-client/)
- [Expo CLI 命令与构建选项](https://docs.expo.dev/more/expo-cli/)
- [Continuous Native Generation 与 prebuild](https://docs.expo.dev/workflow/continuous-native-generation/)
- [EAS Build 配置](https://docs.expo.dev/build/setup/)
