import type { Localized } from "@/i18n/config";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CENTRAL INSTITUTIONAL CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every replaceable piece of institutional identity lives here.
 *  The token in each comment ([INSTITUTION_NAME], …) is the placeholder name
 *  used in the project brief and documentation.
 *
 *  When WordPress is connected, the "Site Settings" ACF options page overrides
 *  these values at runtime (see docs/WORDPRESS.md). This file remains the
 *  fallback and the source of truth for the mock/demo mode.
 *
 *  All values below are neutral placeholders. Do not add real names.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const institution = {
  /** [INSTITUTION_NAME] */
  name: {
    sq: "Emri i Institucionit",
    en: "Institution Name",
  } satisfies Localized,

  /** [INSTITUTION_SHORT_NAME] */
  shortName: {
    sq: "EMRI",
    en: "NAME",
  } satisfies Localized,

  /** Line under the name in the masthead */
  tagline: {
    sq: "Institucion i pavarur kushtetues",
    en: "Independent constitutional institution",
  } satisfies Localized,

  /** [INSTITUTION_LOGO] — path in /public or absolute URL. Leave null to use the built-in emblem placeholder. */
  logo: null as string | null,

  /** [INSTITUTION_DESCRIPTION] */
  description: {
    sq: "Institucioni është organ i pavarur publik, i krijuar me ligj, që ushtron funksionet e tij në përputhje me Kushtetutën dhe legjislacionin në fuqi, në shërbim të interesit publik.",
    en: "The institution is an independent public body established by law, exercising its functions in accordance with the Constitution and the legislation in force, in service of the public interest.",
  } satisfies Localized,

  /** [INSTITUTION_ADDRESS] */
  address: {
    street: { sq: "Rruga [Emri i rrugës], Nr. 00", en: "[Street name] Street, No. 00" } satisfies Localized,
    city: { sq: "Tiranë 1001, Shqipëri", en: "Tirana 1001, Albania" } satisfies Localized,
    /** Link opened by the "Open in maps" button. Neutral city-level link. */
    mapUrl: "https://www.openstreetmap.org/#map=14/41.3275/19.8187",
  },

  /** [INSTITUTION_EMAIL] — uses the reserved .example domain until approved */
  email: "info@institucioni.example",
  /** Right-to-information coordinator email */
  rtiEmail: "informim@institucioni.example",
  pressEmail: "media@institucioni.example",

  /** [INSTITUTION_PHONE] */
  phone: "+355 4 000 0000",

  officeHours: {
    sq: "E hënë – E enjte: 08:00 – 16:30 · E premte: 08:00 – 14:00",
    en: "Monday – Thursday: 08:00 – 16:30 · Friday: 08:00 – 14:00",
  } satisfies Localized,

  /** [INSTITUTION_DIRECTOR] — used where the head of the institution is named generically */
  director: {
    sq: "[Emri Mbiemri]",
    en: "[Name Surname]",
  } satisfies Localized,

  /** Year the institution was established (placeholder) */
  established: "20XX",

  /** [SOCIAL_MEDIA_LINK] — placeholder profiles; set url to null to hide */
  social: [
    { id: "facebook", label: "Facebook", url: "https://facebook.com/" },
    { id: "x", label: "X", url: "https://x.com/" },
    { id: "linkedin", label: "LinkedIn", url: "https://linkedin.com/" },
    { id: "youtube", label: "YouTube", url: "https://youtube.com/" },
  ] as { id: "facebook" | "x" | "linkedin" | "youtube"; label: string; url: string | null }[],

  /** Footer "partner institutions" row — placeholders */
  partners: [
    { label: { sq: "Institucioni partner I", en: "Partner institution I" }, url: "#" },
    { label: { sq: "Institucioni partner II", en: "Partner institution II" }, url: "#" },
    { label: { sq: "Institucioni partner III", en: "Partner institution III" }, url: "#" },
    { label: { sq: "Institucioni partner IV", en: "Partner institution IV" }, url: "#" },
    { label: { sq: "Portali qeveritar i shërbimeve", en: "Government services portal" }, url: "#" },
  ] as { label: Localized; url: string }[],
};

export type InstitutionConfig = typeof institution;
