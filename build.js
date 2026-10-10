// Builds dist/ from data/site.js. Arabic at the root, English mirrored under /en/.
// Versions and file sizes are read from the real installers in each app's dist folder, so the numbers
// on the page are never stale guesses.
//   node build.js
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const HOME = path.join(ROOT, '..');
const DIST = path.join(ROOT, 'docs'); // GitHub Pages source: main branch, /docs folder
const S = require('./data/site.js');
const DL = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'downloads.json'), 'utf8'));

const LANGS = [
  { code: 'ar', dir: 'rtl', out: '', base: '', other: 'en' },
  { code: 'en', dir: 'ltr', out: 'en', base: '../', other: 'ar' },
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const t = (o, l) => esc(o[l]);

// ---------- icons: reuse the app's own 24px set rather than drawing new ones ----------
const ICONS = (() => {
  const src = fs.readFileSync(path.join(HOME, 'gyno-clinic-app', 'src', 'icons.js'), 'utf8');
  const m = src.match(/const P = \{([\s\S]*?)\n  \};/);
  if (!m) throw new Error('could not read the icon set from gyno-clinic-app/src/icons.js');
  return new Function(`return {${m[1]}}`)();
})();
const icon = (name, cls = '') => {
  const d = ICONS[name];
  if (!d) throw new Error(`icon "${name}" is not in the set`);
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
};

// ---------- installers: real versions and sizes ----------
const cmpVer = (a, b) => a.split('.').map(Number).reduce((r, n, i) => r || n - b.split('.').map(Number)[i], 0);
function installers(p) {
  const dir = path.join(HOME, p.dir, 'dist');
  const found = { version: null, files: {} };
  if (!fs.existsSync(dir)) return found;
  const re = new RegExp(`^${p.exeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (\\d+\\.\\d+\\.\\d+)(?: (x64|ia32))?\\.exe$`);
  const rows = [];
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(re);
    if (m) rows.push({ file: f, version: m[1], arch: m[2] || 'all', size: fs.statSync(path.join(dir, f)).size });
  }
  if (!rows.length) return found;
  const version = rows.map((r) => r.version).sort(cmpVer).pop();
  found.version = version;
  for (const r of rows.filter((r) => r.version === version)) found.files[r.arch] = r;
  return found;
}
const mb = (bytes) => `${Math.round(bytes / 1048576)} MB`;

// The Android build, if the product has one: newest version matching the product's apk pattern.
function apkFor(p) {
  if (!p.apk) return null;
  const dir = path.join(HOME, p.apk.dir);
  if (!fs.existsSync(dir)) return null;
  const re = new RegExp(p.apk.pattern);
  const rows = fs.readdirSync(dir).map((file) => { const m = file.match(re); return m && { file, version: m[1], full: path.join(dir, file), size: fs.statSync(path.join(dir, file)).size }; }).filter(Boolean);
  if (!rows.length) return null;
  return rows.sort((a, c) => cmpVer(a.version, c.version)).pop();
}

// Screenshots are captured per language; an English one that does not exist falls back to Arabic.
const SHOTS = path.join(ROOT, 'static', 'shots');
const shotName = (p, s, l) => (fs.existsSync(path.join(SHOTS, p.slug, `${l}-${s.f}.png`)) ? `${l}-${s.f}.png` : `ar-${s.f}.png`);
// width/height on every screenshot so the page reserves the space and nothing jumps while it loads
const pngDims = (file) => { const buf = fs.readFileSync(file); return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; };
const shotImg = (p, s, l, base, attrs = '') => {
  const name = shotName(p, s, l);
  const { w, h } = pngDims(path.join(SHOTS, p.slug, name));
  return `<img src="${base}assets/shots/${p.slug}/${name}" width="${w}" height="${h}" alt="${t(p.name, l)} - ${t(s.c, l)}"${attrs}>`;
};

function baseUrlFromGit() {
  try {
    const url = require('child_process').execSync('git remote get-url origin', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    const m = url.match(/github\.com[/:]([^/]+)\/(.+?)(?:\.git)?$/);
    return m ? `https://github.com/${m[1]}/${m[2]}/releases/download` : '';
  } catch (_) { return ''; }
}
const BASE = (DL.baseUrl && !/</.test(DL.baseUrl)) ? DL.baseUrl : baseUrlFromGit();
const configured = Boolean(BASE);
// Downloads are served from GitHub Pages (marw1x.github.io/meddesk-downloads), not GitHub Releases: a release download
// redirects to release-assets.githubusercontent.com, which is blocked on Syrian networks, while *.github.io opens.
// data/downloads.json "pages" is written by tools/publish-downloads.js with exactly what was uploaded.
const { dlName } = require('./tools/dl-names');
const PAGES = DL.pages && DL.pages.base ? DL.pages : null;
// Which installer the Pages site serves per product (100 MiB file limit): 32-bit by default, 64-bit where set.
const pagesArch = (p) => (DL.pagesArch || {})[p.slug] || 'ia32';
const pagesFile = (b) => (PAGES ? b.inst.files[pagesArch(b.p)] : b.inst.files.all);
const linkFor = (p, row) => {
  if (PAGES) {
    if (!row) return null;
    const name = dlName(p, row);
    // only link a file that is really on the downloads site: otherwise "coming soon", never a 404
    return (PAGES.files[p.slug] || []).some((f) => f.name === name) ? `${PAGES.base}/${p.slug}/${name}` : null;
  }
  if (!configured || !row) return null;
  const tag = (DL.tags || {})[p.slug];
  if (!tag) return null;
  if (!(DL.released || {})[p.slug]) return null; // not uploaded yet: show "coming soon", never a 404
  // GitHub stores an uploaded asset with every space turned into a dot ("Asnaan Setup 1.0.0.exe" -> "Asnaan.Setup.1.0.0.exe")
  return `${BASE.replace(/\/$/, '')}/${encodeURIComponent(tag)}/${encodeURIComponent(row.file.replace(/ /g, '.'))}`;
};

const waLink = (msg) => `https://wa.me/${S.brand.whatsapp.replace('+', '')}?text=${encodeURIComponent(msg)}`;

const buyMsg = (p, l) => (l === 'ar'
  ? `مرحباً، أريد شراء ترخيص برنامج ${p.name.ar}.

اسم العيادة: 
المدينة: 
رقم الهاتف: 
عدد الأجهزة: 
رمز هذا الجهاز: `
  : `Hello, I would like to buy a licence for ${p.name.en}.

Clinic name: 
City: 
Phone: 
Number of computers: 
This PC code: `);
const waGeneral = { ar: 'مرحباً، أريد معرفة المزيد عن برامج ميد ديسك', en: 'Hello, I would like to know more about MedDesk' };

// ---------- shared chrome ----------
function head(L, title, desc, base, canonicalPath, product) {
  return `<!doctype html>
<html lang="${L.code}" dir="${L.dir}"${product ? ` data-p="${product}"` : ''}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:image" content="${base}assets/logo.png">
<meta name="theme-color" content="#0e7490">
<link rel="icon" href="${base}assets/logo.png">
<link rel="alternate" hreflang="${L.other}" href="${L.code === 'ar' ? 'en/' : '../'}${canonicalPath}">
<link rel="stylesheet" href="${base}styles.css">
</head>
<body>`;
}

function nav(L, base) {
  const u = S.ui;
  const swapHref = L.code === 'ar' ? `en/${L.page}` : `../${L.page}`;
  return `<header class="nav"><div class="wrap">
  <a class="nav-brand" href="${base}index.html"><img src="${base}assets/logo.png" alt="">${t(S.brand.name, L.code)}</a>
  <nav class="nav-links">
    <a href="${base}index.html#products">${t(u.navProducts, L.code)}</a>
    <a href="${base}index.html#why" data-secondary>${t(u.navWhy, L.code)}</a>
    <a href="${base}index.html#install" data-secondary>${t(u.navInstall, L.code)}</a>
    <a href="${base}index.html#android-install" data-secondary>${t(u.navAndroid, L.code)}</a>
    <a href="${base}tutorials.html">${t(u.navTutorials, L.code)}</a>
    <a href="${base}index.html#faq" data-secondary>${t(u.navHelp, L.code)}</a>
  </nav>
  <a class="lang" href="${swapHref}" hreflang="${L.other}">${t(u.langSwitch, L.code)}</a>
</div></header>`;
}

function footer(L, base) {
  const year = new Date().getFullYear();
  return `<footer><div class="wrap">
  <span>${t(S.ui.footerNote, L.code)}</span>
  <span>© <span class="num">${year}</span> ${t(S.brand.name, L.code)} · <a href="${waLink(waGeneral[L.code])}" target="_blank" rel="noopener">WhatsApp <span class="num">${S.brand.whatsapp}</span></a></span>
</div></footer>
</body></html>`;
}

function stepsHtml(L, list = S.steps, cls = '') {
  return `<div class="steps${cls}">${list.map((s, i) => `
    <div class="step"><span class="n num">${i + 1}</span>
      <h3>${t(s.t, L.code)}</h3><p>${t(s.b, L.code)}</p></div>`).join('')}</div>`;
}

// The Android install guide, on the home page and on every product page that has an Android app.
function androidGuide(L) {
  const l = L.code, u = S.ui;
  return `
  <section id="android-install"><div class="wrap">
    <div class="sec-head"><h2>${t(u.androidInstallTitle, l)}</h2><p>${t(u.androidInstallBody, l)}</p></div>
    ${stepsHtml(L, S.androidSteps, ' four')}
    <p class="anote">${icon('phone')}<span>${t(u.androidNote, l)}</span></p>
  </div></section>
`;
}

// ---------- tutorials ----------
// One short video per app (rendered by marketing-kit/reels, hosted next to the installers). Each section has an id
// = the product slug, so a link like tutorials.html#asnaan opens straight on that app's video.
const TUT_BASE = 'https://marw1x.github.io/meddesk-downloads/tutorials';
const SITE_URL = 'https://marw1x.github.io/meddesk';
function tutorialsPage(L) {
  const l = L.code, u = S.ui, base = L.base;
  const title = `${t(u.tutTitle, l)} - ${S.brand.name[l]}`;
  return head(L, title, u.tutBody[l], base, 'tutorials.html') + nav(L, base) + `
<main>
  <section><div class="wrap">
    <div class="sec-head"><h2>${t(u.tutTitle, l)}</h2><p>${t(u.tutBody, l)}</p></div>
    <div class="tuts">${S.products.map((p) => {
      const page = `${SITE_URL}/${l === 'ar' ? '' : 'en/'}tutorials.html#${p.slug}`;
      const msg = u.tutShareMsg[l].replace('{name}', p.name[l]) + '\n' + page;
      return `
      <article class="tut" id="${p.slug}" data-p="${p.slug}">
        <div class="tut-head"><img src="${base}assets/logos/${p.slug}.png" alt=""><div><h3>${t(p.name, l)}</h3><div class="aud">${t(p.audience, l)}</div></div></div>
        <video controls playsinline preload="none" poster="${base}assets/tutorials/${p.slug}.jpg" src="${TUT_BASE}/${p.slug}.mp4"></video>
        <div class="tut-actions">
          <a class="btn btn-ghost" href="${TUT_BASE}/${p.slug}.mp4" download>${icon('download')}${t(u.tutDownload, l)}</a>
          <a class="btn btn-ghost" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${icon('whatsapp')}${t(u.tutShare, l)}</a>
        </div>
      </article>`;
    }).join('')}</div>
    <p class="anote">${icon('whatsapp')}<span>${t(u.tutHelp, l)} <a href="${waLink(waGeneral[l])}" target="_blank" rel="noopener"><span class="num">${S.brand.whatsapp}</span></a></span></p>
  </div></section>
</main>` + footer(L, base);
}

// ---------- home ----------
function homePage(L, built) {
  const l = L.code, u = S.ui, base = L.base;
  const hero = built['asnaan'];
  const title = `${S.brand.name[l]} - ${S.brand.tagline[l]}`;
  return head(L, title, S.ui.heroBody[l], base, 'index.html') + nav(L, base) + `
<main>
  <section class="hero"><div class="wrap"><div class="hero-grid">
    <div>
      <h1>${t(u.heroTitle, l)}</h1>
      <p>${t(u.heroBody, l)}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#products">${icon('download')}${t(u.heroCta, l)}</a>
        <a class="btn btn-ghost" href="${waLink(waGeneral[l])}" target="_blank" rel="noopener">${icon('whatsapp')}${t(u.heroCta2, l)}</a>
      </div>
    </div>
    <div class="hero-shot">${shotImg(hero.p, hero.p.shots[0], l, base, ' fetchpriority="high"')}</div>
  </div></div></section>

  <section id="products"><div class="wrap">
    <div class="sec-head"><h2>${t(u.productsTitle, l)}</h2><p>${t(u.productsBody, l)}</p></div>
    <div class="products">${S.products.map((p) => `
      <a class="pcard" data-p="${p.slug}" href="${base}${p.slug}.html">
        <div class="pcard-top"><img style="view-transition-name:mark-${p.slug}" src="${base}assets/logos/${p.slug}.png" alt="">
          <div><h3>${t(p.name, l)}</h3><div class="aud">${t(p.audience, l)}</div></div></div>
        <div class="pshot">${shotImg(p, p.shots[0], l, base, ' loading="lazy"')}</div>
        <p>${t(p.blurb, l)}</p>
        <span class="go">${t(u.openProduct, l)}${icon(l === 'ar' ? 'chevronLeft' : 'chevronRight')}</span>
      </a>`).join('')}</div>
  </div></section>

  <section id="why"><div class="wrap">
    <div class="sec-head"><h2>${t(u.whyTitle, l)}</h2></div>
    <div class="why-grid">${S.why.map((w) => `
      <div>${icon(w.icon)}<h3>${t(w.t, l)}</h3><p>${t(w.b, l)}</p></div>`).join('')}</div>
  </div></section>

  <section id="install"><div class="wrap">
    <div class="sec-head"><h2>${t(u.installTitle, l)}</h2><p>${t(u.installBody, l)}</p></div>
    ${stepsHtml(L)}
  </div></section>
${androidGuide(L)}
  <section id="faq"><div class="wrap">
    <div class="sec-head"><h2>${t(u.faqTitle, l)}</h2></div>
    <div class="faq">${S.faq.map((f) => `
      <details><summary>${t(f.q, l)}${icon('chevronDown')}</summary><p>${t(f.a, l)}</p></details>`).join('')}</div>
  </div></section>

  <section class="cta"><div class="wrap">
    <div><h2>${t(u.ctaTitle, l)}</h2><p>${t(u.ctaBody, l)}</p></div>
    <a class="btn btn-wa" href="${waLink(waGeneral[l])}" target="_blank" rel="noopener">${icon('whatsapp')}<span class="num">${S.brand.whatsapp}</span></a>
  </div></section>
</main>` + footer(L, base);
}

// ---------- product page ----------
function productPage(L, b, built) {
  const l = L.code, u = S.ui, base = L.base, p = b.p;
  // Served from GitHub Pages (100 MiB file limit): the 32-bit installer (also runs on 64-bit Windows), or the 64-bit
  // one for products listed in pagesArch. Without the Pages host, fall back to the unified installer on GitHub Releases.
  const x64 = pagesFile(b);
  const href64 = linkFor(p, x64);
  const waMsg = { ar: `مرحباً، أريد تجربة برنامج ${p.name.ar}`, en: `Hello, I would like to try ${p.name.en}` }[l];
  const title = `${p.name[l]} - ${p.audience[l]} | ${S.brand.name[l]}`;

  const dlbox = `<div class="dlbox">
    <div class="meta">
      ${b.inst.version ? `<div>${t(u.version, l)}<strong class="num">${b.inst.version}</strong></div>` : ''}
      ${x64 ? `<div>${t(u.size, l)}<strong class="num">${mb(x64.size)}</strong></div>` : ''}
    </div>
    ${href64
      ? `<a class="btn btn-primary" href="${href64}" download>${icon('download')}${t(u.downloadFor, l)}</a>`
      : `<span class="btn" aria-disabled="true">${t(u.notReady, l)}</span>`}
    <div class="trial">${t(u.trialNote, l)}</div>
    ${b.apk ? `<div class="android">
      ${linkFor(p, b.apk)
        ? `<a class="btn btn-ghost" href="${linkFor(p, b.apk)}" download>${icon('phone')}${t(u.androidCta, l)}<span class="num sz">${mb(b.apk.size)}</span></a>`
        : `<span class="btn" aria-disabled="true">${icon('phone')}${t(u.androidCta, l)}</span>`}
      <p>${t(u.androidHint, l)}</p>
      <a class="how" href="#android-install">${icon('help')}${t(u.androidHow, l)}</a>
    </div>` : ''}
    <div class="buy">
      <a class="btn btn-ghost" href="${waLink(buyMsg(p, l))}" target="_blank" rel="noopener">${icon('key')}${t(u.buyCta, l)}</a>
      <p>${t(u.buyHint, l)}</p>
    </div>
    ${!href64 ? `<div class="alt"><a href="${waLink(waMsg)}" target="_blank" rel="noopener">${t(u.heroCta2, l)}</a></div>` : ''}
  </div>`;

  const reqs = [...(PAGES && pagesArch(p) === 'x64' ? S.winReq64[l] : S.winReq[l]), ...(p.extraReq ? p.extraReq[l] : [])];

  return head(L, title, p.blurb[l], base, `${p.slug}.html`, p.slug) + nav(L, base) + `
<main>
  <div class="wrap crumb"><a href="${base}index.html">${icon(l === 'ar' ? 'arrowRight' : 'arrowLeft')}${t(u.backHome, l)}</a></div>

  <div class="wrap"><div class="phead">
    <div>
      <img class="logo" style="view-transition-name:mark-${p.slug}" src="${base}assets/logos/${p.slug}.png" alt="">
      <h1>${t(p.name, l)}</h1>
      <div class="aud">${t(p.audience, l)}</div>
      <p class="blurb">${t(p.blurb, l)}</p>
      <div class="req">${reqs.map((r) => `<span>${esc(r)}</span>`).join('')}</div>
    </div>
    ${dlbox}
  </div></div>

  <section><div class="wrap">
    <div class="sec-head"><h2>${t(u.screenshots, l)}</h2></div>
  </div>
  <div class="wrap"><div class="gallery">${p.shots.map((s, i) => `
    <figure>${shotImg(p, s, l, base, i === 0 ? '' : ' loading="lazy"')}
      <figcaption>${t(s.c, l)}</figcaption></figure>`).join('')}</div></div>
  </section>

  <section><div class="wrap">
    <div class="sec-head"><h2>${t(u.features, l)}</h2></div>
    <div class="feats">${p.features.map((f) => `
      <div class="feat">${icon(f.icon)}<div><h3>${t(f.t, l)}</h3><p>${t(f.b, l)}</p></div></div>`).join('')}</div>
  </div></section>

  <section><div class="wrap">
    <div class="sec-head"><h2>${t(u.installTitle, l)}</h2><p>${t(u.installBody, l)}</p></div>
    ${stepsHtml(L)}
  </div></section>
${b.apk ? androidGuide(L) : ''}
  <section><div class="wrap">
    <div class="sec-head"><h2>${t(u.otherProducts, l)}</h2></div>
    <div class="others">${S.products.filter((o) => o.slug !== p.slug).map((o) => `
      <a class="ocard" data-p="${o.slug}" href="${base}${o.slug}.html"><img src="${base}assets/logos/${o.slug}.png" alt="">
        <span><b>${t(o.name, l)}</b><span>${t(o.audience, l)}</span></span></a>`).join('')}</div>
  </div></section>

  <section class="cta"><div class="wrap">
    <div><h2>${t(u.ctaTitle, l)}</h2><p>${t(u.ctaBody, l)}</p></div>
    <a class="btn btn-wa" href="${waLink(waMsg)}" target="_blank" rel="noopener">${icon('whatsapp')}<span class="num">${S.brand.whatsapp}</span></a>
  </div></section>
</main>` + footer(L, base);
}

// ---------- assets ----------
function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyAssets(built) {
  const A = path.join(DIST, 'assets');
  const fontSrc = path.join(HOME, 'dental-app', 'promo', 'ad', 'public', 'fonts');
  for (const f of ['PlexArabic-400.woff2', 'PlexArabic-500.woff2', 'PlexArabic-600.woff2', 'PlexArabic-700.woff2']) {
    copy(path.join(fontSrc, f), path.join(A, 'fonts', f));
  }
  copy(path.join(ROOT, 'static', 'logo.png'), path.join(A, 'logo.png')); // the site keeps its own copy of the MedDesk mark
  for (const b of built) {
    const small = path.join(ROOT, 'static', 'logos', `${b.p.slug}.png`); // 192px copies from tools/make-logos.js
    copy(fs.existsSync(small) ? small : path.join(HOME, b.p.logo), path.join(A, 'logos', `${b.p.slug}.png`));
    for (const f of fs.readdirSync(path.join(SHOTS, b.p.slug))) copy(path.join(SHOTS, b.p.slug, f), path.join(A, 'shots', b.p.slug, f));
  }
  copy(path.join(ROOT, 'static', 'styles.css'), path.join(DIST, 'styles.css'));
  for (const b of built) { const pst = path.join(ROOT, 'static', 'tutorials', `${b.p.slug}.jpg`); if (fs.existsSync(pst)) copy(pst, path.join(A, 'tutorials', `${b.p.slug}.jpg`)); }
  // old URLs of retired pages forward to their replacement instead of a 404
  copy(path.join(ROOT, 'static', 'redirects', 'clinic-manager.html'), path.join(DIST, 'clinic-manager.html'));
  copy(path.join(ROOT, 'static', 'redirects', 'en', 'clinic-manager.html'), path.join(DIST, 'en', 'clinic-manager.html'));
}

// ---------- run ----------
const built = S.products.map((p) => ({ p, inst: installers(p), apk: apkFor(p) }));
const byslug = Object.fromEntries(built.map((b) => [b.p.slug, b]));

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
copyAssets(built);

for (const L of LANGS) {
  const dir = L.out ? path.join(DIST, L.out) : DIST;
  fs.mkdirSync(dir, { recursive: true });
  L.page = 'index.html';
  fs.writeFileSync(path.join(dir, 'index.html'), homePage(L, byslug), 'utf8');
  L.page = 'tutorials.html';
  fs.writeFileSync(path.join(dir, 'tutorials.html'), tutorialsPage(L), 'utf8');
  for (const b of built) {
    L.page = `${b.p.slug}.html`;
    fs.writeFileSync(path.join(dir, `${b.p.slug}.html`), productPage(L, b, byslug), 'utf8');
  }
}

// a tiny redirect for anyone landing on /en without the slash
fs.writeFileSync(path.join(DIST, 'robots.txt'), 'User-agent: *\nAllow: /\n', 'utf8');
// tells GitHub Pages to serve the folder as-is instead of running it through Jekyll
fs.writeFileSync(path.join(DIST, '.nojekyll'), '', 'utf8');

// The exact upload list, so the release step is copy-and-match rather than guesswork.
const lines = ['# Files to upload, and the release tag each one belongs to', '',
  'Generated by build.js. Re-run it after building new installers.', '',
  'The site links to the copies on https://marw1x.github.io/meddesk-downloads/ (32-bit installer + APK),',
  'published with `node tools/publish-downloads.js`, because GitHub Releases downloads are blocked in Syria.',
  'The unified installers below stay on GitHub Releases for anyone outside Syria (`node release.js`).', ''];
for (const b of built) {
  const tag = (DL.tags || {})[b.p.slug] || '(no tag set in data/downloads.json)';
  lines.push(`## ${b.p.name.en} - tag: ${tag}`);
  if (!b.inst.version) { lines.push('', '  No installer found. Run `npm run dist` in ' + b.p.dir + ' first.', ''); continue; }
  lines.push('', `  from  ${path.join(HOME, b.p.dir, 'dist')}`, '');
  if (b.inst.files.all) lines.push(`  [win] ${b.inst.files.all.file}   (${mb(b.inst.files.all.size)})   32- and 64-bit in one`);
  if (b.apk) lines.push(`  [apk] ${b.apk.file}   (${mb(b.apk.size)})   from ${path.join(HOME, b.p.apk.dir)}`);
  if (tag.includes('.') && !tag.endsWith(b.inst.version)) {
    lines.push('', `  WARNING: the tag says a different version than the installer (${b.inst.version}).`);
  }
  lines.push('');
}
fs.writeFileSync(path.join(ROOT, 'upload-list.md'), lines.join('\n'), 'utf8');

console.log('docs/ built');
for (const b of built) {
  const v = b.inst.version || '(no installer found)';
  const win = pagesFile(b);
  const state = (row) => (linkFor(b.p, row) ? 'linked' : 'NOT UPLOADED - run node tools/publish-downloads.js');
  const files = win ? `win ${mb(win.size)} ${state(win)}${b.apk ? `, apk ${mb(b.apk.size)} ${state(b.apk)}` : ''}` : '-';
  const tag = (DL.tags || {})[b.p.slug] || '';
  const warn = b.inst.version && tag.includes('.') && !tag.endsWith(b.inst.version) ? '  <- tag/version mismatch' : '';
  console.log(`  ${b.p.slug.padEnd(15)} ${String(v).padEnd(10)} ${files}${warn}`);
}
if (!configured) {
  console.log('\n  NOTE: no GitHub remote yet, and no baseUrl in data/downloads.json, so the download');
  console.log('        buttons render as "coming soon" instead of dead links. See LIVE.md.');
} else {
  console.log(`\n  downloads -> ${PAGES ? PAGES.base : BASE}`);
}
