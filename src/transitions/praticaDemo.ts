import { circle, defineTransition, exitText, morphTo, panel, popOut, takeOver } from "../engine/transition";

/*
 * 13 → 14  "A cor inunda tudo"
 *
 * out: "máquinas." keeps its green block while the words leave; the block
 *      crouches and floods the stage.
 * in:  the green tide drains into one swatch of the token editor — the token
 *      the demo is about to change — and splashes on arrival.
 */
export const praticaDemo = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    const mark = scene.querySelector(".m2 .mark");
    const mb = mark ? box(mark) : { cx: 1300, cy: 600, w: 360, h: 90 };
    const block = panel(layer, mb, "var(--color-shockingly-green)", 8);
    tl.set(block, { autoAlpha: 1, rotation: -2 }, 0);
    if (mark) tl.set(mark, { autoAlpha: 0 }, 0);
    exitText(tl, scene, ".m1, .m2", 0.02);
    popOut(tl, $(".m-deco"), 0);
    tl.to($(".cards"), { autoAlpha: 0, duration: 0.3 }, 0);

    tl.to(block, { scaleX: 1.15, scaleY: 0.75, duration: 0.2, ease: "power2.out" }, 0.3);
    tl.to(block, { scaleX: 1, scaleY: 1, rotation: 0, width: 2300, height: 1400, x: 960, y: 540, duration: 0.6, ease: "power3.in" }, 0.5);
    return { block };
  },

  in(ctx, tl, { block }) {
    const panelEl = ctx.scene.querySelector(".demo-panel");
    if (panelEl) takeOver(ctx, panelEl);
    const sw = ctx.scene.querySelectorAll(".demo-panel .sw")[1];
    if (!sw) {
      tl.to(block, { autoAlpha: 0, duration: 0.4 }, 0);
      return;
    }
    const s = ctx.box(sw);
    const hit = 0.95;
    morphTo(tl, block, s, 0, { duration: hit, radius: s.w / 2, ease: "expo.inOut" });
    tl.to(block, { scaleX: 1.4, scaleY: 0.65, duration: 0.08, ease: "power2.out" }, hit);
    tl.to(block, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" }, hit + 0.08);
    tl.to(block, { autoAlpha: 0, duration: 0.15 }, hit + 0.45);
    const ring = circle(ctx.layer, { x: s.cx, y: s.cy }, s.w, "transparent");
    ring.style.border = "3px solid var(--color-shockingly-green)";
    tl.set(ring, { autoAlpha: 1 }, hit);
    tl.to(ring, { width: 420, height: 420, autoAlpha: 0, duration: 1, ease: "expo.out" }, hit);
    tl.call(() => void ctx.tl.play(0), [], 0.15);
  },
});
