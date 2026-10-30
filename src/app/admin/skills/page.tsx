import { saveSkillAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { FormShell } from "@/components/admin/form-shell";
import { getSkills } from "@/lib/queries";
import { deleteSkillAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const groups = await getSkills();
  const skills = groups.flatMap((group) => group.items);

  return (
    <>
      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">新增技能</h2>
          <span className="panel-desc">同名分类会自动分组</span>
        </div>

        <FormShell action={saveSkillAction} submitLabel="添加技能">
          <div className="form-grid">
            <div className="field">
              <label htmlFor="new-skill-name">名称</label>
              <input id="new-skill-name" name="name" placeholder="例如：设计系统" required />
            </div>
            <div className="field">
              <label htmlFor="new-skill-category">分类</label>
              <input id="new-skill-category" name="category" defaultValue="设计" />
            </div>
            <div className="field">
              <label htmlFor="new-skill-level">熟练度（0–100）</label>
              <input id="new-skill-level" name="level" type="number" min={0} max={100} defaultValue={60} />
            </div>
            <div className="field">
              <label htmlFor="new-skill-order">排序（越小越前）</label>
              <input id="new-skill-order" name="sortOrder" type="number" defaultValue={0} />
            </div>
          </div>
        </FormShell>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">现有技能</h2>
          <span className="panel-desc">{skills.length} 条 · 点击展开编辑</span>
        </div>

        {skills.length === 0 ? (
          <p className="empty-state">还没有技能，先在上面添加一条。</p>
        ) : (
          skills.map((skill) => (
            <details className="skill-edit" key={skill.id}>
              <summary>
                <span className="skill-edit-name">{skill.name}</span>
                <span className="skill-edit-meta">
                  {skill.category} · {skill.level}
                </span>
              </summary>
              <div className="skill-edit-body">
                <FormShell action={saveSkillAction} submitLabel="保存修改">
                  <input type="hidden" name="id" value={skill.id} />
                  <div className="form-grid">
                    <div className="field">
                      <label>名称</label>
                      <input name="name" defaultValue={skill.name} required />
                    </div>
                    <div className="field">
                      <label>分类</label>
                      <input name="category" defaultValue={skill.category} />
                    </div>
                    <div className="field">
                      <label>熟练度（0–100）</label>
                      <input name="level" type="number" min={0} max={100} defaultValue={skill.level} />
                    </div>
                    <div className="field">
                      <label>排序</label>
                      <input name="sortOrder" type="number" defaultValue={skill.sortOrder} />
                    </div>
                  </div>
                </FormShell>
                <div className="skill-edit-delete">
                  <DeleteButton action={deleteSkillAction} id={skill.id} label="删除该技能" />
                </div>
              </div>
            </details>
          ))
        )}
      </div>
    </>
  );
}