import { gsap } from "../engine/gsap";
import { defineTransition, exitText, land, popOut, takeOver } from "../engine/transition";

/*
 * 3 → 4  "O selo vira manchete"
 *
 * out: the rings un-draw and everything pops away except the outer badge,
 *      "Design System", which loses its pill and swells a little (anticipation).
 * in:  the next scene's big "Design System" starts at the badge's size and
 *      place and flies on an arc into the middle of the stage, landing with a squash.
 */
type State = { cx: number; cy: number; font: number };

export const definicaoDsVsSd = defineTransition<State>({
  out({ scene, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    exitText(tl, scene, ".title, .def, .lg-0, .lg-1, .lg-2, .refs", 0);
    gsap.killTweensOf($(".ripple"));
    popOut(tl, $(".badge-mid, .s-deco, .inner"), 0.05, { stagger: 0.03 });
    tl.to($(".sat-mid, .sat-out, .ripple"), { autoAlpha: 0, duration: 0.25, stagger: 0.02 }, 0.05);
    tl.to($(".ring-out, .ring-mid"), { drawSVG: "50% 50%", duration: 0.6, ease: "power2.in", stagger: 0.12 }, 0.15);

    const chip = scene.querySelector<HTMLElement>(".badge-out .chip");
    if (!chip) return { cx: 960, cy: 360, font: 22 };
    gsap.killTweensOf(chip);
    const b = box(chip);
    tl.to(chip, { backgroundColor: "transparent", borderColor: "transparent", duration: 0.35 }, 0.3);
    tl.to(chip, { scale: 1.15, duration: 0.22, ease: "power2.out", yoyo: true, repeat: 1 }, 0.45);
    return { cx: b.cx, cy: b.cy, font: parseFloat(getComputedStyle(chip).fontSize) || 22 };
  },

  in(ctx, tl, from) {
    const inner = ctx.scene.querySelector<HTMLElement>(".l1-in");
    const outer = inner?.parentElement;
    if (!inner || !outer) {
      tl.call(() => void ctx.tl.play(0), [], 0);
      return;
    }
    const nat = takeOver(ctx, inner);
    const s = Number(gsap.getProperty(outer, "scale")) || 1;
    const font = parseFloat(getComputedStyle(inner).fontSize) * s;
    gsap.set(inner, {
      x: (from.cx - nat.cx) / s,
      y: (from.cy - nat.cy) / s,
      scale: from.font / font,
      transformOrigin: "50% 50%",
    });
    // different eases on x and y: the flight is an arc
    tl.to(inner, { x: 0, duration: 1.1, ease: "power3.inOut" }, 0.05);
    tl.to(inner, { y: 0, duration: 1.1, ease: "power2.inOut" }, 0.05);
    tl.to(inner, { scale: 1, duration: 1.1, ease: "power3.inOut" }, 0.05);
    land(tl, inner, 1.15);
    tl.call(() => void ctx.tl.play(0), [], 0.6);
  },
});
