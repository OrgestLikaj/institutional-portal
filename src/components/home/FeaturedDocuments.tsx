import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DocumentItem } from "@/lib/cms/types";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { DocumentRow } from "@/components/cards/DocumentRow";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedDocuments({ locale, t, docs }: { locale: Locale; t: Dictionary; docs: DocumentItem[] }) {
  const links = [
    { label: t.nav.lawsRegulations, path: "/legal?category=laws" },
    { label: t.nav.decisions, path: "/legal?category=decisions" },
    { label: t.nav.annualReports, path: "/transparency/annual-reports" },
    { label: t.nav.publications, path: "/activities/publications" },
    { label: t.nav.reports, path: "/activities/reports" },
  ];
  return (
    <section aria-labelledby="docs-title" className="py-20 lg:py-24">
      <div className="container-inst grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow mb-5">{t.home.docsEyebrow}</p>
          <h2 id="docs-title" className="text-[1.9rem] font-semibold sm:text-[2.3rem]">
            {t.home.docsTitle}
          </h2>
          <ul className="mt-8 border-t border-line">
            {links.map((l) => (
              <li key={l.path}>
                <Link
                  href={href(locale, l.path)}
                  className="group flex items-center justify-between border-b border-line py-3.5 font-semibold text-navy-900 hover:text-navy-600"
                >
                  {l.label}
                  <ArrowRight className="h-4 w-4 text-navy-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="lg:col-span-8">
          {docs.map((doc, i) => (
            <Reveal key={doc.id} delay={i * 0.05}>
              <DocumentRow doc={doc} locale={locale} t={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
