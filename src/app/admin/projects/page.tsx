import Link from "next/link";
import { deleteProjectAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="panel">
      <div className="panel-head">
        <h2 className="panel-title">项目</h2>
        <Link href="/admin/projects/new" className="btn">
          + 新建项目
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="empty-state">还没有项目，点右上角新建一个。</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>项目</th>
              <th>年份</th>
              <th>首页精选</th>
              <th aria-label="操作" />
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <strong>{project.title}</strong>
                  <br />
                  <span className="panel-desc">{project.tech.join(" / ") || "未填写技术栈"}</span>
                </td>
                <td>{project.year || "—"}</td>
                <td>
                  <span className="status-dot" data-on={project.featured}>
                    <i />
                    {project.featured ? "是" : "否"}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <Link href={`/admin/projects/${project.id}`}>编辑</Link>
                    <DeleteButton action={deleteProjectAction} id={project.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}