import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ExternalIcon, GithubIcon } from "@/components/icons";
import { getProject } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(Number(id));

  if (!project) notFound();

  return (
    <article className="container detail">
      <Link href="/projects" className="back-link">
        <ArrowLeftIcon />
        返回项目列表
      </Link>

      <div className="detail-meta">
        <span>{project.year || "—"}</span>
        <span>{project.featured ? "精选项目" : "项目"}</span>
        <span>{project.tech.length} 项技术</span>
      </div>

      <h1 className="detail-title">{project.title}</h1>
      {project.summary ? <p className="detail-summary">{project.summary}</p> : null}

      {project.tech.length > 0 ? (
        <div className="tech-tags" style={{ marginTop: 24 }}>
          {project.tech.map((item) => (
            <span className="tag" key={item}>
              {item}
            </span>
          ))}
        </div>
      ) : null}

      {(project.demoUrl || project.repoUrl) && (
        <div className="detail-links">
          {project.demoUrl ? (
            <a className="btn btn-primary" href={project.demoUrl} target="_blank" rel="noreferrer">
              线上地址
              <ExternalIcon />
            </a>
          ) : null}
          {project.repoUrl ? (
            <a className="btn" href={project.repoUrl} target="_blank" rel="noreferrer">
              <GithubIcon />
              源码仓库
            </a>
          ) : null}
        </div>
      )}

      {project.cover ? (
        <div className="detail-cover">
          <img src={project.cover} alt={`${project.title} 封面`} loading="lazy" />
        </div>
      ) : null}

      {project.description ? (
        <div className="detail-body">
          {project.description
            .split(/\r?\n\r?\n/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </div>
      ) : null}
    </article>
  );
}