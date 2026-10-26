# Build prompt: Longtail (Thailand)

Prompt v1, 2026-10-26. Repo: `benjamingjoel2/thailand`. The brief is at `brand/BRIEF.md` in this repo. Read it first: it holds the research, the sources and every fact that still needs verifying.

---

## 1. What the brand is

You are building the website for **Longtail**, a tailor-made travel specialist for **Thailand (TH)**. The business is enquiry-led: **no prices and no booking engine.** Every page leads to the trip planner, the enquiry form or WhatsApp.

**Positioning:** *For travellers who think they already know Thailand: the country planned along its water, rivers, khlongs and two different coasts, with the right coast for the month and a boatman who knows the tide.*

**Brand story** (use it in full on About, and an excerpt on Home):

> At six in the morning on Khlong Bang Luang, the water is the colour of jade tea. A longtail comes round the bend with its engine lifted, the propeller shaft held clear of the weeds, and the boatman steers by leaning on a pole as long as the boat. At the bow there is a marigold garland, still fresh, tied there for the spirit who keeps the boat safe.
>
> We named the company after that boat because it goes where Thailand is actually lived: up the canals behind Wat Arun, across Cheow Lan Lake to a raft house in Khao Sok, between the limestone of Phang Nga Bay at the hour the tide lets you paddle into a hong.
>
> Thailand has two coasts and they do not share a monsoon. We start every plan with the month. Then we choose the coast, the river and the north to match it. We book the Lanna house with a teak verandah, the chef who takes you to the market before you cook, and the sanctuary where elephants are watched, not ridden. Then we leave the late afternoon open, when the light goes gold on the water.

Put a `verify()` flag on the garland custom and the hong tide claim until a specialist signs them off.

**Voice:**
- **Tide-aware.** Say when, not just where. Name the month and the coast.
- **Close to the surface.** Small physical detail: wet rope, diesel, lemongrass, a temple bell across water.
- **Straight about ethics.** State the welfare line and the rules plainly (elephants, monks, temple dress, the lèse-majesté law).
- **Banned words:** Land of Smiles, exotic, paradise, hidden gem, breathtaking, unforgettable, bucket list, off the beaten path, "same same", full-moon party, elephant riding, Buddha heads as decoration.

Sample headlines:
- "Two coasts. Two monsoons. We pick the right one for your month."
- "Bangkok from the khlong, not the skytrain."
- "A night on Cheow Lan Lake, with no road in."

**Currencies:** THB is primary. GBP, USD, EUR and AUD are display options, used only in the planner's budget-band step. No trip or stay prices anywhere.

## 2. Stack

Follow the pattern of `/home/user/greece` and `/home/user/sri-lanka` (read both READMEs). Do **not** use Next.js.

### Build
- A dependency-free Node (18.17+) static site generator.
- `build.mjs` renders `src/pages/*.mjs` with the data into plain HTML/CSS in `dist/`.
- Dev dependencies are allowed only for the checks (Playwright, axe-core).
- Scripts: `npm run build`, `npm run dev`, `npm run serve`, `npm run check:fast`, `npm run check`.

### `site.config.json`, the only place for:
- `brand`: name, shortName, tagline, positioning, nameStory, copyright year.
  - **The brand name lives only here.** The build fails if "Longtail" (case-insensitive, as a brand word) appears hard-coded anywhere in `src/`. Content that means the boat uses the data word `longtail-boat` or "long-tail boat" in data files, which the lint allows.
- `contact`: email, phone, WhatsApp, address, hours, and a licence line. **All are `[PLACEHOLDER]`.**
- `enquiry.endpoint`
- `analytics`: `{ "provider": "" | "plausible" | "ga4" | "vercel", "id": "" }`
- `site.url`, `site.basePath`
- `palette`, `contrastPairs`, `fonts`, `currencies`

### `src/data/*.json`, all content
No copy is hard-coded in templates, so a later TravelPorts migration is a data move.

| File | Holds |
|---|---|
| `destinations.json` | The 12 destinations: intro, best for, season by month, how long, getting there, linked experiences and routes, photo keys, coast (`andaman` / `gulf` / `north` / `central`) |
| `experiences.json` | The 10 experiences |
| `routes.json` | The 5 trip-planner routes |
| `climate.json` | Monthly rainfall normals and rain days for Phuket, Krabi, Koh Samui, Bangkok and Chiang Mai, with source URL and date checked; marine-park closure windows |
| `khlongs.json` | The Khlong Line: simplified canal polylines from OpenStreetMap (ODbL, attributed), and the stops with captions and `verify` flags |
| `stays.json` | Stays. Every entry is `placeholder: true` |
| `faq.json`, `journal.json` | FAQ and journal content |

### `photos.json`, an Unsplash registry until real photos exist
- Hotlink `images.unsplash.com` with a responsive `srcset`.
- Accept a photo only if the photographer's own Unsplash **location tag** names the place, and store that tag verbatim.
- Free Unsplash License only, never Unsplash+.
- Every photo has a visible credit, and `/credits/` lists them all.
- If a place has no verified photo, show a wake-line panel labelled "Illustration". Never show somewhere else (a Vietnamese bay is not Phang Nga).
- Photo direction: water level and low light; longtails, khlongs, limestone, markets at dawn, Lanna teak interiors, rain on leaves. No elephants with riders or in chains, no staged monks, no full-moon parties, no Buddha heads used as props.

### `FACTS-TO-VERIFY.md`
- Start from BRIEF section 8: the 30-day visa exemption, e-Visa, TDAC, any entry fee, Similan/Surin seasons and fees, climate normals, yellow fever, the garland custom and khlong stops, elephant welfare, FCDO and US advice.
- Record where each fact is used, its official source link, and the date it was checked.
- Pages show inline `verify()` flags until each fact is signed off.

### Check scripts
- WCAG AA contrast for every `contrastPairs` entry. The check fails below 4.5:1.
- An internal link check over `dist/`.
- An axe-core audit of every page at 375px and 1280px.
- A brand-name lint.

## 3. Design

### Palette
Emit the palette as CSS custom properties `--c-<token>`. Never hard-code hex values in CSS or templates.

| Token | Hex | Role |
|---|---|---|
| `rice` | `#F6F1E5` | Page ground |
| `khlong` | `#14302B` | Text, header, dark bands, footer |
| `jade` | `#1A6556` | Links, buttons, focus ring, water line on maps |
| `marigold` | `#EBA43A` | Lead accent **on `khlong` only**: garland rule, markers, labels, display words |
| `garland` | `#A84A16` | Small accent text and active states on `rice` only |
| `silt` | `#E5D8BC` | Alternate section ground, cards |
| `smoke` | `#5A605B` | Secondary text, hairlines |

`contrastPairs` (text/ground):
- khlong/rice 12.53
- khlong/silt 10.00
- jade/rice 6.13
- jade/silt 4.90
- garland/rice 5.10
- smoke/rice 5.72
- smoke/silt 4.57
- rice/khlong 12.53
- rice/jade 6.13
- rice/garland 5.10
- marigold/khlong 6.66
- silt/khlong 10.00

Forbidden pairs: marigold on rice, silt or jade; jade on khlong; garland on khlong or silt. Text over photos sits on a khlong scrim of at least 70%, tested against pure white.

### Fonts (assigned)
- **Bricolage Grotesque** for display: 600–800, sentence case, optical size on, tight leading. The wordmark is Bricolage 800 in lowercase.
- **Figtree** for text and UI: 400, 500 and 600. Labels and tags are Figtree 600 caps with +0.06em tracking.
- Load from Google Fonts with `display=swap` and preconnect, and preload Bricolage. **No third font.**

### Design references (primary first)
Use the design patterns only. **Never copy text, photos, logos, icons or code.**
- **Primary: rosewoodhotels.com.** Full-bleed photographic hero with the headline low and left, a quiet header (wordmark centred, menu trigger and "Plan a trip" on the sides) that turns solid on scroll, a full-screen menu, slow vertical rhythm with wide margins, alternating image-and-text editorial bands, large display type (map its scale onto Bricolage), understated text-link buttons, and a calm multi-column footer.
- **Secondary: jacada.travel.** Destination grid with a filter row (coast, month, interest), trip-idea cards showing nights and "best months", a persistent enquire call to action, and the stepped planner flow.

### House rules
- Left-aligned text; full-width bands. Gutter `clamp(16px, 3vw, 48px)`.
- No invented credibility: no testimonials, awards, press logos, review scores or "years of experience".

### Don't reuse sibling signature moves
- No time-of-day palette shifts (Cambodia).
- No river calendar strip in Laos's style.
- No giant word along the bottom of the hero, no `(01)` mono labels, no fixed side tab, no expanding image panels.

### Motif
- The wake line: one curved SVG stroke (jade on light, marigold on dark) as dividers and on maps, drawn on scroll if motion is allowed.
- **No** Buddha imagery as decoration, elephants with riders, tuk-tuk clip art or faux-Thai lettering.

### Two signature features (unique to this brand)

**Two Coasts (`/two-coasts/`)**
- A month dial (12 radio buttons styled as a ring, CSS-only with `:has()`, enhanced by JS) sets three columns: Andaman (Phuket, Krabi), Gulf (Koh Samui) and North (Chiang Mai), with Bangkok as a reference row.
- Each column shows rainfall normal and rain days from `climate.json` as a bar and as text, sea-state notes, and marine-park status (Similans and Surin closed 16 May–14 Oct, `verify`).
- A plain verdict per month ("Go west", "Go east", "Go north", "Either"), written in data, never computed from thin evidence.
- "Plan this month" pre-fills the planner with month and suggested destinations.
- Without JS it renders as one 12-row table. Every destination page shows a compact "best months" strip that uses text labels, not colour alone.

**The Khlong Line (`/khlongs/`)**
- A scroll-told longtail morning through Thonburi. A sticky SVG map of the canals (simplified OpenStreetMap waterways in `khlongs.json`, ODbL credit) draws the wake line as the reader scrolls.
- 6–8 stops (Wat Arun, Khlong Bang Luang, Wat Paknam and others in data, each `verify`), each with a caption, a verified photo or Illustration panel, and a tide note.
- Respects `prefers-reduced-motion` (static map with numbered stops). Without JS it is a numbered list beside the static map.
- Ends with links to "Bangkok and Thonburi", the khlong experience and the planner.

## 4. Pages and content

- **Home:**
  - full-bleed hero (khlong or Andaman at water level)
  - the positioning line
  - the brand story excerpt
  - destinations grid with a Thailand map split into coasts
  - signature experiences
  - the five routes
  - teasers for Two Coasts and the Khlong Line
  - "how we plan" in 4 steps, with no stats
  - a closing call to action
- **Destinations:** an index (filter by coast and month) and 12 pages:
  - Bangkok & Thonburi
  - Ayutthaya & Sukhothai
  - Kanchanaburi & the River Kwai
  - Khao Yai
  - Chiang Mai
  - Chiang Rai & the Golden Triangle
  - Nan
  - Khao Sok & Cheow Lan Lake
  - Phang Nga Bay & Koh Yao Noi
  - Krabi, Railay & Koh Lanta
  - Phuket & the Similan Islands
  - Koh Samui & the Gulf

  Each page has: intro, best for, the season strip, how long, getting there (no timetables), experiences, routes, placeholder stays, verified photos, and a call to action.
- **Experiences:** an index and 10 pages:
  - Thonburi's khlongs by private longtail at first light
  - Sea canoe into the hongs of Phang Nga Bay
  - A night on Cheow Lan Lake
  - An observation-only elephant sanctuary
  - Ayutthaya by bicycle
  - The Mekong at the Golden Triangle
  - The Similan Islands in season
  - Bangkok's markets with a chef-guide
  - Lanna craft with makers
  - Ang Thong by boat and kayak
- **Routes:** an index and 5 pages. Each pre-fills the planner.
  1. River to reef (14–16 nights)
  2. The cool north (10–12)
  3. Andaman, slowly (9–11)
  4. The Gulf in summer (9–11)
  5. Rivers and rain (10–12)
- **Trip planner (`/plan/`):** a multi-step enquiry:
  1. destinations or a route
  2. month (with the Two Coasts verdict shown inline)
  3. nights
  4. party (adults, children and ages)
  5. pace
  6. interests (water, food, culture, wildlife, beach, craft)
  7. an optional budget band per person (THB, switchable to GBP/USD/EUR/AUD)
  8. contact details

  It validates each step, saves progress in `localStorage`, and posts to `enquiry.endpoint`.
- `/two-coasts/` and `/khlongs/`
- **Journal:** an index and 3 posts:
  - "Andaman or Gulf? A month-by-month answer"
  - "Why we don't book elephant rides"
  - "Green season, honestly"
- **About:** the full story and the name story. No invented team bios.
- FAQ, built from the topics in BRIEF section 7. Answers only restate facts listed in `FACTS-TO-VERIFY.md`.
- Contact / enquire
- Privacy, terms, cookies, credits, 404

## 5. From day one (phase 1, not phase 5)

1. **The enquiry form posts to `enquiry.endpoint`.**
   - It uses `fetch`, with an ordinary POST as the no-JS fallback.
   - It has inline validation, an error summary, a live-region status and a honeypot.
   - **If the endpoint is empty:**
     - the build prints a loud warning: `WARNING: enquiry.endpoint is empty. Enquiries open the visitor's email app and are NOT delivered.`
     - the form falls back to `mailto:` to `contact.email`, and the page says so
     - the README and config carry a `TODO`
   - The planner, the routes and Two Coasts all feed this same form.
2. **Analytics slot.** Inject the snippet only when `analytics.id` is set, and only after consent when the provider sets cookies (GA4). Plausible and Vercel Analytics need no banner. Every brand gets its own ID.
3. **Legal pages** `/privacy/`, `/terms/` and `/cookies/`, linked in the footer.
   - Draft them for UK GDPR / PECR and EU GDPR, with a clause on Thailand's Personal Data Protection Act B.E. 2562 (PDPA) for data handled by Thai suppliers.
   - Every company detail (legal name, company number, address, Thai DoT licence of the ground operator, ATOL / insolvency protection) is `[PLACEHOLDER]` and marked "Draft: needs legal review".

## 6. Build phases: stop for review after each

1. **Layout, header, footer and design tokens.**
   - `site.config.json` with the palette, fonts, contrast pairs, endpoint and analytics.
   - The header and full-screen menu, the footer (with legal links), and the persistent "Plan a trip" call to action.
   - The wake-line motif, and the photo frame and credit component.
   - The check scripts and `vercel.json`.

   **Stop for review.**
2. **Homepage**, every section listed in part 4. **Stop for review.**
3. **Trip planner.**
   - The multi-step planner, tested end to end: an enquiry actually arrives, or report a blocker.
   - Route and Two Coasts pre-fill.

   **Stop for review.**
4. **Detail pages and journal.**
   - Destinations, experiences, routes, Two Coasts, the Khlong Line, journal, FAQ, About, legal, credits.
   - `FACTS-TO-VERIFY.md` complete.

   **Stop for review.**
5. **Polish, accessibility, SEO and Lighthouse.**
   - Metadata, canonical URLs, sitemap, robots.
   - JSON-LD `TravelAgency`, leaving out placeholder fields rather than inventing them.
   - An OG image.
   - A clean axe audit and **mobile Lighthouse 90+**.
   - `prefers-reduced-motion` respected, and the site works without JS.
   - A README "Before launch" list of every placeholder.

   **Stop for review.**

Accessibility from phase 1:
- a skip link and visible focus (jade on light, marigold on dark, 2px plus offset)
- 44px touch targets
- landmarks, labelled controls and live regions
- no information carried by colour alone
- lazy-loaded images with width and height, except the hero
- no horizontal scroll at 360px

## 7. Final step: host on Vercel

1. Make sure `npm run build` succeeds and writes `dist/`.
2. Add `vercel.json`:
   - `"buildCommand": "npm run build"`, `"outputDirectory": "dist"`, `"cleanUrls": true`, trailing slashes
   - long caching for the hashed assets
   - basic security headers
3. Push to the GitHub repo **`benjamingjoel2/thailand`** on `main`.
4. In Vercel (team **"Benjamin - Sevo"**), import the repo with framework preset **Other**, and deploy.
5. On the live `*.vercel.app` URL, check every page, check for broken links, and submit the enquiry form.
6. Put the URL in `site.config.json` (`site.url`) and the README, then push again to redeploy.

## Design fidelity: match the primary reference closely (overrides any looser wording above)
The first design reference listed above is the **primary reference**. The site must read as the same design as that site when compared side by side: header and nav, hero composition, section order and rhythm, grid and containers, type scale (mapped onto this brand's fonts), cards, buttons, footer and motion. Before building, open the primary reference with Playwright, screenshot it at 1440 and 390 wide, and measure its type sizes, spacing and container widths. If the primary reference will not load, use the second reference as primary and say so. Then compare your own screenshots against it after every phase and fix the differences. Keep this brand's own name, palette, fonts, copy and photos. Never copy the reference's text, photos, logos, icons or source code: rebuild the design yourself. Full rules are in brands-pipeline/REF-MATCH.md in benjamingjoel2/jarvis.

Every page in the list above must be built completely with real content: no empty sections, no lorem ipsum. Before you finish, open every page with Playwright at both widths and confirm there are no console errors, no broken images or links, and no horizontal scroll on mobile.
