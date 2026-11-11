import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { pageContext } from "@/lib/page";
import { PolicyPage } from "@/components/PolicyPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/accessibility">): Promise<Metadata> {
  const { locale, t } = await pageContext(params);
  return buildMetadata({ locale, title: t.policy.accessibilityTitle, description: t.policy.accessibilityLead, path: "/accessibility" });
}

export default async function AccessibilityPage({ params }: PageProps<"/[locale]/accessibility">) {
  const { locale, t } = await pageContext(params);
  return <PolicyPage locale={locale} t={t} slug="accessibility" title={t.policy.accessibilityTitle} lead={t.policy.accessibilityLead} />;
}
