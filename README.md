# MedDesk download site

A bilingual site where a doctor picks their specialty, reads what the program does, and downloads the
trial. Arabic at the root, English mirrored under `/en/`, both fully static. No framework, no build
toolchain, no JavaScript needed to read the page.

```bash
cd C:\Users\Marwan\meddesk-site && node build.js
```

That writes `docs/`. Open `docs/index.html` to look at it.

**To put it online, follow `LIVE.md`.** It is written against what is already set up on this machine.

---

## 1. What is where

| | |
|---|---|
| `data/site.js` | **all the text, both languages.** Product names, features, captions, FAQ. Edit here. |
| `data/downloads.json` | where the installer files live (section 3) |
| `static/styles.css` | the whole design. One accent colour, light and dark. |
| `static/app.js` | one scroll reveal, nothing else |
| `build.js` | turns the above into `dist/` |
| `docs/` | **generated site. Never edit by hand, it gets wiped on every build.** GitHub Pages serves this folder. |
| `LIVE.md` | going-live steps: account, repo, Pages, uploads |
| `release.js` | creates the GitHub releases and uploads the installers |
| `publish.bat` | rebuild, commit and push the site |
| `upload-list.md` | generated: exactly which installer files to upload under which release tag |
| `static/shots/<product>/` | screenshots per language (`ar-queue.png`, `en-queue.png`), captured from the running apps on seeded demo data; a missing English file falls back to Arabic |
| `static/logos/` | 192px product marks from `tools/make-logos.js` (the originals are 100-260 KB each) |

Versions and file sizes on the page are read from the real installers in each app's `dist` folder at build
time, so they can't drift. Build new installers, re-run `node build.js`, and the numbers update.

---

## 2. The pages

- `index.html` - hero, the four products, why it is different, how to install, FAQ, WhatsApp
- `asnaan.html`, `gynodesk.html`, `clinic-desk.html`, `raydesk.html` - one per product:
  screenshots, what it does, requirements, download
- `en/` - the same eight pages in English

The language button in the nav swaps to the same page in the other language, not back to the home page.

---

## Refreshing the screenshots

Each app can photograph its own screens: seed a throwaway data folder with the app's `build/seed.js`, set
`trialAccepted: true` (and for Asnaan `termsAccepted: 999`) in that folder's `device.json`, move its `port` off
the default so a live clinic on this PC is not disturbed, then start the app with `CLINIC_DATA_DIR` +
`CLINIC_SHOT_DIR` (Asnaan: `DENTAL_DATA_DIR` + `DENTAL_SHOT_DIR`). Check each image before copying it into
`static/shots/` - on Clinic Desk and GynoDesk the capture can photograph the previous screen, because leaving a
started visit opens a "discard draft?" confirmation.

## 3. Putting it online

See **LIVE.md**. Short version: GitHub Pages serves `docs/` and GitHub Releases hold the installers, both
from one free public repo. `build.js` reads the git remote and builds the download links from it, so the
only thing you maintain by hand is the version tag per product in `data/downloads.json`.

---

## 4. Three things worth doing before you publish

1. **Check the screenshots for real patient data.** The images come from the apps' own help screenshots and
   demo recordings. They look seeded, but they show patient names and phone numbers, so confirm before this
   goes public. Same warning as the social kit.

2. **Asnaan's 64-bit installer is 273 MB** while the other three are around 91 MB. Something large is being
   bundled that probably should not be (tutorial videos or CBCT test fixtures are the likely culprits).
   Worth trimming: on a Syrian connection that is the difference between a download that finishes and one
   that does not.

3. **The English pages show Arabic screenshots.** The apps are bilingual, so you can switch one to English,
   retake the five screenshots per product, and drop them in a parallel folder. Until then the English
   pages are honest but less polished than the Arabic ones.

Also worth knowing: the FAQ answers the Windows SmartScreen warning openly, because an unsigned installer
will trigger it and a doctor who hits that with no explanation will simply stop. A code-signing certificate
(around $200 a year) removes the warning entirely if you ever decide it is worth it.

---

## 5. Design notes

Light and dark are both supported and follow the device setting. There is no theme switch, on purpose:
one less control for a non-technical visitor to wonder about.

One accent colour (teal) is used everywhere, matching the MedDesk brand from the social kit. Buttons are
pills, panels are 18px, media is 14px, and nothing else has a radius. Fonts are IBM Plex Sans Arabic and
Geist, both self-hosted from the dental app's existing font folder, so no Google Fonts request and no
layout shift. Icons are the app's own 24px set, read straight out of `gyno-clinic-app/src/icons.js` at
build time, so the site and the software look related.

Motion is deliberately minimal: hover and press states, plus one short fade as sections scroll into view,
and that turns itself off entirely for anyone with reduced motion enabled.
