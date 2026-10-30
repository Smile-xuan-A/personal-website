import { savePostAction } from "@/app/admin/actions";
import { FormShell } from "@/components/admin/form-shell";
import type { Post } from "@/lib/types";

export function PostForm({ post }: { post?: Post }) {
  return (
    <FormShell action={savePostAction} submitLabel={post ? "保存文章" : "创建文章"}>
      <input type="hidden" name="id" value={post?.id ?? ""} />

      <div className="form-grid">
        <div className="field field-full">
          <label htmlFor="post-title">标题</label>
          <input id="post-title" name="title" defaultValue={post?.title} required />
        </div>

        <div className="field">
          <label htmlFor="post-slug">链接标识（英文与短横线）</label>
          <input
            id="post-slug"
            name="slug"
            defaultValue={post?.slug}
            placeholder="design-tokens-contract"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="post-tags">标签（逗号分隔）</label>
          <input id="post-tags" name="tags" defaultValue={post?.tags.join(", ")} placeholder="设计系统, 工程化" />
        </div>

        <div className="field field-full">
          <label htmlFor="post-excerpt">摘要</label>
          <textarea id="post-excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} />
        </div>

        <div className="field field-full">
          <label htmlFor="post-content">正文（Markdown）</label>
          <textarea
            id="post-content"
            name="content"
            rows={18}
            defaultValue={post?.content}
            style={{ minHeight: 340, fontFamily: "var(--font-mono)", fontSize: 13 }}
            placeholder={"## 小标题\n\n正文段落。\n\n- 列表项\n\n```js\nconsole.log('hello')\n```"}
          />
        </div>

        <div className="checkbox-field">
          <input
            id="post-published"
            name="published"
            type="checkbox"
            defaultChecked={post ? post.published : true}
          />
          <label htmlFor="post-published">已发布（取消勾选则为草稿，前台不可见）</label>
        </div>
      </div>
    </FormShell>
  );
}