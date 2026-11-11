# Architecture & Visual Direction

This document covers steps 1–6 of the development workflow: reference analysis,
patterns adopted, site architecture, component structure, data model and visual
direction. The WordPress side is detailed in [WORDPRESS.md](./WORDPRESS.md).

---

## 1. Reference analysis

Both references were reviewed for structure and conventions only. No names,
logos, text or identities from either site are used anywhere in this project.

### Primary reference — European institutional site

| Observed pattern | Why it works | Adopted as |
| --- | --- | --- |
| Skip-to-content link as the first focusable element | Keyboard and screen-reader users bypass the header | `SkipLink` component |
| Thin utility bar above a calm, white masthead | Separates "service" links (languages, contact) from the main navigation | `UtilityBar` + `SiteHeader` |
| Mixed news feed where each item carries its **type** (opinion, hearing, visit, press release) | Readers scan by kind before topic | Category label on every news / announcement card |
| Press releases offered as **PDF downloads** with explicit format | Official documents remain the source of truth | `DocumentRow` with type + size + download |
| Dated, list-style communications instead of image-heavy cards | Formal tone, dense, scannable | `AnnouncementRow` with date block |
| "About" area split into institution → bodies → organisation | Clear hierarchy from general to specific | About → Profile / Structure / Leadership |
| Restrained palette, generous white space, serif-flavoured headings | Signals permanence and authority | Navy + white, gold hairlines, Source Serif 4 headings |

### Secondary reference — Albanian institutional site

| Observed pattern | Adopted as |
| --- | --- |
| Albanian-first navigation vocabulary: *Kreu, Rreth nesh, Misioni, Struktura, Raporte vjetore, Legjislacion, Njoftime, Vende vakante, Programi i transparencës, Kontakt* | Albanian is the default locale; the SQ dictionary uses the same conventional terms |
| Legislation split into Constitution / Codes / Laws / Sub-legal acts (instructions, regulations) / International | Legal Framework categories: Laws, Regulations, Decisions, Instructions, Policies, Other |
| Press notices titled by date ("Njoftim për shtyp, 7 nëntor") | Announcement category *Njoftim për shtyp* with date-first layout |
| Separate vacancy listings per unit | Careers page with department, deadline and status, plus archive |
| A dedicated "Programi i transparencës" page (legal requirement for Albanian public authorities, Law 119/2014 on the right to information) | Transparency portal organised by the categories of a transparency programme |
| Footer row linking to partner justice-sector institutions | Footer "Institucione partnere" row with placeholder links |
| A citizen "report / denounce" entry point | Quick-access tile "Kërkesë për informim" (public access request) |

**What we deliberately do differently:** the Albanian reference is built on a
page-builder theme with long, undifferentiated menus. This prototype keeps the
same content vocabulary but uses a grouped mega-menu, consistent page heroes,
breadcrumbs, filterable lists and a single design system.

---

## 2. Site architecture

All routes are prefixed with the locale (`/sq/…`, `/en/…`). `/` redirects to `/sq`.

```
/                         Home
/about                    Institutional profile (mission, vision, values, mandate, history, principles)
/about/structure          Organisational chart + departments
/about/leadership         Leadership profiles
/activities               Institutional activities overview
/activities/reports       Reports (filterable documents)
/activities/publications  Publications (filterable documents)
/news                     News portal (featured, categories, search, date range, pagination)
/news/[slug]              Article (subtitle, image, body, author/department, attachments, share, related)
/announcements            Announcements (category + date filters)
/announcements/[slug]     Announcement detail
/legal                    Legal framework (category tabs, search, year)
/transparency             Transparency portal (category index)
/transparency/[category]  Category listing (public-information, annual-reports, budget, procurement, …)
/careers                  Vacancies, requirements, documents, archive
/careers/[slug]           Vacancy detail
/contact                  Contact details, map placeholder, validated form
/search                   Site-wide search
/privacy, /accessibility  Policy pages
```

Navigation is data, not markup: `src/config/navigation.ts` (mock) or a WordPress
menu (production) feeds the header, mega-menu, mobile menu, footer and sitemap.

---

## 3. Application architecture

```
src/
  app/
    [locale]/            all pages (server components by default)
    api/contact          contact form endpoint (server-side validation)
    api/revalidate       on-demand ISR webhook for WordPress
    sitemap.ts robots.ts
  components/
    layout/              SiteHeader, MegaMenu, MobileNav, UtilityBar, LanguageSwitcher, SearchDialog, SiteFooter, Emblem
    ui/                  Container, SectionHeader, Breadcrumbs, PageHero, Pagination, FilterBar, EmptyState, …
    cards/               NewsCard, AnnouncementRow, DocumentRow, VacancyCard, LeaderCard, QuickAccessTile
    home/                homepage sections
    forms/               ContactForm
    article/             ShareButtons, Attachments
  config/                institution.ts (all replaceable identity data), navigation.ts, statistics.ts
  i18n/                  locales, dictionaries (sq, en), helpers, client provider
  lib/cms/               CmsProvider interface, mock provider, WordPress provider, shared query helpers
  data/mock/             bilingual demo content
```

**Data flow.** Pages never import mock data directly. They call
`cms.getNews(locale, query)` etc. from `@/lib/cms`. `CMS_SOURCE=mock|wordpress`
selects the provider at runtime. Both providers return the same TypeScript types
(`src/lib/cms/types.ts`), so switching is a configuration change.

**Rendering.** Server components fetch data; only interactive pieces (header,
menus, search dialog, filters, contact form, share buttons, animations) are
client components. Filters are plain `GET` forms, so lists work without
JavaScript and every filtered view has a shareable URL.

**Secrets.** WordPress credentials are read only in server code (`import
"server-only"`). Nothing CMS-related is prefixed `NEXT_PUBLIC_`.

---

## 4. Component structure

| Component | Type | Responsibility |
| --- | --- | --- |
| `SiteHeader` | server → client | Loads navigation + settings, renders `HeaderShell` |
| `HeaderShell` | client | Sticky behaviour, compact state on scroll, mobile toggle |
| `MegaMenu` | client | Desktop dropdowns: hover + click + keyboard (Esc, arrows), section intro column |
| `MobileNav` | client | Full-height drawer with accordion sections, focus trap, Esc to close |
| `LanguageSwitcher` | client | Swaps the locale segment, keeps path + query |
| `SearchDialog` | client | Modal search (Ctrl/⌘ K), submits to `/search` |
| `Breadcrumbs` | server | `nav[aria-label]` + `BreadcrumbList` JSON-LD |
| `PageHero` | server | Internal page title band with breadcrumbs and lead text |
| `SectionHeader` | server | Eyebrow, title, optional "view all" link |
| `NewsCard` / `NewsFeature` | server | News presentation variants |
| `AnnouncementRow` | server | Date block + category + title |
| `DocumentRow` | server | Title, category, date, reference, size, download |
| `FilterBar` | client | GET form with auto-submit on select change |
| `Pagination` | server | Accessible numbered pagination preserving query |
| `Statistics` | server | Configurable figures with a visible "demo data" flag |
| `ContactForm` | client | Field validation, honeypot, loading / success / error states |
| `SiteFooter` | server | Contact block, link columns, partners, social, legal bar |

---

## 5. Content model (frontend types)

Defined in `src/lib/cms/types.ts`. Summary:

- **NewsArticle** – slug, title, subtitle, excerpt, date, category, image, html, author/department, attachments, featured
- **Announcement** – slug, title, excerpt, date, category (official, notice, press, update), html, attachments, important
- **DocumentItem** – slug, title, description, date, section (legal, transparency, publication, report), category, reference, file (url, type, size)
- **Vacancy** – slug, title, department, location, contract type, published, deadline, status, summary, responsibilities, requirements, documents
- **Leader** – slug, name, role, bio paragraphs, portrait, order
- **Department** – id, name, description, responsibilities, parent, units
- **SiteSettings** – identity, contact, social, partners (overrides `src/config/institution.ts`)

The matching WordPress custom post types, taxonomies and ACF fields are in
[WORDPRESS.md](./WORDPRESS.md).

---

## 6. Visual direction

> **Update — official identity applied.** The prototype now follows the visual
> identity guideline of the *Gjykata e Posaçme e Shkallës së Parë për
> Korrupsionin dhe Krimin e Organizuar* (GJKKO). Everything below reflects it.

**Character:** a European court website, quiet and exact. Authority comes from
proportion, typography and restraint rather than decoration.

- **Colour (guideline "KOLORET").** Burgundy `#873132` (Pantone 7624C) is the
  primary colour, with a deep burgundy scale (`brand-950 … brand-50`) for dark
  surfaces and headings. Gold `#C69D52` (Pantone 7407C) is used for hairlines,
  rules and small markers; gold *text* on light backgrounds uses `gold-700`
  (`#85632A`) for AA contrast. Grey `#414042` (Pantone 447C) is the `charcoal`
  token, and the text colours are derived from it. All tokens live in
  `src/app/globals.css` (`@theme`); every pairing used passes WCAG AA.
- **Typography (guideline "TYPOGRAPHY").** Open Sans, the primary brand font,
  is used for interface, body and headings (via `next/font`, latin-ext for ë/ç).
  Helvetica, the secondary font, is the fallback stack.
- **Logo (guideline "VARIACIONET").** The icon is extracted as vector artwork
  from the guideline PDF (`scripts/extract-logo-from-guideline.py` →
  `public/brand/`). The header uses the horizontal lockup: icon · divider ·
  three-line name in Open Sans Bold. Narrow screens use the icon-only variant,
  and the footer uses the white-on-burgundy variant. The guideline's misuse rules
  are respected: no recolouring, gradients, outlines, stretching, or placement
  over busy images.
- **Shape.** Square or 2px corners, 1px borders, no drop shadows except on
  floating layers (menus, dialogs).
- **Imagery.** Neutral architectural line drawings (columns, arcades,
  stairways) generated as SVG in the brand palette. No people, no identifiable
  buildings. Replace with commissioned photography via the CMS.
- **Motion.** Short fades and 8px rises on scroll, menu transitions under
  200ms, all disabled under `prefers-reduced-motion`.
- **Demo marking.** While the site is a prototype, a gold banner on every page
  states that it is not the court's official website
  (`NEXT_PUBLIC_DEMO_BANNER=false` removes it for the approved production site),
  and pages are `noindex`.
