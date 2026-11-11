import { dateParts } from "@/i18n/format";
import type { Locale } from "@/i18n/config";

/** Calendar-style date used for announcements. */
export function DateBlock({ iso, locale, tone = "light" }: { iso: string; locale: Locale; tone?: "light" | "dark" }) {
  const { day, month, year } = dateParts(iso, locale);
  const dark = tone === "dark";
  return (
    <time
      dateTime={iso}
      className={`flex w-[4.5rem] shrink-0 flex-col items-center border-t-2 border-gold-500 py-2.5 ${dark ? "bg-navy-800 text-white" : "bg-white text-navy-900"}`}
    >
      <span className="font-serif text-[1.75rem] font-semibold leading-none">{day}</span>
      <span className={`mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] ${dark ? "text-gold-300" : "text-gold-700"}`}>{month}</span>
      <span className={`text-[0.7rem] ${dark ? "text-white/60" : "text-ink-muted"}`}>{year}</span>
    </time>
  );
}
