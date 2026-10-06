import { gsap } from "../engine/gsap";
import { defineTransition, exitText, inside, morphTo, panel, pull, swap, takeOver } from "../engine/transition";

/*
 * 7 → 8  "O núcleo comum é dado"
 *
 * out: the chart un-draws; the products are pulled back along their branches
 *      into the core, which gulps them.
 * in:  the core opens up into the tokens.json source: green block becomes a
 *      code block, and the token pipeline starts from it.
 */
export const linhasTokens = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    exitText(tl, scene, ".title, .spl-title, .cb-title, .spl-note", 0);
    tl.to($(".l-sem, .l-com, .axis"), { drawSVG: "0% 0%", duration: 0.5, ease: "power2.in", stagger: 0.05 }, 0.05);
    tl.to($(".gain, .be, .be-pulse, .axis-text, .lab-sem, .lab-com, .be-label"), { autoAlpha: 0, duration: 0.3 }, 0.05);

    const coreEl = scene.querySelector(".core");
    const c = coreEl ? box(coreEl) : { cx: 240, cy: 500, w: 240, h: 220 };
    tl.to($(".branch"), { drawSVG: "0% 0%", duration: 0.5, ease: "power2.in", stagger: 0.06 }, 0.3);
    pull(tl, $(".product"), { x: c.cx, y: c.cy }, box, 0.15, { duration: 0.55, each: 0.08 });
    if (coreEl) {
      [0.55, 0.63, 0.71].forEach((t) =>
        tl.to(coreEl, { scaleX: 1.08, scaleY: 0.92, duration: 0.07, yoyo: true, repeat: 1, ease: "power1.out" }, t),
      );
    }

    const blk = panel(layer, c, "var(--gradient-core)", 40);
    const text = inside(blk, { color: "var(--color-just-black)", textAlign: "center", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" });
    text.innerHTML =
      '<span style="font-size:16px;font-weight:600;letter-spacing:0.04em;opacity:0.7">NÚCLEO COMUM</span>' +
      '<span style="font-size:30px;font-weight:600;line-height:1.1;margin-top:8px">tokens + componentes</span>';
    const code = inside(blk, { background: "var(--color-bg)", border: "1px solid var(--color-border)", opacity: "0" });
    tl.set(blk, { autoAlpha: 1 }, 0.95);
    if (coreEl) tl.set(coreEl, { autoAlpha: 0 }, 0.95);
    return { blk, text, code };
  },

  in(ctx, tl, { blk, text, code }) {
    const source = ctx.scene.querySelector(".source");
    if (!source) {
      tl.to(blk, { autoAlpha: 0, duration: 0.3 }, 0);
      return;
    }
    const nat = takeOver(ctx, source);
    gsap.set(source, { autoAlpha: 0 });
    tl.to(text, { opacity: 0, duration: 0.2 }, 0);
    tl.to(blk, { scaleX: 0.9, scaleY: 1.1, duration: 0.15, ease: "power2.out" }, 0);
    tl.to(blk, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }, 0.75);
    morphTo(tl, blk, nat, 0.1, { duration: 0.65, radius: 12, ease: "back.inOut(1.2)" });
    tl.to(code, { opacity: 1, duration: 0.4 }, 0.3);
    swap(tl, blk, source, 0.75, 0.25);
    tl.call(() => void ctx.tl.play(0), [], 0);
  },
});
