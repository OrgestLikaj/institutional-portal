import Link from "next/link";
import { ArrowRight, Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/cms/types";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { Reveal } from "@/components/ui/Reveal";

export function ContactDetails({ settings, t }: { settings: SiteSettings; t: Dictionary }) {
  const rows = [
    { icon: MapPin, label: t.contact.address, value: <>{settings.address.street}<br />{settings.address.city}</> },
    { icon: Phone, label: t.contact.phone, value: <a href={"tel:" + settings.phone.replace(/\s/g, "")} className="hover:underline">{settings.phone}</a> },
    { icon: Mail, label: t.contact.email, value: <a href={"mailto:" + settings.email} className="hover:underline">{settings.email}</a> },
    { icon: Clock, label: t.contact.hours, value: settings.officeHours },
  ];
  return (
    <dl className="divide-y divide-line">
      {rows.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex gap-4 py-4 first:pt-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-brand-50 text-brand-600">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">{label}</dt>
            <dd className="mt-1 text-[1rem] text-brand-900">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export function ContactLocation({ locale, t, settings }: { locale: Locale; t: Dictionary; settings: SiteSettings }) {
  return (
    <section aria-labelledby="contact-title" className="border-t border-line bg-paper py-20 lg:py-24">
      <div className="container-inst grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-5">{t.home.contactEyebrow}</p>
          <h2 id="contact-title" className="text-[1.9rem] font-semibold sm:text-[2.3rem]">
            {t.home.contactTitle}
          </h2>
          <p className="mt-5 text-ink-muted">{t.home.contactText}</p>
          <div className="mt-8 border border-line bg-white p-6">
            <ContactDetails settings={settings} t={t} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={href(locale, "/contact")} className="btn-primary">
              {t.home.contactCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href={settings.address.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              {t.contact.openMap}
              <span className="sr-only">{t.a11y.externalLink}</span>
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-7">
          <MapPlaceholder label={settings.shortName} note={t.contact.mapPlaceholder} />
        </Reveal>
      </div>
    </section>
  );
}
