import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { pageContext } from "@/lib/page";
import { PolicyPage } from "@/components/PolicyPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.policy.privacyTitle, description: t.policy.privacyLead, path: "/privacy" });
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale, t } = await pageContext(params);
  return <PolicyPage locale={locale} t={t} slug="privacy" title={t.policy.privacyTitle} lead={t.policy.privacyLead} />;
}
