import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * 单人口令登录：
 * 口令来自 ADMIN_PASSWORD，会话是 HMAC 签名后的 exp 时间戳，浏览器只持有签名结果。
 * 不建用户表、不引入第三方鉴权库。
 */

export const SESSION_COOKIE = "portfolio_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

function readConfig(): { password: string; secret: string } | null {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;
  if (!password || !secret) return null;
  return { password, secret };
}

export function isAuthConfigured(): boolean {
  return readConfig() !== null;
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = crypto.createHash("sha256").update(a).digest();
  const right = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(left, right);
}

export function verifyPassword(input: string): boolean {
  const config = readConfig();
  if (!config) return false;
  return safeEqual(input, config.password);
}

export function issueToken(): string | null {
  const config = readConfig();
  if (!config) return null;
  const expires = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expires}.${sign(expires, config.secret)}`;
}

function verifyToken(token: string | undefined): boolean {
  const config = readConfig();
  if (!config || !token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload, config.secret))) return false;

  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}
