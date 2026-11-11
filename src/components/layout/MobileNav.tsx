"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import type { NavItem } from "@/lib/cms/types";
import { useI18n } from "@/i18n/I18nProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { isActivePath } from "./MegaMenu";

/** Mobile / tablet navigation drawer (native <dialog>: focus trap, Esc, inert background). */
export function MobileNav({
  items,
  open,
  onClose,
  onSearch,
  brand,
}: {
  items: NavItem[];
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
  brand: React.ReactNode;
}) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname() ?? "";
  const [expanded, setExpanded] = useState<number | null>(() => {
    const idx = items.findIndex((i) => i.children?.some((c) => isActivePath(pathname, c.href)));
    return idx >= 0 ? idx : null;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    onClose();
    // close when the route changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={t.a11y.mainNav}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-transparent p-0 backdrop:bg-brand-950/60"
    >
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
          {brand}
          <button type="button" onClick={onClose} className="p-2 text-brand-900" aria-label={t.a11y.closeMenu}>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            onSearch();
          }}
          className="mx-4 mt-4 flex items-center gap-3 border border-line px-4 py-3 text-left text-ink-muted sm:mx-6"
        >
          <Search className="h-5 w-5 text-brand-600" aria-hidden="true" />
          {t.common.searchPlaceholder}
        </button>

        <nav aria-label={t.a11y.mainNav} className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <ul>
            {items.map((item, i) => {
              const active = isActivePath(pathname, item.href);
              if (!item.children?.length) {
                return (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`block py-4 text-[1.05rem] font-semibold ${active ? "text-brand-600" : "text-brand-900"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const isOpen = expanded === i;
              const id = `mobile-sub-${i}`;
              return (
                <li key={item.href} className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setExpanded(isOpen ? null : i)}
                    className="flex w-full items-center justify-between py-4 text-left text-[1.05rem] font-semibold text-brand-900"
                  >
                    {item.label}
                    <ChevronDown className={`h-5 w-5 text-brand-600 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  <ul id={id} hidden={!isOpen} className="mb-3 border-l-2 border-gold-500 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} onClick={onClose} className="block py-2.5 text-[0.98rem] text-ink hover:text-brand-600">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-between bg-brand-900 px-4 py-4 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">{t.a11y.language}</span>
          <LanguageSwitcher tone="light" />
        </div>
      </div>
    </dialog>
  );
}
