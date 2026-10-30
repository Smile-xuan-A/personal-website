import fs from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";
import { createSeedData } from "./seed";

/**
 * 全站数据存在一个地方：
 * - 生产环境（Vercel）：Upstash Redis，用 KV_REST_API_URL / KV_REST_API_TOKEN 连接
 * - 本地开发：data/portfolio.json 文件
 * 两套实现同一个接口，上层代码无感。
 */

const KV_KEY = "portfolio:data";

function kvClient(): Redis | null {
  // Vercel Marketplace 的 Upstash 集成可能注入 KV_* 或 UPSTASH_REDIS_REST_* 两套命名
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function useKv(): boolean {
  return kvClient() !== null;
}

export interface ProfileRecord {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatar: string;
  /** 后台上传的头像，Base64 存储；为空表示使用 avatar 字段的地址。 */
  avatarImage: string | null;
  avatarMime: string;
  location: string;
  email: string;
  wechat: string;
  qq: string;
  phone: string;
  available: boolean;
  updatedAt: string;
}

export interface SkillRecord {
  id: number;
  name: string;
  category: string;
  level: number;
  sortOrder: number;
}

export interface ProjectRecord {
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

export interface PostRecord {
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

export interface PortfolioData {
  profile: ProfileRecord;
  skills: SkillRecord[];
  projects: ProjectRecord[];
  posts: PostRecord[];
}

const globalForStore = globalThis as typeof globalThis & {
  __portfolioData?: { data: PortfolioData; mtimeMs: number };
};

function dataFile(): string {
  return process.env.PORTFOLIO_DATA_PATH
    ? path.resolve(process.env.PORTFOLIO_DATA_PATH)
    : path.join(process.cwd(), "data", "portfolio.json");
}

export async function readData(): Promise<PortfolioData> {
  const kv = kvClient();

  if (kv) {
    const cached = await kv.get<PortfolioData>(KV_KEY);
    if (cached) return cached;
    const seeded = createSeedData();
    await kv.set(KV_KEY, JSON.stringify(seeded));
    return seeded;
  }

  // 本地文件模式：按 mtime 缓存
  const file = dataFile();
  const stat = fs.statSync(file, { throwIfNoEntry: false });

  if (!stat) {
    const seeded = createSeedData();
    writeFileSync(seeded);
    return seeded;
  }

  const cached = globalForStore.__portfolioData;
  if (cached && cached.mtimeMs === stat.mtimeMs) return cached.data;

  const data = JSON.parse(fs.readFileSync(file, "utf8")) as PortfolioData;
  globalForStore.__portfolioData = { data, mtimeMs: stat.mtimeMs };
  return data;
}

function writeFileSync(data: PortfolioData): void {
  const file = dataFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });

  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, file);

  globalForStore.__portfolioData = { data, mtimeMs: fs.statSync(file).mtimeMs };
}

export async function writeData(data: PortfolioData): Promise<void> {
  const kv = kvClient();
  if (kv) {
    await kv.set(KV_KEY, JSON.stringify(data));
    return;
  }
  writeFileSync(data);
}

/** 读出副本、修改、再落盘，避免中途抛错时污染缓存。 */
export async function updateData(
  mutate: (data: PortfolioData) => void,
): Promise<PortfolioData> {
  const data = structuredClone(await readData());
  mutate(data);
  await writeData(data);
  return data;
}

export function nextId(records: { id: number }[]): number {
  return records.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

/** 调试用：当前数据层走的是 KV 还是本地文件。 */
export function storageMode(): "kv" | "file" {
  return useKv() ? "kv" : "file";
}
