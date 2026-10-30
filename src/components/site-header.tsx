"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "首页" },
  { href: "/projects", label: "项目" },
  { href: "/blog", label: "博客" },
  { href: "/about", label: "关于" },
];

export function SiteHeader({ name }: { name: string }) {
  const pathname = usePathname();

  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="brand-dot">●</span>
          <span className="brand-name">{name}</span>
          <span className="brand-suffix">/个人主页</span>
        </Link>
        <nav className="nav-links" aria-label="主导航">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              data-active={active(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/admin" className="nav-admin">
          后台
        </Link>
      </div>
    </header>
  );
}