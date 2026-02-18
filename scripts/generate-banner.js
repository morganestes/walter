/**
 * Generate a README banner by cropping the OG image.
 *
 * Source: dist/site/og.png (must run `npm run build:site` first)
 * Output: public/assets/banner.png
 *
 * Crops the OG image (1200x630) to focus on the terminal card,
 * trimming excess background while keeping atmosphere.
 *
 * Usage: node scripts/generate-banner.js [--force]
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'dist', 'site', 'og.png');
const OUTPUT = path.join(ROOT, 'public', 'assets', 'banner.png');
const force = process.argv.includes('--force');

// Crop region (from 1200x630 OG image)
// Terminal card is 660px wide, centered at x=270..930
const CROP = {
  left: 185,
  top: 30,
  width: 830,
  height: 570
};

async function generate() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Source not found: ${SOURCE}`);
    console.error('Run `npm run build:site` first to generate the OG image.');
    process.exit(1);
  }

  if (!force && fs.existsSync(OUTPUT)) {
    console.log(`  skip banner.png (exists, use --force to rebuild)`);
    return;
  }

  await sharp(SOURCE).extract(CROP).png().toFile(OUTPUT);

  const stat = fs.statSync(OUTPUT);
  console.log(`  banner.png (${CROP.width}x${CROP.height}, ${stat.size} bytes)`);
}

generate().catch((err) => {
  console.error('Banner generation failed:', err);
  process.exit(1);
});
