"use client";

/**
 * Browser-side listings used ONLY in static-export mode (GitHub Pages preview).
 * A static host cannot read query strings on the server, so the page ships the
 * full (small) demo dataset and these components filter, search and paginate
 * from the URL — with exactly the same rules as the server providers
 * (src/lib/cms/query.ts). In the normal server build these are not used.
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { Announcement, AnnouncementCategory, DocumentItem, ListQuery, NewsArticle, SearchResult, Term } from "@/lib/cms/types";
import { inDateRange, matchesText, paginate, parseListQuery } from "@/lib/cms/query";
import { useI18n } from "@/i18n/I18nProvider";
import { formatDate, interpolate } from "@/i18n/format";
import { FilterBar } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/States";
import { NewsCard, NewsFeature } from "@/components/cards/NewsCard";
import { AnnouncementRow } from "@/components/cards/AnnouncementRow";
import { DocumentRow } from "@/components/cards/DocumentRow";

function useUrlQuery(): { query: ListQuery; key: string } {
  const sp = useSearchParams();
  const record = Object.fromEntries(sp.entries());
  return { query: parseListQuery(record), key: sp.toString() };
}

const record = (q: ListQuery) => ({ q: q.q, category: q.category, from: q.from, to: q.to, year: q.year });

function Count({ total }: { total: number }) {
  const { t } = useI18n();
  return (
    <p className="mb-6 mt-8 text-sm text-ink-muted" role="status">
      {total === 1 ? t.common.result : interpolate(t.common.results, { count: total })}
    </p>
  );
}

/* ───────── News ───────── */
export function StaticNews({ items, categories, basePath }: { items: NewsArticle[]; categories: Term[]; basePath: string }) {
  const { locale, t } = useI18n();
  const { query, key } = useUrlQuery();
  const filtered = Boolean(query.q || query.category || query.from || query.to);
  const featured = !filtered && (query.page ?? 1) === 1 ? items.find((n) => n.featured) : undefined;

  const matches = items.filter(
    (n) => (!query.category || n.category.slug === query.category) && inDateRange(n.date, query.from, query.to) && matchesText(query.q, n.title, n.subtitle, n.excerpt),
  );
  const result = paginate(matches, { ...query, perPage: 9 });
  const shown = featured ? result.items.filter((n) => n.id !== featured.id) : result.items;

  return (
    <>
      {featured && (
        <section aria-label={t.news.featured} className="mb-14">
          <p className="eyebrow mb-5">{t.news.featured}</p>
          <NewsFeature article={featured} locale={locale} readMore={t.common.readMore} priority />
        </section>
      )}
      <FilterBar key={key} action={basePath} values={query} categories={categories.map((c) => ({ value: c.slug, label: c.name }))} dateRange />
      <Count total={result.total} />
      {shown.length ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((article) => (
            <li key={article.id}>
              <NewsCard article={article} locale={locale} readMore={t.common.readMore} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={t.states.emptyTitle} text={t.news.noResults} />
      )}
      <Pagination page={result.page} totalPages={result.totalPages} basePath={basePath} params={record(query)} t={t} />
    </>
  );
}

/* ───────── Announcements ───────── */
const ANNOUNCEMENT_CATEGORIES: AnnouncementCategory[] = ["official", "notice", "press", "update"];

export function StaticAnnouncements({ items, basePath }: { items: Announcement[]; basePath: string }) {
  const { locale, t } = useI18n();
  const { query, key } = useUrlQuery();
  const matches = items.filter(
    (a) => (!query.category || a.category === query.category) && inDateRange(a.date, query.from, query.to) && matchesText(query.q, a.title, a.excerpt),
  );
  const result = paginate(matches, { ...query, perPage: 10 });

  return (
    <>
      <nav aria-label={t.common.category} className="mb-8">
        <ul className="flex flex-wrap gap-2">
          {[undefined, ...ANNOUNCEMENT_CATEGORIES].map((value) => {
            const active = query.category === value || (!value && !query.category);
            return (
              <li key={value ?? "all"}>
                <Link
                  href={value ? `${basePath}?category=${value}` : basePath}
                  aria-current={active ? "page" : undefined}
                  className={`block border px-4 py-2 text-sm font-semibold transition-colors ${
                    active ? "border-brand-900 bg-brand-900 text-white" : "border-line bg-white text-brand-900 hover:border-brand-900"
                  }`}
                >
                  {value ? t.announcements.categories[value] : t.common.allCategories}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <FilterBar key={key} action={basePath} values={query} hiddenCategory categories={[]} dateRange />
      <Count total={result.total} />
      {result.items.length ? (
        <ul className="grid gap-4 lg:grid-cols-2">
          {result.items.map((a) => (
            <li key={a.id}>
              <AnnouncementRow item={a} locale={locale} t={t} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={t.states.emptyTitle} text={t.announcements.noResults} />
      )}
      <Pagination page={result.page} totalPages={result.totalPages} basePath={basePath} params={record(query)} t={t} />
    </>
  );
}

/* ───────── Documents (legal, reports, publications, transparency) ───────── */
export function StaticDocuments({
  items,
  categories,
  years,
  basePath,
  emptyText,
  fixedCategory,
}: {
  items: DocumentItem[];
  categories: Term[];
  years: string[];
  basePath: string;
  emptyText: string;
  fixedCategory?: string;
}) {
  const { locale, t } = useI18n();
  const { query, key } = useUrlQuery();
  const category = fixedCategory ?? query.category;
  const matches = items.filter(
    (d) =>
      (!category || d.category.slug === category) &&
      (!query.year || d.date.startsWith(query.year)) &&
      matchesText(query.q, d.title, d.description, d.reference),
  );
  const result = paginate(matches, { ...query, perPage: 10 });

  const tabLink = (slug?: string) => {
    const sp = new URLSearchParams();
    if (slug) sp.set("category", slug);
    if (query.q) sp.set("q", query.q);
    if (query.year) sp.set("year", query.year);
    const qs = sp.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      {!fixedCategory && (
        <nav aria-label={t.common.category} className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ul className="flex min-w-max border-b border-line">
            {[{ slug: undefined as string | undefined, name: t.legal.all }, ...categories].map((c) => {
              const active = query.category === c.slug;
              return (
                <li key={c.slug ?? "all"}>
                  <Link
                    href={tabLink(c.slug)}
                    aria-current={active ? "page" : undefined}
                    className={`relative block px-4 py-3.5 text-[0.95rem] font-semibold transition-colors after:absolute after:inset-x-4 after:-bottom-px after:h-[3px] ${
                      active ? "text-brand-900 after:bg-gold-500" : "text-ink-muted after:bg-transparent hover:text-brand-900"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
      <FilterBar key={key} action={basePath} values={{ q: query.q, category: query.category, year: query.year }} hiddenCategory={!fixedCategory} years={years} />
      <p className="mb-2 mt-8 text-sm text-ink-muted" role="status">
        {result.total === 1 ? t.common.result : interpolate(t.common.results, { count: result.total })}
      </p>
      {result.items.length ? (
        result.items.map((doc) => <DocumentRow key={doc.id} doc={doc} locale={locale} t={t} showCategory={!fixedCategory} />)
      ) : (
        <EmptyState title={t.states.emptyTitle} text={emptyText} />
      )}
      <Pagination page={result.page} totalPages={result.totalPages} basePath={basePath} params={record({ ...query, category: fixedCategory ? undefined : query.category })} t={t} />
    </div>
  );
}

/* ───────── Search ───────── */
const ORDER: SearchResult["type"][] = ["pages", "news", "announcements", "documents", "vacancies"];

export function StaticSearch({ index, basePath }: { index: SearchResult[]; basePath: string }) {
  const { locale, t } = useI18n();
  const sp = useSearchParams();
  const q = (sp.get("q") ?? "").trim().slice(0, 120);
  const type = sp.get("type") as SearchResult["type"] | null;

  if (q.length < 2) return <EmptyState title={t.search.title} text={t.search.prompt} />;
  const results = index.filter((r) => matchesText(q, r.title, r.excerpt, r.meta));
  if (!results.length) return <EmptyState title={t.states.emptyTitle} text={interpolate(t.search.noResults, { q })} />;
  const shown = type && ORDER.includes(type) ? results.filter((r) => r.type === type) : results;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <h2 className="mb-1 font-display text-[1.3rem] font-semibold">{interpolate(t.search.resultsFor, { q })}</h2>
        <p className="mb-6 text-sm text-ink-muted" role="status">
          {results.length === 1 ? t.common.result : interpolate(t.common.results, { count: results.length })}
        </p>
        <ul className="border border-line">
          {[null, ...ORDER].map((k) => {
            const count = k ? results.filter((r) => r.type === k).length : results.length;
            if (k && !count) return null;
            const active = type === k || (!k && !type);
            return (
              <li key={k ?? "all"} className="border-b border-line last:border-b-0">
                <Link
                  href={`${basePath}?q=${encodeURIComponent(q)}${k ? `&type=${k}` : ""}`}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between border-l-[3px] px-4 py-3 text-[0.95rem] font-semibold ${
                    active ? "border-gold-500 bg-brand-900 text-white" : "border-transparent text-brand-900 hover:bg-paper"
                  }`}
                >
                  {k ? t.search.groups[k] : t.common.allCategories}
                  <span className={`text-xs font-normal ${active ? "text-white/70" : "text-ink-muted"}`}>{count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
      <ol className="lg:col-span-9">
        {shown.map((r, i) => (
          <li key={`${r.type}-${r.href}-${i}`} className="group relative border-b border-line py-6 first:pt-0">
            <p className="flex flex-wrap items-center gap-x-3 text-[0.78rem] text-ink-muted">
              <span className="tag">{t.search.groups[r.type]}</span>
              {r.meta && <span>{r.meta}</span>}
              {r.date && <time dateTime={r.date}>{formatDate(r.date, locale)}</time>}
            </p>
            <h3 className="mt-1.5 font-display text-[1.2rem] font-semibold text-brand-900">
              <Link href={r.href} className="after:absolute after:inset-0 group-hover:text-brand-600 group-hover:underline">
                {r.title}
              </Link>
            </h3>
            <p className="mt-1.5 text-ink-muted">{r.excerpt}</p>
            <ArrowRight className="absolute right-0 top-8 hidden h-5 w-5 text-line group-hover:text-brand-600 sm:block" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </div>
  );
}
