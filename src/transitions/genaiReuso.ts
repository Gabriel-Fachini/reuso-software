import { gsap } from "../engine/gsap";
import { cssVar } from "../engine/tokens";
import { defineTransition, exitText, land, takeOver } from "../engine/transition";

/*
 * 13 → 14  "O vocabulário vira abstração"
 *
 * out: lightning, Frankenstein falls apart; the good buttons are pulled back
 *      into the DS harness, which keeps its vocabulary chips, crouches and lifts.
 * in:  a copy of that harness flies on an arc into the first facet card,
 *      "Abstração", sheds its chips and becomes the card.
 */
type State = { clone: HTMLElement | null };

export const genaiReuso = defineTransition<State>({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    const bolt = $(".bolt-inner");
    gsap.killTweensOf(bolt);
    tl.to(bolt, { opacity: 0.2, duration: 0.05, repeat: 5, yoyo: true, ease: "steps(1)" }, 0);
    exitText(tl, scene, ".b-title", 0);
    tl.to($(".b-title"), { autoAlpha: 0, duration: 0.2 }, 0.3);
    tl.to($(".left .row, .left .side-title, .left .verdict"), { x: () => gsap.utils.random(-8, 8), duration: 0.05, repeat: 3, yoyo: true, ease: "none" }, 0.1);
    // Frankenstein falls apart quickly, so the harness can fly without waiting
    tl.to($(".left .side-title, .left .row, .left .verdict"), {
      y: "+=900",
      rotation: () => gsap.utils.random(-40, 40),
      duration: 0.6,
      ease: "power2.in",
      stagger: 0.04,
    }, 0.2);
    tl.to($(".right .side-title, .right .prompt, .right .arrow, .right .verdict"), { x: -60, autoAlpha: 0, duration: 0.4, ease: "power2.in", stagger: 0.03 }, 0.1);

    const h = scene.querySelector<HTMLElement>(".harness");
    if (!h) return { clone: null };
    const hb = box(h);
    // the good outputs are pulled back into the harness
    $(".right .out").forEach((o, i) => {
      const b = box(o);
      tl.to(o, { x: hb.cx - b.cx, y: hb.cy - b.cy, scale: 0.2, autoAlpha: 0, duration: 0.45, ease: "back.in(1.6)" }, 0.2 + i * 0.06);
    });

    const clone = h.cloneNode(true) as HTMLElement;
    Object.assign(clone.style, { position: "absolute", left: `${hb.x}px`, top: `${hb.y}px`, width: `${hb.w}px`, height: `${hb.h}px`, margin: "0" });
    clone.querySelectorAll<HTMLElement>("*").forEach((el) => (el.style.transform = "none"));
    layer.append(clone);
    gsap.set(clone, { autoAlpha: 0, transformOrigin: "50% 100%" });
    tl.set(clone, { autoAlpha: 1 }, 0.5);
    tl.set(h, { autoAlpha: 0 }, 0.5);
    // anticipation: crouch, then a small lift
    tl.to(clone, { scaleX: 1.08, scaleY: 0.9, duration: 0.18, ease: "power2.out" }, 0.55);
    tl.to(clone, { scaleX: 0.97, scaleY: 1.04, y: -24, duration: 0.25, ease: "power2.out" }, 0.73);
    return { clone };
  },

  in(ctx, tl, { clone }) {
    const card = ctx.scene.querySelector(".fc-0");
    tl.call(() => void ctx.tl.play(0), [], 0);
    if (!clone) return;
    if (!card) {
      tl.to(clone, { autoAlpha: 0, duration: 0.3 }, 0);
      return;
    }
    const nat = takeOver(ctx, card);
    gsap.set(card, { autoAlpha: 0 });
    const inner = clone.firstElementChild as HTMLElement | null;
    if (inner) {
      tl.to(inner.children, { autoAlpha: 0, y: -10, duration: 0.25, stagger: 0.03, ease: "power2.in" }, 0);
      tl.to(inner, { backgroundColor: cssVar("--color-surface"), duration: 0.6 }, 0.2);
    }
    // arc: x and y with different eases
    tl.to(clone, { left: nat.x, width: nat.w, duration: 0.85, ease: "power3.inOut" }, 0.05);
    tl.to(clone, { top: nat.y, height: nat.h, y: 0, duration: 0.85, ease: "power2.inOut" }, 0.05);
    tl.to(clone, { scaleX: 1, scaleY: 1, borderRadius: 24, duration: 0.4 }, 0.05);
    tl.fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, 0.8);
    tl.to(clone, { autoAlpha: 0, duration: 0.3 }, 0.85);
    land(tl, card, 0.9);
  },
});
