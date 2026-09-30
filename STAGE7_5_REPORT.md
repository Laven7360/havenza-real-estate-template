# Havenza — Stage 7.5 viewport density refinement

Implemented 30 September 2026. Scope: scale, spacing, image hierarchy and viewport composition, preserving Havenza's approved editorial layouts. No deployment, GitHub push, property-data changes, new photographs, contact details, dependencies or new motion.

Git remains unavailable as a project history: Git itself is installed, but the directory has no repository. Before editing, all seven stylesheets were copied to `C:\Users\ASUS\AppData\Local\Temp\havenza-density-baseline-20260930-213444`; file-to-file diffs were reviewed against that snapshot. This is a local temporary backup, not a shipped asset or Git commit.

## 1. Global spacing

Added shared large/standard/compact section tiers, a heading-to-content gap, page/section display sizes and a height-aware editorial image cap in global.css. Existing declarations consume these variables directly; no separate overriding stylesheet or global scale transform was added. Small informational sections remain auto-height. Larger cinematic sections retain their own treatment.

## 2. Typography

Selected Residences, Living Index and New to Havenza use a bounded section-title scale instead of inheriting the largest Atlas heading. Buy/Rent/About/Contact page titles have a shared responsive range. Principle headings, dossier section headings and footer branding are more restrained. Body copy, metadata, form labels and useful line heights are preserved. Home Atlas keeps its original display-heading scale through the existing default.

## 3. Height-aware rules

Desktop rules at widths of at least 1025px adjust spacing/display tokens at 900px, 800px and 720px heights. Hero typography considers both width and height. Image frames use bounded viewport-relative dimensions; no editorial section is locked to a viewport height. Short-screen chapters stop sticking, and the dossier decision panel becomes static at heights of 900px or less. Menu text/gaps also respond to height while retaining mobile overrides.

## 4. Home

Retained hero layout, photographic transition, all sections and interactions. On laptop heights, hero top padding drops from 150px to 120px, heading size is height-bounded, and the transition runway drops from 120svh to 112svh. The intentional editorial pause uses the large spacing tier rather than up to 9rem padding per side. Closing text/padding accommodates shorter desktop screens.

## 5. Selected Residences

The introduction now uses compact heading/content spacing with a slightly smaller display range. Chapters keep alternating asymmetry; image frames are bounded at 360–620px depending on height, instead of up to 800px with a 600px minimum. Story panels grow with their contents rather than carrying a matching 800px minimum. Facts and title gaps are closer to the CTA. Tablet story padding is 1.5rem; mobile remains stacked.

## 6. Life Match

Desktop introduction groups the statement and supporting copy side by side. One existing line break becomes responsive, with an explicit space retained when it is hidden. The four choices, image and active information remain unchanged. Removed the stage's 700px minimum; content and padding determine height. Choice typography remains large, targets are not reduced, and the description retains room for dynamic content. Mobile retains its stacked introduction and controls, with excess reserved description space removed.

## 7. Living Index

Closer title-to-index spacing and a 440px desktop image minimum replace the 580px minimum. Desktop rows have tighter surrounding padding and proportionate place headings, while existing links retain 44px minimum height. The split layout and mobile inline photographs remain intact.

## 8. New to Havenza

Closer heading/rail grouping; desktop image aspect ratio changes from 1.3 to 1.6 with a 40svh/440px cap. Metadata starts closer to the photograph. Rail widths, end spacing, snap targets, partial-next-item cue, sticky toolbar and keyboard/drag/touch handlers are untouched. Mobile keeps square images and its existing control dimensions.

## 9. Property Atlas

Home Atlas composition, image sizing, information panel and location navigation are preserved. On `/properties`, only the intro's lower gap and top grid margin are reduced. Workspace dimensions, purposeful internal scrolling, filter controls, results and Atlas/Index behavior are unchanged.

## 10. Property Details

Cover remains cinematic but leaves a little more room for the beginning of quick facts on desktop. Post-cover stories, practical information, amenities, neighbourhood and Life Index have shorter section gaps. Primary editorial photographs are medium-large and bounded; offset secondary images use a smaller 440px/48svh cap. The viewer still displays the complete image according to its existing behavior. Next Residence is shorter. Mobile gallery frames remove desktop caps, and short-height decision panels no longer stick.

## 11. Buy

Shorter opening image and spacing reveal the next collection heading sooner. Curated chapter gaps are reduced; the redundant sequence margin plus first-item margin is removed. Images use a bounded hierarchy with the same alternating compositions. Sale links, prices, facts and saved controls remain intact.

## 12. Rent

Opening image and its lower offset are smaller. Rental heading sits closer to its rail; desktop rental frames use square, bounded photography rather than tall 4:5 frames. Toolbar spacing and editorial pause are shorter. Rail widths, snap geometry, all three residences and rent-filtered links are preserved. Mobile retains 5:4 frames.

## 13. About

Opening heading/image height and lower gap are reduced so philosophy and the next section begin sooner. Place/Space/Life rows have less vertical padding and proportionate headings. Atlas perspectives, lifestyle rows, regional imagery and transparency use disciplined spacing. Malaysia's secondary image remains asymmetric without imposing a tall portrait frame. All explanatory content and disclosures remain present.

## 14. Contact

Opening and pathways have tighter gaps/padding; laptop-specific heading sizes bring both actions into the first-screen composition. Form field gaps reduce from 1.25rem to 1rem, while labels, input padding and the 56px submit target remain unchanged. The desktop photographic interruption is shorter, reducing distance to developer contact. Hash links, form semantics and privacy behavior are unchanged. Developer configuration remains empty.

## 15. Menu and footer

Menu typography and vertical link padding now respond to viewport height; preview minimum height is also bounded. All six destinations and dynamic preview remain. Footer reduces its wordmark maximum from 17rem to 13rem and tightens surrounding space, retaining its publication identity, navigation and disclosures.

## 16. 1366×768 safeguards

This viewport receives the 800px-height spacing tier: standard sections use 2.5rem, large sections 3rem, compact sections 1.5rem and heading gaps 1.25rem. Hero size is height-bounded, Contact pathways get a compact title treatment, image frames are shorter, and the dossier sidebar is static. These are implemented safeguards; actual browser fit is not asserted.

## 17. Mobile and tablet

Desktop density media queries require at least 1025px width. Existing 760px mobile and 900/1024/1100px intermediate layouts remain. Mobile section tokens keep comfortable 1.5–3rem spacing; no whole-site scaling or tiny text. Gallery/rail image caps are removed where mobile aspect ratios take precedence. The earlier short-height hero rule is restricted to tablet widths so it does not override the new laptop rules.

## 18. Accessibility regression status

Existing touch dimensions, visible focus, form spacing/semantics, keyboard handlers, dialog behavior and reduced-motion rules were retained. No controls/content are hidden to meet height targets. Automated accessibility-related markup/handler checks pass. Real keyboard focus, screen-reader output, cropped focus rings and sticky overlap still require browser review.

## 19. Automated verification

All seven existing suites passed without weakening or changing their assertions:

- `verify-prototype.mjs`
- `verify-rail.mjs`
- `verify-discovery.mjs` — includes 1,500 filter combinations
- `verify-residences.mjs` — all eight IDs/slugs
- `verify-collections.mjs`
- `verify-editorial.mjs`
- `verify-polish.mjs` — 27 full-layout route cases

These are data, server-rendered markup, source-guard and handler-fixture tests, not viewport rendering or actual touch tests. No additional test suite was added for simple CSS property assertions.

## 20. Lint

`npm.cmd run lint` passed, exit code 0.

## 21. Build

`npm.cmd run build` passed, exit code 0. Vite 8.3.1; 86 modules. Output: CSS 85.53 kB / 16.11 kB gzip; JavaScript 364.30 kB / 107.71 kB gzip. No dependency or asset changes. Generated `dist/` was refreshed.

## 22. Remaining browser review

The Browser skill was initialized, returned “No browser is available,” and discovery returned no connected browsers. Therefore no screenshots, measured scroll heights or browser visual passes are claimed.

MANUAL_QA.md now includes **VIEWPORT DENSITY** with unchecked 1920×1080, 1600×900, 1440×900 and 1366×768 checks; heading/content connection; control visibility; clipping/sticky overlap; mobile/tablet comfort; and interaction regressions. A before/after scroll-height table and measurement procedure are included. Inspect all routes and all major sections, not only Home.

### Source-level comparison, not rendered page measurements

The examples below evaluate declared CSS at 1366×768 with a 16px root font. They show concrete reductions in decorative allocation, not total section/page height or guaranteed fit:

| Declaration | Before | After |
| --- | --- | --- |
| Selected intro vertical padding | 80px top + 16px bottom | 40px top + 20px bottom |
| Selected section heading font size | about 83px | about 55px |
| Selected chapter image frame | about 730px | about 445px |
| Story panel minimum height | about 730px | Removed; content determines height |
| Life Match stage minimum | 700px | Removed; content determines height |
| Living Index image minimum | 580px | 440px |
| Buy opening image height | about 574px | about 330px |
| Standard editorial padding, each side | up to about 82px | 40px |
| Dossier practical margins, each side | about 109px | 48px |

Total page-length comparison remains **unmeasured**. It requires the same browser, viewport, zoom and fully loaded layout before/after; no estimated page-height percentage is substituted for that measurement.

### Files changed

All seven existing stylesheets (`global`, `home`, `discovery`, `residence`, `collections`, `editorial`, `navigation`), `src/components/home/LifeMatch.jsx` (one responsive line break), `MANUAL_QA.md`, `README.md`, and this new report. No interaction logic or property content was changed.

Stop point: implementation and automated regression checks complete; owner visual review pending. No deployment or push.
