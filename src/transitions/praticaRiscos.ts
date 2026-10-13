import { circle, defineTransition, morphTo, swap, takeOver } from "../engine/transition";
import { praticaDemo } from "./praticaDemo";

/*
 * 16 → 17  "As máquinas viram o alerta"
 *
 * out: "máquinas." floods the stage green (praticaDemo.out).
 * in:  the tide drains into the green "riscos?" of the title and splashes
 *      when it lands.
 */
export const praticaRiscos = defineTransition({
  out: praticaDemo.out,

  in(ctx, tl, { block }) {
    const mark = ctx.scene.querySelector(".t-mark");
    if (!mark) {
      tl.to(block, { autoAlpha: 0, duration: 0.4 }, 0);
      tl.call(() => void ctx.tl.play(0), [], 0);
      return;
    }
    const m = takeOver(ctx, mark);
    const hit = 0.95;
    morphTo(tl, block, m, 0, { duration: hit, radius: 8, ease: "expo.inOut" });
    tl.to(block, { rotation: -2, duration: hit, ease: "expo.inOut" }, 0);
    tl.to(block, { scaleX: 1.15, scaleY: 0.8, duration: 0.08, ease: "power2.out" }, hit);
    tl.to(block, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" }, hit + 0.08);
    swap(tl, block, mark, hit + 0.4, 0.15);
    const ring = circle(ctx.layer, { x: m.cx, y: m.cy }, m.h, "transparent");
    ring.style.border = "3px solid var(--color-shockingly-green)";
    tl.set(ring, { autoAlpha: 1 }, hit);
    tl.to(ring, { width: 420, height: 420, autoAlpha: 0, duration: 1, ease: "expo.out" }, hit);
    tl.call(() => void ctx.tl.play(0), [], 0.15);
  },
});
