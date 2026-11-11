import { Download, FileText } from "lucide-react";
import type { DocumentItem } from "@/lib/cms/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatDate } from "@/i18n/format";

/** One official document: title, category, reference, date, file info and download. */
export function DocumentRow({ doc, locale, t, showCategory = true }: { doc: DocumentItem; locale: Locale; t: Dictionary; showCategory?: boolean }) {
  return (
    <article className="group grid gap-4 border-b border-line py-6 first:border-t sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6">
      <div className="hidden h-14 w-12 shrink-0 flex-col items-center justify-center border border-line bg-white text-brand-600 sm:flex" aria-hidden="true">
        <FileText className="h-5 w-5" />
        <span className="mt-1 text-[0.6rem] font-bold tracking-wider">{doc.file.fileType}</span>
      </div>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] text-ink-muted">
          {showCategory && <span className="tag">{doc.category.name}</span>}
          {showCategory && <span aria-hidden="true" className="h-3 w-px bg-line" />}
          <time dateTime={doc.date}>{formatDate(doc.date, locale)}</time>
          {doc.reference && (
            <>
              <span aria-hidden="true" className="h-3 w-px bg-line" />
              <span>
                {t.common.reference} {doc.reference}
              </span>
            </>
          )}
        </p>
        <h3 className="mt-1.5 font-display text-[1.1rem] font-semibold leading-snug text-brand-900">{doc.title}</h3>
        <p className="mt-1.5 text-[0.95rem] text-ink-muted">{doc.description}</p>
      </div>
      <a
        href={doc.file.url}
        download
        className="inline-flex items-center justify-center gap-2 self-start border border-brand-900 px-4 py-2.5 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-900 hover:text-white sm:self-center"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {t.common.download}
        <span className="font-normal opacity-70">
          {doc.file.fileType}
          {doc.file.size ? `, ${doc.file.size}` : ""}
        </span>
        <span className="sr-only">: {doc.title}</span>
      </a>
    </article>
  );
}
