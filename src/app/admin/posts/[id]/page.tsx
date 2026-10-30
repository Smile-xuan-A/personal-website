import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePostAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { PostForm } from "@/components/admin/post-form";
import { ArrowLeftIcon } from "@/components/icons";
import { getPost } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(Number(id));

  if (!post) notFound();

  return (
    <>
      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">编辑文章</h2>
          <Link href="/admin/posts" className="back-link">
            <ArrowLeftIcon />
            返回列表
          </Link>
        </div>
        <PostForm post={post} />
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">危险操作</h2>
          <span className="panel-desc">删除后无法恢复</span>
        </div>
        <DeleteButton action={deletePostAction} id={post.id} label="删除该文章" />
      </div>
    </>
  );
}