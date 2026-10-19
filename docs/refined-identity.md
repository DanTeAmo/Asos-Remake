# ASOS / Concept A — Refined

Implemented on `design/asos-refined-identity`, based on `8b15b6c` in the existing `DanTeAmo/Asos-Remake` checkout. At the start, the desktop-folder checkout pointed to the older `ad49751` revision. Following the user's request to apply the design to the current storefront, `main` incorporates the approved monochrome design and retains the newer shopping and carousel improvements. The experimental branch remains available separately.

## Direction

An editorial denim issue: neutral white, near-black ink and grey surfaces, a high-contrast ASOS wordmark, serif display typography, quiet utility typography and generous photography. The user confirmed neutral monochrome: no cream, brown or coloured interface accents. Photographs retain their original colours. This applies the already selected Concept A rather than exploring a replacement identity. Interface language remains English.

## Editable identity

`assets/identity/asos-refined.svg` contains only editable outline points, with an even-odd counter for O. It has no bitmap, embedded font or external dependency. The outlines were reconstructed from the supplied Concept A image, thresholding the dark mark and simplifying its perimeter within approximately one source pixel. The custom A and asymmetric S are preserved. The asset is shared by header and footer through `Wordmark.jsx`; favicon uses its A.

This is a reconstruction, not the original designer's Bézier master. A supplied original SVG/AI would remain preferable for large-format print. The raster reference itself is not shipped as the logo.

## Design system

| Role | Value |
| --- | --- |
| Paper | `#FFFFFF` |
| Ink | `#171717` |
| Muted text | `#626262` |
| Rules | `#D6D6D6` (decorative) |
| Secondary surface | `#F2F2F2` |
| Focus | `#171717` on light surfaces; `#FFFFFF` in the footer |
| Footer secondary text | `#CCCCCC` |
| Display | Georgia, Times New Roman, serif; weight 400, italic emphasis |
| Utility and body | Existing self-hosted Open Sans variable WOFF2 |
| Hero | 68–112px desktop; 64–84px phone; line-height .98 |
| Section heading | 32–50px; line-height 1.14 |
| Body | 12–14px; line-height 1.7–1.9 |
| Utility labels | 9–11px with 1.3–1.7px tracking |
| Spacing | 8, 12, 16, 20, 24, 32, 40, 52, 64, 80px |
| Container | 1600px maximum; responsive 20–64px side insets |
| Collection grid | Three desktop columns; two at ≤768px |
| Carousel | Existing three/two/one-card responsive behavior |

At ≤768px navigation becomes a disclosure with department controls and a full-width search. The hero retains a split composition on tablets and stacks copy above two photos at ≤480px. Footer links stack on small phones. Large photographs reuse existing local WebP assets with reserved aspect ratios, eager hero loading and lazy loading below the fold. No new font or runtime library is loaded.

Buttons use square corners and clear solid/outline hierarchy. Utility icons share a 24px viewBox and thin stroke. Hover states change colour, underline or image brightness. Focus outlines stay visible; search uses focus-within. Reduced motion disables all new transitions and retains the carousel's existing instant navigation path.

## Preserved behavior

Product IDs, prices, shopping data, storage keys and migrations, modal behavior, external destinations, department persistence, account links, search, carousel controls and gestures remain unchanged. The application still has its original single-page structure and modal product views; no router or checkout was introduced. Section anchors (`fits`, `hyped`, `brands`) are retained.

The design is an additive presentation stylesheet after the existing styles, with small changes to presentation markup. Hooks and shopping algorithms were not edited. The carousel component only changes its section heading.

## Verification

- Existing 11 Node tests passed.
- Vite production build passed.
- Browser checks at 320, 375, 390, 430, 600, 768, 1024, 1280, 1440 and 1920px: no horizontal page overflow.
- Axe automated checks for WCAG A/AA tags, including WCAG 2.1/2.2, at 390/1440px and the bag dialog: zero reported violations. Automated checks do not replace a full manual accessibility audit.
- Search → product → save/add multiple quantities → back to query passed.
- Bag quantities and saved items persisted through reload; removal and account destinations passed.
- Carousel next/previous, a complete animated queued loop, keyboard navigation and reduced-motion navigation passed.
- Mobile menu, department persistence, Escape dismissal, dialog keyboard containment and opener focus restoration passed.
- No browser runtime errors during these checks.

The six denim photographs were refreshed on 2026-10-19 with 960 × 1225 px images from ASOS, replacing the small Figma exports with baked-in gradients. The existing fit grid and hero share these assets. Sources and product-to-fit mapping are recorded in [the denim source notes](../assets/products/jeans/SOURCES.md). Core Web Vitals require measurement on the deployed site with real traffic.

## Run

From this repository, run `npm ci` if dependencies are absent, then `npm run dev`. For the production version use `npm run build` followed by `npm run preview`. The server prints the local URL. The approved source is maintained in GitHub `main`; deployment is a separate step.
