import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { isAuthenticated } from "@/lib/auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect("/login");

  return (
    <div className="container admin-page">
      <div className="admin-top">
        <div>
          <h1 className="admin-title">内容后台</h1>
          <p className="admin-hint">仅站主本人可访问 · 保存后前台即时生效</p>
        </div>
        <form action={logoutAction}>
          <button className="admin-logout" type="submit">
            退出登录
          </button>
        </form>
      </div>
      <div className="admin-shell">
        <AdminNav />
        <div>{children}</div>
      </div>
    </div>
  );
}
