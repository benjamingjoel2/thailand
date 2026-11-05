// Static site builder for Longtail Travel. `npm run build` → dist/
// Every locale is pre-rendered; no translation library ships to the browser.
import fs from 'node:fs';
import path from 'node:path';
import config from './src/config.js';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');
const L = config.locales;
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
let IMG = {};
try { IMG = read('src/data/images.json'); } catch { console.warn('No src/data/images.json yet: run npm run images'); }

const addr = config.contact.address;
const addrOneLine = `${addr.venue}, ${addr.line1}, ${addr.street}, ${addr.locality}, ${addr.city} ${addr.postcode}, ${addr.country}`;
const tokens = (s) => s.replaceAll('{brand}', config.brand.name).replaceAll('{email}', config.contact.email).replaceAll('{address}', addrOneLine);
const deepTokens = (o) => typeof o === 'string' ? tokens(o) : Array.isArray(o) ? o.map(deepTokens) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, deepTokens(v)])) : o;
const FILES = ['common', 'home', 'destinations', 'features', 'journeys', 'pages', 'journal', 'legal'];
const C = {};
for (const lang of L) {
  C[lang] = {};
  for (const f of FILES) {
    const p = `src/content/${lang}/${f}.json`;
    const fallback = `src/content/en/${f}.json`;
    if (!fs.existsSync(path.join(ROOT, p))) console.warn(`! missing ${p}, using English`);
    C[lang][f] = deepTokens(read(fs.existsSync(path.join(ROOT, p)) ? p : fallback));
  }
}

// ---------- helpers ----------
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const href = (lang, p = '') => `/${lang === 'en' ? '' : lang + '/'}${p}`;
const abs = (lang, p = '') => config.siteUrl + href(lang, p);
const destBy = (lang, slug) => C[lang].destinations.items.find((d) => d.slug === slug);
const COAST = {
  andaman: [3, 3, 3, 2, 1, 1, 1, 1, 1, 1, 2, 3],
  gulf: [2, 3, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1],
  north: [3, 3, 2, 1, 2, 2, 2, 2, 1, 2, 3, 3],
};

function pic(id, alt, { sizes = '100vw', eager = false, cls = '', reveal = false } = {}) {
  const im = IMG[id];
  if (!im) return `<div class="ph ${cls}" role="img" aria-label="${esc(alt)}" style="background:#1A6556;width:100%;height:100%"></div>`;
  const ratio = im.height / im.width;
  const set = (ext) => im.widths.map((w) => `/img/${id}-${w}.${ext} ${w}w`).join(', ');
  const fw = im.jpg;
  return `<picture${reveal ? ' data-reveal="img"' : ''}${cls ? ` class="${cls}"` : ''}><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img src="/img/${id}-${fw}.jpg" alt="${esc(alt)}" width="${fw}" height="${Math.round(fw * ratio)}" ${eager ? 'fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"'} style="background:${im.color}"></picture>`;
}
const preload = (id) => {
  const im = IMG[id];
  if (!im) return '';
  return `<link rel="preload" as="image" type="image/avif" imagesrcset="${im.widths.map((w) => `/img/${id}-${w}.avif ${w}w`).join(', ')}" imagesizes="100vw" fetchpriority="high">`;
};
const ogImage = (id) => (IMG[id] ? `${config.siteUrl}/img/${id}-${IMG[id].jpg}.jpg` : '');

// Ribbon divider: three thin strands (marigold, temple red, jade) drawn on scroll.
let ribbonN = 0;
function ribbon(variant = 0) {
  ribbonN++;
  const v = [
    ['M-10 30 C 280 10, 470 150, 780 120 S 1230 20, 1450 96', 'M-10 42 C 300 26, 450 158, 790 132 S 1220 36, 1450 110', 'M-10 54 C 320 44, 440 162, 800 144 S 1210 52, 1450 124'],
    ['M-10 120 C 260 140, 520 20, 820 40 S 1250 150, 1450 60', 'M-10 132 C 280 150, 530 34, 830 54 S 1240 160, 1450 74', 'M-10 144 C 300 160, 540 48, 840 68 S 1230 168, 1450 88'],
  ][variant % 2];
  return `<svg class="ribbon" data-progress viewBox="0 0 1440 170" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path class="r1" pathLength="1" d="${v[0]}"/><path class="r2" pathLength="1" d="${v[1]}"/><path class="r3" pathLength="1" d="${v[2]}"/></svg>`;
}

const boatGlyph = (scale = 1) => `<g class="boat-g" transform="scale(${scale})">
  <path d="M-92 0 L-62 0" stroke="#F6F1E5" stroke-width="1.6" stroke-linecap="round"/>
  <rect x="-64" y="-5" width="12" height="10" rx="2" fill="#13241F"/>
  <path d="M-54 0 C-46 -10 24 -12 48 -1 C50 0 50 0 48 1 C24 12 -46 10 -54 0 Z" fill="#5E3A22" stroke="#F6F1E5" stroke-width="1.2"/>
  <path d="M-40 0 L36 0" stroke="#3E2616" stroke-width="1"/>
  <g class="ribbons" fill="none" stroke-linecap="round" stroke-width="2.4">
    <path stroke="#EBA43A" d="M44 -2 C30 -16 14 -4 0 -18 S-26 -8 -44 -22"><animate attributeName="d" dur="1.6s" repeatCount="indefinite" values="M44 -2 C30 -16 14 -4 0 -18 S-26 -8 -44 -22;M44 -2 C30 -8 14 -20 0 -12 S-26 -24 -44 -14;M44 -2 C30 -16 14 -4 0 -18 S-26 -8 -44 -22"/></path>
    <path stroke="#E8735F" d="M44 1 C32 14 16 4 2 16 S-22 8 -40 20"><animate attributeName="d" dur="1.3s" repeatCount="indefinite" values="M44 1 C32 14 16 4 2 16 S-22 8 -40 20;M44 1 C32 6 16 18 2 10 S-22 22 -40 12;M44 1 C32 14 16 4 2 16 S-22 8 -40 20"/></path>
    <path stroke="#F6F1E5" stroke-width="1.6" d="M44 0 C34 -6 20 6 6 -2 S-14 6 -30 -4"><animate attributeName="d" dur="1.1s" repeatCount="indefinite" values="M44 0 C34 -6 20 6 6 -2 S-14 6 -30 -4;M44 0 C34 6 20 -6 6 4 S-14 -6 -30 4;M44 0 C34 -6 20 6 6 -2 S-14 6 -30 -4"/></path>
  </g>
  <g fill="#EBA43A"><circle cx="40" cy="-4" r="2.6"/><circle cx="43" cy="0" r="2.6"/><circle cx="40" cy="4" r="2.6"/></g>
</g>`;

// ---------- layout ----------
const CSS = (() => {
  const pal = Object.entries(config.palette).map(([k, v]) => `--c-${k}:${v}`).join(';');
  return `:root{${pal}}` + fs.readFileSync(path.join(ROOT, 'src/styles.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}');
})();

function langSwitch(lang, p, cls = 'lang') {
  return `<nav class="${cls}" aria-label="${esc(C[lang].common.languageLabel)}">${L.map((l, i) => `${i ? '<span class="sep" aria-hidden="true">·</span>' : ''}<a href="${href(l, p)}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="true"' : ''} title="${esc(C[l].common.langName)}"><span aria-hidden="true">${l.toUpperCase()}</span><span class="sr-only">${esc(C[l].common.langName)}</span></a>`).join('')}</nav>`;
}

function header(lang, p) {
  const c = C[lang].common;
  const n = c.nav;
  const items = [['destinations/', n.destinations], ['journeys/', n.journeys], ['two-coasts/', n.twoCoasts], ['khlong-map/', n.khlongs], ['stays/', n.stays], ['journal/', n.journal]];
  const cur = (x) => (p.startsWith(x) ? ' aria-current="page"' : '');
  const D = C[lang].destinations.items;
  return `<a class="skip" href="#main">${esc(c.skip)}</a>
<header class="hdr" id="hdr">
  <a class="logo" href="${href(lang)}" aria-label="${esc(config.brand.name)}"><svg viewBox="0 0 30 14" aria-hidden="true"><path d="M1 8 C8 13 22 12 29 3" stroke="#EBA43A" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M3 11 C10 15 21 13 27 8" stroke="#E8735F" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>${esc(config.brand.wordmark)}<span>${esc(config.brand.wordmarkSuffix)}</span></a>
  <nav class="nav" aria-label="Main">${items.map(([x, label]) => `<a href="${href(lang, x)}"${cur(x)}>${esc(label)}</a>`).join('')}</nav>
  <span class="hdr__div" aria-hidden="true"></span>
  ${langSwitch(lang, p)}
  <a class="btn btn--line hdr__cta" href="${href(lang, 'enquire/')}">${esc(c.enquire)}</a>
  <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><i aria-hidden="true"></i>${esc(c.menu)}</button>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="${esc(c.menu)}" hidden>
  <div class="menu__top"><a class="logo" href="${href(lang)}">${esc(config.brand.wordmark)}<span>${esc(config.brand.wordmarkSuffix)}</span></a><button class="menu-btn menu-close" type="button">${esc(c.close)}</button></div>
  <p class="muted" style="max-width:48ch">${esc(c.menuIntro)}</p>
  <div class="menu__body">
    <nav class="menu__main" aria-label="Main">${[...items, ['responsible-travel/', n.responsible], ['about/', n.about], ['enquire/', n.enquire]].map(([x, label]) => `<a href="${href(lang, x)}">${esc(label)}</a>`).join('')}</nav>
    <div class="menu__col"><h2>${esc(c.menuDestinations)}</h2>${D.map((d) => `<a href="${href(lang, 'destinations/' + d.slug + '/')}">${esc(d.name)}</a>`).join('')}</div>
    <div class="menu__col"><h2>${esc(c.menuCompany)}</h2><a href="mailto:${config.contact.email}">${config.contact.email}</a><p class="muted" style="font-size:.875rem;margin-top:10px">${esc(addr.venue)}<br>${esc(addr.line1)}<br>${esc(addr.street)}<br>${esc(addr.city)} ${esc(addr.postcode)}</p></div>
  </div>
  <div class="menu__foot">${langSwitch(lang, p)}<a class="btn" href="${href(lang, 'enquire/')}">${esc(c.enquire)}</a></div>
</div>`;
}

function footer(lang, p) {
  const c = C[lang].common;
  const f = c.footer;
  const D = C[lang].destinations.items;
  const big = [['enquire/', f.bigLinks[0]], ['two-coasts/', f.bigLinks[1]], ['khlong-map/', f.bigLinks[2]]];
  return `<footer class="ftr">
  <nav class="ftr__big" aria-label="${esc(c.nav.enquire)}">${big.map(([x, l]) => `<a href="${href(lang, x)}">${esc(l)}</a>`).join('')}</nav>
  <div class="ftr__cols">
    <div><h2>${esc(f.destinations)}</h2><ul>${D.slice(0, 6).map((d) => `<li><a href="${href(lang, 'destinations/' + d.slug + '/')}">${esc(d.name)}</a></li>`).join('')}</ul></div>
    <div><h2>&nbsp;</h2><ul>${D.slice(6).map((d) => `<li><a href="${href(lang, 'destinations/' + d.slug + '/')}">${esc(d.name)}</a></li>`).join('')}</ul></div>
    <div><h2>${esc(f.ideas)}</h2><ul><li><a href="${href(lang, 'journeys/')}">${esc(c.nav.journeys)}</a></li><li><a href="${href(lang, 'two-coasts/')}">${esc(c.nav.twoCoasts)}</a></li><li><a href="${href(lang, 'khlong-map/')}">${esc(c.nav.khlongs)}</a></li><li><a href="${href(lang, 'responsible-travel/')}">${esc(c.nav.responsible)}</a></li><li><a href="${href(lang, 'stays/')}">${esc(c.nav.stays)}</a></li><li><a href="${href(lang, 'journal/')}">${esc(c.nav.journal)}</a></li></ul></div>
    <div><h2>${esc(f.company)}</h2><ul><li><a href="${href(lang, 'about/')}">${esc(c.nav.about)}</a></li><li><a href="${href(lang, 'privacy/')}">${esc(f.privacy)}</a></li><li><a href="${href(lang, 'booking-terms/')}">${esc(f.terms)}</a></li><li><a href="${href(lang, 'cookies/')}">${esc(f.cookies)}</a></li><li><a href="${href(lang, 'credits/')}">${esc(f.credits)}</a></li></ul></div>
    <div><h2>${esc(f.contact)}</h2><address><a href="mailto:${config.contact.email}">${config.contact.email}</a><br><br>${esc(config.brand.name)}<br>${esc(addr.venue)}<br>${esc(addr.line1)}<br>${esc(addr.street)}<br>${esc(addr.locality)}<br>${esc(addr.city)} ${esc(addr.postcode)}<br>${esc(addr.country)}</address></div>
    <p class="ftr__note">${esc(f.note)}</p>
  </div>
  <div class="ftr__word" aria-hidden="true">${esc(config.brand.wordmark)}<span>.</span></div>
  <div class="ftr__bot"><span>© ${new Date().getFullYear()} ${esc(config.brand.name)}. ${esc(f.rights)}</span>${langSwitch(lang, p)}</div>
</footer>`;
}

function jsonld(lang, extra = []) {
  const org = {
    '@context': 'https://schema.org', '@type': 'TravelAgency', '@id': config.siteUrl + '/#org',
    name: config.brand.name, url: config.siteUrl + '/', email: config.contact.email,
    description: C[lang].common.meta.defaultDescription, areaServed: { '@type': 'Country', name: 'Thailand' },
    address: { '@type': 'PostalAddress', streetAddress: `${addr.venue}, ${addr.line1}, ${addr.street}`, addressLocality: addr.city, addressRegion: addr.locality, postalCode: addr.postcode, addressCountry: addr.countryCode },
  };
  return [org, ...extra].map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('');
}

function layout(lang, p, { title, description, body, heroImg, ogImg, ld = [], bodyClass = '' }) {
  const c = C[lang].common;
  const fullTitle = title.includes(config.brand.name) ? title : `${title} | ${config.brand.name}`;
  const alt = L.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(l, p)}">`).join('') + `<link rel="alternate" hreflang="x-default" href="${abs('en', p)}">`;
  const og = ogImage(ogImg || heroImg || 'hero-home');
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${abs(lang, p)}">
${alt}
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(config.brand.name)}"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${abs(lang, p)}"><meta property="og:locale" content="${c.meta.ogLocale}">${og ? `<meta property="og:image" content="${og}">` : ''}<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${config.palette.khlong}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/bricolage.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/figtree.woff2" as="font" type="font/woff2" crossorigin>
${heroImg ? preload(heroImg) : ''}
<style>${CSS}</style>
<script>document.documentElement.classList.add('js')</script>
<script src="/js/main.js" defer></script>
${jsonld(lang, ld)}
</head>
<body class="${bodyClass}">
${header(lang, p)}
<main id="main">
${body}
</main>
${footer(lang, p)}
</body>
</html>`;
}

// ---------- shared blocks ----------
const words = (s) => s.split(' ').map((w, i) => `<span class="w"><span style="--i:${i}">${esc(w)}</span></span>`).join(' ');

function pageHero(lang, { img, alt, title, sub, figL, figR, bar, cls = 'hero--page' }) {
  return `<section class="hero ${cls}">
  <div class="hero__media">${pic(img, alt, { eager: true })}</div>
  ${figL || figR ? `<div class="hero__fig mono"><span>${esc(figL || '')}</span><span>${figR ? `<i class="dot"></i>${esc(figR)}` : ''}</span></div>` : ''}
  <div class="hero__body">
    <h1 class="hero__title h-hero">${words(title)}</h1>
    ${sub ? `<p class="hero__sub lead">${esc(sub)}</p>` : ''}
    ${bar ? `<div class="hero__bar">${bar}</div>` : ''}
  </div>
</section>`;
}

function ctaBand(lang, img = 'journey-1', alt = '') {
  const c = C[lang].common;
  return `<section class="closing">
  ${pic(img, alt || c.cta.title, { sizes: '100vw' })}
  <div class="closing__top mono"><span>${esc(c.cta.eyebrow)}</span><a href="mailto:${config.contact.email}">${config.contact.email}</a></div>
  <div class="closing__body" data-reveal>
    <h2>${esc(c.cta.title)}</h2>
    <p class="lead">${esc(c.cta.text)}</p>
    <a class="btn" href="${href(lang, 'enquire/')}">${esc(c.cta.button)}</a>
  </div>
</section>`;
}

function monthCells(lang, ratings) {
  const c = C[lang].common;
  return ratings.map((r, i) => `<div class="cell cell--${r}"><b>${esc(c.monthsShort[i])}</b><span>${esc(c.ratings[r])}</span></div>`).join('');
}
function legend(lang) {
  const c = C[lang].common;
  return `<div class="legend"><span><i style="background:var(--c-jade)"></i>${esc(c.ratings[3])}</span><span><i style="background:#C98516"></i>${esc(c.ratings[2])}</span><span><i style="background:var(--c-temple)"></i>${esc(c.ratings[1])}</span></div>`;
}

function destPanel(lang, d, i) {
  const c = C[lang].common;
  return `<a class="panel" href="${href(lang, 'destinations/' + d.slug + '/')}" data-reveal style="--d:${i * 0.08}s">
  ${pic(d.heroImage, d.heroAlt, { sizes: '(min-width:1024px) 20vw, (min-width:640px) 44vw, 78vw' })}
  <div class="panel__top mono"><b>${esc(d.code)}</b>${esc(c.regions[d.region])}</div>
  <div class="panel__bot"><h3>${esc(d.name)}</h3><div class="mono"><span>${esc(c.labels.best)}: ${esc(d.bestText)}</span><span>${esc(d.nights)} ${esc(c.labels.nights)}</span></div></div>
</a>`;
}

function journeyCard(lang, j, light = false) {
  const c = C[lang].common;
  const names = j.route.map((s) => destBy(lang, s)?.name.split(' and ')[0].split(' et ')[0].split(' und ')[0].split(' y ')[0]).join(' · ');
  return `<a class="jcard" href="${href(lang, 'journeys/' + j.slug + '/')}" data-reveal>
  <div class="jcard__text">
    <h3>${esc(j.name)}</h3>
    <p class="jcard__sum">${esc(j.summary)}</p>
    <dl><div><dt>${esc(c.labels.route)}</dt><dd>${esc(names)}</dd></div><div><dt>${esc(c.labels.bestMonths)}</dt><dd>${esc(j.months)}</dd></div><div><dt>${esc(c.labels.nightsSuggested)}</dt><dd>${j.nights}</dd></div>${j.price ? `<div><dt>${esc(c.labels.price)}</dt><dd>${esc(c.labels.from)} ${esc(j.price)}</dd></div>` : ''}</dl>
    <span class="btn faux-btn${light ? '' : ''}" aria-hidden="true">${esc(c.labels.discover)}</span>
  </div>
  <div class="jcard__img">${pic(j.img, j.alt, { sizes: '(min-width:900px) 24vw, (min-width:600px) 48vw, 92vw' })}</div>
</a>`;
}

function card(lang, { img, alt, eyebrow, title, text, link, to, sizes = '(min-width:900px) 64vw, 92vw', tag = '' }) {
  return `<a class="card" href="${to}" data-reveal>
  <div class="card__img">${pic(img, alt, { sizes })}</div>
  <div class="card__body">${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h3>${esc(title)}${tag}</h3>${text ? `<p>${esc(text)}</p>` : ''}${link ? `<span class="tlink">${esc(link)}</span>` : ''}</div>
</a>`;
}

function faqBlock(title, text, items, link) {
  return `<div class="faq">
  <div class="faq__intro" data-reveal><h2>${esc(title)}</h2>${text ? `<p>${esc(text)}</p>` : ''}${link || ''}</div>
  <div class="acc" data-reveal>${items.map((it, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(it.q)}</summary><p>${esc(it.a)}</p></details>`).join('')}</div>
</div>`;
}

// ---------- pages ----------
const pages = [];
const add = (p, render) => pages.push({ p, render });

// Home
add('', (lang) => {
  const h = C[lang].home;
  const c = C[lang].common;
  const D = C[lang].destinations.items;
  const featured = ['bangkok', 'chiang-mai', 'khao-sok', 'krabi-koh-yao-noi', 'koh-samui-koh-phangan'].map((s) => destBy(lang, s));
  const J = C[lang].journeys.items;
  const A = C[lang].journal.items;
  const river = `<svg class="river-svg" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <path class="bank" d="M-60 60 C 300 0, 520 200, 760 240 S 1180 200, 1330 360 S 1210 700, 870 740 S 300 700, 110 820 S -70 940, -90 960"/>
    <path class="bank" d="M-60 180 C 300 120, 520 320, 760 360 S 1100 330, 1210 450 S 1120 640, 860 670 S 290 640, 130 740 S -60 900, -90 940"/>
    <path class="water" stroke-width="110" d="M-50 120 C 300 60, 520 260, 760 300 S 1140 266, 1270 405 S 1166 670, 865 705 S 296 670, 120 780 S -66 920, -90 950"/>
    <path class="ripple" d="M-50 105 C 300 45, 520 245, 760 285 S 1140 251, 1255 405 S 1150 655, 865 690 S 296 655, 110 768"/>
    <path class="ripple" d="M-50 140 C 300 80, 520 280, 760 320 S 1140 286, 1285 405 S 1180 688, 865 722 S 296 690, 130 795"/>
    <path id="riverline" class="wake" pathLength="1" d="M-50 120 C 300 60, 520 260, 760 300 S 1140 266, 1270 405 S 1166 670, 865 705 S 296 670, 120 780 S -66 920, -90 950"/>
    <g id="riverboat" transform="translate(-50 120)">${boatGlyph(1.25)}</g>
  </svg>`;
  const body = `
<section class="hero">
  <div class="hero__media">${pic('hero-home', h.hero.alt, { eager: true })}</div>
  <div class="hero__fig mono"><span>${esc(h.hero.figLeft)}</span><span><i class="dot"></i>${esc(h.hero.figRight)}</span></div>
  <div class="hero__body">
    <h1 class="hero__title h-hero">${words(h.hero.title)}</h1>
    <div class="hero__bar"><ul class="hero__meta mono">${h.hero.meta.map((m) => `<li>${esc(m)}</li>`).join('')}</ul><a class="btn" href="${href(lang, 'enquire/')}">${esc(h.hero.button)}</a></div>
  </div>
</section>
<section class="river-sec sec" id="river" data-progress>
  ${river}
  <div class="wrap lab">
    <p class="eyebrow" data-reveal>${esc(h.intro.eyebrow)}</p>
    <div>
      <h2 class="statement" data-reveal>${esc(h.intro.title)}</h2>
      <div class="intro-cols"><span></span><div data-reveal><p class="lead">${esc(h.intro.text)}</p><a class="tlink" href="${href(lang, 'about/')}">${esc(h.intro.link)}</a></div></div>
    </div>
  </div>
  <div style="height:clamp(120px,22vw,320px)"></div>
</section>
<section class="dark sec--s" style="padding-bottom:0">
  <div class="wrap shead"><h2 data-reveal>${esc(h.regions.title)}</h2><div class="shead__text" data-reveal><p>${esc(h.regions.text)}</p><a class="tlink" href="${href(lang, 'destinations/')}">${esc(h.regions.link)}</a></div></div>
  <div class="panels">${featured.map((d, i) => destPanel(lang, d, i)).join('')}</div>
</section>
<div class="dark ribbon-wrap">${ribbon(0)}</div>
<section class="dark sec--s" style="padding-top:0">
  <div class="wrap">
    <div class="shead shead--l"><h2 data-reveal>${esc(h.coasts.title)}</h2><div class="shead__text" data-reveal><p>${esc(h.coasts.text)}</p></div></div>
    <p class="mono muted" style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:16px"><span><i class="dot"></i>&nbsp; ${esc(h.coasts.meta)}</span><span>${esc(h.coasts.metaRight)}</span></p>
    <div class="sched" data-reveal>${['andaman', 'gulf', 'north'].map((k) => `<div class="sched__row"><div class="sched__name"><span class="mono muted">${esc(h.coasts.rowsSub[k])}</span><b>${esc(h.coasts.rows[k])}</b></div><div class="sched__months">${monthCells(lang, COAST[k])}</div></div>`).join('')}</div>
    <div style="display:flex;flex-wrap:wrap;gap:16px 28px;align-items:center;margin-top:28px"><a class="btn" href="${href(lang, 'two-coasts/')}">${esc(h.coasts.button)}</a><p class="muted" style="max-width:52ch;font-size:.9375rem">${esc(C[lang].features.twoCoasts.tableNote)}</p></div>
  </div>
</section>
${h.morning.steps.map((s, i) => `<section class="seq${i === 0 ? ' seq--first' : ''}">
  <div class="seq__img">${pic(s.img, s.alt)}</div>
  <div class="seq__top mono"><span>${esc(s.label)}</span><span>${i === 0 ? esc(h.morning.eyebrow) : esc(h.morning.right)}</span></div>
  <p class="seq__time" aria-hidden="true">${esc(s.time)}</p>
  <div class="seq__cap" data-reveal><h3><span class="sr-only">${esc(s.time)} — </span>${esc(s.title)}</h3><p>${esc(s.text)}</p>${i === h.morning.steps.length - 1 ? `<a class="btn" href="${href(lang, 'khlong-map/')}">${esc(h.morning.button)}</a>` : ''}</div>
</section>`).join('')}
<section class="light sec">
  <div class="wrap ed">${h.editorial.map((e, i) => card(lang, { img: e.img, alt: e.alt, eyebrow: e.eyebrow, title: e.title, text: e.text, link: e.link, to: href(lang, e.href + '/'), sizes: i ? '(min-width:900px) 32vw, 92vw' : '(min-width:900px) 64vw, 92vw' })).join('')}</div>
</section>
<section class="dark sec">
  <div class="wrap">
    <div class="shead"><h2 data-reveal>${esc(h.journeys.title)}</h2><div class="shead__text" data-reveal><p>${esc(h.journeys.text)}</p><a class="tlink" href="${href(lang, 'journeys/')}">${esc(h.journeys.link)}</a></div></div>
    <div class="jgrid">${J.slice(0, 4).map((j) => journeyCard(lang, j)).join('')}</div>
  </div>
</section>
<div class="light ribbon-wrap">${ribbon(1)}</div>
<section class="light sec" style="padding-top:clamp(24px,3vw,48px)">
  <div class="wrap rail">
    <div class="rail__intro" data-reveal><h2>${esc(h.journal.title)}</h2><p>${esc(h.journal.text)}</p><a class="tlink" href="${href(lang, 'journal/')}" style="margin-top:16px">${esc(h.journal.link)}</a></div>
    <div class="rail__track">${[...A.map((a) => ({ img: a.img, alt: a.alt, eyebrow: `${a.minutes} ${c.labels.minRead}`, title: a.title, text: a.excerpt, link: c.labels.readMore, to: href(lang, 'journal/' + a.slug + '/') })), ...['two-coasts', 'khlong-map', 'responsible-travel'].map((k, i) => ({ img: ['coast-gulf', 'khlong-1', 'elephant-2'][i], alt: '', eyebrow: c.menuIdeas, title: c.nav[['twoCoasts', 'khlongs', 'responsible'][i]], text: '', link: c.labels.discover, to: href(lang, k + '/') }))].map((x) => card(lang, { ...x, sizes: '360px' })).join('')}</div>
  </div>
</section>
<section class="dark sec">
  <div class="wrap">${faqBlock(h.faq.title, h.faq.text, h.faq.items, `<a class="tlink" href="${href(lang, 'enquire/')}" style="margin-top:20px">${esc(h.faq.link)}</a>`)}</div>
</section>
${ctaBand(lang, h.closing.img, h.closing.alt)}
<div class="boatpath" id="boatpath" aria-hidden="true"><svg viewBox="0 0 34 1000" preserveAspectRatio="none"><path id="bp" d="M17 0 C 4 120, 30 220, 17 340 S 4 560, 17 680 S 30 880, 17 1000" stroke="rgba(127,196,176,.45)" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/></svg></div>`;
  return { title: h.metaTitle, description: h.metaDescription, body, heroImg: 'hero-home', bodyClass: 'home' };
});

// Destinations index
add('destinations/', (lang) => {
  const x = C[lang].destinations.index;
  const c = C[lang].common;
  const D = C[lang].destinations.items;
  const regions = [...new Set(D.map((d) => d.region))];
  const body = `${pageHero(lang, { img: 'krabi-3', alt: D[7].gallery[1].alt, title: x.heading, sub: x.intro, figL: x.eyebrow, figR: `${D.length} · ${regions.map((r) => c.regions[r]).join(' · ')}`, cls: 'hero--page' })}
<section class="dark sec--s">
  <div class="wrap">
    <div class="filters" role="group" aria-label="${esc(c.labels.region)}" hidden><button type="button" aria-pressed="true" data-f="all">${esc(x.filterAll)}</button>${regions.map((r) => `<button type="button" aria-pressed="false" data-f="${r}">${esc(c.regions[r])}</button>`).join('')}</div>
    <div class="dgrid">${D.map((d, i) => `<a class="dcard" data-region="${d.region}" href="${href(lang, 'destinations/' + d.slug + '/')}" data-reveal style="--d:${(i % 3) * 0.08}s">
      <div class="dcard__top mono"><span>${esc(c.regions[d.region])}</span><span>/ ${esc(d.code)}</span></div>
      <div class="dcard__img">${pic(d.heroImage, d.heroAlt, { sizes: '(min-width:1100px) 31vw, (min-width:700px) 46vw, 92vw' })}</div>
      <h2>${esc(d.name)}</h2><p>${esc(d.tagline)}</p>
      <p class="mono muted">${esc(c.labels.best)}: ${esc(d.bestText)} · ${esc(d.nights)} ${esc(c.labels.nights)}</p>
    </a>`).join('')}</div>
  </div>
</section>
${ctaBand(lang, 'samui-2')}`;
  return { title: x.metaTitle, description: x.metaDescription, body, heroImg: 'krabi-3' };
});

// Destination pages
for (const slug of C.en.destinations.items.map((d) => d.slug)) {
  add(`destinations/${slug}/`, (lang) => {
    const c = C[lang].common;
    const D = C[lang].destinations.items;
    const d = destBy(lang, slug);
    const idx = D.indexOf(d);
    const next = [1, 2, 3].map((k) => D[(idx + k) % D.length]);
    const tabs = [['overview', c.labels.onThisPage === '' ? '' : D[0] && C[lang].destinations.index.title], ['when', c.labels.bestMonths], ['water', d.byWaterTitle], ['book', C[lang].journeys.includedTitle], ['stays', c.nav.stays], ['getting', c.labels.gettingThere]];
    tabs[0][1] = c.labels.region === '' ? 'Overview' : d.name;
    const bar = `<ul class="hero__meta mono"><li>${esc(c.regions[d.region])}</li><li>${esc(c.labels.best)}: ${esc(d.bestText)}</li><li>${esc(d.nights)} ${esc(c.labels.nights)}</li></ul><a class="btn" href="${href(lang, 'enquire/')}?d=${slug}">${esc(c.enquire)}</a>`;
    const body = `${pageHero(lang, { img: d.heroImage, alt: d.heroAlt, title: d.name, sub: d.tagline, figL: `${C[lang].destinations.index.title} / ${d.code}`, figR: `${c.labels.best}: ${d.bestText}`, bar })}
<nav class="subnav" aria-label="${esc(c.labels.onThisPage)}"><ul>${tabs.map(([id, l]) => `<li><a href="#${id}">${esc(l)}</a></li>`).join('')}</ul></nav>
<div class="light">
<div class="wrap detail sec--s" style="padding-top:clamp(40px,5vw,72px)">
  <div>
    <section id="overview">
      <p class="eyebrow">${esc(c.regions[d.region])} / ${esc(d.code)}</p>
      <h2 class="statement statement--m" data-reveal>${esc(d.tagline)}</h2>
      <div class="prose-cols" style="margin-top:32px" data-reveal>${d.overview.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
      ${d.note ? `<p class="note" role="note">${esc(d.note)}</p>` : ''}
    </section>
    <section class="dsec"><div class="gallery">${[{ img: d.heroImage, alt: d.heroAlt }, ...d.gallery].map((g, i) => `<figure data-reveal="img">${pic(g.img, g.alt, { sizes: i ? '(min-width:900px) 22vw, 46vw' : '(min-width:900px) 44vw, 92vw' })}</figure>`).join('')}</div></section>
    <section class="dsec" id="when"><h2>${esc(c.labels.bestMonths)}: ${esc(d.bestText)}</h2><div class="monthbar">${monthCells(lang, d.ratings)}</div>${legend(lang)}<p style="margin-top:20px"><a class="tlink" href="${href(lang, 'two-coasts/')}">${esc(c.nav.twoCoasts)} →</a></p></section>
    <section class="dsec" id="water"><h2>${esc(d.byWaterTitle)}</h2><p class="lead" style="max-width:62ch">${esc(d.byWater)}</p></section>
    <section class="dsec" id="book"><h2>${esc(C[lang].journeys.includedTitle)}</h2><ol class="numlist">${d.experiences.map((e, i) => `<li data-reveal><span class="n">0${i + 1}</span><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p></li>`).join('')}</ol></section>
    <section class="dsec" id="stays"><h2>${esc(c.nav.stays)}</h2><div class="stays">${d.stays.map((s) => card(lang, { img: s.img, alt: d.heroAlt, eyebrow: s.kind, title: s.name, text: s.text, to: href(lang, 'stays/'), sizes: '(min-width:1024px) 30vw, (min-width:700px) 46vw, 92vw', tag: `<span class="tag">${esc(c.labels.placeholder)}</span>` })).join('')}</div></section>
    <section class="dsec" id="getting"><h2>${esc(c.labels.gettingThere)}</h2><dl class="facts"><div><dt>${esc(c.labels.gettingThere)}</dt><dd>${esc(d.gettingThere)}</dd></div><div><dt>${esc(c.labels.nightsSuggested)}</dt><dd>${esc(d.nights)}</dd></div><div><dt>${esc(c.labels.goodFor)}</dt><dd>${d.goodFor.map(esc).join(' · ')}</dd></div></dl></section>
  </div>
  <aside class="aside" aria-label="${esc(c.labels.enquireAbout)} ${esc(d.name)}">
    <p class="eyebrow">${esc(c.labels.goodFor)}</p>
    <h2>${esc(d.goodFor.join(', '))}</h2>
    <dl><div><dt>${esc(c.labels.bestMonths)}</dt><dd>${esc(d.bestText)}</dd></div><div><dt>${esc(c.labels.nightsSuggested)}</dt><dd>${esc(d.nights)}</dd></div><div><dt>${esc(c.labels.price)}</dt><dd>${esc(c.labels.priceOnRequest)}</dd></div></dl>
    <a class="btn" href="${href(lang, 'enquire/')}?d=${slug}">${esc(c.labels.enquireAbout)} ${esc(d.name)}</a>
    <a class="aside__email tlink" href="mailto:${config.contact.email}">${config.contact.email}</a>
  </aside>
</div>
</div>
<section class="dark sec--s" style="padding-bottom:0">
  <div class="wrap shead"><h2 data-reveal>${esc(c.labels.next)}.</h2><div class="shead__text" data-reveal><a class="tlink" href="${href(lang, 'destinations/')}">${esc(c.labels.allDestinations)}</a></div></div>
  <div class="panels">${next.map((n, i) => destPanel(lang, n, i)).join('')}</div>
</section>
${ctaBand(lang, d.gallery[0].img, d.gallery[0].alt)}`;
    const ld = [{ '@context': 'https://schema.org', '@type': 'TouristDestination', name: d.name, description: d.metaDescription, url: abs(lang, `destinations/${slug}/`), touristType: d.goodFor }];
    return { title: `${d.name}: ${d.tagline}`, description: d.metaDescription, body, heroImg: d.heroImage, ld };
  });
}

// Two coasts
add('two-coasts/', (lang) => {
  const t = C[lang].features.twoCoasts;
  const c = C[lang].common;
  const nameOf = (s) => destBy(lang, s)?.name || s;
  const coastBox = (k, m, i) => {
    const better = m.verdict === k || m.verdict === 'both';
    return `<div class="coast${better ? ' is-better' : ''}">
      ${better ? `<span class="coast__badge">${esc(t.better)}</span>` : ''}
      <h3>${esc(t[k])}</h3><p class="coast__sub">${esc(t[k + 'Sub'])}</p>
      <div class="meter" data-r="${COAST[k][i]}" role="img" aria-label="${esc(c.ratings[COAST[k][i]])}"><i></i><i></i><i></i></div>
      <p>${esc(m[k])}</p>
      <dl><div><dt>${esc(c.ratings[3] && t.sea)}</dt><dd>${esc(m[k + 'Sea'])}</dd></div><div><dt>${esc(c.months[i])}</dt><dd>${esc(c.ratings[COAST[k][i]])}</dd></div></dl>
      <p class="mono muted">${esc(t.picks)}</p>
      <div class="picks">${m.picks[k].length ? m.picks[k].map((s) => `<a href="${href(lang, 'destinations/' + s + '/')}">${esc(nameOf(s))} →</a>`).join('') : `<span class="none">—</span>`}</div>
    </div>`;
  };
  const body = `${pageHero(lang, { img: t.heroImg, alt: t.heroAlt, title: t.title, sub: t.intro, figL: t.eyebrow, figR: t.tableNote, cls: 'hero--short' })}
<section class="dark sec--s coasts" id="picker">
  <div class="wrap">
    <fieldset class="picker"><legend class="eyebrow">${esc(t.pickerLabel)}</legend>
      <div class="picker__months">${c.months.map((m, i) => `<div><input type="radio" name="month" id="m${i + 1}" value="${i + 1}"${i === 0 ? ' checked' : ''}><label for="m${i + 1}"><span aria-hidden="true">${esc(c.monthsShort[i])}</span><span class="sr-only">${esc(m)}</span></label></div>`).join('')}</div>
    </fieldset>
    <div aria-live="polite">${t.months.map((m, i) => `<div class="mpanel" data-m="${i + 1}">
      <div class="mpanel__head"><div><p class="eyebrow">${esc(c.months[i])}</p><h2>${esc(t.verdicts[m.verdict])}</h2></div><p class="lead">${esc(m.summary)}</p></div>
      <div class="coastcols">${coastBox('andaman', m, i)}${coastBox('gulf', m, i)}</div>
      <div class="northline"><b>${esc(t.north)}</b><div class="meter" data-r="${COAST.north[i]}" style="width:90px" role="img" aria-label="${esc(c.ratings[COAST.north[i]])}"><i></i><i></i><i></i></div><span>${esc(m.north)}</span><a class="tlink" href="${href(lang, 'destinations/chiang-mai/')}" style="margin-left:auto">${esc(nameOf('chiang-mai'))} →</a></div>
      <p style="margin-top:24px"><a class="btn" href="${href(lang, 'enquire/')}?m=${i + 1}">${esc(t.planButton)}: ${esc(c.months[i])}</a></p>
    </div>`).join('')}</div>
    <p class="muted" style="margin-top:28px;max-width:70ch;font-size:.9375rem">${esc(t.koodNote)}</p>
  </div>
</section>
<div class="dark ribbon-wrap">${ribbon(0)}</div>
<section class="light sec--s">
  <div class="wrap">
    <div class="shead shead--l"><h2>${esc(t.tableTitle)}</h2><div class="shead__text"><p>${esc(t.tableNote)} ${esc(t.sources)}</p></div></div>
    <div class="sched" style="border-color:var(--line-l)">${['andaman', 'gulf', 'north'].map((k) => `<div class="sched__row" style="border-color:var(--line-l)"><div class="sched__name"><span class="mono muted">${esc(k === 'north' ? C[lang].home.coasts.rowsSub.north : t[k + 'Sub'])}</span><b>${esc(k === 'north' ? C[lang].home.coasts.rows.north : t[k])}</b></div><div class="sched__months">${monthCells(lang, COAST[k])}</div></div>`).join('')}</div>
    ${legend(lang)}
  </div>
</section>
${ctaBand(lang, 'coast-gulf')}`;
  return { title: t.metaTitle, description: t.metaDescription, body, heroImg: t.heroImg };
});

// Khlong map
function smooth(pts) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
const STOPS = { tatien: [585, 470], watarun: [497, 478], bangkokyai: [420, 628], bangluang: [300, 754], paknam: [168, 697], barges: [470, 244], bangkoknoi: [372, 226], talingchan: [252, 316] };
const LBL = { tatien: [14, -12, 'start'], watarun: [-12, -12, 'end'], bangkokyai: [10, 26, 'start'], bangluang: [14, 22, 'start'], paknam: [0, 28, 'middle'], barges: [12, -12, 'start'], bangkoknoi: [0, -16, 'middle'], talingchan: [-12, 4, 'end'] };
add('khlong-map/', (lang) => {
  const k = C[lang].features.khlongs;
  const c = C[lang].common;
  const river = 'M560 -20 C520 120 600 200 545 300 S470 470 518 560 S600 760 520 920';
  const kh = {
    noi: 'M548 250 C470 240 400 220 330 230 S200 250 120 222 S40 200 -10 206',
    yai: 'M515 600 C450 612 390 640 330 660 S200 702 120 692 S30 672 -10 682',
    chak: 'M252 234 C242 330 262 420 242 520 S232 620 246 690',
    luang: 'M330 660 C330 730 300 762 262 762 S205 738 200 700',
  };
  const rA = smooth([[585, 470], [540, 474], [497, 478], [503, 540], [515, 600], [450, 612], [395, 636], [330, 660], [326, 712], [300, 754], [262, 762], [214, 738], [200, 700], [168, 697], [200, 700], [270, 684], [330, 660], [420, 628], [515, 600], [548, 540], [585, 470]]);
  const rB = smooth([[585, 470], [560, 400], [556, 320], [548, 250], [470, 244], [372, 226], [300, 230], [252, 236], [252, 316], [244, 420], [244, 520], [240, 610], [246, 690], [330, 660], [420, 628], [515, 600], [550, 540], [585, 470]]);
  const S = k.stops;
  const map = `<svg viewBox="0 0 800 900" role="img" aria-labelledby="kmap-t"><title id="kmap-t">${esc(k.mapLabel)}</title>
    <rect class="land" width="800" height="900"/>
    <g opacity=".5" stroke="rgba(246,241,229,.06)" stroke-width="1">${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${i * 100 + 50} H800"/>`).join('')}${Array.from({ length: 8 }, (_, i) => `<path d="M${i * 100 + 50} 0 V900"/>`).join('')}</g>
    <path class="river" stroke-width="54" d="${river}"/>
    ${Object.values(kh).map((d) => `<path class="khlong" d="${d}"/>`).join('')}
    <path class="flow" d="${river}" stroke-width="1.4"/><path class="flow flow--slow" d="${river}" transform="translate(14 0)"/><path class="flow flow--slow" d="${river}" transform="translate(-14 0)"/>
    ${Object.values(kh).map((d) => `<path class="flow flow--slow" d="${d}"/>`).join('')}
    <text class="lbl--river" transform="translate(600 150) rotate(78)">${esc(k.river)}</text>
    <text class="lbl--bank" x="40" y="120">${esc(k.westBank)}</text>
    <text class="lbl--bank" x="610" y="400">${esc(k.eastBank)}</text>
    <g transform="translate(740 60)"><circle r="18" fill="none" stroke="rgba(246,241,229,.4)"/><path d="M0 -12 L5 4 L0 0 L-5 4 Z" fill="#EBA43A"/><text class="lbl" y="34" text-anchor="middle">${esc(k.north)}</text></g>
    <path id="routeA" class="route route--a" d="${rA}"/>
    <path id="routeB" class="route route--b" d="${rB}"/>
    <g class="boat boat--a"><g transform="scale(.32)">${boatGlyph(1)}</g><animateMotion dur="26s" repeatCount="indefinite" rotate="auto"><mpath href="#routeA"/></animateMotion></g>
    <g class="boat boat--b"><g transform="scale(.32)">${boatGlyph(1)}</g><animateMotion dur="32s" repeatCount="indefinite" rotate="auto"><mpath href="#routeB"/></animateMotion></g>
    ${S.map((s) => { const [x, y] = STOPS[s.id]; const [dx, dy, an] = LBL[s.id]; return `<g class="stop" data-stop="${s.id}" data-r="${s.routes}"><circle cx="${x}" cy="${y}" r="7"/><text x="${x + dx}" y="${y + dy}" text-anchor="${an}">${esc(s.name)}</text></g>`; }).join('')}
  </svg>`;
  const body = `${pageHero(lang, { img: k.heroImg, alt: k.heroAlt, title: k.title, sub: k.intro, figL: k.eyebrow, figR: c.labels.schematic, cls: 'hero--short' })}
<section class="dark sec--s">
  <div class="wrap">
    <div class="shead shead--l"><h2 data-reveal>${esc(k.mapTitle)}</h2><div class="shead__text" data-reveal><p class="eyebrow" style="margin-bottom:8px">${esc(k.tideTitle)}</p><p>${esc(k.tide)}</p></div></div>
    <div class="kmap-wrap">
      <div class="kmap" id="kmap" data-route="all">${map}<span class="kmap__note">${esc(c.labels.schematic)}</span></div>
      <div>
        <p class="eyebrow">${esc(k.routeLabel)}</p>
        <div class="routes" role="group" aria-label="${esc(k.routeLabel)}">${k.routes.map((r) => `<button type="button" data-route="${r.id}" aria-pressed="false"><b>${esc(r.name)}</b><span>${esc(r.time)}. ${esc(r.text)}</span></button>`).join('')}</div>
        <ol class="stops">${S.map((s) => `<li data-r="${s.routes}" data-stop="${s.id}"><button type="button"><time>${esc(s.time)}</time><b>${esc(s.name)}</b><span>${esc(s.text)}</span></button></li>`).join('')}</ol>
      </div>
    </div>
  </div>
</section>
<div class="dark ribbon-wrap">${ribbon(1)}</div>
<section class="light sec--s">
  <div class="wrap">
    <div class="shead shead--l"><h2>${esc(k.practicalTitle)}</h2></div>
    <ol class="numlist">${k.practical.map((p, i) => `<li data-reveal><span class="n">0${i + 1}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join('')}</ol>
    <p style="margin-top:32px"><a class="btn" href="${href(lang, 'destinations/bangkok/')}">${esc(k.button)}</a></p>
  </div>
</section>
${ctaBand(lang, 'bangkok-1')}`;
  return { title: k.metaTitle, description: k.metaDescription, body, heroImg: k.heroImg };
});

// Responsible travel
add('responsible-travel/', (lang) => {
  const r = C[lang].features.responsible;
  const body = `${pageHero(lang, { img: r.heroImg, alt: r.heroAlt, title: r.title, sub: r.intro, figL: r.eyebrow })}
<section class="light sec">
  <div class="wrap">
    <div class="lab"><p class="eyebrow">${esc(r.eyebrow)}</p><div><h2 class="h-xl" data-reveal>${esc(r.elephantsTitle)}</h2><p class="lead" style="max-width:60ch;margin-top:28px" data-reveal>${esc(r.elephantsText)}</p></div></div>
    <div class="two" style="margin-top:clamp(48px,6vw,88px)">
      <div data-reveal><h3 class="h-s" style="margin-bottom:16px">${esc(r.weBook)}</h3><ul class="checks" style="grid-template-columns:1fr">${r.weBookList.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div data-reveal><h3 class="h-s" style="margin-bottom:16px">${esc(r.weDont)}</h3><ul class="checks checks--no" style="grid-template-columns:1fr">${r.weDontList.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    </div>
  </div>
</section>
<section class="silt sec--s">
  <div class="wrap">
    <div class="shead shead--l"><h2 data-reveal>${esc(r.checklistTitle)}</h2><div class="shead__text" data-reveal><p>${esc(r.checklistText)}</p></div></div>
    <div class="cgrid">${r.checklist.map((x, i) => `<div data-reveal style="--d:${(i % 3) * 0.08}s"><b>0${i + 1}</b><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>`).join('')}</div>
  </div>
</section>
<section class="seq seq--plain" style="min-height:auto">
  <div class="seq__img">${pic('elephant-1', C[lang].home.editorial[0].alt)}</div>
</section>
<section class="dark sec">
  <div class="wrap">
    <div class="lab"><p class="eyebrow">${esc(C[lang].common.nav.responsible)}</p><div><h2 class="h-xl" data-reveal>${esc(r.tribesTitle)}</h2><p class="lead muted" style="max-width:60ch;margin-top:28px" data-reveal>${esc(r.tribesText)}</p></div></div>
    <div class="ed ed--rev" style="margin-top:clamp(48px,6vw,88px);align-items:start">
      <figure style="margin:0" data-reveal="img">${pic('north-hilltribe', C[lang].destinations.items[3].gallery[1].alt, { sizes: '(min-width:900px) 32vw, 92vw' })}</figure>
      <ol class="numlist">${r.tribesList.map((x, i) => `<li data-reveal><span class="n">0${i + 1}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join('')}</ol>
    </div>
  </div>
</section>
<section class="light sec--s">
  <div class="wrap">${faqBlock(r.faqTitle, `${r.sources}`, r.faq, `<p style="margin-top:16px"><a class="tlink" href="https://www.worldanimalprotection.org" rel="noopener" target="_blank">World Animal Protection ↗</a></p>`)}</div>
</section>
${ctaBand(lang, 'chiangmai-2')}`;
  return { title: r.metaTitle, description: r.metaDescription, body, heroImg: r.heroImg };
});

// Journeys
add('journeys/', (lang) => {
  const j = C[lang].journeys;
  const body = `${pageHero(lang, { img: j.index.heroImg, alt: j.index.heroAlt, title: j.index.title, sub: j.index.intro, figL: j.index.eyebrow, figR: `${j.items.length} · ${C[lang].common.nav.journeys}` })}
<section class="dark sec--s"><div class="wrap"><div class="jgrid">${j.items.map((x) => journeyCard(lang, x)).join('')}</div></div></section>
${ctaBand(lang, 'journey-2')}`;
  return { title: j.index.metaTitle, description: j.index.metaDescription, body, heroImg: j.index.heroImg };
});
for (const slug of C.en.journeys.items.map((j) => j.slug)) {
  add(`journeys/${slug}/`, (lang) => {
    const J = C[lang].journeys;
    const c = C[lang].common;
    const j = J.items.find((x) => x.slug === slug);
    const others = J.items.filter((x) => x !== j).slice(0, 2);
    const route = `<div class="routeline">${j.route.map((s) => `<a href="${href(lang, 'destinations/' + s + '/')}">${esc(destBy(lang, s).name)}</a>`).join('')}</div>`;
    const body = `<div class="light">
<div class="phead"><p class="eyebrow"><a href="${href(lang, 'journeys/')}" style="text-decoration:none">${esc(c.nav.journeys)}</a> / ${j.nights} ${esc(c.labels.nights)}</p><h1>${esc(j.name)}</h1><p class="lead">${esc(j.summary)}</p></div>
<div class="wrap"><div class="gallery">${[j.img, ...j.gallery.slice(0, 2)].map((g, i) => `<figure>${pic(g, i ? j.galleryAlt[i - 1] : j.alt, { sizes: i ? '(min-width:900px) 32vw, 46vw' : '(min-width:900px) 64vw, 92vw', eager: i === 0 })}</figure>`).join('')}</div></div>
<div class="wrap detail sec--s">
  <div>
    <section><p class="eyebrow">${esc(c.labels.route)}</p>${route}</section>
    <section class="dsec"><h2>${esc(J.itineraryTitle)}</h2><div class="daygrid">${j.days.map((d) => `<div data-reveal><span class="mono" style="color:var(--c-teak)">${esc(J.dayLabel)}</span><b>${esc(d.days)}</b><h3>${esc(d.place)}</h3><p>${esc(d.text)}</p></div>`).join('')}</div></section>
    <section class="dsec"><h2>${esc(J.includedTitle)}</h2><ul class="checks">${J.included.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>
    <section class="dsec"><h2>${esc(J.notIncludedTitle)}</h2><ul class="checks checks--no">${J.notIncluded.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>
  </div>
  <aside class="aside"><p class="eyebrow">${esc(c.labels.planThis)}</p><h2>${esc(j.name)}</h2><dl><div><dt>${esc(c.labels.nightsSuggested)}</dt><dd>${j.nights}</dd></div><div><dt>${esc(c.labels.bestMonths)}</dt><dd>${esc(j.months)}</dd></div><div><dt>${esc(c.labels.price)}</dt><dd>${j.price ? `${esc(c.labels.from)} ${esc(j.price)}` : esc(c.labels.priceOnRequest)}</dd></div></dl><a class="btn" href="${href(lang, 'enquire/')}?j=${slug}">${esc(c.labels.planThis)}</a><a class="aside__email tlink" href="mailto:${config.contact.email}">${config.contact.email}</a></aside>
</div>
</div>
<section class="dark sec--s"><div class="wrap"><div class="shead shead--l"><h2>${esc(J.alsoTitle)}</h2><div class="shead__text"><p>${esc(J.alsoText)}</p><a class="tlink" href="${href(lang, 'journeys/')}">${esc(c.labels.viewAll)}</a></div></div><div class="jgrid">${others.map((x) => journeyCard(lang, x)).join('')}</div></div></section>
${ctaBand(lang, j.gallery[2], j.galleryAlt[2])}`;
    return { title: `${j.name}: ${j.nights} ${c.labels.nights}`, description: j.metaDescription, body, heroImg: j.img, bodyClass: 'solid' };
  });
}

// Stays
add('stays/', (lang) => {
  const s = C[lang].pages.stays;
  const c = C[lang].common;
  const D = C[lang].destinations.items;
  const body = `${pageHero(lang, { img: s.heroImg, alt: s.heroAlt, title: s.title, sub: s.intro, figL: s.eyebrow, figR: s.groupNote })}
<section class="dark sec--s"><div class="wrap"><div class="shead shead--l"><h2>${esc(s.principlesTitle)}</h2><div class="shead__text"><p>${esc(s.groupNote)}</p></div></div><div class="cgrid" style="border-color:var(--line-d)">${s.principles.map((p, i) => `<div style="border-color:var(--line-d)" data-reveal><b style="color:var(--c-marigold)">0${i + 1}</b><h3>${esc(p.title)}</h3><p class="muted">${esc(p.text)}</p></div>`).join('')}</div></div></section>
<div class="light">${D.map((d, i) => `<section class="wrap sec--s"${i ? ' style="padding-top:0"' : ''}>
  <div class="shead shead--l" style="margin-bottom:28px;border-top:1px solid var(--line-l);padding-top:28px"><div><p class="eyebrow">${esc(c.regions[d.region])} / ${esc(d.code)}</p><h2 style="font-size:var(--fs-m)">${esc(d.name)}</h2></div><div class="shead__text"><a class="tlink" href="${href(lang, 'destinations/' + d.slug + '/')}">${esc(c.labels.discover)}</a></div></div>
  <div class="stays">${d.stays.map((x) => card(lang, { img: x.img, alt: d.heroAlt, eyebrow: x.kind, title: x.name, text: x.text, to: href(lang, 'enquire/') + '?d=' + d.slug, sizes: '(min-width:700px) 46vw, 92vw', tag: `<span class="tag">${esc(c.labels.placeholder)}</span>` })).join('')}</div>
</section>`).join('')}</div>
${ctaBand(lang, 'stays-1')}`;
  return { title: s.metaTitle, description: s.metaDescription, body, heroImg: s.heroImg };
});

// About
add('about/', (lang) => {
  const a = C[lang].pages.about;
  const body = `${pageHero(lang, { img: a.heroImg, alt: a.heroAlt, title: a.title, figL: a.eyebrow })}
<section class="river-sec sec" data-progress>
  <div class="wrap lab"><p class="eyebrow">${esc(config.brand.name)}</p><div><p class="statement statement--m" data-reveal>${esc(a.story[0])}</p><div class="intro-cols">${a.story.slice(1).map((s) => `<p class="lead" data-reveal>${esc(s)}</p>`).join('')}</div></div></div>
</section>
<section class="light sec--s"><div class="wrap"><div class="shead shead--l"><h2>${esc(a.howTitle)}</h2></div><div class="cgrid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${a.how.map((x, i) => `<div data-reveal style="--d:${i * 0.08}s"><b>0${i + 1}</b><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>`).join('')}</div></div></section>
<div class="light ribbon-wrap">${ribbon(0)}</div>
<section class="light sec--s" style="padding-top:0"><div class="wrap"><div class="shead shead--l"><h2>${esc(a.principlesTitle)}</h2></div><ol class="numlist">${a.principles.map((x, i) => `<li data-reveal><span class="n">0${i + 1}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join('')}</ol></div></section>
<section class="dark sec--s"><div class="wrap lab"><p class="eyebrow">${esc(a.addressTitle)}</p><div><p class="lead muted" style="max-width:52ch">${esc(a.addressText)}</p><address style="font-style:normal;margin-top:24px;font-size:1.25rem;line-height:1.5">${esc(config.brand.name)}<br>${esc(addr.venue)}, ${esc(addr.line1)}<br>${esc(addr.street)}, ${esc(addr.locality)}<br>${esc(addr.city)} ${esc(addr.postcode)}, ${esc(addr.country)}<br><br><a class="tlink" href="mailto:${config.contact.email}">${config.contact.email}</a></address></div></div></section>
${ctaBand(lang, 'khlong-2')}`;
  return { title: a.metaTitle, description: a.metaDescription, body, heroImg: a.heroImg };
});

// Journal
add('journal/', (lang) => {
  const j = C[lang].pages.journal;
  const c = C[lang].common;
  const A = C[lang].journal.items;
  const fmt = (d) => new Date(d).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' });
  const body = `${pageHero(lang, { img: j.heroImg, alt: j.heroAlt, title: j.title, sub: j.intro, figL: j.eyebrow, cls: 'hero--short' })}
<section class="light sec--s"><div class="wrap">
  <div class="ed">${A.slice(0, 2).map((a, i) => card(lang, { img: a.img, alt: a.alt, eyebrow: `${fmt(a.date)} · ${a.minutes} ${c.labels.minRead}`, title: a.title, text: a.excerpt, link: c.labels.readMore, to: href(lang, 'journal/' + a.slug + '/'), sizes: i ? '(min-width:900px) 32vw, 92vw' : '(min-width:900px) 64vw, 92vw' })).join('')}</div>
  <div class="jgrid" style="margin-top:clamp(48px,6vw,88px)">${A.slice(2).map((a) => `<a class="jcard" href="${href(lang, 'journal/' + a.slug + '/')}" data-reveal><div class="jcard__text"><p class="eyebrow">${esc(fmt(a.date))} · ${a.minutes} ${esc(c.labels.minRead)}</p><h3>${esc(a.title)}</h3><p class="jcard__sum">${esc(a.excerpt)}</p><span class="tlink" style="margin-top:auto;align-self:flex-start">${esc(c.labels.readMore)}</span></div><div class="jcard__img">${pic(a.img, a.alt, { sizes: '(min-width:900px) 24vw, 92vw' })}</div></a>`).join('')}</div>
</div></section>
${ctaBand(lang, 'journal-3')}`;
  return { title: j.metaTitle, description: j.metaDescription, body, heroImg: j.heroImg };
});
for (const slug of C.en.journal.items.map((a) => a.slug)) {
  add(`journal/${slug}/`, (lang) => {
    const c = C[lang].common;
    const A = C[lang].journal.items;
    const a = A.find((x) => x.slug === slug);
    const fmt = new Date(a.date).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' });
    const body = `<article class="light">
  <header class="phead"><p class="eyebrow"><a href="${href(lang, 'journal/')}" style="text-decoration:none">${esc(c.nav.journal)}</a> / ${a.minutes} ${esc(c.labels.minRead)}</p><h1>${esc(a.title)}</h1><p class="lead">${esc(a.excerpt)}</p></header>
  <figure class="article-fig wrap">${pic(a.img, a.alt, { eager: true, sizes: 'calc(100vw - 2 * var(--g))' })}</figure>
  <div class="wrap lab sec--s"><p class="mono" style="color:var(--c-teak)"><time datetime="${a.date}">${esc(fmt)}</time></p><div class="prose">${a.body.map((b) => (b.type === 'h' ? `<h2>${esc(b.text)}</h2>` : `<p${b === a.body[0] ? ' class="lead"' : ''}>${esc(b.text)}</p>`)).join('')}
  <p style="margin-top:2em"><a class="tlink" href="${href(lang, 'two-coasts/')}">${esc(c.nav.twoCoasts)} →</a></p></div></div>
</article>
<section class="light sec--s" style="padding-top:0"><div class="wrap rail"><div class="rail__intro"><h2>${esc(c.nav.journal)}</h2></div><div class="rail__track">${A.filter((x) => x !== a).map((x) => card(lang, { img: x.img, alt: x.alt, eyebrow: `${x.minutes} ${c.labels.minRead}`, title: x.title, text: x.excerpt, link: c.labels.readMore, to: href(lang, 'journal/' + x.slug + '/'), sizes: '360px' })).join('')}</div></div></section>
${ctaBand(lang, 'journey-1')}`;
    const ld = [{ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, datePublished: a.date, inLanguage: lang, image: ogImage(a.img), author: { '@type': 'Organization', name: config.brand.name }, publisher: { '@id': config.siteUrl + '/#org' } }];
    return { title: a.title, description: a.metaDescription, body, heroImg: a.img, ld, bodyClass: 'solid' };
  });
}

// Enquire
const formMarkup = (lang) => {
  const e = C[lang].pages.enquire;
  const f = e.form;
  const c = C[lang].common;
  const year = new Date().getFullYear();
  return `<form class="form" id="enquiry" action="${config.formEndpoint}" method="POST" novalidate data-thanks="${href(lang, 'enquire/thanks/')}">
  <input type="hidden" name="_subject" value="${esc(f.subject)}">
  <input type="hidden" name="_template" value="table">
  <input type="hidden" name="_captcha" value="false">
  <input type="hidden" name="_next" value="${abs(lang, 'enquire/thanks/')}">
  <input type="hidden" name="language" value="${lang}">
  <input type="hidden" name="interest_destination" value="">
  <div class="hp" aria-hidden="true"><label>Leave empty <input type="text" name="_honey" tabindex="-1" autocomplete="off"></label></div>
  <div class="row">
    <div class="field" id="f-name"><label for="name">${esc(f.name)} <span aria-hidden="true">*</span></label><input type="text" id="name" name="name" autocomplete="name" required aria-describedby="name-err"><p class="err" id="name-err">${esc(f.errors.name)}</p></div>
    <div class="field" id="f-email"><label for="email">${esc(f.email)} <span aria-hidden="true">*</span></label><input type="email" id="email" name="email" autocomplete="email" required aria-describedby="email-err"><p class="err" id="email-err">${esc(f.errors.email)}</p></div>
  </div>
  <div class="row row--3">
    <div class="field"><label for="month">${esc(f.month)}</label><select id="month" name="month"><option value="">${esc(f.monthPlaceholder)}</option>${c.months.map((m, i) => `<option value="${esc(m)}" data-m="${i + 1}">${esc(m)}</option>`).join('')}<option value="${esc(f.flexible)}">${esc(f.flexible)}</option></select></div>
    <div class="field"><label for="year">${esc(f.year)}</label><select id="year" name="year">${[year, year + 1, year + 2].map((y) => `<option>${y}</option>`).join('')}</select></div>
    <div class="field"><label for="nights">${esc(f.nights)}</label><select id="nights" name="nights">${f.nightsOptions.map((o) => `<option>${esc(o)}</option>`).join('')}</select></div>
  </div>
  <div class="row">
    <div class="field"><label for="adults">${esc(f.adults)}</label><input type="number" id="adults" name="adults" min="1" max="20" value="2" inputmode="numeric"></div>
    <div class="field"><label for="children">${esc(f.children)}</label><input type="number" id="children" name="children" min="0" max="20" value="0" inputmode="numeric"></div>
  </div>
  <fieldset class="field"><legend>${esc(f.interests)}</legend><div class="chips">${f.interestsOptions.map((o, i) => `<span><input type="checkbox" id="i${i}" name="interests[]" value="${esc(o)}"><label for="i${i}">${esc(o)}</label></span>`).join('')}</div></fieldset>
  <div class="field"><label for="message">${esc(f.message)}</label><textarea id="message" name="message" rows="5" aria-describedby="message-hint"></textarea><p class="hint" id="message-hint">${esc(f.messageHint)}</p></div>
  <div class="field" id="f-consent"><div class="consent"><input type="checkbox" id="consent" name="consent" value="yes" required aria-describedby="consent-err"><label for="consent" style="text-transform:none;letter-spacing:0;font:400 .9375rem/1.5 var(--text);color:var(--c-ink);margin:0">${esc(f.consent).replace(esc(C[lang].common.footer.privacy), `<a href="${href(lang, 'privacy/')}">${esc(C[lang].common.footer.privacy)}</a>`)}</label></div><p class="err" id="consent-err">${esc(f.errors.consent)}</p></div>
  <div><button class="btn" type="submit" data-sending="${esc(f.sending)}">${esc(f.submit)}</button></div>
</form>`;
};
add('enquire/', (lang) => {
  const e = C[lang].pages.enquire;
  const body = `<div class="light">
<div class="phead"><p class="eyebrow">${esc(e.eyebrow)}</p><h1>${esc(e.title)}</h1><p class="lead">${esc(e.intro)}</p></div>
<div class="wrap detail" style="padding-bottom:clamp(72px,9vw,140px)">
  <div>${formMarkup(lang)}</div>
  <aside class="aside"><p class="eyebrow">${esc(e.asideTitle)}</p><p>${esc(e.asideText)}</p><p style="margin-top:14px"><a class="tlink" href="mailto:${config.contact.email}">${config.contact.email}</a></p><dl style="margin-top:22px"><div><dt>${esc(e.addressTitle)}</dt><dd><address style="font-style:normal">${esc(config.brand.name)}<br>${esc(addr.venue)}<br>${esc(addr.line1)}<br>${esc(addr.street)}<br>${esc(addr.locality)}<br>${esc(addr.city)} ${esc(addr.postcode)}<br>${esc(addr.country)}</address></dd></div></dl></aside>
</div>
</div>`;
  const ld = [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: e.title, url: abs(lang, 'enquire/'), about: { '@id': config.siteUrl + '/#org' } }];
  return { title: e.metaTitle, description: e.metaDescription, body, bodyClass: 'solid', ld };
});
add('enquire/thanks/', (lang) => {
  const t = C[lang].pages.enquire.thanks;
  const body = `<div class="light"><div class="phead" style="min-height:70vh"><p class="eyebrow">${esc(C[lang].pages.enquire.eyebrow)}</p><h1>${esc(t.title)}</h1><p class="lead">${esc(t.text)}</p><p style="margin-top:32px"><a class="btn" href="${href(lang)}">${esc(t.button)}</a></p></div></div>`;
  return { title: t.metaTitle, description: t.text, body, bodyClass: 'solid', noindex: true };
});

// Legal
for (const [key, p] of [['privacy', 'privacy/'], ['terms', 'booking-terms/'], ['cookies', 'cookies/']]) {
  add(p, (lang) => {
    const lg = C[lang].legal;
    const x = lg[key];
    const body = `<div class="light">
<div class="phead"><p class="eyebrow">${esc(C[lang].common.footer.legal)}</p><h1>${esc(x.title)}</h1><p class="mono" style="color:var(--c-teak)">${esc(lg.updatedLabel)}: <time datetime="${lg.updated}">${esc(new Date(lg.updated).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' }))}</time></p></div>
<div class="wrap lab" style="padding-bottom:clamp(72px,9vw,140px)"><nav aria-label="${esc(C[lang].common.labels.onThisPage)}" class="mono" style="color:var(--c-teak);line-height:2.1">${x.sections.map((s, i) => `<a href="#s${i + 1}" style="display:block;text-decoration:none">${esc(s.h)}</a>`).join('')}</nav><div class="prose">${x.sections.map((s, i) => `<h2 id="s${i + 1}">${esc(s.h)}</h2>${s.p.map((t) => `<p>${esc(t).replace(esc(config.contact.email), `<a href="mailto:${config.contact.email}">${config.contact.email}</a>`)}</p>`).join('')}`).join('')}</div></div>
</div>`;
    return { title: x.metaTitle, description: x.metaDescription, body, bodyClass: 'solid' };
  });
}

// Credits
add('credits/', (lang) => {
  const cr = C[lang].pages.credits;
  const rows = Object.entries(IMG).filter(([, v]) => v.source !== 'unsplash');
  const body = `<div class="light">
<div class="phead"><p class="eyebrow">${esc(C[lang].common.footer.credits)}</p><h1>${esc(cr.title)}</h1><p class="lead">${esc(cr.intro)}</p></div>
<div class="wrap" style="padding-bottom:clamp(72px,9vw,140px)">${rows.length ? `<table class="credits"><thead><tr><th>${esc(cr.usedOn)}</th><th>${esc(cr.author)}</th><th>${esc(cr.license)}</th><th>${esc(cr.source)}</th></tr></thead><tbody>${rows.map(([, v]) => `<tr><td>${esc(v.location || v.title)}</td><td>${esc(v.author || '')}</td><td>${v.licenseUrl ? `<a href="${esc(v.licenseUrl)}" rel="license noopener" target="_blank">${esc(v.license)}</a>` : esc(v.license || '')}</td><td><a href="${esc(v.pageUrl)}" rel="noopener" target="_blank">Wikimedia Commons</a></td></tr>`).join('')}</tbody></table>` : `<p>${esc(cr.none)}</p>`}</div>
</div>`;
  return { title: cr.metaTitle, description: cr.metaDescription, body, bodyClass: 'solid' };
});

// ---------- write ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'public'), DIST, { recursive: true });
const sitemap = [];
for (const { p, render } of pages) {
  for (const lang of L) {
    const r = render(lang);
    let html = layout(lang, p, r);
    if (r.noindex) html = html.replace('<meta name="viewport"', '<meta name="robots" content="noindex"><meta name="viewport"');
    if (r.bodyClass && r.bodyClass.includes('solid')) html = html.replace('class="hdr"', 'class="hdr is-solid" data-solid');
    const out = path.join(DIST, lang === 'en' ? '' : lang, p, 'index.html');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    if (!r.noindex && lang === 'en') sitemap.push(p);
  }
}
// 404 (English + links to other languages)
{
  const lang = 'en';
  const nf = C.en.common.notFound;
  const body = `<div class="phead" style="min-height:80vh"><p class="eyebrow">404</p><h1>${esc(nf.title)}</h1><p class="lead">${esc(nf.text)}</p><p style="margin-top:32px;display:flex;gap:20px;flex-wrap:wrap;align-items:center"><a class="btn" href="/">${esc(nf.home)}</a>${L.slice(1).map((l) => `<a class="tlink" href="/${l}/" lang="${l}">${esc(C[l].common.notFound.home)}</a>`).join('')}</p></div>`;
  let html = layout(lang, '', { title: nf.title, description: nf.text, body, bodyClass: 'solid' }).replace('class="hdr"', 'class="hdr is-solid" data-solid').replace('<meta name="viewport"', '<meta name="robots" content="noindex"><meta name="viewport"');
  fs.writeFileSync(path.join(DIST, '404.html'), html);
}
const urls = sitemap.map((p) => `<url><loc>${abs('en', p)}</loc>${L.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${abs(l, p)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${abs('en', p)}"/></url>`);
const allUrls = sitemap.flatMap((p) => L.map((l) => urls[sitemap.indexOf(p)].replace(`<loc>${abs('en', p)}</loc>`, `<loc>${abs(l, p)}</loc>`)));
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${allUrls.join('')}</urlset>`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
console.log(`Built ${pages.length} pages × ${L.length} locales = ${pages.length * L.length} files`);
