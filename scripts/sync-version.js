#!/usr/bin/env node

/**
 * Sync version from package.json to plugin manifests.
 *
 * Targets:
 *   .claude-plugin/plugin.json
 *   .claude-plugin/marketplace.json
 *
 * Astro sources (Terminal.astro, og.png.ts) import version from
 * src/data/site.ts which reads package.json directly.
 *
 * Usage: node scripts/sync-version.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const pkg = require(path.join(ROOT, 'package.json'));
const version = pkg.version;

function syncJSON(filePath, accessor) {
  const abs = path.join(ROOT, filePath);
  const data = JSON.parse(fs.readFileSync(abs, 'utf-8'));
  const target = accessor(data);
  if (target.version === version) return false;
  target.version = version;
  fs.writeFileSync(abs, JSON.stringify(data, null, 2) + '\n');
  return true;
}

const targets = [
  {
    file: '.claude-plugin/plugin.json',
    sync: () => syncJSON('.claude-plugin/plugin.json', (d) => d)
  },
  {
    file: '.claude-plugin/marketplace.json',
    sync: () => syncJSON('.claude-plugin/marketplace.json', (d) => d.plugins[0])
  }
];

console.log(`Syncing version ${version}...`);

let changed = 0;
for (const { file, sync } of targets) {
  if (sync()) {
    console.log(`  ✓ ${file}`);
    changed++;
  } else {
    console.log(`  · ${file} (already current)`);
  }
}

console.log(changed > 0 ? `  ${changed} file(s) updated.` : '  All files current.');
