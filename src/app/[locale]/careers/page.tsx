import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Download, FileText } from "lucide-react";
import { cms } from "@/lib/cms";
import { href } from "@/i18n/config";
import { formatDate } from "@/i18n/format";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/States";
import { Reveal } from "@/components/ui/Reveal";
import { StatusBadge, VacancyCard } from "@/components/cards/VacancyCard";

export async function generateMetadata({ params }: PageProps<"/[locale]/careers">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.careers.title, description: t.careers.lead, path: "/careers" });
}

export default async function CareersPage({ params }: PageProps<"/[locale]/careers">) {
  const { locale, t } = await pageContext(params);
  const [open, closed, forms] = await Promise.all([cms.getVacancies(locale, "open"), cms.getVacancies(locale, "closed"), cms.getApplicationForms(locale)]);

  return (
    <>
      <PageHero title={t.careers.title} lead={t.careers.lead} eyebrow={t.nav.careers} breadcrumbs={crumbs(locale, t, { label: t.careers.title })} breadcrumbLabel={t.a11y.breadcrumb} />

      <section aria-labelledby="current-title" className="container-inst py-16 lg:py-20">
        <SectionHeader id="current-title" title={t.careers.current} />
        {open.length ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {open.map((v, i) => (
              <li key={v.id}>
                <Reveal delay={i * 0.05} className="h-full">
                  <VacancyCard vacancy={v} locale={locale} t={t} />
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title={t.states.emptyTitle} text={t.careers.noVacancies} />
        )}
      </section>

      <section className="border-y border-line bg-paper py-16 lg:py-20">
        <div className="container-inst grid gap-12 lg:grid-cols-3">
          <div>
            <h2 className="text-[1.6rem] font-semibold">{t.careers.howToApply}</h2>
            <p className="mt-4 text-ink-muted">{t.careers.howToApplyText}</p>
          </div>
          <div>
            <h2 className="text-[1.6rem] font-semibold">{t.careers.generalRequirements}</h2>
            <ul className="mt-4 space-y-3">
              {t.careers.generalRequirementsList.map((r) => (
                <li key={r} className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[1.6rem] font-semibold">{t.careers.documents}</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {forms.map((f) => (
                <li key={f.title}>
                  <a href={f.url} download className="group flex items-center justify-between gap-4 py-3.5">
                    <span className="flex items-center gap-3">
                      <FileText className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
                      <span className="font-semibold text-brand-900 group-hover:text-brand-600">{f.title}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 text-sm text-ink-muted">
                      {f.fileType}{f.size ? `, ${f.size}` : ""}
                      <Download className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="archive-title" className="container-inst py-16 lg:py-20">
        <SectionHeader id="archive-title" title={t.careers.archive} />
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[40rem] text-left text-[0.95rem]">
            <thead className="bg-paper text-[0.75rem] uppercase tracking-[0.12em] text-ink-muted">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold">{t.careers.title}</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">{t.common.department}</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">{t.common.deadline}</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">{t.common.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {closed.map((v) => (
                <tr key={v.id} className="hover:bg-paper/60">
                  <td className="px-5 py-4">
                    <Link href={href(locale, `/careers/${v.slug}`)} className="font-semibold text-brand-900 hover:text-brand-600 hover:underline">
                      {v.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-ink-muted">{v.department}</td>
                  <td className="px-5 py-4 text-ink-muted">
                    <time dateTime={v.deadline}>{formatDate(v.deadline, locale)}</time>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={v.status} t={t} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
