import { gsap } from "../engine/gsap";
import { defineTransition, exitText, fallOut, inside, morphTo, panel, swap, takeOver } from "../engine/transition";
import type { TransitionInCtx } from "../engine/transition";

type Harness = { frame: HTMLElement; fill: HTMLElement };

/** in(): the harness frame (a macha-bordered panel) grows into a card of the scene. */
export function harnessInto(selector: string) {
  return (ctx: TransitionInCtx, tl: gsap.core.Timeline, { frame, fill }: Harness) => {
    const card = ctx.scene.querySelector(selector);
    if (!card) {
      tl.to(frame, { autoAlpha: 0, duration: 0.3 }, 0);
      tl.call(() => void ctx.tl.play(0), [], 0);
      return;
    }
    const nat = takeOver(ctx, card);
    gsap.set(card, { autoAlpha: 0 });
    morphTo(tl, frame, nat, 0, { duration: 0.7, radius: 24, ease: "power3.inOut" });
    tl.to(fill, { inset: "0px", borderRadius: "24px", background: "var(--color-surface)", duration: 0.45 }, 0.25);
    swap(tl, frame, card, 0.7, 0.2);
    tl.call(() => void ctx.tl.play(0), [], 0);
  };
}

/*
 * Was 13 → 14  "O harness vira contexto". Not registered anymore: its out() is
 * reused by 13 → 14 (genaiReuso) and its in() (harnessInto) by 15 → 16.
 *
 * out: the lightning strikes again and the Frankenstein side falls apart;
 *      the good outputs slide away and only the DS harness is left.
 * in:  the harness grows into the first card.
 */
export const genaiPratica = defineTransition<Harness>({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    const bolt = $(".bolt-inner");
    gsap.killTweensOf(bolt);
    tl.to(bolt, { opacity: 0.2, duration: 0.05, repeat: 5, yoyo: true, ease: "steps(1)" }, 0);
    exitText(tl, scene, ".b-title", 0);
    tl.to($(".left .row, .left .side-title, .left .verdict"), { x: () => gsap.utils.random(-8, 8), duration: 0.05, repeat: 3, yoyo: true, ease: "none" }, 0.1);
    fallOut(tl, $(".left .side-title, .left .row, .left .verdict"), 0.3, { each: 0.06 });
    tl.to($(".right .side-title, .right .prompt, .right .arrow, .right .out, .right .verdict"), { x: 90, autoAlpha: 0, duration: 0.45, ease: "power2.in", stagger: 0.03 }, 0.2);

    const h = scene.querySelector(".harness");
    const hb = h ? box(h) : { cx: 1400, cy: 600, w: 196, h: 330 };
    const frame = panel(layer, hb, "var(--gradient-macha)", 22);
    const fill = inside(frame, { inset: "3px", borderRadius: "19px", background: "var(--color-bg)" });
    tl.set(frame, { autoAlpha: 1 }, 0.55);
    if (h) tl.set(h, { autoAlpha: 0 }, 0.55);
    tl.to(frame, { x: 960, y: 560, duration: 0.5, ease: "power3.inOut" }, 0.5);
    tl.to(frame, { scaleX: 1.12, scaleY: 0.9, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }, 0.5);
    return { frame, fill };
  },

  in: harnessInto(".pc-1"),
});
