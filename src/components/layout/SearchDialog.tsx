"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, CornerDownLeft } from "lucide-react";
import { href } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";

/** Modal search built on the native <dialog> element (focus trap + Esc for free). */
export function SearchDialog({ open, onClose, suggestions }: { open: boolean; onClose: () => void; suggestions: { label: string; href: string }[] }) {
  const { locale, t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={t.search.title}
      className="m-0 mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-2xl bg-transparent p-0 backdrop:bg-navy-950/70 backdrop:backdrop-blur-[2px]"
    >
      <div className="border-t-2 border-gold-500 bg-white shadow-2xl">
        <form
          role="search"
          action={href(locale, "/search")}
          onSubmit={(e) => {
            e.preventDefault();
            const q = inputRef.current?.value.trim() ?? "";
            onClose();
            router.push(`${href(locale, "/search")}${q ? `?q=${encodeURIComponent(q)}` : ""}`);
          }}
          className="flex items-center gap-3 border-b border-line px-5"
        >
          <Search className="h-5 w-5 shrink-0 text-navy-600" aria-hidden="true" />
          <label htmlFor="global-search" className="sr-only">{t.search.label}</label>
          <input
            ref={inputRef}
            id="global-search"
            name="q"
            type="search"
            autoComplete="off"
            placeholder={t.common.searchPlaceholder}
            className="h-16 w-full bg-transparent text-lg text-ink placeholder:text-ink-muted focus:outline-none"
          />
          <button type="button" onClick={onClose} className="p-2 text-ink-muted hover:text-navy-900" aria-label={t.a11y.closeSearch}>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </form>
        <div className="px-5 py-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{t.common.viewAll}</p>
          <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {suggestions.map((s) => (
              <li key={s.href}>
                <Link href={s.href} onClick={onClose} className="block py-1.5 text-[0.95rem] text-navy-800 hover:text-navy-600 hover:underline">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-center gap-2 text-xs text-ink-muted">
            <CornerDownLeft className="h-3.5 w-3.5" aria-hidden="true" /> {t.search.hint}
          </p>
        </div>
      </div>
    </dialog>
  );
}
