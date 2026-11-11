import Link from "next/link";
import { ArrowUpRight, Briefcase, Eye, Landmark, Mail, Network, ScrollText } from "lucide-react";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

const tiles = [
  { key: "structure", icon: Network, path: "/about/structure" },
  { key: "legal", icon: Landmark, path: "/legal" },
  { key: "publications", icon: ScrollText, path: "/activities/publications" },
  { key: "transparency", icon: Eye, path: "/transparency" },
  { key: "careers", icon: Briefcase, path: "/careers" },
  { key: "contact", icon: Mail, path: "/contact" },
] as const;

export function QuickAccess({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section aria-labelledby="quick-title" className="border-y border-line bg-paper py-20 lg:py-24">
      <div className="container-inst">
        <SectionHeader id="quick-title" eyebrow={t.home.quickEyebrow} title={t.home.quickTitle} />
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map(({ key, icon: Icon, path }, i) => (
            <li key={key} className="bg-white">
              <Reveal delay={i * 0.04} className="h-full">
                <Link
                  href={href(locale, path)}
                  className="group relative flex h-full flex-col p-8 transition-colors duration-200 hover:bg-navy-900 focus-visible:bg-navy-900"
                >
                  <span className="flex h-12 w-12 items-center justify-center border border-line text-navy-600 transition-colors group-hover:border-gold-500 group-hover:text-gold-300">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="mt-7 font-serif text-[1.3rem] font-semibold text-navy-900 transition-colors group-hover:text-white">
                    {t.home.quick[key].title}
                  </span>
                  <span className="mt-2 text-[0.95rem] text-ink-muted transition-colors group-hover:text-white/75">{t.home.quick[key].text}</span>
                  <ArrowUpRight
                    className="absolute right-7 top-8 h-5 w-5 text-line transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-300"
                    aria-hidden="true"
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
