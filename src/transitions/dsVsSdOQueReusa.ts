import { gsap } from "../engine/gsap";
import { defineTransition, exitText, inside, panel, popOut } from "../engine/transition";
import { definicaoOQueReusa } from "./definicaoOQueReusa";

/*
 * 4 → 5  "O token vira camada"
 *
 * out: the comparison folds away; the orange token swatch of the Design System
 *      side crouches and stretches into a flat orange pill: "Design tokens".
 * in:  the same landing as 3 → 4 used to have: the pill waits aside while the
 *      stack builds, then hops into its slot (definicaoOQueReusa.in).
 */
export const dsVsSdOQueReusa = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    gsap.killTweensOf($(".pk"));
    tl.to($(".pk"), { opacity: 0, duration: 0.2 }, 0);
    exitText(tl, scene, ".l1, .l2, .q", 0);
    exitText(tl, scene, ".ri-l, .ri-r", 0.05);
    exitText(tl, scene, ".common", 0.1);
    popOut(tl, $(".neq, .sd-n, .ds-n:not(:has(.sw-0))"), 0.05, { stagger: 0.02 });
    tl.to($(".ds-p, .sd-p"), { drawSVG: "100% 100%", duration: 0.45, ease: "power2.in", stagger: 0.02 }, 0.05);
    tl.to($(".divider"), { drawSVG: "50% 50%", autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 0.05);
    tl.to($(".viz-lb"), { autoAlpha: 0, duration: 0.25 }, 0.05);
    tl.to($(".viz"), { autoAlpha: 0, duration: 0.35 }, 0.45);

    const sw = scene.querySelector(".sw-0");
    const b = sw ? box(sw) : { cx: 180, cy: 406, w: 44, h: 44 };
    if (sw) tl.to(sw, { scaleX: 1.2, scaleY: 0.8, duration: 0.2, ease: "power2.inOut" }, 0.15);

    const pill = panel(layer, { cx: b.cx, cy: b.cy, w: b.w, h: b.h }, "var(--gradient-tangerine)", b.w / 2);
    const fill = inside(pill, { background: "var(--gradient-orange-crush)", opacity: "0" });
    const now = inside(
      pill,
      { color: "var(--color-just-black)", fontSize: "32px", fontWeight: "600", letterSpacing: "-0.015em", opacity: "0" },
      "Design tokens",
    );
    tl.set(pill, { autoAlpha: 1 }, 0.35);
    if (sw) tl.set(sw, { autoAlpha: 0 }, 0.35);
    tl.to(pill, { x: 820, y: 560, duration: 0.8, ease: "power3.inOut" }, 0.35);
    tl.to(pill, { width: 650, height: 80, borderRadius: 22, duration: 0.7, ease: "back.out(1.4)" }, 0.45);
    tl.to(fill, { opacity: 1, duration: 0.35 }, 0.5);
    tl.to(now, { opacity: 1, duration: 0.3 }, 0.85);
    return { pill };
  },

  in: definicaoOQueReusa.in,
});
