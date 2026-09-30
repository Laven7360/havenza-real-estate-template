# Havenza — Stage 4 Residence Dossier

Implemented `/properties/:propertyId` for all eight fictional residences. Home and Property Atlas retain their approved visual designs. Atlas received navigation-state integration only.

## 1. Files created

- `src/data/residenceDossier.js` — residence resolution, curated next property, safe Atlas return paths, viewer navigation and enquiry validation.
- `src/components/residence/ResidenceDialog.jsx` — native modal lifecycle, body locking and focus management.
- `src/components/residence/ImageViewer.jsx` — fullscreen photograph viewer.
- `src/components/residence/EnquiryDialog.jsx` — client-side demo enquiry.
- `src/styles/residence.css` — scoped dossier, gallery, viewer, form and responsive styling.
- `scripts/verify-residences.mjs` — all-residence data/rendering checks and interaction-logic checks.
- `STAGE4_REPORT.md` — this report.

## 2. Files modified

- `src/pages/PropertyDetails.jsx` — complete dossier and residence-specific not-found state.
- `src/data/properties.js` — distinct story content and derived amenity highlights.
- `src/pages/Properties.jsx` — detail links carry their originating Atlas query in router state.
- `src/components/layout/MainLayout.jsx` — residence-specific document titles; existing route-change focus and scroll reset retained.
- `scripts/verify-prototype.mjs` — expected missing-residence content updated.
- `README.md` — current Stage 4 status and verification command.

## 3. Property data expansion

The existing eight records remain the single source of truth. Added distinct `story.heading`, `story.body` and `story.note` fields. `highlights` derive from each residence's actual amenities. Numeric prices, rental monthly periods, sizes, IDs, slugs, atmosphere descriptions and canonical lifestyle memberships are preserved. No duplicate `numericPrice`, listing dataset or saved-property store was created.

## 4. Cover

Near-viewport photographic opening below the existing navbar, with HAV index, purpose, title, location/state, price, Save, enquiry and photograph-viewer actions. A Home link and Back to Property Atlas are immediately available. A five-part facts strip follows the cover. The heading remains in normal layout flow and scales down for mobile.

## 5. Story and gallery

Each residence has its own editorial heading and concise narrative. The photographic sequence varies scale with a large landscape study and an offset portrait study when a second reference exists. Numbering, captions, photographer credits and visible opening controls accompany the photographs.

**Photography scope:** existing image arrays contain two images for The Terrace, Courtyard House and Canopy Residence, and one for each other residence. No additional photographs were sourced or generated. These are deliberately shorter sequences than the suggested 4–6 images; the page supports longer arrays, but does not manufacture extra views or reuse another listing's primary photograph. Source images are labelled illustrative visual references rather than verified photographs of one real building.

## 6. Image viewer

Implemented without a gallery library. Major gallery images and the cover's View photographs control open a fullscreen native dialog. Includes count, Close, Previous/Next, keyboard arrows, Escape, body scroll locking and focus restoration. Only the current fullscreen image is mounted. Single-image collections disable Previous/Next. The image is contained without cropping, and touch controls remain available on mobile.

## 7. Space and amenities

The Space section shows numeric floor area, bedrooms/bathrooms and assigned amenity highlights. Amenities render directly from the selected record as a numbered text grid. No extra amenities, room dimensions or floor plans were invented. A bounded sticky decision panel repeats the useful facts, price, Save and enquiry action.

## 8. Location

A forest-green editorial location composition uses the real neighbourhood/state fields and an abstract point/line treatment. It explicitly states that no exact address is represented. The state link opens its filtered Atlas collection. No coordinates, map API, travel times or precise location claims.

## 9. Atmosphere integration

Actual `lifestyles` membership selects the existing Life Match labels/descriptions and links to `/properties?atmosphere=<value>`. Multiple memberships produce multiple relevant links. Southern Light has no canonical lifestyle membership; it shows its existing Bright / Easy description and a general Atlas link instead of inventing a filter value.

## 10. Enquiry

The cover and decision-panel actions open a labelled modal with Name, Email, optional Phone and Message. The message defaults to the selected residence. Validation rejects blank/whitespace-only required fields, invalid email formats and excessive lengths. Invalid fields receive individual messages and focus. Successful validation clears/unmounts the form and displays: “Demo enquiry — This portfolio demonstration does not send or store property enquiries.” No request, database, localStorage, analytics, console logging, agent contact or WhatsApp number is used for enquiry contents.

## 11. Saved integration

Both dossier Save controls use the existing `useSavedProperties` hook. The pressed state, navbar count, localStorage persistence and cross-tab behavior share the Stage 3 implementation. No second saved system.

## 12. Next residence and Atlas return

The closing photographic link advances through the existing curated array, wrapping from Southern Light to The Terrace. Route changes retain the shared top-of-page scroll reset. The dossier is keyed by property ID, so local modal/form/gallery state resets on a new residence. Atlas/Index links pass normalized filters, sort and view through router state; dossier return links and subsequent Next residence links retain it. Direct visits without that state return to `/properties`. Both IDs and existing slugs resolve. Invalid identifiers show “Residence not found” and a clear Atlas link.

## 13. Responsive work

Cover copy rearranges at 900px, typography and gallery composition simplify at 760px, and amenities become one column at 430px. Facts wrap into a compact grid. The decision panel becomes ordinary flow on tablet/mobile and short viewports. The enquiry dialog fills the mobile viewport with internal scrolling; the viewer keeps touch-sized controls. Images have reserved frame ratios. CSS is designed for the requested desktop/tablet/mobile range, but live viewport validation is still outstanding.

## 14. Accessibility

One page h1, labelled sections, meaningful image alternatives, semantic links/buttons, accessible Save pressed state and visible focus. Native dialogs isolate background content, handle Escape and Tab boundaries, restore trigger focus and lock page scrolling. Viewer count uses a polite live status. The enquiry form has explicit labels, required semantics, invalid states, associated error messages and a focused success heading. Existing reduced-motion rules apply; gallery hover transforms are explicitly disabled for reduced motion.

## 15. Verification

Passed:

- `node scripts/verify-residences.mjs`: every ID/slug route; required fields; valid local WebP arrays; prices, facts, stories and amenities; supported atmosphere links; next-property cycle; invalid route; safe preserved Atlas queries; viewer navigation boundaries and markup; every enquiry default and validation cases.
- `node scripts/verify-prototype.mjs`: existing routes, Home structure, shared navigation, property/image invariants.
- `node scripts/verify-discovery.mjs`: 1,500 filter combinations, sorting/query behavior, saved persistence logic and discovery rendering.
- `node scripts/verify-rail.mjs`: existing homepage rail handlers against nine width fixtures.

**Limits:** the Browser skill's connection attempt returned “No browser is available.” Server rendering and handler/data tests do not verify live browser layout or interactions. Screenshots and overflow checks at 1920, 1600, 1440, 1366, 1280, 1024, 768, 430 and 390px remain unverified. Live touch/keyboard operation, focus restoration, modal scroll behavior, visual image coherence and browser-refresh behavior also need browser review. No claim is made that these manual checks passed.

## 16. Lint

`npm.cmd run lint` passed without warnings or errors.

## 17. Build

`npm.cmd run build` passed. No runtime dependencies or heavy image/gallery libraries were added.

## 18. Intentionally deferred

Full Buy, Rent, About and Contact pages remain untouched. No real property-enquiry delivery, agent identities, exact addresses, floor plans or maps. Further photography acquisition is not included in this implementation; the actual available references are reported above. Work stops at Stage 4.
