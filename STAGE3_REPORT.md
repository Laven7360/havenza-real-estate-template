# Havenza — Stage 3 Property Atlas

Implemented the discovery experience at `/properties`. The approved homepage composition and all later-stage placeholder pages are preserved.

## 1. Files created

- `src/data/propertyDiscovery.js` — shared query normalization, filtering, sorting, counts, summaries and selection fallback.
- `src/hooks/useSavedProperties.js` — shared saved IDs, localStorage persistence and cross-tab updates.
- `src/components/discovery/DiscoveryControls.jsx` — desktop filter panels and mobile filter dialog.
- `src/components/discovery/AtlasPhoto.jsx` — current/previous photograph crossfade and failed-image fallback.
- `src/styles/discovery.css` — scoped discovery layouts and responsive behavior.
- `scripts/verify-discovery.mjs` — filtering, query, sorting, persistence and rendering checks.
- `STAGE3_REPORT.md` — this report.

## 2. Files modified

- `src/pages/Properties.jsx` — replaces the placeholder with full discovery.
- `src/data/properties.js` — canonical lifestyle tags and image arrays.
- `src/data/discovery.js` — homepage lifestyle matches consume those tags.
- `src/components/layout/Navbar.jsx` — live Saved count and saved-collection destination.
- `src/styles/navigation.css` — 44px Saved link target.
- `src/components/home/Arrival.jsx` — Begin exploring destination.
- `src/components/home/EditorialClosing.jsx` — Explore the atlas destination.
- `src/components/home/LifeMatch.jsx` — atmosphere-specific destination.
- `scripts/verify-prototype.mjs` — updated Properties heading expectation and disabled unnecessary test WebSockets.
- `README.md` — current discovery, saved-state and verification documentation.

## 3. Property data

Retained eight fictional residences, IDs, slugs, prices, sizes, editorial atmosphere descriptions and unique primary photographs. Numeric `price` already supports filtering and sorting, so no competing `numericPrice` field was added. Each record now has an `images` array containing its primary image and existing secondary image where available. Canonical `lifestyles` arrays preserve the homepage's established Connected, Quiet, Open and Green matches; an unclassified residence remains in the full collection. No new runtime dependencies or photographs were added.

## 4. Filters

Purpose, Malaysian state, actual property type, minimum bedrooms, minimum/maximum MYR price, lifestyle and saved-only. Purpose/place/type use button-triggered radio panels. More Filters exposes the remaining criteria and an Apply action. Counts derive from the full dataset and are labelled accordingly. Combined criteria use AND matching. Reset clears criteria while retaining the current sort and desktop view. The summary and result count update together. A dedicated no-results composition offers reset.

## 5. Query parameters

| Parameter | Values |
| --- | --- |
| `purpose` | `sale`, `rent` |
| `state` | `kuala-lumpur`, `selangor`, `johor` |
| `type` | `condominium`, `terrace-house`, `semi-detached-house`, `studio` |
| `beds` | `1`, `2`, `3`, `4` minimum bedrooms |
| `min`, `max` | Nonnegative MYR amounts, up to two decimal places |
| `atmosphere` | `connected`, `quiet`, `open`, `green` |
| `sort` | `curated`, `price-asc`, `price-desc`, `size-desc` |
| `view` | `atlas`, `index` |
| `saved` | `1` |

React Router controls query navigation. Valid state survives refresh and supports back/forward navigation. Defaults are omitted; unknown/invalid values are removed using history replacement. Reversed ranges in external URLs are ordered safely. In the form, native numeric validation prevents applying reversed price endpoints. Purchase and monthly rental prices retain their distinct labels; choose a purpose for like-for-like price comparisons.

## 6. Atlas

Desktop uses a 60/40 photograph/index split, becoming 55/45 at narrower desktop widths. Hover, keyboard focus or a preview button selects a residence. Metadata, current index and a non-color-only selected indicator update together. The photograph crossfades after loading; only the current and previous selections are mounted. Explicit View property links resolve existing detail routes. Filtering safely falls back to a valid result and resets the index scroll position. Below the results, clearly labelled editorial region navigation applies state filters without claiming to be a map.

## 7. Index

Editorial catalogue rows show a lazy-loaded photograph, location, title, state, type, bedrooms, bathrooms, floor area, purpose, price, Save and View property. No card grid or hover-only facts. The preview is always present beside the row on desktop.

## 8. Sorting

Curated preserves the existing dataset order. Price ascending, price descending and largest floor area sort numeric fields without mutating the source. No fabricated newest ordering.

## 9. Mobile and tablet

At 900px and below, both desktop views become a gallery/index hybrid. Tablet rows place the image beside metadata; at 600px and below they stack vertically. Desktop view selection remains in the URL for returning to a larger screen. Filters open a native modal dialog with draft changes, result count, Apply, Reset and Close. Closing discards unapplied changes. Resizing to desktop closes the mobile dialog. Layouts use flexible columns, controlled type and reserved image ratios.

## 10. Saved residences

SAVE + / SAVED ✓ stores validated IDs under `havenza.saved.v1`, updates the shared navbar count and synchronizes other tabs. The navbar links to `/properties?saved=1`; mobile users can choose Only saved residences in Filters. Corrupt/stale saved IDs are discarded. When storage is unavailable, saves still work for the current visit. No account, authentication or separate Saved page.

## 11. Home integration

Begin exploring and Explore the atlas now use React Router links to `/properties`. Life Match routes to `/properties?atmosphere=<selected value>`. Matching membership is unchanged. No homepage visual redesign, section reordering or footer changes.

## 12. Accessibility

Clickable Home breadcrumb, semantic fieldsets/radio inputs, native sort select, labelled number inputs, visible focus, accessible preview/save/view controls and meaningful image alternatives. Selection uses symbols/underlines/borders as well as color. Result counts use a polite live region. Mobile uses native modal semantics, explicit Tab boundaries, Escape handling, focus restoration and body scroll locking. Desktop panels close on Escape/outside interaction. Existing reduced-motion rules apply to reveal and crossfade transitions. Native browser and assistive-technology behavior still needs live verification.

## 13. Lint

`npm.cmd run lint` — passed with no warnings or errors.

## 14. Build and automated checks

- `npm.cmd run build` — passed.
- `node scripts/verify-discovery.mjs` — passed: 1,500 combinations; price boundaries; invalid query handling and round trips; all sorts; reset; no results; active fallback; saved validation/load/save/unsave and unavailable-storage handling; Atlas/Index server rendering and detail links.
- `node scripts/verify-prototype.mjs` — passed: existing routes, homepage sections, shared navigation, data and local image assets.

The Browser skill was used to attempt preview access, but no browser was available. These automated checks are **not** live DOM, screenshot, touch, keyboard-interaction or viewport tests. Visual checks at 1920, 1600, 1440, 1366, 1280, 1024, 768, 430 and 390px remain unverified, as do live focus trapping, crossfade appearance, browser history interactions and storage-event synchronization. Responsive CSS has been implemented and reviewed; absence of horizontal overflow is not browser-certified.

## 15. Intentionally deferred

Full Property Details, Buy, Rent, About and Contact remain for later stages. No maps/API integration, live listing claims, account system or separate Saved page. Discovery filtering is centralized for future Buy/Rent integration. Work stops at Stage 3.
