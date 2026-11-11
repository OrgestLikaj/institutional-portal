"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { NavItem } from "@/lib/cms/types";
import { useI18n } from "@/i18n/I18nProvider";

export function isActivePath(pathname: string, itemHref: string): boolean {
  const path = itemHref.split(/[?#]/)[0];
  if (/^\/(sq|en)$/.test(path)) return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * Desktop mega-menu.
 * Opens on hover (with intent delay), click and keyboard; closes on Esc,
 * outside click, focus leaving the item, or navigation.
 */
export function MegaMenu({ items }: { items: NavItem[] }) {
  const { t } = useI18n();
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // close on navigation (state adjusted during render, no effect needed)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open !== null) {
        buttonRefs.current[open]?.focus();
        setOpen(null);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <nav ref={navRef} aria-label={t.a11y.mainNav} className="hidden lg:block" onMouseLeave={scheduleClose}>
      <ul className="flex items-stretch">
        {items.map((item, i) => {
          const active = isActivePath(pathname, item.href) || item.children?.some((c) => isActivePath(pathname, c.href));
          const isOpen = open === i;
          const base =
            "relative flex h-14 items-center gap-1.5 px-3 xl:px-4 text-[0.95rem] font-semibold transition-colors after:absolute after:inset-x-3 xl:after:inset-x-4 after:bottom-0 after:h-[3px] after:transition-colors";
          const tone = active || isOpen ? "text-navy-900 after:bg-gold-500" : "text-ink hover:text-navy-600 after:bg-transparent";

          if (!item.children?.length) {
            return (
              <li key={item.href} onMouseEnter={() => setOpen(null)}>
                <Link href={item.href} className={`${base} ${tone}`} aria-current={isActivePath(pathname, item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            );
          }

          const panelId = `mega-panel-${i}`;
          return (
            <li
              key={item.href}
              onMouseEnter={() => {
                cancelClose();
                setOpen(i);
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen((cur) => (cur === i ? null : cur));
              }}
            >
              <button
                ref={(el) => {
                  buttonRefs.current[i] = el;
                }}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpen(i);
                    requestAnimationFrame(() => document.querySelector<HTMLAnchorElement>(`#${panelId} a`)?.focus());
                  }
                }}
                className={`${base} ${tone}`}
              >
                {item.label}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    onMouseEnter={cancelClose}
                    className="absolute inset-x-0 top-full z-40 border-t border-line bg-white shadow-[0_18px_40px_-20px_rgba(16,36,58,0.35)]"
                  >
                    <div className="container-inst grid grid-cols-12 gap-10 py-10">
                      <div className="col-span-4 border-r border-line pr-10">
                        <p className="eyebrow mb-4">{item.label}</p>
                        {item.intro && <p className="font-serif text-[1.35rem] leading-snug text-navy-900">{item.intro}</p>}
                        <Link href={item.href.split("#")[0]} className="link-arrow mt-6 text-sm">
                          {t.common.viewAll} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </div>
                      <ul className="col-span-8 grid grid-cols-2 gap-x-10 gap-y-1 self-start">
                        {item.children.map((child) => {
                          const childActive = isActivePath(pathname, child.href) && !child.href.includes("#") && !child.href.includes("?");
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                aria-current={childActive ? "page" : undefined}
                                className="group flex items-center justify-between border-b border-line py-4 text-[1.02rem] font-semibold text-navy-900 transition-colors hover:border-navy-600 hover:text-navy-600"
                              >
                                <span className="flex items-center gap-3">
                                  <span aria-hidden="true" className={`h-4 w-[3px] ${childActive ? "bg-gold-500" : "bg-transparent group-hover:bg-gold-500"}`} />
                                  {child.label}
                                </span>
                                <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
