import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { NewsArticle } from "@/lib/cms/types";
import { href, type Locale } from "@/i18n/config";
import { formatDate } from "@/i18n/format";

type Props = { article: NewsArticle; locale: Locale; readMore: string; priority?: boolean };

function Meta({ article, locale, light = false }: { article: NewsArticle; locale: Locale; light?: boolean }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] ${light ? "text-white/75" : "text-ink-muted"}`}>
      <span className={`font-semibold uppercase tracking-[0.12em] ${light ? "text-gold-300" : "text-navy-600"}`}>{article.category.name}</span>
      <span aria-hidden="true" className={`h-3 w-px ${light ? "bg-white/30" : "bg-line"}`} />
      <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
    </p>
  );
}

/** Standard news card (image on top). */
export function NewsCard({ article, locale, readMore, priority }: Props) {
  const url = href(locale, `/news/${article.slug}`);
  return (
    <article className="group relative flex h-full flex-col border border-line bg-white transition-colors hover:border-navy-600">
      <div className="relative aspect-[3/2] overflow-hidden bg-navy-50">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Meta article={article} locale={locale} />
        <h3 className="mt-3 text-[1.2rem] font-semibold leading-snug">
          <Link href={url} className="after:absolute after:inset-0 group-hover:text-navy-600">
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-[0.97rem] text-ink-muted">{article.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-navy-600" aria-hidden="true">
          {readMore} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}

/** Large featured article with overlaid title. */
export function NewsFeature({ article, locale, readMore, priority }: Props) {
  const url = href(locale, `/news/${article.slug}`);
  return (
    <article className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden bg-navy-900 lg:min-h-[32rem]">
      <Image
        src={article.image.src}
        alt={article.image.alt}
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        priority={priority}
        className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.02]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent" />
      <div className="relative p-7 sm:p-10">
        <Meta article={article} locale={locale} light />
        <h3 className="mt-4 max-w-2xl text-[1.6rem] font-semibold leading-tight text-white sm:text-[2rem]">
          <Link href={url} className="after:absolute after:inset-0 hover:underline hover:decoration-gold-500 hover:decoration-2 hover:underline-offset-8">
            {article.title}
          </Link>
        </h3>
        <p className="mt-4 max-w-2xl text-white/80">{article.subtitle}</p>
        <span className="mt-6 inline-flex items-center gap-2 border-b border-gold-500 pb-1 text-sm font-semibold text-white" aria-hidden="true">
          {readMore} <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}

/** Compact horizontal item used in side lists. */
export function NewsCompact({ article, locale }: Omit<Props, "readMore">) {
  const url = href(locale, `/news/${article.slug}`);
  return (
    <article className="group relative flex gap-5 border-b border-line py-5 first:pt-0 last:border-b-0">
      <div className="relative hidden aspect-square w-24 shrink-0 overflow-hidden bg-navy-50 sm:block">
        <Image src={article.image.src} alt="" fill sizes="96px" className="object-cover" />
      </div>
      <div>
        <Meta article={article} locale={locale} />
        <h3 className="mt-2 font-serif text-[1.08rem] font-semibold leading-snug text-navy-900">
          <Link href={url} className="after:absolute after:inset-0 group-hover:text-navy-600">
            {article.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
