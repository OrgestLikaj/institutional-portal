import { notFound } from "next/navigation";
import { href, isLocale, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import type { ListQuery } from "@/lib/cms/types";
import type { Crumb } from "@/components/ui/Breadcrumbs";

/** Resolve and validate the [locale] segment for a page. */
export async function pageContext(params: Promise<{ locale: string }>): Promise<{ locale: Locale; t: Dictionary }> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { locale, t: getDictionary(locale) };
}

/** Breadcrumb trail starting at Home. */
export function crumbs(locale: Locale, t: Dictionary, ...rest: Crumb[]): Crumb[] {
  return [{ label: t.a11y.home, href: href(locale) }, ...rest];
}

/** ListQuery → plain string record (for pagination links). */
export function queryRecord(query: ListQuery): Record<string, string | undefined> {
  return {
    q: query.q,
    category: query.category,
    from: query.from,
    to: query.to,
    year: query.year,
  };
}
