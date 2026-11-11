import type { Localized } from "@/i18n/config";
import { asset } from "@/lib/env";
import type { DocumentSection } from "@/lib/cms/types";

/** DEMO DOCUMENTS — titles are generic; every file links to one sample PDF. */

export const SAMPLE_PDF = asset("/documents/dokument-demonstrues.pdf");

export const documentCategories: Record<DocumentSection, { slug: string; name: Localized; description?: Localized }[]> = {
  legal: [
    { slug: "laws", name: { sq: "Ligje", en: "Laws" } },
    { slug: "regulations", name: { sq: "Rregullore", en: "Regulations" } },
    { slug: "decisions", name: { sq: "Vendime", en: "Decisions" } },
    { slug: "instructions", name: { sq: "Udhëzime zyrtare", en: "Official instructions" } },
    { slug: "policies", name: { sq: "Politika institucionale", en: "Institutional policies" } },
    { slug: "other", name: { sq: "Akte të tjera", en: "Other documents" } },
  ],
  transparency: [
    {
      slug: "public-information",
      name: { sq: "Informacion publik", en: "Public information" },
      description: {
        sq: "Akti i organizimit, funksionet, struktura dhe të dhënat e kontaktit.",
        en: "Organisational act, functions, structure and contact details.",
      },
    },
    {
      slug: "institutional-reports",
      name: { sq: "Raporte institucionale", en: "Institutional reports" },
      description: {
        sq: "Raporte periodike të monitorimit dhe vlerësimit të veprimtarisë.",
        en: "Periodic monitoring and evaluation reports on institutional activity.",
      },
    },
    {
      slug: "annual-reports",
      name: { sq: "Raporte vjetore", en: "Annual reports" },
      description: {
        sq: "Raportet vjetore të veprimtarisë së paraqitura para Kuvendit.",
        en: "Annual activity reports presented to Parliament.",
      },
    },
    {
      slug: "budget",
      name: { sq: "Buxheti dhe informacion financiar", en: "Budget and financial information" },
      description: {
        sq: "Buxheti i miratuar, zbatimi i tij dhe pasqyrat financiare.",
        en: "Approved budget, budget execution and financial statements.",
      },
    },
    {
      slug: "procurement",
      name: { sq: "Prokurimet", en: "Procurement" },
      description: {
        sq: "Plani i prokurimeve, procedurat dhe kontratat e lidhura.",
        en: "Procurement plan, procedures and contracts awarded.",
      },
    },
    {
      slug: "access-requests",
      name: { sq: "Kërkesa për informim", en: "Public access requests" },
      description: {
        sq: "Regjistri i kërkesave dhe përgjigjeve, procedura dhe formularët.",
        en: "Register of requests and responses, procedure and forms.",
      },
    },
    {
      slug: "accountability",
      name: { sq: "Llogaridhënie", en: "Accountability" },
      description: {
        sq: "Dokumente të auditimit, rekomandime dhe masat e zbatimit.",
        en: "Audit documents, recommendations and implementation measures.",
      },
    },
  ],
  publication: [
    { slug: "studies", name: { sq: "Studime dhe analiza", en: "Studies and analyses" } },
    { slug: "guides", name: { sq: "Udhëzues", en: "Guides" } },
    { slug: "bulletins", name: { sq: "Buletine", en: "Bulletins" } },
  ],
  report: [
    { slug: "periodic", name: { sq: "Raporte periodike", en: "Periodic reports" } },
    { slug: "thematic", name: { sq: "Raporte tematike", en: "Thematic reports" } },
    { slug: "annual", name: { sq: "Raporte vjetore", en: "Annual reports" } },
  ],
};

type MockDoc = {
  section: DocumentSection;
  category: string;
  date: string;
  reference?: string;
  size: string;
  title: Localized;
  description: Localized;
};

const d = (
  section: DocumentSection,
  category: string,
  date: string,
  size: string,
  title: Localized,
  description: Localized,
  reference?: string,
): MockDoc => ({ section, category, date, size, title, description, reference });

export const documentItems: MockDoc[] = [
  /* ── Legal framework ── */
  d("legal", "laws", "2024-03-14", "1.4 MB",
    { sq: "Ligji për organizimin dhe funksionimin e institucionit", en: "Law on the organisation and functioning of the institution" },
    { sq: "Ligji bazë që përcakton mandatin, organizimin dhe kompetencat e institucionit.", en: "The founding law defining the mandate, organisation and competences of the institution." },
    "Ligji nr. 00/20XX"),
  d("legal", "laws", "2023-11-02", "860 KB",
    { sq: "Ligji për të drejtën e informimit", en: "Law on the right to information" },
    { sq: "Rregullon të drejtën e publikut për të marrë informacion nga autoritetet publike.", en: "Regulates the public's right to obtain information from public authorities." },
    "Ligji nr. 00/20XX"),
  d("legal", "laws", "2022-06-20", "720 KB",
    { sq: "Ligji për mbrojtjen e të dhënave personale", en: "Law on personal data protection" },
    { sq: "Përcakton rregullat për përpunimin e ligjshëm të të dhënave personale.", en: "Sets out the rules for the lawful processing of personal data." },
    "Ligji nr. 00/20XX"),
  d("legal", "regulations", "2025-02-10", "540 KB",
    { sq: "Rregullorja e funksionimit të brendshëm", en: "Internal functioning regulation" },
    { sq: "Procedurat e brendshme të punës, marrëdhëniet ndërmjet njësive dhe rrjedha e dokumenteve.", en: "Internal working procedures, relations between units and document flow." },
    "Nr. 00, datë 10.02.2025"),
  d("legal", "regulations", "2024-09-05", "410 KB",
    { sq: "Rregullorja për etikën dhe sjelljen profesionale", en: "Regulation on ethics and professional conduct" },
    { sq: "Standardet e sjelljes për punonjësit dhe drejtuesit e institucionit.", en: "Standards of conduct for staff and leadership of the institution." },
    "Nr. 00, datë 05.09.2024"),
  d("legal", "decisions", "2026-10-18", "220 KB",
    { sq: "Vendim për miratimin e planit strategjik afatmesëm", en: "Decision approving the medium-term strategic plan" },
    { sq: "Miratimi i objektivave strategjike dhe treguesve të performancës.", en: "Approval of strategic objectives and performance indicators." },
    "Vendim nr. 00/2026"),
  d("legal", "decisions", "2026-07-03", "190 KB",
    { sq: "Vendim për strukturën dhe organikën e institucionit", en: "Decision on the structure and staffing of the institution" },
    { sq: "Përcaktimi i njësive organizative dhe numrit të punonjësve.", en: "Defining organisational units and staff numbers." },
    "Vendim nr. 00/2026"),
  d("legal", "decisions", "2025-12-15", "175 KB",
    { sq: "Vendim për miratimin e programit të transparencës", en: "Decision approving the transparency programme" },
    { sq: "Miratimi i kategorive të informacionit që publikohen në mënyrë proaktive.", en: "Approval of the categories of proactively published information." },
    "Vendim nr. 00/2025"),
  d("legal", "instructions", "2025-05-22", "310 KB",
    { sq: "Udhëzim për trajtimin e kërkesave për informim", en: "Instruction on handling information requests" },
    { sq: "Procedura dhe afatet për trajtimin e kërkesave nga publiku.", en: "Procedure and deadlines for handling requests from the public." },
    "Udhëzim nr. 00/2025"),
  d("legal", "instructions", "2024-01-30", "280 KB",
    { sq: "Udhëzim për arkivimin e dokumenteve zyrtare", en: "Instruction on archiving official documents" },
    { sq: "Rregullat për ruajtjen, klasifikimin dhe arkivimin e dokumenteve.", en: "Rules for the retention, classification and archiving of documents." },
    "Udhëzim nr. 00/2024"),
  d("legal", "policies", "2025-09-01", "350 KB",
    { sq: "Politika e sigurisë së informacionit", en: "Information security policy" },
    { sq: "Parimet dhe masat për mbrojtjen e sistemeve dhe të dhënave.", en: "Principles and measures for protecting systems and data." }),
  d("legal", "policies", "2024-04-12", "260 KB",
    { sq: "Politika e barazisë gjinore dhe mosdiskriminimit", en: "Gender equality and non-discrimination policy" },
    { sq: "Angazhimet institucionale për barazi dhe mjedis pune gjithëpërfshirës.", en: "Institutional commitments to equality and an inclusive workplace." }),
  d("legal", "other", "2023-07-19", "1.1 MB",
    { sq: "Marrëveshje bashkëpunimi ndërinstitucional", en: "Inter-institutional cooperation agreement" },
    { sq: "Marrëveshje për shkëmbimin e informacionit dhe bashkëpunimin teknik.", en: "Agreement on information exchange and technical cooperation." }),

  /* ── Transparency ── */
  d("transparency", "public-information", "2026-01-15", "300 KB",
    { sq: "Akti i organizimit dhe funksionimit", en: "Act on organisation and functioning" },
    { sq: "Përshkrimi i strukturës organizative, funksioneve dhe detyrave.", en: "Description of the organisational structure, functions and duties." }),
  d("transparency", "public-information", "2026-01-15", "180 KB",
    { sq: "Të dhënat e kontaktit të koordinatorit për të drejtën e informimit", en: "Contact details of the right to information coordinator" },
    { sq: "Emri i funksionit, adresa, telefoni dhe emaili zyrtar.", en: "Function title, address, telephone and official email." }),
  d("transparency", "public-information", "2025-12-20", "240 KB",
    { sq: "Struktura e pagave sipas kategorive të punonjësve", en: "Salary structure by staff category" },
    { sq: "Informacion mbi nivelet e pagave sipas legjislacionit në fuqi.", en: "Information on salary levels under the legislation in force." }),
  d("transparency", "institutional-reports", "2026-07-30", "2.2 MB",
    { sq: "Raporti i monitorimit për gjashtëmujorin e parë", en: "Monitoring report for the first half-year" },
    { sq: "Vlerësimi i zbatimit të planit vjetor të veprimtarisë.", en: "Assessment of the implementation of the annual activity plan." }),
  d("transparency", "annual-reports", "2026-03-28", "4.8 MB",
    { sq: "Raporti vjetor i veprimtarisë 2025", en: "Annual activity report 2025" },
    { sq: "Raporti i plotë vjetor i paraqitur para Kuvendit.", en: "The full annual report presented to Parliament." }),
  d("transparency", "annual-reports", "2025-03-27", "4.5 MB",
    { sq: "Raporti vjetor i veprimtarisë 2024", en: "Annual activity report 2024" },
    { sq: "Raporti i plotë vjetor i paraqitur para Kuvendit.", en: "The full annual report presented to Parliament." }),
  d("transparency", "annual-reports", "2024-03-29", "4.1 MB",
    { sq: "Raporti vjetor i veprimtarisë 2023", en: "Annual activity report 2023" },
    { sq: "Raporti i plotë vjetor i paraqitur para Kuvendit.", en: "The full annual report presented to Parliament." }),
  d("transparency", "budget", "2026-01-10", "620 KB",
    { sq: "Buxheti i miratuar për vitin 2026", en: "Approved budget for 2026" },
    { sq: "Shpërndarja e fondeve sipas programeve dhe artikujve buxhetorë.", en: "Allocation of funds by programme and budget line." }),
  d("transparency", "budget", "2026-10-15", "480 KB",
    { sq: "Raporti i zbatimit të buxhetit, tremujori III 2026", en: "Budget execution report, Q3 2026" },
    { sq: "Realizimi i shpenzimeve krahasuar me planin.", en: "Actual expenditure compared with the plan." }),
  d("transparency", "budget", "2026-04-20", "1.3 MB",
    { sq: "Pasqyrat financiare vjetore 2025", en: "Annual financial statements 2025" },
    { sq: "Pasqyrat financiare të institucionit për vitin buxhetor.", en: "The institution's financial statements for the budget year." }),
  d("transparency", "procurement", "2026-01-25", "390 KB",
    { sq: "Plani vjetor i prokurimeve publike 2026", en: "Annual public procurement plan 2026" },
    { sq: "Lista e procedurave të parashikuara të prokurimit për vitin.", en: "List of procurement procedures planned for the year." }),
  d("transparency", "procurement", "2026-09-30", "270 KB",
    { sq: "Regjistri i realizimit të prokurimeve, tremujori III", en: "Procurement execution register, Q3" },
    { sq: "Procedurat e përfunduara dhe kontratat e lidhura.", en: "Completed procedures and contracts awarded." }),
  d("transparency", "access-requests", "2026-09-25", "310 KB",
    { sq: "Regjistri i kërkesave dhe përgjigjeve, tremujori III 2026", en: "Register of requests and responses, Q3 2026" },
    { sq: "Kërkesat e marra, afatet dhe mënyra e trajtimit.", en: "Requests received, deadlines and how they were handled." }),
  d("transparency", "access-requests", "2025-06-01", "95 KB",
    { sq: "Formulari i kërkesës për informim", en: "Information request form" },
    { sq: "Formular standard për paraqitjen e kërkesës për informim.", en: "Standard form for submitting an information request." }),
  d("transparency", "accountability", "2026-05-14", "1.6 MB",
    { sq: "Raporti i auditimit të jashtëm 2025", en: "External audit report 2025" },
    { sq: "Gjetjet dhe rekomandimet e auditimit të jashtëm.", en: "Findings and recommendations of the external audit." }),
  d("transparency", "accountability", "2026-08-02", "420 KB",
    { sq: "Plani i masave për zbatimin e rekomandimeve", en: "Action plan for implementing recommendations" },
    { sq: "Masat, afatet dhe përgjegjësit për zbatimin e rekomandimeve.", en: "Measures, deadlines and responsible units for implementing recommendations." }),

  /* ── Publications ── */
  d("publication", "studies", "2026-10-01", "2.9 MB",
    { sq: "Studim krahasues mbi standardet europiane të transparencës", en: "Comparative study on European transparency standards" },
    { sq: "Analizë e praktikave të institucioneve homologe europiane.", en: "Analysis of practices of European counterpart institutions." }),
  d("publication", "studies", "2025-11-18", "2.1 MB",
    { sq: "Analizë e perceptimit publik për institucionet", en: "Analysis of public perception of institutions" },
    { sq: "Rezultatet e anketimit kombëtar dhe rekomandime.", en: "Results of the national survey and recommendations." }),
  d("publication", "guides", "2026-06-10", "1.2 MB",
    { sq: "Udhëzues për qytetarët: si të paraqisni një kërkesë për informim", en: "Citizen guide: how to submit an information request" },
    { sq: "Hapat, afatet dhe të drejtat e kërkuesit.", en: "Steps, deadlines and the rights of the requester." }),
  d("publication", "guides", "2025-04-08", "980 KB",
    { sq: "Udhëzues për median mbi komunikimin me institucionin", en: "Media guide to communicating with the institution" },
    { sq: "Procedura e akreditimit, kontaktet dhe kalendari i komunikimeve.", en: "Accreditation procedure, contacts and communication calendar." }),
  d("publication", "bulletins", "2026-09-30", "1.5 MB",
    { sq: "Buletini informativ, tremujori III 2026", en: "Information bulletin, Q3 2026" },
    { sq: "Zhvillimet kryesore dhe të dhëna statistikore të periudhës.", en: "Key developments and statistical data for the period." }),
  d("publication", "bulletins", "2026-06-30", "1.4 MB",
    { sq: "Buletini informativ, tremujori II 2026", en: "Information bulletin, Q2 2026" },
    { sq: "Zhvillimet kryesore dhe të dhëna statistikore të periudhës.", en: "Key developments and statistical data for the period." }),

  /* ── Reports ── */
  d("report", "annual", "2026-03-28", "4.8 MB",
    { sq: "Raporti vjetor i veprimtarisë 2025", en: "Annual activity report 2025" },
    { sq: "Veprimtaria, treguesit e performancës dhe prioritetet.", en: "Activity, performance indicators and priorities." }),
  d("report", "periodic", "2026-10-12", "1.7 MB",
    { sq: "Raporti periodik i veprimtarisë, tremujori III 2026", en: "Periodic activity report, Q3 2026" },
    { sq: "Përmbledhje e veprimtarisë për periudhën korrik–shtator.", en: "Summary of activity for July–September." }),
  d("report", "periodic", "2026-07-11", "1.6 MB",
    { sq: "Raporti periodik i veprimtarisë, tremujori II 2026", en: "Periodic activity report, Q2 2026" },
    { sq: "Përmbledhje e veprimtarisë për periudhën prill–qershor.", en: "Summary of activity for April–June." }),
  d("report", "thematic", "2026-05-25", "2.4 MB",
    { sq: "Raport tematik mbi digjitalizimin e shërbimeve", en: "Thematic report on the digitalisation of services" },
    { sq: "Vlerësim i progresit dhe rekomandime për fazën e ardhshme.", en: "Progress assessment and recommendations for the next phase." }),
  d("report", "thematic", "2025-10-30", "2.0 MB",
    { sq: "Raport tematik mbi bashkëpunimin ndërinstitucional", en: "Thematic report on inter-institutional cooperation" },
    { sq: "Analizë e marrëveshjeve dhe e rezultateve të arritura.", en: "Analysis of agreements and results achieved." }),
];
