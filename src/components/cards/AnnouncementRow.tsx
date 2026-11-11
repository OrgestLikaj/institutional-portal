import Link from "next/link";
import { AlertCircle, Paperclip } from "lucide-react";
import type { Announcement } from "@/lib/cms/types";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { DateBlock } from "@/components/ui/DateBlock";

export function AnnouncementRow({ item, locale, t, tone = "light" }: { item: Announcement; locale: Locale; t: Dictionary; tone?: "light" | "paper" }) {
  return (
    <article
      className={`group relative flex gap-5 border border-line p-5 transition-colors hover:border-brand-600 sm:gap-6 sm:p-6 ${tone === "paper" ? "bg-paper" : "bg-white"}`}
    >
      <DateBlock iso={item.date} locale={locale} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="tag">{t.announcements.categories[item.category]}</span>
          {item.important && (
            <span className="inline-flex items-center gap-1 bg-gold-500/15 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-gold-700">
              <AlertCircle className="h-3 w-3" aria-hidden="true" />
              {t.common.important}
            </span>
          )}
          {item.attachments.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[0.75rem] text-ink-muted">
              <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
              {item.attachments.length} PDF
            </span>
          )}
        </p>
        <h3 className="mt-2 font-display text-[1.12rem] font-semibold leading-snug text-brand-900">
          <Link href={href(locale, `/announcements/${item.slug}`)} className="after:absolute after:inset-0 group-hover:text-brand-600">
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.95rem] text-ink-muted">{item.excerpt}</p>
      </div>
    </article>
  );
}
