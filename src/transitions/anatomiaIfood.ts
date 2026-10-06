import { gsap } from "../engine/gsap";
import { defineTransition, exitText } from "../engine/transition";

/*
 * 9 → 10  "A ordem desmorona, o caos volta"
 *
 * out: the four panels topple like dominoes, left to right, and fall away.
 * in:  the off-brand buttons from the opening come flying back up from below
 *      ("lembram daquela empresa?").
 */
export const anatomiaIfood = defineTransition({
  out({ scene }, tl) {
    exitText(tl, scene, ".title", 0);
    scene.querySelectorAll(".panel").forEach((p, i) => {
      const at = 0.05 + i * 0.14;
      gsap.set(p, { transformOrigin: "100% 100%" });
      tl.to(p, { rotation: -4, duration: 0.15, ease: "power1.out" }, at);
      tl.to(p, { rotation: 95, duration: 0.55, ease: "power2.in" }, at + 0.15);
      tl.to(p, { y: "+=1000", duration: 0.5, ease: "power2.in" }, at + 0.55);
    });
    return {};
  },

  in(ctx, tl) {
    const pieces = [...ctx.scene.querySelectorAll(".echo .chaos-piece")];
    if (pieces.length) {
      tl.from(pieces, {
        y: () => gsap.utils.random(500, 900),
        rotation: () => gsap.utils.random(-120, 120),
        duration: 1.2,
        ease: "back.out(1.3)",
        stagger: { each: 0.035, from: "random" },
      }, 0);
    }
    tl.call(() => void ctx.tl.play(0), [], 0);
  },
});
