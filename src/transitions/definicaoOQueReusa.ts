import { gsap } from "../engine/gsap";
import { defineTransition, exitText, inside, land, panel, popOut, takeOver } from "../engine/transition";

/*
 * 3 → 4  "O núcleo vira camada"
 *
 * out: the rings un-draw, satellites and badges pop away; the "Style guide"
 *      core crouches and stretches into a flat orange pill: "Design tokens".
 * in:  while the stack builds from the base, the pill floats aside, then hops
 *      into its slot in the middle of the stack and lands with a squash.
 */
export const definicaoOQueReusa = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    exitText(tl, scene, ".title, .def, .lg-0, .lg-1, .lg-2, .refs", 0);
    gsap.killTweensOf($(".ripple"));
    popOut(tl, $(".badge-mid, .badge-out, .s-deco"), 0.05, { stagger: 0.03 });
    tl.to($(".sat-mid, .sat-out, .ripple"), { autoAlpha: 0, duration: 0.25, stagger: 0.02 }, 0.05);
    tl.to($(".ring-out, .ring-mid"), { drawSVG: "50% 50%", duration: 0.6, ease: "power2.in", stagger: 0.12 }, 0.15);

    const inner = scene.querySelector(".inner");
    const c = inner ? box(inner) : { cx: 1420, cy: 554, w: 250, h: 250 };
    if (inner) tl.to(inner, { scaleX: 1.12, scaleY: 0.86, duration: 0.25, ease: "power2.inOut" }, 0.3);

    const pill = panel(layer, { cx: c.cx, cy: c.cy, w: 250, h: 250 }, "var(--gradient-tangerine)", 125);
    const fill = inside(pill, { background: "var(--gradient-orange-crush)", opacity: "0" });
    const was = inside(pill, { color: "var(--color-just-black)", fontSize: "30px", fontWeight: "600" }, "Style guide");
    const now = inside(
      pill,
      { color: "var(--color-just-black)", fontSize: "32px", fontWeight: "600", letterSpacing: "-0.015em", opacity: "0" },
      "Design tokens",
    );
    tl.set(pill, { autoAlpha: 1 }, 0.55);
    if (inner) tl.set(inner, { autoAlpha: 0 }, 0.55);
    tl.to(was, { autoAlpha: 0, duration: 0.15 }, 0.55);
    tl.to(pill, { width: 650, height: 80, borderRadius: 22, duration: 0.6, ease: "back.out(1.6)" }, 0.6);
    tl.to(fill, { opacity: 1, duration: 0.35 }, 0.6);
    tl.to(now, { opacity: 1, duration: 0.3 }, 0.95);
    return { pill };
  },

  in(ctx, tl, { pill }) {
    const slab = ctx.scene.querySelector(".slab-2");
    if (!slab) {
      tl.to(pill, { autoAlpha: 0, duration: 0.3 }, 0);
      return;
    }
    const nat = takeOver(ctx, slab);
    const x0 = Number(gsap.getProperty(pill, "x")) - nat.cx;
    const y0 = Number(gsap.getProperty(pill, "y")) - nat.cy;
    gsap.set(slab, { x: x0, y: y0, transformOrigin: "50% 100%" });
    pill.remove();

    // waits aside (bobbing) while the base of the stack drops in
    tl.to(slab, { y: y0 - 14, duration: 0.55, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0.05);
    // crouch → hop on an arc → land on the slab below
    const hop = 1.3;
    const apex = Math.min(y0, 0) - 170;
    tl.to(slab, { scaleX: 1.08, scaleY: 0.75, duration: 0.15, ease: "power2.out" }, hop - 0.15);
    tl.to(slab, { x: 0, duration: 0.6, ease: "power1.inOut" }, hop);
    tl.to(slab, { y: apex, duration: 0.3, ease: "power2.out" }, hop);
    tl.to(slab, { y: 0, duration: 0.3, ease: "power2.in" }, hop + 0.3);
    tl.to(slab, { scaleX: 0.94, scaleY: 1.12, duration: 0.25, ease: "power2.out" }, hop);
    land(tl, slab, hop + 0.6);
    tl.call(() => void ctx.tl.play(0), [], 0);
  },
});
