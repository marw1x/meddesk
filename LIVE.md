# Going live

Everything on this machine is ready. What is left needs your GitHub account, which I cannot create for
you. Five steps, about twenty minutes of your time plus the upload wait.

**Already done:** GitHub CLI installed, git repo created and committed on branch `main`, site built into
`docs/`, release uploader written, and the download links wired to fill themselves in automatically.

---

## Step 1 - Create a GitHub account  [done]

Account `marw1x`, with **Settings -> Emails -> Keep my email addresses private** switched on, so commits
and the site carry the `users.noreply.github.com` address instead of a real one.

---

## Step 2 - Sign in from this machine and create the repository  [login done]

Open a terminal in `C:\Users\Marwan\meddesk-site` and run:

```bash
gh auth login
```

Answer: **GitHub.com**, then **HTTPS**, then **Y** to authenticate git, then **Login with a web browser**.
It shows a one-time code, opens your browser, you paste the code and approve. That is the whole login.

Then create the repository and push everything to it in one command:

```bash
gh repo create meddesk --public --source . --remote origin --push
```

The repository must be **public**. GitHub Pages and release downloads are free only on public repos, and
there is nothing secret in here (no licence keys, no patient data, no source code for the apps themselves).

---

## Step 3 - Turn on GitHub Pages  [done]

Already enabled through the API (branch `main`, folder `/docs`). The site is live:

**https://marw1x.github.io/meddesk/**

Repository: **https://github.com/marw1x/meddesk**

The download buttons say "قيد التجهيز" because the installers are not uploaded yet. They stay that way
until `release.js` uploads a product and flips its `released` flag in `data/downloads.json`, so the site
can never show a link to a file that is not there.

---

## Step 4 - Upload the installers  [not started]

Still in `C:\Users\Marwan\meddesk-site`:

```bash
node release.js --dry
```

That lists what it will do without uploading anything. Check the versions and tags look right, then:

```bash
node release.js
```

It creates one GitHub release per product and uploads the x64 and 32-bit installers into it, with a
progress bar per file. About **900 MB total**, so give it time and a stable connection. If it drops, just
run it again: existing releases are reused and half-finished files are replaced, nothing is duplicated.

The combined "all" installers are deliberately skipped. They are just the x64 and 32-bit builds glued
together, so uploading them would nearly double the transfer for no benefit.

When it finishes it rebuilds the site automatically and prints the download base URL it detected.

---

## Step 5 - Push the finished site

```bash
publish.bat
```

Now the download buttons point at real files. Open your `github.io` address, click a download, and confirm
the file starts coming down.

---

## After this, the routine is short

**Changed the text or design?**

```bash
publish.bat
```

**Released a new version of an app?** Build the installer as usual, then update that product's tag in
`data/downloads.json` to match the new version number, then:

```bash
node release.js clinic-desk
```

```bash
publish.bat
```

`release.js` refuses to upload when a tag and an installer version disagree, so a mismatch stops the run
instead of producing a dead link.

---

## Two things to know

**You never edit download URLs by hand.** `build.js` reads the GitHub remote from the repo and builds the
links from it. The only thing you maintain is the version tag per product in `data/downloads.json`.

**Your own domain, if you want one later:** buy it anywhere, then in the repo's **Settings → Pages →
Custom domain** enter it and follow the DNS instruction shown. GitHub issues the HTTPS certificate free.
Nothing in the site needs changing, because every link in it is relative.

---

## If something goes wrong

**`gh: command not found`** - open a new terminal; the installer added it to PATH but existing terminals
do not see it. `release.js` also finds it at its install path on its own.

**Pages shows a 404** - the folder setting is wrong. It must be branch `main`, folder `/docs`, not `/root`.

**Download button still says قيد التجهيز** - `git remote -v` should show your GitHub URL. If it is empty,
step 2 did not finish. Then re-run `node build.js` and `publish.bat`.

**An upload fails partway** - re-run `node release.js <product-slug>`. It replaces the file rather than
adding a second copy.

**Windows warns the visitor about the .exe** - expected for an unsigned installer, and the FAQ on the site
already explains it in both languages. A code-signing certificate (roughly $200 a year) is the only way to
remove it, and it is not worth it until sales justify it.
