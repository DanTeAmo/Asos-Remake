# ASOS Figma frontend

React + JavaScript + JSX + ordinary CSS, built with Vite. No TypeScript, Tailwind, UI libraries or slider libraries.

## Run

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Design and assets

The source design is the supplied Figma file and its local export `references/WebSite.svg` (1440 × 2356). The export is a visual reference only and is never rendered inside the website.

The four supplied shoe card SVGs were used to extract photographs into `assets/products/shoes/photos/`. The baked text and arrows are removed from these derived images. Original files are preserved. Product names and euro prices live in `src/data/catalog.js` and render as real text inside `ProductCard`.

The six supplied denim assets also have derived photographs without baked labels. Labels are HTML. The original header icons and four brand SVGs are used directly. Open Sans is stored locally with its OFL license.

## Components

`Header`, `Icon`, `FitSection`, `ProductCard`, `ProductCarousel`, `BrandSection`, `Footer`, `ShopDialog`.

The slider has four horizontally scrollable pages, arrow and dot controls, touch scrolling and reduced-motion support. Search filters the provided trainers. Product details, saved items and the shopping bag use native accessible dialogs. Saved items and bag state persist locally. Category, brand and footer links navigate to ASOS resources. Account links open ASOS authentication; this project is frontend only.

## Responsive layout

CSS breakpoints: 1279, 1023, 768 and 480 px. Checked at 1920, 1440, 1280, 1024, 768, 430, 390 and 375 px. At 1920 the reference layout remains centred at 1440 px. Tablet/mobile layouts adapt the supplied desktop design, with a collapsible menu and two-column product slides.

## Fidelity and limits

At 1440 px the major reference coordinates match: hero y=133, denim y=385, trainers y=818, brand assets y=1556, footer y=2051, total height=2356.

Figma is publicly viewable, but its exact typography properties require authentication. Text was matched visually against the outlined SVG export. Minor differences can remain in letterforms, text tracking and the flattened cards’ original font. The removed image labels/arrows required small background reconstructions. Mobile layouts are an adaptation because the supplied design contains one desktop frame.

Build, asset loading, responsive widths and the local shopping interactions were verified. `npm install` reports no known dependency vulnerabilities.
