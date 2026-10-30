import { getAvatarImage } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** 输出后台上传的头像；URL 带 ?v=<更新时间>，因此可以长期缓存。 */
export async function GET() {
  const image = await getAvatarImage();
  if (!image) return new Response("Not Found", { status: 404 });

  const body = new Uint8Array(image.bytes);

  return new Response(body, {
    headers: {
      "Content-Type": image.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
