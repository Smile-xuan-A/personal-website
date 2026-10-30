import { readData } from "./store";
import type { Post, Profile, Project, Skill, SkillGroup, Stats } from "./types";
import type { PostRecord } from "./store";

const FALLBACK_PROFILE: Profile = {
  id: 1,
  name: "你的名字",
  title: "设计师 / 开发者",
  tagline: "一句话介绍自己。",
  bio: "",
  avatar: "",
  avatarSrc: "",
  hasAvatarImage: false,
  location: "",
  email: "",
  wechat: "",
  qq: "",
  phone: "",
  available: false,
  updatedAt: new Date().toISOString(),
};

export async function getProfile(): Promise<Profile> {
  const { profile } = await readData();
  if (!profile) return FALLBACK_PROFILE;

  return {
    id: 1,
    name: profile.name,
    title: profile.title,
    tagline: profile.tagline,
    bio: profile.bio,
    avatar: profile.avatar,
    avatarSrc: profile.avatarImage
      ? `/avatar?v=${encodeURIComponent(profile.updatedAt)}`
      : profile.avatar,
    hasAvatarImage: Boolean(profile.avatarImage),
    location: profile.location,
    email: profile.email,
    wechat: profile.wechat,
    qq: profile.qq,
    phone: profile.phone,
    available: profile.available,
    updatedAt: profile.updatedAt,
  };
}

/** 后台「上传头像」写入的图片，供 /avatar 路由输出。 */
export async function getAvatarImage(): Promise<{ bytes: Uint8Array; mime: string } | null> {
  const { profile } = await readData();
  if (!profile.avatarImage) return null;

  return {
    bytes: new Uint8Array(Buffer.from(profile.avatarImage, "base64")),
    mime: profile.avatarMime || "image/jpeg",
  };
}

export async function getSkills(): Promise<SkillGroup[]> {
  const skills = [...(await readData()).skills].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.id - b.id,
  );

  const groups: SkillGroup[] = [];
  const index = new Map<string, SkillGroup>();

  for (const record of skills) {
    const skill: Skill = {
      id: record.id,
      name: record.name,
      category: record.category,
      level: record.level,
      sortOrder: record.sortOrder,
    };

    let group = index.get(skill.category);
    if (!group) {
      group = { category: skill.category, items: [] };
      index.set(skill.category, group);
      groups.push(group);
    }
    group.items.push(skill);
  }

  return groups;
}

export async function getProjects(
  options: { featuredOnly?: boolean; limit?: number } = {},
): Promise<Project[]> {
  const { featuredOnly = false, limit } = options;
  let projects = [...(await readData()).projects].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.id - b.id,
  );

  if (featuredOnly) projects = projects.filter((item) => item.featured);
  if (limit) projects = projects.slice(0, Math.max(1, Math.floor(limit)));

  return projects.map((record) => ({
    id: record.id,
    title: record.title,
    summary: record.summary,
    description: record.description,
    tech: record.tech,
    cover: record.cover,
    repoUrl: record.repoUrl,
    demoUrl: record.demoUrl,
    year: record.year,
    featured: record.featured,
    sortOrder: record.sortOrder,
    createdAt: record.createdAt,
  }));
}

export async function getProject(id: number): Promise<Project | null> {
  const record = (await readData()).projects.find((item) => item.id === id);
  if (!record) return null;

  return {
    id: record.id,
    title: record.title,
    summary: record.summary,
    description: record.description,
    tech: record.tech,
    cover: record.cover,
    repoUrl: record.repoUrl,
    demoUrl: record.demoUrl,
    year: record.year,
    featured: record.featured,
    sortOrder: record.sortOrder,
    createdAt: record.createdAt,
  };
}

function mapPost(record: PostRecord): Post {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    excerpt: record.excerpt,
    content: record.content,
    tags: record.tags,
    published: record.published,
    publishedAt: record.publishedAt,
    updatedAt: record.updatedAt,
  };
}

export async function getPosts(
  options: { publishedOnly?: boolean; limit?: number } = {},
): Promise<Post[]> {
  const { publishedOnly = true, limit } = options;
  let posts = [...(await readData()).posts].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.id - a.id,
  );

  if (publishedOnly) posts = posts.filter((item) => item.published);
  if (limit) posts = posts.slice(0, Math.max(1, Math.floor(limit)));

  return posts.map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const record = (await readData()).posts.find((item) => item.slug === slug && item.published);
  return record ? mapPost(record) : null;
}

export async function getPost(id: number): Promise<Post | null> {
  const record = (await readData()).posts.find((item) => item.id === id);
  return record ? mapPost(record) : null;
}

export async function getStats(): Promise<Stats> {
  const { projects, posts, skills } = await readData();
  return {
    projects: projects.length,
    posts: posts.filter((item) => item.published).length,
    skills: skills.length,
  };
}
