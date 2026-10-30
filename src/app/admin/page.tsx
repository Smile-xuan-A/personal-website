import { clearAvatarAction, saveProfileAction, uploadAvatarAction } from "@/app/admin/actions";
import { FormShell } from "@/components/admin/form-shell";
import { Avatar } from "@/components/avatar";
import { getProfile } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <>
      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">基本信息</h2>
          <span className="panel-desc">全站唯一一份，修改后立即同步首页与关于页</span>
        </div>

        <div className="avatar-editor">
          <Avatar src={profile.avatarSrc} name={profile.name} size={88} />
          <div className="avatar-editor-body">
            <p className="panel-desc">
              {profile.hasAvatarImage
                ? "当前使用后台上传的图片，更换后前台立即生效"
                : "当前使用下方「头像地址」字段，可在这里上传图片替换"}
            </p>
            <FormShell action={uploadAvatarAction} submitLabel="上传新头像">
              <div className="field">
                <label htmlFor="avatarFile">头像图片（JPG / PNG / WebP / GIF，≤ 2MB）</label>
                <input
                  id="avatarFile"
                  name="avatarFile"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  required
                />
              </div>
            </FormShell>
            {profile.hasAvatarImage ? (
              <form action={clearAvatarAction}>
                <button className="danger-btn" type="submit">
                  移除上传的头像
                </button>
              </form>
            ) : null}
          </div>
        </div>

        <FormShell action={saveProfileAction} submitLabel="保存基本信息">
          <div className="form-grid">
            <div className="field">
              <label htmlFor="name">姓名</label>
              <input id="name" name="name" defaultValue={profile.name} required />
            </div>
            <div className="field">
              <label htmlFor="title">职位 / 身份</label>
              <input id="title" name="title" defaultValue={profile.title} required />
            </div>

            <div className="field field-full">
              <label htmlFor="tagline">一句话标语</label>
              <input id="tagline" name="tagline" defaultValue={profile.tagline} />
            </div>

            <div className="field field-full">
              <label htmlFor="bio">个人简介（空行分段）</label>
              <textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio}
                rows={7}
                placeholder="第一段会显示在首页，完整内容显示在关于页。"
              />
            </div>

            <div className="field">
              <label htmlFor="location">所在城市</label>
              <input id="location" name="location" defaultValue={profile.location} />
            </div>
            <div className="field">
              <label htmlFor="avatar">头像地址</label>
              <input id="avatar" name="avatar" defaultValue={profile.avatar} placeholder="https://…" />
            </div>

            <div className="field">
              <label htmlFor="email">邮箱</label>
              <input id="email" name="email" type="email" defaultValue={profile.email} />
            </div>
            <div className="field">
              <label htmlFor="wechat">微信号</label>
              <input id="wechat" name="wechat" defaultValue={profile.wechat} placeholder="你的微信号" />
            </div>

            <div className="field">
              <label htmlFor="qq">QQ 号</label>
              <input id="qq" name="qq" defaultValue={profile.qq} placeholder="5–12 位数字" />
            </div>

            <div className="field">
              <label htmlFor="phone">电话</label>
              <input id="phone" name="phone" type="tel" defaultValue={profile.phone} placeholder="138 0000 0000" />
            </div>

            <div className="checkbox-field">
              <input id="available" name="available" type="checkbox" defaultChecked={profile.available} />
              <label htmlFor="available">开放合作（首页显示「开放协作中」状态）</label>
            </div>
          </div>
        </FormShell>
      </div>
    </>
  );
}