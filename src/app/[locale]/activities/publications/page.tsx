import type { Metadata } from "next";
import { Suspense } from "react";
import { href } from "@/i18n/config";
import { parseListQuery } from "@/lib/cms/query";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { DocumentListing } from "@/components/DocumentListing";
import { ListSkeleton } from "@/components/ui/ListSkeleton";

export async function generateMetadata({ params }: PageProps<"/[locale]/activities/publications">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.activities.publicationsTitle, description: t.activities.publicationsLead, path: "/activities/publications" });
}

export default async function PublicationsPage({ params, searchParams }: PageProps<"/[locale]/activities/publications">) {
  const { locale, t } = await pageContext(params);
  const query = parseListQuery(await searchParams);

  return (
    <>
      <PageHero
        title={t.activities.publicationsTitle}
        lead={t.activities.publicationsLead}
        eyebrow={t.nav.activities}
        breadcrumbs={crumbs(locale, t, { label: t.nav.activities, href: href(locale, "/activities") }, { label: t.activities.publicationsTitle })}
        breadcrumbLabel={t.a11y.breadcrumb}
      />
      <div className="container-inst py-14 lg:py-16">
        <Suspense key={JSON.stringify(query)} fallback={<ListSkeleton />}>
          <DocumentListing locale={locale} t={t} section="publication" query={query} basePath={href(locale, "/activities/publications")} emptyText={t.legal.noResults} />
        </Suspense>
      </div>
    </>
  );
}
