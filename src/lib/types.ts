export interface Profile {
  id: number;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  /** 手动填写的头像地址（外链或 /avatar.jpg） */
  avatar: string;
  /** 实际用于展示的地址：后台上传过图片则指向 /avatar，否则回落到 avatar */
  avatarSrc: string;
  /** 是否已通过后台上传图片（决定后台是否显示「移除」按钮） */
  hasAvatarImage: boolean;
  location: string;
  email: string;
  wechat: string;
  qq: string;
  phone: string;
  available: boolean;
  updatedAt: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  sortOrder: number;
}

export interface SkillGroup {
  category: string;
  items: Skill[];
}

export interface Project {
  id: number;
  title: string;
  summary: string;
  description: string;
  tech: string[];
  cover: string;
  repoUrl: string;
  demoUrl: string;
  year: string;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  publishedAt: string;
  updatedAt: string;
}

export interface Stats {
  projects: number;
  posts: number;
  skills: number;
}

export type ActionResult = { ok: true; message: string } | { ok: false; error: string };
