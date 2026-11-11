import type { Metadata } from "next";
import { isStaticExport } from "@/lib/env";
import { Suspense } from "react";
import { href } from "@/i18n/config";
import { parseListQuery } from "@/lib/cms/query";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { DocumentListing } from "@/components/DocumentListing";
import { ListSkeleton } from "@/components/ui/ListSkeleton";

export async function generateMetadata({ params }: PageProps<"/[locale]/activities/reports">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.activities.reportsTitle, description: t.activities.reportsLead, path: "/activities/reports" });
}

export default async function ReportsPage({ params, searchParams }: PageProps<"/[locale]/activities/reports">) {
  const { locale, t } = await pageContext(params);
  const query = isStaticExport ? {} : parseListQuery(await searchParams);

  return (
    <>
      <PageHero
        title={t.activities.reportsTitle}
        lead={t.activities.reportsLead}
        eyebrow={t.nav.activities}
        breadcrumbs={crumbs(locale, t, { label: t.nav.activities, href: href(locale, "/activities") }, { label: t.activities.reportsTitle })}
        breadcrumbLabel={t.a11y.breadcrumb}
      />
      <div className="container-inst py-14 lg:py-16">
        <Suspense key={JSON.stringify(query)} fallback={<ListSkeleton />}>
          <DocumentListing locale={locale} t={t} section="report" query={query} basePath={href(locale, "/activities/reports")} emptyText={t.legal.noResults} />
        </Suspense>
      </div>
    </>
  );
}
