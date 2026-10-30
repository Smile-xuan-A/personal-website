"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "基本信息" },
  { href: "/admin/skills", label: "技能" },
  { href: "/admin/projects", label: "项目" },
  { href: "/admin/posts", label: "文章" },
];

export function AdminNav() {
  const pathname = usePathname();

  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className="admin-nav" aria-label="后台导航">
      {ITEMS.map((item) => (
        <Link key={item.href} href={item.href} data-active={active(item.href)}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}