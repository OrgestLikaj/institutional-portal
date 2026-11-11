import type { Metadata } from "next";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { institution } from "@/config/institution";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Consistent metadata for every page: title, description, canonical,
 * hreflang alternates and Open Graph / Twitter cards.
 * `path` is the locale-less route, e.g. "/news/my-article".
 */
export function buildMetadata({
  locale,
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
}: {
  locale: Locale;
  title?: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const clean = path === "/" ? "" : path;
  const url = `/${locale}${clean}`;
  const siteName = institution.name[locale];
  const languages = Object.fromEntries(locales.map((l) => [localeMeta[l].htmlLang, `/${l}${clean}`]));
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url, languages: { ...languages, "x-default": `/sq${clean}` } },
    openGraph: {
      type,
      url,
      siteName,
      title: title ?? siteName,
      description,
      locale: localeMeta[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].og),
      ...(image ? { images: [{ url: image }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: title ?? siteName, description },
  };
}
