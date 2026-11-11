import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";
import { href, locales } from "@/i18n/config";
import { parseListQuery } from "@/lib/cms/query";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { DocumentListing } from "@/components/DocumentListing";
import { ListSkeleton } from "@/components/ui/ListSkeleton";
import { TransparencyNav } from "@/components/TransparencyNav";

export async function generateStaticParams() {
  const all = await Promise.all(locales.map(async (locale) => (await cms.getTransparencyCategories(locale)).map((c) => ({ locale, category: c.slug }))));
  return all.flat();
}

export async function generateMetadata({ params }: PageProps<"/[locale]/transparency/[category]">): Promise<Metadata> {
  const { locale } = await pageContext(params);
  const { category } = await params;
  const cat = (await cms.getTransparencyCategories(locale)).find((c) => c.slug === category);
  if (!cat) return {};
  return buildMetadata({ locale, title: cat.title, description: cat.description, path: `/transparency/${category}` });
}

export default async function TransparencyCategoryPage({ params, searchParams }: PageProps<"/[locale]/transparency/[category]">) {
  const { locale, t } = await pageContext(params);
  const { category } = await params;
  const [categories, settings] = await Promise.all([cms.getTransparencyCategories(locale), cms.getSiteSettings(locale)]);
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();
  const query = parseListQuery(await searchParams);

  return (
    <>
      <PageHero
        title={cat.title}
        lead={cat.description}
        eyebrow={t.transparency.title}
        breadcrumbs={crumbs(locale, t, { label: t.transparency.title, href: href(locale, "/transparency") }, { label: cat.title })}
        breadcrumbLabel={t.a11y.breadcrumb}
      />
      <div className="container-inst grid gap-12 py-14 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-8">
          <Suspense key={JSON.stringify(query)} fallback={<ListSkeleton />}>
            <DocumentListing
            locale={locale}
            t={t}
            section="transparency"
            query={query}
            fixedCategory={cat.slug}
            basePath={href(locale, `/transparency/${cat.slug}`)}
            emptyText={t.transparency.noResults}
          />
          </Suspense>
        </div>
        <div className="lg:col-span-4">
          <TransparencyNav locale={locale} t={t} categories={categories} active={cat.slug} settings={settings} />
        </div>
      </div>
    </>
  );
}
