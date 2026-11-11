import type { Localized } from "@/i18n/config";

/** DEMO LEADERSHIP & STRUCTURE — placeholder names and roles only. */

export const leaderItems: {
  id: string;
  slug: string;
  order: number;
  name: Localized;
  role: Localized;
  term: Localized;
  bio: Localized<string[]>;
}[] = [
  {
    id: "l1",
    slug: "drejtuesi-i-institucionit",
    order: 1,
    name: { sq: "[Emri Mbiemri]", en: "[Name Surname]" },
    role: { sq: "Drejtuesi i Institucionit", en: "Head of the Institution" },
    term: { sq: "Mandati 20XX – 20XX", en: "Term of office 20XX – 20XX" },
    bio: {
      sq: [
        "Drejtuesi i institucionit përfaqëson institucionin në marrëdhëniet me të tretët, drejton dhe koordinon veprimtarinë e tij dhe përgjigjet para Kuvendit për zbatimin e mandatit.",
        "Para emërimit, ka ushtruar funksione drejtuese në administratën publike dhe ka përvojë të gjatë profesionale në fushën e së drejtës publike. Ka kryer studimet e larta dhe pasuniversitare në universitete vendase dhe europiane.",
      ],
      en: [
        "The Head of the Institution represents the institution in its relations with third parties, directs and coordinates its activity and is accountable to Parliament for the implementation of its mandate.",
        "Before appointment, the Head held senior positions in public administration and has extensive professional experience in public law, with undergraduate and postgraduate studies at domestic and European universities.",
      ],
    },
  },
  {
    id: "l2",
    slug: "zevendesdrejtuesi",
    order: 2,
    name: { sq: "[Emri Mbiemri]", en: "[Name Surname]" },
    role: { sq: "Zëvendësdrejtues", en: "Deputy Head" },
    term: { sq: "Mandati 20XX – 20XX", en: "Term of office 20XX – 20XX" },
    bio: {
      sq: [
        "Zëvendësdrejtuesi mbështet drejtuesin në drejtimin e institucionit dhe e zëvendëson atë në mungesë. Mbikëqyr veprimtarinë e drejtorive kryesore.",
        "Ka përvojë profesionale në menaxhimin institucional, hartimin e politikave publike dhe bashkëpunimin ndërkombëtar.",
      ],
      en: [
        "The Deputy Head supports the Head in leading the institution and acts in the Head's absence, overseeing the work of the core directorates.",
        "The Deputy Head has professional experience in institutional management, public policy development and international cooperation.",
      ],
    },
  },
  {
    id: "l3",
    slug: "sekretari-i-pergjithshem",
    order: 3,
    name: { sq: "[Emri Mbiemri]", en: "[Name Surname]" },
    role: { sq: "Sekretar i Përgjithshëm", en: "Secretary General" },
    term: { sq: "Nëpunës civil i lartë", en: "Senior civil servant" },
    bio: {
      sq: [
        "Sekretari i Përgjithshëm është nëpunësi më i lartë administrativ dhe përgjigjet për administrimin e burimeve njerëzore, financiare dhe materiale.",
        "Ka përvojë të gjatë në administratën publike, në fushat e financave publike dhe menaxhimit të burimeve njerëzore.",
      ],
      en: [
        "The Secretary General is the most senior administrative official, responsible for the management of human, financial and material resources.",
        "The Secretary General has long experience in public administration, in public finance and human resource management.",
      ],
    },
  },
  {
    id: "l4",
    slug: "drejtori-i-kabinetit",
    order: 4,
    name: { sq: "[Emri Mbiemri]", en: "[Name Surname]" },
    role: { sq: "Drejtor i Kabinetit", en: "Head of Cabinet" },
    term: { sq: "Funksion i besuar", en: "Appointed function" },
    bio: {
      sq: [
        "Drejtori i Kabinetit koordinon punën e kabinetit, agjendën institucionale dhe komunikimin me institucionet e tjera.",
        "Ka përvojë në koordinimin e politikave dhe në marrëdhëniet ndërinstitucionale.",
      ],
      en: [
        "The Head of Cabinet coordinates the work of the cabinet, the institutional agenda and communication with other institutions.",
        "The Head of Cabinet has experience in policy coordination and inter-institutional relations.",
      ],
    },
  },
];

export const departmentItems: {
  id: string;
  parent: string | null;
  level: 0 | 1 | 2;
  name: Localized;
  description: Localized;
  responsibilities: Localized<string[]>;
  units: Localized<string[]>;
}[] = [
  {
    id: "head",
    parent: null,
    level: 0,
    name: { sq: "Drejtuesi i Institucionit", en: "Head of the Institution" },
    description: {
      sq: "Drejton dhe përfaqëson institucionin, miraton aktet dhe përgjigjet për zbatimin e mandatit.",
      en: "Leads and represents the institution, adopts its acts and is accountable for the implementation of its mandate.",
    },
    responsibilities: { sq: [], en: [] },
    units: { sq: [], en: [] },
  },
  {
    id: "cabinet",
    parent: "head",
    level: 1,
    name: { sq: "Kabineti", en: "Cabinet" },
    description: {
      sq: "Mbështet drejtuesin në planifikimin strategjik, komunikimin institucional dhe marrëdhëniet me jashtë.",
      en: "Supports the Head in strategic planning, institutional communication and external relations.",
    },
    responsibilities: {
      sq: ["Menaxhimi i agjendës institucionale", "Këshillimi politik dhe juridik", "Koordinimi me institucionet e tjera"],
      en: ["Managing the institutional agenda", "Policy and legal advice", "Coordination with other institutions"],
    },
    units: { sq: ["Këshilltarët", "Sekretaria e Drejtuesit"], en: ["Advisers", "Secretariat of the Head"] },
  },
  {
    id: "audit",
    parent: "head",
    level: 1,
    name: { sq: "Njësia e Auditimit të Brendshëm", en: "Internal Audit Unit" },
    description: {
      sq: "Vlerëson në mënyrë të pavarur sistemet e kontrollit të brendshëm dhe menaxhimin financiar.",
      en: "Independently assesses internal control systems and financial management.",
    },
    responsibilities: {
      sq: ["Auditimi i proceseve të punës", "Rekomandime për përmirësim", "Raportim te drejtuesi"],
      en: ["Auditing work processes", "Recommendations for improvement", "Reporting to the Head"],
    },
    units: { sq: [], en: [] },
  },
  {
    id: "secgen",
    parent: "head",
    level: 1,
    name: { sq: "Sekretari i Përgjithshëm", en: "Secretary General" },
    description: {
      sq: "Koordinon administrimin e përgjithshëm dhe funksionimin e drejtorive.",
      en: "Coordinates general administration and the functioning of the directorates.",
    },
    responsibilities: { sq: [], en: [] },
    units: { sq: [], en: [] },
  },
  {
    id: "legal",
    parent: "secgen",
    level: 2,
    name: { sq: "Drejtoria Juridike", en: "Legal Directorate" },
    description: {
      sq: "Siguron ligjshmërinë e akteve dhe përfaqësimin ligjor të institucionit.",
      en: "Ensures the legality of acts and the legal representation of the institution.",
    },
    responsibilities: {
      sq: ["Hartimi dhe shqyrtimi i akteve", "Përfaqësimi në procedura ligjore", "Përafrimi me legjislacionin e BE-së"],
      en: ["Drafting and reviewing acts", "Representation in legal proceedings", "Alignment with EU legislation"],
    },
    units: { sq: ["Sektori i Legjislacionit", "Sektori i Përfaqësimit"], en: ["Legislation Section", "Representation Section"] },
  },
  {
    id: "operations",
    parent: "secgen",
    level: 2,
    name: { sq: "Drejtoria e Veprimtarisë Institucionale", en: "Directorate of Institutional Activity" },
    description: {
      sq: "Zbaton funksionet kryesore të institucionit sipas mandatit ligjor.",
      en: "Carries out the institution's core functions under its legal mandate.",
    },
    responsibilities: {
      sq: ["Shqyrtimi i çështjeve", "Monitorimi dhe verifikimi", "Hartimi i rekomandimeve"],
      en: ["Examining cases", "Monitoring and verification", "Drafting recommendations"],
    },
    units: { sq: ["Sektori I", "Sektori II", "Sektori III"], en: ["Section I", "Section II", "Section III"] },
  },
  {
    id: "analysis",
    parent: "secgen",
    level: 2,
    name: { sq: "Drejtoria e Analizës dhe Statistikave", en: "Directorate of Analysis and Statistics" },
    description: {
      sq: "Analizon të dhënat, mat performancën dhe përgatit raportet institucionale.",
      en: "Analyses data, measures performance and prepares institutional reports.",
    },
    responsibilities: {
      sq: ["Statistikat institucionale", "Raportet periodike dhe vjetore", "Studime dhe analiza"],
      en: ["Institutional statistics", "Periodic and annual reports", "Studies and analyses"],
    },
    units: { sq: ["Sektori i Statistikave", "Sektori i Studimeve"], en: ["Statistics Section", "Studies Section"] },
  },
  {
    id: "comms",
    parent: "secgen",
    level: 2,
    name: { sq: "Drejtoria e Komunikimit dhe Marrëdhënieve me Publikun", en: "Directorate of Communication and Public Relations" },
    description: {
      sq: "Menaxhon komunikimin me publikun dhe median dhe zbaton programin e transparencës.",
      en: "Manages communication with the public and the media and implements the transparency programme.",
    },
    responsibilities: {
      sq: ["Marrëdhëniet me median", "Faqja zyrtare dhe rrjetet sociale", "Kërkesat për informim"],
      en: ["Media relations", "Official website and social media", "Information requests"],
    },
    units: { sq: ["Sektori i Medias", "Zyra e Informimit të Publikut"], en: ["Media Section", "Public Information Office"] },
  },
  {
    id: "support",
    parent: "secgen",
    level: 2,
    name: { sq: "Drejtoria e Shërbimeve Mbështetëse", en: "Directorate of Support Services" },
    description: {
      sq: "Administron burimet njerëzore, financat, prokurimet dhe teknologjinë e informacionit.",
      en: "Manages human resources, finance, procurement and information technology.",
    },
    responsibilities: {
      sq: ["Burimet njerëzore", "Financa dhe buxheti", "Prokurimet", "Teknologjia e informacionit"],
      en: ["Human resources", "Finance and budget", "Procurement", "Information technology"],
    },
    units: {
      sq: ["Sektori i Burimeve Njerëzore", "Sektori i Financës", "Sektori i TI"],
      en: ["Human Resources Section", "Finance Section", "IT Section"],
    },
  },
];
