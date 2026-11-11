"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";

/** Swaps the locale segment of the current URL, keeping path, query and hash. */
export function LanguageSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() || `/${locale}`;

  const target = (l: Locale) => pathname.replace(/^\/(sq|en)(?=\/|$)/, `/${l}`);

  return (
    <nav aria-label={t.a11y.language}>
      <ul className="flex items-center">
        {locales.map((l, i) => {
          const active = l === locale;
          return (
            <li key={l} className="flex items-center">
              {i > 0 && <span aria-hidden="true" className={tone === "light" ? "mx-1 text-white/30" : "mx-1 text-line"}>|</span>}
              <Link
                href={target(l)}
                hrefLang={localeMeta[l].htmlLang}
                lang={localeMeta[l].htmlLang}
                aria-current={active ? "true" : undefined}
                aria-label={localeMeta[l].label}
                onClick={(e) => {
                  // carry the query string and hash across languages
                  if (typeof window !== "undefined" && (window.location.search || window.location.hash)) {
                    e.preventDefault();
                    window.location.assign(target(l) + window.location.search + window.location.hash);
                  }
                }}
                className={[
                  "px-1.5 py-1 text-[0.8rem] font-semibold tracking-wider transition-colors",
                  tone === "light"
                    ? active ? "text-gold-300" : "text-white/75 hover:text-white"
                    : active ? "text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4" : "text-ink-muted hover:text-navy-900",
                ].join(" ")}
              >
                {localeMeta[l].short}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
