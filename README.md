# ASOS-inspired frontend

React 19 + JavaScript/JSX + ordinary CSS, built with Vite. No TypeScript, Tailwind, UI kit or slider library.

## Run and verify

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

The original Figma brief is preserved in `README`. Its export, `references/WebSite.svg` (1440 × 2356), remains reference material, never a rendered website element.

## Design

The original monochrome palette, Open Sans, large tracked headline, denim photography, trainer cards and brand grid remain. The usability pass adds a short hero introduction and CTA, consistent heading insets, responsive image proportions, readable footer text, larger touch targets and a consistent card treatment. The page no longer claims exact coordinate fidelity to the original Figma export.

The site is centred at up to 1440 px. CSS adapts at 1279, 1023, 768, 600 and 480 px. Denim uses six, three or two columns. The trainer carousel shows three cards on desktop, two on tablets and one below 481 px, leaving clear side gutters for the arrows. Five unique products rotate in a continuous loop, one card per arrow click. Offscreen edge cards enable seamless motion and remain inert.

## Shopping behaviour

- Five unique trainers with integer prices in cents and formatted euro prices. The two Studio Edit styles are original AI-generated concept products with illustrative prices.
- The previous Fred Perry cards are one product; existing saved/bag IDs migrate without losing the item.
- Search covers the trainer edit. It matches all query words irrespective of case, whitespace or order. Results can be refined in place; empty results explain the scope and link to a wider ASOS search.
- Women is selected on the first visit. The last Women/Men choice is saved locally and restored on reload, reopening and returning from other pages; open tabs also stay in sync. If browser storage is unavailable, the selector still works for the current page. The active button connects visually to the category panel through the shared #666 background. All six category links change to the selected ASOS department; the same selector is available in the mobile menu. Clothing uses the gender-specific new-in clothing destinations from ASOS navigation.
- Product, search, saved items, account and bag use a native modal dialog. Returning from a product preserves the list query, scroll position and card focus.
- Dialogs support Escape, backdrop dismissal, Tab/Shift+Tab containment and opener focus restoration. The close control remains available while scrolling.
- Saved items and bag quantities persist in localStorage. Invalid shapes/unknown IDs are discarded; denied storage does not break the interface.
- The product dialog offers a quantity stepper and a total before adding to the bag, respecting the remaining limit. Bag quantities range from 1 to 10 per style, with line totals and subtotal. The close control has a circular hover background. Checkout, delivery, sizes, inventory and account authentication are not simulated. Account links continue to ASOS.
- Larger transparent carousel arrows are centred in the space between the card viewport and the screen edges, move exactly one product in either direction and animate on hover. Cards have 24/20/14 px gaps on desktop/tablet/mobile. The loop has no disabled end arrows. Rapid clicks queue in order. Three rolling indicator dots (previous/current/next) animate in sync with the cards; the current style settles in the middle. There is no visible numeric counter. Keyboard, swipe/drag and horizontal wheel gestures are supported; vertical touch scrolling is preserved. Resizing keeps the current starting product.
- Reduced-motion preferences disable smooth navigation.

## Assets

Photographs are derived WebP assets; titles/prices are HTML. Image generation provenance, final assets and prompts for the two new styles are documented in [GENERATED.md](assets/products/shoes/GENERATED.md). Product source assets and the reference export are preserved. The shopping-bag SVG now has a white 12-unit outline with a padded viewBox to avoid clipping. Images reserve their aspect ratios and below-the-fold photographs load lazily.

Open Sans uses a 112 kB variable WOFF2 subset for Latin UI text, punctuation, currency and arrows, derived from the original 533 kB TTF. The original font and OFL licence remain in `assets/fonts/`.

## Acceptance checks

Automated checks: legacy data migration, invalid stored values, chosen purchase quantities and remaining limits, integer subtotals, multi-word search, circular neighbours/wraparound, three rolling indicator neighbours and gender-correct category destinations.

Browser checks: search → product → return; save/remove; bag → quantity → reload → remove; account dialog; Escape, Tab and Shift+Tab; mobile menu and anchor navigation; carousel single-step arrows, full circle in both directions, rapid clicks, dots, keyboard and swipe; Women/Men category destinations. Check page and dialog overflow, long names and focus visibility at 320, 375, 390, 430, 600, 768, 1024, 1280 and 1440 px.

Keep the visual direction and local functionality intact in later changes. Do not introduce checkout or backend assumptions without real product data.
