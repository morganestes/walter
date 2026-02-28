/**
 * Generate favicon PNGs from the SVG source.
 *
 * Source: public/favicon.svg
 * Output: public/favicon-32x32.png, public/apple-touch-icon.png
 *
 * Usage: node scripts/generate-favicons.js [--force]
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = path.join(import.meta.dirname, '..', 'public');
const force = process.argv.includes('--force');

// Brand colors (dark mode — used for static PNG favicons)
const BG = '#0b0907';
const FILL = '#e2ddd7';

// Lab flask path (public domain, via SVG Repo — designed for icon use)
const FLASK_PATH =
  'M16.432 15C14.387 9.893 12 8.547 12 6V3h.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H8v3c0 2.547-2.387 3.893-4.432 9-.651 1.625-2.323 4 6.432 4s7.083-2.375 6.432-4zm-1.617 1.751c-.702.21-2.099.449-4.815.449s-4.113-.239-4.815-.449c-.249-.074-.346-.363-.258-.628.22-.67.635-1.828 1.411-3.121 1.896-3.159 3.863.497 5.5.497s1.188-1.561 1.824-.497a15.353 15.353 0 0 1 1.411 3.121c.088.265-.009.553-.258.628z';

function buildSvg(size) {
  // Render at 2x internal for sharper details, downscale after
  const s = size * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="-2 -2 24 24">
  <rect x="-2" y="-2" width="24" height="24" fill="${BG}" />
  <path d="${FLASK_PATH}" fill="${FILL}" />
</svg>`;
}

async function generate() {
  const targets = [
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 }
  ];

  for (const { name, size } of targets) {
    const outPath = path.join(OUTPUT_DIR, name);

    if (!force && fs.existsSync(outPath)) {
      console.log(`  skip ${name} (exists, use --force to rebuild)`);
      continue;
    }

    const svg = buildSvg(size);
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);

    const stat = fs.statSync(outPath);
    console.log(`  ${name} (${size}x${size}, ${stat.size} bytes)`);
  }
}

generate().catch((err) => {
  console.error('Favicon generation failed:', err);
  process.exit(1);
});
