import { gsap } from "./gsap";

/*
 * Scene-to-scene transitions.
 *
 * A transition runs in two halves around the scene swap:
 *   out(ctx, tl)          animates the outgoing scene; when `tl` ends the deck swaps scenes
 *   in(ctx, tl, state)    animates the incoming scene and decides when its own
 *                         timeline starts (`tl.call(() => ctx.tl.play(0), [], t)`);
 *                         if it never does, the deck starts it when `tl` ends
 *
 * `ctx.layer` is an overlay above both scenes that survives the swap: put the
 * "shared elements" there (a shape that leaves one scene and lands in the next).
 * It is cleared when the transition ends. Coordinates are stage pixels (1920×1080).
 *
 * Transitions reach into scenes through their class names. Write them
 * defensively: if an element is missing, fall back to something simple.
 */

export type Box = { x: number; y: number; w: number; h: number; cx: number; cy: number };
export type Point = { x: number; y: number };

export type TransitionCtx = {
  /** Root (.scene) of the scene being animated. */
  scene: HTMLElement;
  /** Overlay shared by both halves, above the scenes. */
  layer: HTMLElement;
  /** Element box in stage coordinates (independent of the window scale). */
  box: (el: Element) => Box;
};

export type TransitionInCtx = TransitionCtx & {
  /** The incoming scene's own timeline, paused at 0. */
  tl: gsap.core.Timeline;
};

export type Transition<S = unknown> = {
  out: (ctx: TransitionCtx, tl: gsap.core.Timeline) => S;
  in: (ctx: TransitionInCtx, tl: gsap.core.Timeline, state: S) => void;
};

export function defineTransition<S>(t: Transition<S>): Transition<S> {
  return t;
}

/** Diameter of a circle centered at `c` that covers the whole stage. */
export function coverDiameter(c: Point, margin = 40) {
  const dx = Math.max(c.x, 1920 - c.x);
  const dy = Math.max(c.y, 1080 - c.y);
  return 2 * Math.hypot(dx, dy) + margin;
}

/**
 * A circle on the overlay, centered on (x, y) via xPercent/yPercent, so
 * tweening width/height keeps it centered and x/y moves its center.
 * Starts hidden; reveal it with `autoAlpha: 1` at the right time.
 */
export function circle(layer: HTMLElement, at: Point, d: number, background: string) {
  const el = document.createElement("div");
  Object.assign(el.style, { position: "absolute", left: "0", top: "0", borderRadius: "50%", background });
  layer.append(el);
  gsap.set(el, { xPercent: -50, yPercent: -50, x: at.x, y: at.y, width: d, height: d, autoAlpha: 0 });
  return el;
}

/** Earliest time an element is animated in a scene timeline (or `fallback`). */
export function firstTweenTime(tl: gsap.core.Timeline, el: Element | null | undefined, fallback = 0) {
  const times = el ? tl.getTweensOf(el).map((t) => t.startTime()) : [];
  return times.length ? Math.min(...times) : fallback;
}

/**
 * Pulls elements into a point, nearest first. back.in gives anticipation:
 * each piece leans away and swells a little before being sucked in.
 */
export function pull(
  tl: gsap.core.Timeline,
  targets: Element[],
  to: Point,
  box: TransitionCtx["box"],
  position = 0,
  { duration = 0.6, each = 0.03 } = {},
) {
  targets
    .map((el) => ({ el, b: box(el) }))
    .sort((a, b) => Math.hypot(a.b.cx - to.x, a.b.cy - to.y) - Math.hypot(b.b.cx - to.x, b.b.cy - to.y))
    .forEach(({ el, b }, i) => {
      tl.to(
        el,
        {
          x: `+=${to.x - b.cx}`,
          y: `+=${to.y - b.cy}`,
          scale: 0,
          rotation: `+=${gsap.utils.random(90, 200) * (Math.random() < 0.5 ? -1 : 1)}`,
          duration,
          ease: "back.in(1.8)",
        },
        position + i * each,
      );
    });
}

/**
 * Spirals elements into a point (a vortex): each one orbits the center while
 * its radius shrinks, spinning and shrinking itself. Far pieces take longer.
 * Assumes the elements' parents are not scaled or rotated.
 */
export function vortex(
  tl: gsap.core.Timeline,
  targets: Element[],
  to: Point,
  box: TransitionCtx["box"],
  position = 0,
  { turns = 0.8, duration = 1.1, jitter = 0.2 } = {},
) {
  const items = targets.map((el) => {
    const b = box(el);
    return {
      el,
      b,
      r0: Math.hypot(b.cx - to.x, b.cy - to.y),
      a0: Math.atan2(b.cy - to.y, b.cx - to.x),
      x0: Number(gsap.getProperty(el, "x")),
      y0: Number(gsap.getProperty(el, "y")),
      rot0: Number(gsap.getProperty(el, "rotation")),
    };
  });
  const rMax = Math.max(1, ...items.map((i) => i.r0));
  const spin = turns * Math.PI * 2;
  items.forEach(({ el, b, r0, a0, x0, y0, rot0 }) => {
    const p = { v: 0 };
    const set = gsap.quickSetter(el, "css");
    tl.to(
      p,
      {
        v: 1,
        duration: duration * (0.55 + 0.45 * (r0 / rMax)),
        ease: "power2.in",
        onUpdate: () => {
          const a = a0 + spin * p.v;
          const r = r0 * (1 - p.v);
          set({
            x: x0 + to.x + r * Math.cos(a) - b.cx,
            y: y0 + to.y + r * Math.sin(a) - b.cy,
            rotation: rot0 + 240 * p.v,
            scale: 1 - 0.85 * p.v,
            opacity: p.v > 0.85 ? (1 - p.v) / 0.15 : 1,
          });
        },
      },
      position + Math.random() * jitter,
    );
  });
}

/** Rounded rectangle on the overlay, centered on the box (same rules as circle()). */
export function panel(layer: HTMLElement, b: Pick<Box, "cx" | "cy" | "w" | "h">, background: string, radius = 24) {
  const el = circle(layer, { x: b.cx, y: b.cy }, b.w, background);
  gsap.set(el, { height: b.h, borderRadius: radius });
  return el;
}

/**
 * Text leaves through its SplitText line masks (words/chars go up and out);
 * elements that were not split just rise and fade.
 */
export function exitText(
  tl: gsap.core.Timeline,
  scene: HTMLElement,
  selector: string,
  position = 0,
  { dir = -1, each = 0.03, duration = 0.5 } = {},
) {
  scene.querySelectorAll(selector).forEach((el, i) => {
    const bits = el.querySelectorAll(".split-line > *");
    if (bits.length) tl.to(bits, { yPercent: 150 * dir, rotation: 6 * dir, duration, ease: "power3.in", stagger: each }, position + i * 0.06);
    else tl.to(el, { y: 40 * dir, autoAlpha: 0, duration, ease: "power2.in" }, position + i * 0.06);
  });
}

/** Squash out of existence: a little swell (anticipation), then gone. */
export function popOut(tl: gsap.core.Timeline, targets: gsap.TweenTarget, position = 0, vars: gsap.TweenVars = {}) {
  tl.to(targets, { scale: 0, autoAlpha: 0, duration: 0.4, ease: "back.in(2.2)", stagger: 0.04, ...vars }, position);
}

/** Things fall off the stage with gravity: a small hop, then down and spinning. */
export function fallOut(tl: gsap.core.Timeline, targets: Element[], position = 0, { each = 0.05 } = {}) {
  targets.forEach((el, i) => {
    const at = position + i * each;
    tl.to(el, { y: "-=30", duration: 0.18, ease: "power2.out" }, at);
    tl.to(el, {
      y: "+=1300",
      rotation: gsap.utils.random(-50, 50),
      duration: 0.75,
      ease: "power2.in",
    }, at + 0.18);
  });
}

/**
 * The transition takes over the entrance of an element of the incoming scene:
 * its tweens are removed from the scene timeline (only for this element) and
 * it is placed in its final state. Returns its natural box.
 */
const primed = new WeakSet<gsap.core.Timeline>();

export function takeOver(ctx: TransitionInCtx, el: Element) {
  // Tweens (keyframes especially) ignore kill(target) until they have
  // rendered once: run the scene to its end and back, silently, first.
  if (!primed.has(ctx.tl)) {
    ctx.tl.progress(1, true).progress(0, true);
    primed.add(ctx.tl);
  }
  ctx.tl.getTweensOf(el).forEach((t) => t.kill(el));
  gsap.set(el, { autoAlpha: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1, rotation: 0 });
  return ctx.box(el);
}

/**
 * Moves an overlay shape (circle()/panel()) onto a box: position, size and
 * corner radius, so it can be swapped for the real element when it lands.
 */
export function morphTo(
  tl: gsap.core.Timeline,
  el: HTMLElement,
  to: Pick<Box, "cx" | "cy" | "w" | "h">,
  position = 0,
  { duration = 0.8, radius, ease = "power3.inOut" }: { duration?: number; radius?: number; ease?: string } = {},
) {
  tl.to(el, { width: to.w, height: to.h, ...(radius === undefined ? {} : { borderRadius: radius }), duration, ease }, position);
  tl.to(el, { x: to.cx, duration, ease: "power2.inOut" }, position);
  tl.to(el, { y: to.cy, duration, ease: "power3.inOut" }, position);
}

/** Swap an overlay stand-in for the real element (crossfade, a few frames). */
export function swap(tl: gsap.core.Timeline, overlay: HTMLElement, real: Element, position = 0, duration = 0.15) {
  tl.fromTo(real, { autoAlpha: 0 }, { autoAlpha: 1, duration, ease: "none", immediateRender: false }, position);
  tl.to(overlay, { autoAlpha: 0, duration, ease: "none" }, position);
}

/** Landing: squash on impact, then an elastic settle. */
export function land(tl: gsap.core.Timeline, el: Element, position = 0) {
  tl.to(el, { scaleX: 1.18, scaleY: 0.82, duration: 0.09, ease: "power2.out", transformOrigin: "50% 100%" }, position);
  tl.to(el, { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1, 0.45)" }, position + 0.09);
}

/** A layer inside an overlay shape (fill, text) that can be faded on its own. */
export function inside(parent: HTMLElement, style: Partial<CSSStyleDeclaration>, text = "") {
  const el = document.createElement("div");
  Object.assign(el.style, { position: "absolute", inset: "0", borderRadius: "inherit", display: "grid", placeItems: "center", ...style });
  el.textContent = text;
  parent.append(el);
  return el;
}
