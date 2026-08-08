# Plus Advisor — Project Overview

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS v4
- **Libraries:** Locomotive Scroll, Lucide React, Sharp
- **Fonts:** Geist, Cormorant Garamond, Raleway, Saira, IBM Plex + local (Catalog, Gotham)
- **Content:** Static JSON (no CMS/DB)
- **Tooling:** ESLint 9, Node 20

---

## Internationalization

- 3 locales: **EN / ID / ZH**
- Locale-prefixed URLs, pre-generated at build
- Server-side JSON dictionaries per locale
- Localized metadata, dates, and language toggle

---

## Pages

- **Home** — brand landing
- **About** — company & leadership
- **Stories** — vision & mission
- **Family Office** — services
- **Journals** — article library (filter / sort / paginate)
- **Journal Article** — article detail view
- **Market Update** — market commentary

---

## Global Features

**Header** — sticky nav, logo, mobile hamburger, live article search, language toggle
**Footer** — brand info, locale-aware links, contact (phone / WhatsApp), socials, disclaimer

---

## Journal System

- Static JSON feed (~1.8 MB)
- Lookup by id or slug
- Reading-time estimate, auto image preview
- Pagination & sorting via URL params
- Share buttons on articles

---

## Motion & UX

- Locomotive smooth scroll
- Scroll-reveal, line-reveal, parallax, sliding divider
- Staggered entrance animations across sections

---

## Architecture

- Server-rendered pages, minimal client JS
- All content in JSON + locale dictionaries
- Custom navy + gold brand palette
- Fully responsive (desktop / tablet / mobile)

---

## For the Client

- Trilingual website (EN / ID / ZH)
- 7 pages covering brand, services, and insights
- In-site article search with instant results
- Cinematic scroll experience
- Fast loading, SEO-friendly, mobile-ready
- Direct contact via phone, WhatsApp, and socials

---

## For the Next Developer

- `[lang]` segment wraps all routes — validate locale in every page
- Add locale: extend dictionaries map + JSON file
- Add article: append to the JSON feed
- Reuse motion primitives (`ScrollReveal`, `LineReveal`, `Parallax`)
- Next.js 16 has breaking changes — check `node_modules/next/dist/docs/` before editing routing/data-fetching
