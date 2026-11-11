import { href, type Locale } from "@/i18n/config";
import { asset } from "@/lib/env";
import { getDictionary } from "@/i18n/dictionaries";
import { institution } from "@/config/institution";
import { navigation } from "@/config/navigation";
import { statistics } from "@/config/statistics";
import { newsItems, newsCategories, newsBodyTail } from "@/data/mock/news";
import { announcementItems, announcementBodyTail } from "@/data/mock/announcements";
import { documentItems, documentCategories, SAMPLE_PDF } from "@/data/mock/documents";
import { vacancyItems, vacancyDocuments } from "@/data/mock/vacancies";
import { leaderItems, departmentItems } from "@/data/mock/organisation";
import { aboutPage, activityAreas } from "@/data/mock/pages";
import { policyPages } from "@/data/mock/policies";
import { byDateDesc, inDateRange, matchesText, paginate } from "../query";
import type {
  Announcement,
  CmsProvider,
  DocumentItem,
  DocumentSection,
  NewsArticle,
  SearchResult,
  Vacancy,
} from "../types";

/**
 * Mock CMS provider — serves bilingual demo content from src/data/mock.
 * Mirrors the WordPress provider's behaviour (filtering, pagination, search)
 * so the UI behaves identically in both modes.
 */

const NEWS_IMAGES = 6;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toNews(locale: Locale, n: (typeof newsItems)[number]): NewsArticle {
  const cat = newsCategories.find((c) => c.slug === n.category)!;
  const imgIndex = ((n.image - 1) % NEWS_IMAGES) + 1;
  return {
    id: n.id,
    slug: n.slug,
    title: n.title[locale],
    subtitle: n.subtitle[locale],
    excerpt: n.excerpt[locale],
    date: n.date,
    category: { slug: cat.slug, name: cat.name[locale] },
    image: {
      src: asset(`/images/news-${imgIndex}.svg`),
      alt: locale === "sq" ? "Ilustrim arkitektonik neutral" : "Neutral architectural illustration",
      width: 1200,
      height: 800,
    },
    html: n.lead[locale].map((p) => `<p>${p}</p>`).join("") + newsBodyTail[locale],
    author: n.author[locale],
    attachments: n.attachments
      ? [
          {
            title: locale === "sq" ? "Dokumenti i plotë (PDF)" : "Full document (PDF)",
            url: SAMPLE_PDF,
            fileType: "PDF",
            size: "1.2 MB",
          },
        ]
      : [],
    featured: Boolean(n.featured),
  };
}

function toAnnouncement(locale: Locale, a: (typeof announcementItems)[number]): Announcement {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title[locale],
    excerpt: a.excerpt[locale],
    date: a.date,
    category: a.category,
    important: Boolean(a.important),
    html: `<p>${a.excerpt[locale]}</p>` + announcementBodyTail[locale],
    attachments: a.attachment
      ? [{ title: locale === "sq" ? "Dokumenti zyrtar" : "Official document", url: SAMPLE_PDF, fileType: "PDF", size: "240 KB" }]
      : [],
  };
}

function toDocument(locale: Locale, doc: (typeof documentItems)[number], index: number): DocumentItem {
  const cat = documentCategories[doc.section].find((c) => c.slug === doc.category)!;
  return {
    id: `d${index + 1}`,
    slug: slugify(doc.title.sq),
    title: doc.title[locale],
    description: doc.description[locale],
    date: doc.date,
    section: doc.section,
    category: { slug: cat.slug, name: cat.name[locale] },
    reference: doc.reference,
    file: { title: doc.title[locale], url: SAMPLE_PDF, fileType: "PDF", size: doc.size },
  };
}

function toVacancy(locale: Locale, v: (typeof vacancyItems)[number]): Vacancy {
  return {
    id: v.id,
    slug: v.slug,
    title: v.title[locale],
    department: v.department[locale],
    location: locale === "sq" ? "Tiranë" : "Tirana",
    contractType: v.contractType[locale],
    published: v.published,
    deadline: v.deadline,
    status: v.status,
    summary: v.summary[locale],
    responsibilities: v.responsibilities[locale],
    requirements: v.requirements[locale],
    documents: vacancyDocuments.map((d) => ({ title: d[locale], url: SAMPLE_PDF, fileType: "PDF", size: "120 KB" })),
  };
}

const allNews = (locale: Locale) => newsItems.map((n) => toNews(locale, n)).sort(byDateDesc);
const allAnnouncements = (locale: Locale) => announcementItems.map((a) => toAnnouncement(locale, a)).sort(byDateDesc);
const allDocuments = (locale: Locale) => documentItems.map((d, i) => toDocument(locale, d, i)).sort(byDateDesc);

/** Simulated latency so loading states can be seen during the demo (set MOCK_LATENCY_MS). */
const latency = Number(process.env.MOCK_LATENCY_MS ?? 0);
const wait = () => (latency > 0 ? new Promise((r) => setTimeout(r, latency)) : Promise.resolve());

export const mockProvider: CmsProvider = {
  async getSiteSettings(locale) {
    return {
      name: institution.name[locale],
      shortName: institution.shortName[locale],
      tagline: institution.tagline[locale],
      description: institution.description[locale],
      logo: institution.logo,
      address: {
        street: institution.address.street[locale],
        city: institution.address.city[locale],
        mapUrl: institution.address.mapUrl,
      },
      email: institution.email,
      rtiEmail: institution.rtiEmail,
      pressEmail: institution.pressEmail,
      phone: institution.phone,
      officeHours: institution.officeHours[locale],
      social: institution.social.filter((s): s is typeof s & { url: string } => Boolean(s.url)),
      partners: institution.partners.map((p) => ({ label: p.label[locale], url: p.url })),
    };
  },

  async getNavigation(locale) {
    const t = getDictionary(locale);
    return navigation.map((item) => ({
      label: t.nav[item.key],
      href: href(locale, item.path),
      intro: item.intro ? t.navIntro[item.intro] : undefined,
      children: item.children?.map((c) => ({ label: t.nav[c.key], href: href(locale, c.path) })),
    }));
  },

  async getHomepage(locale) {
    return {
      heroImage: {
        src: asset("/images/hero-facade.svg"),
        alt: locale === "sq" ? "Ilustrim i fasadës së një ndërtese institucionale" : "Illustration of an institutional building facade",
        width: 1600,
        height: 1000,
      },
      stats: {
        demo: statistics.demo,
        items: statistics.items.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label[locale], period: s.period[locale] })),
      },
    };
  },

  async getAboutPage(locale) {
    return aboutPage[locale];
  },

  async getActivityAreas(locale) {
    return activityAreas[locale];
  },

  async getNews(locale, query = {}) {
    await wait();
    const items = allNews(locale).filter(
      (n) =>
        (!query.category || n.category.slug === query.category) &&
        inDateRange(n.date, query.from, query.to) &&
        matchesText(query.q, n.title, n.subtitle, n.excerpt),
    );
    return paginate(items, query);
  },

  async getNewsBySlug(locale, slug) {
    return allNews(locale).find((n) => n.slug === slug) ?? null;
  },

  async getNewsCategories(locale) {
    return newsCategories.map((c) => ({ slug: c.slug, name: c.name[locale] }));
  },

  async getRelatedNews(locale, article, limit = 3) {
    const others = allNews(locale).filter((n) => n.id !== article.id);
    const same = others.filter((n) => n.category.slug === article.category.slug);
    return [...same, ...others.filter((n) => !same.includes(n))].slice(0, limit);
  },

  async getAnnouncements(locale, query = {}) {
    await wait();
    const items = allAnnouncements(locale).filter(
      (a) =>
        (!query.category || a.category === query.category) &&
        inDateRange(a.date, query.from, query.to) &&
        matchesText(query.q, a.title, a.excerpt),
    );
    return paginate(items, { perPage: 10, ...query });
  },

  async getAnnouncementBySlug(locale, slug) {
    return allAnnouncements(locale).find((a) => a.slug === slug) ?? null;
  },

  async getDocuments(locale, query) {
    await wait();
    const items = allDocuments(locale).filter(
      (d) =>
        d.section === query.section &&
        (!query.category || d.category.slug === query.category) &&
        (!query.year || d.date.startsWith(query.year)) &&
        matchesText(query.q, d.title, d.description, d.reference),
    );
    return paginate(items, { perPage: 10, ...query });
  },

  async getDocumentCategories(locale, section: DocumentSection) {
    return documentCategories[section].map((c) => ({ slug: c.slug, name: c.name[locale] }));
  },

  async getDocumentYears(locale, section) {
    const years = new Set(allDocuments(locale).filter((d) => d.section === section).map((d) => d.date.slice(0, 4)));
    return [...years].sort().reverse();
  },

  async getTransparencyCategories(locale) {
    const docs = allDocuments(locale).filter((d) => d.section === "transparency");
    return documentCategories.transparency.map((c) => ({
      slug: c.slug,
      title: c.name[locale],
      description: c.description?.[locale] ?? "",
      count: docs.filter((d) => d.category.slug === c.slug).length,
    }));
  },

  async getVacancies(locale, status) {
    return vacancyItems
      .map((v) => toVacancy(locale, v))
      .filter((v) => !status || v.status === status)
      .sort((a, b) => b.published.localeCompare(a.published));
  },

  async getVacancyBySlug(locale, slug) {
    const v = vacancyItems.find((x) => x.slug === slug);
    return v ? toVacancy(locale, v) : null;
  },

  async getApplicationForms(locale) {
    const forms = [
      { sq: "Formulari standard i aplikimit", en: "Standard application form", size: "120 KB" },
      { sq: "Deklarata për vërtetësinë e të dhënave", en: "Declaration on the accuracy of information", size: "85 KB" },
      { sq: "Udhëzues për kandidatët", en: "Guide for candidates", size: "640 KB" },
    ];
    return forms.map((f) => ({ title: f[locale], url: SAMPLE_PDF, fileType: "PDF", size: f.size }));
  },

  async getPolicyPage(locale, slug) {
    return { html: policyPages[slug][locale] };
  },

  async getLeadership(locale) {
    return leaderItems
      .map((l) => ({
        id: l.id,
        slug: l.slug,
        name: l.name[locale],
        role: l.role[locale],
        term: l.term[locale],
        bio: l.bio[locale],
        order: l.order,
        portrait: {
          src: asset("/images/portrait-placeholder.svg"),
          alt: locale === "sq" ? `Fotografi vendmbajtëse — ${l.role.sq}` : `Placeholder photograph — ${l.role.en}`,
          width: 600,
          height: 750,
        },
      }))
      .sort((a, b) => a.order - b.order);
  },

  async getDepartments(locale) {
    return departmentItems.map((d) => ({
      id: d.id,
      parent: d.parent,
      level: d.level,
      name: d.name[locale],
      description: d.description[locale],
      responsibilities: d.responsibilities[locale],
      units: d.units[locale],
    }));
  },

  async search(locale, q) {
    await wait();
    const t = getDictionary(locale);
    const results: SearchResult[] = [];

    const pages: { title: string; excerpt: string; path: string }[] = [
      { title: t.about.title, excerpt: t.about.lead, path: "/about" },
      { title: t.structure.title, excerpt: t.structure.lead, path: "/about/structure" },
      { title: t.leadership.title, excerpt: t.leadership.lead, path: "/about/leadership" },
      { title: t.activities.title, excerpt: t.activities.lead, path: "/activities" },
      { title: t.activities.reportsTitle, excerpt: t.activities.reportsLead, path: "/activities/reports" },
      { title: t.activities.publicationsTitle, excerpt: t.activities.publicationsLead, path: "/activities/publications" },
      { title: t.legal.title, excerpt: t.legal.lead, path: "/legal" },
      { title: t.transparency.title, excerpt: t.transparency.lead, path: "/transparency" },
      { title: t.careers.title, excerpt: t.careers.lead, path: "/careers" },
      { title: t.contact.title, excerpt: t.contact.lead, path: "/contact" },
      { title: t.policy.privacyTitle, excerpt: t.policy.privacyLead, path: "/privacy" },
      { title: t.policy.accessibilityTitle, excerpt: t.policy.accessibilityLead, path: "/accessibility" },
    ];
    pages
      .filter((p) => matchesText(q, p.title, p.excerpt))
      .forEach((p) => results.push({ type: "pages", title: p.title, excerpt: p.excerpt, href: href(locale, p.path) }));

    allNews(locale)
      .filter((n) => matchesText(q, n.title, n.subtitle, n.excerpt, n.category.name))
      .forEach((n) =>
        results.push({ type: "news", title: n.title, excerpt: n.excerpt, href: href(locale, `/news/${n.slug}`), date: n.date, meta: n.category.name }),
      );

    allAnnouncements(locale)
      .filter((a) => matchesText(q, a.title, a.excerpt))
      .forEach((a) =>
        results.push({
          type: "announcements",
          title: a.title,
          excerpt: a.excerpt,
          href: href(locale, `/announcements/${a.slug}`),
          date: a.date,
          meta: t.announcements.categories[a.category],
        }),
      );

    const sectionPath: Record<DocumentSection, (cat: string) => string> = {
      legal: (c) => `/legal?category=${c}`,
      transparency: (c) => `/transparency/${c}`,
      publication: (c) => `/activities/publications?category=${c}`,
      report: (c) => `/activities/reports?category=${c}`,
    };
    allDocuments(locale)
      .filter((d) => matchesText(q, d.title, d.description, d.reference, d.category.name))
      .forEach((d) =>
        results.push({
          type: "documents",
          title: d.title,
          excerpt: d.description,
          href: href(locale, sectionPath[d.section](d.category.slug)),
          date: d.date,
          meta: d.category.name,
        }),
      );

    (await this.getVacancies(locale))
      .filter((v) => matchesText(q, v.title, v.department, v.summary))
      .forEach((v) =>
        results.push({
          type: "vacancies",
          title: v.title,
          excerpt: v.department,
          href: href(locale, `/careers/${v.slug}`),
          date: v.published,
          meta: v.status === "open" ? t.careers.open : t.careers.closed,
        }),
      );

    return results;
  },
};
