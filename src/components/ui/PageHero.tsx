import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/** Title band used at the top of every internal page. */
export function PageHero({
  title,
  lead,
  eyebrow,
  breadcrumbs,
  breadcrumbLabel,
  children,
}: {
  title: string;
  lead?: string;
  eyebrow?: string;
  breadcrumbs: Crumb[];
  breadcrumbLabel: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-900 text-white">
      {/* quiet architectural pattern */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 h-full w-[46rem] max-w-[70%] opacity-[0.09]" viewBox="0 0 600 300" preserveAspectRatio="xMaxYMid slice">
        <g fill="none" stroke="#ffffff" strokeWidth="1.2">
          <path d="M120 120 L360 40 L600 120" />
          <line x1="120" y1="132" x2="600" y2="132" />
          {Array.from({ length: 9 }, (_, i) => 150 + i * 52).map((x) => (
            <g key={x}>
              <line x1={x} y1="140" x2={x} y2="270" />
              <line x1={x + 16} y1="140" x2={x + 16} y2="270" />
            </g>
          ))}
          <line x1="110" y1="276" x2="600" y2="276" />
          <line x1="96" y1="288" x2="600" y2="288" />
        </g>
      </svg>
      <div className="container-inst relative py-12 sm:py-16">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbLabel} />
        <div className="mt-8 max-w-3xl">
          {eyebrow && <p className="eyebrow eyebrow-light mb-4">{eyebrow}</p>}
          <h1 className="text-[2.1rem] font-semibold text-white sm:text-[2.75rem]">{title}</h1>
          {lead && <p className="mt-5 text-[1.1rem] leading-relaxed text-white/80">{lead}</p>}
          {children}
        </div>
      </div>
      <div aria-hidden="true" className="h-1 w-full bg-[linear-gradient(90deg,var(--color-gold-500)_0,var(--color-gold-500)_120px,transparent_120px)]" />
    </section>
  );
}
