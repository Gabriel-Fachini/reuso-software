import { gsap } from "../engine/gsap";
import { defineTransition, exitText, inside, land, panel, takeOver } from "../engine/transition";

/*
 * 6 → 7  "As peças viram o núcleo comum"
 *
 * out: the five cards are gathered onto the first one like a deck of cards;
 *      the deck turns green and shrinks into the "núcleo comum" block.
 * in:  the core hops to its place and the product line branches out of it.
 */
const coreText = (el: HTMLElement) => {
  const t = inside(el, { color: "var(--color-just-black)", textAlign: "center", padding: "20px", opacity: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" });
  t.innerHTML =
    '<span style="font-size:16px;font-weight:600;letter-spacing:0.04em;opacity:0.7">NÚCLEO COMUM</span>' +
    '<span style="font-size:30px;font-weight:600;line-height:1.1;margin-top:8px">tokens + componentes</span>';
  return t;
};

export const atomicLinhas = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    exitText(tl, scene, ".title, .sub", 0);
    tl.to($(".caption, .bracket-labels > *"), { y: 30, autoAlpha: 0, duration: 0.35, ease: "power2.in", stagger: 0.03 }, 0);
    tl.to($(".bracket"), { scaleX: 0, transformOrigin: "100% 50%", duration: 0.5, ease: "power3.in" }, 0.05);
    tl.to($('[class^="arrow-"]'), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.25, ease: "power2.in" }, 0.05);

    const frames = $(".frame");
    const b0 = frames[0] ? box(frames[0]) : { cx: 260, cy: 520, w: 280, h: 330 };
    frames.forEach((f, i) => {
      if (!i) return;
      const b = box(f);
      tl.to(f, { x: b0.cx - b.cx, rotation: gsap.utils.random(-7, 7), duration: 0.55, ease: "power3.inOut" }, 0.2 + (frames.length - 1 - i) * 0.07);
    });

    const core = panel(layer, b0, "var(--color-off-black)", 24);
    const fill = inside(core, { background: "var(--gradient-core)", opacity: "0" });
    const text = coreText(core);
    tl.set(core, { autoAlpha: 1, rotation: 0 }, 0.95);
    tl.set(frames, { autoAlpha: 0 }, 0.95);
    tl.to(core, { width: 240, height: 220, borderRadius: 40, duration: 0.5, ease: "back.out(1.8)" }, 0.95);
    tl.to(fill, { opacity: 1, duration: 0.35 }, 0.95);
    tl.to(text, { opacity: 1, duration: 0.3 }, 1.2);
    return { core };
  },

  in(ctx, tl, { core }) {
    const el = ctx.scene.querySelector(".core");
    if (!el) {
      tl.to(core, { autoAlpha: 0, duration: 0.3 }, 0);
      return;
    }
    const nat = takeOver(ctx, el);
    const x0 = Number(gsap.getProperty(core, "x")) - nat.cx;
    const y0 = Number(gsap.getProperty(core, "y")) - nat.cy;
    gsap.set(el, { x: x0, y: y0, transformOrigin: "50% 100%" });
    core.remove();
    tl.to(el, { scaleX: 1.1, scaleY: 0.85, duration: 0.15, ease: "power2.out" }, 0.1);
    tl.to(el, { x: 0, duration: 0.55, ease: "power1.inOut" }, 0.25);
    tl.to(el, { y: Math.min(y0, 0) - 120, duration: 0.27, ease: "power2.out" }, 0.25);
    tl.to(el, { y: 0, duration: 0.28, ease: "power2.in" }, 0.52);
    tl.to(el, { scaleX: 0.92, scaleY: 1.1, duration: 0.25, ease: "power2.out" }, 0.25);
    land(tl, el, 0.8);
    tl.call(() => void ctx.tl.play(0), [], 0);
  },
});
