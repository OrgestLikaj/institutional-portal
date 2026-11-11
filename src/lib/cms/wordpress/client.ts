import "server-only";
import type { Locale } from "@/i18n/config";

/**
 * Minimal server-side WordPress REST client.
 * Credentials are read from server-only env vars and never reach the browser.
 */

export class CmsError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "CmsError";
  }
}

const API = process.env.WORDPRESS_API_URL?.replace(/\/$/, ""); // e.g. https://cms.example.al/wp-json
const LANG_PARAM = process.env.WORDPRESS_LANG_PARAM || "lang"; // Polylang: "lang", WPML: "wpml_language"
const REVALIDATE = Number(process.env.WORDPRESS_REVALIDATE_SECONDS ?? 300);

function authHeader(): Record<string, string> {
  const user = process.env.WORDPRESS_USERNAME;
  const pass = process.env.WORDPRESS_APP_PASSWORD;
  if (!user || !pass) return {};
  return { Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}` };
}

export type WpResponse<T> = { data: T; total: number; totalPages: number };

export async function wpFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  options: { locale?: Locale; tags?: string[] } = {},
): Promise<WpResponse<T>> {
  if (!API) throw new CmsError("WORDPRESS_API_URL is not configured");

  const url = new URL(`${API}${path.startsWith("/") ? path : `/${path}`}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  if (options.locale) url.searchParams.set(LANG_PARAM, options.locale);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json", ...authHeader() },
      next: { revalidate: REVALIDATE, tags: ["wordpress", ...(options.tags ?? [])] },
    });
  } catch (err) {
    throw new CmsError(`WordPress request failed: ${(err as Error).message}`);
  }

  // WordPress answers 400 for a page number beyond the last page
  if (res.status === 400 && url.searchParams.has("page")) {
    return { data: [] as unknown as T, total: 0, totalPages: 1 };
  }
  if (!res.ok) throw new CmsError(`WordPress responded ${res.status} for ${url.pathname}`, res.status);

  return {
    data: (await res.json()) as T,
    total: Number(res.headers.get("X-WP-Total") ?? 0),
    totalPages: Number(res.headers.get("X-WP-TotalPages") ?? 1),
  };
}
