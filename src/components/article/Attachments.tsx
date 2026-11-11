import { Download, FileText } from "lucide-react";
import type { Attachment } from "@/lib/cms/types";

export function Attachments({ items, title, downloadLabel }: { items: Attachment[]; title: string; downloadLabel: string }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="attachments-title" className="mt-12 border border-line bg-paper p-6">
      <h2 id="attachments-title" className="mb-4 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-brand-800">
        {title}
      </h2>
      <ul className="divide-y divide-line">
        {items.map((a) => (
          <li key={a.url + a.title} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
            <span className="flex items-center gap-3">
              <FileText className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
              <span className="font-semibold text-brand-900">{a.title}</span>
              <span className="text-sm text-ink-muted">
                {a.fileType}
                {a.size ? ` · ${a.size}` : ""}
              </span>
            </span>
            <a href={a.url} download className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
              <Download className="h-4 w-4" aria-hidden="true" />
              {downloadLabel}
              <span className="sr-only">: {a.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
