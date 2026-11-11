import type { Metadata } from "next";
import Image from "next/image";
import { Info } from "lucide-react";
import { cms } from "@/lib/cms";
import { href } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/about/leadership">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.leadership.title, description: t.leadership.lead, path: "/about/leadership" });
}

export default async function LeadershipPage({ params }: PageProps<"/[locale]/about/leadership">) {
  const { locale, t } = await pageContext(params);
  const leaders = await cms.getLeadership(locale);
  const [head, ...others] = leaders;

  return (
    <>
      <PageHero
        title={t.leadership.title}
        lead={t.leadership.lead}
        eyebrow={t.nav.about}
        breadcrumbs={crumbs(locale, t, { label: t.nav.about, href: href(locale, "/about") }, { label: t.leadership.title })}
        breadcrumbLabel={t.a11y.breadcrumb}
      />

      <div className="container-inst py-16 lg:py-20">
        <p className="mb-12 flex items-start gap-2 border-l-2 border-gold-500 bg-paper px-4 py-3 text-sm text-ink-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {t.leadership.placeholderNote}
        </p>

        {head && (
          <Reveal>
            <article id={head.slug} className="grid scroll-mt-40 gap-10 border-b border-line pb-16 md:grid-cols-12">
              <div className="md:col-span-4">
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-50">
                  <Image src={head.portrait.src} alt={head.portrait.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </div>
              </div>
              <div className="md:col-span-8 md:pt-4">
                <p className="eyebrow mb-4">{head.role}</p>
                <h2 className="text-[2.2rem] font-semibold">{head.name}</h2>
                <p className="mt-2 text-ink-muted">{head.term}</p>
                <h3 className="mt-10 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-brand-800">{t.leadership.biography}</h3>
                <div className="mt-4 space-y-4 text-[1.06rem] leading-relaxed">
                  {head.bio.map((p) => (
                    <p key={p.slice(0, 30)}>{p}</p>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        )}

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {others.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.06}>
              <article id={l.slug} className="h-full scroll-mt-40 border border-line bg-white">
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-50">
                  <Image src={l.portrait.src} alt={l.portrait.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-gold-700">{l.role}</p>
                  <h2 className="mt-2 text-[1.4rem] font-semibold">{l.name}</h2>
                  <p className="text-sm text-ink-muted">{l.term}</p>
                  <details className="group mt-5 border-t border-line pt-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-brand-600 [&::-webkit-details-marker]:hidden">
                      {t.leadership.biography}
                      <span aria-hidden="true" className="text-lg leading-none transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <div className="mt-3 space-y-3 text-[0.96rem] text-ink-muted">
                      {l.bio.map((p) => (
                        <p key={p.slice(0, 30)}>{p}</p>
                      ))}
                    </div>
                  </details>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
