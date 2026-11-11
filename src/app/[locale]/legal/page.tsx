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

export async function generateMetadata({ params }: PageProps<"/[locale]/legal">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.legal.title, description: t.legal.lead, path: "/legal" });
}

export default async function LegalPage({ params, searchParams }: PageProps<"/[locale]/legal">) {
  const { locale, t } = await pageContext(params);
  const query = isStaticExport ? {} : parseListQuery(await searchParams);

  return (
    <>
      <PageHero
        title={t.legal.title}
        lead={t.legal.lead}
        eyebrow={t.nav.legal}
        breadcrumbs={crumbs(locale, t, { label: t.legal.title })}
        breadcrumbLabel={t.a11y.breadcrumb}
      />
      <div className="container-inst py-14 lg:py-16">
        <Suspense key={JSON.stringify(query)} fallback={<ListSkeleton />}>
          <DocumentListing locale={locale} t={t} section="legal" query={query} basePath={href(locale, "/legal")} emptyText={t.legal.noResults} />
        </Suspense>
      </div>
    </>
  );
}
