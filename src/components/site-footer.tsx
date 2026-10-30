import Link from "next/link";
import { SocialLinks } from "@/components/social-links";
import type { Profile } from "@/lib/types";

export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <p className="footer-name">{profile.name}</p>
          <p className="footer-meta">
            {profile.title}
            {profile.location ? ` · ${profile.location}` : ""}
          </p>
        </div>
        <SocialLinks profile={profile} />
        <div className="footer-meta footer-legal">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="footer-sep">/</span>
          <Link href="/admin">内容后台</Link>
        </div>
      </div>
    </footer>
  );
}