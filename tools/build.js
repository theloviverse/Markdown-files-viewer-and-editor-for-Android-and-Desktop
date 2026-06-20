#!/usr/bin/env node
/**
 * build.js — a könyvtárak beágyazása az index.html-be (offline, egyfájlos build).
 *
 * Az `index.src.html` (forrássablon) tartalmazza a felületet, a teljes CSS-t és az
 * alkalmazás JS-ét, valamint három helyőrzőt:
 *     <!-- VENDOR_MARKED -->   <!-- VENDOR_PURIFY -->   <!-- VENDOR_HLJS -->
 * Ez a szkript ezeket lecseréli a `tools/vendor/` alatti minified könyvtárakra,
 * `<script>` blokkba ágyazva, és kiírja a kész `index.html`-t.
 * Eredmény: önmagában, internet nélkül is működő index.html.
 *
 * Használat:  node tools/build.js
 *
 * A vendor fájlok frissítése (időnként):
 *     npm i marked@12 dompurify@3 @highlightjs/cdn-assets@11
 *     majd másold a dist fájlokat a tools/vendor/ alá, és futtasd ezt a szkriptet.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcPath = path.join(root, 'index.src.html');
const outPath = path.join(root, 'index.html');
const vendorDir = path.join(__dirname, 'vendor');

const VENDORS = [
  { marker: '<!-- VENDOR_MARKED -->', file: 'marked.min.js',    label: 'marked' },
  { marker: '<!-- VENDOR_PURIFY -->', file: 'purify.min.js',    label: 'DOMPurify' },
  { marker: '<!-- VENDOR_HLJS -->',   file: 'highlight.min.js', label: 'highlight.js' },
];

let html = fs.readFileSync(srcPath, 'utf8');

for (const v of VENDORS) {
  const src = fs.readFileSync(path.join(vendorDir, v.file), 'utf8');
  // Biztonsági ellenőrzés: a script-lezáró szekvencia tönkretenné a beágyazást.
  if (/<\/script/i.test(src)) {
    throw new Error(`A(z) ${v.file} tartalmaz "</script" szekvenciát — escapelés szükséges.`);
  }
  const block = `<script>\n/* vendored: ${v.label} */\n${src}\n</script>`;
  if (!html.includes(v.marker)) {
    throw new Error(`A(z) "${v.marker}" helyőrző nem található az index.src.html-ben.`);
  }
  // FONTOS: függvény-helyettesítőt használunk, hogy a minified forrásban lévő
  // `$`-szekvenciák (pl. $', $&) ne kapjanak speciális jelentést a String.replace-ben.
  html = html.replace(v.marker, () => block);
  console.log(`Beágyazva: ${v.label} (${(src.length / 1024).toFixed(1)} kB)`);
}

fs.writeFileSync(outPath, html, 'utf8');
console.log(`Kész: ${outPath} (${(html.length / 1024).toFixed(1)} kB)`);
