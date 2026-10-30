import Link from "next/link";
import { PostList } from "@/components/post-list";
import { getPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <section className="container page-head">
        <span className="page-kicker">写作</span>
        <h1 className="page-title">写下来的东西</h1>
        <p className="page-desc">
          关于设计系统、暗色界面与前端实现的长短笔记。内容不多，但每篇都来自真实的项目问题。
        </p>
      </section>

      <section className="container page-body">
        <PostList posts={posts} />
        <div style={{ marginTop: 32 }}>
          <Link href="/" className="back-link">
            返回首页
          </Link>
        </div>
      </section>
    </>
  );
}