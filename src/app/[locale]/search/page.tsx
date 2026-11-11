import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { cms } from "@/lib/cms";
import type { SearchResult } from "@/lib/cms/types";
import { href } from "@/i18n/config";
import { formatDate, interpolate } from "@/i18n/format";
import { buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/States";

const ORDER: SearchResult["type"][] = ["pages", "news", "announcements", "documents", "vacancies"];

export async function generateMetadata({ params }: PageProps<"/[locale]/search">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return { ...buildMetadata({ locale, title: t.search.title, description: t.search.lead, path: "/search" }), robots: { index: false } };
}

function highlight(text: string, q: string) {
  const words = q.trim().split(/\s+/).filter((w) => w.length > 1).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!words.length) return text;
  const parts = text.split(new RegExp(`(${words.join("|")})`, "gi"));
  return parts.map((p, i) => (i % 2 === 1 ? <mark key={i} className="bg-gold-300/50 text-inherit">{p}</mark> : p));
}

export default async function SearchPage({ params, searchParams }: PageProps<"/[locale]/search">) {
  const { locale, t } = await pageContext(params);
  const sp = await searchParams;
  const raw = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const q = (raw ?? "").trim().slice(0, 120);
  const type = (Array.isArray(sp.type) ? sp.type[0] : sp.type) as SearchResult["type"] | undefined;
  const results = q.length >= 2 ? await cms.search(locale, q) : [];
  const counts = Object.fromEntries(ORDER.map((k) => [k, results.filter((r) => r.type === k).length])) as Record<SearchResult["type"], number>;
  const shown = type && ORDER.includes(type) ? results.filter((r) => r.type === type) : results;
  const base = href(locale, "/search");

  return (
    <>
      <PageHero title={t.search.title} lead={t.search.lead} breadcrumbs={crumbs(locale, t, { label: t.search.title })} breadcrumbLabel={t.a11y.breadcrumb}>
        <Form action={base} role="search" className="mt-8 flex max-w-2xl">
          <label htmlFor="search-q" className="sr-only">
            {t.search.label}
          </label>
          <input
            id="search-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder={t.common.searchPlaceholder}
            className="h-14 w-full border-0 bg-white px-5 text-lg text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <button type="submit" className="flex h-14 shrink-0 items-center gap-2 bg-gold-500 px-6 font-semibold text-navy-950 hover:bg-gold-300">
            <Search className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">{t.common.search}</span>
          </button>
        </Form>
      </PageHero>

      <div className="container-inst py-14 lg:py-16">
        {q.length < 2 ? (
          <EmptyState title={t.search.title} text={t.search.prompt} />
        ) : results.length === 0 ? (
          <EmptyState title={t.states.emptyTitle} text={interpolate(t.search.noResults, { q })} />
        ) : (
          <div className="grid gap-10 lg:grid-cols-12">
            <aside className="lg:col-span-3">
              <h2 className="mb-1 font-serif text-[1.3rem] font-semibold">{interpolate(t.search.resultsFor, { q })}</h2>
              <p className="mb-6 text-sm text-ink-muted" role="status">
                {results.length === 1 ? t.common.result : interpolate(t.common.results, { count: results.length })}
              </p>
              <nav aria-label={t.common.filter}>
                <ul className="border border-line">
                  {[undefined, ...ORDER].map((k) => {
                    const active = type === k || (!k && !type);
                    const count = k ? counts[k] : results.length;
                    if (k && !count) return null;
                    const link = `${base}?q=${encodeURIComponent(q)}${k ? `&type=${k}` : ""}`;
                    return (
                      <li key={k ?? "all"} className="border-b border-line last:border-b-0">
                        <Link
                          href={link}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center justify-between border-l-[3px] px-4 py-3 text-[0.95rem] font-semibold ${
                            active ? "border-gold-500 bg-navy-900 text-white" : "border-transparent text-navy-900 hover:bg-paper"
                          }`}
                        >
                          {k ? t.search.groups[k] : t.common.allCategories}
                          <span className={`text-xs font-normal ${active ? "text-white/70" : "text-ink-muted"}`}>{count}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            <ol className="lg:col-span-9">
              {shown.map((r, i) => (
                <li key={`${r.type}-${r.href}-${i}`} className="group relative border-b border-line py-6 first:pt-0">
                  <p className="flex flex-wrap items-center gap-x-3 text-[0.78rem] text-ink-muted">
                    <span className="tag">{t.search.groups[r.type]}</span>
                    {r.meta && <span>{r.meta}</span>}
                    {r.date && <time dateTime={r.date}>{formatDate(r.date, locale)}</time>}
                  </p>
                  <h3 className="mt-1.5 font-serif text-[1.2rem] font-semibold text-navy-900">
                    <Link href={r.href} className="after:absolute after:inset-0 group-hover:text-navy-600 group-hover:underline">
                      {highlight(r.title, q)}
                    </Link>
                  </h3>
                  <p className="mt-1.5 text-ink-muted">{highlight(r.excerpt, q)}</p>
                  <ArrowRight className="absolute right-0 top-8 hidden h-5 w-5 text-line transition-colors group-hover:text-navy-600 sm:block" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}
