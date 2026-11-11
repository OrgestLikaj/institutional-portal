import type { Localized } from "@/i18n/config";
import type { AnnouncementCategory } from "@/lib/cms/types";

/** DEMO ANNOUNCEMENTS — bilingual placeholder content. */
type MockAnnouncement = {
  id: string;
  slug: string;
  date: string;
  category: AnnouncementCategory;
  important?: boolean;
  attachment?: boolean;
  title: Localized;
  excerpt: Localized;
};

export const announcementItems: MockAnnouncement[] = [
  {
    id: "a1",
    slug: "njoftim-per-shtyp-10-nentor-2026",
    date: "2026-11-10T15:00:00+01:00",
    category: "press",
    title: { sq: "Njoftim për shtyp, 10 nëntor 2026", en: "Press release, 10 November 2026" },
    excerpt: {
      sq: "Institucioni informon publikun mbi përfundimin e procedurës së shqyrtimit të raportit tremujor.",
      en: "The institution informs the public of the completion of the review procedure for the quarterly report.",
    },
  },
  {
    id: "a2",
    slug: "ndryshim-i-orarit-te-pritjes-se-publikut",
    date: "2026-11-08T09:00:00+01:00",
    category: "official",
    important: true,
    title: {
      sq: "Ndryshim i përkohshëm i orarit të pritjes së publikut",
      en: "Temporary change to public reception hours",
    },
    excerpt: {
      sq: "Nga data 15 deri më 30 nëntor, pritja e publikut do të zhvillohet çdo ditë nga ora 09:00 deri në 13:00.",
      en: "From 15 to 30 November, the public will be received every day from 09:00 to 13:00.",
    },
  },
  {
    id: "a3",
    slug: "konsultim-publik-per-projektrregulloren-e-brendshme",
    date: "2026-11-04T10:00:00+01:00",
    category: "notice",
    attachment: true,
    title: {
      sq: "Konsultim publik për projektrregulloren e funksionimit të brendshëm",
      en: "Public consultation on the draft internal functioning regulation",
    },
    excerpt: {
      sq: "Palët e interesuara mund të dërgojnë komentet e tyre brenda 20 ditëve nga data e publikimit.",
      en: "Interested parties may submit their comments within 20 days of publication.",
    },
  },
  {
    id: "a4",
    slug: "njoftim-per-shtyp-6-nentor-2026",
    date: "2026-11-06T16:00:00+01:00",
    category: "press",
    title: { sq: "Njoftim për shtyp, 6 nëntor 2026", en: "Press release, 6 November 2026" },
    excerpt: {
      sq: "Sqarim zyrtar lidhur me informacionet e publikuara në media mbi veprimtarinë e institucionit.",
      en: "Official clarification regarding information published in the media on the institution's activity.",
    },
  },
  {
    id: "a5",
    slug: "publikimi-i-planit-vjetor-te-prokurimeve",
    date: "2026-10-30T11:00:00+01:00",
    category: "update",
    attachment: true,
    title: {
      sq: "Publikohet plani vjetor i prokurimeve publike",
      en: "Annual public procurement plan published",
    },
    excerpt: {
      sq: "Plani është i disponueshëm në seksionin e transparencës, kategoria Prokurimet.",
      en: "The plan is available in the transparency section, under Procurement.",
    },
  },
  {
    id: "a6",
    slug: "njoftim-per-shtyp-28-tetor-2026",
    date: "2026-10-28T14:00:00+01:00",
    category: "press",
    title: { sq: "Njoftim për shtyp, 28 tetor 2026", en: "Press release, 28 October 2026" },
    excerpt: {
      sq: "Përmbledhje e takimeve institucionale të zhvilluara gjatë javës.",
      en: "Summary of institutional meetings held during the week.",
    },
  },
  {
    id: "a7",
    slug: "thirrje-per-praktika-profesionale",
    date: "2026-10-20T09:00:00+02:00",
    category: "notice",
    title: {
      sq: "Thirrje për aplikime në programin e praktikave profesionale",
      en: "Call for applications to the professional internship programme",
    },
    excerpt: {
      sq: "Programi u drejtohet të diplomuarve të rinj në drejtësi, ekonomi dhe shkenca sociale.",
      en: "The programme is open to recent graduates in law, economics and social sciences.",
    },
  },
  {
    id: "a8",
    slug: "mirembajtje-e-planifikuar-e-sistemeve-elektronike",
    date: "2026-10-15T12:00:00+02:00",
    category: "update",
    title: {
      sq: "Mirëmbajtje e planifikuar e sistemeve elektronike",
      en: "Scheduled maintenance of electronic systems",
    },
    excerpt: {
      sq: "Shërbimet elektronike mund të mos jenë të disponueshme të shtunën nga ora 08:00 deri në 12:00.",
      en: "Electronic services may be unavailable on Saturday from 08:00 to 12:00.",
    },
  },
  {
    id: "a9",
    slug: "akreditimi-i-medias-per-konferencen-vjetore",
    date: "2026-10-10T10:00:00+02:00",
    category: "official",
    title: {
      sq: "Akreditimi i medias për konferencën vjetore",
      en: "Media accreditation for the annual conference",
    },
    excerpt: {
      sq: "Gazetarët e interesuar duhet të paraqesin kërkesën për akreditim deri më 24 tetor.",
      en: "Interested journalists must submit their accreditation request by 24 October.",
    },
  },
  {
    id: "a10",
    slug: "njoftim-per-shtyp-2-tetor-2026",
    date: "2026-10-02T15:00:00+02:00",
    category: "press",
    title: { sq: "Njoftim për shtyp, 2 tetor 2026", en: "Press release, 2 October 2026" },
    excerpt: {
      sq: "Institucioni njofton nënshkrimin e marrëveshjes së bashkëpunimit ndërinstitucional.",
      en: "The institution announces the signing of an inter-institutional cooperation agreement.",
    },
  },
  {
    id: "a11",
    slug: "regjistri-i-kerkesave-per-informim-perditesohet",
    date: "2026-09-25T09:00:00+02:00",
    category: "update",
    title: {
      sq: "Përditësohet regjistri i kërkesave dhe përgjigjeve",
      en: "Register of requests and responses updated",
    },
    excerpt: {
      sq: "Regjistri përfshin të gjitha kërkesat e trajtuara gjatë tremujorit të tretë.",
      en: "The register includes all requests handled during the third quarter.",
    },
  },
  {
    id: "a12",
    slug: "njoftim-per-festat-zyrtare",
    date: "2026-09-10T09:00:00+02:00",
    category: "official",
    title: { sq: "Njoftim për ditët e festave zyrtare", en: "Notice on official public holidays" },
    excerpt: {
      sq: "Gjatë ditëve të festave zyrtare, zyrat e pritjes së publikut do të jenë të mbyllura.",
      en: "During official public holidays, the public reception offices will be closed.",
    },
  },
];

export const announcementBodyTail: Localized = {
  sq: `<p>Për informacion të mëtejshëm, të interesuarit mund të kontaktojnë institucionit nëpërmjet kanaleve zyrtare të komunikimit të publikuara në faqen e kontaktit.</p>
<p><em>Tekst demonstrues — do të zëvendësohet me njoftimin zyrtar.</em></p>`,
  en: `<p>For further information, interested parties may contact the institution through the official communication channels published on the contact page.</p>
<p><em>Demonstration text — to be replaced with the official announcement.</em></p>`,
};
