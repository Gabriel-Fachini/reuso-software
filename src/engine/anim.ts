import { gsap, SplitText } from "./gsap";

/*
 * Motion vocabulary for the deck, built on Disney's 12 principles:
 *
 *  squash & stretch   → pop(), drop(), breathe()
 *  anticipation       → exit(), the back.* eases on moves
 *  staging            → beat() holds + one focus at a time per scene
 *  follow-through /
 *  overlapping action → staggers + elastic settles; words lean then straighten
 *  slow in / slow out → expo/power eases (gsap.com: cubic-bezier(.23,1,.32,1))
 *  arcs               → arcIn(): different eases on x and y draw a curve
 *  secondary action   → float(), spin() loops on decorative shapes
 *  timing             → big things move slower, small things snap
 *  exaggeration       → overshoot on pops and settles
 *  solid drawing      → radial "volume" gradients on shapes (Shape.tsx)
 *  appeal             → rounded shapes, consistent rhythm
 */

type Timeline = gsap.core.Timeline;

export const EASE = {
  out: "expo.out",
  inOut: "power3.inOut",
  settle: "elastic.out(1, 0.5)",
  snap: "back.out(1.7)",
};

type TimelineData = { pauses: number[] };

function data(tl: Timeline): TimelineData {
  if (!tl.data) tl.data = { pauses: [] } satisfies TimelineData;
  return tl.data as TimelineData;
}

/**
 * Marks a "click" inside a scene. The timeline stops here and waits for the
 * presenter to advance. Must not be the last thing added to a timeline.
 */
export function step(tl: Timeline) {
  const t = tl.duration();
  tl.addPause(t);
  data(tl).pauses.push(t);
}

/** Times (in seconds) where the timeline waits for the presenter. */
export function pausesOf(tl: Timeline): number[] {
  return (tl.data as TimelineData | undefined)?.pauses ?? [];
}

/** Staging: a held beat so the audience can read before the next action. */
export function beat(tl: Timeline, seconds = 1) {
  tl.to({}, { duration: seconds });
}

/**
 * Headline reveal: words rise out of a line mask leaning forward and
 * straighten as they land (follow-through), overlapping each other.
 */
export function reveal(
  tl: Timeline,
  target: gsap.DOMTarget,
  position?: gsap.Position,
  vars: gsap.TweenVars = {},
) {
  const split = SplitText.create(target, {
    type: "lines,words",
    mask: "lines",
    linesClass: "split-line",
  });
  tl.from(
    split.words,
    {
      yPercent: 115,
      rotation: 7,
      transformOrigin: "0% 100%",
      duration: 1.3,
      stagger: 0.05,
      ease: EASE.out,
      ...vars,
    },
    position,
  );
  return split;
}

/** Character-level reveal for hero type, like the gsap.com header. */
export function revealChars(
  tl: Timeline,
  target: gsap.DOMTarget,
  position?: gsap.Position,
  vars: gsap.TweenVars = {},
) {
  const split = SplitText.create(target, {
    type: "lines,chars",
    mask: "lines",
    linesClass: "split-line",
  });
  tl.from(
    split.chars,
    {
      yPercent: 120,
      rotation: 10,
      transformOrigin: "0% 100%",
      duration: 1.4,
      stagger: 0.03,
      ease: EASE.out,
      ...vars,
    },
    position,
  );
  return split;
}

/** Blocks of content: slow-out rise with overlapping stagger. */
export function rise(
  tl: Timeline,
  target: gsap.TweenTarget,
  position?: gsap.Position,
  vars: gsap.TweenVars = {},
) {
  return tl.from(
    target,
    { autoAlpha: 0, y: 70, duration: 1.2, stagger: 0.1, ease: EASE.out, ...vars },
    position,
  );
}

/**
 * Squash & stretch pop: stretches as it launches, squashes when it lands,
 * then settles with a little wobble.
 */
export function pop(
  tl: Timeline,
  target: gsap.TweenTarget,
  position?: gsap.Position,
  vars: gsap.TweenVars = {},
) {
  return tl.fromTo(
    target,
    { autoAlpha: 0, scale: 0 },
    {
      keyframes: [
        { autoAlpha: 1, scaleX: 0.72, scaleY: 1.28, duration: 0.26, ease: "power2.out" },
        { scaleX: 1.16, scaleY: 0.84, duration: 0.16, ease: "power2.in" },
        { scaleX: 1, scaleY: 1, duration: 0.7, ease: EASE.settle },
      ],
      stagger: 0.07,
      ...vars,
    },
    position,
  );
}

/**
 * Gravity drop: accelerates down (slow in), squashes on impact,
 * recovers with an elastic follow-through.
 */
export function drop(
  tl: Timeline,
  target: gsap.TweenTarget,
  position?: gsap.Position,
  vars: gsap.TweenVars = {},
) {
  return tl.fromTo(
    target,
    { autoAlpha: 0, y: -420, transformOrigin: "50% 100%" },
    {
      keyframes: [
        { autoAlpha: 1, y: 0, scaleY: 1.12, scaleX: 0.92, duration: 0.5, ease: "power2.in" },
        { scaleY: 0.78, scaleX: 1.14, duration: 0.12, ease: "power1.out" },
        { scaleY: 1, scaleX: 1, duration: 0.8, ease: EASE.settle },
      ],
      stagger: 0.12,
      ...vars,
    },
    position,
  );
}

/**
 * Arc entrance: x and y use different eases, so the path is a curve rather
 * than a straight line.
 */
export function arcIn(
  tl: Timeline,
  target: gsap.TweenTarget,
  position: gsap.Position | undefined,
  from: { x: number; y: number; rotation?: number },
  vars: gsap.TweenVars = {},
) {
  tl.from(
    target,
    { x: from.x, duration: 1.3, ease: "power3.out", stagger: 0.08, ...vars },
    position,
  );
  tl.from(
    target,
    {
      y: from.y,
      rotation: from.rotation ?? 0,
      autoAlpha: 0,
      duration: 1.3,
      ease: "back.out(1.3)",
      stagger: 0.08,
      ...vars,
    },
    "<",
  );
}

/** Line art drawing on (DrawSVG), slow in / slow out. */
export function drawIn(
  tl: Timeline,
  target: gsap.TweenTarget,
  position?: gsap.Position,
  vars: gsap.TweenVars = {},
) {
  return tl.from(target, { drawSVG: 0, duration: 1.1, ease: EASE.inOut, stagger: 0.12, ...vars }, position);
}

/** Exit with anticipation: a small dip, then away. */
export function exit(
  tl: Timeline,
  target: gsap.TweenTarget,
  position?: gsap.Position,
  to: gsap.TweenVars = { y: -80 },
) {
  tl.to(target, { y: "+=14", scale: 0.985, duration: 0.2, ease: "power1.out" }, position);
  tl.to(target, { autoAlpha: 0, duration: 0.5, ease: "power3.in", ...to });
}

/** Secondary action: endless gentle drift with a hint of squash. */
export function float(targets: gsap.TweenTarget, amount = 14, rotate = 6) {
  gsap.utils.toArray<Element>(targets).forEach((el) => {
    const r = gsap.utils.random;
    gsap.to(el, {
      yPercent: r(-amount, amount),
      xPercent: r(-amount / 2, amount / 2),
      rotation: r(-rotate, rotate),
      duration: r(3.2, 5.6),
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: r(0, 1.2),
    });
  });
}

/** Secondary action: slow continuous spin. */
export function spin(targets: gsap.TweenTarget, duration = 14, direction: 1 | -1 = 1) {
  gsap.to(targets, { rotation: 360 * direction, duration, ease: "none", repeat: -1 });
}

/** Idle squash & stretch, like a shape breathing. */
export function breathe(targets: gsap.TweenTarget, amount = 0.05) {
  gsap.utils.toArray<Element>(targets).forEach((el, i) => {
    gsap.to(el, {
      scaleX: 1 + amount,
      scaleY: 1 - amount,
      duration: 1.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: i * 0.3,
    });
  });
}

/** Animated counter. Tweens textContent so seeking/skipping renders it too. */
export function countTo(tl: Timeline, el: Element | null, to: number, position?: gsap.Position) {
  if (!el) return;
  tl.fromTo(
    el,
    { textContent: 0 },
    { textContent: to, snap: { textContent: 1 }, duration: 1.6, ease: "power3.out" },
    position,
  );
}
