import type { Metadata } from "next";
import { loginAction } from "@/app/login/actions";
import { LoginForm } from "@/components/admin/login-form";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "后台登录",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const target = next && next.startsWith("/admin") ? next : "/admin";

  if (await isAuthenticated()) redirect(target);

  return (
    <div className="container login-page">
      <div className="login-card">
        <h1 className="login-title">后台登录</h1>
        <p className="login-desc">
          这是站主专用的内容后台，需要访问口令。口令在环境变量 <code>ADMIN_PASSWORD</code> 中配置。
        </p>
        <LoginForm action={loginAction} next={target} />
      </div>
    </div>
  );
}
