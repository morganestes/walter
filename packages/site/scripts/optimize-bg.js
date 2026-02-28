/**
 * Generate pre-filtered background images for light and dark themes.
 *
 * Uses SVG filter effects — the exact spec CSS filters are built on —
 * to produce pixel-accurate output matching the original CSS filters.
 *
 * Source: src/assets/desert.jpg
 * Output: public/bg/desert-{dark,light}.{webp,jpg}
 *
 * Usage: node scripts/optimize-bg.js [--force]
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const INPUT = path.join(__dirname, '..', 'src', 'assets', 'desert.jpg');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'bg');
const force = process.argv.includes('--force');

// CSS sepia(s) matrix: blend identity with sepia at amount s
function sepiaMatrix(s) {
  const r0 = `${0.393 * s + (1 - s)} ${0.769 * s} ${0.189 * s} 0 0`;
  const r1 = `${0.349 * s} ${0.686 * s + (1 - s)} ${0.168 * s} 0 0`;
  const r2 = `${0.272 * s} ${0.534 * s} ${0.131 * s + (1 - s)} 0 0`;
  return `${r0} ${r1} ${r2} 0 0 0 1 0`;
}

async function processImages() {
  const marker = path.join(OUTPUT_DIR, 'desert-dark.webp');
  if (!force && fs.existsSync(marker)) {
    console.log('Background images up to date (use --force to rebuild)');
    return;
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const meta = await sharp(INPUT).metadata();
  const base64 = fs.readFileSync(INPUT).toString('base64');
  const href = `data:image/jpeg;base64,${base64}`;
  const w = meta.width;
  const h = meta.height;

  console.log(
    `Source: ${w}x${h} ${meta.format} (${(fs.statSync(INPUT).size / 1024).toFixed(0)}KB)`
  );

  // ── Dark variant ──────────────────────────────────────
  // CSS: brightness(0.10) saturate(0.3) sepia(0.4) hue-rotate(-40deg)
  const darkSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}">
  <defs>
    <filter id="f" color-interpolation-filters="sRGB">
      <feComponentTransfer>
        <feFuncR type="linear" slope="0.10"/>
        <feFuncG type="linear" slope="0.10"/>
        <feFuncB type="linear" slope="0.10"/>
      </feComponentTransfer>
      <feColorMatrix type="saturate" values="0.3"/>
      <feColorMatrix type="matrix" values="${sepiaMatrix(0.4)}"/>
      <feColorMatrix type="hueRotate" values="-40"/>
    </filter>
  </defs>
  <image href="${href}" width="${w}" height="${h}" filter="url(#f)"/>
</svg>`;

  const darkBuf = Buffer.from(darkSvg);
  const darkBase = sharp(darkBuf, { density: 72 }).resize(1920, null, { withoutEnlargement: true });

  await darkBase.clone().webp({ quality: 95 }).toFile(path.join(OUTPUT_DIR, 'desert-dark.webp'));
  await darkBase.clone().jpeg({ quality: 95 }).toFile(path.join(OUTPUT_DIR, 'desert-dark.jpg'));

  // ── Light variant ─────────────────────────────────────
  // CSS: brightness(1) saturate(0.15) sepia(0.15) hue-rotate(-10deg) opacity(0.4)
  // brightness(1) is identity. opacity(0.4) composited over page bg ~rgb(242,240,237).
  const lightSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}">
  <defs>
    <filter id="f" color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0.15"/>
      <feColorMatrix type="matrix" values="${sepiaMatrix(0.15)}"/>
      <feColorMatrix type="hueRotate" values="-10"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="rgb(242,240,237)"/>
  <image href="${href}" width="${w}" height="${h}" filter="url(#f)" opacity="0.4"/>
</svg>`;

  const lightBuf = Buffer.from(lightSvg);
  const lightBase = sharp(lightBuf, { density: 72 }).resize(1920, null, {
    withoutEnlargement: true
  });

  await lightBase.clone().webp({ quality: 95 }).toFile(path.join(OUTPUT_DIR, 'desert-light.webp'));
  await lightBase.clone().jpeg({ quality: 95 }).toFile(path.join(OUTPUT_DIR, 'desert-light.jpg'));

  // ── Mobile variants (center crop, half width, full height, resize to 960px) ──
  const mobileW = Math.round(w / 2);
  const left = Math.round((w - mobileW) / 2);

  await sharp(darkBuf, { density: 72 })
    .extract({ left, top: 0, width: mobileW, height: h })
    .resize(960, null)
    .webp({ quality: 95 })
    .toFile(path.join(OUTPUT_DIR, 'desert-dark-mobile.webp'));
  await sharp(darkBuf, { density: 72 })
    .extract({ left, top: 0, width: mobileW, height: h })
    .resize(960, null)
    .jpeg({ quality: 95 })
    .toFile(path.join(OUTPUT_DIR, 'desert-dark-mobile.jpg'));

  await sharp(lightBuf, { density: 72 })
    .extract({ left, top: 0, width: mobileW, height: h })
    .resize(960, null)
    .webp({ quality: 95 })
    .toFile(path.join(OUTPUT_DIR, 'desert-light-mobile.webp'));
  await sharp(lightBuf, { density: 72 })
    .extract({ left, top: 0, width: mobileW, height: h })
    .resize(960, null)
    .jpeg({ quality: 95 })
    .toFile(path.join(OUTPUT_DIR, 'desert-light-mobile.jpg'));

  // ── Report ────────────────────────────────────────────
  const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.startsWith('desert-'));
  let totalKB = 0;
  for (const file of files) {
    const kb = fs.statSync(path.join(OUTPUT_DIR, file)).size / 1024;
    totalKB += kb;
    console.log(`  ${file}: ${kb.toFixed(0)}KB`);
  }
  console.log(
    `Total: ${totalKB.toFixed(0)}KB (source was ${(fs.statSync(INPUT).size / 1024).toFixed(0)}KB)`
  );
}

processImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
