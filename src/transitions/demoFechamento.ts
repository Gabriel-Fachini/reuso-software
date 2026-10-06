import { gsap } from "../engine/gsap";
import { defineTransition, exitText, popOut, takeOver } from "../engine/transition";

/*
 * 14 → 15  "O produto se parte em desafios"
 *
 * out: the token editor slides away; the product is sliced into five
 *      vertical strips that pull apart and tilt.
 * in:  each strip flies to one of the five challenge cards and becomes it.
 */
const N = 5;

export const demoFechamento = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    exitText(tl, scene, ".title", 0);
    tl.to($(".demo-panel"), { x: -140, autoAlpha: 0, duration: 0.5, ease: "back.in(1.6)" }, 0.05);
    popOut(tl, $(".x-deco, .flash"), 0);

    const app = scene.querySelector<HTMLElement>(".demo-app");
    if (!app) return { slices: [] as HTMLElement[], a: null };
    const a = box(app);
    const slices = Array.from({ length: N }, (_, i) => {
      const wrap = document.createElement("div");
      Object.assign(wrap.style, {
        position: "absolute",
        left: `${a.x}px`,
        top: `${a.y}px`,
        width: `${a.w}px`,
        height: `${a.h}px`,
        clipPath: `inset(0 ${100 - ((i + 1) * 100) / N}% 0 ${(i * 100) / N}%)`,
      });
      const copy = app.cloneNode(true) as HTMLElement;
      copy.style.transform = "none";
      wrap.append(copy);
      layer.append(wrap);
      gsap.set(wrap, { autoAlpha: 0, transformOrigin: `${((i + 0.5) * 100) / N}% 50%` });
      return wrap;
    });
    tl.set(slices, { autoAlpha: 1 }, 0.35);
    tl.set(app, { autoAlpha: 0 }, 0.35);
    slices.forEach((s, i) => {
      const k = i - (N - 1) / 2;
      tl.to(s, { x: k * 40, y: (i % 2 ? 1 : -1) * 24, rotation: k * 3, duration: 0.45, ease: "back.out(2.2)" }, 0.4 + Math.abs(k) * 0.04);
    });
    return { slices, a };
  },

  in(ctx, tl, { slices, a }) {
    const cards = [...ctx.scene.querySelectorAll(".ch")];
    if (a) {
      const sw = a.w / N;
      slices.forEach((s, i) => {
        const card = cards[i];
        if (!card) return void tl.to(s, { autoAlpha: 0, duration: 0.3 }, 0);
        const nat = takeOver(ctx, card);
        gsap.set(card, { autoAlpha: 0 });
        const from = { x: a.x + (i + 0.5) * sw, y: a.cy };
        const at = i * 0.07;
        tl.to(s, {
          x: nat.cx - from.x,
          y: nat.cy - from.y,
          scaleX: nat.w / sw,
          scaleY: nat.h / a.h,
          rotation: 0,
          duration: 0.75,
          ease: "power2.inOut",
        }, at);
        tl.fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, immediateRender: false }, at + 0.6);
        tl.to(s, { autoAlpha: 0, duration: 0.25 }, at + 0.65);
      });
    }
    tl.call(() => void ctx.tl.play(0), [], 0);
  },
});
