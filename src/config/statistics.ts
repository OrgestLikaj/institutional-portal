import type { Localized } from "@/i18n/config";

/**
 * Homepage statistics.
 * ⚠ DEMONSTRATION DATA ONLY — these are not real institutional figures.
 * `demo: true` keeps the "Demonstration data" label visible on the page.
 * Replace with official figures (or the CMS "Statistics" options field) before going live.
 */
export const statistics: { demo: boolean; items: { value: number; suffix?: string; label: Localized; period: Localized }[] } = {
  demo: true,
  items: [
    {
      value: 1250,
      label: { sq: "Çështje të trajtuara", en: "Cases handled" },
      period: { sq: "Viti demonstrues", en: "Demonstration year" },
    },
    {
      value: 340,
      label: { sq: "Akte dhe vendime të publikuara", en: "Acts and decisions published" },
      period: { sq: "Viti demonstrues", en: "Demonstration year" },
    },
    {
      value: 96,
      suffix: "%",
      label: { sq: "Kërkesa për informim të përgjigjura në afat", en: "Information requests answered on time" },
      period: { sq: "Viti demonstrues", en: "Demonstration year" },
    },
    {
      value: 48,
      label: { sq: "Marrëveshje bashkëpunimi", en: "Cooperation agreements" },
      period: { sq: "Gjithsej", en: "In total" },
    },
  ],
};
