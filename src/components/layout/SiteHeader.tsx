import Link from "next/link";
import { cms } from "@/lib/cms";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { utilityLinks } from "@/config/navigation";
import { HeaderShell } from "./HeaderShell";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const [settings, items] = await Promise.all([cms.getSiteSettings(locale), cms.getNavigation(locale)]);
  const t = getDictionary(locale);

  return (
    <>
      {/* Utility bar */}
      <div className="bg-brand-950 text-white">
        <div className="container-inst flex h-10 items-center justify-between gap-4">
          <p className="truncate text-[0.78rem] tracking-wide text-white/75">
            <span className="mr-2 inline-block h-2 w-2 bg-gold-500 align-middle" aria-hidden="true" />
            {t.meta.country}
            <span className="hidden sm:inline"> · {settings.name}</span>
          </p>
          <div className="flex items-center gap-5">
            <nav aria-label={t.a11y.utilityNav} className="hidden md:block">
              <ul className="flex items-center gap-5">
                {utilityLinks.map((l) => (
                  <li key={l.path}>
                    <Link href={href(locale, l.path)} className="text-[0.8rem] text-white/80 transition-colors hover:text-white">
                      {t.nav[l.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <span className="hidden h-4 w-px bg-white/20 md:block" aria-hidden="true" />
            <LanguageSwitcher tone="light" />
          </div>
        </div>
      </div>

      <HeaderShell items={items} brand={{ name: settings.name, lines: settings.logoLines, logo: settings.logo }} />
    </>
  );
}
