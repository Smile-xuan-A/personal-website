import Link from "next/link";
import { ArrowUpRightIcon, ExternalIcon } from "@/components/icons";
import type { Project } from "@/lib/types";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-card">
      <div className="project-top">
        <span className="project-index">{String(index).padStart(2, "0")}</span>
        <span className="project-year">{project.year || "—"}</span>
      </div>

      <h3 className="project-title">
        <Link href={`/projects/${project.id}`}>{project.title}</Link>
      </h3>

      {project.summary ? <p className="project-summary">{project.summary}</p> : null}

      {project.tech.length > 0 ? (
        <div className="tech-tags">
          {project.tech.map((item) => (
            <span className="tag" key={item}>
              {item}
            </span>
          ))}
        </div>
      ) : null}

      <div className="project-actions">
        <Link href={`/projects/${project.id}`} className="text-link">
          查看详情
          <ArrowUpRightIcon />
        </Link>
        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            className="text-link text-link-muted"
            target="_blank"
            rel="noreferrer"
          >
            线上地址
            <ExternalIcon />
          </a>
        ) : null}
      </div>
    </article>
  );
}