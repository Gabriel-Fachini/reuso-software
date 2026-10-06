import { useId } from "react";
import type { CSSProperties, ReactNode } from "react";

// ds-allow-file: aqui ficam as definições dos gradientes (espelho dos tokens).
/**
 * Gradient shapes in the spirit of gsap.com: simple geometric primitives
 * with the site's named gradients. Drawings are original; gradient values
 * come from gsap.com's CSS variables.
 */

type Linear = { type: "linear"; angle: number; stops: [string, number][] };
type Radial = { type: "radial"; cx: number; cy: number; r: number; stops: [string, number][] };
type Grad = Linear | Radial;

export const GRADS = {
  macha: { type: "linear", angle: 114.41, stops: [["#0ae448", 0.2074], ["#abff84", 0.655]] },
  orange: { type: "linear", angle: 111.45, stops: [["#ff8709", 0.1942], ["#f7bdf8", 0.7308]] },
  lipstick: { type: "linear", angle: 165.72, stops: [["#f7bdf8", 0.2115], ["#cd237f", 0.8193]] },
  purple: { type: "linear", angle: 153.58, stops: [["#f7bdf8", 0.3225], ["#2f3cc0", 0.9268]] },
  skyfall: { type: "linear", angle: 131.77, stops: [["#0a157a", 0.3082], ["#15bfe4", 0.8182]] },
  emerald: { type: "linear", angle: 166.9, stops: [["#0ae448", 0.5319], ["#0085d0", 1]] },
  summer: { type: "linear", angle: 144.02, stops: [["#00bae2", 0.0456], ["#fec5fb", 0.7298]] },
  scroll: { type: "linear", angle: 317.42, stops: [["#ffe9fe", 0.104], ["#ff96f9", 0.8303]] },
  // radial "volume" gradients (core / svg / ui / text tools on gsap.com)
  core: { type: "radial", cx: 0.165, cy: 0.785, r: 0.9, stops: [["#fbfefa", 0], ["#c9f6b4", 0.396], ["#abff84", 0.776], ["#2fee65", 1]] },
  tangerine: { type: "radial", cx: 0, cy: 0.708, r: 0.8, stops: [["#ffd9b0", 0], ["#fd9f3b", 0.807], ["#ff8709", 1]] },
  ui: { type: "radial", cx: 0.717, cy: 0.308, r: 0.79, stops: [["#f0fcff", 0], ["#9bedff", 0.672], ["#5be1ff", 0.849], ["#00bae2", 0.948]] },
  text: { type: "radial", cx: 1.2, cy: 0.81, r: 1.29, stops: [["#dfdcff", 0.27], ["#a69eff", 1]] },
  ink: { type: "linear", angle: 160, stops: [["#2a2c29", 0], ["#121412", 1]] },
} satisfies Record<string, Grad>;

export type GradName = keyof typeof GRADS;

export type ShapeKind =
  | "circle"
  | "dome"
  | "flower"
  | "pinwheel"
  | "ring"
  | "squircle"
  | "diamond"
  | "star"
  | "arch"
  | "hourglass"
  | "pill"
  | "squiggle"
  | "arc";

// viewBox sizes per shape
const BOX: Record<ShapeKind, [number, number]> = {
  circle: [100, 100],
  dome: [100, 50],
  flower: [100, 100],
  pinwheel: [100, 100],
  ring: [100, 100],
  squircle: [100, 100],
  diamond: [100, 100],
  star: [100, 100],
  arch: [100, 100],
  hourglass: [80, 100],
  pill: [100, 40],
  squiggle: [120, 60],
  arc: [100, 100],
};

export function gradientDef(g: Grad, id: string, w: number, h: number) {
  if (g.type === "linear") {
    // CSS gradient line: length = |w·sin a| + |h·cos a|, through the center
    const a = (g.angle * Math.PI) / 180;
    const sin = Math.sin(a);
    const cos = Math.cos(a);
    const half = (Math.abs(w * sin) + Math.abs(h * cos)) / 2;
    return (
      <linearGradient
        id={id}
        gradientUnits="userSpaceOnUse"
        x1={w / 2 - sin * half}
        y1={h / 2 + cos * half}
        x2={w / 2 + sin * half}
        y2={h / 2 - cos * half}
      >
        {g.stops.map(([c, o], i) => (
          <stop key={i} offset={Math.min(Math.max(o, 0), 1)} stopColor={c} />
        ))}
      </linearGradient>
    );
  }
  return (
    <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={g.cx * w} cy={g.cy * h} r={g.r * Math.max(w, h)}>
      {g.stops.map(([c, o], i) => (
        <stop key={i} offset={Math.min(Math.max(o, 0), 1)} stopColor={c} />
      ))}
    </radialGradient>
  );
}

function draw(kind: ShapeKind, fill: string): ReactNode {
  switch (kind) {
    case "circle":
      return <circle cx={50} cy={50} r={50} fill={fill} />;
    case "dome":
      return <path d="M0 50 A50 50 0 0 1 100 50 Z" fill={fill} />;
    case "flower":
      return (
        <g fill={fill}>
          <circle cx={28} cy={28} r={28} />
          <circle cx={72} cy={28} r={28} />
          <circle cx={28} cy={72} r={28} />
          <circle cx={72} cy={72} r={28} />
          <rect x={22} y={22} width={56} height={56} />
        </g>
      );
    case "pinwheel":
      return (
        <g fill={fill}>
          {[0, 90, 180, 270].map((r) => (
            // 60° blades with gaps: reads as a windmill, not a full circle
            <path key={r} d="M50 50 L50 0 A50 50 0 0 1 93.3 25 Z" transform={`rotate(${r} 50 50)`} />
          ))}
        </g>
      );
    case "ring":
      return <circle cx={50} cy={50} r={38} fill="none" stroke={fill} strokeWidth={24} />;
    case "squircle":
      return <rect x={0} y={0} width={100} height={100} rx={24} fill={fill} />;
    case "diamond":
      return <rect x={18} y={18} width={64} height={64} rx={10} transform="rotate(45 50 50)" fill={fill} />;
    case "star":
      return (
        <g fill={fill}>
          {[0, 45, 90, 135].map((r) => (
            <rect key={r} x={42} y={0} width={16} height={100} rx={8} transform={`rotate(${r} 50 50)`} />
          ))}
        </g>
      );
    case "arch":
      return (
        <path
          d="M0 100 V50 A50 50 0 0 1 100 50 V100 H66 V62 A16 16 0 0 0 34 62 V100 Z"
          fill={fill}
        />
      );
    case "hourglass":
      return (
        <path
          d="M8 4 H72 L40 50 L72 96 H8 L40 50 Z"
          fill={fill}
          stroke={fill}
          strokeWidth={8}
          strokeLinejoin="round"
        />
      );
    case "pill":
      return <rect x={0} y={0} width={100} height={40} rx={20} fill={fill} />;
    case "squiggle":
      return (
        <path
          d="M10 30 C 22 6, 38 6, 50 30 S 78 54, 90 30 S 106 10, 110 22"
          fill="none"
          stroke={fill}
          strokeWidth={16}
          strokeLinecap="round"
        />
      );
    case "arc":
      return (
        <path
          d="M14 64 A38 38 0 1 1 64 86"
          fill="none"
          stroke={fill}
          strokeWidth={22}
          strokeLinecap="round"
        />
      );
  }
}

export function Shape({
  kind,
  grad,
  size = 120,
  className = "",
  style,
}: {
  kind: ShapeKind;
  grad: GradName;
  /** rendered width in px */
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const id = `g${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [w, h] = BOX[kind];
  return (
    <svg
      className={`shape ${className}`}
      width={size}
      height={(size * h) / w}
      viewBox={`0 0 ${w} ${h}`}
      style={{ overflow: "visible", display: "block", ...style }}
      aria-hidden
    >
      <defs>{gradientDef(GRADS[grad], id, w, h)}</defs>
      {draw(kind, `url(#${id})`)}
    </svg>
  );
}

/** Gradient <defs> for hand-built SVGs (wires, rings, charts). */
export function GradDef({ name, id, w, h }: { name: GradName; id: string; w: number; h: number }) {
  return <defs>{gradientDef(GRADS[name], id, w, h)}</defs>;
}

/** Absolutely positioned decorative shape with an inner wrapper for loops. */
export function Deco({
  x,
  y,
  className = "",
  ...shape
}: { x: number; y: number; className?: string } & Parameters<typeof Shape>[0]) {
  return (
    <div className={`deco abs ${className}`} style={{ left: x, top: y }}>
      <div className="deco-inner">
        <Shape {...shape} />
      </div>
    </div>
  );
}
