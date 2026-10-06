import type { CSSProperties, ReactNode } from "react";

/** `{ label }` — the curly-brace eyebrow from gsap.com. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`eyebrow ${className}`}>
      <span className="brace">{"{"}</span>
      <span>{children}</span>
      <span className="brace">{"}"}</span>
    </div>
  );
}

/** Tilted solid highlight block around a word. */
export function Mark({
  children,
  color = "pink",
  tilt = -2,
  className = "",
  style,
}: {
  children: ReactNode;
  color?: "pink" | "orange" | "green" | "lilac" | "blue" | "ivory";
  tilt?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`mark ${color} ${className}`} style={{ rotate: `${tilt}deg`, ...style }}>
      {children}
    </span>
  );
}

/** Data the group still has to provide (case iFood). */
export function Dado({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span className="dado" style={style}>
      [DADO: {children}]
    </span>
  );
}

/** Small arrow inside a circle, as on gsap.com buttons. */
export function ArrowDot() {
  return (
    <span className="arrow-dot">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Arrow({
  width = 80,
  color = "var(--color-surface50)",
  className,
  style,
}: {
  width?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg className={className} style={style} width={width} height={24} viewBox={`0 0 ${width} 24`} fill="none">
      <path
        d={`M2 12 H${width - 6} M${width - 18} 2 L${width - 4} 12 L${width - 18} 22`}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
