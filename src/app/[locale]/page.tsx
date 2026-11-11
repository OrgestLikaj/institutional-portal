import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { LatestNews } from "@/components/home/LatestNews";
import { AnnouncementsSection } from "@/components/home/AnnouncementsSection";
import { QuickAccess } from "@/components/home/QuickAccess";
import { FeaturedDocuments } from "@/components/home/FeaturedDocuments";
import { Statistics } from "@/components/home/Statistics";
import { ContactLocation } from "@/components/home/ContactLocation";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return buildMetadata({ locale, description: t.meta.defaultDescription, path: "/" });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const t = getDictionary(locale);

  const [settings, home, about, news, announcements, press, legal, transparency, publications] = await Promise.all([
    cms.getSiteSettings(locale),
    cms.getHomepage(locale),
    cms.getAboutPage(locale),
    cms.getNews(locale, { perPage: 4 }),
    cms.getAnnouncements(locale, { perPage: 12 }),
    cms.getAnnouncements(locale, { category: "press", perPage: 4 }),
    cms.getDocuments(locale, { section: "legal", category: "decisions", perPage: 1 }),
    cms.getDocuments(locale, { section: "transparency", category: "annual-reports", perPage: 1 }),
    cms.getDocuments(locale, { section: "publication", perPage: 2 }),
  ]);

  const official = announcements.items.filter((a) => a.category !== "press").slice(0, 4);
  const docs = [...transparency.items, ...legal.items, ...publications.items];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "GovernmentOrganization",
          name: settings.name,
          description: settings.description,
          url: absoluteUrl(`/${locale}`),
          email: settings.email,
          telephone: settings.phone,
          address: { "@type": "PostalAddress", streetAddress: settings.address.street, addressLocality: settings.address.city, addressCountry: "AL" },
        }}
      />
      <Hero locale={locale} t={t} name={settings.name} image={home.heroImage} latest={announcements.items[0]} />
      <Intro locale={locale} t={t} about={about} />
      <LatestNews locale={locale} t={t} items={news.items} />
      <AnnouncementsSection locale={locale} t={t} announcements={official} press={press.items} />
      <QuickAccess locale={locale} t={t} />
      <FeaturedDocuments locale={locale} t={t} docs={docs} />
      <Statistics locale={locale} t={t} stats={home.stats} />
      <ContactLocation locale={locale} t={t} settings={settings} />
    </>
  );
}
