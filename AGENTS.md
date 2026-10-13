这是一个基于 Expo / React Native 的移动应用。优先采用适合移动端的实现方式，重视性能和跨平台兼容性。

## Expo 持续变化，请以当前文档为准

Expo 的每次 SDK 发布都可能包含不兼容的变更。你记忆中的 API 可能已经重命名、迁移或移除。在编写任何涉及 Expo、EAS 或 React Native API 的代码之前，必须完成以下步骤：

1. 查看 `package.json` 中 `expo` 包的主版本号。
2. 读取对应版本的文档：`https://docs.expo.dev/versions/v<major>.0.0/`。
3. 对于其他相关问题，读取 https://docs.expo.dev/llms.txt 。该文件提供全部 Expo 文档的索引，并纠正常见的大语言模型误解。根据其中的链接读取所需的具体页面，禁止仅凭记忆作答。

## 命令

如果项目使用 Bun（存在 `bun.lock`），则使用 `bunx` 替代 `npx`。

```bash
npx expo install <package>  # 安装依赖时必须使用此命令，替代 npm/yarn/pnpm/bun add，以解析与 SDK 兼容的版本
npx expo start              # 启动开发服务器
npx expo lint               # 执行代码规范检查
npx tsc --noEmit            # 执行类型检查
npx expo-doctor             # 诊断依赖和配置问题
npx expo install --fix      # 修复不兼容的依赖版本
```

宣布任何任务完成之前，必须执行代码规范检查和类型检查。

## 导航与路由

- 所有导航都使用 **Expo Router**。路由文件放在 `src/app/` 中，该目录内的每个文件对应一个页面，`_layout.tsx` 文件用于定义导航器。组件、钩子、工具函数等非路由代码必须放在 `src/app/` 之外。
- 从 `expo-router` 导入 `Link`、`router` 和 `useLocalSearchParams`。
- 文档：https://docs.expo.dev/router/introduction.md

## 使用 EAS 构建

使用 EAS 在云端构建、签名和提交应用（`eas build`、`eas submit`），以及发布无线更新（`eas update`），无需在本地安装 Xcode 或 Android Studio。在 Bun 项目中使用 `bunx eas-cli <command>` 调用 EAS CLI，其他项目使用 `npx eas-cli@latest <command>`；文档示例中直接使用的 `eas` 也应替换为对应的调用方式。
文档：https://docs.expo.dev/eas/index.md

## 规则

- 编写样式时优先使用 NativeWind，通过 `className` 设置样式。
- 如果 `ios/` 和 `android/` 目录不存在，则它们由持续原生生成机制（CNG）生成。禁止手动创建或编辑这些目录，应通过 `app.json` 和配置插件设置原生行为。
- Expo Go 仅包含其内置的原生模块。添加包含原生代码的库后，应用需要开发构建：在本地执行 `npx expo run:ios|android`，或执行 `eas build --profile development`。
- 优先使用 Expo 推荐的模块，再考虑第三方库；添加依赖前，先检查可用的技能。文档：https://docs.expo.dev/versions/latest/index.md
- 暂不主动添加无障碍相关代码，包括 `accessibilityRole`、`accessibilityLabel`、`accessibilityHint`、`accessible` 等属性及屏幕阅读器逻辑。

### 简洁优先

**用最少的代码解决问题，不要过度推测**

- 不要添加要求之外的功能
- 不要为一次性代码创建抽象
- 不要添加未要求的 "灵活性" 或 "可配置性"
- 不要为不可能发生的场景做错误处理
- 如果 200 行代码可以写成 50 行，重写它

**检验标准：** 资深工程师会觉得这过于复杂吗？如果是，简化

### 精准修改

**只碰必须碰的，只清理自己造成的混乱**

编辑现有代码时：

- 不要 "改进" 相邻的代码、注释或格式
- 不要重构没坏的东西
- 匹配现有风格，即使你更倾向于不同的写法
- 如果注意到无关的死代码，提一下，不要删除它

当你的改动产生孤儿代码时：

- 删除因你的改动而变得无用的导入、变量或函数
- 不要删除预先存在的死代码，除非被要求

**检验标准：** 每一行修改都应该能直接追溯到用户的请求
