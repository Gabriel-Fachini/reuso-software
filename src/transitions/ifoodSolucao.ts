import { gsap } from "../engine/gsap";
import { defineTransition, exitText, inside, morphTo, panel, popOut, swap, takeOver } from "../engine/transition";

/*
 * 10 → 11  "A força-tarefa vira a base comum"
 *
 * out: the problems slide out; Tech and Design slide into each other and
 *      merge into one disc.
 * in:  the disc flattens into the "Biblioteca React" card — the common base —
 *      and the architecture grows around it. The eyebrow stays put: same block.
 */
export const ifoodSolucao = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    exitText(tl, scene, ".c-title, .insight", 0);
    tl.to($(".prob li"), { x: -80, autoAlpha: 0, duration: 0.4, ease: "power2.in", stagger: 0.06 }, 0);
    popOut(tl, $(".venn-mid"), 0);
    tl.to($(".venn-shape span"), { autoAlpha: 0, duration: 0.2 }, 0.05);

    const a = scene.querySelector(".venn-a");
    const b = scene.querySelector(".venn-b");
    const ba = a ? box(a) : { cx: 1200, cy: 600, w: 320 };
    const bb = b ? box(b) : ba;
    const m = { cx: (ba.cx + bb.cx) / 2, cy: (ba.cy + bb.cy) / 2 };
    if (a) tl.to(a, { x: `+=${m.cx - ba.cx}`, duration: 0.55, ease: "back.in(1.4)" }, 0.15);
    if (b) tl.to(b, { x: `+=${m.cx - bb.cx}`, duration: 0.55, ease: "back.in(1.4)" }, 0.15);

    const disc = panel(layer, { cx: m.cx, cy: m.cy, w: ba.w, h: ba.w }, "var(--gradient-lipstick)", ba.w / 2);
    const card = inside(disc, { background: "var(--color-surface)", opacity: "0" });
    tl.set(disc, { autoAlpha: 1 }, 0.7);
    tl.set([a, b].filter(Boolean), { autoAlpha: 0 }, 0.7);
    tl.fromTo(disc, { scaleX: 1.35, scaleY: 0.7 }, { scaleX: 1, scaleY: 1, duration: 0.4, ease: "back.out(2.5)" }, 0.7);
    return { disc, card };
  },

  in(ctx, tl, { disc, card }) {
    const eyebrow = ctx.scene.querySelector(".eyebrow");
    if (eyebrow) takeOver(ctx, eyebrow);
    const react = ctx.scene.querySelector(".n-react");
    if (!react) {
      tl.to(disc, { autoAlpha: 0, duration: 0.3 }, 0);
      return;
    }
    const nat = takeOver(ctx, react);
    gsap.set(react, { autoAlpha: 0 });
    morphTo(tl, disc, nat, 0, { duration: 0.75, radius: 24, ease: "power3.inOut" });
    tl.to(card, { opacity: 1, duration: 0.45 }, 0.25);
    swap(tl, disc, react, 0.75, 0.2);
    tl.call(() => void ctx.tl.play(0), [], 0);
  },
});
