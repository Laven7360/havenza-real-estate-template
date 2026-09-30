# Havenza — manual browser QA

**Status: pending owner testing.** No live browser QA or viewport screenshots were performed during the Stage 7 continuation. Automated results do not check these boxes.

Run the dev server, then repeat critical journeys against `npm.cmd run build` / `npm.cmd run preview`. For issues, record route, browser/version, OS/device, viewport, steps, expected/actual behavior and screenshots. Use synthetic form values.

| Pass | Browser / device | Date | Result / issues |
| --- | --- | --- | --- |
| Desktop | | | Pending |
| Tablet | | | Pending |
| Mobile touch | | | Pending |
| Keyboard / screen reader | | | Pending |
| Production preview | | | Pending |

## VIEWPORT DENSITY — Stage 7.5

Status: pending browser inspection. The Browser connection was unavailable during implementation. The checks below have not been marked as passed by automated suites.

- [ ] 1920×1080: inspect every major section and each route's first screen.
- [ ] 1600×900: inspect every major section and each route's first screen.
- [ ] 1440×900: inspect every major section and each route's first screen.
- [ ] 1366×768: prioritize heading + purpose + meaningful content in one composition.
- [ ] Section headings remain connected to their content; Selected Residences shows the beginning of its first chapter.
- [ ] No introduction unnecessarily consumes a full viewport.
- [ ] No important controls are pushed below the fold unnecessarily; hero action, Contact pathways and discovery beginning appear promptly.
- [ ] Life Match statement, choices and active information feel like one interaction.
- [ ] Living Index heading, image and several rows appear together.
- [ ] New to Havenza and Rent rail headings, photography, progress and controls feel connected; final items and next-item peeks remain usable.
- [ ] Home Property Atlas retains its established scale and information density.
- [ ] Dossier image hierarchy is clear: large cover, medium-large primary image, smaller offset secondary image; crop changes remain coherent.
- [ ] Buy/Rent show a path forward quickly; About principles are easy to scan together; Contact form spacing stays professional.
- [ ] No new clipping, cut-off focus rings or unreadable line breaks from compaction.
- [ ] No sticky-header, chapter-image, sidebar or toolbar overlap. Also test 720px and shorter desktop heights.
- [ ] All six menu destinations remain visible on normal laptop heights; preview remains legible.
- [ ] Footer brand, links and disclosures form a coherent ending.
- [ ] Mobile remains comfortably spaced at 390/430px, with useful touch targets and natural vertical scrolling.
- [ ] Tablet at 768/1024px retains clear hierarchy; test portrait and landscape.
- [ ] Repeat keyboard, touch, dialog, save/filter, reduced-motion and form checks after reviewing density.

### Scroll-length comparison

Measure at the same viewport, zoom and font settings after scrolling through the page to load imagery. Record `document.documentElement.scrollHeight` in the browser console, plus screenshots of each first screen. Page height is supporting evidence; do not approve a shorter page if controls, context or readable spacing are lost.

The pre-refinement styles are saved locally at `C:\Users\ASUS\AppData\Local\Temp\havenza-density-baseline-20260930-213444`. This is a temporary local snapshot, not a Git baseline or shipped asset. If comparing the old version, use a separate local project copy with those styles; do not overwrite the refined working tree. The JSX change only makes one Life Match line break responsive, so preserve the old break when constructing a strict before comparison.

| Route | Viewport | Before height | After height | First-screen / context findings |
| --- | --- | --- | --- | --- |
| `/` | 1366×768 | Unmeasured | Unmeasured | Pending |
| `/properties` | 1366×768 | Unmeasured | Unmeasured | Preserve workspace scale |
| `/properties/hz-001` | 1366×768 | Unmeasured | Unmeasured | Two-image dossier |
| `/properties/hz-007` | 1366×768 | Unmeasured | Unmeasured | Single-image dossier |
| `/buy` | 1366×768 | Unmeasured | Unmeasured | Pending |
| `/rent` | 1366×768 | Unmeasured | Unmeasured | Pending |
| `/about` | 1366×768 | Unmeasured | Unmeasured | Pending |
| `/contact` | 1366×768 | Unmeasured | Unmeasured | Pending |

Repeat the table for the other three desktop viewports. No total-page reduction percentage is claimed without browser measurement.

## General presentation checks

- [ ] Inspect 1920, 1600, 1440, 1366, 1280, 1024, 768, 430 and 390px; add 320px as a stress check.
- [ ] Test short desktop height, phone landscape and device rotation.
- [ ] Test Chrome/Edge, Firefox and Safari where available; include real iOS/Android touch devices.
- [ ] At 200% zoom and enlarged text, content and controls remain accessible.
- [ ] No unintended horizontal page scrolling; intentional rails still scroll.
- [ ] Headings, long labels, prices and captions fit without clipped letters or collisions.
- [ ] Spacing, alignment, image crops and reading order remain coherent at each breakpoint.
- [ ] Fixed header, sticky chapters, rail toolbar and dossier sidebar do not cover actions or footer content.
- [ ] Overlay text stays readable across photo crops; check actual contrast, including muted labels/errors.
- [ ] Slow image loading causes no disruptive layout shifts.
- [ ] Form controls fit mobile widths, remain readable and avoid unwanted iOS input zoom.

## Global routes, navigation, menu and footer

- [ ] Load and refresh `/`, `/properties`, `/buy`, `/rent`, `/about`, `/contact` directly.
- [ ] Navigate between every route; test browser Back/Forward, trailing slashes and `/ABOUT/`.
- [ ] Brand returns Home; Atlas opens discovery; Saved opens `?saved=1` on desktop and mobile.
- [ ] Header photo treatment and scroll compaction work on Home and reset correctly across routes.
- [ ] Open menu from every page; six destinations and active treatment are correct.
- [ ] Preview updates on mouse hover and keyboard focus, including rapid changes on a slow connection.
- [ ] Menu traps Tab/Shift+Tab, makes background inert and locks background scrolling.
- [ ] Close/Escape returns focus to Menu when staying on the page.
- [ ] Choosing a destination closes menu, restores scrolling and focuses destination content.
- [ ] Reopen during closing animation; repeated open/close does not leave invisible overlays or locked scrolling.
- [ ] Short-height menu scrolls so every link and Close remain reachable.
- [ ] Footer links, portfolio disclosures and Back to top work everywhere.
- [ ] Skip to content moves keyboard focus to the main landmark.
- [ ] Direct and cross-route `/contact#developer-enquiry` reach the visible section below the fixed header.
- [ ] Both Contact pathway anchors work repeatedly and with Back/Forward and reduced motion.

## Home

- [ ] Hero crop/heading/CTA fit; hero-to-Atlas transition retains the approved composition.
- [ ] Every Atlas location updates image, title, facts, price and correct detail link.
- [ ] Slow photo swaps keep a usable previous image until the next selection loads.
- [ ] Selected Residence chapters and links are correct on desktop/mobile.
- [ ] Life Match previews with mouse/focus; click/tap/Enter/Space selects each lifestyle.
- [ ] Counts and lifestyle query destinations agree for Connected, Quiet, Open and Green.
- [ ] Living Index changes desktop and mobile imagery and links to the correct dossier.
- [ ] New to Havenza: repeated Previous/Next, correct endpoints and scroll-synchronized progress.
- [ ] Rail: native horizontal trackpad/wheel scrolling, mobile swipe and snapping.
- [ ] Rail: drag does not open a property; ordinary click still opens it.
- [ ] Rail: Left/Right/Home/End when focused; Tab reaches every residence link.
- [ ] Vertical scrolling/browser gestures remain native; last item is fully reachable.
- [ ] Next-item peek and section-bound toolbar work; no toolbar overlap with following content.
- [ ] Editorial and closing sections remain readable; Atlas CTA works.

## Property Atlas

- [ ] Eight initial residences: five sale, three rent; prices and monthly rent labels are correct.
- [ ] Test purpose, state, type, beds, min/max price, atmosphere and saved-only separately and together.
- [ ] Desktop panels dismiss outside/on Escape and return focus to their trigger.
- [ ] Mobile filters trap focus, scroll internally and release body scroll on close.
- [ ] Mobile drafts commit on Apply, discard on Close; Reset/counts behave consistently.
- [ ] Resize across mobile/desktop breakpoints with filters open.
- [ ] Curated, price ascending/descending and largest-space sorting agree with displayed data.
- [ ] Atlas/Index modes retain filters; mobile results remain directly navigable.
- [ ] Hover/focus/select changes the active preview; keyboard users can open details.
- [ ] Empty result: `/properties?purpose=rent&state=johor`; reset restores results.
- [ ] Empty saved collection is understandable and recoverable.
- [ ] Invalid query `?purpose=invalid&min=NaN&view=grid` normalizes safely.
- [ ] Reversed range `?min=5800&max=3200` normalizes safely.
- [ ] Refresh/Back/Forward retain queries; filtering does not unexpectedly jump to page top.
- [ ] Region/lifestyle links produce matching results and counts.

## Saved properties

- [ ] Save/unsave in Atlas, Index, Buy, Rent and dossier; navbar count updates immediately.
- [ ] Refresh/reopen preserves saved IDs.
- [ ] Two tabs synchronize saving/removing and clearing the saved storage key.
- [ ] Malformed JSON, duplicate IDs and unknown IDs in `havenza.saved.v1` do not crash the app.
- [ ] Blocked localStorage still allows saving during the visit.
- [ ] Unsave the final saved result; empty state and focus remain usable.

## Every residence dossier

- [ ] Inspect `/properties/hz-001` through `/properties/hz-008` on desktop and mobile, plus each slug.
- [ ] Heading, story, purpose, price, beds, baths, size, amenities and image assignments agree with the record.
- [ ] Neighbourhood references are editorial, with no implied exact address.
- [ ] Life Index links work; Southern Light's fallback does not invent lifestyle matches.
- [ ] Photography/caption/credit/disclosure remain coherent and clearly illustrative.
- [ ] Open every photo; image fit, captions, index, Previous/Next and arrow keys work.
- [ ] Single-image residences disable navigation appropriately.
- [ ] Viewer traps focus; Escape/Close restores original trigger and scroll state.
- [ ] Repeated gallery/enquiry opening never leaves a stuck dialog or body scroll lock.
- [ ] Dossier Save agrees with saved state elsewhere.
- [ ] Next Residence traverses all eight and wraps without stale dialog/form state.
- [ ] Filtered Atlas → dossier → Return retains filter/view state; direct entry falls back to general Atlas.

## Demo forms — Contact and dossier

- [ ] No-send/no-store disclosure is visible before submission.
- [ ] Labels, required fields, optional phone and keyboard order are clear.
- [ ] Empty, whitespace-only and invalid-email submissions associate errors and focus the first invalid field.
- [ ] Valid synthetic input gives explicit demo confirmation, clears values and moves focus sensibly.
- [ ] Network panel shows no enquiry submission request; console/storage contain no form contents.
- [ ] Closing/navigating away discards application form state.
- [ ] Contact query `property=hz-001` through `hz-008` preselects correctly.
- [ ] Missing/invalid query falls back to No preference without an error.
- [ ] Residence change updates untouched suggested text but preserves customized messages.
- [ ] Changed property query clears stale sensitive fields.
- [ ] Demo property and real website-developer sections cannot be confused.
- [ ] Empty developer configuration displays explanatory text, not dead contact links.
- [ ] After owner configuration, email/WhatsApp/portfolio/GitHub use verified destinations and identify website work/new tabs appropriately.

## Buy, Rent and About

- [ ] All Buy chapters/place/lifestyle/closing links resolve to correct sale-filtered results.
- [ ] Rent sequence supports buttons, swipe, drag, keyboard and accurate endpoints.
- [ ] Rental discovery links retain `purpose=rent`; save buttons work without conflicting with drag.
- [ ] About principles, Atlas explanation, Life Index and regional counts match shared data.
- [ ] About transparency clearly states no properties are actually offered.
- [ ] About → developer section works from a scrolled page.

## Missing routes

- [ ] `/not-a-real-page`: branded 404, readable heading and working Home/Atlas actions.
- [ ] `/properties/not-a-real-property`: residence-not-found message and safe return link.
- [ ] Extra/malformed segments do not crash or produce blank content.
- [ ] Missing-page title and `noindex, follow` update; valid navigation restores metadata.

## Accessibility, motion and runtime

- [ ] Complete main journeys with keyboard only; every interactive control has visible focus.
- [ ] Screen reader announces headings, landmarks, controls, saves, results and errors appropriately.
- [ ] Modal background is not exposed as interactive; focus cannot escape.
- [ ] Toggle reduced motion before/during browsing; content stays visible, transforms stop and scrolling becomes immediate.
- [ ] No essential content depends on hover; touch targets remain usable.
- [ ] Cold cache/throttled network: hero priority, progressive images and photo swaps behave correctly.
- [ ] Block an image request: labelled fallback appears; changing to a working source recovers.
- [ ] No console errors, React warnings, broken assets or unexpected requests across all interactions.
- [ ] Photography remains illustrative; Bali/Vietnam reference scenes are not mistaken for actual Malaysian listings.
- [ ] Measure production-preview performance in browser tools and record results. No Lighthouse score is currently claimed.
- [ ] No Vite/React starter branding, unfinished active page copy or invented live URLs.

## Metadata and eventual hosting — no deployment in this stage

- [ ] Provide verified developer contact and confirm the real HTTPS production origin.
- [ ] Set `VITE_SITE_URL`, rebuild and inspect `dist/index.html` for absolute OG/Twitter image URLs.
- [ ] Running app: titles/descriptions/canonicals change with routes; slug canonical uses residence ID.
- [ ] Queries, hashes and saved choices are excluded from canonical URLs.
- [ ] Favicon and the 1200 × 630 social PNG load correctly.
- [ ] Acknowledge SPA limits: shared static crawler metadata and possible HTTP 200 for missing routes.
- [ ] After separately authorized deployment: verify direct deep-link refresh, assets, favicon/social image, 404 HTTP behavior and actual social previews.
- [ ] Add a real README Live Demo link only after deployment and approval.

## Sign-off

- [ ] Fix blocking findings and rerun lint, build and all seven suites.
- [ ] Capture representative desktop/mobile screenshots for every page type.
- [ ] Owner approves visuals/interactions before any GitHub push or deployment.

Approval / remaining issues: _not yet reviewed_.
