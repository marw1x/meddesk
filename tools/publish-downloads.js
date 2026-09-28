// Publishes the installers to https://marw1x.github.io/meddesk-downloads/ (repo marw1x/meddesk-downloads, GitHub Pages).
//
// Why not GitHub Releases: a release download redirects to release-assets.githubusercontent.com, which is blocked
// on Syrian networks, while *.github.io (the website itself) opens fine. So the files are served from GitHub Pages.
// Pages refuses any file over 100 MiB, so Windows gets the 32-bit installer (79-98 MB; it runs on 64-bit Windows
// too) instead of the 170-190 MB unified one. Android gets its APK as-is.
//
//   node tools/publish-downloads.js          publish every product's newest files — only what changed is uploaded
//   node tools/publish-downloads.js --dry    show what would go up
//   node tools/publish-downloads.js --nopush prepare and list the changes, upload nothing
//   node tools/publish-downloads.js --fresh  wipe the history and upload everything again (to shrink the repo)
//
// A normal run fetches only the repo's list of files (no file contents), lays the new files on top and pushes:
// git sees that unchanged installers have the same content as before and does not send them again. Each release
// does add its new files to the repo's history; when the repo grows large (GitHub prefers under ~1 GB) the run says
// so, and one --fresh run starts the history over.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { dlName } = require('./dl-names');

const ROOT = path.join(__dirname, '..');
const HOME = path.join(ROOT, '..');
const STAGE = path.join(HOME, 'meddesk-downloads'); // working copy, outside the website repo
const REPO = 'marw1x/meddesk-downloads';
const BASE = 'https://marw1x.github.io/meddesk-downloads';
const LIMIT = 100 * 1048576; // GitHub rejects any file over 100 MiB
const S = require(path.join(ROOT, 'data', 'site.js'));
const dry = process.argv.includes('--dry');
const fresh = process.argv.includes('--fresh');
const noPush = process.argv.includes('--nopush'); // prepare and show the changes, upload nothing

const GH = ['gh', 'C:\\Program Files\\GitHub CLI\\gh.exe'].find((c) => { try { execFileSync(c, ['--version'], { stdio: 'ignore' }); return true; } catch (_) { return false; } });
const gh = (a) => (execFileSync(GH, a, { stdio: 'pipe' }) || '').toString().trim();
const git = (a) => execFileSync('git', a, { cwd: STAGE, stdio: 'pipe' }).toString().trim();
const cmpVer = (a, b) => a.split('.').map(Number).reduce((r, n, i) => r || n - b.split('.').map(Number)[i], 0);
const mb = (n) => `${Math.round(n / 1048576)} MB`;

// newest 32-bit installer, and newest APK, per product
function pick(p) {
  const out = [];
  const dir = path.join(HOME, p.dir, 'dist');
  const re = new RegExp(`^${p.exeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (\\d+\\.\\d+\\.\\d+) ia32\\.exe$`);
  const exes = fs.existsSync(dir) ? fs.readdirSync(dir).map((f) => { const m = f.match(re); return m && { file: f, version: m[1], full: path.join(dir, f) }; }).filter(Boolean) : [];
  if (exes.length) out.push(exes.sort((a, b) => cmpVer(a.version, b.version)).pop());
  if (p.apk) {
    const adir = path.join(HOME, p.apk.dir);
    const are = new RegExp(p.apk.pattern);
    const apks = fs.existsSync(adir) ? fs.readdirSync(adir).map((f) => { const m = f.match(are); return m && { file: f, version: m[1], full: path.join(adir, f) }; }).filter(Boolean) : [];
    if (apks.length) out.push(apks.sort((a, b) => cmpVer(a.version, b.version)).pop());
  }
  return out;
}

const plan = S.products.map((p) => ({ p, files: pick(p).map((r) => ({ ...r, name: dlName(p, r), size: fs.statSync(r.full).size })) }));
let total = 0, tooBig = 0;
for (const { p, files } of plan) {
  console.log(p.name.en);
  for (const f of files) {
    total += f.size;
    const over = f.size >= LIMIT;
    if (over) tooBig++;
    console.log(`  ${p.slug}/${f.name}  ${mb(f.size)}${over ? '   TOO BIG for GitHub Pages (100 MiB)' : ''}`);
  }
}
console.log(`\n${mb(total)} in total -> ${BASE}/`);
if (tooBig) { console.error('\nAborted: a file is over 100 MiB.'); process.exit(1); }
if (dry) process.exit(0);

let exists = true;
try { gh(['repo', 'view', REPO]); } catch (_) { exists = false; }
if (!exists) {
  console.log(`creating ${REPO} ...`);
  gh(['repo', 'create', REPO, '--public', '--description', 'MedDesk installers, served from GitHub Pages']);
}
// staging folder: the repo's current commit without any file contents (a few KB), or a new empty repo
fs.rmSync(STAGE, { recursive: true, force: true });
let incremental = false;
if (exists && !fresh) {
  try {
    execFileSync('git', ['clone', '-q', '--filter=blob:none', '--depth', '1', '--no-checkout', `https://github.com/${REPO}.git`, STAGE], { stdio: 'pipe' });
    git(['rm', '-r', '-q', '--cached', '--ignore-unmatch', '.']); // start from nothing; what is laid down below is the new content
    incremental = true;
  } catch (e) { console.log('could not fetch the current files list; uploading everything'); fs.rmSync(STAGE, { recursive: true, force: true }); }
}
if (!incremental) fs.mkdirSync(STAGE, { recursive: true });
const manifest = {};
for (const { p, files } of plan) {
  fs.mkdirSync(path.join(STAGE, p.slug), { recursive: true });
  manifest[p.slug] = files.map((f) => ({ name: f.name, version: f.version, size: f.size }));
  for (const f of files) fs.copyFileSync(f.full, path.join(STAGE, p.slug, f.name));
}
fs.writeFileSync(path.join(STAGE, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(STAGE, '.nojekyll'), '');
fs.writeFileSync(path.join(STAGE, 'index.html'),
  '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=https://marw1x.github.io/meddesk/"><title>MedDesk</title><a href="https://marw1x.github.io/meddesk/">MedDesk</a>\n');

if (!incremental) git(['init', '-q', '-b', 'main']);
git(['config', 'user.name', 'marw1x']);
git(['config', 'user.email', '148047958+marw1x@users.noreply.github.com']);
git(['add', '-A']);
const changed = git(['diff', '--cached', '--name-status', '--no-renames']).split('\n').filter(Boolean);
if (incremental && !changed.length) { console.log('\nnothing changed: every file is already online.'); }
else {
  if (incremental) console.log('\nchanged:\n' + changed.map((l) => '  ' + l.replace(/\t/g, '  ')).join('\n'));
  git(['commit', '-q', '-m', `Installers ${new Date().toISOString().slice(0, 10)}`]);
  if (!incremental) git(['remote', 'add', 'origin', `https://github.com/${REPO}.git`]);
  const upload = incremental ? changed.filter((l) => /^[AM]/.test(l)).map((l) => l.split('\t').pop()).reduce((a, f) => a + fs.statSync(path.join(STAGE, f)).size, 0) : total;
  console.log(`pushing about ${mb(upload)} (this is the long part) ...`);
  if (noPush) { console.log('--nopush: stopping here.'); process.exit(0); }
  execFileSync('git', ['push', ...(incremental ? [] : ['-f']), '-u', 'origin', 'main'], { cwd: STAGE, stdio: 'inherit' });
}
try { const kb = Number(gh(['api', `repos/${REPO}`, '--jq', '.size'])); if (kb > 800 * 1024) console.log(`\nnote: the downloads repo holds ${mb(kb * 1024)} of history; run once with --fresh to start it over.`); } catch (_) { /* only a hint */ }

// GitHub Pages from main / (first run only; later runs just redeploy)
try { gh(['api', `repos/${REPO}/pages`]); } catch (_) {
  gh(['api', '-X', 'POST', `repos/${REPO}/pages`, '-f', 'source[branch]=main', '-f', 'source[path]=/']);
  console.log('GitHub Pages enabled');
}

// tell the website build where the files are
const dlFile = path.join(ROOT, 'data', 'downloads.json');
const DL = JSON.parse(fs.readFileSync(dlFile, 'utf8'));
DL.pages = { base: BASE, files: manifest };
fs.writeFileSync(dlFile, JSON.stringify(DL, null, 2) + '\n');
console.log(`\ndone. Pages takes a minute or two to deploy; then run  node build.js  and publish the site.`);
