import type { Locale } from "@/i18n/config";

/* ───────────────────────── shared ───────────────────────── */

export type Media = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Term = {
  slug: string;
  name: string;
};

export type Attachment = {
  title: string;
  url: string;
  /** "PDF", "DOCX", … */
  fileType: string;
  /** Human-readable size, e.g. "1.2 MB" */
  size: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

/* ───────────────────────── content types ───────────────────────── */

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  /** ISO date */
  date: string;
  category: Term;
  image: Media;
  /** Sanitised HTML body */
  html: string;
  /** Author or issuing department */
  author: string;
  attachments: Attachment[];
  featured: boolean;
};

export type AnnouncementCategory = "official" | "notice" | "press" | "update";

export type Announcement = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: AnnouncementCategory;
  html: string;
  attachments: Attachment[];
  important: boolean;
};

export type DocumentSection = "legal" | "transparency" | "publication" | "report";

export type DocumentItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  section: DocumentSection;
  category: Term;
  reference?: string;
  file: Attachment;
};

export type VacancyStatus = "open" | "closed";

export type Vacancy = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  contractType: string;
  published: string;
  deadline: string;
  status: VacancyStatus;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  documents: Attachment[];
};

export type Leader = {
  id: string;
  slug: string;
  name: string;
  role: string;
  /** Short line under the role, e.g. "Mandate 20XX – 20XX" */
  term: string;
  bio: string[];
  portrait: Media;
  order: number;
};

export type Department = {
  id: string;
  name: string;
  description: string;
  responsibilities: string[];
  units: string[];
  /** id of the parent department; null for top level */
  parent: string | null;
  /** Level in the chart: 0 head, 1 leadership support, 2 departments */
  level: 0 | 1 | 2;
};

export type AboutPage = {
  introduction: string[];
  mission: string;
  vision: string;
  values: { title: string; text: string }[];
  mandate: { html: string; legalBasis: { title: string; reference: string }[] };
  history: { year: string; title: string; text: string }[];
  principles: { title: string; text: string }[];
};

export type ActivityArea = {
  id: string;
  title: string;
  text: string;
  icon: "scale" | "search" | "shield" | "users" | "globe" | "file";
};

export type TransparencyCategory = {
  slug: string;
  title: string;
  description: string;
  count: number;
};

export type NavItem = {
  label: string;
  href: string;
  intro?: string;
  children?: { label: string; href: string }[];
};

export type SiteSettings = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  logo: string | null;
  logoLight: string | null;
  logoLines: string[];
  address: { street: string; city: string; mapUrl: string };
  email: string;
  rtiEmail: string;
  pressEmail: string;
  phone: string;
  officeHours: string;
  social: { id: "facebook" | "x" | "linkedin" | "youtube"; label: string; url: string }[];
  partners: { label: string; url: string }[];
};

export type StatItem = { value: number; suffix?: string; label: string; period: string };

export type HomepageData = {
  heroImage: Media;
  stats: { demo: boolean; items: StatItem[] };
};

export type SearchResult = {
  type: "pages" | "news" | "announcements" | "documents" | "vacancies";
  title: string;
  excerpt: string;
  href: string;
  date?: string;
  meta?: string;
};

/* ───────────────────────── queries ───────────────────────── */

export type ListQuery = {
  page?: number;
  perPage?: number;
  q?: string;
  category?: string;
  /** ISO yyyy-mm-dd */
  from?: string;
  to?: string;
  year?: string;
};

export type DocumentQuery = ListQuery & { section: DocumentSection };

/* ───────────────────────── provider contract ───────────────────────── */

/**
 * Every content source (mock, WordPress REST, …) implements this interface.
 * Pages depend only on it, never on a concrete source.
 */
export interface CmsProvider {
  getSiteSettings(locale: Locale): Promise<SiteSettings>;
  getNavigation(locale: Locale): Promise<NavItem[]>;
  getHomepage(locale: Locale): Promise<HomepageData>;
  getAboutPage(locale: Locale): Promise<AboutPage>;
  getActivityAreas(locale: Locale): Promise<ActivityArea[]>;

  getNews(locale: Locale, query?: ListQuery): Promise<Paginated<NewsArticle>>;
  getNewsBySlug(locale: Locale, slug: string): Promise<NewsArticle | null>;
  getNewsCategories(locale: Locale): Promise<Term[]>;
  getRelatedNews(locale: Locale, article: NewsArticle, limit?: number): Promise<NewsArticle[]>;

  getAnnouncements(locale: Locale, query?: ListQuery): Promise<Paginated<Announcement>>;
  getAnnouncementBySlug(locale: Locale, slug: string): Promise<Announcement | null>;

  getDocuments(locale: Locale, query: DocumentQuery): Promise<Paginated<DocumentItem>>;
  getDocumentCategories(locale: Locale, section: DocumentSection): Promise<Term[]>;
  getDocumentYears(locale: Locale, section: DocumentSection): Promise<string[]>;
  getTransparencyCategories(locale: Locale): Promise<TransparencyCategory[]>;

  getVacancies(locale: Locale, status?: VacancyStatus): Promise<Vacancy[]>;
  getVacancyBySlug(locale: Locale, slug: string): Promise<Vacancy | null>;

  getApplicationForms(locale: Locale): Promise<Attachment[]>;

  getPolicyPage(locale: Locale, slug: "privacy" | "accessibility"): Promise<{ html: string } | null>;

  getLeadership(locale: Locale): Promise<Leader[]>;
  getDepartments(locale: Locale): Promise<Department[]>;

  search(locale: Locale, q: string): Promise<SearchResult[]>;
}
