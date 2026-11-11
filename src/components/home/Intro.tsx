import Link from "next/link";
import { ArrowRight, Compass, Target } from "lucide-react";
import type { AboutPage } from "@/lib/cms/types";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Reveal } from "@/components/ui/Reveal";

export function Intro({ locale, t, about }: { locale: Locale; t: Dictionary; about: AboutPage }) {
  return (
    <section aria-labelledby="intro-title" className="py-20 lg:py-28">
      <div className="container-inst grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-5">{t.home.introEyebrow}</p>
          <h2 id="intro-title" className="text-[2rem] font-semibold sm:text-[2.4rem]">
            {t.home.introTitle}
          </h2>
          {about.introduction.map((p) => (
            <p key={p.slice(0, 24)} className="mt-6 text-[1.06rem] leading-relaxed text-ink-muted">
              {p}
            </p>
          ))}
          <Link href={href(locale, "/about")} className="btn-outline mt-9">
            {t.home.introLink}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
          {[
            { icon: Target, title: t.home.mission, text: about.mission },
            { icon: Compass, title: t.home.vision, text: about.vision },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08} className="h-full">
              <article className="relative h-full border border-line bg-paper p-8 pt-10">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-brand-900" />
                <span aria-hidden="true" className="absolute left-0 top-0 h-[3px] w-16 bg-gold-500" />
                <Icon className="h-7 w-7 text-brand-600" aria-hidden="true" />
                <h3 className="mt-6 text-[1.45rem] font-semibold">{title}</h3>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink">{text}</p>
              </article>
            </Reveal>
          ))}
          <Reveal delay={0.16} className="sm:col-span-2">
            <ul className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
              {about.values.map((v) => (
                <li key={v.title} className="bg-white px-5 py-4">
                  <p className="font-semibold text-brand-900">{v.title}</p>
                  <p className="mt-1 text-[0.85rem] leading-snug text-ink-muted">{v.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
