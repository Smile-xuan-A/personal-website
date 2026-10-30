"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  isAuthConfigured,
  issueToken,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  verifyPassword,
} from "@/lib/auth";
import type { ActionResult } from "@/lib/types";

/** 简单的失败次数限制，避免公网部署后被暴力猜口令。进程重启后清零。 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; startedAt: number }>();

function isLocked(key: string): boolean {
  const record = attempts.get(key);
  if (!record) return false;
  if (Date.now() - record.startedAt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string): void {
  const record = attempts.get(key);
  if (!record || Date.now() - record.startedAt > WINDOW_MS) {
    attempts.set(key, { count: 1, startedAt: Date.now() });
    return;
  }
  record.count += 1;
}

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!isAuthConfigured()) {
    return { ok: false, error: "服务器未配置 ADMIN_PASSWORD / AUTH_SECRET，无法登录" };
  }

  const password = String(formData.get("password") ?? "");
  const rawNext = String(formData.get("next") ?? "");
  const next = rawNext.startsWith("/admin") ? rawNext : "/admin";

  if (!password) return { ok: false, error: "请输入访问口令" };

  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isLocked(ip)) {
    return { ok: false, error: "尝试次数过多，请 10 分钟后再试" };
  }

  if (!verifyPassword(password)) {
    recordFailure(ip);
    return { ok: false, error: "口令不正确" };
  }

  const token = issueToken();
  if (!token) return { ok: false, error: "服务器未配置 AUTH_SECRET，无法登录" };

  attempts.delete(ip);
  (await cookies()).set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  redirect(next);
}
