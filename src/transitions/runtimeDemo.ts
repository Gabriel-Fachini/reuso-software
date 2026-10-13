import { defineTransition, exitText, panel } from "../engine/transition";
import { praticaDemo } from "./praticaDemo";

/*
 * 17 → 18  "A infraestrutura inunda tudo"
 *
 * out: "infraestrutura crítica:" keeps its green block while everything else
 *      leaves; the block crouches and floods the stage.
 * in:  the green drains into the token the demo will change (praticaDemo.in).
 */
export const runtimeDemo = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    const mark = scene.querySelector(".c-end .mark");
    const mb = mark ? box(mark) : { cx: 700, cy: 780, w: 460, h: 60 };
    const block = panel(layer, mb, "var(--color-shockingly-green)", 8);
    tl.set(block, { autoAlpha: 1, rotation: -1 }, 0);
    if (mark) tl.set(mark, { autoAlpha: 0 }, 0);
    exitText(tl, scene, ".title, .c-title, .c-end", 0.02);
    tl.to($(".risk"), { y: 60, autoAlpha: 0, duration: 0.4, ease: "power2.in", stagger: 0.05 }, 0);

    tl.to(block, { scaleX: 1.15, scaleY: 0.75, duration: 0.2, ease: "power2.out" }, 0.3);
    tl.to(block, { scaleX: 1, scaleY: 1, rotation: 0, width: 2300, height: 1400, x: 960, y: 540, duration: 0.6, ease: "power3.in" }, 0.5);
    return { block };
  },

  in: praticaDemo.in,
});
