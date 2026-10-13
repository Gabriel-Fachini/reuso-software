import { gsap } from "../engine/gsap";
import { defineTransition, exitText, inside, land, morphTo, panel, swap, takeOver } from "../engine/transition";

/*
 * 14 → 15  "A seleção vira o agente"
 *
 * out: the dimmed facets drop away; the spotlit "Seleção" card shrinks into
 *      the agent's token (purple, "AI").
 * in:  the token flies to the foot of the staircase and lands; the agent
 *      then climbs it in the scene's own timeline.
 */
export const reusoContexto = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    exitText(tl, scene, ".title, .sub, .punch-1, .punch-2", 0);
    tl.to($(".fc-0, .fc-2, .fc-3"), { y: 60, autoAlpha: 0, duration: 0.45, ease: "power2.in", stagger: 0.05 }, 0);
    tl.to($(".flow-arrow, .spot"), { autoAlpha: 0, duration: 0.2 }, 0);

    const card = scene.querySelector(".fc-1");
    const b = card ? box(card) : { cx: 740, cy: 590, w: 390, h: 420 };
    const tok = panel(layer, b, "var(--color-surface)", 24);
    const grad = inside(tok, { background: "var(--gradient-purple-haze)", opacity: "0" });
    const txt = inside(
      tok,
      { color: "var(--color-just-black)", fontFamily: "var(--font-mono)", fontSize: "21px", fontWeight: "700", opacity: "0" },
      "AI",
    );
    tl.set(tok, { autoAlpha: 1 }, 0.25);
    if (card) tl.set(card, { autoAlpha: 0 }, 0.25);
    tl.to(tok, { scaleX: 1.06, scaleY: 0.94, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }, 0.25);
    tl.to(tok, { width: 56, height: 56, borderRadius: 16, duration: 0.6, ease: "power3.inOut" }, 0.45);
    tl.to(grad, { opacity: 1, duration: 0.3 }, 0.65);
    tl.to(txt, { opacity: 1, duration: 0.2 }, 0.9);
    return { tok };
  },

  in(ctx, tl, { tok }) {
    const el = ctx.scene.querySelector(".climber-in");
    if (!el) {
      tl.to(tok, { autoAlpha: 0, duration: 0.3 }, 0);
      return;
    }
    const nat = takeOver(ctx, el);
    gsap.set(el, { autoAlpha: 0 });
    morphTo(tl, tok, nat, 0, { duration: 0.8, radius: 16, ease: "power3.inOut" });
    land(tl, tok, 0.8);
    swap(tl, tok, el, 1.1, 0.15);
    tl.call(() => void ctx.tl.play(0), [], 0.3);
  },
});
