import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand revalidation webhook for WordPress.
 * WordPress calls POST /api/revalidate with header `x-revalidate-secret`
 * and JSON body { "tags": ["news"] } after content is published or updated
 * (see wordpress/mu-plugins/institution-content-model.php).
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { tags?: unknown };
  const tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => typeof t === "string" && /^[\w-]{1,64}$/.test(t)) : [];
  const targets = tags.length ? tags : ["wordpress"];
  targets.forEach((tag) => revalidateTag(tag, "max"));
  return NextResponse.json({ ok: true, revalidated: targets });
}
