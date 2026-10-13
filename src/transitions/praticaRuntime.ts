import { circle, defineTransition, morphTo, swap, takeOver } from "../engine/transition";
import { praticaDemo } from "./praticaDemo";

/*
 * 16 → 17  "As máquinas descem para o espectro"
 *
 * out: "máquinas." floods the stage green (praticaDemo.out).
 * in:  the tide drains into the knob of the spectrum, on "Declarativo",
 *      and splashes when it lands.
 */
export const praticaRuntime = defineTransition({
  out: praticaDemo.out,

  in(ctx, tl, { block }) {
    const knob = ctx.scene.querySelector(".knob");
    if (!knob) {
      tl.to(block, { autoAlpha: 0, duration: 0.4 }, 0);
      return;
    }
    const k = takeOver(ctx, knob);
    const hit = 0.95;
    morphTo(tl, block, k, 0, { duration: hit, radius: k.w / 2, ease: "expo.inOut" });
    tl.to(block, { scaleX: 1.4, scaleY: 0.65, duration: 0.08, ease: "power2.out" }, hit);
    tl.to(block, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" }, hit + 0.08);
    swap(tl, block, knob, hit + 0.4, 0.15);
    const ring = circle(ctx.layer, { x: k.cx, y: k.cy }, k.w, "transparent");
    ring.style.border = "3px solid var(--color-shockingly-green)";
    tl.set(ring, { autoAlpha: 1 }, hit);
    tl.to(ring, { width: 360, height: 360, autoAlpha: 0, duration: 1, ease: "expo.out" }, hit);
    tl.call(() => void ctx.tl.play(0), [], 0.15);
  },
});
