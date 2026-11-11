import type { Localized } from "@/i18n/config";

/**
 * DEMO NEWS — bilingual placeholder content.
 * Every name below is generic; replace through the CMS.
 */

export const newsCategories: { slug: string; name: Localized }[] = [
  { slug: "veprimtari", name: { sq: "Veprimtari institucionale", en: "Institutional activity" } },
  { slug: "bashkepunim", name: { sq: "Bashkëpunim", en: "Cooperation" } },
  { slug: "raportim", name: { sq: "Raportim", en: "Reporting" } },
  { slug: "komunikim", name: { sq: "Komunikim publik", en: "Public communication" } },
  { slug: "evente", name: { sq: "Evente", en: "Events" } },
];

type MockNews = {
  id: string;
  slug: string;
  date: string;
  category: string;
  image: number;
  featured?: boolean;
  attachments?: boolean;
  author: Localized;
  title: Localized;
  subtitle: Localized;
  excerpt: Localized;
  lead: Localized<string[]>;
};

const dept = {
  comms: { sq: "Drejtoria e Komunikimit dhe Marrëdhënieve me Publikun", en: "Directorate of Communication and Public Relations" },
  intl: { sq: "Drejtoria e Marrëdhënieve me Jashtë", en: "Directorate of International Relations" },
  analysis: { sq: "Drejtoria e Analizës dhe Statistikave", en: "Directorate of Analysis and Statistics" },
  cabinet: { sq: "Kabineti i Drejtuesit", en: "Cabinet of the Head of Institution" },
};

export const newsItems: MockNews[] = [
  {
    id: "n1",
    slug: "raporti-vjetor-i-veprimtarise-paraqitet-ne-kuvend",
    date: "2026-11-09T10:00:00+01:00",
    category: "raportim",
    image: 1,
    featured: true,
    attachments: true,
    author: dept.cabinet,
    title: {
      sq: "Raporti vjetor i veprimtarisë paraqitet para komisionit parlamentar",
      en: "Annual activity report presented to the parliamentary committee",
    },
    subtitle: {
      sq: "Drejtuesi i institucionit prezantoi rezultatet kryesore, sfidat dhe prioritetet për vitin e ardhshëm.",
      en: "The Head of the Institution presented the main results, challenges and priorities for the coming year.",
    },
    excerpt: {
      sq: "Raporti përmbledh veprimtarinë institucionale gjatë vitit, treguesit e performancës dhe masat për forcimin e transparencës.",
      en: "The report summarises the institution's activity during the year, performance indicators and measures to strengthen transparency.",
    },
    lead: {
      sq: [
        "Në zbatim të detyrimit ligjor për llogaridhënie, drejtuesi i institucionit paraqiti sot para komisionit parlamentar përkatës raportin vjetor të veprimtarisë.",
        "Raporti trajton në mënyrë të detajuar zbatimin e prioriteteve strategjike, menaxhimin e burimeve njerëzore e financiare, si dhe bashkëpunimin me institucionet e tjera kombëtare dhe ndërkombëtare.",
      ],
      en: [
        "In fulfilment of its statutory duty of accountability, the Head of the Institution today presented the annual activity report to the competent parliamentary committee.",
        "The report examines in detail the implementation of strategic priorities, the management of human and financial resources, and cooperation with other national and international institutions.",
      ],
    },
  },
  {
    id: "n2",
    slug: "memorandum-bashkepunimi-me-institucion-homolog-europian",
    date: "2026-11-05T12:30:00+01:00",
    category: "bashkepunim",
    image: 2,
    featured: true,
    author: dept.intl,
    title: {
      sq: "Nënshkruhet memorandum bashkëpunimi me një institucion homolog europian",
      en: "Memorandum of cooperation signed with a European counterpart institution",
    },
    subtitle: {
      sq: "Marrëveshja parashikon shkëmbim ekspertize, trajnime të përbashkëta dhe ndarje të praktikave më të mira.",
      en: "The agreement provides for the exchange of expertise, joint training and the sharing of best practice.",
    },
    excerpt: {
      sq: "Memorandumi forcon bashkëpunimin institucional në kuadër të procesit të integrimit europian.",
      en: "The memorandum strengthens institutional cooperation within the framework of the European integration process.",
    },
    lead: {
      sq: [
        "Institucioni nënshkroi një memorandum mirëkuptimi me një institucion homolog nga një shtet anëtar i Bashkimit Europian.",
        "Dokumenti përcakton fushat e bashkëpunimit për tre vitet e ardhshme, me fokus në ngritjen e kapaciteteve profesionale dhe digjitalizimin e proceseve të punës.",
      ],
      en: [
        "The institution signed a memorandum of understanding with a counterpart institution from a European Union member state.",
        "The document sets out the areas of cooperation for the next three years, focusing on professional capacity building and the digitalisation of work processes.",
      ],
    },
  },
  {
    id: "n3",
    slug: "konference-kombetare-per-integritetin-ne-administraten-publike",
    date: "2026-10-28T09:00:00+01:00",
    category: "evente",
    image: 3,
    featured: true,
    author: dept.comms,
    title: {
      sq: "Konferencë kombëtare për integritetin në administratën publike",
      en: "National conference on integrity in public administration",
    },
    subtitle: {
      sq: "Përfaqësues institucionalë, akademikë dhe të shoqërisë civile diskutuan standardet e integritetit.",
      en: "Institutional representatives, academics and civil society discussed integrity standards.",
    },
    excerpt: {
      sq: "Konferenca mblodhi mbi 200 pjesëmarrës dhe miratoi një deklaratë të përbashkët angazhimi.",
      en: "The conference brought together more than 200 participants and adopted a joint declaration of commitment.",
    },
    lead: {
      sq: [
        "Institucioni organizoi konferencën vjetore kombëtare kushtuar integritetit dhe etikës në administratën publike.",
        "Në panelet e konferencës u diskutuan mekanizmat e parandalimit, roli i transparencës proaktive dhe përvojat krahasuese europiane.",
      ],
      en: [
        "The institution hosted its annual national conference dedicated to integrity and ethics in public administration.",
        "The conference panels discussed prevention mechanisms, the role of proactive transparency and comparative European experience.",
      ],
    },
  },
  {
    id: "n4",
    slug: "programi-i-transparences-perditesohet",
    date: "2026-10-21T11:00:00+02:00",
    category: "komunikim",
    image: 4,
    author: dept.comms,
    title: {
      sq: "Përditësohet programi i transparencës së institucionit",
      en: "The institution's transparency programme is updated",
    },
    subtitle: {
      sq: "Programi i ri zgjeron kategoritë e informacionit të publikuar në mënyrë proaktive.",
      en: "The new programme broadens the categories of proactively published information.",
    },
    excerpt: {
      sq: "Qytetarët kanë tani akses më të lehtë në të dhënat për buxhetin, prokurimet dhe vendimmarrjen.",
      en: "Citizens now have easier access to data on the budget, procurement and decision-making.",
    },
    lead: {
      sq: [
        "Institucioni miratoi versionin e përditësuar të programit të transparencës, në përputhje me legjislacionin për të drejtën e informimit.",
        "Ndryshimet kryesore përfshijnë publikimin periodik të të dhënave financiare dhe një regjistër më të detajuar të kërkesave dhe përgjigjeve.",
      ],
      en: [
        "The institution adopted the updated version of its transparency programme, in line with the legislation on the right to information.",
        "The main changes include the periodic publication of financial data and a more detailed register of requests and responses.",
      ],
    },
  },
  {
    id: "n5",
    slug: "takim-me-perfaqesues-te-shoqerise-civile",
    date: "2026-10-14T10:00:00+02:00",
    category: "bashkepunim",
    image: 5,
    author: dept.comms,
    title: {
      sq: "Takim konsultativ me përfaqësues të shoqërisë civile",
      en: "Consultative meeting with civil society representatives",
    },
    subtitle: {
      sq: "Diskutimi u përqendrua në mekanizmat e komunikimit dhe të llogaridhënies ndaj publikut.",
      en: "The discussion focused on mechanisms for communication and accountability to the public.",
    },
    excerpt: {
      sq: "Organizatat pjesëmarrëse paraqitën rekomandime për përmirësimin e aksesit në informacion.",
      en: "Participating organisations presented recommendations for improving access to information.",
    },
    lead: {
      sq: [
        "Në kuadër të angazhimit për dialog të hapur, institucioni zhvilloi një takim konsultativ me organizata të shoqërisë civile.",
        "Rekomandimet e paraqitura do të shqyrtohen gjatë hartimit të planit vjetor të komunikimit.",
      ],
      en: [
        "As part of its commitment to open dialogue, the institution held a consultative meeting with civil society organisations.",
        "The recommendations presented will be considered when drafting the annual communication plan.",
      ],
    },
  },
  {
    id: "n6",
    slug: "trajnim-per-mbrojtjen-e-te-dhenave-personale",
    date: "2026-10-07T09:30:00+02:00",
    category: "veprimtari",
    image: 6,
    author: dept.analysis,
    title: {
      sq: "Trajnim i stafit për mbrojtjen e të dhënave personale",
      en: "Staff training on personal data protection",
    },
    subtitle: {
      sq: "Programi i trajnimit u zhvillua në bashkëpunim me ekspertë të fushës.",
      en: "The training programme was delivered in cooperation with experts in the field.",
    },
    excerpt: {
      sq: "Trajnimi trajtoi standardet europiane dhe detyrimet ligjore për përpunimin e të dhënave.",
      en: "The training covered European standards and legal obligations for processing data.",
    },
    lead: {
      sq: [
        "Punonjësit e institucionit ndoqën një cikël trajnimi mbi mbrojtjen e të dhënave personale dhe sigurinë e informacionit.",
        "Trajnimi është pjesë e programit vjetor të zhvillimit profesional të miratuar nga institucioni.",
      ],
      en: [
        "Staff of the institution attended a training cycle on personal data protection and information security.",
        "The training is part of the annual professional development programme adopted by the institution.",
      ],
    },
  },
  {
    id: "n7",
    slug: "publikohet-buletini-i-tremujorit-te-trete",
    date: "2026-09-30T12:00:00+02:00",
    category: "raportim",
    image: 1,
    attachments: true,
    author: dept.analysis,
    title: {
      sq: "Publikohet buletini informativ i tremujorit të tretë",
      en: "Information bulletin for the third quarter published",
    },
    subtitle: {
      sq: "Buletini paraqet të dhëna statistikore dhe zhvillimet kryesore të periudhës.",
      en: "The bulletin presents statistical data and the main developments of the period.",
    },
    excerpt: {
      sq: "Buletini është i disponueshëm për shkarkim në formatin PDF.",
      en: "The bulletin is available for download in PDF format.",
    },
    lead: {
      sq: [
        "Institucioni publikoi buletinin informativ për tremujorin e tretë të vitit.",
        "Buletini përfshin të dhëna të përmbledhura mbi veprimtarinë, aktet e miratuara dhe aktivitetet e bashkëpunimit.",
      ],
      en: [
        "The institution published its information bulletin for the third quarter of the year.",
        "The bulletin includes summary data on activity, acts adopted and cooperation activities.",
      ],
    },
  },
  {
    id: "n8",
    slug: "vizite-studimore-e-nje-delegacioni-nderkombetar",
    date: "2026-09-22T10:00:00+02:00",
    category: "bashkepunim",
    image: 2,
    author: dept.intl,
    title: {
      sq: "Vizitë studimore e një delegacioni ndërkombëtar",
      en: "Study visit by an international delegation",
    },
    subtitle: {
      sq: "Delegacioni u njoh me organizimin dhe metodologjinë e punës së institucionit.",
      en: "The delegation was introduced to the institution's organisation and working methodology.",
    },
    excerpt: {
      sq: "Vizita u zhvillua në kuadër të një programi rajonal për shkëmbimin e përvojave.",
      en: "The visit took place within a regional programme for the exchange of experience.",
    },
    lead: {
      sq: [
        "Institucioni priti një delegacion ndërkombëtar në kuadër të një vizite studimore dyditore.",
        "Gjatë takimeve u prezantuan struktura organizative, procedurat e brendshme dhe projektet e digjitalizimit.",
      ],
      en: [
        "The institution hosted an international delegation for a two-day study visit.",
        "During the meetings, the organisational structure, internal procedures and digitalisation projects were presented.",
      ],
    },
  },
  {
    id: "n9",
    slug: "platforma-elektronike-per-kerkesat-per-informim",
    date: "2026-09-15T09:00:00+02:00",
    category: "komunikim",
    image: 3,
    author: dept.comms,
    title: {
      sq: "Vihet në funksion platforma elektronike për kërkesat për informim",
      en: "Electronic platform for information requests launched",
    },
    subtitle: {
      sq: "Qytetarët mund të paraqesin dhe të ndjekin kërkesat e tyre në mënyrë elektronike.",
      en: "Citizens can submit and track their requests electronically.",
    },
    excerpt: {
      sq: "Platforma shkurton kohën e trajtimit dhe rrit gjurmueshmërinë e kërkesave.",
      en: "The platform shortens handling time and improves the traceability of requests.",
    },
    lead: {
      sq: [
        "Institucioni vuri në funksion një platformë elektronike për paraqitjen dhe ndjekjen e kërkesave për informim.",
        "Platforma është pjesë e strategjisë së institucionit për shërbime publike më të aksesueshme dhe transparente.",
      ],
      en: [
        "The institution launched an electronic platform for submitting and tracking requests for information.",
        "The platform is part of the institution's strategy for more accessible and transparent public services.",
      ],
    },
  },
  {
    id: "n10",
    slug: "dita-e-dyerve-te-hapura-per-studentet",
    date: "2026-09-04T10:00:00+02:00",
    category: "evente",
    image: 4,
    author: dept.comms,
    title: {
      sq: "Dita e dyerve të hapura për studentët e drejtësisë",
      en: "Open day for law students",
    },
    subtitle: {
      sq: "Studentët u njohën nga afër me funksionimin dhe mundësitë e praktikës profesionale.",
      en: "Students learned first-hand about the institution's work and internship opportunities.",
    },
    excerpt: {
      sq: "Aktiviteti synon afrimin e brezit të ri me institucionet publike.",
      en: "The event aims to bring the young generation closer to public institutions.",
    },
    lead: {
      sq: [
        "Institucioni organizoi ditën e dyerve të hapura për studentët e fakulteteve të drejtësisë.",
        "Pjesëmarrësit ndoqën prezantime mbi mandatin e institucionit dhe programin e praktikave profesionale.",
      ],
      en: [
        "The institution organised an open day for students of law faculties.",
        "Participants attended presentations on the institution's mandate and its professional internship programme.",
      ],
    },
  },
  {
    id: "n11",
    slug: "miratohet-plani-strategjik-afatmesem",
    date: "2026-08-26T11:00:00+02:00",
    category: "veprimtari",
    image: 5,
    attachments: true,
    author: dept.cabinet,
    title: {
      sq: "Miratohet plani strategjik afatmesëm i institucionit",
      en: "The institution's medium-term strategic plan adopted",
    },
    subtitle: {
      sq: "Plani përcakton objektivat dhe treguesit e performancës për periudhën trevjeçare.",
      en: "The plan sets out objectives and performance indicators for the three-year period.",
    },
    excerpt: {
      sq: "Dokumenti u hartua pas një procesi të gjerë konsultimi të brendshëm dhe të jashtëm.",
      en: "The document was drafted after a broad internal and external consultation process.",
    },
    lead: {
      sq: [
        "Institucioni miratoi planin strategjik afatmesëm, i cili udhëheq veprimtarinë për tre vitet e ardhshme.",
        "Plani përqendrohet në forcimin e pavarësisë, cilësinë e vendimmarrjes dhe modernizimin e infrastrukturës teknologjike.",
      ],
      en: [
        "The institution adopted its medium-term strategic plan, which will guide its work for the next three years.",
        "The plan focuses on strengthening independence, the quality of decision-making and modernising technological infrastructure.",
      ],
    },
  },
  {
    id: "n12",
    slug: "seminar-rajonal-mbi-standardet-europiane",
    date: "2026-07-17T09:00:00+02:00",
    category: "evente",
    image: 6,
    author: dept.intl,
    title: {
      sq: "Seminar rajonal mbi standardet europiane të qeverisjes së mirë",
      en: "Regional seminar on European standards of good governance",
    },
    subtitle: {
      sq: "Ekspertë nga vendet e rajonit ndanë përvoja mbi reformat institucionale.",
      en: "Experts from the region shared experience on institutional reforms.",
    },
    excerpt: {
      sq: "Seminari u organizua me mbështetjen e partnerëve ndërkombëtarë.",
      en: "The seminar was organised with the support of international partners.",
    },
    lead: {
      sq: [
        "Institucioni bashkëorganizoi një seminar rajonal mbi standardet europiane të qeverisjes së mirë.",
        "Diskutimet trajtuan pavarësinë institucionale, etikën profesionale dhe komunikimin me publikun.",
      ],
      en: [
        "The institution co-organised a regional seminar on European standards of good governance.",
        "Discussions addressed institutional independence, professional ethics and communication with the public.",
      ],
    },
  },
  {
    id: "n13",
    slug: "deklarate-per-diten-nderkombetare-te-se-drejtes-per-informim",
    date: "2026-06-28T10:00:00+02:00",
    category: "komunikim",
    image: 1,
    author: dept.cabinet,
    title: {
      sq: "Deklaratë me rastin e ditës ndërkombëtare të së drejtës për informim",
      en: "Statement on the international day of the right to information",
    },
    subtitle: {
      sq: "Institucioni rikonfirmon angazhimin për transparencë të plotë ndaj qytetarëve.",
      en: "The institution reaffirms its commitment to full transparency towards citizens.",
    },
    excerpt: {
      sq: "Aksesi në informacion është themel i besimit publik dhe i llogaridhënies institucionale.",
      en: "Access to information is the foundation of public trust and institutional accountability.",
    },
    lead: {
      sq: [
        "Me rastin e ditës ndërkombëtare të së drejtës për informim, institucioni rikonfirmon angazhimin e tij për transparencë.",
        "Gjatë vitit, institucioni ka zgjeruar ndjeshëm vëllimin e informacionit të publikuar në mënyrë proaktive.",
      ],
      en: [
        "On the international day of the right to information, the institution reaffirms its commitment to transparency.",
        "During the year, the institution has significantly expanded the volume of proactively published information.",
      ],
    },
  },
];

/** Shared closing paragraphs that complete each demo article body. */
export const newsBodyTail: Localized<string> = {
  sq: `
<blockquote>„Llogaridhënia ndaj publikut nuk është vetëm detyrim ligjor, por themeli i besimit tek institucionet.”</blockquote>
<h2>Pikat kryesore</h2>
<ul>
  <li>Forcimi i pavarësisë dhe i profesionalizmit institucional.</li>
  <li>Rritja e transparencës proaktive dhe e aksesit në informacion.</li>
  <li>Thellimi i bashkëpunimit me institucionet kombëtare dhe ndërkombëtare.</li>
</ul>
<p>Institucioni do të vijojë të informojë publikun në mënyrë të rregullt mbi zhvillimet e mëtejshme. Dokumentet përkatëse, kur janë të disponueshme, publikohen në seksionin e dokumenteve bashkëngjitur.</p>
<p><em>Ky është tekst demonstrues dhe do të zëvendësohet me përmbajtjen zyrtare të institucionit.</em></p>`,
  en: `
<blockquote>“Accountability to the public is not only a legal obligation, but the foundation of trust in institutions.”</blockquote>
<h2>Key points</h2>
<ul>
  <li>Strengthening institutional independence and professionalism.</li>
  <li>Increasing proactive transparency and access to information.</li>
  <li>Deepening cooperation with national and international institutions.</li>
</ul>
<p>The institution will continue to inform the public regularly about further developments. Related documents, when available, are published in the attached documents section.</p>
<p><em>This is demonstration text and will be replaced with the institution's official content.</em></p>`,
};
