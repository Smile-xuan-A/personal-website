import type { ReactNode } from "react";
import { MailIcon, PhoneIcon, QqIcon, WechatIcon } from "@/components/icons";
import type { Profile } from "@/lib/types";

interface Entry {
  key: string;
  /** 可跳转的联系方式（邮箱、电话）；微信 / QQ 只展示号码，不做跳转 */
  href?: string;
  label: string;
  icon: ReactNode;
}

export function socialEntries(profile: Profile): Entry[] {
  const entries: Entry[] = [];

  if (profile.email) {
    entries.push({
      key: "email",
      href: `mailto:${profile.email}`,
      label: `邮箱 ${profile.email}`,
      icon: <MailIcon />,
    });
  }
  if (profile.wechat) {
    entries.push({
      key: "wechat",
      label: `微信 ${profile.wechat}`,
      icon: <WechatIcon />,
    });
  }
  if (profile.qq) {
    entries.push({
      key: "qq",
      label: `QQ ${profile.qq}`,
      icon: <QqIcon />,
    });
  }
  if (profile.phone) {
    entries.push({
      key: "phone",
      href: `tel:${profile.phone.replace(/[^\d+]/g, "")}`,
      label: `电话 ${profile.phone}`,
      icon: <PhoneIcon />,
    });
  }

  return entries;
}

export function SocialLinks({ profile }: { profile: Profile }) {
  const entries = socialEntries(profile);
  if (entries.length === 0) return null;

  return (
    <ul className="social-links">
      {entries.map((entry) => (
        <li key={entry.key}>
          {entry.href ? (
            <a className="social-link" href={entry.href}>
              {entry.icon}
              {entry.label}
            </a>
          ) : (
            <span className="social-link social-static">
              {entry.icon}
              {entry.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
