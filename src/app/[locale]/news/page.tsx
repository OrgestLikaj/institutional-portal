import type { Metadata } from "next";
import { StaticNews } from "@/components/static/StaticListings";
import { isStaticExport } from "@/lib/env";
import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ListQuery } from "@/lib/cms/types";
import { ListSkeleton } from "@/components/ui/ListSkeleton";
import { cms } from "@/lib/cms";
import { href } from "@/i18n/config";
import { interpolate } from "@/i18n/format";
import { parseListQuery } from "@/lib/cms/query";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext, queryRecord } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { FilterBar } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/States";
import { NewsCard, NewsFeature } from "@/components/cards/NewsCard";

export async function generateMetadata({ params }: PageProps<"/[locale]/news">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.news.title, description: t.news.lead, path: "/news" });
}

export default async function NewsPage({ params, searchParams }: PageProps<"/[locale]/news">) {
  const { locale, t } = await pageContext(params);

  if (isStaticExport) {
    const [categories, all] = await Promise.all([cms.getNewsCategories(locale), cms.getNews(locale, { perPage: 1000 })]);
    return (
      <>
        <PageHero title={t.news.title} lead={t.news.lead} eyebrow={t.nav.newsMedia} breadcrumbs={crumbs(locale, t, { label: t.nav.newsMedia })} breadcrumbLabel={t.a11y.breadcrumb} />
        <div className="container-inst py-14 lg:py-16">
          <Suspense fallback={<ListSkeleton variant="cards" />}>
            <StaticNews items={all.items} categories={categories} basePath={href(locale, "/news")} />
          </Suspense>
        </div>
      </>
    );
  }

  const query = parseListQuery(await searchParams);
  const filtered = Boolean(query.q || query.category || query.from || query.to);
  const showFeatured = !filtered && (query.page ?? 1) === 1;

  const [categories, featuredRes] = await Promise.all([
    cms.getNewsCategories(locale),
    showFeatured ? cms.getNews(locale, { perPage: 20 }) : Promise.resolve(null),
  ]);
  const featured = featuredRes?.items.find((n) => n.featured);

  return (
    <>
      <PageHero
        title={t.news.title}
        lead={t.news.lead}
        eyebrow={t.nav.newsMedia}
        breadcrumbs={crumbs(locale, t, { label: t.nav.newsMedia })}
        breadcrumbLabel={t.a11y.breadcrumb}
      />

      <div className="container-inst py-14 lg:py-16">
        {featured && (
          <section aria-label={t.news.featured} className="mb-14">
            <p className="eyebrow mb-5">{t.news.featured}</p>
            <NewsFeature article={featured} locale={locale} readMore={t.common.readMore} priority />
          </section>
        )}

        <FilterBar
          action={href(locale, "/news")}
          values={query}
          categories={categories.map((c) => ({ value: c.slug, label: c.name }))}
          dateRange
        />

        <Suspense key={JSON.stringify(query)} fallback={<ListSkeleton variant="cards" />}>
          <NewsResults locale={locale} t={t} query={query} excludeId={featured?.id} />
        </Suspense>
      </div>
    </>
  );
}

/** Query-dependent part of the page, streamed behind a skeleton. */
async function NewsResults({ locale, t, query, excludeId }: { locale: Locale; t: Dictionary; query: ListQuery; excludeId?: string }) {
  const result = await cms.getNews(locale, { ...query, perPage: 9 });
  // the featured article is lifted out of the grid on the first, unfiltered page
  const items = excludeId ? result.items.filter((n) => n.id !== excludeId) : result.items;
  return (
    <>
      <p className="mb-6 mt-8 text-sm text-ink-muted" role="status">
        {result.total === 1 ? t.common.result : interpolate(t.common.results, { count: result.total })}
      </p>

      {items.length ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <li key={article.id}>
            <NewsCard article={article} locale={locale} readMore={t.common.readMore} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={t.states.emptyTitle} text={t.news.noResults} />
      )}

      <Pagination page={result.page} totalPages={result.totalPages} basePath={href(locale, "/news")} params={queryRecord(query)} t={t} />
    </>
  );
}
