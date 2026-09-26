// Clinic Manager has promo clips but no still screenshots. This pulls one frame out of each clip so the
// site can show the real app instead of a placeholder.
// Frames come out of a <canvas>, not capturePage: Electron's offscreen renderer does not decode video.
// Run: ..\gyno-clinic-app\node_modules\.bin\electron.cmd tools\grab-frames.js
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

app.commandLine.appendSwitch('allow-file-access-from-files'); // else the canvas is tainted and toDataURL throws

const HOME = path.join(__dirname, '..', '..');
const CLIPS = path.join(HOME, 'clinic-app', 'promo', 'ad', 'public', 'clips-v');
const OUT = path.join(__dirname, '..', 'static', 'shots', 'clinic-manager');

// clip -> the second to grab (mid-clip, after the UI has settled)
const GRABS = [
  ['queue.mp4', 1.6],
  ['patients.mp4', 1.4],
  ['visit.mp4', 1.8],
  ['reports.mp4', 1.6],
  ['settings.mp4', 1.4],
];

app.on('window-all-closed', () => { /* keep alive between grabs */ });

app.whenReady().then(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = path.join(CLIPS, '_grab_tmp.html'); // lives beside the clips so the relative src is same-dir
  const win = new BrowserWindow({ show: false, width: 1360, height: 860, useContentSize: true });

  for (const [clip, at] of GRABS) {
    if (!fs.existsSync(path.join(CLIPS, clip))) { console.log('skip (missing)', clip); continue; }
    fs.writeFileSync(tmp, `<html><body style="margin:0;background:#0b1016">
      <video id="v" src="./${clip}" preload="auto" muted playsinline></video>
      <script>
        window.grabbed = null; window.grabErr = null;
        const v = document.getElementById('v');
        v.addEventListener('loadeddata', () => { v.currentTime = ${at}; });
        v.addEventListener('seeked', () => {
          try {
            const c = document.createElement('canvas');
            c.width = v.videoWidth; c.height = v.videoHeight;
            c.getContext('2d').drawImage(v, 0, 0);
            window.grabbed = c.toDataURL('image/png');
            window.dims = v.videoWidth + 'x' + v.videoHeight;
          } catch (e) { window.grabErr = String(e); }
        });
        v.addEventListener('error', () => { window.grabErr = 'video error ' + (v.error && v.error.code); });
      </script></body></html>`);

    await win.loadFile(tmp);
    let data = null, dims = '', err = null;
    for (let i = 0; i < 80; i++) {
      await new Promise((r) => setTimeout(r, 120));
      const res = await win.webContents.executeJavaScript('({g: window.grabbed, d: window.dims, e: window.grabErr})');
      if (res.e) { err = res.e; break; }
      if (res.g) { data = res.g; dims = res.d; break; }
    }
    if (!data) { console.log('FAILED', clip, err || '(timed out)'); continue; }
    const out = path.join(OUT, clip.replace('.mp4', '.png'));
    fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
    console.log(path.basename(out), dims, (fs.statSync(out).size / 1024).toFixed(0) + ' KB');
  }

  try { fs.unlinkSync(tmp); } catch (_) { /* none */ }
  win.destroy();
  setTimeout(() => process.exit(0), 200);
}).catch((e) => { console.error('failed:', e); process.exit(1); });
