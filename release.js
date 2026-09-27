// Creates (or updates) one GitHub release per product and uploads its installers, using the gh CLI.
// Run after `gh auth login` and after the repo has an origin remote.
//
//   node release.js                  upload every product
//   node release.js asnaan gynodesk  only these
//   node release.js --dry            show what would happen, upload nothing
//
// Safe to re-run: an existing release is reused and files are replaced with --clobber.
const { execFileSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const HOME = path.join(ROOT, '..');
const S = require('./data/site.js');
const DL = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'downloads.json'), 'utf8'));

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const only = args.filter((a) => !a.startsWith('--'));

// gh is installed to Program Files and may not be on PATH in this shell yet
const GH = ['gh', 'C:\\Program Files\\GitHub CLI\\gh.exe'].find((c) => {
  try { execFileSync(c, ['--version'], { stdio: 'ignore' }); return true; } catch (_) { return false; }
});
if (!GH) {
  console.error('gh not found. Install it with:  winget install GitHub.cli');
  process.exit(1);
}
const gh = (a, opts = {}) => execFileSync(GH, a, { stdio: 'pipe', ...opts }).toString().trim();

try { gh(['auth', 'status']); } catch (_) {
  console.error('Not signed in to GitHub. Run:  gh auth login');
  process.exit(1);
}

let repo;
try {
  repo = JSON.parse(gh(['repo', 'view', '--json', 'nameWithOwner'], { cwd: ROOT })).nameWithOwner;
} catch (_) {
  console.error('No GitHub repo for this folder yet. See LIVE.md step 2.');
  process.exit(1);
}
console.log(`repo: ${repo}${dry ? '   (dry run)' : ''}\n`);

const cmpVer = (a, b) => a.split('.').map(Number).reduce((r, n, i) => r || n - b.split('.').map(Number)[i], 0);
const mb = (n) => `${Math.round(n / 1048576)} MB`;

function installers(p) {
  const dir = path.join(HOME, p.dir, 'dist');
  if (!fs.existsSync(dir)) return { version: null, files: [] };
  const re = new RegExp(`^${p.exeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (\\d+\\.\\d+\\.\\d+)(?: (x64|ia32))?\\.exe$`);
  const rows = [];
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(re);
    if (m) rows.push({ file: f, version: m[1], arch: m[2] || 'all', full: path.join(dir, f) });
  }
  if (!rows.length) return { version: null, files: [] };
  const version = rows.map((r) => r.version).sort(cmpVer).pop();
  // only x64 and ia32 go up; the combined installer is the sum of the two and nobody needs it
  const files = rows.filter((r) => r.version === version && r.arch !== 'all');
  // the Android build ships in the same release when there is one for this version
  if (p.apk) {
    const dir = path.join(HOME, p.apk.dir);
    const re = new RegExp(p.apk.pattern);
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        const m = f.match(re);
        if (m && m[1] === version) files.push({ file: f, version, arch: 'apk', full: path.join(dir, f) });
      }
    }
  }
  return { version, files };
}

let failed = 0;
for (const p of S.products) {
  if (only.length && !only.includes(p.slug)) continue;
  const tag = (DL.tags || {})[p.slug];
  const inst = installers(p);
  console.log(`${p.name.en}  [${tag || 'NO TAG'}]`);

  if (!tag) { console.log('  skipped: no tag in data/downloads.json\n'); failed++; continue; }
  if (!inst.version) { console.log(`  skipped: no installer in ${p.dir}\\dist - run npm run dist there first\n`); failed++; continue; }
  if (!tag.endsWith(inst.version)) {
    console.log(`  skipped: tag says a different version than the installer (${inst.version}).`);
    console.log('           Fix the tag in data/downloads.json first.\n');
    failed++; continue;
  }

  let exists = true;
  try { gh(['release', 'view', tag, '--repo', repo]); } catch (_) { exists = false; }

  const total = inst.files.reduce((n, f) => n + fs.statSync(f.full).size, 0);
  for (const f of inst.files) console.log(`  ${f.arch.padEnd(5)} ${f.file}  ${mb(fs.statSync(f.full).size)}`);
  console.log(`  ${exists ? 'release exists, replacing files' : 'creating release'} - ${mb(total)} to upload`);

  if (dry) { console.log(''); continue; }

  try {
    if (!exists) {
      gh(['release', 'create', tag, '--repo', repo, '--title', `${p.name.en} ${inst.version}`,
        '--notes', `${p.name.en} ${inst.version} - ${p.audience.en}.\n\nDownload the x64 build unless the PC is old, in which case use ia32 (32-bit).`,
        ...inst.files.map((f) => f.full)], { stdio: 'inherit' });
    } else {
      gh(['release', 'upload', tag, '--repo', repo, '--clobber', ...inst.files.map((f) => f.full)], { stdio: 'inherit' });
    }
    // mark it released so build.js starts emitting a real link for this product
    const cur = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'downloads.json'), 'utf8'));
    cur.released = cur.released || {};
    cur.released[p.slug] = true;
    fs.writeFileSync(path.join(ROOT, 'data', 'downloads.json'), JSON.stringify(cur, null, 2) + '\n');
    console.log('  done, link enabled\n');
  } catch (e) {
    console.log(`  FAILED: ${e.message.split('\n')[0]}\n`);
    failed++;
  }
}

if (!dry) {
  console.log('Rebuilding the site so the buttons point at these files...');
  execSync('node build.js', { cwd: ROOT, stdio: 'inherit' });
}
process.exit(failed ? 1 : 0);
