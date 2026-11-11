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

**Character:** a European public institution, quiet and exact. Authority comes
from proportion, typography and restraint rather than decoration.

- **Colour.** Navy (`#10243A`) and white carry the identity. Dark blue
  (`#183B56`) and institutional blue (`#245B7A`) are used for interaction and
  depth. Gold (`#B79A60`) appears only as hairlines, rules and small markers; for
  gold *text* on light backgrounds the darker `gold-700` (`#7A6234`) is used to
  keep WCAG AA contrast. All tokens live in `src/app/globals.css` (`@theme`).
- **Typography.** Source Serif 4 for headings (institutional, European, good
  Albanian glyph coverage: ë, ç) and Source Sans 3 for interface and body text.
  Body 17px / 1.65; headings set tight with small caps-style eyebrows.
- **Shape.** Square or 2px corners, 1px borders, no drop shadows except on
  floating layers (menus, dialogs).
- **Imagery.** Neutral architectural line drawings (columns, arcades,
  stairways) generated as SVG. No people, no identifiable buildings. Replace
  with commissioned photography via the CMS.
- **Motion.** Short fades and 8px rises on scroll, menu transitions under
  200ms, all disabled under `prefers-reduced-motion`.
- **Signature details.** A thin gold rule under section eyebrows, a vertical
  gold marker on the active navigation item, date blocks for announcements,
  and a crest-style emblem placeholder.
