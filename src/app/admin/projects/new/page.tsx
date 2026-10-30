import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h2 className="panel-title">新建项目</h2>
        <Link href="/admin/projects" className="back-link">
          <ArrowLeftIcon />
          返回列表
        </Link>
      </div>
      <ProjectForm />
    </div>
  );
}