/**
 * Build-mode flags (safe for client and server).
 *
 * NEXT_PUBLIC_STATIC_EXPORT=true builds a fully static site (GitHub Pages preview):
 * no proxy, no API routes, and list filtering/search run in the browser.
 * NEXT_PUBLIC_BASE_PATH is the sub-path the site is served from (e.g. "/institutional-portal").
 */
export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** Prefix a public asset path (/images/…, /documents/…) with the base path. Leaves absolute URLs alone. */
export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || !path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
