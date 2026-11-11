import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Globe, Scale, Search, Shield, Users } from "lucide-react";
import { cms } from "@/lib/cms";
import { href } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { DocumentRow } from "@/components/cards/DocumentRow";

const icons = { scale: Scale, search: Search, shield: Shield, users: Users, globe: Globe, file: FileText };

export async function generateMetadata({ params }: PageProps<"/[locale]/activities">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.activities.title, description: t.activities.lead, path: "/activities" });
}

export default async function ActivitiesPage({ params }: PageProps<"/[locale]/activities">) {
  const { locale, t } = await pageContext(params);
  const [areas, reports, publications] = await Promise.all([
    cms.getActivityAreas(locale),
    cms.getDocuments(locale, { section: "report", perPage: 3 }),
    cms.getDocuments(locale, { section: "publication", perPage: 3 }),
  ]);

  return (
    <>
      <PageHero
        title={t.activities.title}
        lead={t.activities.lead}
        eyebrow={t.nav.activities}
        breadcrumbs={crumbs(locale, t, { label: t.nav.activities })}
        breadcrumbLabel={t.a11y.breadcrumb}
      />

      <section aria-labelledby="areas-title" className="container-inst py-16 lg:py-20">
        <SectionHeader id="areas-title" title={t.activities.areas} />
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a, i) => {
            const Icon = icons[a.icon];
            return (
              <li key={a.id} className="bg-white">
                <Reveal delay={i * 0.04} className="h-full p-8">
                  <Icon className="h-7 w-7 text-navy-600" aria-hidden="true" />
                  <h3 className="mt-6 text-[1.3rem] font-semibold">{a.title}</h3>
                  <p className="mt-3 text-ink-muted">{a.text}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-t border-line bg-paper py-16 lg:py-20">
        <div className="container-inst grid gap-14 lg:grid-cols-2">
          {[
            { title: t.activities.reportsTitle, lead: t.activities.reportsLead, items: reports.items, path: "/activities/reports", id: "reports-title" },
            { title: t.activities.publicationsTitle, lead: t.activities.publicationsLead, items: publications.items, path: "/activities/publications", id: "pubs-title" },
          ].map((block) => (
            <div key={block.id} aria-labelledby={block.id} role="region">
              <h2 id={block.id} className="text-[1.7rem] font-semibold">
                {block.title}
              </h2>
              <p className="mt-3 text-ink-muted">{block.lead}</p>
              <div className="mt-6">
                {block.items.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} locale={locale} t={t} />
                ))}
              </div>
              <Link href={href(locale, block.path)} className="link-arrow mt-6">
                {t.common.viewAll} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
