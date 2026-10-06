import { gsap } from "../engine/gsap";
import { defineTransition, exitText, fallOut, morphTo, panel, swap, takeOver } from "../engine/transition";

/*
 * 5 → 6  "A caixa-branca se abre em átomos"
 *
 * out: everything falls away except the white box, which shivers and splits
 *      into four pieces that drift apart.
 * in:  each piece flies into the "Átomos" card and becomes one of its atoms
 *      (text, color, input, button).
 */
export const caixasAtomic = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    exitText(tl, scene, ".title", 0);
    tl.to($(".flow-arrow"), { drawSVG: "100% 100%", duration: 0.4, ease: "power2.in" }, 0);
    tl.to($(".packet"), { autoAlpha: 0, duration: 0.1 }, 0);
    fallOut(
      tl,
      $(".bb .side-title, .bb .code-card, .bb .box, .bb .out, .bb .verdict, .wb .side-title, .wb .code-card, .wb .out, .wb .verdict, .spectrum"),
      0.05,
      { each: 0.04 },
    );

    const wb = scene.querySelector(".wb .box");
    const b = wb ? box(wb) : { x: 1300, y: 400, w: 170, h: 170 };
    const q = b.w / 2;
    if (wb) tl.to(wb, { rotation: 4, duration: 0.05, repeat: 5, yoyo: true, ease: "none" }, 0.2);
    const pieces = [0, 1, 2, 3].map((i) =>
      panel(layer, { cx: b.x + q / 2 + (i % 2) * q, cy: b.y + q / 2 + Math.floor(i / 2) * q, w: q, h: q }, "var(--gradient-ui)", 18),
    );
    tl.set(pieces, { autoAlpha: 1 }, 0.55);
    if (wb) tl.set(wb, { autoAlpha: 0 }, 0.55);
    pieces.forEach((p, i) => {
      const sx = i % 2 ? 1 : -1;
      const sy = i < 2 ? -1 : 1;
      tl.to(p, { x: `+=${sx * 60}`, y: `+=${sy * 60}`, rotation: sx * sy * 18, duration: 0.6, ease: "back.out(2)" }, 0.55);
    });
    return { pieces };
  },

  in(ctx, tl, { pieces }) {
    const bits = [...ctx.scene.querySelectorAll(".stage-0 .bit")];
    const frame = ctx.scene.querySelector(".stage-0 .frame");
    // the card is still at its rise() start offset: aim where it will settle
    const dy = frame ? Number(gsap.getProperty(frame, "y")) : 0;
    pieces.forEach((p, i) => {
      const bit = bits[i];
      if (!bit) {
        tl.to(p, { scale: 0, duration: 0.3 }, 0);
        return;
      }
      const nat = takeOver(ctx, bit);
      gsap.set(bit, { autoAlpha: 0 });
      const at = 0.7 + i * 0.1;
      const radius = [12, nat.w / 2, nat.h / 2, nat.h / 2][i];
      morphTo(tl, p, { cx: nat.cx, cy: nat.cy - dy, w: nat.w, h: nat.h }, at, { duration: 0.65, radius });
      tl.to(p, { rotation: 0, duration: 0.65, ease: "power2.out" }, at);
      swap(tl, p, bit, at + 0.6);
      tl.fromTo(bit, { scale: 0.7 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)", immediateRender: false }, at + 0.6);
    });
    tl.call(() => void ctx.tl.play(0), [], 0);
  },
});
