import { SocialLinks } from "@/components/social-links";
import { Avatar } from "@/components/avatar";
import { getProfile, getStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const profile = await getProfile();
  const stats = await getStats();
  const paragraphs = profile.bio.split(/\r?\n\r?\n/).filter(Boolean);

  return (
    <>
      <section className="container page-head">
        <span className="page-kicker">关于</span>
        <h1 className="page-title">关于我</h1>
        <p className="page-desc">{profile.tagline}</p>
      </section>

      <section className="container about-grid">
        <div className="about-main">
          {paragraphs.length === 0 ? (
            <p className="about-text">还没有填写个人简介，去后台补充吧。</p>
          ) : (
            paragraphs.map((paragraph, index) => (
              <p key={index} className={index === 0 ? "about-lead" : "about-text"}>
                {paragraph}
              </p>
            ))
          )}

          <div className="stats" style={{ marginTop: 16 }}>
            <div className="stat">
              <span className="stat-value">{String(stats.projects).padStart(2, "0")}</span>
              <span className="stat-label">项目</span>
            </div>
            <div className="stat">
              <span className="stat-value">{String(stats.posts).padStart(2, "0")}</span>
              <span className="stat-label">文章</span>
            </div>
            <div className="stat">
              <span className="stat-value">{String(stats.skills).padStart(2, "0")}</span>
              <span className="stat-label">技能</span>
            </div>
          </div>
        </div>

        <aside className="about-side">
          <div className="contact-card">
            <div className="about-avatar">
              <Avatar src={profile.avatarSrc} name={profile.name} size={72} />
            </div>

            <div className="contact-row">
              <span>姓名</span>
              <strong>{profile.name}</strong>
            </div>
            <div className="contact-row">
              <span>身份</span>
              <strong>{profile.title}</strong>
            </div>
            {profile.location ? (
              <div className="contact-row">
                <span>城市</span>
                <strong>{profile.location}</strong>
              </div>
            ) : null}
            {profile.email ? (
              <div className="contact-row">
                <span>邮箱</span>
                <strong>{profile.email}</strong>
              </div>
            ) : null}
          </div>

          <SocialLinks profile={profile} />
        </aside>
      </section>
    </>
  );
}