import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
import { formatDate, readingMinutes, renderMarkdown } from "@/lib/markdown";
import { getPostBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "文章未找到" };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const html = renderMarkdown(post.content);

  return (
    <article className="container article">
      <Link href="/blog" className="back-link">
        <ArrowLeftIcon />
        返回文章列表
      </Link>

      <div className="article-meta">
        <span>{formatDate(post.publishedAt)}</span>
        <span>约 {readingMinutes(post.content)} 分钟</span>
        <span>{post.tags.join(" / ")}</span>
      </div>

      <h1 className="article-title">{post.title}</h1>
      {post.excerpt ? <p className="article-lede">{post.excerpt}</p> : null}

      <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

      <div className="article-foot">
        <Link href="/blog" className="text-link">
          <ArrowLeftIcon />
          继续阅读
        </Link>
      </div>
    </article>
  );
}