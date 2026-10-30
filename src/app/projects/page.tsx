import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ tech?: string }>;
}) {
  const { tech } = await searchParams;
  const projects = await getProjects();
  const techs = Array.from(new Set(projects.flatMap((project) => project.tech))).slice(0, 12);
  const active = tech && techs.includes(tech) ? tech : "";
  const visible = active ? projects.filter((project) => project.tech.includes(active)) : projects;

  return (
    <>
      <section className="container page-head">
        <span className="page-kicker">项目</span>
        <h1 className="page-title">做过的事</h1>
        <p className="page-desc">
          从设计系统到数据可视化，每个项目都附上了背景、职责与结果。点开卡片可以看到完整说明。
        </p>

        {techs.length > 0 ? (
          <div className="filter-bar">
            <Link href="/projects" className="filter-chip" data-active={!active}>
              全部
            </Link>
            {techs.map((item) => (
              <Link
                key={item}
                href={`/projects?tech=${encodeURIComponent(item)}`}
                className="filter-chip"
                data-active={active === item}
              >
                {item}
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section className="container page-body">
        {visible.length === 0 ? (
          <p className="empty-state">这个筛选下还没有项目。</p>
        ) : (
          <div className="projects-grid">
            {visible.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index + 1} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}