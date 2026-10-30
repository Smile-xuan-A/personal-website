# AGENTS.md

本文件面向在本仓库工作的 AI 助手与协作者，说明项目约定、命令与禁区。修改代码前先读完本文。

## 1. 项目是什么

单用户的个人作品集网站：访客看「个人介绍 / 技能 / 项目 / 博客」，站主通过 `/admin` 直接改内容。**没有多用户与公开 API；后台是单人口令登录（`/login`），不是账号体系。**

- 需求：[docs/PRD.md](docs/PRD.md)
- 技术设计：[docs/TECH-DESIGN.md](docs/TECH-DESIGN.md)
- 视觉方向：暗色科技风，蓝青强调色，工程感网格背景。

## 2. 技术栈

| 项目 | 说明 |
| --- | --- |
| Next.js 16 App Router + React 19 + TypeScript strict | 服务端组件优先 |
| 原生 CSS + CSS 变量 | 不使用 Tailwind、CSS-in-JS、UI 组件库 |
| SQLite（`node:sqlite` 内置模块） | 不使用 ORM，不使用 Prisma |
| `marked` | Markdown 渲染，`renderer.html` 禁用原始 HTML |
| npm | 包管理 |

## 3. 常用命令

```bash
npm run dev            # 开发服务器 http://localhost:3000
npm run build          # 构建校验（提交前必须通过）
npm run start          # 运行生产构建
npm run typecheck      # tsc --noEmit
```

数据库：首次启动自动创建 `data/portfolio.db` 并写入示例数据。删除该文件即可重置（会丢失所有内容）。

## 4. 目录与文件职责

```
src/app/            路由与页面（全部 Server Component，除注明的 client 组件）
src/app/login/      口令登录页 + loginAction
src/app/avatar/     输出后台上传头像的 Route Handler
src/app/admin/      后台页面 + actions.ts（Server Actions，全部写操作先校验会话）
src/lib/auth.ts     口令校验、会话签名与 Cookie 配置
src/components/     展示组件；*Form.tsx / DeleteButton.tsx 为 client 组件
src/lib/db.ts       连接单例、建表、种子数据
src/lib/queries.ts  只读查询
src/lib/mutations.ts 写入 + 校验
src/lib/types.ts    领域类型
src/app/globals.css 设计系统与全部样式
docs/               需求与技术文档
```

## 5. 编码规范

- TypeScript `strict`，禁止 `any`（确实需要时用 `unknown` + 收窄）。
- 字段名与数据库列一致，使用 snake_case 的列名、camelCase 的对象属性，转换集中在 `queries.ts`。
- 页面默认为 Server Component；只有需要 `useState` / `useActionState` / 浏览器确认时才加 `"use client"`。
- 数据读取统一走 `src/lib/queries.ts`，不要在页面里直接拼 SQL。
- 写入统一走 Server Actions，表单用 `useActionState` 接收 `{ ok, error }`。
- 列表页、首页使用 `export const dynamic = "force-dynamic"`；后台保存后调用 `revalidatePath`。
- 不新增依赖。确需新增时，先确认能用现有依赖或原生能力实现，并在 Tech 文档记录理由。
- 不创建多余文档（README、变更日志、总结报告），除非明确要求。

## 6. 设计系统规范

- 颜色只能使用 `globals.css` 中定义的 token（`--bg-base`、`--text`、`--accent` 等），禁止在组件里写十六进制色值。
- 新增视觉变量时，先加到 `:root` 并在 Tech 文档 §7.1 同步登记。
- 间距使用 `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96` 体系；不要零散写 `13px`、`27px`。
- 圆角：小控件 `8px`，卡片 `14px`，胶囊 `999px`。
- 断点：`640px` / `900px` / `1200px`。所有新增区块必须在这三档下检查。
- 字体：系统字体栈 + 等宽字体栈，不引入 Web Font。
- 动效只做 `opacity` / `transform`，且必须包在 `@media (prefers-reduced-motion: no-preference)` 内。
- 图标使用内联 SVG，统一 `stroke-width: 1.5`，颜色 `currentColor`。

## 7. 数据与后台约定

- 表结构定义在 `src/lib/db.ts` 的建表 SQL 中；新增列用 `ALTER TABLE ... ADD COLUMN` 包 try/catch，保证旧库兼容。
- 后台**必须登录**（站主要求只有本人能改内容）：
  - 口令只从环境变量 `ADMIN_PASSWORD` 读取，永不写进代码、数据库、文档示例值或提交记录；
  - 会话由 `AUTH_SECRET` 做 HMAC 签名，Cookie 必须保持 `HttpOnly` / `SameSite=Lax` / 生产环境 `Secure`；
  - 新增任何写操作（Server Action 或 API Route）都必须在入口处调用 `isAuthenticated()`，不能只依赖 `admin/layout.tsx` 的跳转；
  - 不要把 `/admin`、`/login` 加进 sitemap，`robots.txt` 保持屏蔽，后台页面保持 `robots: noindex`；
  - 不要引入 NextAuth / Clerk / Auth.js，本场景用现有 `src/lib/auth.ts` 即可。
- 头像：上传图以 BLOB 存在 `profile.avatar_image`，只允许 `image/jpeg`、`image/png`、`image/webp`、`image/gif` 且 ≤ 2MB（`saveAvatarImage` 校验）；前台一律使用 `profile.avatarSrc`（`queries.ts` 计算），不要直接读 `profile.avatar`。
- Server Action 必须校验：必填项、数字范围、slug 格式与唯一性。校验失败返回 `{ ok: false, error }`，不得抛未捕获异常。
- 删除操作必须有 `confirm` 二次确认。
- 草稿文章（`published = 0`）不得出现在任何前台页面。

## 8. 新增内容的正确做法

新增一个技能 / 项目 / 文章：**不要改代码**，在 `/admin` 对应页面新增。

新增一个页面模块（例如「经历」）：

1. 在 `docs/PRD.md` 补功能项与验收标准；
2. 在 `src/lib/db.ts` 建表 + 种子；
3. 在 `src/lib/types.ts`、`queries.ts`、`mutations.ts` 补类型与读写；
4. 在 `src/app/admin/` 增加编辑页与 action；
5. 前台页面接入，更新 `sitemap.ts`；
6. 三档宽度检查 + `npm run build`。

## 9. 禁区

- ❌ 不要引入 Tailwind、shadcn、MUI、Framer Motion 等 UI/动画库。
- ❌ 不要引入 ORM 或改动数据层为 Prisma，除非用户明确要求。
- ❌ 不要手改 `data/portfolio.db`，所有内容变更走后台。
- ❌ 不要在客户端组件里直接 `fetch` 内部数据；数据在服务端取好后传参。
- ❌ 不要把示例内容（陈屿 / 示例项目）当作真实信息写进文档或对外承诺。
- ❌ 不要提交 `.env`、`.env.local`、数据库文件备份或任何密钥（含 `ADMIN_PASSWORD`、`AUTH_SECRET`）。
- ❌ 不要为后台「图方便」删掉登录校验或把口令硬编码在页面 / Action 中。

## 10. 提交前检查

```bash
npm run typecheck
npm run build
```

并确认：

- [ ] 未登录访问 `/admin` 跳转 `/login`，退出登录后再次要求登录
- [ ] 后台保存后前台数据同步
- [ ] 删除后列表与首页同步
- [ ] 草稿文章前台不可见
- [ ] 375 / 768 / 1440 宽度无横向滚动
- [ ] 未引入新依赖
