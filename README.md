# Havenza — The Property Atlas

A fictional Malaysian property discovery experience built as a frontend web design and development portfolio project. React 19, Vite 8, React Router 7 and custom CSS combine cinematic residence stories, a Property Atlas and lifestyle-led discovery.

**Portfolio demonstration only.** All eight residences and prices are fictional. Photography is illustrative, not actual listings. Havenza is not an estate agency and offers no properties for sale or rent. Enquiry forms do not send, persist or log entered information. Developer contact, when configured, is for website and freelance work only.

Stage 7 production preparation and Stage 7.5 visual refinement are approved by the owner. Verified developer contacts are configured, and Havenza is live on Vercel.

## Live Demo

[View Live Demo](https://havenza-real-estate-template.vercel.app/)

## Local development

Verified with Node v24.15.0 and npm 11.12.1. Use a Node version supported by the installed Vite version.

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the URL printed by Vite. On shells without the Windows execution-policy restriction, `npm` can replace `npm.cmd`.

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

The static build is written to `dist/`. Preview serves that build locally; it is not a deployment.

## Routes

| Route | Experience |
| --- | --- |
| `/` | Cinematic arrival, Atlas preview, residence chapters, Life Match, Living Index and property rail |
| `/properties` | Filterable Atlas/Index views, sorting and saved-only browsing |
| `/properties/:propertyId` | Residence dossier, gallery, demo enquiry, saved state and next residence; IDs and slugs accepted |
| `/buy` | Editorial gateway to five ownership residences |
| `/rent` | Editorial gateway with a three-residence rental rail |
| `/about` | Place / Space / Life philosophy and portfolio transparency |
| `/contact` | Separate demo property enquiry and developer contact |
| Unmatched paths | Branded “404 / Off the Atlas” page |

Unknown residence IDs display a residence-specific not-found page. Both missing-page types receive `noindex, follow` after the client renders.

Property Atlas query keys: `purpose`, `state`, `type`, `beds`, `min`, `max`, `atmosphere`, `sort`, `view`, `saved`. Invalid values normalize safely. Prices use MYR (monthly for rentals); sizes use square feet.

```text
/properties?purpose=sale&state=selangor&beds=3
/properties?purpose=rent&sort=price-asc&view=index
/properties?atmosphere=green
/properties?saved=1
/contact?property=hz-001
/contact#developer-enquiry
```

Saved IDs use the browser key `havenza.saved.v1`. Invalid stored IDs are ignored. If storage is blocked, saving still works during that visit. Enquiry contents are never sent or written to storage.

## Structure and photography

- `src/components/`: shared layout, Home, discovery, dossier, collection and contact UI.
- `src/pages/`: route components.
- `src/data/`: shared property records, photography, discovery models and metadata.
- `src/hooks/`: saved properties, rail controls and scroll progress.
- `src/styles/`: custom design system and page styles.
- `src/assets/images/`: local illustrative WebP photography.
- `public/`: branded favicon and social-preview PNG.
- `scripts/`: verification suites.

`src/data/properties.js` is the single primary dataset: five sale and three rental residences. Do not create page-specific listing datasets.

`src/data/photography.js` centralizes imports, alt text, crop positions, sources and credits. The 13 local WebP files total approximately 3.65 MB; they are not all fetched eagerly. Heroes have high priority, supporting images are lazy-loaded, and photo swaps mount only visited selections. Existing image frames reserve space. No external fonts, runtime photo CDN calls or animation libraries are required.

See [PHOTOGRAPHY.md](PHOTOGRAPHY.md) for source records. Many photographs depict Bali or Vietnam; two depict Kuala Lumpur. Gallery pairs are visual references, not verified photographs of the same building. Do not add unrelated images to fill galleries.

## Developer contact

Edit `src/data/developer.js` with verified owner-provided values only:

- `name`: optional public developer name.
- `email`: real developer/freelance email.
- `whatsapp`: international digits, optionally prefixed by `+`, without spaces or punctuation.
- `portfolio`, `github`: verified HTTPS URLs.

Verified public website/freelance developer contact:

- Developer: LAVEN RAJ A/L SAHADEVAN.
- Email: s.lavenraj2002@gmail.com (`mailto:`).
- WhatsApp: +6016-7938894; link uses international digits `60167938894`.
- Developer GitHub profile: https://github.com/Laven7360.
- `whatsappMessage`: “Hi, I came across your Havenza real-estate website project and would like to enquire about a website.” The link URL-encodes this text.

No portfolio URL was supplied, so that field remains empty. These are public developer contacts, not property-agent, sales, employee or customer-service details. External links use `noopener noreferrer`; demo enquiries remain separate and do not send or store information. Empty/invalid configuration values do not create dead links.

## Metadata and production configuration

- `index.html` contains branded title, description, favicon, theme colour, Open Graph and Twitter card metadata.
- `public/social-preview.png` is a local 1200 × 630 brand graphic, not additional property photography.
- `src/data/siteMetadata.js` updates route titles/descriptions/social text and missing-page indexing rules.
- The production origin is `https://havenza-real-estate-template.vercel.app`. `VITE_SITE_URL` is configured to this value in Vercel Production, and the deployment was redeployed with that environment variable.
- For local configuration, copy `.env.example` to `.env.local` and use the same origin when needed. Do not include a path, credentials, query or hash. `VITE_` values are public; never put secrets there.
- With the configured origin, the build inserts absolute social-image URLs into HTML; client navigation sets canonical/OG URLs. In environments without an origin, no canonical/OG page URL is invented and image URLs remain relative.
- This is a client-rendered SPA, not a prerendered site. Non-JavaScript crawlers receive shared Havenza metadata, not property-specific previews. Client `noindex` is not an HTTP status; unknown SPA routes may return HTTP 200.
- Vercel hosts the production deployment. `vercel.json` supplies the SPA fallback to `index.html`, supporting direct route access. The owner manually verified primary routes and direct SPA/deep-link refresh behavior after deployment.
- No sitemap is currently generated.

## Automated verification

```powershell
node scripts/verify-prototype.mjs
node scripts/verify-rail.mjs
node scripts/verify-discovery.mjs
node scripts/verify-residences.mjs
node scripts/verify-collections.mjs
node scripts/verify-editorial.mjs
node scripts/verify-polish.mjs
```

Coverage includes property/image integrity, route markup, 1,500 filter combinations, URL normalization, saved-state logic, dossiers, gallery navigation logic, rail geometry fixtures, collection links, demo validation, developer-contact fixtures and metadata transitions. The polish suite renders 27 full-layout route cases and checks internal links and anchors.

These data, server-rendered markup, source-guard and handler checks do **not** prove browser layout, live focus behavior, touch inertia, screen-reader output or performance scores.

Lint, build and all seven suites passed again after Stage 7.5. See [STAGE7_5_REPORT.md](STAGE7_5_REPORT.md) for density changes and browser-review limits, and [STAGE7_REPORT.md](STAGE7_REPORT.md) for the preceding takeover audit. Earlier reports document historical work, not current browser approval.

## Production status

- The visual result is approved by the owner.
- Verified developer contact is configured.
- `VITE_SITE_URL` is configured in Vercel Production, and the deployment is live.
- Primary routes and direct SPA/deep-link refreshes were manually checked by the owner after deployment.
- Lint, build and all seven automated verification suites passed.
- The project is stored in Git and pushed to GitHub.

Use [MANUAL_QA.md](MANUAL_QA.md) as the ongoing QA checklist. Historical unchecked entries are not automated evidence of browser testing. Re-run lint, build and all suites after fixes.

No code licence has been selected; photography has separate source terms recorded in PHOTOGRAPHY.md.
