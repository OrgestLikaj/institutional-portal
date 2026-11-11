export const locales = ["sq", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "sq";

export const localeMeta: Record<Locale, { label: string; short: string; htmlLang: string; intl: string; og: string }> = {
  sq: { label: "Shqip", short: "SQ", htmlLang: "sq", intl: "sq-AL", og: "sq_AL" },
  en: { label: "English", short: "EN", htmlLang: "en", intl: "en-GB", og: "en_GB" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** A string available in every supported locale. */
export type Localized<T = string> = Record<Locale, T>;

/** Build a locale-prefixed internal path: href("sq", "/news") -> "/sq/news". */
export function href(locale: Locale, path = "/"): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}
