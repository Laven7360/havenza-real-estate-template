# Havenza — Stage 5 Buy and Rent gateways

## 1. Files created

- `src/data/collections.js` — derives purpose-specific collections, selections, counts, states, lifestyles, imagery and existing-model Atlas URLs.
- `src/components/collection/CollectionParts.jsx` — shared opening, residence metadata/Save, places, atmospheres and photographic closing.
- `src/components/collection/RentalSequence.jsx` — rental sequence using the existing rail hook.
- `src/styles/collections.css` — shared identity and distinct Buy/Rent compositions.
- `scripts/verify-collections.mjs` — collection/query/rendering checks and rental rail handler fixtures.
- `STAGE5_REPORT.md` — this report.

## 2. Files modified

- `src/pages/Buy.jsx` — replaces the ownership placeholder.
- `src/pages/Rent.jsx` — replaces the rental placeholder.
- `src/components/layout/MainLayout.jsx` — Buy/Rent document titles only.
- `scripts/verify-prototype.mjs` — updated Buy/Rent heading expectations.
- `README.md` — Stage 5 status and test command.

## 3. Shared architecture

Both pages use shared collection primitives but compose them differently. `getCollection` derives references to the existing property objects through the shared discovery filter function. `collectionPath` uses the existing query serializer; there is no new listing dataset or competing filtering system. Save controls use `useSavedProperties`. Rent reuses `usePropertyRail` without changing the approved homepage rail.

## 4. Buy sections

- Split editorial opening: “A place to keep”, grounded material imagery, five-residence count and sale Atlas CTA.
- “For ownership”: three featured-first sale residences, arranged as landscape, offset portrait and wide photographic chapters.
- “Where roots take hold”: Kuala Lumpur, Selangor and Johor with actual counts and neighbourhood context.
- “Own it your way”: only lifestyles with matching sale residences.
- “Before the address”: four concise, non-financial notes on Place, Space, Pace and Context.
- Photographic closing leading to the sale Atlas.

## 5. Rent sections

- Asymmetric city opening: “For where life is now”, three-residence count and rental Atlas CTA.
- “Places for now”: all three rental residences in a horizontal image/metadata sequence. All facts and Save are always visible.
- “Choose your pace”: actual rental lifestyle matches.
- Place strip: Kuala Lumpur and Selangor, with their represented neighbourhoods and matching state counts.
- A quieter photograph and “Not every home has to be forever to matter.”
- Photographic closing leading to the rental Atlas.

The wording avoids claiming fictional properties are currently available in a live market.

## 6. Dataset and photography

No property records, purposes, prices, images or lifestyle memberships were changed. Existing data has five sale and three rental residences. Buy selects three from the existing sale data, prioritizing featured records; Rent uses all rentals. Property photographs come from each record. Separate editorial references use the centralized photography catalogue through the collection model. Automated checks confirm that no image source repeats within either page. Hero imagery is eager; remaining imagery is lazy, with reserved aspect ratios.

## 7. Atlas/query integration

All collection CTAs use `purpose=sale` or `purpose=rent`, optionally combined with an existing `state` or `atmosphere`. Every exposed filter combination produces results. State cards list the relevant neighbourhoods but explicitly link to “Explore [state]”; no unsupported neighbourhood parameter or misleading neighbourhood-level count is introduced. All property links use existing ID routes and carry the purpose-filtered Atlas path in router state for dossier return navigation.

## 8. Saved integration

Always-visible SAVE + / SAVED ✓ buttons beside residence metadata use the existing hook, localStorage key and shared navbar count. Pressed state is accessible. No extra persistence implementation or authentication.

## 9. Responsive behavior

Buy reflows into image-led chapters with a modest portrait offset on mobile. Rent shifts from side-by-side image/metadata frames to swipeable vertical frames with the next item partially visible. Native horizontal scrolling, scroll snap, mouse drag, arrow buttons, trackpad, and focused-gallery keyboard navigation reuse the established rail behavior. Scrollbars are visually hidden without disabling native scrolling. Tail space allows the last rental to reach its own snap position. Breakpoints simplify layouts at 1024px and 760px, with additional narrow-screen adjustments.

## 10. Accessibility

One h1 per page, sequential section headings, clickable Home breadcrumbs, descriptive image alternatives, semantic links/buttons and visible focus. Rental controls have labels and associated instructions; progress uses a live status. Save uses `aria-pressed` and a checkmark/underline in addition to state color. No essential information is hover-only. Existing reduced-motion behavior applies to reveals and rail navigation. Navbar, fullscreen menu and footer are unchanged.

## 11. Document titles

- `/buy`: `Buy Property — Havenza`
- `/rent`: `Rent Property — Havenza`

Both use the existing MainLayout title effect.

## 12. Automated verification

Passed:

- `node scripts/verify-collections.mjs`: purpose-only selections, data-derived counts, resolvable residence links, canonical Atlas query values, nonempty state/lifestyle results, unique page imagery, Save markup and rental controls. Rental navigation handlers are checked with three-item fixtures at 1920, 1440, 1366, 1024, 768, 430 and 390px.
- `node scripts/verify-prototype.mjs`: route, image, data and shared navigation smoke checks.
- `node scripts/verify-discovery.mjs`: 1,500 filtering combinations plus saved persistence, sorting, query and rendering checks.
- `node scripts/verify-residences.mjs`: all eight dossiers, ID/slug resolution, facts, amenities, imagery, next links and enquiry/viewer logic.
- `node scripts/verify-rail.mjs`: existing rail handler checks at nine width fixtures.

**Manual QA limitation:** the Browser skill could not connect; it returned “No browser is available.” Fixture widths are not screenshots or browser layout measurements. Live overflow, typography/image appearance, trackpad/touch scrolling, focus behavior, Save interactions and document-title changes at the requested widths remain unverified. No claim is made that manual viewport checks passed.

## 13. Lint

`npm.cmd run lint` passed without warnings or errors.

## 14. Build

`npm.cmd run build` passed. No dependencies were added.

## 15. Intentionally deferred

About and Contact remain placeholders. Approved Home, Atlas, dossiers, navigation/menu identity and saved implementation were not redesigned. No duplicated inventory UI, financial/legal advice, fake counts, unsupported filters or real listing claims. Work stops at Stage 5 for review.
