import { gsap } from "../engine/gsap";
import { circle, defineTransition, firstTweenTime, vortex } from "../engine/transition";

/*
 * 2 → 3  "A bagunça converge na fonte única"
 *
 * out: the faded chaos lights back up and trembles (anticipation); then the
 *      question, the shapes and every off-brand button spiral into a vortex
 *      that condenses them into one orange core: "Style guide".
 * in:  the core crouches, jumps to its place in the diagram (stretch in the
 *      air, squash on landing) and the scene's rings draw around it.
 *
 * The core must look like scene 3's `.inner-shape`; the overlay copy is
 * swapped for the real element on the first frame of the new scene.
 */
const V = { x: 960, y: 540 }; // vortex center

export const caosDefinicao = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    const chaos = scene.querySelector(".chaos");
    const pieces = $(".chaos-piece");
    const words = $(".question .split-line > div, .question .split-line > .mark");

    // words must be able to leave their line masks
    gsap.set($(".question .split-line-mask"), { overflow: "visible" });
    if (chaos) gsap.set(chaos, { scale: 1 });

    // the mess wakes up and trembles
    if (chaos) tl.to(chaos, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0);
    tl.to([...pieces, ...words], {
      x: () => gsap.utils.random(-7, 7),
      y: () => gsap.utils.random(-5, 5),
      duration: 0.06,
      repeat: 5,
      yoyo: true,
      ease: "none",
    }, 0.05);

    // vortex: the far things take longer to arrive
    vortex(tl, [...pieces, ...$(".q-deco"), ...words], V, box, 0.45, { turns: 0.9, duration: 1.15 });

    // accretion rings show the spin
    [760, 1080].forEach((d, i) => {
      const ring = circle(layer, V, d, "transparent");
      ring.style.border = "2px dashed var(--color-border)";
      tl.set(ring, { autoAlpha: 1 }, 0.4);
      tl.to(ring, { width: 250, height: 250, rotation: i ? -200 : 240, duration: 1.2, ease: "power2.in" }, 0.4);
      tl.to(ring, { autoAlpha: 0, duration: 0.2 }, 1.45);
    });

    // the core condenses, gulping as pieces arrive
    const core = circle(layer, V, 250, "var(--gradient-tangerine)");
    Object.assign(core.style, {
      display: "grid",
      placeItems: "center",
      color: "var(--color-just-black)",
      fontSize: "30px",
      fontWeight: "600",
    });
    const label = document.createElement("span");
    label.textContent = "Style guide";
    core.append(label);
    gsap.set(label, { autoAlpha: 0 });
    tl.set(core, { autoAlpha: 1 }, 0.7);
    tl.fromTo(core, { scale: 0 }, {
      keyframes: [
        { scale: 0.35, duration: 0.25, ease: "back.out(2)" },
        { scaleX: 0.55, scaleY: 0.48, duration: 0.25, ease: "power2.out" },
        { scaleX: 0.78, scaleY: 0.86, duration: 0.25, ease: "power2.out" },
        { scaleX: 1.12, scaleY: 0.9, duration: 0.15, ease: "power2.out" },
        { scaleX: 1, scaleY: 1, duration: 0.3, ease: "power2.out" },
      ],
    }, 0.7);
    tl.to(label, { autoAlpha: 1, duration: 0.3 }, 1.4);

    return { core };
  },

  in({ scene, box, tl: sceneTl }, tl, { core }) {
    const inner = scene.querySelector<HTMLElement>(".inner");
    if (!inner) {
      tl.to(core, { scale: 0, duration: 0.3, ease: "back.in(2)" }, 0);
      return;
    }
    // this transition delivers the core: drop the scene's own pop for it
    sceneTl.getTweensOf(inner).forEach((t) => t.kill());

    // swap the overlay copy for the real element, at the same spot
    gsap.set(inner, { autoAlpha: 1, scale: 1, x: 0, y: 0 });
    const b = box(inner);
    gsap.set(inner, { x: V.x - b.cx, y: V.y - b.cy, transformOrigin: "50% 100%" });
    core.remove();

    // crouch → jump on an arc → land with a squash → settle
    tl.to(inner, { scaleX: 1.14, scaleY: 0.82, duration: 0.2, ease: "power2.out" }, 0.05);
    tl.to(inner, { x: 0, duration: 0.62, ease: "power1.inOut" }, 0.25);
    tl.to(inner, { y: -170 + (V.y - b.cy) / 2, duration: 0.31, ease: "power2.out" }, 0.25);
    tl.to(inner, { y: 0, duration: 0.31, ease: "power2.in" }, 0.56);
    tl.to(inner, { scaleX: 0.88, scaleY: 1.14, duration: 0.25, ease: "power2.out" }, 0.25);
    tl.to(inner, { scaleX: 1.2, scaleY: 0.8, duration: 0.1, ease: "power2.out" }, 0.87);
    tl.to(inner, { scaleX: 1, scaleY: 1, duration: 0.8, ease: "elastic.out(1, 0.45)" }, 0.97);
    tl.set(inner, { transformOrigin: "50% 50%" });

    // the scene starts as the core lands: title, then its rings draw around it
    const coreAt = firstTweenTime(sceneTl, scene.querySelector(".ring-mid"), 1.4);
    tl.call(() => void sceneTl.play(0), [], Math.max(0, 0.87 - Math.max(0, coreAt - 1.0)));
  },
});
