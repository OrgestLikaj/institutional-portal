import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { cms } from "@/lib/cms";
import { href, locales } from "@/i18n/config";
import { formatDate } from "@/i18n/format";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { crumbs, pageContext } from "@/lib/page";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DateBlock } from "@/components/ui/DateBlock";
import { ShareButtons } from "@/components/article/ShareButtons";
import { Attachments } from "@/components/article/Attachments";
import { AnnouncementRow } from "@/components/cards/AnnouncementRow";

export async function generateStaticParams() {
  const all = await Promise.all(
    locales.map(async (locale) => (await cms.getAnnouncements(locale, { perPage: 100 })).items.map((a) => ({ locale, slug: a.slug }))),
  );
  return all.flat();
}

export async function generateMetadata({ params }: PageProps<"/[locale]/announcements/[slug]">): Promise<Metadata> {
  const { locale } = await pageContext(params);
  const { slug } = await params;
  const item = await cms.getAnnouncementBySlug(locale, slug);
  if (!item) return {};
  return buildMetadata({ locale, title: item.title, description: item.excerpt, path: `/announcements/${slug}`, type: "article", publishedTime: item.date });
}

export default async function AnnouncementPage({ params }: PageProps<"/[locale]/announcements/[slug]">) {
  const { locale, t } = await pageContext(params);
  const { slug } = await params;
  const item = await cms.getAnnouncementBySlug(locale, slug);
  if (!item) notFound();
  const more = (await cms.getAnnouncements(locale, { category: item.category, perPage: 4 })).items.filter((a) => a.id !== item.id).slice(0, 3);

  return (
    <>
      <header className="border-b border-line bg-paper">
        <div className="container-inst py-10 lg:py-14">
          <Breadcrumbs
            tone="dark"
            label={t.a11y.breadcrumb}
            items={crumbs(locale, t, { label: t.announcements.title, href: href(locale, "/announcements") }, { label: item.title })}
          />
          <div className="mt-10 flex max-w-4xl gap-6">
            <DateBlock iso={item.date} locale={locale} />
            <div>
              <p className="flex flex-wrap items-center gap-3">
                <Link href={href(locale, `/announcements?category=${item.category}`)} className="tag hover:underline">
                  {t.announcements.categories[item.category]}
                </Link>
                {item.important && (
                  <span className="inline-flex items-center gap-1 bg-gold-500/15 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-gold-700">
                    <AlertCircle className="h-3 w-3" aria-hidden="true" />
                    {t.common.important}
                  </span>
                )}
              </p>
              <h1 className="mt-3 text-[1.9rem] font-semibold leading-tight sm:text-[2.4rem]">{item.title}</h1>
              <p className="mt-3 text-sm text-ink-muted">
                {t.common.published} <time dateTime={item.date}>{formatDate(item.date, locale)}</time>
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container-inst grid gap-12 py-12 lg:grid-cols-12 lg:py-16">
        <article className="lg:col-span-8">
          <div className="prose-inst" dangerouslySetInnerHTML={{ __html: item.html }} />
          <Attachments items={item.attachments} title={t.common.attachments} downloadLabel={t.common.download} />
          <Link href={href(locale, "/announcements")} className="link-arrow mt-12">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t.common.backTo} {t.announcements.title.toLowerCase()}
          </Link>
        </article>
        <aside className="space-y-8 lg:col-span-4">
          <ShareButtons url={absoluteUrl(href(locale, `/announcements/${slug}`))} title={item.title} />
          {more.length > 0 && (
            <div>
              <h2 className="mb-4 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-brand-800">{t.announcements.categories[item.category]}</h2>
              <ul className="space-y-3">
                {more.map((a) => (
                  <li key={a.id}>
                    <AnnouncementRow item={a} locale={locale} t={t} tone="paper" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
