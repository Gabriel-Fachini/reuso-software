// Screenshots every step of the given scenes at 1920x1080 for visual review.
// Usage: node scripts/snap.mjs [cenas] [pasta]
//   cenas: "6" | "3-5" | "3,6,9" | "all" (padrão)   pasta: out/snaps (padrão)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { BASE, ensureServer, parseScenes } from "./lib/server.mjs";

const [scenesArg, outDir = "out/snaps"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

const stop = await ensureServer();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const wait = (ms) => page.waitForTimeout(ms);
page.on("pageerror", (e) => console.error("ERRO NA PÁGINA:", e.message));

try {
  for (const i of parseScenes(scenesArg)) {
    await page.goto(`${BASE}/?snap=${i}#${i}`);
    await page.waitForFunction(() => !!(window.__deckReady && window.__tl));
    await wait(300);
    const stops = await page.evaluate(() => window.__tl.data?.pauses?.length ?? 0);
    for (let k = 0; k <= stops; k++) {
      if (k > 0) await page.keyboard.press("ArrowRight");
      await wait(150);
      const playing = await page.evaluate(() => !window.__tl.paused() && window.__tl.progress() < 1);
      if (playing) await page.keyboard.press("ArrowRight");
      await wait(1200);
      const name = `${outDir}/s${String(i).padStart(2, "0")}-${k}.png`;
      await page.screenshot({ path: name });
      console.log(name);
    }
  }
} finally {
  await browser.close();
  stop();
}
