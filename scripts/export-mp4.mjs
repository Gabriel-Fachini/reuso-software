// Records the deck in autoplay mode and encodes it to out/apresentacao.mp4.
// Usage: npm run export:mp4   (builds first, then runs this script)
import { chromium } from "playwright";
import { spawn, execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const PORT = 4173;
const OUT_DIR = "out";
const RAW_DIR = join(OUT_DIR, "raw");
const OUT_FILE = join(OUT_DIR, "apresentacao.mp4");

rmSync(RAW_DIR, { recursive: true, force: true });
mkdirSync(RAW_DIR, { recursive: true });

const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  stdio: ["ignore", "pipe", "inherit"],
});
await new Promise((resolve, reject) => {
  server.stdout.on("data", (d) => String(d).includes(String(PORT)) && resolve());
  server.on("exit", (code) => reject(new Error(`vite preview exited (${code})`)));
});

let offset = 0;
try {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: RAW_DIR, size: { width: 1920, height: 1080 } },
  });
  const t0 = Date.now();
  const page = await context.newPage();
  await page.goto(`http://localhost:${PORT}/?autoplay`);
  await page.waitForFunction(() => window.__deckReady === true);
  offset = (Date.now() - t0) / 1000;
  console.log(`deck ready after ${offset.toFixed(2)}s, recording…`);

  await page.waitForFunction(() => window.__deckDone === true, null, { timeout: 15 * 60_000, polling: 500 });
  await page.waitForTimeout(1500);
  await context.close();
  await browser.close();
} finally {
  server.kill();
}

const raw = readdirSync(RAW_DIR).find((f) => f.endsWith(".webm"));
if (!raw) throw new Error("no video recorded");

execFileSync(
  "ffmpeg",
  [
    "-y",
    "-loglevel", "error",
    "-ss", offset.toFixed(2),
    "-i", join(RAW_DIR, raw),
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    "-r", "30",
    "-movflags", "+faststart",
    OUT_FILE,
  ],
  { stdio: "inherit" },
);
rmSync(RAW_DIR, { recursive: true, force: true });
console.log(`✓ ${OUT_FILE}`);
