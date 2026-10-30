import Link from "next/link";
import { formatDate, readingMinutes } from "@/lib/markdown";
import type { Post } from "@/lib/types";

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="empty-state">还没有发布文章。发布后会出现在这里。</p>;
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-row" key={post.id}>
          <span className="post-date">{formatDate(post.publishedAt)}</span>
          <div className="post-main">
            <h3 className="post-title">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            {post.excerpt ? <p className="post-excerpt">{post.excerpt}</p> : null}
            {post.tags.length > 0 ? (
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
          <span className="post-time">约 {readingMinutes(post.content)} 分钟</span>
        </article>
      ))}
    </div>
  );
}