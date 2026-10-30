import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { PostList } from "@/components/post-list";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { SocialLinks } from "@/components/social-links";
import { TerminalCard } from "@/components/terminal-card";
import { getPosts, getProfile, getProjects, getSkills, getStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const profile = await getProfile();
  const stats = await getStats();
  const skills = await getSkills();
  const projects = await getProjects({ featuredOnly: true, limit: 4 });
  const posts = await getPosts({ limit: 3 });
  const intro = profile.bio.split(/\r?\n\r?\n/)[0] ?? "";

  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <div className="hero-meta fade-up">
            <Avatar src={profile.avatarSrc} name={profile.name} size={52} />
            <span className="hero-eyebrow">
              <span className="pulse" />
              {profile.available ? "开放协作中" : "专注模式"}
            </span>
          </div>

          <h1 className="hero-name fade-up">{profile.name}</h1>
          <p className="hero-title fade-up">{profile.title}</p>
          <p className="hero-tagline fade-up-2">{profile.tagline}</p>
          {intro ? <p className="hero-bio fade-up-2">{intro}</p> : null}

          <div className="hero-actions fade-up-3">
            <Link href="/projects" className="btn btn-primary">
              查看项目
              <ArrowRightIcon />
            </Link>
            <Link href="/about" className="btn">
              关于我
              <ArrowUpRightIcon />
            </Link>
          </div>

          <SocialLinks profile={profile} />
        </div>

        <TerminalCard profile={profile} stats={stats} />
      </section>

      <div className="container">
        <div className="stats">
          <div className="stat">
            <span className="stat-value">{String(stats.projects).padStart(2, "0")}</span>
            <span className="stat-label">项目</span>
          </div>
          <div className="stat">
            <span className="stat-value">{String(stats.posts).padStart(2, "0")}</span>
            <span className="stat-label">文章</span>
          </div>
          <div className="stat">
            <span className="stat-value">{String(stats.skills).padStart(2, "0")}</span>
            <span className="stat-label">技能</span>
          </div>
        </div>
      </div>

      <section className="container section">
        <SectionHeading index="01" title="技能" aside="技能概览" />
        {skills.length === 0 ? (
          <p className="empty-state">还没有添加技能，去后台加几条吧。</p>
        ) : (
          <div className="skills-grid">
            {skills.map((group) => (
              <div className="skill-group" key={group.category}>
                <div className="skill-group-head">
                  <h3>{group.category}</h3>
                  <span>{group.items.length}</span>
                </div>
                {group.items.map((skill) => (
                  <div className="skill-item" key={skill.id}>
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-value">{skill.level}</span>
                    <div className="skill-bar">
                      <span style={{ width: `${Math.min(100, Math.max(0, skill.level))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="container section">
        <SectionHeading
          index="02"
          title="精选项目"
          aside="作品精选"
          action={
            <Link href="/projects" className="text-link">
              全部项目
              <ArrowUpRightIcon />
            </Link>
          }
        />
        {projects.length === 0 ? (
          <p className="empty-state">还没有项目。去后台新建第一个项目。</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index + 1} />
            ))}
          </div>
        )}
      </section>

      <section className="container section">
        <SectionHeading
          index="03"
          title="最新文章"
          aside="文章"
          action={
            <Link href="/blog" className="text-link">
              全部文章
              <ArrowUpRightIcon />
            </Link>
          }
        />
        <PostList posts={posts} />
      </section>
    </>
  );
}