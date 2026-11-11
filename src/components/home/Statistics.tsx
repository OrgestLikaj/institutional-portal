import { Info } from "lucide-react";
import type { StatItem } from "@/lib/cms/types";
import type { Locale } from "@/i18n/config";
import { localeMeta } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { CountUp } from "./CountUp";

export function Statistics({ locale, t, stats }: { locale: Locale; t: Dictionary; stats: { demo: boolean; items: StatItem[] } }) {
  return (
    <section aria-labelledby="stats-title" className="relative overflow-hidden bg-brand-900 py-20 text-white lg:py-24">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(135,49,50,0.55),transparent_55%)]" />
      <div className="container-inst relative">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow eyebrow-light mb-4">{t.home.statsEyebrow}</p>
            <h2 id="stats-title" className="text-[1.9rem] font-semibold text-white sm:text-[2.3rem]">
              {t.home.statsTitle}
            </h2>
          </div>
          {stats.demo && (
            <p className="inline-flex items-center gap-2 self-start border border-gold-500/60 px-3 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-gold-300 md:self-auto">
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              {t.common.demoData}
            </p>
          )}
        </div>

        <dl className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.items.map((s) => (
            <div key={s.label} className="flex flex-col-reverse bg-brand-900 p-7">
              <dt className="mt-3 text-[0.98rem] leading-snug text-white/80">
                {s.label}
                <span className="mt-1 block text-[0.78rem] uppercase tracking-[0.12em] text-white/50">{s.period}</span>
              </dt>
              <dd className="font-display text-[2.8rem] font-semibold leading-none text-white">
                <CountUp value={s.value} locale={localeMeta[locale].intl} />
                {s.suffix && <span className="text-gold-300">{s.suffix}</span>}
              </dd>
            </div>
          ))}
        </dl>

        {stats.demo && <p className="mt-6 max-w-3xl text-[0.85rem] text-white/60">{t.home.statsNote}</p>}
      </div>
    </section>
  );
}
