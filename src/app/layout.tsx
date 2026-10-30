import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProfile } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: {
      default: `${profile.name} · ${profile.title}`,
      template: `%s · ${profile.name}`,
    },
    description: profile.tagline,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader name={profile.name} />
        <main>{children}</main>
        <SiteFooter profile={profile} />
      </body>
    </html>
  );
}