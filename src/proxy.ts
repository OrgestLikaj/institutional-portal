import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * Locale routing: any path without a locale prefix is redirected to the
 * visitor's last chosen language (cookie) or to Albanian, the primary language.
 */
function preferredLocale(request: NextRequest): string {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && (locales as readonly string[]).includes(cookie)) return cookie;
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) {
    const res = NextResponse.next();
    const current = pathname.split("/")[1];
    if (request.cookies.get("NEXT_LOCALE")?.value !== current) {
      res.cookies.set("NEXT_LOCALE", current, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
    }
    return res;
  }
  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // skip Next internals, API routes and any file with an extension (images, pdf, robots.txt, sitemap.xml…)
  matcher: ["/((?!_next|api|.*\..*).*)"],
};
