import type { Metadata } from "next";
import { isStaticExport } from "@/lib/env";
import { ExternalLink, Mail, Newspaper, UserRound } from "lucide-react";
import { cms } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { ContactDetails } from "@/components/home/ContactLocation";
import { ContactForm } from "@/components/forms/ContactForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.contact.title, description: t.contact.lead, path: "/contact" });
}

export default async function ContactPage({ params, searchParams }: PageProps<"/[locale]/contact">) {
  const { locale, t } = await pageContext(params);
  const settings = await cms.getSiteSettings(locale);
  const sp = isStaticExport ? {} : await searchParams;
  const defaultSubject = (sp as Record<string, unknown>).subject === "rti" ? t.transparency.requestCta : "";

  return (
    <>
      <PageHero title={t.contact.title} lead={t.contact.lead} eyebrow={t.nav.contact} breadcrumbs={crumbs(locale, t, { label: t.contact.title })} breadcrumbLabel={t.a11y.breadcrumb} />

      <div className="container-inst grid gap-12 py-14 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-5">
          <h2 className="text-[1.6rem] font-semibold">{t.contact.details}</h2>
          <div className="mt-6 border border-line bg-white p-6">
            <ContactDetails settings={settings} t={t} />
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <li className="border border-line bg-paper p-5">
              <p className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                <UserRound className="h-4 w-4 text-brand-600" aria-hidden="true" />
                {t.transparency.coordinator}
              </p>
              <a href={"mailto:" + settings.rtiEmail} className="mt-2 inline-flex items-center gap-1.5 break-all text-sm font-semibold text-brand-600 hover:underline">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {settings.rtiEmail}
              </a>
            </li>
            <li className="border border-line bg-paper p-5">
              <p className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                <Newspaper className="h-4 w-4 text-brand-600" aria-hidden="true" />
                {t.nav.pressReleases}
              </p>
              <a href={"mailto:" + settings.pressEmail} className="mt-2 inline-flex items-center gap-1.5 break-all text-sm font-semibold text-brand-600 hover:underline">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {settings.pressEmail}
              </a>
            </li>
          </ul>

          <div className="mt-8 h-72">
            <MapPlaceholder label={settings.shortName} note={t.contact.mapPlaceholder} />
          </div>
          <a href={settings.address.mapUrl} target="_blank" rel="noopener noreferrer" className="link-arrow mt-4 text-sm">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            {t.contact.openMap}
            <span className="sr-only">{t.a11y.externalLink}</span>
          </a>
        </div>

        <section aria-labelledby="form-title" className="lg:col-span-7">
          <div className="border-t-[3px] border-brand-900 bg-paper p-6 sm:p-10">
            <h2 id="form-title" className="mb-2 text-[1.8rem] font-semibold">
              {t.contact.formTitle}
            </h2>
            <ContactForm defaultSubject={defaultSubject} />
          </div>
        </section>
      </div>
    </>
  );
}
