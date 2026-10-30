"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAuthenticated, SESSION_COOKIE } from "@/lib/auth";
import {
  clearAvatarImage,
  removePost,
  removeProject,
  removeSkill,
  saveAvatarImage,
  savePost,
  saveProfile,
  saveProject,
  saveSkill,
} from "@/lib/mutations";
import type { ActionResult } from "@/lib/types";

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function number(formData: FormData, key: string, fallback = 0): number {
  const value = Number(text(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function checked(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

const UNAUTHORIZED: ActionResult = {
  ok: false,
  error: "登录状态已失效，请重新登录后再保存",
};

/** Server Action 可以绕过布局被直接调用，因此每个写操作都必须自行校验会话。 */
async function guard(): Promise<ActionResult | null> {
  return (await isAuthenticated()) ? null : UNAUTHORIZED;
}

async function guardOrRedirect(path: string): Promise<void> {
  if (!(await isAuthenticated())) redirect(path);
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/projects");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/skills");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/posts");
}

export async function saveProfileAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const result = await saveProfile({
    name: text(formData, "name"),
    title: text(formData, "title"),
    tagline: text(formData, "tagline"),
    bio: text(formData, "bio"),
    avatar: text(formData, "avatar"),
    location: text(formData, "location"),
    email: text(formData, "email"),
    wechat: text(formData, "wechat"),
    qq: text(formData, "qq"),
    phone: text(formData, "phone"),
    available: checked(formData, "available"),
  });

  if (result.ok) revalidateAll();
  return result;
}

export async function uploadAvatarAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const file = formData.get("avatarFile");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "请选择一张图片" };
  }

  const result = await saveAvatarImage({
    bytes: new Uint8Array(await file.arrayBuffer()),
    mime: file.type,
  });

  if (result.ok) revalidateAll();
  return result;
}

export async function clearAvatarAction(): Promise<void> {
  await guardOrRedirect("/login");
  await clearAvatarImage();
  revalidateAll();
}

export async function saveSkillAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const id = number(formData, "id");

  const result = await saveSkill(
    {
      name: text(formData, "name"),
      category: text(formData, "category"),
      level: number(formData, "level", 60),
      sortOrder: number(formData, "sortOrder", 0),
    },
    id || undefined,
  );

  if (result.ok) revalidateAll();
  return result;
}

export async function saveProjectAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const id = number(formData, "id");

  const result = await saveProject(
    {
      title: text(formData, "title"),
      summary: text(formData, "summary"),
      description: text(formData, "description"),
      tech: text(formData, "tech"),
      cover: text(formData, "cover"),
      repoUrl: text(formData, "repoUrl"),
      demoUrl: text(formData, "demoUrl"),
      year: text(formData, "year"),
      featured: checked(formData, "featured"),
      sortOrder: number(formData, "sortOrder", 0),
    },
    id || undefined,
  );

  if (result.ok) revalidateAll();
  return result;
}

export async function savePostAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const id = number(formData, "id");

  const result = await savePost(
    {
      title: text(formData, "title"),
      slug: text(formData, "slug"),
      excerpt: text(formData, "excerpt"),
      content: String(formData.get("content") ?? ""),
      tags: text(formData, "tags"),
      published: checked(formData, "published"),
    },
    id || undefined,
  );

  if (result.ok) revalidateAll();
  return result;
}

export async function deleteSkillAction(formData: FormData): Promise<void> {
  await guardOrRedirect("/admin/skills");
  const id = number(formData, "id");
  if (id) await removeSkill(id);
  revalidateAll();
  redirect("/admin/skills");
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  await guardOrRedirect("/admin/projects");
  const id = number(formData, "id");
  if (id) await removeProject(id);
  revalidateAll();
  redirect("/admin/projects");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await guardOrRedirect("/admin/posts");
  const id = number(formData, "id");
  if (id) await removePost(id);
  revalidateAll();
  redirect("/admin/posts");
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}