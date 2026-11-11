import { localeMeta, type Locale } from "./config";

export function formatDate(iso: string, locale: Locale, style: "long" | "short" = "long"): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(localeMeta[locale].intl, {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
    timeZone: "Europe/Tirane",
  }).format(date);
}

export function dateParts(iso: string, locale: Locale) {
  const date = new Date(iso);
  const opts = { timeZone: "Europe/Tirane" } as const;
  return {
    day: new Intl.DateTimeFormat(localeMeta[locale].intl, { ...opts, day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat(localeMeta[locale].intl, { ...opts, month: "short" }).format(date).replace(".", ""),
    year: new Intl.DateTimeFormat(localeMeta[locale].intl, { ...opts, year: "numeric" }).format(date),
  };
}

/** Replace {placeholders} in a dictionary string. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => (key in values ? String(values[key]) : `{${key}}`));
}
