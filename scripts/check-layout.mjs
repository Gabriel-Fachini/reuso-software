// Layout check: renders the end state of every step of every scene and looks
// for things that spill out of the stage, out of their card, or into the footer.
// Usage: node scripts/check-layout.mjs [cenas]   ("6" | "3-5" | "3,6,9" | "all")
//
// Decorative pieces are exempt: anything inside .deco or [data-allow-overflow].
import { chromium } from "playwright";
import { BASE, ensureServer, parseScenes } from "./lib/server.mjs";

const TOLERANCE = 2; // px
const FOOTER_TOP = 1015; // the HUD band (block title / counter) starts here

const stop = await ensureServer();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const problems = [];
page.on("pageerror", (e) => problems.push(`erro na página: ${e.message}`));

try {
  for (const i of parseScenes(process.argv[2])) {
    await page.goto(`${BASE}/?check=${i}#${i}`);
    await page.waitForFunction(() => !!(window.__deckReady && window.__tl));
    const { stops, flow, id } = await page.evaluate((n) => {
      const meta = window.__scenes[n - 1];
      return { stops: window.__tl.data?.pauses?.length ?? 0, flow: meta.flow, id: meta.id };
    }, i);
    if (flow && stops > 0) problems.push(`cena ${i} (${id}): marcada como fluxo mas tem ${stops} passo(s)`);

    for (let k = 0; k <= stops; k++) {
      await page.evaluate((k) => {
        const tl = window.__tl;
        const pauses = tl.data?.pauses ?? [];
        if (k < pauses.length) tl.seek(pauses[k] + 0.001).pause();
        else tl.progress(1).pause();
      }, k);
      await page.waitForTimeout(400);

      const found = await page.evaluate(
        ({ TOLERANCE, FOOTER_TOP }) => {
          const stage = document.querySelector(".stage").getBoundingClientRect();
          const exempt = (el) => el.closest(".deco, [data-allow-overflow]");
          const visible = (el) => el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
          const describe = (el) => {
            const cls = (el.getAttribute("class") || "").split(" ").filter(Boolean)[0];
            const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
            return `<${el.tagName.toLowerCase()}${cls ? "." + cls : ""}>${text ? ` "${text}"` : ""}`;
          };
          const out = [];
          const flagged = new Set();
          const outside = (r, b) =>
            r.left < b.left - TOLERANCE || r.right > b.right + TOLERANCE || r.top < b.top - TOLERANCE || r.bottom > b.bottom + TOLERANCE;

          for (const el of document.querySelectorAll(".scene *")) {
            if (exempt(el) || !visible(el)) continue;
            const r = el.getBoundingClientRect();
            if (r.width < 1 || r.height < 1) continue;
            if ([...flagged].some((f) => f.contains(el))) continue;

            if (outside(r, stage)) {
              out.push(`fora do palco: ${describe(el)}`);
              flagged.add(el);
              continue;
            }
            const card = el.parentElement?.closest(".card");
            if (card && !exempt(card) && outside(r, card.getBoundingClientRect())) {
              out.push(`vaza do card: ${describe(el)}`);
              flagged.add(el);
              continue;
            }
            const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
            if (ownText && r.bottom > stage.top + FOOTER_TOP) {
              out.push(`invade o rodapé: ${describe(el)}`);
              flagged.add(el);
            }
          }
          return out;
        },
        { TOLERANCE, FOOTER_TOP },
      );
      for (const f of found) problems.push(`cena ${i} (${id}) passo ${k}: ${f}`);
    }
  }
} finally {
  await browser.close();
  stop();
}

if (problems.length) {
  console.error(`check-layout: ${problems.length} problema(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log("check-layout: ok");
