# WordPress (headless) content model

WordPress is used **only** as a content repository and editing interface. It has
no public theme: the Next.js application renders every page and reads content
through the WordPress REST API.

Everything below is implemented in
[`wordpress/mu-plugins/institution-content-model.php`](../wordpress/mu-plugins/institution-content-model.php)
and consumed by [`src/lib/cms/wordpress`](../src/lib/cms/wordpress/index.ts).

---

## 1. Required plugins

| Plugin | Why |
| --- | --- |
| **Advanced Custom Fields PRO** | Structured fields, repeaters, the *Site settings* options page. Each field group has *Show in REST API* enabled. |
| **Polylang** (or WPML) | Albanian (default) and English versions of every entry. The frontend sends `?lang=sq|en` (Polylang) or `?wpml_language=` (set `WORDPRESS_LANG_PARAM`). |
| *Optional:* Safe SVG, Yoast/Rank Math (SEO fields), WP Mail SMTP, a security plugin, Application Passwords (core). | |

Install the mu-plugin by copying it to `wp-content/mu-plugins/`. No theme
configuration is needed; a minimal blank theme is recommended.

---

## 2. Custom post types

| Post type | REST base | Editor sees | Core fields used | ACF fields |
| --- | --- | --- | --- | --- |
| `inst_news` | `news` | **Lajme** | title, content, excerpt, featured image | `subtitle`, `author_department`, `is_featured`, `attachments[]` |
| `inst_announcement` | `announcements` | **Njoftime** | title, content, excerpt | `announcement_type` (official · notice · press · update), `is_important`, `attachments[]` |
| `inst_legal` | `legal-documents` | **Kuadri ligjor** | title, excerpt | `description`, `document_date`, `reference_number`, `file` |
| `inst_transparency` | `transparency-documents` | **Transparenca** | title, excerpt | same as legal |
| `inst_report` | `reports` | **Raporte** | title, excerpt | same as legal |
| `inst_publication` | `publications` | **Publikime** | title, excerpt | same as legal |
| `inst_vacancy` | `vacancies` | **Karriera** | title, excerpt (summary) | `department`, `location`, `contract_type`, `deadline`, `status`, `responsibilities`, `requirements`, `application_documents[]` |
| `inst_leader` | `leaders` | **Drejtuesit** | title (name), content (biography), featured image (portrait), menu order | `role`, `term` |
| `inst_department` | `departments` | **Struktura** | title, excerpt (description), menu order | `key`, `parent_key`, `level` (0/1/2), `responsibilities`, `units` |

`attachments[]` is a repeater of `{ title, file }`. Multi-line text fields
(`responsibilities`, `requirements`, `units`) take one item per line.

## 3. Taxonomies

| Taxonomy | Attached to | Example terms (sq) | Frontend use |
| --- | --- | --- | --- |
| `news_category` | News | Veprimtari institucionale, Bashkëpunim, Raportim, Komunikim publik, Evente | category label + filter on `/news` |
| `document_category` | Legal, Transparency, Reports | **Legal:** laws, regulations, decisions, instructions, policies, other · **Transparency:** public-information, institutional-reports, annual-reports, budget, procurement, access-requests, accountability · **Reports:** periodic, thematic, annual | tabs on `/legal`, portal categories on `/transparency/[category]`, filter on `/activities/reports` |
| `publication_type` | Publications | studies, guides, bulletins | filter on `/activities/publications` |
| `department_category` | Departments, Vacancies | (free) | grouping, future filters |

> **Slugs matter.** The frontend links to term *slugs* (e.g. `/transparency/budget`,
> `/legal?category=decisions`). Keep the English slugs above in both languages and
> translate only the term *name*. The term *description* is shown on the
> transparency portal cards.

## 4. Pages

| Page slug | Purpose | Fields |
| --- | --- | --- |
| `about` | Institutional profile | ACF: `introduction`, `mission`, `vision`, `values[]`, `mandate` (WYSIWYG), `legal_basis[]`, `history[]`, `principles[]` |
| `privacy` | Privacy policy | page content |
| `accessibility` | Accessibility statement | page content |

## 5. Site settings (ACF options page "Cilësimet e faqes")

Overrides [`src/config/institution.ts`](../src/config/institution.ts) at runtime.
Empty fields fall back to the config file.

`name`, `short_name`, `tagline`, `description`, `logo`, `street`, `city`,
`map_url`, `email`, `rti_email`, `press_email`, `phone`, `office_hours`,
`social[] {id, url}`, `partners[] {label, url}`, `application_forms[] {title, file}`,
`hero_image`, `stats_demo` (keeps the "demonstration data" label visible),
`stats[] {value, suffix, label, period}` (max 4).

> With Polylang, use *Polylang → Strings* or an ACF-Polylang bridge so the options
> page can hold one value per language.

## 6. Menus

Register **Appearance → Menus → "Navigimi kryesor"** (location `primary`), one
per language. Top-level items become header entries, second-level items become
mega-menu links, and each top-level item's *Description* is shown as the
mega-menu intro text. Use relative URLs with the locale prefix
(`/sq/legal?category=laws`). If the menu is empty or unreachable the frontend
falls back to [`src/config/navigation.ts`](../src/config/navigation.ts).

## 7. REST endpoints used by the frontend

| Endpoint | Used for |
| --- | --- |
| `GET /wp/v2/news?_embed&page&per_page&search&after&before&news_category` | News list / filters / pagination (`X-WP-Total`, `X-WP-TotalPages`) |
| `GET /wp/v2/news?slug=…` | Article page |
| `GET /wp/v2/announcements?announcement_type=press…` | Announcements (custom `announcement_type` filter added by the plugin) |
| `GET /wp/v2/{legal-documents,transparency-documents,reports,publications}` | Document lists |
| `GET /wp/v2/{news_category,document_category,publication_type}` | Filter options |
| `GET /wp/v2/vacancies`, `/wp/v2/leaders`, `/wp/v2/departments` | Careers, leadership, structure |
| `GET /wp/v2/pages?slug=about|privacy|accessibility` | Static pages |
| `GET /inst/v1/settings` | Identity, contacts, social, partners, forms |
| `GET /inst/v1/homepage` | Hero image + statistics |
| `GET /inst/v1/menu/primary` | Navigation tree |
| `GET /inst/v1/years/{base}` | Year filter values for document lists |

All endpoints are public read-only. Authentication (Application Password) is
only needed for previews of drafts; credentials stay in server-side env vars.

## 8. Caching & publishing flow

1. Responses are cached by Next.js for `WORDPRESS_REVALIDATE_SECONDS` (default 300 s) and tagged per content type.
2. On *save_post* the plugin calls `POST {INST_FRONTEND_URL}/api/revalidate` with the shared secret and the content type tag, so changes appear within seconds.
3. Add to `wp-config.php`:

```php
define('INST_FRONTEND_URL', 'https://www.example.al');
define('INST_REVALIDATE_SECRET', 'long-random-string'); // same as REVALIDATE_SECRET in the frontend
```

## 9. Editorial guidance (for administrators)

- **News:** title, short subtitle, excerpt (used on cards and as meta description), a landscape featured image (min. 1600 × 1067, with alt text), category, optional PDF attachments. Tick *Në fokus* for the article shown large on the homepage and news page.
- **Announcements:** choose the *Lloji*; press releases use *Njoftim për shtyp*. Tick *E rëndësishme* for urgent notices.
- **Documents:** always set *Data e dokumentit* (drives sorting and the year filter) and the reference number. Upload accessible (tagged) PDFs.
- **Vacancies:** the status switches to *closed* automatically after the deadline.
- **Structure:** each unit has a unique *key*; set *parent key* to place it in the organisational chart.

## 10. Switching the frontend to WordPress

```bash
# .env.local
CMS_SOURCE=wordpress
WORDPRESS_API_URL=https://cms.example.al/wp-json
WORDPRESS_LANG_PARAM=lang
REVALIDATE_SECRET=long-random-string
```

No component or page changes are required: every page reads through
`src/lib/cms`, and both providers implement the same `CmsProvider` interface.
