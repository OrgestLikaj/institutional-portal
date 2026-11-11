import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { crumbs } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";

export async function PolicyPage({ locale, t, slug, title, lead }: { locale: Locale; t: Dictionary; slug: "privacy" | "accessibility"; title: string; lead: string }) {
  const page = await cms.getPolicyPage(locale, slug);
  if (!page) notFound();
  return (
    <>
      <PageHero title={title} lead={lead} breadcrumbs={crumbs(locale, t, { label: title })} breadcrumbLabel={t.a11y.breadcrumb} />
      <div className="container-inst py-14 lg:py-16">
        <div className="prose-inst max-w-3xl" dangerouslySetInnerHTML={{ __html: page.html }} />
      </div>
    </>
  );
}
