// Builds responsive AVIF/WebP/JPEG variants from images-src/*.jpg.
// Run with `npm run images` after adding or replacing a source photo.
// Output: public/img/<id>-<width>.<ext> and src/data/images.json (sizes, colour, credits).
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'images-src');
const OUT = path.join(ROOT, 'public/img');
const DATA = path.join(ROOT, 'src/data/images.json');
const WIDTHS = [480, 800, 1200, 1800];
const HERO_IDS = new Set(['hero-home']);

const manifest = JSON.parse(await fs.readFile(path.join(SRC, 'manifest.json'), 'utf8'));
await fs.mkdir(OUT, { recursive: true });
await fs.mkdir(path.dirname(DATA), { recursive: true });
let previous = {};
try { previous = JSON.parse(await fs.readFile(DATA, 'utf8')); } catch {}

const data = {};
for (const item of manifest) {
  const file = path.join(SRC, item.file || `${item.id}.jpg`);
  try { await fs.access(file); } catch { console.warn('missing', file); continue; }
  const img = sharp(file).rotate();
  const meta = await img.metadata();
  const { dominant } = await sharp(file).rotate().resize(64).stats();
  const color = `rgb(${dominant.r},${dominant.g},${dominant.b})`;
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (HERO_IDS.has(item.id) && meta.width >= 2400) widths.push(2400);
  if (!widths.length) widths.push(meta.width);
  const stat = await fs.stat(file);
  const stamp = `${stat.size}-${Math.round(stat.mtimeMs)}`;
  const fresh = previous[item.id]?.stamp === stamp;
  for (const w of widths) {
    const base = path.join(OUT, `${item.id}-${w}`);
    if (fresh) { try { await fs.access(base + '.avif'); continue; } catch {} }
    const r = sharp(file).rotate().resize({ width: w, withoutEnlargement: true });
    await r.clone().avif({ quality: 48, effort: 4 }).toFile(base + '.avif');
    await r.clone().webp({ quality: 72 }).toFile(base + '.webp');
    if (w === Math.min(1200, widths[widths.length - 1]) || (w === widths[widths.length - 1] && !widths.includes(1200))) await r.clone().jpeg({ quality: 76, mozjpeg: true }).toFile(base + '.jpg');
  }
  data[item.id] = {
    width: meta.width, height: meta.height, widths, color, stamp,
    jpg: Math.min(1200, widths[widths.length - 1]),
    source: item.source, pageUrl: item.pageUrl, author: item.author, license: item.license,
    licenseUrl: item.licenseUrl, title: item.title, location: item.location,
  };
  console.log('ok', item.id, widths.join(','));
}
await fs.writeFile(DATA, JSON.stringify(data, null, 1));
