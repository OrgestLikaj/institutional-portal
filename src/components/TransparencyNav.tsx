import Link from "next/link";
import { Mail, UserRound } from "lucide-react";
import type { SiteSettings, TransparencyCategory } from "@/lib/cms/types";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/** Sidebar for the transparency portal: category navigation + RTI coordinator box. */
export function TransparencyNav({
  locale,
  t,
  categories,
  active,
  settings,
}: {
  locale: Locale;
  t: Dictionary;
  categories: TransparencyCategory[];
  active?: string;
  settings: SiteSettings;
}) {
  return (
    <div className="space-y-8 lg:sticky lg:top-40">
      <nav aria-label={t.transparency.title}>
        <ul className="border border-line">
          {categories.map((c) => {
            const isActive = c.slug === active;
            return (
              <li key={c.slug} className="border-b border-line last:border-b-0">
                <Link
                  href={href(locale, `/transparency/${c.slug}`)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center justify-between gap-3 border-l-[3px] px-4 py-3.5 text-[0.95rem] font-semibold transition-colors ${
                    isActive ? "border-gold-500 bg-brand-900 text-white" : "border-transparent text-brand-900 hover:bg-paper"
                  }`}
                >
                  {c.title}
                  <span className={`text-xs font-normal ${isActive ? "text-white/70" : "text-ink-muted"}`}>{c.count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <aside className="bg-paper p-6">
        <p className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-brand-800">
          <UserRound className="h-4 w-4" aria-hidden="true" />
          {t.transparency.coordinator}
        </p>
        <p className="mt-3 text-[0.95rem] text-ink-muted">{t.transparency.coordinatorText}</p>
        <a href={"mailto:" + settings.rtiEmail} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline">
          <Mail className="h-4 w-4" aria-hidden="true" />
          {settings.rtiEmail}
        </a>
        <Link href={href(locale, "/contact?subject=rti")} className="btn-primary mt-5 w-full">
          {t.transparency.requestCta}
        </Link>
      </aside>
    </div>
  );
}
