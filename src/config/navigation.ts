import type { Dictionary } from "@/i18n/dictionaries/sq";

/**
 * Main navigation (mock / fallback).
 * Labels are dictionary keys under `nav.*` so they translate automatically.
 * Add, rename, reorder or remove items here — header, mega-menu, mobile menu,
 * footer and sitemap all read from this structure.
 * With WordPress connected, a WP menu (location "primary") replaces it.
 */
export type NavKey = keyof Dictionary["nav"];

export type NavConfigItem = {
  key: NavKey;
  path: string;
  /** Key under `navIntro.*` shown in the mega-menu intro column */
  intro?: keyof Dictionary["navIntro"];
  children?: { key: NavKey; path: string }[];
};

export const navigation: NavConfigItem[] = [
  { key: "home", path: "/" },
  {
    key: "about",
    path: "/about",
    intro: "about",
    children: [
      { key: "profile", path: "/about" },
      { key: "missionVision", path: "/about#mission" },
      { key: "structure", path: "/about/structure" },
      { key: "leadership", path: "/about/leadership" },
    ],
  },
  {
    key: "activities",
    path: "/activities",
    intro: "activities",
    children: [
      { key: "institutionalActivities", path: "/activities" },
      { key: "reports", path: "/activities/reports" },
      { key: "publications", path: "/activities/publications" },
    ],
  },
  {
    key: "newsMedia",
    path: "/news",
    intro: "newsMedia",
    children: [
      { key: "latestNews", path: "/news" },
      { key: "announcements", path: "/announcements" },
      { key: "pressReleases", path: "/announcements?category=press" },
    ],
  },
  {
    key: "legal",
    path: "/legal",
    intro: "legal",
    children: [
      { key: "lawsRegulations", path: "/legal?category=laws" },
      { key: "decisions", path: "/legal?category=decisions" },
      { key: "officialDocuments", path: "/legal" },
    ],
  },
  {
    key: "transparency",
    path: "/transparency",
    intro: "transparency",
    children: [
      { key: "publicInformation", path: "/transparency/public-information" },
      { key: "annualReports", path: "/transparency/annual-reports" },
      { key: "budget", path: "/transparency/budget" },
      { key: "procurement", path: "/transparency/procurement" },
    ],
  },
  { key: "careers", path: "/careers" },
  { key: "contact", path: "/contact" },
];

/** Links in the thin utility bar above the masthead */
export const utilityLinks: { key: NavKey; path: string }[] = [
  { key: "transparency", path: "/transparency" },
  { key: "careers", path: "/careers" },
  { key: "contact", path: "/contact" },
];

/** Footer link columns */
export const footerColumns: { title: "about" | "usefulLinks" | "information"; links: { key: NavKey; path: string }[] }[] = [
  {
    title: "about",
    links: [
      { key: "profile", path: "/about" },
      { key: "structure", path: "/about/structure" },
      { key: "leadership", path: "/about/leadership" },
      { key: "institutionalActivities", path: "/activities" },
    ],
  },
  {
    title: "usefulLinks",
    links: [
      { key: "latestNews", path: "/news" },
      { key: "announcements", path: "/announcements" },
      { key: "legal", path: "/legal" },
      { key: "careers", path: "/careers" },
    ],
  },
  {
    title: "information",
    links: [
      { key: "transparency", path: "/transparency" },
      { key: "annualReports", path: "/transparency/annual-reports" },
      { key: "procurement", path: "/transparency/procurement" },
      { key: "search", path: "/search" },
    ],
  },
];
