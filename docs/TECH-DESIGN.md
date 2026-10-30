# 个人网站 · 技术设计文档

| 项目 | 内容 |
| --- | --- |
| 版本 | v1.0 |
| 日期 | 2026-10-29 |
| 关联文档 | [PRD](./PRD.md)、[AGENTS.md](../AGENTS.md) |
| 运行环境 | Node.js ≥ 22（开发机为 Node 26）、Windows / macOS / Linux |

## 1. 技术选型

| 层次 | 方案 | 选择理由 |
| --- | --- | --- |
| 框架 | Next.js 16（App Router） | 前后台同一项目；服务端组件直接读库，无需额外 API 层；Server Actions 完成表单写入 |
| 语言 | TypeScript（strict） | 数据结构即类型，减少前后台字段错位 |
| UI | React 19 | 与 Next 16 配套 |
| 样式 | 原生 CSS + CSS 变量设计系统 | 站主是 UI 设计师，token 可维护；无 Tailwind 构建依赖，产物体积小 |
| 数据 | SQLite（Node 内置 `node:sqlite`） | 单文件、零安装、零原生依赖；个人站读多写少完全够用 |
| 数据访问 | 轻量仓储层（手写 SQL） | 表结构简单，引入 ORM 收益低；SQL 可直接审阅 |
| Markdown | `marked` | 体积极小，支持代码块与表格；关闭原始 HTML 输出防注入 |
| 部署 | 自托管 Node 进程 / 支持持久磁盘的平台 | SQLite 需要可写磁盘 |

**为什么不用 Prisma**：本项目 4 张表、单用户写入，ORM 主要带来额外生成步骤与二进制引擎下载；内置 `node:sqlite` 已稳定覆盖需求。若后续表关系变复杂，再迁移到 Prisma 即可，仓储层是唯一改动点。

**为什么不用 Tailwind**：视觉系统需要精确控制暗色层级、光晕与网格背景，用 token + 少量语义类更直观；设计师可直接在 `globals.css` 调参。

## 2. 系统架构

```
┌──────────────────────────────────────────────────────────┐
│                        Next.js 16                        │
│                                                          │
│  访客侧 (RSC)                    站主侧 (RSC + Action)     │
│  /           首页                 /admin          基本信息 │
│  /projects   项目列表/详情         /admin/skills   技能     │
│  /blog       文章列表/详情         /admin/projects 项目     │
│  /about      关于                 /admin/posts    文章     │
│         │                              │                 │
│         └──────────┬───────────────────┘                 │
│                    ▼                                     │
│            src/lib/queries.ts  （只读查询）                │
│            src/lib/mutations.ts（写入 + 校验）             │
│                    ▼                                     │
│            src/lib/db.ts  （连接单例 + 建表 + 种子）        │
└────────────────────┬─────────────────────────────────────┘
                     ▼
              data/portfolio.db (SQLite)
```

- 页面全部为服务端组件；仅在后台表单壳、删除确认等交互处使用客户端组件。
- 首页、列表页设置 `export const dynamic = "force-dynamic"`，保证后台保存后刷新即生效，避免构建期快照。
- 不暴露公开写接口；写入只通过 Server Actions。
- 后台访问控制：`/login` 校验口令后下发签名会话 Cookie；`/admin` 布局层校验会话，未登录跳转登录页；每个写操作在 Action 内部再次校验（Server Action 可被直接调用，不能只依赖布局）。

## 3. 目录结构

```
个人网站/
├─ AGENTS.md                 协作与代码规范
├─ docs/
│  ├─ PRD.md                 需求文档
│  └─ TECH-DESIGN.md         本文档
├─ data/
│  └─ portfolio.db           SQLite 数据文件（首次启动自动生成）
├─ public/                   静态资源
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx          全局布局、字体、导航、页脚
│  │  ├─ page.tsx            首页
│  │  ├─ globals.css         设计系统（token + 组件样式）
│  │  ├─ projects/           项目列表 / 详情
│  │  ├─ blog/               博客列表 / 详情
│  │  ├─ about/              关于
│  │  ├─ login/              口令登录页与 loginAction
│  │  ├─ admin/              后台页面与 actions.ts（全部写操作校验会话）
│  │  ├─ sitemap.ts / robots.ts
│  │  └─ not-found.tsx
│  ├─ components/            前台组件 + 后台表单组件
│  └─ lib/
│     ├─ db.ts               连接、建表、种子
│     ├─ queries.ts          读取
│     ├─ mutations.ts        写入与校验
│     ├─ auth.ts             口令校验与会话签名（node:crypto + HttpOnly Cookie）
│     └─ types.ts            领域类型
├─ next.config.ts
├─ tsconfig.json
└─ package.json
```

## 4. 数据模型

```sql
CREATE TABLE IF NOT EXISTS profile (
  id          INTEGER PRIMARY KEY CHECK (id = 1),
  name        TEXT NOT NULL,
  title       TEXT NOT NULL,
  tagline     TEXT NOT NULL DEFAULT '',
  bio         TEXT NOT NULL DEFAULT '',
  avatar      TEXT NOT NULL DEFAULT '',      -- 头像地址（外链或 /avatar.jpg）
  avatar_image BLOB DEFAULT NULL,            -- 后台上传的头像图片
  avatar_mime  TEXT NOT NULL DEFAULT '',     -- 上传图片的 MIME
  location    TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL DEFAULT '',
  wechat      TEXT NOT NULL DEFAULT '',      -- 微信号（仅展示，不做跳转）
  qq          TEXT NOT NULL DEFAULT '',      -- QQ 号（仅展示）
  phone       TEXT NOT NULL DEFAULT '',      -- 电话（tel: 可拨号）
  available   INTEGER NOT NULL DEFAULT 1,
  updated_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS skills (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT '通用',
  level       INTEGER NOT NULL DEFAULT 60,   -- 0–100
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  summary     TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  tech        TEXT NOT NULL DEFAULT '',      -- 逗号分隔
  cover       TEXT NOT NULL DEFAULT '',
  repo_url    TEXT NOT NULL DEFAULT '',
  demo_url    TEXT NOT NULL DEFAULT '',
  year        TEXT NOT NULL DEFAULT '',
  featured    INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  excerpt      TEXT NOT NULL DEFAULT '',
  content      TEXT NOT NULL DEFAULT '',
  tags         TEXT NOT NULL DEFAULT '',     -- 逗号分隔
  published    INTEGER NOT NULL DEFAULT 1,
  published_at TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);
```

约定：

- 布尔值用 `INTEGER 0/1` 存储，类型层转换为 `boolean`。
- 多值字段（`tech`、`tags`）存逗号分隔字符串，读写时由 `splitList` / `joinList` 转换，避免额外关联表。
- 所有时间使用 ISO 8601 字符串（UTC），展示时格式化为 `YYYY.MM.DD`。
- 表结构变更采用"追加式"策略：`db.ts` 中的建表 SQL 使用 `CREATE TABLE IF NOT EXISTS`，新增列需在 `db.ts` 内显式 `ALTER TABLE ... ADD COLUMN`（包在 try/catch 中，兼容旧库）。

## 5. 数据访问层

### 5.1 连接管理

`src/lib/db.ts`：

1. 计算数据库路径：`process.env.PORTFOLIO_DB_PATH ?? <cwd>/data/portfolio.db`。
2. 目录不存在则创建。
3. 开发环境用 `globalThis` 缓存连接，避免热更新反复打开文件。
4. 启动时执行建表 SQL；若 `profile` 表为空则写入种子数据。

### 5.2 查询（`queries.ts`）

| 函数 | 返回 | 用途 |
| --- | --- | --- |
| `getProfile()` | `Profile` | 全站基本信息，兜底默认值避免页面崩溃 |
| `getSkills()` | `{ category, items }[]` | 按分类分组、组内按 `sort_order` 排序 |
| `getProjects({ featuredOnly, limit })` | `Project[]` | 首页精选 / 全部列表 |
| `getProject(id)` | `Project \| null` | 项目详情 |
| `getPosts({ publishedOnly, limit })` | `Post[]` | 前台列表 / 后台全量 |
| `getPostBySlug(slug)` | `Post \| null` | 文章详情（仅已发布） |
| `getPost(id)` | `Post \| null` | 后台编辑 |
| `getStats()` | `{ projects, posts, skills }` | 首页数据条 |

### 5.3 写入（`mutations.ts`）

统一返回 `ActionResult = { ok: true } | { ok: false; error: string }`，供 `useActionState` 消费。

| Action | 校验 |
| --- | --- |
| `saveProfile` | `name`、`title` 非空；邮箱格式（简单正则） |
| `saveSkill` | `name` 非空；`level` 限制 0–100 |
| `deleteSkill` | id 存在 |
| `saveProject` | `title` 非空；`year` 仅允许 4 位数字或空 |
| `deleteProject` | id 存在 |
| `savePost` | `title`、`slug` 非空；slug 仅允许 `[a-z0-9-]`；slug 唯一（排除自身） |
| `deletePost` | id 存在 |

写入成功后调用 `revalidatePath("/")` 及对应列表路径。页面本身为 `force-dynamic`，revalidate 只是兜底。

## 6. 路由与页面职责

| 路由 | 渲染方式 | 数据 |
| --- | --- | --- |
| `/` | 动态 | profile + skills + featured projects + latest 3 posts + stats |
| `/projects` | 动态，支持 `?tech=` 过滤 | 全部项目；过滤参数在服务端筛选 |
| `/projects/[id]` | 动态 | 单个项目；不存在则 `notFound()` |
| `/blog` | 动态 | 已发布文章 |
| `/blog/[slug]` | 动态 | 单篇文章，Markdown 渲染，`generateMetadata` 输出标题与摘要 |
| `/about` | 动态 | profile |
| `/avatar` | 动态（Route Handler） | 输出后台上传的头像二进制；`?v=<更新时间>` 作为缓存版本 |
| `/login` | 动态 | 口令登录表单；已登录则直接跳回目标页 |
| `/admin/*` | 动态 | 需登录；`robots.txt` 中禁止抓取 |

### 6.1 后台访问控制设计

| 环节 | 做法 |
| --- | --- |
| 口令存储 | 只存在服务端环境变量 `ADMIN_PASSWORD`，不进数据库、不进代码仓库 |
| 口令比较 | 两侧先 SHA-256 再 `crypto.timingSafeEqual`，避免时序侧信道与长度差异 |
| 会话 | `HMAC-SHA256(过期时间戳, AUTH_SECRET)` 生成 `exp.signature`，Cookie 名 `portfolio_session`，有效期 7 天 |
| Cookie 属性 | `HttpOnly`（JS 不可读）、`SameSite=Lax`、`Path=/`、生产环境 `Secure` |
| 路由保护 | `src/app/admin/layout.tsx` 中 `isAuthenticated()` 失败即 `redirect("/login")` |
| 写操作保护 | `admin/actions.ts` 每个 save 前调用 `guard()` 返回错误；delete 前 `guardOrRedirect()` |
| 暴力猜测 | 同一来源 5 次失败后锁定 10 分钟（进程内 Map，重启清零） |
| 退出 | `logoutAction` 删除 Cookie 后跳回 `/login` |
| 搜索引擎 | `/admin`、`/login` 页面 `robots: noindex`，并在 `robots.txt` 中 disallow |

不引入 NextAuth 等鉴权库：本场景只有一个使用者，一套 HMAC 签名 Cookie 足够，且不新增依赖。

## 7. 设计系统

### 7.1 色彩 Token

| Token | 值 | 用途 |
| --- | --- | --- |
| `--bg-base` | `#05070C` | 页面底色 |
| `--bg-elev` | `#0A0F18` | 卡片 / 导航 |
| `--bg-elev-2` | `#0E1622` | 输入框 / 嵌套块 |
| `--line` | `rgba(126, 158, 200, .14)` | 常规分隔线、卡片描边 |
| `--line-strong` | `rgba(126, 158, 200, .30)` | 悬停 / 聚焦描边 |
| `--text` | `#E8EEF9` | 主文本 |
| `--text-2` | `#94A4BC` | 次级文本 |
| `--text-3` | `#5C6D85` | 元信息、占位 |
| `--accent` | `#5B8CFF` | 主强调（按钮、链接、焦点） |
| `--accent-2` | `#35EAD6` | 次强调（状态、终端光标） |
| `--danger` | `#FF6B6B` | 删除 / 错误 |

### 7.2 字体与排版

- 正文：`Inter, "SF Pro Text", "PingFang SC", system-ui, sans-serif`。
- 等宽：`"JetBrains Mono", "SFMono-Regular", Consolas, monospace`，用于标签、序号、日期、终端块。
- 字号阶梯：`12 / 13 / 14 / 16 / 20 / 28 / clamp(40, 6vw, 76)`。
- 标题使用紧字距（`-0.03em`），正文行高 `1.75`。

### 7.3 布局与断点

- 容器最大宽度 `1120px`，左右内边距 `24px`（移动端 `20px`）。
- 断点：`640px`（单栏）、`900px`（两栏）、`1200px`（三栏）。
- 区块纵向间距 `clamp(56px, 9vw, 112px)`。

### 7.4 视觉语言

- 背景：底色 + 一层低透明度网格线（`linear-gradient` 重复），营造工程感。
- 卡片：`1px` 描边 + 极轻内发光，不使用厚重阴影。
- 强调：蓝青渐变仅用于文字 / 细线 / 小面积按钮，不做大面积填充。
- 动效：入场 `fade-up 0.5s`，悬停 `translateY(-2px)`，`prefers-reduced-motion` 下全部关闭。

## 8. SEO 与性能

- 每页 `generateMetadata` 输出 `title` / `description`；文章页使用 `excerpt`。
- 提供 `/sitemap.xml`（首页、项目、文章）与 `/robots.txt`（屏蔽 `/admin`、`/login`）；后台与登录页额外输出 `noindex`。
- 不引入第三方 UI 组件库与图标库，图标使用内联 SVG。
- 图片使用原生 `<img>` + `loading="lazy"`（外链封面），避免 `next/image` 对外链域名的白名单配置负担。
- 字体使用系统栈，零字体请求。

## 9. 本地运行与部署

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # 生产构建校验
npm run start        # 生产运行
```

环境变量：

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `ADMIN_PASSWORD` | 无（必填） | 后台访问口令；未配置时登录页提示无法登录 |
| `AUTH_SECRET` | 无（必填） | 会话签名密钥，建议 32 字节随机十六进制 |
| `PORTFOLIO_DB_PATH` | `./data/portfolio.db` | 数据库文件位置 |
| `SITE_URL` | `http://localhost:3000` | sitemap / robots 中的站点地址 |

本地首次运行：

```bash
cp .env.example .env.local   # Windows: copy .env.example .env.local
# 编辑 ADMIN_PASSWORD，并用下面命令生成 AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

部署要点：

1. 需要可持久化的磁盘挂载（SQLite 文件不能放在临时目录）。
2. 必须在部署平台配置 `ADMIN_PASSWORD` 与 `AUTH_SECRET`；`AUTH_SECRET` 更换后所有已登录会话立即失效。
3. 生产环境走 HTTPS：会话 Cookie 带 `Secure`，纯 HTTP 下无法写入会话。
4. 备份只需复制 `data/portfolio.db`。

## 10. 后续演进

- 项目封面与正文图片：接入本地文件存储或对象存储（头像已支持直传并存入 SQLite）。
- 鉴权增强：口令之外叠加 TOTP 二次验证；失败计数改为持久化存储，避免进程重启重置。
- 富文本编辑器：在 Markdown 之上增加预览分栏。
- 数据迁移：表关系复杂后切换到 Prisma，仓储层接口保持不变。
