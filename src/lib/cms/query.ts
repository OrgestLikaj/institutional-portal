import type { ListQuery, Paginated } from "./types";

export const DEFAULT_PER_PAGE = 9;

/** Normalise free text for accent-insensitive matching (ë → e, ç → c). */
export function normalize(text: string): string {
  return text
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

export function matchesText(q: string | undefined, ...fields: (string | undefined)[]): boolean {
  if (!q) return true;
  const needle = normalize(q);
  if (!needle) return true;
  const hay = normalize(fields.filter(Boolean).join(" "));
  return needle.split(/\s+/).every((word) => hay.includes(word));
}

export function inDateRange(iso: string, from?: string, to?: string): boolean {
  const day = iso.slice(0, 10);
  if (from && day < from) return false;
  if (to && day > to) return false;
  return true;
}

export function paginate<T>(items: T[], query: ListQuery = {}): Paginated<T> {
  const perPage = Math.max(1, query.perPage ?? DEFAULT_PER_PAGE);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, query.page ?? 1), totalPages);
  return {
    items: items.slice((page - 1) * perPage, page * perPage),
    total,
    page,
    perPage,
    totalPages,
  };
}

export function byDateDesc<T extends { date: string }>(a: T, b: T): number {
  return b.date.localeCompare(a.date);
}

/** Parse Next.js searchParams into a typed ListQuery. */
export function parseListQuery(sp: Record<string, string | string[] | undefined>): ListQuery {
  const pick = (k: string) => {
    const v = sp[k];
    const s = Array.isArray(v) ? v[0] : v;
    return s && s.trim() ? s.trim().slice(0, 120) : undefined;
  };
  const isDate = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined);
  const page = Number.parseInt(pick("page") ?? "1", 10);
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    q: pick("q"),
    category: pick("category"),
    from: isDate(pick("from")),
    to: isDate(pick("to")),
    year: pick("year")?.match(/^\d{4}$/) ? pick("year") : undefined,
  };
}
