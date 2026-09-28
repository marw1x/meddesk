// The public file name of an installer or APK on the downloads site (no spaces, so the URL is clean).
// Shared by tools/publish-downloads.js (which writes the files) and build.js (which links to them).
const slugName = (p) => p.name.en.replace(/\s+/g, '');
const dlName = (p, row) => (/\.apk$/i.test(row.file)
  ? `${slugName(p)}-${row.version}.apk`
  : `${slugName(p)}-Setup-${row.version}.exe`);
module.exports = { dlName };
