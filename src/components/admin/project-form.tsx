import { saveProjectAction } from "@/app/admin/actions";
import { FormShell } from "@/components/admin/form-shell";
import type { Project } from "@/lib/types";

export function ProjectForm({ project }: { project?: Project }) {
  return (
    <FormShell action={saveProjectAction} submitLabel={project ? "保存项目" : "创建项目"}>
      <input type="hidden" name="id" value={project?.id ?? ""} />

      <div className="form-grid">
        <div className="field field-full">
          <label htmlFor="project-title">项目名称</label>
          <input id="project-title" name="title" defaultValue={project?.title} required />
        </div>

        <div className="field">
          <label htmlFor="project-year">年份</label>
          <input id="project-year" name="year" defaultValue={project?.year} placeholder="2025" />
        </div>
        <div className="field">
          <label htmlFor="project-order">排序（越小越前）</label>
          <input id="project-order" name="sortOrder" type="number" defaultValue={project?.sortOrder ?? 0} />
        </div>

        <div className="field field-full">
          <label htmlFor="project-summary">一句话简介</label>
          <input
            id="project-summary"
            name="summary"
            defaultValue={project?.summary}
            placeholder="一句话说清楚这个项目解决了什么问题"
          />
        </div>

        <div className="field field-full">
          <label htmlFor="project-tech">技术栈（英文逗号分隔）</label>
          <input
            id="project-tech"
            name="tech"
            defaultValue={project?.tech.join(", ")}
            placeholder="React, TypeScript, Figma"
          />
        </div>

        <div className="field">
          <label htmlFor="project-repo">仓库地址</label>
          <input id="project-repo" name="repoUrl" defaultValue={project?.repoUrl} placeholder="https://github.com/…" />
        </div>
        <div className="field">
          <label htmlFor="project-demo">线上地址</label>
          <input id="project-demo" name="demoUrl" defaultValue={project?.demoUrl} placeholder="https://…" />
        </div>

        <div className="field field-full">
          <label htmlFor="project-cover">封面图地址</label>
          <input id="project-cover" name="cover" defaultValue={project?.cover} placeholder="https://…（可选）" />
        </div>

        <div className="field field-full">
          <label htmlFor="project-description">项目说明（空行分段）</label>
          <textarea
            id="project-description"
            name="description"
            rows={10}
            defaultValue={project?.description}
            placeholder="背景、你的职责、遇到的约束、最终结果。"
          />
        </div>

        <div className="checkbox-field">
          <input
            id="project-featured"
            name="featured"
            type="checkbox"
            defaultChecked={project?.featured}
          />
          <label htmlFor="project-featured">在首页「精选项目」中展示</label>
        </div>
      </div>
    </FormShell>
  );
}