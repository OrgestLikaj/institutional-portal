import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, CalendarDays, Tag } from "lucide-react";
import { cms } from "@/lib/cms";
import { href, locales } from "@/i18n/config";
import { formatDate } from "@/i18n/format";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NewsCard } from "@/components/cards/NewsCard";
import { ShareButtons } from "@/components/article/ShareButtons";
import { Attachments } from "@/components/article/Attachments";

export async function generateStaticParams() {
  const all = await Promise.all(locales.map(async (locale) => (await cms.getNews(locale, { perPage: 100 })).items.map((n) => ({ locale, slug: n.slug }))));
  return all.flat();
}

export async function generateMetadata({ params }: PageProps<"/[locale]/news/[slug]">): Promise<Metadata> {
  const { locale } = await pageContext(params);
  const { slug } = await params;
  const article = await cms.getNewsBySlug(locale, slug);
  if (!article) return {};
  return buildMetadata({
    locale,
    title: article.title,
    description: article.subtitle || article.excerpt,
    path: `/news/${slug}`,
    image: article.image.src,
    type: "article",
    publishedTime: article.date,
  });
}

export default async function ArticlePage({ params }: PageProps<"/[locale]/news/[slug]">) {
  const { locale, t } = await pageContext(params);
  const { slug } = await params;
  const article = await cms.getNewsBySlug(locale, slug);
  if (!article) notFound();
  const [related, settings] = await Promise.all([cms.getRelatedNews(locale, article, 3), cms.getSiteSettings(locale)]);
  const url = absoluteUrl(href(locale, `/news/${slug}`));

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          image: [absoluteUrl(article.image.src)],
          author: { "@type": "Organization", name: article.author || settings.name },
          publisher: { "@type": "GovernmentOrganization", name: settings.name },
          mainEntityOfPage: url,
        }}
      />

      <header className="border-b border-line bg-paper">
        <div className="container-inst py-10 lg:py-14">
          <Breadcrumbs
            tone="dark"
            label={t.a11y.breadcrumb}
            items={crumbs(locale, t, { label: t.news.title, href: href(locale, "/news") }, { label: article.title })}
          />
          <div className="mt-10 max-w-4xl">
            <Link href={href(locale, `/news?category=${article.category.slug}`)} className="tag hover:underline">
              {article.category.name}
            </Link>
            <h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.15] sm:text-[2.8rem]">{article.title}</h1>
            {article.subtitle && <p className="mt-5 font-serif text-[1.3rem] leading-relaxed text-navy-800">{article.subtitle}</p>}
            <p className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.92rem] text-ink-muted">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-navy-600" aria-hidden="true" />
                {t.common.published} <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
              </span>
              {article.author && (
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-navy-600" aria-hidden="true" />
                  {article.author}
                </span>
              )}
            </p>
          </div>
        </div>
      </header>

      <div className="container-inst grid gap-12 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-8">
          <figure>
            <div className="relative aspect-[3/2] overflow-hidden bg-navy-50">
              <Image src={article.image.src} alt={article.image.alt} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-2 text-sm text-ink-muted">{article.image.alt}</figcaption>
          </figure>

          <div className="prose-inst mt-10" dangerouslySetInnerHTML={{ __html: article.html }} />

          <Attachments items={article.attachments} title={t.common.attachments} downloadLabel={t.common.download} />

          <Link href={href(locale, "/news")} className="link-arrow mt-12">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t.common.backTo} {t.news.title.toLowerCase()}
          </Link>
        </div>

        <aside className="lg:col-span-4">
          <div className="space-y-8 lg:sticky lg:top-40">
            <dl className="border-t-[3px] border-navy-900 bg-paper p-6 text-[0.95rem]">
              <div className="flex gap-3 border-b border-line pb-4">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" aria-hidden="true" />
                <div>
                  <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">{t.common.date}</dt>
                  <dd className="mt-0.5 text-navy-900">{formatDate(article.date, locale)}</dd>
                </div>
              </div>
              <div className="flex gap-3 border-b border-line py-4">
                <Tag className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" aria-hidden="true" />
                <div>
                  <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">{t.common.category}</dt>
                  <dd className="mt-0.5 text-navy-900">{article.category.name}</dd>
                </div>
              </div>
              {article.author && (
                <div className="flex gap-3 pt-4">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" aria-hidden="true" />
                  <div>
                    <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">{t.common.author}</dt>
                    <dd className="mt-0.5 text-navy-900">{article.author}</dd>
                  </div>
                </div>
              )}
            </dl>
            <ShareButtons url={url} title={article.title} />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-line bg-paper py-16">
          <div className="container-inst">
            <SectionHeader id="related-title" title={t.common.related} link={{ href: href(locale, "/news"), label: t.common.viewAll }} />
            <ul className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <NewsCard article={r} locale={locale} readMore={t.common.readMore} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
