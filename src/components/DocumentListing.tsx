import Link from "next/link";
import { StaticDocuments } from "@/components/static/StaticListings";
import { isStaticExport } from "@/lib/env";
import { cms } from "@/lib/cms";
import type { DocumentSection, ListQuery } from "@/lib/cms/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { interpolate } from "@/i18n/format";
import { queryRecord } from "@/lib/page";
import { FilterBar } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/States";
import { DocumentRow } from "@/components/cards/DocumentRow";

/**
 * Filterable, paginated list of official documents for one section.
 * Category navigation is rendered as tabs (links), text + year as a GET form.
 */
export async function DocumentListing({
  locale,
  t,
  section,
  query,
  basePath,
  emptyText,
  tabs = true,
  fixedCategory,
}: {
  locale: Locale;
  t: Dictionary;
  section: DocumentSection;
  query: ListQuery;
  basePath: string;
  emptyText: string;
  tabs?: boolean;
  /** When the category is part of the route (transparency/[category]) */
  fixedCategory?: string;
}) {
  if (isStaticExport) {
    const [all, cats, yrs] = await Promise.all([
      cms.getDocuments(locale, { section, perPage: 1000 }),
      cms.getDocumentCategories(locale, section),
      cms.getDocumentYears(locale, section),
    ]);
    return <StaticDocuments items={all.items} categories={cats} years={yrs} basePath={basePath} emptyText={emptyText} fixedCategory={fixedCategory} />;
  }

  const effective = { ...query, category: fixedCategory ?? query.category };
  const [result, categories, years] = await Promise.all([
    cms.getDocuments(locale, { section, ...effective }),
    cms.getDocumentCategories(locale, section),
    cms.getDocumentYears(locale, section),
  ]);

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
      {tabs && !fixedCategory && (
        <nav aria-label={t.common.category} className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ul className="flex min-w-max border-b border-line">
            {[{ slug: undefined, name: t.legal.all }, ...categories].map((c) => {
              const active = (query.category ?? undefined) === c.slug;
              return (
                <li key={c.slug ?? "all"}>
                  <Link
                    href={tabLink(c.slug)}
                    aria-current={active ? "page" : undefined}
                    className={`relative block px-4 py-3.5 text-[0.95rem] font-semibold transition-colors after:absolute after:inset-x-4 after:-bottom-px after:h-[3px] ${
                      active ? "text-navy-900 after:bg-gold-500" : "text-ink-muted hover:text-navy-900 after:bg-transparent"
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

      <FilterBar
        action={basePath}
        values={{ q: query.q, category: query.category, year: query.year }}
        categories={tabs || fixedCategory ? undefined : categories.map((c) => ({ value: c.slug, label: c.name }))}
        hiddenCategory={tabs && !fixedCategory}
        years={years}
      />

      <p className="mb-2 mt-8 text-sm text-ink-muted" role="status">
        {result.total === 1 ? t.common.result : interpolate(t.common.results, { count: result.total })}
      </p>

      {result.items.length ? (
        <div>
          {result.items.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} locale={locale} t={t} showCategory={!fixedCategory} />
          ))}
        </div>
      ) : (
        <EmptyState title={t.states.emptyTitle} text={emptyText} />
      )}

      <Pagination page={result.page} totalPages={result.totalPages} basePath={basePath} params={queryRecord({ ...query, category: fixedCategory ? undefined : query.category })} t={t} />
    </div>
  );
}
