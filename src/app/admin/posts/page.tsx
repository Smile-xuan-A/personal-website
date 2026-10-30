import Link from "next/link";
import { deletePostAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDate } from "@/lib/markdown";
import { getPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await getPosts({ publishedOnly: false });

  return (
    <div className="panel">
      <div className="panel-head">
        <h2 className="panel-title">文章</h2>
        <Link href="/admin/posts/new" className="btn">
          + 新建文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="empty-state">还没有文章，点右上角新建一篇。</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>状态</th>
              <th>日期</th>
              <th aria-label="操作" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <strong>{post.title}</strong>
                  <br />
                  <span className="panel-desc">/blog/{post.slug}</span>
                </td>
                <td>
                  <span className="status-dot" data-on={post.published}>
                    <i />
                    {post.published ? "已发布" : "草稿"}
                  </span>
                </td>
                <td>{formatDate(post.publishedAt)}</td>
                <td>
                  <div className="row-actions">
                    <Link href={`/admin/posts/${post.id}`}>编辑</Link>
                    <DeleteButton action={deletePostAction} id={post.id} />
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