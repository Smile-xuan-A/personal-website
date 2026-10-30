import type { Profile, Stats } from "@/lib/types";

export function TerminalCard({ profile, stats }: { profile: Profile; stats: Stats }) {
  return (
    <div className="terminal" aria-hidden="true">
      <div className="terminal-bar">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-title">~/个人主页</span>
      </div>
      <div className="terminal-body">
        <p className="terminal-line">
          <span className="prompt">$</span> <span className="cmd">我是谁</span>
        </p>
        <p className="terminal-out">
          {profile.name} · {profile.title}
        </p>

        <p className="terminal-line">
          <span className="prompt">$</span> <span className="cmd">查看技术栈</span>
        </p>
        <p className="terminal-out">Figma · React · TypeScript · SQLite</p>

        <p className="terminal-line">
          <span className="prompt">$</span> <span className="cmd">统计概览</span>
        </p>
        <p className="terminal-out">
          项目 {stats.projects} · 文章 {stats.posts} · 技能 {stats.skills}
        </p>

        <p className="terminal-line">
          <span className="prompt">$</span>{" "}
          <span className="cmd">查看当前状态</span>
          <span className="cursor" />
        </p>
        <p className={profile.available ? "terminal-out accent" : "terminal-out"}>
          {profile.available ? "● 开放远程协作与长期合作" : "○ 暂不接受新项目"}
        </p>
      </div>
    </div>
  );
}