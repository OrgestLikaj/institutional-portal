import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { interpolate } from "@/i18n/format";
import type { Dictionary } from "@/i18n/dictionaries";

/** Builds a compact page list: 1 … 4 5 6 … 12 */
function pageList(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

export function Pagination({
  page,
  totalPages,
  basePath,
  params,
  t,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params: Record<string, string | undefined>;
  t: Dictionary;
}) {
  if (totalPages <= 1) return null;

  const link = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && k !== "page" && sp.set(k, v));
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  };

  const cell = "flex h-11 min-w-11 items-center justify-center border px-3 text-[0.95rem] font-semibold transition-colors";

  return (
    <nav aria-label={t.a11y.pagination} className="mt-12 flex justify-center">
      <ul className="flex flex-wrap items-center gap-1.5">
        <li>
          {page > 1 ? (
            <Link href={link(page - 1)} className={`${cell} border-line text-navy-900 hover:border-navy-900`} aria-label={t.a11y.previous} rel="prev">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <span className={`${cell} border-line text-line`} aria-hidden="true">
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}
        </li>
        {pageList(page, totalPages).map((p, i) =>
          p === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-ink-muted">
              …
            </li>
          ) : (
            <li key={p}>
              {p === page ? (
                <span aria-current="page" aria-label={interpolate(t.a11y.currentPage, { n: p })} className={`${cell} border-navy-900 bg-navy-900 text-white`}>
                  {p}
                </span>
              ) : (
                <Link href={link(p)} aria-label={interpolate(t.a11y.page, { n: p })} className={`${cell} border-line text-navy-900 hover:border-navy-900`}>
                  {p}
                </Link>
              )}
            </li>
          ),
        )}
        <li>
          {page < totalPages ? (
            <Link href={link(page + 1)} className={`${cell} border-line text-navy-900 hover:border-navy-900`} aria-label={t.a11y.next} rel="next">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <span className={`${cell} border-line text-line`} aria-hidden="true">
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
