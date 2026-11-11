import { Info } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Shown on every page while the site is a prototype, so the public preview
 * cannot be mistaken for the institution's official website.
 * Disable only for the approved production site: NEXT_PUBLIC_DEMO_BANNER=false.
 */
export const showDemoBanner = process.env.NEXT_PUBLIC_DEMO_BANNER !== "false";

export function DemoBanner({ t }: { t: Dictionary }) {
  if (!showDemoBanner) return null;
  return (
    <div role="note" aria-label={t.demo.label} className="bg-gold-500 text-brand-950">
      <p className="container-inst flex items-start justify-center gap-2 py-2 text-center text-[0.8rem] font-semibold leading-snug sm:items-center">
        <Info className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" aria-hidden="true" />
        {t.demo.banner}
      </p>
    </div>
  );
}
