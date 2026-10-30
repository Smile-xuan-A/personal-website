import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProjectAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { ProjectForm } from "@/components/admin/project-form";
import { ArrowLeftIcon } from "@/components/icons";
import { getProject } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(Number(id));

  if (!project) notFound();

  return (
    <>
      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">编辑项目</h2>
          <Link href="/admin/projects" className="back-link">
            <ArrowLeftIcon />
            返回列表
          </Link>
        </div>
        <ProjectForm project={project} />
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">危险操作</h2>
          <span className="panel-desc">删除后无法恢复</span>
        </div>
        <DeleteButton action={deleteProjectAction} id={project.id} label="删除该项目" />
      </div>
    </>
  );
}