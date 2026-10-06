import { gsap } from "../engine/gsap";
import { circle, coverDiameter, defineTransition, firstTweenTime, pull } from "../engine/transition";

/*
 * 1 → 2  "A paleta vira squads"
 *
 * out: the cover's type leaves up through its masks; every UI piece and shape
 *      is sucked into the green swatch, which swells, contracts (anticipation)
 *      and bursts into three waves of color — orange, purple, green — that
 *      flood the stage.
 * in:  the green flood closes like an iris into a drop over the squad grid;
 *      the drop hits (squash), splashes (ripple) and the squads burst out of
 *      the impact point, center first.
 */
export const capaCaos = defineTransition({
  out({ scene, layer, box }, tl) {
    const $ = (s: string) => [...scene.querySelectorAll(s)];
    const swatches = $(".swatch");
    const core = swatches[1] ?? swatches[0];
    const c = core ? { x: box(core).cx, y: box(core).cy } : { x: 1440, y: 340 };
    if (core) gsap.killTweensOf(swatches); // breathe() loops fight the scale below

    // type leaves through the line masks, like the gsap.com headers
    tl.to($(".hero .split-line > div"), {
      yPercent: -150,
      rotation: -8,
      duration: 0.55,
      ease: "power3.in",
      stagger: 0.025,
    }, 0);
    tl.to($(".sub .split-line > *"), { yPercent: -150, duration: 0.5, ease: "power3.in", stagger: 0.04 }, 0.15);
    tl.to($(".eyebrow, .names"), { y: -30, autoAlpha: 0, duration: 0.45, ease: "power2.in" }, 0.05);

    // the rest of the system gets pulled into the green swatch
    const pulled = [
      ...$(".ui-piece").filter((p) => !core || !p.contains(core)),
      ...$(".deco"),
      ...swatches.filter((s) => s !== core),
    ];
    pull(tl, pulled, c, box, 0.1, { duration: 0.55, each: 0.03 });

    // the swatch gulps everything (swells), gathers itself, then bursts
    const burst = 1.05;
    if (core) {
      tl.to(core, { scale: 1.55, duration: 0.75, ease: "power1.in" }, 0.15);
      tl.to(core, { scaleX: 1.15, scaleY: 1.3, duration: 0.16, ease: "power2.inOut" }, burst - 0.16);
      tl.set(core, { autoAlpha: 0 }, burst);
    }
    const d0 = (core ? box(core).w : 80) * 1.2;
    const D = coverDiameter(c);
    const waves = ["var(--gradient-orange-crush)", "var(--gradient-purple-haze)", "var(--gradient-macha)"].map((bg) =>
      circle(layer, c, d0, bg),
    );
    tl.set(waves, { autoAlpha: 1 }, burst);
    tl.to(waves, { width: D, height: D, duration: 0.6, ease: "power2.in", stagger: 0.09 }, burst);
    
    return { waves };
  },

  in({ scene, layer, box, tl: sceneTl }, tl, { waves }) {
    const cover = waves[waves.length - 1];
    waves.slice(0, -1).forEach((w) => w.remove()); // hidden under the green one
    const squads = [...scene.querySelectorAll(".squad")];
    if (!squads.length) {
      tl.to(cover, { autoAlpha: 0, duration: 0.4 }, 0);
      return;
    }

    // squads are still at scale 0, so their boxes are their centers
    const a = box(squads[0]);
    const z = box(squads[squads.length - 1]);
    const g = { x: (a.cx + z.cx) / 2, y: (a.cy + z.cy) / 2 };

    // iris closes into a drop; x and y ease differently, so it travels on an arc
    const hit = 0.85;
    tl.to(cover, { width: 64, height: 64, duration: hit, ease: "power3.inOut" }, 0);
    tl.to(cover, { x: g.x, duration: hit, ease: "power2.inOut" }, 0);
    tl.to(cover, { y: g.y, duration: hit, ease: "power3.in" }, 0);
    // stretch as it falls, squash on impact, splash away
    tl.to(cover, { scaleX: 0.85, scaleY: 1.2, duration: 0.25, ease: "power2.in" }, hit - 0.25);
    tl.to(cover, { scaleX: 1.6, scaleY: 0.55, duration: 0.09, ease: "power2.out" }, hit);
    tl.to(cover, { scale: 0, duration: 0.22, ease: "back.in(2)" }, hit + 0.09);

    // ripples spread over the grid
    ["var(--color-shockingly-green)", "var(--color-orangey)"].forEach((color, i) => {
      const ring = circle(layer, g, 64, "transparent");
      ring.style.border = `3px solid ${color}`;
      tl.set(ring, { autoAlpha: 1 }, hit + i * 0.12);
      tl.to(ring, { width: 1100, height: 1100, autoAlpha: 0, duration: 1.2, ease: "expo.out" }, hit + i * 0.12);
    });

    // the scene's squad burst lines up with the splash
    const squadsAt = firstTweenTime(sceneTl, squads[0], 0.7);
    tl.call(() => void sceneTl.play(0), [], Math.max(0, hit + 0.06 - squadsAt));
  },
});
