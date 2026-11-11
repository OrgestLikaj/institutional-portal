import "server-only";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { mockProvider } from "../mock";
import { DEFAULT_PER_PAGE } from "../query";
import { sanitizeHtml, stripTags } from "../sanitize";
import { wpFetch } from "./client";
import type {
  AboutPage,
  Announcement,
  AnnouncementCategory,
  Attachment,
  CmsProvider,
  Department,
  DocumentItem,
  DocumentSection,
  Leader,
  ListQuery,
  Media,
  NavItem,
  NewsArticle,
  Paginated,
  SearchResult,
  SiteSettings,
  Term,
  Vacancy,
} from "../types";

/**
 * WordPress (headless) provider.
 * Expects the content model registered by wordpress/mu-plugins/institution-content-model.php
 * (custom post types, taxonomies, ACF fields with "Show in REST", custom endpoints).
 * Field names are documented in docs/WORDPRESS.md.
 */

/* ───────────── loose WP REST shapes ───────────── */
type WpRendered = { rendered: string };
type WpTerm = { id: number; slug: string; name: string; taxonomy: string };
type WpMedia = { source_url: string; alt_text?: string; media_details?: { width?: number; height?: number } };
type WpFile = { url: string; filename?: string; filesize?: number; subtype?: string; title?: string } | false | null;
type WpPost = {
  id: number;
  slug: string;
  date: string;
  title: WpRendered;
  excerpt?: WpRendered;
  content?: WpRendered;
  acf?: Record<string, unknown>;
  menu_order?: number;
  _embedded?: { "wp:featuredmedia"?: WpMedia[]; "wp:term"?: WpTerm[][] };
};

/* ───────────── mapping helpers ───────────── */
const SECTION_ENDPOINT: Record<DocumentSection, { base: string; taxonomy: string }> = {
  legal: { base: "legal-documents", taxonomy: "document_category" },
  transparency: { base: "transparency-documents", taxonomy: "document_category" },
  report: { base: "reports", taxonomy: "document_category" },
  publication: { base: "publications", taxonomy: "publication_type" },
};

const text = (v: unknown): string => (typeof v === "string" ? v : "");
const lines = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((row) => (typeof row === "string" ? row : text((row as Record<string, unknown>)?.text))).filter(Boolean) : text(v).split("\n").map((s) => s.trim()).filter(Boolean);

function formatBytes(bytes?: number): string {
  if (!bytes) return "";
  return bytes > 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`;
}

function toAttachment(file: WpFile, fallbackTitle: string): Attachment | null {
  if (!file || !file.url) return null;
  return {
    title: file.title || fallbackTitle,
    url: file.url,
    fileType: (file.subtype || file.url.split(".").pop() || "PDF").toUpperCase(),
    size: formatBytes(file.filesize),
  };
}

function attachmentsFrom(acf: Record<string, unknown> | undefined, key = "attachments"): Attachment[] {
  const rows = (acf?.[key] as { file?: WpFile; title?: string }[] | undefined) ?? [];
  return rows.map((r) => toAttachment(r.file ?? null, r.title ?? "")).filter((a): a is Attachment => Boolean(a));
}

function featured(post: WpPost, fallbackAlt: string): Media {
  const m = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!m?.source_url) return { src: "/images/news-1.svg", alt: fallbackAlt, width: 1200, height: 800 };
  return {
    src: m.source_url,
    alt: m.alt_text || fallbackAlt,
    width: m.media_details?.width ?? 1200,
    height: m.media_details?.height ?? 800,
  };
}

function firstTerm(post: WpPost, taxonomy: string): Term {
  const term = post._embedded?.["wp:term"]?.flat().find((t) => t.taxonomy === taxonomy);
  return term ? { slug: term.slug, name: term.name } : { slug: "", name: "" };
}

function mapNews(p: WpPost): NewsArticle {
  const title = stripTags(p.title.rendered);
  return {
    id: String(p.id),
    slug: p.slug,
    title,
    subtitle: text(p.acf?.subtitle),
    excerpt: stripTags(p.excerpt?.rendered ?? ""),
    date: p.date,
    category: firstTerm(p, "news_category"),
    image: featured(p, title),
    html: sanitizeHtml(p.content?.rendered ?? ""),
    author: text(p.acf?.author_department),
    attachments: attachmentsFrom(p.acf),
    featured: Boolean(p.acf?.is_featured),
  };
}

function mapAnnouncement(p: WpPost): Announcement {
  return {
    id: String(p.id),
    slug: p.slug,
    title: stripTags(p.title.rendered),
    excerpt: stripTags(p.excerpt?.rendered ?? ""),
    date: p.date,
    category: (text(p.acf?.announcement_type) || "official") as AnnouncementCategory,
    html: sanitizeHtml(p.content?.rendered ?? ""),
    attachments: attachmentsFrom(p.acf),
    important: Boolean(p.acf?.is_important),
  };
}

function mapDocument(p: WpPost, section: DocumentSection): DocumentItem {
  const title = stripTags(p.title.rendered);
  const file = toAttachment((p.acf?.file as WpFile) ?? null, title) ?? { title, url: "#", fileType: "PDF", size: "" };
  return {
    id: String(p.id),
    slug: p.slug,
    title,
    description: text(p.acf?.description) || stripTags(p.excerpt?.rendered ?? ""),
    date: text(p.acf?.document_date) || p.date,
    section,
    category: firstTerm(p, SECTION_ENDPOINT[section].taxonomy),
    reference: text(p.acf?.reference_number) || undefined,
    file,
  };
}

function mapVacancy(p: WpPost): Vacancy {
  const deadline = text(p.acf?.deadline);
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: String(p.id),
    slug: p.slug,
    title: stripTags(p.title.rendered),
    department: text(p.acf?.department),
    location: text(p.acf?.location),
    contractType: text(p.acf?.contract_type),
    published: p.date.slice(0, 10),
    deadline,
    status: text(p.acf?.status) === "closed" || (deadline && deadline < today) ? "closed" : "open",
    summary: stripTags(p.excerpt?.rendered ?? ""),
    responsibilities: lines(p.acf?.responsibilities),
    requirements: lines(p.acf?.requirements),
    documents: attachmentsFrom(p.acf, "application_documents"),
  };
}

const embed = { _embed: "wp:featuredmedia,wp:term" };

async function termId(taxonomy: string, slug: string | undefined, locale: Locale): Promise<number | undefined> {
  if (!slug) return undefined;
  const { data } = await wpFetch<WpTerm[]>(`/wp/v2/${taxonomy}`, { slug }, { locale, tags: [taxonomy] });
  return data[0]?.id ?? -1; // -1 → no matching posts rather than ignoring the filter
}

function dateParams(query: ListQuery) {
  const from = query.year ? `${query.year}-01-01` : query.from;
  const to = query.year ? `${query.year}-12-31` : query.to;
  return {
    after: from ? `${from}T00:00:00` : undefined,
    before: to ? `${to}T23:59:59` : undefined,
  };
}

async function list<T>(
  base: string,
  locale: Locale,
  query: ListQuery,
  map: (p: WpPost) => T,
  extra: Record<string, string | number | undefined> = {},
  perPage = DEFAULT_PER_PAGE,
): Promise<Paginated<T>> {
  const page = query.page ?? 1;
  const res = await wpFetch<WpPost[]>(
    `/wp/v2/${base}`,
    { ...embed, page, per_page: query.perPage ?? perPage, search: query.q, ...dateParams(query), ...extra },
    { locale, tags: [base] },
  );
  return { items: res.data.map(map), total: res.total, page, perPage: query.perPage ?? perPage, totalPages: Math.max(1, res.totalPages) };
}

/* ───────────── provider ───────────── */
export const wordpressProvider: CmsProvider = {
  async getSiteSettings(locale) {
    const fallback = await mockProvider.getSiteSettings(locale);
    try {
      const { data } = await wpFetch<Partial<SiteSettings>>("/inst/v1/settings", {}, { locale, tags: ["settings"] });
      return { ...fallback, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== "" && v != null)) } as SiteSettings;
    } catch {
      return fallback; // keep the masthead and footer rendering if the CMS is unreachable
    }
  },

  async getNavigation(locale) {
    try {
      const { data } = await wpFetch<NavItem[]>("/inst/v1/menu/primary", {}, { locale, tags: ["menu"] });
      if (Array.isArray(data) && data.length) return data;
    } catch {
      /* fall through */
    }
    return mockProvider.getNavigation(locale);
  },

  async getHomepage(locale) {
    const fallback = await mockProvider.getHomepage(locale);
    try {
      const { data } = await wpFetch<{ hero_image?: Media; stats?: { demo: boolean; items: { value: number; suffix?: string; label: string; period: string }[] } }>(
        "/inst/v1/homepage",
        {},
        { locale, tags: ["homepage"] },
      );
      return { heroImage: data.hero_image ?? fallback.heroImage, stats: data.stats?.items?.length ? data.stats : fallback.stats };
    } catch {
      return fallback;
    }
  },

  async getAboutPage(locale) {
    const { data } = await wpFetch<WpPost[]>("/wp/v2/pages", { slug: "about", acf_format: "standard" }, { locale, tags: ["pages"] });
    const acf = data[0]?.acf;
    if (!acf) return mockProvider.getAboutPage(locale);
    return {
      introduction: lines(acf.introduction),
      mission: text(acf.mission),
      vision: text(acf.vision),
      values: (acf.values as AboutPage["values"]) ?? [],
      mandate: { html: sanitizeHtml(text(acf.mandate)), legalBasis: (acf.legal_basis as AboutPage["mandate"]["legalBasis"]) ?? [] },
      history: (acf.history as AboutPage["history"]) ?? [],
      principles: (acf.principles as AboutPage["principles"]) ?? [],
    };
  },

  async getActivityAreas(locale) {
    try {
      const { data } = await wpFetch<Awaited<ReturnType<CmsProvider["getActivityAreas"]>>>("/inst/v1/activity-areas", {}, { locale, tags: ["settings"] });
      if (data.length) return data;
    } catch {
      /* fall through */
    }
    return mockProvider.getActivityAreas(locale);
  },

  async getNews(locale, query = {}) {
    const cat = await termId("news_category", query.category, locale);
    return list("news", locale, query, mapNews, { news_category: cat });
  },

  async getNewsBySlug(locale, slug) {
    const { data } = await wpFetch<WpPost[]>("/wp/v2/news", { ...embed, slug }, { locale, tags: ["news"] });
    return data[0] ? mapNews(data[0]) : null;
  },

  async getNewsCategories(locale) {
    const { data } = await wpFetch<WpTerm[]>("/wp/v2/news_category", { per_page: 50, hide_empty: "true" }, { locale, tags: ["news_category"] });
    return data.map((t) => ({ slug: t.slug, name: t.name }));
  },

  async getRelatedNews(locale, article, limit = 3) {
    const res = await this.getNews(locale, { category: article.category.slug || undefined, perPage: limit + 1 });
    return res.items.filter((n) => n.id !== article.id).slice(0, limit);
  },

  async getAnnouncements(locale, query = {}) {
    return list("announcements", locale, query, mapAnnouncement, { announcement_type: query.category }, 10);
  },

  async getAnnouncementBySlug(locale, slug) {
    const { data } = await wpFetch<WpPost[]>("/wp/v2/announcements", { slug }, { locale, tags: ["announcements"] });
    return data[0] ? mapAnnouncement(data[0]) : null;
  },

  async getDocuments(locale, query) {
    const { base, taxonomy } = SECTION_ENDPOINT[query.section];
    const cat = await termId(taxonomy, query.category, locale);
    return list(base, locale, query, (p) => mapDocument(p, query.section), { [taxonomy]: cat }, 10);
  },

  async getDocumentCategories(locale, section) {
    const { taxonomy } = SECTION_ENDPOINT[section];
    const { data } = await wpFetch<WpTerm[]>(`/wp/v2/${taxonomy}`, { per_page: 50, post_type: SECTION_ENDPOINT[section].base }, { locale, tags: [taxonomy] });
    return data.map((t) => ({ slug: t.slug, name: t.name }));
  },

  async getDocumentYears(locale, section) {
    const { data } = await wpFetch<string[]>(`/inst/v1/years/${SECTION_ENDPOINT[section].base}`, {}, { locale, tags: [SECTION_ENDPOINT[section].base] });
    return data;
  },

  async getTransparencyCategories(locale) {
    const { data } = await wpFetch<(WpTerm & { description: string; count: number })[]>(
      "/wp/v2/document_category",
      { per_page: 50, post_type: "transparency-documents" },
      { locale, tags: ["document_category"] },
    );
    return data.map((t) => ({ slug: t.slug, title: t.name, description: t.description, count: t.count }));
  },

  async getVacancies(locale, status) {
    const { data } = await wpFetch<WpPost[]>("/wp/v2/vacancies", { per_page: 50 }, { locale, tags: ["vacancies"] });
    return data.map(mapVacancy).filter((v) => !status || v.status === status);
  },

  async getVacancyBySlug(locale, slug) {
    const { data } = await wpFetch<WpPost[]>("/wp/v2/vacancies", { slug }, { locale, tags: ["vacancies"] });
    return data[0] ? mapVacancy(data[0]) : null;
  },

  async getApplicationForms(locale) {
    try {
      const { data } = await wpFetch<{ application_forms?: { title: string; file: WpFile }[] }>("/inst/v1/settings", {}, { locale, tags: ["settings"] });
      return (data.application_forms ?? []).map((f) => toAttachment(f.file, f.title)).filter((a): a is Attachment => Boolean(a));
    } catch {
      return [];
    }
  },

  async getPolicyPage(locale, slug) {
    const { data } = await wpFetch<WpPost[]>("/wp/v2/pages", { slug }, { locale, tags: ["pages"] });
    return data[0] ? { html: sanitizeHtml(data[0].content?.rendered ?? "") } : mockProvider.getPolicyPage(locale, slug);
  },

  async getLeadership(locale) {
    const { data } = await wpFetch<WpPost[]>("/wp/v2/leaders", { ...embed, per_page: 50, orderby: "menu_order", order: "asc" }, { locale, tags: ["leaders"] });
    return data.map(
      (p): Leader => ({
        id: String(p.id),
        slug: p.slug,
        name: stripTags(p.title.rendered),
        role: text(p.acf?.role),
        term: text(p.acf?.term),
        bio: (p.content?.rendered ?? "").split(/<\/p>/i).map(stripTags).filter(Boolean),
        portrait: featured(p, text(p.acf?.role)),
        order: p.menu_order ?? 0,
      }),
    );
  },

  async getDepartments(locale) {
    const { data } = await wpFetch<WpPost[]>("/wp/v2/departments", { per_page: 100, orderby: "menu_order", order: "asc" }, { locale, tags: ["departments"] });
    return data.map(
      (p): Department => ({
        id: text(p.acf?.key) || String(p.id),
        name: stripTags(p.title.rendered),
        description: stripTags(p.excerpt?.rendered ?? ""),
        responsibilities: lines(p.acf?.responsibilities),
        units: lines(p.acf?.units),
        parent: text(p.acf?.parent_key) || null,
        level: (Number(p.acf?.level) || 2) as Department["level"],
      }),
    );
  },

  async search(locale, q) {
    const t = getDictionary(locale);
    const [news, announcements, vacancies, ...docs] = await Promise.all([
      this.getNews(locale, { q, perPage: 10 }),
      this.getAnnouncements(locale, { q, perPage: 10 }),
      this.getVacancies(locale),
      ...(Object.keys(SECTION_ENDPOINT) as DocumentSection[]).map((section) => this.getDocuments(locale, { section, q, perPage: 10 })),
    ]);
    const results: SearchResult[] = [
      ...news.items.map((n) => ({ type: "news" as const, title: n.title, excerpt: n.excerpt, href: href(locale, `/news/${n.slug}`), date: n.date, meta: n.category.name })),
      ...announcements.items.map((a) => ({
        type: "announcements" as const,
        title: a.title,
        excerpt: a.excerpt,
        href: href(locale, `/announcements/${a.slug}`),
        date: a.date,
        meta: t.announcements.categories[a.category],
      })),
      ...docs.flatMap((d) => d.items).map((d) => ({ type: "documents" as const, title: d.title, excerpt: d.description, href: d.file.url, date: d.date, meta: d.category.name })),
      ...vacancies
        .filter((v) => v.title.toLowerCase().includes(q.toLowerCase()))
        .map((v) => ({ type: "vacancies" as const, title: v.title, excerpt: v.department, href: href(locale, `/careers/${v.slug}`), date: v.published })),
    ];
    return results;
  },
};
