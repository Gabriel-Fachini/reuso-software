// Renders the deck frame by frame and encodes it to out/apresentacao.mp4.
// Usage: npm run export:mp4   (builds first, then runs this script)
//        node scripts/export-mp4.mjs [--fps 60] [--bitrate 40M] [--out arquivo.mp4]
//
// The page runs on a virtual clock: performance.now, Date.now,
// requestAnimationFrame and timers only move when this script advances them,
// exactly 1/fps per frame. No dropped frames, however slow the screenshot is.
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : def;
};
const FPS = Number(arg("fps", 60));
const BITRATE = arg("bitrate", "40M");
const OUT_FILE = arg("out", "out/apresentacao.mp4");
const PORT = 4173;
const TAIL_S = 1.5; // hold on the last frame
const MAX_S = 15 * 60;

mkdirSync(dirname(OUT_FILE), { recursive: true });

// Injected before any page script runs.
const virtualClock = () => {
  let now = 0;
  let seq = 1;
  const epoch = Date.now();
  const timers = new Map();
  let rafs = new Map();
  performance.now = () => now;
  Date.now = () => epoch + now;
  window.requestAnimationFrame = (cb) => {
    const id = seq++;
    rafs.set(id, cb);
    return id;
  };
  window.cancelAnimationFrame = (id) => rafs.delete(id);
  const add = (cb, ms, args, every) => {
    const id = seq++;
    timers.set(id, { at: now + Math.max(0, Number(ms) || 0), cb, args, every });
    return id;
  };
  window.setTimeout = (cb, ms, ...args) => add(cb, ms, args, 0);
  window.setInterval = (cb, ms, ...args) => add(cb, ms, args, Math.max(1, Number(ms) || 0));
  window.clearTimeout = window.clearInterval = (id) => timers.delete(id);

  window.__advance = (ms) => {
    const end = now + ms;
    for (;;) {
      let next = null;
      for (const [id, t] of timers) if (t.at <= end && (!next || t.at < next[1].at)) next = [id, t];
      if (!next) break;
      const [id, t] = next;
      now = t.at;
      if (t.every) t.at += t.every;
      else timers.delete(id);
      if (typeof t.cb === "function") t.cb(...t.args);
    }
    now = end;
    const due = rafs;
    rafs = new Map();
    for (const cb of due.values()) cb(now);
  };
};

const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  stdio: ["ignore", "pipe", "inherit"],
});
await new Promise((resolve, reject) => {
  server.stdout.on("data", (d) => String(d).includes(String(PORT)) && resolve());
  server.on("exit", (code) => reject(new Error(`vite preview exited (${code})`)));
});

const ffmpeg = spawn(
  "ffmpeg",
  [
    "-y",
    "-loglevel", "error",
    "-f", "image2pipe",
    "-framerate", String(FPS),
    "-i", "-",
    "-c:v", "libx264",
    "-preset", "slow",
    "-profile:v", "high",
    "-b:v", BITRATE,
    "-maxrate", BITRATE,
    "-bufsize", "80M",
    "-pix_fmt", "yuv420p",
    "-r", String(FPS),
    "-movflags", "+faststart",
    OUT_FILE,
  ],
  { stdio: ["pipe", "inherit", "inherit"] },
);
const encoded = new Promise((resolve, reject) =>
  ffmpeg.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited (${code})`)))),
);

try {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.error("ERRO NA PÁGINA:", e.message));
  await page.addInitScript(virtualClock);
  await page.goto(`http://localhost:${PORT}/?autoplay`);
  // fonts load on real time; nudge the clock until the deck is up
  while (!(await page.evaluate(() => window.__deckReady === true))) {
    await page.evaluate(() => window.__advance(0));
    await page.waitForTimeout(50);
  }

  const step = 1000 / FPS;
  let frame = 0;
  let tail = -1;
  const t0 = Date.now();
  while (frame < MAX_S * FPS) {
    await page.evaluate((ms) => window.__advance(ms), step);
    const shot = await page.screenshot({ type: "jpeg", quality: 98 });
    if (!ffmpeg.stdin.write(shot)) await new Promise((r) => ffmpeg.stdin.once("drain", r));
    frame++;
    if (tail < 0 && (await page.evaluate(() => window.__deckDone === true))) tail = Math.round(TAIL_S * FPS);
    if (tail >= 0 && tail-- === 0) break;
    if (frame % (FPS * 10) === 0) {
      const scene = await page.evaluate(() => document.querySelector(".hud-counter")?.textContent);
      console.log(`${(frame / FPS).toFixed(0)}s de vídeo · cena ${scene} · ${((Date.now() - t0) / 1000).toFixed(0)}s reais`);
    }
  }
  await browser.close();
  ffmpeg.stdin.end();
  await encoded;
  console.log(`✓ ${OUT_FILE} · ${(frame / FPS).toFixed(1)}s · ${FPS} fps · ${BITRATE}`);
} finally {
  server.kill();
}
