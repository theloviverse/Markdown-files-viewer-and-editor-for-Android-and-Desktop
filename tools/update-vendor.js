#!/usr/bin/env node
/**
 * update-vendor.js — a minified könyvtárak másolása node_modules-ból a tools/vendor/ alá.
 *
 * Először telepítsd a csomagokat:
 *     npm i marked@12.0.2 dompurify@3.1.6 @highlightjs/cdn-assets@11.9.0
 * majd:
 *     node tools/update-vendor.js
 *     node tools/build.js
 *
 * (Az `npm run vendor` mindkét lépést elvégzi a telepítés után.)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const nm = path.join(root, 'node_modules');
const vendorDir = path.join(__dirname, 'vendor');

const COPIES = [
  { from: 'marked/marked.min.js',                 to: 'marked.min.js' },
  { from: 'dompurify/dist/purify.min.js',         to: 'purify.min.js' },
  { from: '@highlightjs/cdn-assets/highlight.min.js', to: 'highlight.min.js' },
];

fs.mkdirSync(vendorDir, { recursive: true });
for (const c of COPIES) {
  const src = path.join(nm, c.from);
  if (!fs.existsSync(src)) {
    throw new Error(`Hiányzik: ${src}. Futtasd előbb az npm install-t.`);
  }
  fs.copyFileSync(src, path.join(vendorDir, c.to));
  console.log(`Frissítve: tools/vendor/${c.to}`);
}
console.log('Kész. Most futtasd: node tools/build.js');
