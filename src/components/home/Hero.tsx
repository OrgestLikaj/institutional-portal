import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import type { Announcement, Media } from "@/lib/cms/types";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatDate, interpolate } from "@/i18n/format";
import { HeroMotion } from "./HeroMotion";

export function Hero({
  locale,
  t,
  name,
  image,
  latest,
}: {
  locale: Locale;
  t: Dictionary;
  name: string;
  image: Media;
  latest?: Announcement;
}) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-brand-950 text-white">
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="-z-10 object-cover object-right" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950 via-brand-950/90 to-brand-950/10 lg:via-brand-950/75" />

      <div className="container-inst flex min-h-[34rem] flex-col justify-center py-20 lg:min-h-[40rem] lg:py-28">
        <HeroMotion>
          <p className="eyebrow eyebrow-light mb-6">{t.home.heroEyebrow}</p>
          <h1 id="hero-title" className="max-w-3xl text-[2.4rem] font-semibold leading-[1.1] text-white sm:text-[3.1rem] lg:text-[3.6rem]">
            {t.home.heroTitle}
          </h1>
          <p className="mt-7 max-w-2xl text-[1.12rem] leading-relaxed text-white/80">{interpolate(t.home.heroText, { name })}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={href(locale, "/about")} className="btn-gold">
              {t.home.heroPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href={href(locale, "/transparency/public-information")} className="btn-outline-light">
              {t.home.heroSecondary}
            </Link>
          </div>
        </HeroMotion>
      </div>

      {latest && (
        <div className="border-t border-white/10 bg-brand-950/80 backdrop-blur-sm">
          <div className="container-inst flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:gap-5">
            <span className="inline-flex shrink-0 items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-gold-300">
              <Megaphone className="h-4 w-4" aria-hidden="true" />
              {t.announcements.categories[latest.category]}
            </span>
            <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden="true" />
            <Link href={href(locale, `/announcements/${latest.slug}`)} className="group flex min-w-0 flex-1 items-center gap-3 text-[0.95rem] text-white/90 hover:text-white">
              <time dateTime={latest.date} className="shrink-0 text-white/60">
                {formatDate(latest.date, locale, "short")}
              </time>
              <span className="truncate group-hover:underline">{latest.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
