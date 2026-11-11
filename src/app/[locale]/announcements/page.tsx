import type { Metadata } from "next";
import { StaticAnnouncements } from "@/components/static/StaticListings";
import { isStaticExport } from "@/lib/env";
import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ListQuery } from "@/lib/cms/types";
import { ListSkeleton } from "@/components/ui/ListSkeleton";
import Link from "next/link";
import { cms } from "@/lib/cms";
import type { AnnouncementCategory } from "@/lib/cms/types";
import { href } from "@/i18n/config";
import { interpolate } from "@/i18n/format";
import { parseListQuery } from "@/lib/cms/query";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext, queryRecord } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { FilterBar } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/States";
import { AnnouncementRow } from "@/components/cards/AnnouncementRow";

const CATEGORIES: AnnouncementCategory[] = ["official", "notice", "press", "update"];

export async function generateMetadata({ params }: PageProps<"/[locale]/announcements">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.announcements.title, description: t.announcements.lead, path: "/announcements" });
}

export default async function AnnouncementsPage({ params, searchParams }: PageProps<"/[locale]/announcements">) {
  const { locale, t } = await pageContext(params);
  const base = href(locale, "/announcements");

  if (isStaticExport) {
    const all = await cms.getAnnouncements(locale, { perPage: 1000 });
    return (
      <>
        <PageHero
          title={t.announcements.title}
          lead={t.announcements.lead}
          eyebrow={t.nav.newsMedia}
          breadcrumbs={crumbs(locale, t, { label: t.nav.newsMedia, href: href(locale, "/news") }, { label: t.announcements.title })}
          breadcrumbLabel={t.a11y.breadcrumb}
        />
        <div className="container-inst py-14 lg:py-16">
          <Suspense fallback={<ListSkeleton />}>
            <StaticAnnouncements items={all.items} basePath={base} />
          </Suspense>
        </div>
      </>
    );
  }

  const query = parseListQuery(await searchParams);

  const chip = (value?: AnnouncementCategory) => {
    const active = query.category === value || (!value && !query.category);
    const sp = new URLSearchParams();
    if (value) sp.set("category", value);
    return (
      <Link
        href={`${base}${sp.toString() ? `?${sp}` : ""}`}
        aria-current={active ? "page" : undefined}
        className={`border px-4 py-2 text-sm font-semibold transition-colors ${
          active ? "border-navy-900 bg-navy-900 text-white" : "border-line bg-white text-navy-900 hover:border-navy-900"
        }`}
      >
        {value ? t.announcements.categories[value] : t.common.allCategories}
      </Link>
    );
  };

  return (
    <>
      <PageHero
        title={query.category === "press" ? t.nav.pressReleases : t.announcements.title}
        lead={t.announcements.lead}
        eyebrow={t.nav.newsMedia}
        breadcrumbs={crumbs(locale, t, { label: t.nav.newsMedia, href: href(locale, "/news") }, { label: t.announcements.title })}
        breadcrumbLabel={t.a11y.breadcrumb}
      />

      <div className="container-inst py-14 lg:py-16">
        <nav aria-label={t.common.category} className="mb-8">
          <ul className="flex flex-wrap gap-2">
            <li>{chip()}</li>
            {CATEGORIES.map((c) => (
              <li key={c}>{chip(c)}</li>
            ))}
          </ul>
        </nav>

        <FilterBar action={base} values={query} hiddenCategory categories={[]} dateRange />

        <Suspense key={JSON.stringify(query)} fallback={<ListSkeleton />}>
          <AnnouncementResults locale={locale} t={t} query={query} base={base} />
        </Suspense>
      </div>
    </>
  );
}

async function AnnouncementResults({ locale, t, query, base }: { locale: Locale; t: Dictionary; query: ListQuery; base: string }) {
  const result = await cms.getAnnouncements(locale, query);
  return (
    <>
      <p className="mb-6 mt-8 text-sm text-ink-muted" role="status">
        {result.total === 1 ? t.common.result : interpolate(t.common.results, { count: result.total })}
      </p>

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

      <Pagination page={result.page} totalPages={result.totalPages} basePath={base} params={queryRecord(query)} t={t} />
    </>
  );
}
