import type { Metadata } from "next";
import { Info } from "lucide-react";
import { cms } from "@/lib/cms";
import type { Department } from "@/lib/cms/types";
import { href } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/about/structure">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.structure.title, description: t.structure.lead, path: "/about/structure" });
}

function ChartNode({ dept, variant = "default" }: { dept: Department; variant?: "head" | "staff" | "default" }) {
  const styles = {
    head: "bg-brand-900 text-white border-brand-900",
    staff: "bg-white text-brand-900 border-dashed border-brand-600",
    default: "bg-white text-brand-900 border-line hover:border-brand-600",
  }[variant];
  return (
    <a href={`#dept-${dept.id}`} className={`relative block border px-4 py-3.5 text-center text-[0.92rem] font-semibold leading-snug transition-colors ${styles}`}>
      {variant === "head" && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gold-500" />}
      {dept.name}
    </a>
  );
}

export default async function StructurePage({ params }: PageProps<"/[locale]/about/structure">) {
  const { locale, t } = await pageContext(params);
  const departments = await cms.getDepartments(locale);

  const head = departments.find((d) => d.level === 0);
  const hasChildren = (d: Department) => departments.some((x) => x.parent === d.id);
  // Level 1 with children = administrative axis (e.g. Secretary General); without = staff units (cabinet, audit)
  const secretariat = departments.find((d) => d.level === 1 && hasChildren(d));
  const staffUnits = departments.filter((d) => d.level === 1 && !hasChildren(d));
  const directorates = departments.filter((d) => d.level === 2);
  const byId = Object.fromEntries(departments.map((d) => [d.id, d]));

  return (
    <>
      <PageHero
        title={t.structure.title}
        lead={t.structure.lead}
        eyebrow={t.nav.about}
        breadcrumbs={crumbs(locale, t, { label: t.nav.about, href: href(locale, "/about") }, { label: t.structure.title })}
        breadcrumbLabel={t.a11y.breadcrumb}
      />

      <div className="container-inst py-16 lg:py-20">
        <section aria-labelledby="chart-title">
          <h2 id="chart-title" className="text-[1.9rem] font-semibold">
            {t.structure.chart}
          </h2>

          <Reveal>
            <div className="mt-10 overflow-x-auto border border-line bg-paper p-6 sm:p-10">
              <div className="mx-auto min-w-[56rem] max-w-6xl">
                {/* Level 0 */}
                {head && (
                  <div className="mx-auto w-72">
                    <ChartNode dept={head} variant="head" />
                  </div>
                )}

                {/* Level 1: staff units flank the main axis */}
                <div className="relative mx-auto grid grid-cols-[1fr_2px_1fr] items-center">
                  <div className="flex flex-col items-end gap-4 py-6 pr-0">
                    {staffUnits.slice(0, Math.ceil(staffUnits.length / 2)).map((d) => (
                      <div key={d.id} className="flex w-full items-center justify-end">
                        <div className="w-64">
                          <ChartNode dept={d} variant="staff" />
                        </div>
                        <span aria-hidden="true" className="h-px w-16 bg-brand-600" />
                      </div>
                    ))}
                  </div>
                  <span aria-hidden="true" className="h-full w-[2px] bg-brand-600" />
                  <div className="flex flex-col items-start gap-4 py-6">
                    {staffUnits.slice(Math.ceil(staffUnits.length / 2)).map((d) => (
                      <div key={d.id} className="flex w-full items-center">
                        <span aria-hidden="true" className="h-px w-16 bg-brand-600" />
                        <div className="w-64">
                          <ChartNode dept={d} variant="staff" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {secretariat && (
                  <>
                    <div className="mx-auto w-72">
                      <ChartNode dept={secretariat} />
                    </div>
                    <div aria-hidden="true" className="mx-auto h-8 w-[2px] bg-brand-600" />
                  </>
                )}

                {/* Level 2: directorates */}
                <div className="relative">
                  <div aria-hidden="true" className="absolute top-0 h-[2px] bg-brand-600" style={{ left: `${50 / directorates.length}%`, right: `${50 / directorates.length}%` }} />
                  <ul className="grid gap-4" style={{ gridTemplateColumns: `repeat(${directorates.length}, minmax(0, 1fr))` }}>
                    {directorates.map((d) => (
                      <li key={d.id} className="flex flex-col items-center">
                        <span aria-hidden="true" className="h-6 w-[2px] bg-brand-600" />
                        <div className="w-full">
                          <ChartNode dept={d} />
                        </div>
                        {d.units.length > 0 && (
                          <ul className="mt-3 w-full space-y-1.5 border-l border-line pl-3">
                            {d.units.map((u) => (
                              <li key={u} className="text-[0.8rem] leading-snug text-ink-muted">
                                {u}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
          <p className="mt-4 flex items-start gap-2 text-sm text-ink-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {t.structure.note}
          </p>
        </section>

        <section aria-labelledby="units-title" className="mt-20">
          <h2 id="units-title" className="text-[1.9rem] font-semibold">
            {t.structure.departments}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {departments
              .filter((d) => d.level > 0)
              .map((d) => (
                <article key={d.id} id={`dept-${d.id}`} className="scroll-mt-40 border border-line bg-white p-7 target:border-brand-600 target:ring-2 target:ring-brand-600/20">
                  {d.parent && byId[d.parent] && (
                    <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                      {t.structure.reportsTo}: <span className="text-brand-600">{byId[d.parent].name}</span>
                    </p>
                  )}
                  <h3 className="mt-2 text-[1.3rem] font-semibold">{d.name}</h3>
                  <p className="mt-3 text-ink-muted">{d.description}</p>
                  {d.responsibilities.length > 0 && (
                    <>
                      <h4 className="mt-6 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-brand-800">{t.structure.responsibilities}</h4>
                      <ul className="mt-3 space-y-1.5">
                        {d.responsibilities.map((r) => (
                          <li key={r} className="flex gap-3 text-[0.97rem]">
                            <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-gold-500" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {d.units.length > 0 && (
                    <>
                      <h4 className="mt-6 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-brand-800">{t.structure.units}</h4>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {d.units.map((u) => (
                          <li key={u} className="border border-line bg-paper px-3 py-1 text-sm">
                            {u}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </article>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
