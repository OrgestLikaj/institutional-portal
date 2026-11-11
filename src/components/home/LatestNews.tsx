import type { NewsArticle } from "@/lib/cms/types";
import { href, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NewsCompact, NewsFeature } from "@/components/cards/NewsCard";
import { Reveal } from "@/components/ui/Reveal";

export function LatestNews({ locale, t, items }: { locale: Locale; t: Dictionary; items: NewsArticle[] }) {
  const [lead, ...rest] = items;
  if (!lead) return null;
  return (
    <section aria-labelledby="news-title" className="border-t border-line bg-paper py-20 lg:py-24">
      <div className="container-inst">
        <SectionHeader id="news-title" eyebrow={t.home.newsEyebrow} title={t.home.newsTitle} link={{ href: href(locale, "/news"), label: t.common.viewAll }} />
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <NewsFeature article={lead} locale={locale} readMore={t.common.readMore} />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="h-full border border-line bg-white p-6 sm:p-8">
              <p className="mb-6 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">{t.news.featured}</p>
              {rest.slice(0, 3).map((article) => (
                <NewsCompact key={article.id} article={article} locale={locale} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
