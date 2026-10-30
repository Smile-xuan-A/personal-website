import { nextId, readData, updateData } from "./store";
import type { ActionResult } from "./types";

export interface ProfileInput {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatar: string;
  location: string;
  email: string;
  wechat: string;
  qq: string;
  phone: string;
  available: boolean;
}

export interface SkillInput {
  name: string;
  category: string;
  level: number;
  sortOrder: number;
}

export interface ProjectInput {
  title: string;
  summary: string;
  description: string;
  tech: string;
  cover: string;
  repoUrl: string;
  demoUrl: string;
  year: string;
  featured: boolean;
  sortOrder: number;
}

export interface PostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  published: boolean;
}

const OK: ActionResult = { ok: true, message: "已保存" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeNewlines(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/** 把「a, b, c」形式的输入转成字符串数组。 */
function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function saveProfile(input: ProfileInput): Promise<ActionResult> {
  if (!input.name.trim()) return { ok: false, error: "姓名不能为空" };
  if (!input.title.trim()) return { ok: false, error: "职位 / 身份不能为空" };
  if (input.email.trim() && !EMAIL_RE.test(input.email.trim())) {
    return { ok: false, error: "邮箱格式不正确" };
  }
  if (input.qq.trim() && !/^\d{5,12}$/.test(input.qq.trim())) {
    return { ok: false, error: "QQ 号应为 5–12 位数字" };
  }
  if (input.phone.trim() && !/^[0-9+\-()\s]{7,20}$/.test(input.phone.trim())) {
    return { ok: false, error: "电话格式不正确" };
  }

  await updateData((data) => {
    data.profile = {
      ...data.profile,
      name: input.name.trim(),
      title: input.title.trim(),
      tagline: input.tagline.trim(),
      bio: normalizeNewlines(input.bio).trim(),
      avatar: input.avatar.trim(),
      location: input.location.trim(),
      email: input.email.trim(),
      wechat: input.wechat.trim(),
      qq: input.qq.trim(),
      phone: input.phone.trim(),
      available: input.available,
      updatedAt: new Date().toISOString(),
    };
  });

  return OK;
}

const AVATAR_MIME: Record<string, string> = {
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
  "image/gif": "image/gif",
};
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export interface AvatarInput {
  bytes: Uint8Array;
  mime: string;
}

/** 保存后台直传的头像：转成 Base64 写进数据文件，备份数据文件即备份头像。 */
export async function saveAvatarImage(input: AvatarInput): Promise<ActionResult> {
  const mime = AVATAR_MIME[input.mime.toLowerCase()];
  if (!mime) return { ok: false, error: "头像仅支持 JPG / PNG / WebP / GIF" };
  if (input.bytes.byteLength === 0) return { ok: false, error: "请选择图片文件" };
  if (input.bytes.byteLength > AVATAR_MAX_BYTES) {
    return { ok: false, error: "图片不能大于 2MB" };
  }

  const encoded = Buffer.from(input.bytes).toString("base64");

  await updateData((data) => {
    data.profile.avatarImage = encoded;
    data.profile.avatarMime = mime;
    data.profile.updatedAt = new Date().toISOString();
  });

  return { ok: true, message: "头像已更新" };
}

export async function clearAvatarImage(): Promise<ActionResult> {
  await updateData((data) => {
    data.profile.avatarImage = null;
    data.profile.avatarMime = "";
    data.profile.updatedAt = new Date().toISOString();
  });

  return { ok: true, message: "已移除上传的头像" };
}

export async function saveSkill(input: SkillInput, id?: number): Promise<ActionResult> {
  if (!input.name.trim()) return { ok: false, error: "技能名称不能为空" };
  if (Number.isNaN(input.level) || input.level < 0 || input.level > 100) {
    return { ok: false, error: "熟练度需在 0–100 之间" };
  }

  const values = {
    name: input.name.trim(),
    category: input.category.trim() || "通用",
    level: input.level,
    sortOrder: input.sortOrder,
  };

  await updateData((data) => {
    const target = id ? data.skills.find((item) => item.id === id) : undefined;
    if (target) {
      Object.assign(target, values);
    } else {
      data.skills.push({ id: nextId(data.skills), ...values });
    }
  });

  return OK;
}

export async function removeSkill(id: number): Promise<ActionResult> {
  await updateData((data) => {
    data.skills = data.skills.filter((item) => item.id !== id);
  });
  return OK;
}

export async function saveProject(input: ProjectInput, id?: number): Promise<ActionResult> {
  if (!input.title.trim()) return { ok: false, error: "项目名称不能为空" };
  if (input.year.trim() && !/^\d{4}$/.test(input.year.trim())) {
    return { ok: false, error: "年份需为 4 位数字，或留空" };
  }

  const values = {
    title: input.title.trim(),
    summary: input.summary.trim(),
    description: normalizeNewlines(input.description).trim(),
    tech: splitList(input.tech),
    cover: input.cover.trim(),
    repoUrl: input.repoUrl.trim(),
    demoUrl: input.demoUrl.trim(),
    year: input.year.trim(),
    featured: input.featured,
    sortOrder: input.sortOrder,
  };

  await updateData((data) => {
    const target = id ? data.projects.find((item) => item.id === id) : undefined;
    if (target) {
      Object.assign(target, values);
    } else {
      data.projects.push({
        id: nextId(data.projects),
        ...values,
        createdAt: new Date().toISOString(),
      });
    }
  });

  return OK;
}

export async function removeProject(id: number): Promise<ActionResult> {
  await updateData((data) => {
    data.projects = data.projects.filter((item) => item.id !== id);
  });
  return OK;
}

export async function savePost(input: PostInput, id?: number): Promise<ActionResult> {
  if (!input.title.trim()) return { ok: false, error: "标题不能为空" };
  if (!input.slug.trim()) return { ok: false, error: "slug 不能为空" };
  if (!SLUG_RE.test(input.slug.trim())) {
    return { ok: false, error: "slug 只能包含小写字母、数字和连字符" };
  }

  const slug = input.slug.trim();
  const conflict = (await readData()).posts.find((item) => item.slug === slug && item.id !== id);
  if (conflict) return { ok: false, error: "该 slug 已被其他文章占用" };

  const values = {
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt.trim(),
    content: normalizeNewlines(input.content),
    tags: splitList(input.tags),
    published: input.published,
  };
  const now = new Date().toISOString();

  await updateData((data) => {
    const target = id ? data.posts.find((item) => item.id === id) : undefined;
    if (target) {
      Object.assign(target, values, { updatedAt: now });
    } else {
      data.posts.push({
        id: nextId(data.posts),
        ...values,
        publishedAt: now,
        updatedAt: now,
      });
    }
  });

  return OK;
}

export async function removePost(id: number): Promise<ActionResult> {
  await updateData((data) => {
    data.posts = data.posts.filter((item) => item.id !== id);
  });
  return OK;
}
