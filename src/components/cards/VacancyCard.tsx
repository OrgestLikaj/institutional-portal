import Link from "next/link";
import { ArrowRight, Building2, CalendarClock } from "lucide-react";
import type { Vacancy } from "@/lib/cms/types";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatDate } from "@/i18n/format";

export function StatusBadge({ status, t }: { status: Vacancy["status"]; t: Dictionary }) {
  return status === "open" ? (
    <span className="inline-flex items-center gap-1.5 bg-success/10 px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-wider text-success">
      <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
      {t.careers.open}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 bg-navy-50 px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-wider text-ink-muted">
      {t.careers.closed}
    </span>
  );
}

export function VacancyCard({ vacancy, locale, t }: { vacancy: Vacancy; locale: Locale; t: Dictionary }) {
  return (
    <article className="group relative flex h-full flex-col border border-line bg-white p-6 transition-colors hover:border-navy-600 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <StatusBadge status={vacancy.status} t={t} />
        <span className="text-[0.8rem] text-ink-muted">{vacancy.contractType}</span>
      </div>
      <h3 className="mt-5 text-[1.3rem] font-semibold leading-snug">
        <Link href={href(locale, `/careers/${vacancy.slug}`)} className="after:absolute after:inset-0 group-hover:text-navy-600">
          {vacancy.title}
        </Link>
      </h3>
      <p className="mt-3 text-[0.97rem] text-ink-muted">{vacancy.summary}</p>
      <dl className="mt-6 space-y-2 border-t border-line pt-5 text-[0.9rem]">
        <div className="flex items-center gap-2.5">
          <Building2 className="h-4 w-4 text-navy-600" aria-hidden="true" />
          <dt className="sr-only">{t.common.department}</dt>
          <dd>{vacancy.department}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <CalendarClock className="h-4 w-4 text-navy-600" aria-hidden="true" />
          <dt className="font-semibold text-navy-900">{t.common.deadline}:</dt>
          <dd>
            <time dateTime={vacancy.deadline}>{formatDate(vacancy.deadline, locale)}</time>
          </dd>
        </div>
      </dl>
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-navy-600" aria-hidden="true">
        {t.common.readMore} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </article>
  );
}
