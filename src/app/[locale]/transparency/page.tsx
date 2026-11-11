import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, ClipboardCheck, FileSearch, FileText, Info, Landmark, ShoppingCart, Wallet } from "lucide-react";
import { cms } from "@/lib/cms";
import { href } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { DocumentRow } from "@/components/cards/DocumentRow";
import { TransparencyNav } from "@/components/TransparencyNav";

const icons: Record<string, typeof Info> = {
  "public-information": Info,
  "institutional-reports": BarChart3,
  "annual-reports": FileText,
  budget: Wallet,
  procurement: ShoppingCart,
  "access-requests": FileSearch,
  accountability: ClipboardCheck,
};

export async function generateMetadata({ params }: PageProps<"/[locale]/transparency">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.transparency.title, description: t.transparency.lead, path: "/transparency" });
}

export default async function TransparencyPage({ params }: PageProps<"/[locale]/transparency">) {
  const { locale, t } = await pageContext(params);
  const [categories, latest, settings] = await Promise.all([
    cms.getTransparencyCategories(locale),
    cms.getDocuments(locale, { section: "transparency", perPage: 4 }),
    cms.getSiteSettings(locale),
  ]);

  return (
    <>
      <PageHero
        title={t.transparency.title}
        lead={t.transparency.lead}
        eyebrow={t.nav.transparency}
        breadcrumbs={crumbs(locale, t, { label: t.transparency.title })}
        breadcrumbLabel={t.a11y.breadcrumb}
      />

      <div className="container-inst grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-8">
          <p className="max-w-3xl text-[1.08rem] leading-relaxed">{t.transparency.portalIntro}</p>

          <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2">
            {categories.map((c, i) => {
              const Icon = icons[c.slug] ?? Landmark;
              return (
                <li key={c.slug} className="bg-white">
                  <Reveal delay={i * 0.04} className="h-full">
                    <Link href={href(locale, `/transparency/${c.slug}`)} className="group flex h-full flex-col p-7 transition-colors hover:bg-paper">
                      <div className="flex items-start justify-between">
                        <span className="flex h-11 w-11 items-center justify-center bg-brand-900 text-gold-300">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="text-sm text-ink-muted">
                          {c.count} {t.common.documents}
                        </span>
                      </div>
                      <h2 className="mt-6 text-[1.25rem] font-semibold group-hover:text-brand-600">{c.title}</h2>
                      <p className="mt-2 flex-1 text-[0.96rem] text-ink-muted">{c.description}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600" aria-hidden="true">
                        {t.common.viewAll} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>

          <section aria-labelledby="latest-transparency" className="mt-16">
            <h2 id="latest-transparency" className="mb-6 text-[1.6rem] font-semibold">
              {t.transparency.latest}
            </h2>
            {latest.items.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} locale={locale} t={t} />
            ))}
          </section>
        </div>

        <div className="lg:col-span-4">
          <TransparencyNav locale={locale} t={t} categories={categories} settings={settings} />
        </div>
      </div>
    </>
  );
}
