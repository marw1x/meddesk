// The product marks ship at 800px and 100-260 KB each, but the site shows them at 40-76px.
// This writes 192px copies (2x the largest display size) into static/logos/, which build.js uses.
// Re-run after a product logo changes:  ..\xray-desk\node_modules\.bin\electron tools\make-logos.js
const { app, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

const HOME = path.join(__dirname, '..', '..');
const OUT = path.join(__dirname, '..', 'static', 'logos');
const S = require('../data/site.js');

app.whenReady().then(() => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const p of S.products) {
    const src = path.join(HOME, p.logo);
    const img = nativeImage.createFromPath(src);
    if (img.isEmpty()) { console.log('SKIP (unreadable)', p.slug, src); continue; }
    const out = path.join(OUT, `${p.slug}.png`);
    fs.writeFileSync(out, img.resize({ width: 192, height: 192, quality: 'best' }).toPNG());
    console.log(p.slug.padEnd(12), (fs.statSync(src).size / 1024).toFixed(0) + ' KB ->', (fs.statSync(out).size / 1024).toFixed(0) + ' KB');
  }
  app.exit(0);
});
