import { gsap } from "../engine/gsap";
import { circle, defineTransition, exitText, popOut, pull, takeOver } from "../engine/transition";

/*
 * 8 → 9  "O build distribui as peças"
 *
 * out: the wires un-draw into the build ring, which swallows the source and
 *      the outputs and winds up, spinning faster and swelling.
 * in:  the ring bursts and flings the four panels of the anatomy out to their
 *      places, each on its own arc.
 */
export const tokensAnatomia = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    exitText(tl, scene, ".title, .title2, .punch", 0);
    popOut(tl, $(".kinds .chip"), 0);
    tl.to($(".particle"), { autoAlpha: 0, duration: 0.15 }, 0);
    tl.to($(".w0"), { drawSVG: "100% 100%", duration: 0.45, ease: "power2.in" }, 0.05);
    tl.to($(".wire"), { drawSVG: "0% 0%", duration: 0.45, ease: "power2.in", stagger: 0.05 }, 0.1);

    const build = scene.querySelector(".build");
    const ring = scene.querySelector(".build-ring");
    const b = build ? box(build) : { cx: 960, cy: 500, w: 200 };
    const r = { x: b.cx, y: b.cy };
    pull(tl, $(".source, .out"), r, box, 0.2, { duration: 0.6, each: 0.08 });
    if (ring) {
      gsap.killTweensOf(ring);
      tl.to(ring, { rotation: "+=900", duration: 1.3, ease: "power2.in" }, 0.05);
    }
    if (build) {
      tl.to(build, { scale: 1.25, duration: 0.9, ease: "power1.in" }, 0.2);
      tl.to(build, { scale: 1.05, duration: 0.18, ease: "power2.inOut" }, 1.12);
    }

    // stand-in ring for the burst on the other side of the swap
    const halo = circle(layer, r, b.w * 1.05, "var(--gradient-summer-fair)");
    Object.assign(halo.style, {
      maskImage: "radial-gradient(circle, transparent 61%, black 62%)",
      webkitMaskImage: "radial-gradient(circle, transparent 61%, black 62%)",
    });
    tl.set(halo, { autoAlpha: 1 }, 1.3);
    if (build) tl.set(build, { autoAlpha: 0 }, 1.3);
    return { halo, r };
  },

  in(ctx, tl, { halo, r }) {
    tl.to(halo, { scale: 2.2, autoAlpha: 0, duration: 0.45, ease: "expo.out" }, 0.02);
    ctx.scene.querySelectorAll(".panel").forEach((p, i) => {
      const nat = takeOver(ctx, p);
      gsap.set(p, { x: r.x - nat.cx, y: r.y - nat.cy, scale: 0.12, rotation: gsap.utils.random(-30, 30) });
      const at = 0.02 + i * 0.1;
      tl.to(p, { x: 0, duration: 0.9, ease: "power3.out" }, at);
      tl.to(p, { y: 0, duration: 0.9, ease: "back.out(1.4)" }, at);
      tl.to(p, { scale: 1, rotation: 0, duration: 0.9, ease: "back.out(1.6)" }, at);
    });
    tl.call(() => void ctx.tl.play(0), [], 0);
  },
});
