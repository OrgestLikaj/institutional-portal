import type { Localized } from "@/i18n/config";
import type { AboutPage, ActivityArea } from "@/lib/cms/types";

/** DEMO INSTITUTIONAL PAGE CONTENT — editable placeholder text. */

export const aboutPage: Localized<AboutPage> = {
  sq: {
    introduction: [
      "Institucioni është organ i pavarur publik, i themeluar me ligj, që ushtron funksionet e tij në përputhje me Kushtetutën e Republikës së Shqipërisë dhe legjislacionin në fuqi.",
      "Veprimtaria e institucionit mbështetet në parimet e ligjshmërisë, paanshmërisë, transparencës dhe llogaridhënies. Institucioni raporton çdo vit para Kuvendit dhe e bën publik raportin e veprimtarisë.",
    ],
    mission:
      "Të ushtrojë mandatin e tij ligjor me pavarësi dhe profesionalizëm, duke mbrojtur interesin publik dhe duke garantuar që çdo qytetar të ketë akses të barabartë në informacion dhe në shërbimet institucionale.",
    vision:
      "Një institucion modern, i besueshëm dhe plotësisht transparent, i njohur në nivel kombëtar dhe europian për cilësinë e vendimmarrjes dhe integritetin e tij.",
    values: [
      { title: "Pavarësi", text: "Vendimmarrje e lirë nga ndikimet e jashtme, e bazuar vetëm në ligj dhe në fakte." },
      { title: "Integritet", text: "Standardet më të larta etike në çdo veprim të institucionit dhe të punonjësve të tij." },
      { title: "Transparencë", text: "Informim proaktiv, i plotë dhe i kuptueshëm për publikun." },
      { title: "Profesionalizëm", text: "Ekspertizë, zhvillim i vazhdueshëm dhe cilësi në punë." },
      { title: "Llogaridhënie", text: "Përgjegjësi ndaj Kuvendit, qytetarëve dhe ligjit për çdo vendim." },
      { title: "Respekt", text: "Trajtim i barabartë dhe dinjitoz i çdo personi." },
    ],
    mandate: {
      html: "<p>Institucioni ushtron kompetencat e parashikuara në ligjin e tij organik dhe në aktet e tjera ligjore. Mandati përfshin:</p><ul><li>ushtrimin e funksioneve kryesore të përcaktuara me ligj, në mënyrë të pavarur;</li><li>miratimin e akteve nënligjore për organizimin dhe funksionimin e brendshëm;</li><li>bashkëpunimin me institucionet kombëtare dhe ndërkombëtare;</li><li>raportimin periodik dhe vjetor para Kuvendit;</li><li>informimin e publikut mbi veprimtarinë e tij.</li></ul>",
      legalBasis: [
        { title: "Kushtetuta e Republikës së Shqipërisë", reference: "Neni [XX]" },
        { title: "Ligji për organizimin dhe funksionimin e institucionit", reference: "Ligji nr. 00/20XX" },
        { title: "Ligji për të drejtën e informimit", reference: "Ligji nr. 00/20XX" },
      ],
    },
    history: [
      { year: "20XX", title: "Themelimi", text: "Institucioni themelohet me miratimin e ligjit organik nga Kuvendi." },
      { year: "20XX", title: "Ngritja e strukturave", text: "Miratohet struktura organizative dhe fillon funksionimi i plotë." },
      { year: "20XX", title: "Bashkëpunimi europian", text: "Nënshkruhen marrëveshjet e para me institucione homologe europiane." },
      { year: "20XX", title: "Transformimi digjital", text: "Vihen në funksion shërbimet elektronike dhe portali i transparencës." },
      { year: "2026", title: "Plani strategjik i ri", text: "Miratohet plani strategjik afatmesëm për periudhën e ardhshme." },
    ],
    principles: [
      { title: "Ligjshmëria", text: "Çdo veprim mbështetet në Kushtetutë dhe në ligj." },
      { title: "Ndarja e funksioneve", text: "Përgjegjësi të qarta ndërmjet njësive dhe niveleve drejtuese." },
      { title: "Kolegjialiteti", text: "Vendimet e rëndësishme merren pas konsultimit të brendshëm." },
      { title: "Efikasiteti", text: "Përdorim i përgjegjshëm i burimeve publike." },
    ],
  },
  en: {
    introduction: [
      "The institution is an independent public body established by law, exercising its functions in accordance with the Constitution of the Republic of Albania and the legislation in force.",
      "The institution's work is based on the principles of legality, impartiality, transparency and accountability. It reports annually to Parliament and publishes its activity report.",
    ],
    mission:
      "To exercise its legal mandate with independence and professionalism, protecting the public interest and ensuring that every citizen has equal access to information and institutional services.",
    vision:
      "A modern, trusted and fully transparent institution, recognised nationally and in Europe for the quality of its decision-making and its integrity.",
    values: [
      { title: "Independence", text: "Decision-making free from external influence, based solely on the law and the facts." },
      { title: "Integrity", text: "The highest ethical standards in every action of the institution and its staff." },
      { title: "Transparency", text: "Proactive, complete and understandable information for the public." },
      { title: "Professionalism", text: "Expertise, continuous development and quality of work." },
      { title: "Accountability", text: "Responsibility to Parliament, citizens and the law for every decision." },
      { title: "Respect", text: "Equal and dignified treatment of every person." },
    ],
    mandate: {
      html: "<p>The institution exercises the competences provided for in its organic law and other legal acts. Its mandate includes:</p><ul><li>independently exercising the core functions defined by law;</li><li>adopting secondary acts on internal organisation and functioning;</li><li>cooperating with national and international institutions;</li><li>periodic and annual reporting to Parliament;</li><li>informing the public about its activity.</li></ul>",
      legalBasis: [
        { title: "Constitution of the Republic of Albania", reference: "Article [XX]" },
        { title: "Law on the organisation and functioning of the institution", reference: "Law no. 00/20XX" },
        { title: "Law on the right to information", reference: "Law no. 00/20XX" },
      ],
    },
    history: [
      { year: "20XX", title: "Establishment", text: "The institution is established with the adoption of its organic law by Parliament." },
      { year: "20XX", title: "Building the structures", text: "The organisational structure is approved and full operation begins." },
      { year: "20XX", title: "European cooperation", text: "The first agreements with European counterpart institutions are signed." },
      { year: "20XX", title: "Digital transformation", text: "Electronic services and the transparency portal are launched." },
      { year: "2026", title: "New strategic plan", text: "The medium-term strategic plan for the coming period is adopted." },
    ],
    principles: [
      { title: "Legality", text: "Every action is grounded in the Constitution and the law." },
      { title: "Separation of functions", text: "Clear responsibilities between units and management levels." },
      { title: "Collegiality", text: "Important decisions are taken after internal consultation." },
      { title: "Efficiency", text: "Responsible use of public resources." },
    ],
  },
};

export const activityAreas: Localized<ActivityArea[]> = {
  sq: [
    { id: "core", icon: "scale", title: "Funksionet kushtetuese", text: "Ushtrimi i kompetencave kryesore të përcaktuara në Kushtetutë dhe në ligjin organik." },
    { id: "investigations", icon: "search", title: "Hetime dhe verifikime", text: "Shqyrtimi i çështjeve, verifikimi i fakteve dhe hartimi i konkluzioneve të argumentuara." },
    { id: "prevention", icon: "shield", title: "Parandalim dhe integritet", text: "Masa parandaluese, udhëzime dhe rekomandime për institucionet publike." },
    { id: "public", icon: "users", title: "Shërbime për publikun", text: "Pritja e qytetarëve, trajtimi i kërkesave dhe ankesave, informimi." },
    { id: "international", icon: "globe", title: "Bashkëpunim ndërkombëtar", text: "Marrëveshje, projekte të përbashkëta dhe shkëmbim ekspertize me partnerët europianë." },
    { id: "reporting", icon: "file", title: "Raportim dhe publikime", text: "Raporte periodike, tematike dhe vjetore, studime dhe buletine." },
  ],
  en: [
    { id: "core", icon: "scale", title: "Constitutional functions", text: "Exercising the core competences defined in the Constitution and the organic law." },
    { id: "investigations", icon: "search", title: "Investigations and verification", text: "Examining cases, verifying facts and drafting reasoned conclusions." },
    { id: "prevention", icon: "shield", title: "Prevention and integrity", text: "Preventive measures, guidance and recommendations for public institutions." },
    { id: "public", icon: "users", title: "Public services", text: "Receiving citizens, handling requests and complaints, providing information." },
    { id: "international", icon: "globe", title: "International cooperation", text: "Agreements, joint projects and exchange of expertise with European partners." },
    { id: "reporting", icon: "file", title: "Reporting and publications", text: "Periodic, thematic and annual reports, studies and bulletins." },
  ],
};
