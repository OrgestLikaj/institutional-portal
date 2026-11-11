import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { cms } from "@/lib/cms";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { footerColumns } from "@/config/navigation";
import { Emblem } from "./Emblem";
import { SocialIcon } from "./SocialIcon";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const settings = await cms.getSiteSettings(locale);
  const t = getDictionary(locale);
  const year = new Date().getFullYear();
  const tel = settings.phone.replace(/\s/g, "");

  return (
    <footer className="mt-auto bg-navy-900 text-white">
      <div className="h-1 bg-gold-500" aria-hidden="true" />

      <div className="container-inst grid gap-12 py-16 lg:grid-cols-12">
        {/* Identity + contact */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-4">
            <Emblem tone="light" className="h-14 w-14 shrink-0" />
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold-300">{t.meta.country}</p>
              <p className="font-serif text-xl font-semibold leading-tight">{settings.name}</p>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-white/75">{settings.description}</p>

          <h2 className="sr-only">{t.footer.contact}</h2>
          <address className="mt-8 space-y-3 text-[0.95rem] not-italic text-white/85">
            <p className="flex gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              <span>
                {settings.address.street}
                <br />
                {settings.address.city}
              </span>
            </p>
            <p className="flex gap-3">
              <Phone className="mt-1 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              <a href={"tel:" + tel} className="hover:text-white hover:underline">{settings.phone}</a>
            </p>
            <p className="flex gap-3">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              <a href={"mailto:" + settings.email} className="hover:text-white hover:underline">{settings.email}</a>
            </p>
            <p className="flex gap-3">
              <Clock className="mt-1 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              <span>{settings.officeHours}</span>
            </p>
          </address>
        </div>

        {/* Link columns */}
        <nav aria-label={t.a11y.footerNav} className="grid gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-6">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-5 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-gold-300">{t.footer[col.title]}</h2>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.path}>
                    <Link href={href(locale, l.path)} className="text-[0.95rem] text-white/80 transition-colors hover:text-white hover:underline hover:underline-offset-4">
                      {t.nav[l.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Social */}
        <div className="lg:col-span-1">
          <h2 className="mb-5 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-gold-300">{t.footer.followUs}</h2>
          <ul className="flex gap-2 lg:flex-col">
            {settings.social.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-white/25 text-white/85 transition-colors hover:border-gold-300 hover:text-gold-300"
                >
                  <SocialIcon id={s.id} />
                  <span className="sr-only">
                    {s.label} {t.a11y.externalLink}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Partner institutions */}
      <div className="border-t border-white/10">
        <div className="container-inst flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:gap-8">
          <h2 className="shrink-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-white/60">{t.footer.partners}</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {settings.partners.map((p) => (
              <li key={p.label}>
                <a href={p.url} className="inline-flex items-center gap-1 text-[0.88rem] text-white/75 hover:text-white">
                  {p.label} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Legal bar */}
      <div className="bg-navy-950">
        <div className="container-inst flex flex-col gap-3 py-5 text-[0.82rem] text-white/65 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.name}. {t.footer.rights} <span className="ml-1 text-gold-300/90">{t.footer.prototype}</span>
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li><Link href={href(locale, "/privacy")} className="hover:text-white hover:underline">{t.nav.privacy}</Link></li>
            <li><Link href={href(locale, "/accessibility")} className="hover:text-white hover:underline">{t.nav.accessibility}</Link></li>
            <li><Link href={href(locale, "/search")} className="hover:text-white hover:underline">{t.nav.search}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
