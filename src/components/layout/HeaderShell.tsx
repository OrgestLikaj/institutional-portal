"use client";

import { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import type { NavItem } from "@/lib/cms/types";
import { href } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { Brand } from "./Brand";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { SearchDialog } from "./SearchDialog";

type BrandProps = { name: string; lines: string[]; logo: string | null };

/** Sticky institutional header: masthead + main navigation + search + mobile drawer. */
export function HeaderShell({ items, brand }: { items: NavItem[]; brand: BrandProps }) {
  const { locale, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const suggestions = items
    .flatMap((i) => (i.children?.length ? i.children : [i]))
    .filter((i) => !i.href.includes("#"))
    .slice(1, 9);

  const brandNode = (compact: boolean, iconOnlyOnMobile = true) => (
    <Brand homeHref={href(locale)} name={brand.name} lines={brand.lines} logo={brand.logo} compact={compact} iconOnlyOnMobile={iconOnlyOnMobile} />
  );

  return (
    <>
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? "shadow-[0_6px_24px_-12px_rgba(42,18,19,0.32)]" : ""}`}>
        <div className="container-inst">
          <div className={`flex items-center justify-between gap-6 transition-[padding] duration-200 ${scrolled ? "py-2.5" : "py-4 lg:py-5"}`}>
            {brandNode(scrolled)}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="group hidden items-center gap-3 border border-line px-4 py-2.5 text-sm text-ink-muted transition-colors hover:border-brand-600 hover:text-brand-900 md:flex"
                aria-label={t.a11y.openSearch}
              >
                <Search className="h-4 w-4 text-brand-600" aria-hidden="true" />
                <span className="hidden lg:inline">{t.common.searchPlaceholder}</span>
                <kbd className="hidden border border-line px-1.5 font-sans text-[0.7rem] text-ink-muted lg:inline">Ctrl K</kbd>
              </button>
              <button type="button" onClick={() => setSearchOpen(true)} className="p-2.5 text-brand-900 md:hidden" aria-label={t.a11y.openSearch}>
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex items-center gap-2 border border-brand-900 px-3 py-2 text-sm font-semibold text-brand-900 lg:hidden"
                aria-label={t.a11y.openMenu}
                aria-haspopup="dialog"
                aria-expanded={menuOpen}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span className="hidden sm:inline">Menu</span>
              </button>
            </div>
          </div>
        </div>

        <div className="relative hidden border-t border-line lg:block">
          <div className="container-inst">
            <MegaMenu items={items} />
          </div>
        </div>
        <div aria-hidden="true" className="h-[3px] bg-brand-900" />
      </header>

      <MobileNav items={items} open={menuOpen} onClose={() => setMenuOpen(false)} onSearch={() => setSearchOpen(true)} brand={brandNode(true, false)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} suggestions={suggestions} />
    </>
  );
}
