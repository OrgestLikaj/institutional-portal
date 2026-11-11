import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  link,
  tone = "dark",
  id,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
  tone?: "dark" | "light";
  id?: string;
  as?: "h2" | "h3";
}) {
  const light = tone === "light";
  return (
    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className={`eyebrow mb-4 ${light ? "eyebrow-light" : ""}`}>{eyebrow}</p>}
        <Tag id={id} className={`text-[1.9rem] font-semibold sm:text-[2.3rem] ${light ? "text-white" : "text-brand-900"}`}>
          {title}
        </Tag>
        {description && <p className={`mt-4 text-[1.05rem] ${light ? "text-white/75" : "text-ink-muted"}`}>{description}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className={`group inline-flex shrink-0 items-center gap-2 border-b pb-1 text-[0.95rem] font-semibold transition-colors ${
            light ? "border-gold-300 text-white hover:text-gold-300" : "border-brand-900 text-brand-900 hover:border-brand-600 hover:text-brand-600"
          }`}
        >
          {link.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
