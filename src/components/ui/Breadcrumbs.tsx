import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { absoluteUrl } from "@/lib/seo";

export type Crumb = { label: string; href?: string };

/** Accessible breadcrumb trail + schema.org BreadcrumbList. */
export function Breadcrumbs({ items, label, tone = "light" }: { items: Crumb[]; label: string; tone?: "light" | "dark" }) {
  const light = tone === "light";
  return (
    <nav aria-label={label}>
      <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.85rem] ${light ? "text-white/70" : "text-ink-muted"}`}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />}
              {item.href && !last ? (
                <Link href={item.href} className={`inline-flex items-center gap-1.5 hover:underline ${light ? "hover:text-white" : "hover:text-brand-900"}`}>
                  {i === 0 && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={`line-clamp-1 ${last ? (light ? "text-white" : "text-brand-900") : ""}`}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            ...(item.href ? { item: absoluteUrl(item.href) } : {}),
          })),
        }}
      />
    </nav>
  );
}
