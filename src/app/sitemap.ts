import type { MetadataRoute } from "next";
import { cms } from "@/lib/cms";
import { locales } from "@/i18n/config";
import { SITE_URL } from "@/lib/seo";

const STATIC_ROUTES = [
  "",
  "/about",
  "/about/structure",
  "/about/leadership",
  "/activities",
  "/activities/reports",
  "/activities/publications",
  "/news",
  "/announcements",
  "/legal",
  "/transparency",
  "/careers",
  "/contact",
  "/privacy",
  "/accessibility",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const url = (locale: string, path: string) => SITE_URL + "/" + locale + path;
  const alternates = (path: string) => ({ languages: Object.fromEntries(locales.map((l) => [l, url(l, path)])) });
  const add = (path: string, extra: Partial<MetadataRoute.Sitemap[number]> = {}) =>
    entries.push({ url: url("sq", path), alternates: alternates(path), ...extra });

  STATIC_ROUTES.forEach((route) => add(route, { changeFrequency: route === "" ? "daily" : "weekly", priority: route === "" ? 1 : 0.7 }));

  const [news, announcements, vacancies, transparency] = await Promise.all([
    cms.getNews("sq", { perPage: 500 }),
    cms.getAnnouncements("sq", { perPage: 500 }),
    cms.getVacancies("sq"),
    cms.getTransparencyCategories("sq"),
  ]);
  news.items.forEach((n) => add("/news/" + n.slug, { lastModified: n.date, priority: 0.6 }));
  announcements.items.forEach((a) => add("/announcements/" + a.slug, { lastModified: a.date, priority: 0.5 }));
  vacancies.forEach((v) => add("/careers/" + v.slug, { lastModified: v.published, priority: 0.5 }));
  transparency.forEach((c) => add("/transparency/" + c.slug, { priority: 0.6 }));

  return entries;
}
