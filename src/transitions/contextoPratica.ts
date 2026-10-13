import { gsap } from "../engine/gsap";
import { defineTransition, exitText, fallOut, inside, panel, popOut } from "../engine/transition";
import { harnessInto } from "./genaiPratica";

/*
 * 15 → 16  "O servidor vira contexto"
 *
 * out: the staircase falls, the agent pops away; the MCP server empties and
 *      only its macha frame is left, which moves to the centre.
 * in:  that frame grows into the first card, "Docs como contexto" (harnessInto).
 */
export const contextoPratica = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    exitText(tl, scene, ".title, .punch", 0);
    fallOut(tl, $(".st, .axis"), 0.05, { each: 0.06 });
    popOut(tl, $(".climber"), 0);
    tl.to($(".mcp > .col > *"), { autoAlpha: 0, y: -10, duration: 0.3, stagger: 0.02, ease: "power2.in" }, 0.05);

    const mcp = scene.querySelector(".mcp");
    const mb = mcp ? box(mcp) : { cx: 1440, cy: 540, w: 720, h: 500 };
    const frame = panel(layer, mb, "var(--gradient-macha)", 26);
    const fill = inside(frame, { inset: "3px", borderRadius: "23px", background: "var(--color-bg)" });
    tl.set(frame, { autoAlpha: 1 }, 0.45);
    if (mcp) tl.set(mcp, { autoAlpha: 0 }, 0.45);
    tl.to(frame, { x: 960, y: 560, duration: 0.55, ease: "power3.inOut" }, 0.5);
    tl.to(frame, { scaleX: 1.08, scaleY: 0.92, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }, 0.5);
    gsap.set(frame, { zIndex: 1 });
    return { frame, fill };
  },

  in: harnessInto(".pc-1"),
});
