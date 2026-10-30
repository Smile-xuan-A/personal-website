import Link from "next/link";
import { PostForm } from "@/components/admin/post-form";
import { ArrowLeftIcon } from "@/components/icons";

export default function NewPostPage() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h2 className="panel-title">新建文章</h2>
        <Link href="/admin/posts" className="back-link">
          <ArrowLeftIcon />
          返回列表
        </Link>
      </div>
      <PostForm />
    </div>
  );
}