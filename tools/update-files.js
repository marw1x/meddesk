// The files the apps read to update themselves over the internet, laid next to the installers by
// publish-downloads.js (for products with `updates: true` in data/site.js):
//
//   <slug>/latest.yml                    the newest Windows installer in electron-updater's format
//   <slug>/<installer>.exe.blockmap      one per recent version: lets a PC fetch only the parts that changed
//   updates/<slug>.json                  { payload, sig } — the newest Windows and Android versions with their
//                                        SHA-512, signed with the MedDesk update key. The apps refuse anything
//                                        without a valid signature, so only this PC can offer an update.
//
// The key (update-signing-key.pem) lives outside every repo: C:\Users\Marwan\meddesk-keys, or MEDDESK_UPDATE_KEY.
// Without it no updates/<slug>.json is written and installed apps simply see nothing new.
//
// minHost (per platform): the oldest main-device version this update can work with. A device that follows another
// one (reception) waits only until the main device runs at least that. Default: the same major.minor line (x.y.0), so
// patch releases never hold anyone back; set "minHost": { "<slug>": "1.2.0" } in data/downloads.json when a release
// changes what the devices say to each other.
//
// Holding an update back: put the product's slug in "updateHold" in data/downloads.json. Its installer still goes
// on the site for new customers, but installed apps are told there is nothing new.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const KEY = process.env.MEDDESK_UPDATE_KEY || 'C:/Users/Marwan/meddesk-keys/update-signing-key.pem';
const KEEP_BLOCKMAPS = 8;
const sha512 = (file) => { const h = crypto.createHash('sha512'); const fd = fs.openSync(file, 'r'); const b = Buffer.alloc(8 << 20); let n; while ((n = fs.readSync(fd, b, 0, b.length, null)) > 0) h.update(b.subarray(0, n)); fs.closeSync(fd); return h.digest('base64'); };
const cmpVer = (a, b) => a.split('.').map(Number).reduce((r, n, i) => r || n - b.split('.').map(Number)[i], 0);

function layUpdateFiles(p, files, stage, root) {
  const out = path.join(stage, p.slug);
  const exe = files.find((f) => /\.exe$/i.test(f.name));
  const apk = files.find((f) => /\.apk$/i.test(f.name));
  const dlCfg = JSON.parse(fs.readFileSync(path.join(root, 'data', 'downloads.json'), 'utf8'));
  const minHostFor = (v) => (dlCfg.minHost && dlCfg.minHost[p.slug]) || v.split('.').slice(0, 2).concat('0').join('.');
  const payload = { product: p.slug, date: new Date().toISOString() };
  if (exe) {
    const sha = sha512(exe.full);
    payload.win = { version: exe.version, file: exe.name, sha512: sha, size: exe.size, minHost: minHostFor(exe.version) };
    fs.writeFileSync(path.join(out, 'latest.yml'),
      `version: ${exe.version}\nfiles:\n  - url: ${exe.name}\n    sha512: ${sha}\n    size: ${exe.size}\npath: ${exe.name}\nsha512: ${sha}\nreleaseDate: '${payload.date}'\n`);
    // blockmaps: this version's (built next to the installer) is kept in data/blockmaps for later updates to diff against
    const arch = path.join(root, 'data', 'blockmaps', p.slug); fs.mkdirSync(arch, { recursive: true });
    const bm = exe.full + '.blockmap';
    if (fs.existsSync(bm)) fs.copyFileSync(bm, path.join(arch, exe.name + '.blockmap'));
    else console.log(`  note: no blockmap next to ${path.basename(exe.full)} — PCs will download the whole installer`);
    // also any older ones still in the product's dist folder
    const re = new RegExp(`^${p.exeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (\\d+\\.\\d+\\.\\d+) ia32\\.exe\\.blockmap$`);
    const dist = path.join(root, '..', p.dir, 'dist');
    for (const f of fs.existsSync(dist) ? fs.readdirSync(dist) : []) { const m = f.match(re); if (m) { const name = exe.name.replace(exe.version, m[1]) + '.blockmap'; if (!fs.existsSync(path.join(arch, name))) fs.copyFileSync(path.join(dist, f), path.join(arch, name)); } }
    const verOf = (n) => (n.match(/(\d+\.\d+\.\d+)/) || [])[1] || '0.0.0';
    const kept = fs.readdirSync(arch).filter((n) => n.endsWith('.blockmap')).sort((a, b) => cmpVer(verOf(a), verOf(b)));
    for (const n of kept.slice(0, Math.max(0, kept.length - KEEP_BLOCKMAPS))) fs.rmSync(path.join(arch, n));
    for (const n of kept.slice(-KEEP_BLOCKMAPS)) fs.copyFileSync(path.join(arch, n), path.join(out, n));
  }
  // md5: the tablets check it natively (fast); Android also insists the APK carries the app's own signing key
  if (apk) payload.android = { version: apk.version, file: apk.name, sha512: sha512(apk.full), md5: crypto.createHash('md5').update(fs.readFileSync(apk.full)).digest('hex'), size: apk.size, minHost: minHostFor(apk.version) };

  const dl = JSON.parse(fs.readFileSync(path.join(root, 'data', 'downloads.json'), 'utf8'));
  if ((dl.updateHold || []).includes(p.slug)) { delete payload.win; delete payload.android; payload.hold = true; }
  if (!fs.existsSync(KEY)) { console.log(`  note: update key not found (${KEY}) — no update offered for ${p.slug}`); return null; }
  const text = JSON.stringify(payload);
  const sig = crypto.sign('sha256', Buffer.from(text, 'utf8'), crypto.createPrivateKey(fs.readFileSync(KEY))).toString('base64');
  fs.mkdirSync(path.join(stage, 'updates'), { recursive: true });
  fs.writeFileSync(path.join(stage, 'updates', `${p.slug}.json`), JSON.stringify({ payload: text, sig }, null, 1) + '\n');
  return payload.hold ? 'held back' : `offered: ${[payload.win && 'PC ' + payload.win.version, payload.android && 'Android ' + payload.android.version].filter(Boolean).join(', ')}`;
}

module.exports = { layUpdateFiles };
