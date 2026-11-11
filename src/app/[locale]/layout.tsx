import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Open_Sans } from "next/font/google";
import { isLocale, locales, localeMeta } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/I18nProvider";
import { cms } from "@/lib/cms";
import { SITE_URL, buildMetadata } from "@/lib/seo";
import { SkipLink } from "@/components/layout/SkipLink";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const openSans = Open_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-open-sans", display: "swap" });

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#4A1A1B",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const settings = await cms.getSiteSettings(locale);
  const t = getDictionary(locale);
  return {
    ...buildMetadata({ locale, description: t.meta.defaultDescription, path: "/" }),
    metadataBase: new URL(SITE_URL),
    title: { default: settings.name, template: `%s | ${settings.shortName}` },
    applicationName: settings.name,
    // Prototype: keep it out of search engines until approved (set NEXT_PUBLIC_ALLOW_INDEXING=true for production)
    robots: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    // suppressHydrationWarning: browser extensions (e.g. Grammarly) inject attributes on <html>/<body>
    // before React hydrates. It only silences attribute diffs on these two elements, not their children.
    <html lang={localeMeta[locale].htmlLang} className={openSans.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <I18nProvider locale={locale} dictionary={t}>
            <SkipLink label={t.a11y.skipToContent} />
            <DemoBanner t={t} />
            <SiteHeader locale={locale} />
            <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <SiteFooter locale={locale} />
        </I18nProvider>
      </body>
    </html>
  );
}
