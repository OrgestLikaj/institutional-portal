import type { Localized } from "@/i18n/config";
import type { VacancyStatus } from "@/lib/cms/types";

/** DEMO VACANCIES — placeholder recruitment data. */
type MockVacancy = {
  id: string;
  slug: string;
  status: VacancyStatus;
  published: string;
  deadline: string;
  title: Localized;
  department: Localized;
  contractType: Localized;
  summary: Localized;
  responsibilities: Localized<string[]>;
  requirements: Localized<string[]>;
};

const permanent = { sq: "Marrëdhënie pune me kohë të pacaktuar", en: "Permanent employment" };
const fixed = { sq: "Kontratë me afat të caktuar (12 muaj)", en: "Fixed-term contract (12 months)" };

export const vacancyItems: MockVacancy[] = [
  {
    id: "v1",
    slug: "specialist-ne-drejtorine-juridike",
    status: "open",
    published: "2026-11-03",
    deadline: "2026-11-24",
    title: { sq: "Specialist/e në Drejtorinë Juridike", en: "Specialist, Legal Directorate" },
    department: { sq: "Drejtoria Juridike", en: "Legal Directorate" },
    contractType: permanent,
    summary: {
      sq: "Pozicioni mbështet hartimin dhe shqyrtimin e akteve ligjore e nënligjore të institucionit.",
      en: "The position supports the drafting and review of the institution's legal and secondary acts.",
    },
    responsibilities: {
      sq: [
        "Harton dhe shqyrton projektakte, marrëveshje dhe opinione ligjore.",
        "Përfaqëson institucionin në procedura administrative, sipas autorizimit.",
        "Ndjek ndryshimet legjislative dhe propozon përshtatjen e akteve të brendshme.",
      ],
      en: [
        "Drafts and reviews draft acts, agreements and legal opinions.",
        "Represents the institution in administrative procedures, as authorised.",
        "Monitors legislative changes and proposes the alignment of internal acts.",
      ],
    },
    requirements: {
      sq: [
        "Diplomë master shkencor/profesional në drejtësi.",
        "Përvojë pune jo më pak se 3 vjet në fushën juridike.",
        "Njohuri shumë të mira të gjuhës angleze.",
      ],
      en: [
        "Master's degree in law.",
        "At least 3 years of work experience in the legal field.",
        "Very good command of English.",
      ],
    },
  },
  {
    id: "v2",
    slug: "analist-ne-drejtorine-e-analizes-dhe-statistikave",
    status: "open",
    published: "2026-10-30",
    deadline: "2026-11-20",
    title: { sq: "Analist/e statistikash", en: "Statistical Analyst" },
    department: { sq: "Drejtoria e Analizës dhe Statistikave", en: "Directorate of Analysis and Statistics" },
    contractType: permanent,
    summary: {
      sq: "Pozicioni përgjigjet për përpunimin dhe analizën e të dhënave institucionale.",
      en: "The position is responsible for processing and analysing institutional data.",
    },
    responsibilities: {
      sq: [
        "Mbledh, përpunon dhe analizon të dhënat statistikore.",
        "Përgatit raporte periodike dhe tregues të performancës.",
        "Kontribuon në hartimin e buletineve dhe raportit vjetor.",
      ],
      en: [
        "Collects, processes and analyses statistical data.",
        "Prepares periodic reports and performance indicators.",
        "Contributes to bulletins and the annual report.",
      ],
    },
    requirements: {
      sq: [
        "Diplomë master në statistikë, ekonomi ose informatikë.",
        "Përvojë në përdorimin e programeve për analizë të dhënash.",
        "Aftësi të mira shkrimi dhe komunikimi.",
      ],
      en: [
        "Master's degree in statistics, economics or computer science.",
        "Experience with data analysis software.",
        "Good writing and communication skills.",
      ],
    },
  },
  {
    id: "v3",
    slug: "specialist-i-teknologjise-se-informacionit",
    status: "open",
    published: "2026-10-27",
    deadline: "2026-12-05",
    title: { sq: "Specialist/e i teknologjisë së informacionit", en: "Information Technology Specialist" },
    department: { sq: "Drejtoria e Shërbimeve Mbështetëse", en: "Directorate of Support Services" },
    contractType: fixed,
    summary: {
      sq: "Pozicioni mbështet administrimin e sistemeve dhe sigurinë e infrastrukturës teknologjike.",
      en: "The position supports systems administration and the security of technology infrastructure.",
    },
    responsibilities: {
      sq: [
        "Administron rrjetin, serverët dhe sistemet e brendshme.",
        "Zbaton politikat e sigurisë së informacionit.",
        "Ofron mbështetje teknike për stafin.",
      ],
      en: [
        "Administers the network, servers and internal systems.",
        "Implements information security policies.",
        "Provides technical support to staff.",
      ],
    },
    requirements: {
      sq: [
        "Diplomë në inxhinieri informatike ose të ngjashme.",
        "Certifikime profesionale në administrim sistemesh përbëjnë avantazh.",
        "Përvojë pune jo më pak se 2 vjet.",
      ],
      en: [
        "Degree in computer engineering or a related field.",
        "Professional certifications in systems administration are an advantage.",
        "At least 2 years of work experience.",
      ],
    },
  },
  {
    id: "v4",
    slug: "specialist-i-komunikimit",
    status: "closed",
    published: "2026-07-01",
    deadline: "2026-07-22",
    title: { sq: "Specialist/e i komunikimit", en: "Communication Specialist" },
    department: { sq: "Drejtoria e Komunikimit", en: "Directorate of Communication" },
    contractType: permanent,
    summary: {
      sq: "Procedura e rekrutimit ka përfunduar.",
      en: "The recruitment procedure has been completed.",
    },
    responsibilities: {
      sq: ["Përgatit komunikime për shtyp dhe përmbajtje për faqen zyrtare."],
      en: ["Prepares press releases and content for the official website."],
    },
    requirements: {
      sq: ["Diplomë master në gazetari ose komunikim."],
      en: ["Master's degree in journalism or communication."],
    },
  },
  {
    id: "v5",
    slug: "specialist-i-finances",
    status: "closed",
    published: "2026-05-12",
    deadline: "2026-06-02",
    title: { sq: "Specialist/e i financës", en: "Finance Specialist" },
    department: { sq: "Drejtoria e Shërbimeve Mbështetëse", en: "Directorate of Support Services" },
    contractType: permanent,
    summary: {
      sq: "Procedura e rekrutimit ka përfunduar.",
      en: "The recruitment procedure has been completed.",
    },
    responsibilities: {
      sq: ["Ndjek zbatimin e buxhetit dhe përgatit pasqyrat financiare."],
      en: ["Monitors budget execution and prepares financial statements."],
    },
    requirements: {
      sq: ["Diplomë master në financë ose kontabilitet."],
      en: ["Master's degree in finance or accounting."],
    },
  },
  {
    id: "v6",
    slug: "keshilltar-per-marredheniet-me-jashte",
    status: "closed",
    published: "2026-03-04",
    deadline: "2026-03-25",
    title: { sq: "Këshilltar/e për marrëdhëniet me jashtë", en: "Adviser on International Relations" },
    department: { sq: "Kabineti i Drejtuesit", en: "Cabinet of the Head of Institution" },
    contractType: fixed,
    summary: {
      sq: "Procedura e rekrutimit ka përfunduar.",
      en: "The recruitment procedure has been completed.",
    },
    responsibilities: {
      sq: ["Koordinon bashkëpunimin me partnerët ndërkombëtarë."],
      en: ["Coordinates cooperation with international partners."],
    },
    requirements: {
      sq: ["Diplomë master në marrëdhënie ndërkombëtare ose drejtësi."],
      en: ["Master's degree in international relations or law."],
    },
  },
];

export const vacancyDocuments: Localized<string>[] = [
  { sq: "Formulari i aplikimit", en: "Application form" },
  { sq: "Deklarata e kandidatit", en: "Candidate declaration" },
  { sq: "Lista e dokumenteve të kërkuara", en: "List of required documents" },
];
