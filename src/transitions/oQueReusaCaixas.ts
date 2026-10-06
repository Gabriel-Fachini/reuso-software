import { gsap } from "../engine/gsap";
import { defineTransition, exitText, inside, land, panel, popOut, takeOver } from "../engine/transition";

/*
 * 4 → 5  "A pilha vira caixa-preta"
 *
 * out: the explanations slide away; the five layers are pressed together
 *      into one dark box with a "?" — it crouches and is thrown up off stage.
 * in:  the black box falls back down into its slot (stretching as it falls,
 *      squashing on impact) and the scene builds around it.
 */
export const oQueReusaCaixas = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    exitText(tl, scene, ".title, .title2, .punch", 0);
    tl.to($('[class^="ex-"]'), { x: 70, autoAlpha: 0, duration: 0.4, ease: "power2.in", stagger: 0.04 }, 0);
    tl.to($(".axis-line"), { scaleY: 0, transformOrigin: "50% 0%", duration: 0.5, ease: "power3.in" }, 0.05);
    tl.to($(".axis-label"), { autoAlpha: 0, duration: 0.3 }, 0.05);
    popOut(tl, $(".r-deco"), 0);

    const slabs = $(".slab");
    const top = slabs.length ? box(slabs[0]) : { cx: 720, y: 500 };
    const bottom = slabs.length ? box(slabs[slabs.length - 1]) : { y: 900, h: 0 };
    const c = { cx: top.cx, cy: (top.y + bottom.y + bottom.h) / 2 };
    slabs.forEach((s, i) => {
      const b = box(s);
      tl.to(s, { y: `+=${c.cy - b.cy}`, scaleX: 170 / b.w, scaleY: 0.6, duration: 0.5, ease: "power3.in" }, 0.2 + Math.abs(i - 2) * 0.05);
    });

    const bx = panel(layer, { cx: c.cx, cy: c.cy, w: 170, h: 170 }, "var(--gradient-ink)", 36);
    bx.style.border = "1px solid var(--color-border)";
    inside(bx, { color: "var(--color-muted)", fontSize: "72px", fontWeight: "600" }, "?");
    tl.set(bx, { autoAlpha: 1 }, 0.72);
    tl.set(slabs, { autoAlpha: 0 }, 0.72);
    tl.fromTo(bx, { scaleX: 1.6, scaleY: 0.4 }, { scaleX: 1, scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.45)" }, 0.72);
    tl.to(bx, { scaleX: 1.18, scaleY: 0.78, transformOrigin: "50% 100%", duration: 0.16, ease: "power2.out" }, 1.25);
    tl.to(bx, { y: -320, scaleX: 0.8, scaleY: 1.3, duration: 0.45, ease: "power2.in" }, 1.41);
    return { x: c.cx };
  },

  in(ctx, tl, { x }) {
    const bb = ctx.scene.querySelector(".bb .box");
    if (bb) {
      const nat = takeOver(ctx, bb);
      gsap.set(bb, { x: x - nat.cx, y: -(nat.cy + 220), scaleX: 0.85, scaleY: 1.2, transformOrigin: "50% 100%" });
      tl.to(bb, { x: 0, duration: 0.6, ease: "power2.out" }, 0.2);
      tl.to(bb, { y: 0, scaleX: 0.9, scaleY: 1.12, duration: 0.6, ease: "power2.in" }, 0.2);
      land(tl, bb, 0.8);
    }
    tl.call(() => void ctx.tl.play(0), [], 0);
  },
});
