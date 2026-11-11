# Institutional Portal — Prototype

A complete, navigable prototype of an official website for a high-level Albanian
public institution. It is built for presentation to the institution's
representatives: every name, figure and document is a neutral placeholder that
can be replaced without touching the code.

- **Frontend:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lucide · Framer Motion
- **Content:** bilingual mock data out of the box, or **headless WordPress** via REST (`CMS_SOURCE=wordpress`)
- **Languages:** Albanian (primary, `/sq`) and English (`/en`)

> Documentation: [Architecture & visual direction](docs/ARCHITECTURE.md) · [WordPress content model](docs/WORDPRESS.md)

---

## Quick start

Requirements: Node.js 20.9+ (tested on 22), npm 10.

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Open http://localhost:3000 — you are redirected to `/sq`.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (static pages are pre-rendered) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `python scripts/generate-placeholder-assets.py` | Regenerate the placeholder SVG imagery and sample PDF |

## What is included

| Area | Route | Highlights |
| --- | --- | --- |
| Homepage | `/` | Hero with latest notice strip, introduction + mission/vision/values, latest news, announcements + press column, quick access, featured documents, demo statistics, contact & map |
| About | `/about` | Profile, mission, vision, values, legal mandate, history timeline, principles, sticky table of contents |
| Structure | `/about/structure` | Organisational chart generated from data + department cards |
| Leadership | `/about/leadership` | Placeholder profiles, roles, biographies, neutral portraits |
| Activities | `/activities`, `/reports`, `/publications` | Activity areas, filterable report and publication lists |
| News | `/news`, `/news/[slug]` | Featured article, category + text + date-range filters, pagination, article with attachments, sharing, related news |
| Announcements | `/announcements`, `/[slug]` | Category chips (official, notice, press, update), date filters |
| Legal framework | `/legal` | Category tabs, text + year filters, PDF downloads |
| Transparency | `/transparency`, `/[category]` | Portal of 7 categories, RTI coordinator box, filterable documents |
| Careers | `/careers`, `/[slug]` | Open vacancies, requirements, forms, recruitment archive |
| Contact | `/contact` | Details, map placeholder, validated form with success / error states |
| Search | `/search` | Site-wide search grouped by type with highlighting |
| System | — | Localised 404, error boundary, loading skeletons, empty states, sitemap, robots |

### Demo tips

- **Language:** switch SQ / EN in the top bar — the current page, filters and query are kept.
- **Search:** `Ctrl K` or `/` opens the search dialog anywhere.
- **Contact form error state:** use the subject `test-error` to simulate a delivery failure.
- **Loading states:** set `MOCK_LATENCY_MS=800` in `.env.local` to slow the mock API down.
- **Statistics** are flagged "Demonstration data" on the page; they are not real figures.

## Replacing placeholders

| What | Where |
| --- | --- |
| Institution name, short name, tagline, description, address, phone, emails, hours, social links, partner institutions, logo | [`src/config/institution.ts`](src/config/institution.ts) (or WordPress *Site settings*) |
| Navigation (add / rename / remove sections) | [`src/config/navigation.ts`](src/config/navigation.ts) (or WordPress menu `primary`) |
| Homepage statistics | [`src/config/statistics.ts`](src/config/statistics.ts) (set `demo: false` only for official figures) |
| Colours | `@theme` tokens in [`src/app/globals.css`](src/app/globals.css) |
| Fonts | [`src/app/[locale]/layout.tsx`](src/app/[locale]/layout.tsx) (`next/font`) |
| Interface text (buttons, labels, messages) | [`src/i18n/dictionaries/sq.ts`](src/i18n/dictionaries/sq.ts) and [`en.ts`](src/i18n/dictionaries/en.ts) |
| Demo content (news, documents, vacancies, people, pages) | [`src/data/mock/`](src/data/mock) — or WordPress |
| Images | `public/images/` (placeholders) — or WordPress media |

The placeholder tokens from the brief map to config keys:
`[INSTITUTION_NAME]` → `institution.name`, `[INSTITUTION_SHORT_NAME]` → `shortName`,
`[INSTITUTION_LOGO]` → `logo`, `[INSTITUTION_DESCRIPTION]` → `description`,
`[INSTITUTION_ADDRESS]` → `address`, `[INSTITUTION_EMAIL]` → `email`,
`[INSTITUTION_PHONE]` → `phone`, `[INSTITUTION_DIRECTOR]` → `director`,
`[SOCIAL_MEDIA_LINK]` → `social[]`; `[DEPARTMENT_NAME]`, `[NEWS_TITLE]` and
`[PUBLICATION_TITLE]` are CMS content (`src/data/mock` or WordPress).

## Architecture in one minute

```
src/
  app/[locale]/…        pages (server components) — one folder per route
  app/api/contact       contact form endpoint (server-side validation, honeypot)
  app/api/revalidate    WordPress → Next.js cache invalidation webhook
  components/           layout (header, mega menu, footer…), ui, cards, home, forms, article
  config/               institution, navigation, statistics
  i18n/                 locales, dictionaries, client provider, formatting
  lib/cms/              CmsProvider interface + mock provider + WordPress provider
  data/mock/            bilingual demo content
wordpress/mu-plugins/   WordPress content model (CPTs, taxonomies, ACF, REST endpoints)
docs/                   architecture, visual direction, WordPress documentation
```

Pages never import data directly; they call `cms.*` from `@/lib/cms`. Setting
`CMS_SOURCE=wordpress` swaps the source with no code changes. Details in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Connecting WordPress

1. Install WordPress, ACF PRO and Polylang; copy `wordpress/mu-plugins/institution-content-model.php` to `wp-content/mu-plugins/`.
2. Create the taxonomy terms and pages listed in [docs/WORDPRESS.md](docs/WORDPRESS.md).
3. Set in `.env.local`: `CMS_SOURCE=wordpress`, `WORDPRESS_API_URL=https://cms.example.al/wp-json`, `REVALIDATE_SECRET=…`.
4. Add `INST_FRONTEND_URL` and `INST_REVALIDATE_SECRET` to `wp-config.php` for instant updates.

## Accessibility, SEO, security

- WCAG 2.2 AA targets: skip link, visible focus, semantic landmarks and headings, labelled controls, keyboard-operable menus and dialogs (native `<dialog>`), error summary with focus management, AA colour contrast, reduced-motion support.
- SEO: per-page metadata, canonical + `hreflang` alternates, Open Graph / Twitter cards, JSON-LD (GovernmentOrganization, NewsArticle, BreadcrumbList), `sitemap.xml`, `robots.txt`. The prototype is **noindex** until `NEXT_PUBLIC_ALLOW_INDEXING=true`.
- Security: CMS credentials are server-only (`server-only` imports, no `NEXT_PUBLIC_` secrets), CMS HTML is sanitised, security headers set in `next.config.ts`, contact form validated server-side with a honeypot, share buttons use plain links (no third-party scripts or trackers).

## Before going live

- Replace all placeholders (config, mock data or WordPress content) and real imagery.
- Connect the contact endpoint (`src/app/api/contact/route.ts` → `deliver()`) to SMTP or a ticketing system, and add rate limiting at the edge.
- Replace the map placeholder with an embedded map once the address is approved.
- Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_ALLOW_INDEXING=true`.
- Run an accessibility audit with real content (PDF accessibility in particular).
