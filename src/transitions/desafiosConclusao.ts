import { gsap } from "../engine/gsap";
import { defineTransition, exitText, fallOut } from "../engine/transition";

/*
 * 19 → 20  "A bala segue, os desafios caem"
 *
 * out: the silver bullet keeps flying off stage; the pierced cards fall with
 *      gravity, one after the other.
 * in:  the conclusion builds on a clean stage.
 */
export const desafiosConclusao = defineTransition({
  out({ scene }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    gsap.killTweensOf($(".glint"));
    tl.to($(".glint"), { autoAlpha: 0, duration: 0.15 }, 0);
    tl.to($(".bullet"), { x: "+=900", duration: 0.55, ease: "power3.in" }, 0);
    tl.to($(".trail"), { autoAlpha: 0, duration: 0.4 }, 0.1);
    exitText(tl, scene, ".eyebrow-a, .a-title", 0.05);
    fallOut(tl, $(".ch"), 0.2, { each: 0.07 });
    return {};
  },

  in(ctx, tl) {
    tl.call(() => void ctx.tl.play(0), [], 0);
  },
});
