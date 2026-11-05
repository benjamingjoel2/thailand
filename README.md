# Longtail Travel — Thailand by water and by season

A fast, static, four-language travel website (English, French, German, Spanish) for **Longtail Travel**, a tailor-made Thailand specialist built around the country's water and its two monsoons.

- **Live site:** https://thailand-beryl.vercel.app (Vercel project `thailand`, team "Benjamin - Sevo")
- **Canonical domain (planned):** https://longtailtravel.tourground.com — point this domain at the Vercel project to make it live.
- **Repository:** https://github.com/benjamingjoel2/thailand

## Run it

Requires Node.js 18 or later.

```bash
npm install
```

```bash
npm run build
```

```bash
npm run dev
```

`npm run build` writes the whole site to `dist/` (34 pages × 4 languages, plus `sitemap.xml`, `robots.txt` and `404.html`). `npm run dev` builds and serves `dist/` at http://localhost:4321.

There is no framework and no client-side translation library: `build.mjs` pre-renders every page in every language from JSON content, and one small deferred script (`public/js/main.js`, ~8 KB) adds the progressive enhancements (menu, scroll reveals, the river boat, ribbons, the two-coasts default month, the khlong map and form validation). Everything works without JavaScript.

## Where things live

| Path | What it is |
|---|---|
| `src/config.js` | **Brand config.** Brand name, wordmark, email, business address, site URL, form endpoint, locales and the colour palette. Change these to re-brand the site. |
| `src/content/<lang>/*.json` | All copy, one folder per language (`en`, `fr`, `de`, `es`). Same keys in every language. |
| `src/styles.css` | The design system (type scale, grid, components, motion). Inlined into every page at build time. |
| `build.mjs` | Page templates and the build. Each page is an `add(path, render)` block. |
| `public/` | Copied as-is: fonts, optimised images, favicon, `js/main.js`. |
| `images-src/` | Original photos and `manifest.json` (source, author, licence, location). |
| `scripts/images.mjs` | Generates AVIF/WebP/JPEG sizes into `public/img/` and `src/data/images.json`. |
| `vercel.json` | Build command, output folder, clean URLs, trailing slashes, cache headers. |
| `FACTS-TO-VERIFY.md` | Every fact that must be checked against an official source before launch. |
| `IMAGES-NEEDED.md` | Photos still to source, including licensed photos of real properties. |

## Editing content

- **Text:** edit the JSON in `src/content/en/` and the same key in `fr/`, `de/` and `es/`, then rebuild. If a language file is missing, the build falls back to English and prints a warning.
- **Tokens:** in any string, `{brand}`, `{email}` and `{address}` are replaced with the values in `src/config.js`. The legal pages use them, so they follow a re-brand automatically.
- **Destinations:** `destinations.json` → `items`. Each one has its hero image, gallery, monthly `ratings` (3 = good, 2 = mixed, 1 = wet), suggested nights, experiences and placeholder stays. Add a new item in every language, and the page, menu, footer and sitemap update themselves.
- **Two-coasts picker:** month text is in `features.json` → `twoCoasts.months`. The Good/Mixed/Wet ratings for the Andaman coast, the Gulf and the north are the `COAST` arrays near the top of `build.mjs`.
- **Khlong map:** routes and stops are in `features.json` → `khlongs`. Stop positions (`STOPS`), label offsets (`LBL`) and route paths are in the `khlong-map/` block of `build.mjs`. The map is a schematic SVG, labelled "not to scale".
- **Prices:** none are published. A journey can take an optional `"price"` field in `journeys.json`; it then renders as **"From (amount)"** on cards and the journey page. Never add a price that isn't real.
- **Stays:** the stay names are placeholders, labelled as such on the site. Photos show the destination, not the property.

## Images

1. Put a high-quality JPEG in `images-src/<id>.jpg` (at least 2000 px on the long side) and add an entry to `images-src/manifest.json` with `source`, `pageUrl`, `author`, `license`, `licenseUrl` and `location`.
2. Run `npm run images`. It creates 480/800/1200/1800 px AVIF and WebP versions (2400 px for the home hero) and a JPEG fallback, and records sizes and the average colour.
3. Use the id in content (`"img": "<id>"`) and rebuild.

Rules: the photo must show the place it illustrates. Creative Commons and public-domain photos are credited automatically on `/credits/`. Unsplash photos carry no credit line on the site. Never use photos from a hotel's or restaurant's own website: use its media kit or press terms, a booking-platform partner feed, or Creative Commons, or list the venue in `IMAGES-NEEDED.md`.

## Languages

English is at the root (`/`), the others at `/fr/`, `/de/` and `/es/`, with identical paths. Every page has the correct `<html lang>`, a self-referencing canonical, `hreflang` links for all four languages plus `x-default` (English), and an EN · FR · DE · ES selector in the header, the mobile menu and the footer that links to the same page in the other language. There is no automatic redirect by browser language.

## Performance

- Critical CSS is inlined; the only script is deferred.
- Two self-hosted variable fonts (Bricolage Grotesque for headlines, Figtree for text), preloaded, `font-display: swap`, with metric-matched fallbacks to avoid layout shift.
- Every image has `width`/`height`, AVIF/WebP `srcset` and `sizes`, lazy loading below the fold, and the hero image is preloaded with `fetchpriority="high"`.
- Static assets are served with long cache headers (`vercel.json`).

## Enquiry form

The form posts to [FormSubmit](https://formsubmit.co), which forwards each enquiry to the email in `src/config.js` and redirects to `/enquire/thanks/` (localised). **The first submission triggers an activation email to longtailtravel@tourground.com; click the link in it once, or enquiries will not be delivered.** To use another form service, change `formEndpoint` in `src/config.js` and the hidden fields in `formMarkup()` in `build.mjs`.

## Deploying

The Vercel project is linked to this GitHub repository, so every push to `main` deploys to production. Build settings come from `vercel.json` (`npm run build`, output `dist`).

## Design references

The layout follows the primary references: the full-bleed hero with giant grotesque headline, meta row and button, the edge-to-edge destination panels and the time-sequence sections (affable-wealth-322227.framer.app); the 2/3 + 1/3 editorial rows, underlined text links, horizontal card rail and full-width menu (aman.com); and the hairline column grid, label column, journey cards and detail page with sticky sidebar (vita-travel.webflow.io). The "Ribbon and River" theme supplies the palette (river jade, marigold, rice-paper cream, temple red, teak), the ribbon dividers that draw themselves as you scroll, and the longtail boat that sails down the jade river on the home page.
