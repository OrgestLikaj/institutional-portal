import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import type { Announcement } from "@/lib/cms/types";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatDate } from "@/i18n/format";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnnouncementRow } from "@/components/cards/AnnouncementRow";
import { Reveal } from "@/components/ui/Reveal";

export function AnnouncementsSection({
  locale,
  t,
  announcements,
  press,
}: {
  locale: Locale;
  t: Dictionary;
  announcements: Announcement[];
  press: Announcement[];
}) {
  return (
    <section aria-labelledby="ann-title" className="py-20 lg:py-24">
      <div className="container-inst">
        <SectionHeader
          id="ann-title"
          eyebrow={t.home.announcementsEyebrow}
          title={t.home.announcementsTitle}
          link={{ href: href(locale, "/announcements"), label: t.common.viewAll }}
        />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            {announcements.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.05}>
                <AnnouncementRow item={a} locale={locale} t={t} />
              </Reveal>
            ))}
          </div>

          <Reveal className="lg:col-span-4">
            <aside aria-labelledby="press-title" className="h-full bg-brand-900 p-7 text-white sm:p-8">
              <div className="flex items-center gap-3">
                <Newspaper className="h-5 w-5 text-gold-300" aria-hidden="true" />
                <h3 id="press-title" className="font-display text-[1.35rem] font-semibold text-white">
                  {t.home.pressTitle}
                </h3>
              </div>
              <ul className="mt-6 divide-y divide-white/10">
                {press.map((p) => (
                  <li key={p.id} className="py-4 first:pt-0">
                    <time dateTime={p.date} className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-gold-300">
                      {formatDate(p.date, locale)}
                    </time>
                    <Link href={href(locale, `/announcements/${p.slug}`)} className="mt-1.5 block text-[0.98rem] leading-snug text-white/90 hover:text-white hover:underline">
                      {p.excerpt}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={href(locale, "/announcements?category=press")}
                className="mt-6 inline-flex items-center gap-2 border-b border-gold-500 pb-1 text-sm font-semibold text-white hover:text-gold-300"
              >
                {t.common.viewAll}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
