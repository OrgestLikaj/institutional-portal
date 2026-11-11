import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, CalendarClock, CalendarDays, FileSignature, MapPin } from "lucide-react";
import { cms } from "@/lib/cms";
import { href, locales } from "@/i18n/config";
import { formatDate, interpolate } from "@/i18n/format";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { Attachments } from "@/components/article/Attachments";
import { StatusBadge } from "@/components/cards/VacancyCard";

export async function generateStaticParams() {
  const all = await Promise.all(locales.map(async (locale) => (await cms.getVacancies(locale)).map((v) => ({ locale, slug: v.slug }))));
  return all.flat();
}

export async function generateMetadata({ params }: PageProps<"/[locale]/careers/[slug]">): Promise<Metadata> {
  const { locale } = await pageContext(params);
  const { slug } = await params;
  const v = await cms.getVacancyBySlug(locale, slug);
  if (!v) return {};
  return buildMetadata({ locale, title: v.title, description: v.summary, path: `/careers/${slug}` });
}

export default async function VacancyPage({ params }: PageProps<"/[locale]/careers/[slug]">) {
  const { locale, t } = await pageContext(params);
  const { slug } = await params;
  const v = await cms.getVacancyBySlug(locale, slug);
  if (!v) notFound();

  const facts = [
    { icon: Building2, label: t.common.department, value: v.department },
    { icon: MapPin, label: t.careers.location, value: v.location },
    { icon: FileSignature, label: t.careers.type, value: v.contractType },
    { icon: CalendarDays, label: t.common.published, value: formatDate(v.published, locale) },
    { icon: CalendarClock, label: t.common.deadline, value: formatDate(v.deadline, locale) },
  ];

  return (
    <>
      <PageHero
        title={v.title}
        lead={v.summary}
        eyebrow={t.careers.title}
        breadcrumbs={crumbs(locale, t, { label: t.careers.title, href: href(locale, "/careers") }, { label: v.title })}
        breadcrumbLabel={t.a11y.breadcrumb}
      >
        <div className="mt-6">
          <StatusBadge status={v.status} t={t} />
        </div>
      </PageHero>

      <div className="container-inst grid gap-12 py-14 lg:grid-cols-12 lg:py-16">
        <div className="space-y-12 lg:col-span-8">
          <section aria-labelledby="duties">
            <h2 id="duties" className="text-[1.6rem] font-semibold">{t.careers.responsibilities}</h2>
            <ul className="mt-5 space-y-3">
              {v.responsibilities.map((r) => (
                <li key={r} className="flex gap-3 text-[1.04rem]">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-gold-500" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="reqs">
            <h2 id="reqs" className="text-[1.6rem] font-semibold">{t.careers.requirements}</h2>
            <ul className="mt-5 space-y-3">
              {v.requirements.map((r) => (
                <li key={r} className="flex gap-3 text-[1.04rem]">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-navy-600" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="general">
            <h2 id="general" className="text-[1.6rem] font-semibold">{t.careers.generalRequirements}</h2>
            <ul className="mt-5 space-y-3">
              {t.careers.generalRequirementsList.map((r) => (
                <li key={r} className="flex gap-3 text-[1.04rem]">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-navy-600" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
          <Attachments items={v.documents} title={t.careers.documents} downloadLabel={t.common.download} />
          <Link href={href(locale, "/careers")} className="link-arrow">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t.common.backTo} {t.careers.title.toLowerCase()}
          </Link>
        </div>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-40">
            <dl className="border-t-[3px] border-navy-900 bg-paper p-6">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3 border-b border-line py-3.5 first:pt-0 last:border-b-0 last:pb-0">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" aria-hidden="true" />
                  <div>
                    <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">{label}</dt>
                    <dd className="mt-0.5 text-navy-900">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            {v.status === "open" && (
              <p className="mt-6 border-l-2 border-gold-500 bg-white px-4 py-3 font-semibold text-navy-900">
                {interpolate(t.careers.applyBy, { date: formatDate(v.deadline, locale) })}
              </p>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
