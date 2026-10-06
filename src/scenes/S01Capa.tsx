import type { ReactNode } from "react";
import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { arcIn, breathe, float, pop, reveal, revealChars, rise, spin } from "../engine/anim";
import { ArrowDot, Eyebrow, Mark } from "../components/ui";
import { Deco } from "../components/Shape";

function Swatch({ bg }: { bg: string }) {
  return <div className="swatch" style={{ width: 78, height: 78, borderRadius: "50%", background: bg }} />;
}

function Toggle() {
  return (
    <div
      style={{
        width: 116,
        height: 62,
        borderRadius: 999,
        background: "var(--gradient-macha)",
        padding: 7,
        display: "flex",
      }}
    >
      <div className="knob" style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-just-black)" }} />
    </div>
  );
}

// design-system UI pieces: the majority of the cover
const ui: { x: number; y: number; el: ReactNode }[] = [
  {
    x: 1110,
    y: 120,
    el: (
      <span className="btn">
        Continuar <ArrowDot />
      </span>
    ),
  },
  { x: 1520, y: 104, el: <span className="chip mono">color.brand</span> },
  {
    x: 1100,
    y: 270,
    el: (
      <span className="gt gt-text" style={{ fontSize: 132, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }}>
        Aa
      </span>
    ),
  },
  {
    x: 1360,
    y: 300,
    el: (
      <div className="row" style={{ gap: 16 }}>
        <Swatch bg="var(--gradient-orange-crush)" />
        <Swatch bg="var(--gradient-macha)" />
        <Swatch bg="var(--gradient-purple-haze)" />
      </div>
    ),
  },
  { x: 1080, y: 470, el: <span className="chip mono">space.md = 32px</span> },
  {
    x: 1430,
    y: 470,
    el: (
      <div className="card" style={{ width: 330, padding: 26 }}>
        <div className="label" style={{ fontSize: 24 }}>Card</div>
        <div className="muted" style={{ fontSize: 18, marginTop: 6 }}>radius.lg · surface</div>
        <div style={{ height: 10, borderRadius: 5, marginTop: 18, background: "var(--gradient-summer-fair)" }} />
      </div>
    ),
  },
  {
    x: 1090,
    y: 640,
    el: (
      <div
        style={{
          width: 310,
          height: 58,
          borderRadius: 999,
          border: "2px solid var(--color-surface25)",
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          color: "var(--color-surface50)",
          fontSize: 20,
        }}
      >
        Buscar…
      </div>
    ),
  },
  { x: 1760, y: 660, el: <Toggle /> },
  {
    x: 1300,
    y: 790,
    el: (
      <span className="btn fill">
        Pedir agora <ArrowDot />
      </span>
    ),
  },
];

export default function S01Capa() {
  const root = useScene((tl) => {
    rise(tl, ".eyebrow", 0.1);
    revealChars(tl, ".hero-1", 0.2);
    revealChars(tl, ".hero-2", 0.4);
    reveal(tl, ".sub", 0.9);
    pop(tl, ".sub .mark", 1.3);
    rise(tl, ".names", 1.4);

    // UI pieces arrive on arcs and squash into place, overlapping each other
    arcIn(tl, ".ui-piece", 0.5, { x: 220, y: 120, rotation: 8 }, { stagger: { each: 0.09, from: "random" } });
    pop(tl, ".d-pin, .d-ring, .d-flower, .d-star", 0.9, { stagger: 0.14 });
    tl.from(".d-squiggle", { scale: 0, rotation: -40, duration: 1.2, ease: "back.out(2)" }, 1.2);

    // secondary action
    float(".ui-inner", 7, 3);
    float(".deco-inner", 10, 6);
    spin(".d-pin .shape", 16);
    spin(".d-star .shape", 22, -1);
    breathe(".swatch", 0.06);
    breathe(".d-flower .shape", 0.04);
    gsap.to(".knob", { x: 54, duration: 0.6, ease: "back.inOut(2)", repeat: -1, yoyo: true, repeatDelay: 1.4 });
    gsap.to(".arrow-dot", { x: 4, duration: 0.5, ease: "sine.inOut", repeat: -1, yoyo: true });
  });

  return (
    <div className="scene" ref={root}>
      {ui.map((p, i) => (
        <div key={i} className="ui-piece abs" style={{ left: p.x, top: p.y }}>
          <div className="ui-inner">{p.el}</div>
        </div>
      ))}
      <Deco className="d-pin" x={1740} y={220} kind="pinwheel" grad="orange" size={120} />
      <Deco className="d-ring" x={1810} y={430} kind="ring" grad="summer" size={90} />
      <Deco className="d-flower" x={1660} y={790} kind="flower" grad="purple" size={160} />
      <Deco className="d-star" x={1130} y={800} kind="star" grad="tangerine" size={80} />
      <Deco className="d-squiggle" x={700} y={470} kind="squiggle" grad="purple" size={170} />

      <div style={{ position: "relative" }}>
        <Eyebrow>Seminário · Reuso de Software</Eyebrow>
      </div>
      <div style={{ position: "relative", marginTop: 70 }}>
        <div className="hero hero-1">Design</div>
        <div className="hero hero-2">System</div>
        <div className="statement sub" style={{ marginTop: 40 }}>
          como estratégia de <Mark color="orange" tilt={-3}>reuso</Mark>
        </div>
      </div>
      <div className="names body soft" style={{ position: "relative", marginTop: "auto" }}>
        Ana Lívia · Bruno · Bueno · Gabriel · Prato
      </div>
    </div>
  );
}
