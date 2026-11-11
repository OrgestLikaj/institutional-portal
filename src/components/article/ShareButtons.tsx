"use client";

import { useState } from "react";
import { Check, Link2, Printer } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SocialIcon } from "@/components/layout/SocialIcon";

/** Social sharing via plain share-intent URLs (no third-party scripts or trackers). */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const ti = encodeURIComponent(title);

  const targets = [
    { id: "facebook" as const, label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { id: "x" as const, label: "X", href: `https://x.com/intent/post?url=${u}&text=${ti}` },
    { id: "linkedin" as const, label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  ];

  const btn = "flex h-10 w-10 items-center justify-center border border-line text-brand-900 transition-colors hover:border-brand-900 hover:bg-brand-900 hover:text-white";

  return (
    <div>
      <p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">{t.common.share}</p>
      <ul className="flex flex-wrap gap-2">
        {targets.map((s) => (
          <li key={s.id}>
            <a href={s.href} target="_blank" rel="noopener noreferrer" className={btn}>
              <SocialIcon id={s.id} />
              <span className="sr-only">
                {t.common.share}: {s.label} {t.a11y.externalLink}
              </span>
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={btn}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              } catch {
                window.prompt(t.common.copyLink, url);
              }
            }}
          >
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
            <span className="sr-only">{t.common.copyLink}</span>
          </button>
        </li>
        <li>
          <button type="button" className={btn} onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{t.common.print}</span>
          </button>
        </li>
      </ul>
      <p aria-live="polite" className="mt-2 h-5 text-sm text-success">
        {copied ? t.common.linkCopied : ""}
      </p>
    </div>
  );
}
