# 心情照片日记 App 项目介绍

## 1. 原始需求

用户希望做一个「心情日记 + 照片记录」App，用照片记录每天发生的事情和当下情绪。

核心出发点是：生活会不知不觉中像河水一样流走，回头看时常常想不起太多具体事情。这个 App 希望通过每天拍 1-3 张照片，配合情绪颜色和少量文字，让用户在一段时间后能够回望每周或每月发生的事情，以及自己的情绪变化。

需求关键词：

- 本地单人使用 demo。
- 每天使用 1-3 张照片记录当天心情或发生的事。
- 支持补记过去日期。
- 拍照后选择当下情绪，情绪通过颜色体现。
- 可通过照片和颜色回顾一段时间内的生活与情绪变化。
- App 设计需要美观、有氛围感。

## 2. MVP 版本

本次 MVP 版本选择「回顾增强版」，不是只做最小录入，而是保留视觉回顾能力。

已实现能力：

- 新增 `journal` 全栈模块，独立于原有 `todo` 模块。
- 支持创建照片日记记录。
- 每条记录包含：日期、1-3 张照片、情绪、情绪颜色、短文字、创建时间、更新时间。
- 支持选择过去日期进行补记。
- 前端保存前自动压缩图片，降低本地 demo 的请求体和存储压力。
- 首页展示日记流、月度预览条、快速记录表单。
- 月回顾页展示当月所有日期。
- 有记录的日期展示代表照片和情绪颜色。
- 无记录的日期也显示为空白日期格，形成完整月历。
- 全屏油画风景背景，启动时随机选择背景，并加入轻微动态漂移。
- 后端使用 SQLite 本地存储，照片以轻量 data URL 字符串形式保存。

技术实现：

- Frontend：Vue 3 + TypeScript + Less + Vite + Pinia + Vue Router。
- Backend：Fastify + TypeScript + zod + SQLite/Postgres-compatible migration。
- API 路径：`/api/journal`。
- 前端路由：`/journal`、`/journal/review`。
- 首页默认重定向到 `journal-list`。

## 3. 验收标准

功能验收：

- 用户可以创建一条照片日记。
- 用户必须选择 1-3 张照片。
- 用户可以选择情绪，情绪以颜色形式呈现。
- 用户可以填写少量文字记录。
- 用户可以选择今天或过去日期进行记录。
- 用户可以在首页看到已记录的日记列表。
- 用户可以进入月回顾页面。
- 月回顾页面必须显示当月所有日期。
- 没有照片记录的日期也必须显示。
- 有照片记录的日期需要显示代表照片和情绪颜色。
- 背景需要有美观、低干扰、有氛围的艺术质感。

技术验收：

- 后端 `JournalSchema` 与前端 `Journal` 类型字段一致。
- 后端请求、响应结构遵循 `{ code, data, message }`。
- 前端业务请求只能通过 `modules/journal/api` 调用。
- 后端数据库访问只能通过 repository 和 `db` interface。
- 模块之间不能直接互相导入内部文件。
- SQLite 和 Postgres migration 成对存在。
- TypeScript type-check 通过。
- ESLint 通过。
- 架构检查通过：module、migration、DB design、API contract。

当前验证结果：

- Backend type-check：通过。
- Backend lint：通过。
- Frontend type-check：通过。
- Frontend lint：通过。
- Module boundary check：通过。
- Migration check：通过。
- DB design check：通过。
- API contract check：通过。
- 前端代理访问 `/api/journal`：返回 `200`。

环境说明：

- 当前 Windows 环境没有 `bash`，所以没有直接执行 `bash .agents/skills/vibecoding-verify/scripts/verify.sh`。
- 已逐项执行该脚本内部等价检查。
- 项目使用本地 Node 20 运行后端，避免系统 Node 24 与 `better-sqlite3` 原生依赖不兼容。

## 4. 沉淀项目 Skills

本次项目中有 3 类经验适合沉淀为后续可复用 Skills。

### 4.1 Windows Node Native Dependencies

适用场景：

- Windows 本地开发 Node 项目时遇到原生依赖安装失败。
- 例如 `better-sqlite3` 在 Node 24 下缺少预编译包。
- 环境缺少 Visual Studio C++ Build Tools。
- PowerShell 阻止 `npm.ps1` 执行。

本次沉淀点：

- 优先不要改全局 Node。
- 可在项目 `.tools` 下安装本地 Node 20。
- 使用 `npm.cmd` 绕开 PowerShell execution policy。
- 用项目脚本封装本地 Node 启动方式。

本项目产物：

- `scripts/dev-backend-node20.ps1`

### 4.2 Local Photo Demo Storage

适用场景：

- 本地 demo 需要保存图片，但暂不引入真实文件上传、对象存储、云同步。

本次沉淀点：

- MVP 阶段可以使用 data URL 保存轻量照片。
- 前端必须限制照片数量。
- 前端保存前应压缩图片。
- 后端需要设置合理 `bodyLimit`。
- 后续正式版本再升级为真实文件上传。

本项目实践：

- 限制每条记录 1-3 张照片。
- 前端压缩图片到较小尺寸后保存。
- 后端 `bodyLimit` 调整为 `6MB`。
- 数据库将 `photos` 作为 JSON text 存储。

### 4.3 MVP Acceptance Review

适用场景：

- 完成 MVP 后，需要从产品、范围、字段、类型、重复代码、无关修改等维度做验收。

本次沉淀点：

- 不能只看 lint 和 type-check。
- 需要同时检查计划是否完成、是否超范围、字段是否一致、组件是否按边界使用、还有哪些问题。
- 对用户可见体验和技术一致性都要验收。

建议沉淀的验收清单：

- 是否完成计划中的 MVP 功能。
- 是否存在超出范围的功能。
- 是否存在未完成任务。
- 数据结构与组件使用是否一致。
- 前后端字段是否一致。
- 是否存在类型错误。
- 是否存在明显重复代码。
- 是否修改无关文件。
- 是否满足 acceptance criteria。
- 当前还需要修复哪些问题。

## 5. 项目代码 GitHub / GitLab

当前本地目录未检测到 Git 仓库信息，因此暂无可读取的 remote 地址。

仓库地址：

- GitHub/GitLab：待补充

本地项目路径：

```text
E:\林冰楠\2026\codex练习\第三课\vibeCodingTemplate-main
```

建议后续操作：

- 初始化或关联 Git 仓库。
- 提交当前 MVP 版本。
- 将仓库地址补充到本文档。

