<!-- .github/copilot-instructions.md for Ave.ai (ave_web) -->
# 快速上手 — 针对 AI 编码代理的实用说明

下面的说明聚焦于本仓库的关键约定、可修改点与常见模式，便于 AI 代理在不引入破坏性改动的前提下进行编码、修复与重构。

- 项目类型：Nuxt 3（客户端渲染，ssr: false），源码位于 `src/`（见 `nuxt.config.ts` 的 `srcDir: 'src/'`）。
- 包管理：pnpm。常用脚本（见 `package.json`）：
  - `pnpm dev` → 本地开发（使用 `.env.development`）
  - `pnpm build` → 生产构建（使用 `.env.production`）
  - `pnpm generate` → 静态生成
  - `pnpm preview` → 预览构建产物

关键约定与模式（请严格遵守以避免破坏运行时行为）：

- 插件命名：客户端专属插件以 `.client.ts` 结尾（例如在 `nuxt.config.ts` 中可见多处 `*.client.ts`）。不要随意把 client-only 逻辑移到 server/plugin。`

- API 调用约定：全局 `$api` 由 `src/plugins/api/index.ts` 提供（通过 `defineNuxtPlugin` -> `provide.api`）。使用方式示例：
  - 在组件/组合式函数中：`const { $api } = useNuxtApp()` 或 `const nuxt = useNuxtApp(); await nuxt.$api('/path')`。
  - 特点：基于 `$fetch.create`，`baseURL` 可动态切换（见 `getBestApiDomain`），对带 `botapi` 的路径有专门分支与刷新 token 的逻辑，错误处理会在插件内重试部分请求。

- 国际化：语言资源在 `i18n/lang` 与 `i18n` 配置由 `i18n/i18n.config.ts` 管理。语言文件是 JSON（例如 `i18n/lang/zh-cn.json`）。修改文案应优先在这些 JSON 文件中变更。

- 路由与页面：Nuxt 的文件路由生成依赖 `src/pages/`，但 `nuxt.config.ts` 中的 `pages:extend` 钩子会过滤掉以 `_` 开头的路径和 `components` 目录，注意不要把页面放到这些被忽略的位置。

- 源码风格：项目使用 TypeScript + ESLint + Prettier。建议修改后运行 `pnpm lint` 并尽量使用 `pnpm lint:fix` 自动修复样式问题。

- CSS 与 UI：UnoCSS 和 Element Plus 并存。Element Plus 按需在 `nuxt.config.ts` 中配置并以 SCSS 引入，改变主题样式请修改 `src/assets/css/element-plus/*` 或 `uno.config.ts`。

集成点 / 易出错区域（AI 代理优先检查）：

- `src/plugins/api/index.ts`：请求拦截、自动重试与 token 刷新逻辑。修改网络层行为时，保证对 botapi 路径和 401/403 的特殊处理不被破坏。
- 环境变量：脚本通过 `--dotenv .env.production` / `.env.development` 指定 env 文件，运行/构建前请核对相应 env 文件或 `env.sh`。
- PWA、i18n、Pinia 的初始化放在 `nuxt.config.ts` 的 `plugins` 与 `modules` 中，变更加载顺序时要小心依赖关系。

小示例（安全变更示例）：

- 新增 API 方法：在 `src/api/` 下新增文件导出函数，然后在组件中通过 `useNuxtApp().$api('/your/path')` 调用。
- 新增页面：在 `src/pages/` 下添加 `my-page.vue`（不要以 `_` 开头），然后在组件内使用 `useRouter()` / `useRoute()`。

如果不确定该如何安全修改：

1. 首先在本地执行 `pnpm dev` 复现问题或验证改动。
2. 检查 `src/plugins` 与 `src/api` 中是否存在需要协调的网络/状态改动（例如 token、domain 切换逻辑）。
3. 运行 `pnpm lint` 并修复样式/类型问题。

重要文件参考（直接打开以查看实现细节）：

- `nuxt.config.ts` — 源码目录、插件、modules、ssr 模式、vite 配置与 pages hook。
- `package.json` — 脚本与依赖，使用 pnpm。
- `src/plugins/api/index.ts` — 全局 `$api` 的实现（核心请求策略）。
- `i18n/` — 多语言配置与语言文件。

如果本说明有遗漏或某些行为在运行时表现不同，请把一处具体的文件/组件路径和你期望的行为发给我，我会据此更新本文件并给出可执行的改动建议。
