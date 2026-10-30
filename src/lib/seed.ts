import type { PortfolioData } from "./store";

/** 首次启动（数据文件不存在）时写入的示例内容。上线前在后台替换即可。 */
export function createSeedData(): PortfolioData {
  const now = new Date().toISOString();

  return {
    profile: {
      name: "陈屿",
      title: "UI 设计师 / 前端开发者",
      tagline: "把复杂的系统，做成一眼就懂的界面。",
      bio: "我在杭州做界面设计与前端实现，关注设计系统、数据可视化与暗色界面。\n\n白天在 Figma 里推敲层级，晚上在代码里验证层级。我相信好的界面不是画出来的，而是在真实数据和真实约束里磨出来的。\n\n目前开放远程协作与长期项目合作。",
      avatar: "/avatar.jpg",
      avatarImage: null,
      avatarMime: "",
      location: "杭州",
      email: "hello@chenyu.design",
      wechat: "",
      qq: "",
      phone: "",
      available: true,
      updatedAt: now,
    },
    skills: [
      { id: 1, name: "设计系统", category: "设计", level: 92, sortOrder: 1 },
      { id: 2, name: "交互设计", category: "设计", level: 88, sortOrder: 2 },
      { id: 3, name: "视觉设计", category: "设计", level: 85, sortOrder: 3 },
      { id: 4, name: "用户研究", category: "设计", level: 76, sortOrder: 4 },
      { id: 5, name: "React", category: "前端", level: 87, sortOrder: 5 },
      { id: 6, name: "TypeScript", category: "前端", level: 82, sortOrder: 6 },
      { id: 7, name: "CSS 架构", category: "前端", level: 90, sortOrder: 7 },
      { id: 8, name: "Next.js", category: "前端", level: 80, sortOrder: 8 },
      { id: 9, name: "Figma", category: "工具", level: 94, sortOrder: 9 },
      { id: 10, name: "Git", category: "工具", level: 85, sortOrder: 10 },
      { id: 11, name: "动效实现", category: "工具", level: 78, sortOrder: 11 },
    ],
    projects: [
      {
        id: 1,
        title: "Northwind Analytics",
        summary: "面向运营团队的数据分析后台，把 12 张报表压缩成 3 个可下钻视图。",
        description:
          "项目从一次真实的报表过载问题开始：运营每天早上要打开 12 个页面才能判断当天业务是否健康。\n\n我负责信息架构与全部前端实现。核心是把指标按「异常 → 趋势 → 明细」三层组织，用同一套图表语义贯穿全站，并让任意视图都能一键下钻到明细。\n\n上线后运营的日报准备时间从 40 分钟降到 6 分钟。",
        tech: ["React", "TypeScript", "D3", "Design Tokens"],
        cover: "",
        repoUrl: "https://github.com/",
        demoUrl: "https://example.com/",
        year: "2025",
        featured: true,
        sortOrder: 1,
        createdAt: now,
      },
      {
        id: 2,
        title: "城市轨道 App 设计系统",
        summary: "为 200+ 屏的出行 App 建立 token 体系与组件库，交付给 4 个团队并行使用。",
        description:
          "这套系统要解决的不是「好看」，而是四个团队各自造轮子导致的体验漂移。\n\n我从色彩、间距、字号、圆角四组基础 token 开始，把高频业务组件沉淀为 32 个可组合组件，并写了 token 的语义命名规则与变更流程。\n\n交付后新页面的设计到开发对齐时间平均缩短一半，视觉走查问题下降约 70%。",
        tech: ["Figma", "Design Tokens", "iOS", "Android"],
        cover: "",
        repoUrl: "",
        demoUrl: "",
        year: "2024",
        featured: true,
        sortOrder: 2,
        createdAt: now,
      },
      {
        id: 3,
        title: "Motion Lab",
        summary: "一个动效实验场，用可调参数演示界面转场中的 8 种缓动策略。",
        description:
          "做动效时最常被问的问题是「这个时长合适吗」。Motion Lab 把时长、缓动、位移距离做成可拖动的参数，实时对比两种方案。\n\n实现上刻意只用 CSS 变量与 requestAnimationFrame，不依赖动画库，保证在任何低端设备上都能跑满 60 帧。",
        tech: ["CSS", "Canvas", "requestAnimationFrame"],
        cover: "",
        repoUrl: "https://github.com/",
        demoUrl: "https://example.com/",
        year: "2025",
        featured: true,
        sortOrder: 3,
        createdAt: now,
      },
      {
        id: 4,
        title: "Reading Tracker",
        summary: "个人读书管理工具，记录阅读进度、摘录与年度统计。",
        description:
          "一个给自己写的小工具：按章节记录进度，摘录自动带上页码，年底生成一张阅读年报。\n\n技术上刻意选择了最轻的方案：Next.js + JSON 文件存储，整个应用的数据就是一个文件，备份就是复制一个文件。",
        tech: ["Next.js", "JSON", "Server Actions"],
        cover: "",
        repoUrl: "https://github.com/",
        demoUrl: "",
        year: "2026",
        featured: false,
        sortOrder: 4,
        createdAt: now,
      },
    ],
    posts: [
      {
        id: 1,
        title: "设计 token 不是命名规范，而是协作契约",
        slug: "design-tokens-contract",
        excerpt:
          "当 token 只被当作「颜色变量」时，它很快就会退化成一份没人维护的清单。真正有价值的是它约定好的变更流程。",
        content: `## 一个常见的起点

很多团队引入设计 token 的方式是：把 Figma 里的颜色导出一份 JSON，交给前端，然后……就没有然后了。

三个月后，这份 JSON 和真实产品已经对不上。不是谁偷懒，而是没有人说清楚：**谁能改、什么情况下能改、改完谁负责同步。**

## token 的三层结构

我习惯把它拆成三层，每层承担不同责任：

1. **基础层**：原始值，比如 \`blue-500\`、\`space-4\`。只做定义，不做决策。
2. **语义层**：表达用途，比如 \`text-primary\`、\`surface-raised\`。产品代码只消费这一层。
3. **组件层**：个别组件的私有变量，比如 \`card-padding\`。允许存在，但必须说明为什么不能复用语义层。

如果产品代码直接引用基础层，主题切换和暗色模式就一定会失控。

## 变更流程比命名更重要

我们的约定很简单：

- 语义 token 的新增需要设计 + 前端共同确认；
- 修改已有语义 token 的值，必须跑一遍全量视觉回归；
- 删除 token 之前，先确认没有组件在引用。

听起来很重，但它把「随手改一下」变成了「有代价的决定」，这恰恰是系统能活下来的原因。

## 一点经验

token 的价值不在于它有多少个，而在于团队遇到分歧时，有一份双方都认的裁决依据。`,
        tags: ["设计系统", "工程化"],
        published: true,
        publishedAt: "2026-09-18",
        updatedAt: "2026-09-18",
      },
      {
        id: 2,
        title: "在暗色界面里，如何让层级一眼可见",
        slug: "dark-ui-hierarchy",
        excerpt:
          "暗色界面最容易被做「平」：所有卡片都一样黑，所有文字都一样亮。层级需要靠明度、描边和留白同时建立。",
        content: `## 暗色不是把白色反过来

直接把浅色界面的颜色取反，会得到一堆对比度不足、边界消失的界面。暗色界面需要重新建立三件事：**表面、边界、焦点**。

## 表面：用有限的 3 个层级

我通常只用三档表面：

- \`bg-base\`：页面底色，最暗；
- \`bg-elev\`：卡片与导航；
- \`bg-elev-2\`：输入框、嵌套区块。

超过三档，用户就很难判断"这块属于哪一层"。层级不是越多越好，而是要稳定。

## 边界：描边比阴影可靠

暗色下阴影几乎不可见，反而容易糊成一团。我更喜欢用 1px 的半透明描边，配合极轻的内发光，让卡片从背景里"浮"出来。

描边的透明度也有讲究：常规状态约 14%，悬停 26%–30%。差异足够被感知，又不会显得突兀。

## 焦点：只留一个强调色

暗色界面里，每个亮色都在争夺注意力。所以主强调色只用一个，次强调色只在状态提示里出现。

如果一屏里出现三种强调色，那等于没有强调。

## 可访问性检查

最后一步永远是量对比度：正文 ≥ 4.5:1，大字 ≥ 3:1。暗色下很容易高估对比度，务必用工具实测，而不是凭感觉。`,
        tags: ["视觉", "可访问性"],
        published: true,
        publishedAt: "2026-08-02",
        updatedAt: "2026-08-02",
      },
      {
        id: 3,
        title: "草稿：Next.js App Router 的数据获取时机",
        slug: "app-router-data-timing",
        excerpt: "记录一下构建期、请求期与流式渲染各自适合什么场景。",
        content: `这篇还在整理中，先记几个要点：

- 静态渲染适合内容不常变的页面；
- \`force-dynamic\` 保证每次请求都读最新数据；
- Server Actions 写入后配合 \`revalidatePath\` 清理缓存。`,
        tags: ["Next.js", "笔记"],
        published: false,
        publishedAt: "2026-10-20",
        updatedAt: "2026-10-20",
      },
    ],
  };
}
