import type { Metadata } from "next";
import { BookOpen, Compass, Landmark, Scale, Target } from "lucide-react";
import { cms } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.about.title, description: t.about.lead, path: "/about" });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale, t } = await pageContext(params);
  const about = await cms.getAboutPage(locale);

  const toc = [
    { id: "introduction", label: t.about.introduction },
    { id: "mission", label: `${t.about.mission} / ${t.about.vision}` },
    { id: "values", label: t.about.values },
    { id: "mandate", label: t.about.mandate },
    { id: "history", label: t.about.history },
    { id: "principles", label: t.about.principles },
  ];

  return (
    <>
      <PageHero
        title={t.about.title}
        lead={t.about.lead}
        eyebrow={t.nav.about}
        breadcrumbs={crumbs(locale, t, { label: t.nav.about })}
        breadcrumbLabel={t.a11y.breadcrumb}
      />

      <div className="container-inst grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        {/* Sticky table of contents */}
        <aside className="lg:col-span-3">
          <nav aria-labelledby="toc-title" className="lg:sticky lg:top-40">
            <p id="toc-title" className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {t.common.onThisPage}
            </p>
            <ol className="border-l border-line">
              {toc.map((item, i) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="-ml-px flex gap-3 border-l-2 border-transparent py-2 pl-4 text-[0.95rem] text-ink hover:border-gold-500 hover:text-navy-600">
                    <span className="font-serif text-gold-700">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="space-y-20 lg:col-span-9">
          <section id="introduction" aria-labelledby="introduction-title">
            <h2 id="introduction-title" className="text-[1.9rem] font-semibold">{t.about.introduction}</h2>
            <div className="mt-6 space-y-5 text-[1.08rem] leading-relaxed">
              {about.introduction.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
            </div>
          </section>

          <section id="mission" aria-label={`${t.about.mission} / ${t.about.vision}`} className="grid gap-6 md:grid-cols-2">
            {[
              { icon: Target, title: t.about.mission, text: about.mission },
              { icon: Compass, title: t.about.vision, text: about.vision },
            ].map(({ icon: Icon, title, text }) => (
              <Reveal key={title}>
                <article className="h-full border-t-[3px] border-navy-900 bg-paper p-8">
                  <Icon className="h-7 w-7 text-gold-700" aria-hidden="true" />
                  <h2 className="mt-5 text-[1.6rem] font-semibold">{title}</h2>
                  <p className="mt-4 font-serif text-[1.18rem] leading-relaxed text-navy-800">{text}</p>
                </article>
              </Reveal>
            ))}
          </section>

          <section id="values" aria-labelledby="values-title">
            <h2 id="values-title" className="text-[1.9rem] font-semibold">{t.about.values}</h2>
            <ul className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {about.values.map((v, i) => (
                <li key={v.title} className="bg-white p-7">
                  <span className="font-serif text-sm text-gold-700">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-[1.2rem] font-semibold">{v.title}</h3>
                  <p className="mt-2 text-ink-muted">{v.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="mandate" aria-labelledby="mandate-title" className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h2 id="mandate-title" className="text-[1.9rem] font-semibold">{t.about.mandate}</h2>
              <div className="prose-inst mt-6" dangerouslySetInnerHTML={{ __html: about.mandate.html }} />
            </div>
            <aside className="border border-line bg-paper p-7 lg:col-span-2">
              <p className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-navy-800">
                <Scale className="h-4 w-4" aria-hidden="true" />
                {t.nav.legal}
              </p>
              <ul className="mt-5 divide-y divide-line">
                {about.mandate.legalBasis.map((b) => (
                  <li key={b.title} className="py-3.5">
                    <p className="font-semibold text-navy-900">{b.title}</p>
                    <p className="text-sm text-ink-muted">{b.reference}</p>
                  </li>
                ))}
              </ul>
            </aside>
          </section>

          <section id="history" aria-labelledby="history-title">
            <h2 id="history-title" className="text-[1.9rem] font-semibold">{t.about.history}</h2>
            <ol className="relative mt-10 border-l-2 border-line pl-8">
              {about.history.map((h) => (
                <li key={h.title} className="relative pb-10 last:pb-0">
                  <span aria-hidden="true" className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center border-2 border-gold-500 bg-white">
                    <span className="h-1.5 w-1.5 bg-navy-900" />
                  </span>
                  <p className="font-serif text-[1.4rem] font-semibold text-gold-700">{h.year}</p>
                  <h3 className="mt-1 text-[1.2rem] font-semibold">{h.title}</h3>
                  <p className="mt-2 max-w-2xl text-ink-muted">{h.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="principles" aria-labelledby="principles-title">
            <h2 id="principles-title" className="text-[1.9rem] font-semibold">{t.about.principles}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {about.principles.map((p, i) => {
                const Icon = [Landmark, BookOpen, Scale, Target][i % 4];
                return (
                  <article key={p.title} className="flex gap-5 border border-line p-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-navy-900 text-gold-300">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-[1.15rem] font-semibold">{p.title}</h3>
                      <p className="mt-1.5 text-ink-muted">{p.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
