import { useScene } from "../engine/useScene";
import { drop, float, pop, reveal, rise, spin } from "../engine/anim";
import { Eyebrow, Mark } from "../components/ui";
import { Deco } from "../components/Shape";

// top = mais abstrato, bottom = mais concreto
const levels = [
  { name: "Padrões de interação", ex: "como um fluxo de checkout se comporta", bg: "var(--gradient-lipstick)" },
  { name: "Documentação", ex: "quando usar · quando não usar", bg: "var(--gradient-macha)" },
  { name: "Design tokens", ex: "color.brand.primary = #ff8709", bg: "var(--gradient-orange-crush)" },
  { name: "Componentes", ex: "<Button />  <Input />  <Card />", bg: "var(--gradient-purple-haze)" },
  { name: "Código", ex: "npm i @acme/ui", bg: "var(--gradient-summer-fair)" },
];

const SLAB_H = 80;
const GAP = 12;
const CENTER = 600;
const EX_X = CENTER + 415 + 60;

export default function S04OQueReusa() {
  const root = useScene((tl) => {
    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".title", 0.2);
    reveal(tl, ".title2", 0.5);

    // the stack is built with gravity, concrete base first
    drop(tl, ".slab", 0.9, { stagger: { each: 0.32, from: "end" } });
    levels.forEach((_, i) => {
      const t = 0.9 + (levels.length - 1 - i) * 0.32 + 0.5;
      rise(tl, `.ex-${i}`, t, { x: -30, y: 0, duration: 0.9 });
    });
    tl.from(".axis-line", { scaleY: 0, transformOrigin: "bottom", duration: 2, ease: "power2.inOut" }, 0.9);
    rise(tl, ".axis-label", 1.2, { stagger: 1.2 });
    reveal(tl, ".punch", 3.0);
    pop(tl, ".punch .mark", 3.5);
    pop(tl, ".r-deco", 1.5, { stagger: 0.2 });

    float(".slab-inner", 3, 0.6);
    float(".r-deco .deco-inner", 12, 8);
    spin(".r-deco .shape", 20);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>03 · Design System à luz do Reuso</Eyebrow>
      <div className="row" style={{ marginTop: 34, gap: 30, alignItems: "baseline" }}>
        <h2 className="h1 title">O que é reusado?</h2>
        <h2 className="statement soft title2">Não só código.</h2>
      </div>

      <div style={{ position: "relative", height: levels.length * (SLAB_H + GAP), marginTop: 56 }}>
        <div className="abs col" style={{ left: 0, top: 0, bottom: 0, width: 120, alignItems: "center", gap: 14 }}>
          <span className="axis-label label muted" style={{ fontSize: 16 }}>ABSTRATO</span>
          <div className="axis-line" style={{ flex: 1, width: 3, borderRadius: 2, background: "linear-gradient(var(--color-pink), var(--color-blue))" }} />
          <span className="axis-label label muted" style={{ fontSize: 16 }}>CONCRETO</span>
        </div>

        {levels.map((l, i) => {
          const w = 470 + i * 90;
          return (
            <div key={l.name}>
              <div className={`slab slab-${i} abs`} style={{ left: CENTER - w / 2, top: i * (SLAB_H + GAP), width: w, height: SLAB_H }}>
                <div
                  className="slab-inner center"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 22,
                    background: l.bg,
                    color: "var(--color-just-black)",
                    fontSize: 32,
                    fontWeight: 600,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {l.name}
                </div>
              </div>
              <div className={`ex-${i} abs mono soft`} style={{ left: EX_X, top: i * (SLAB_H + GAP) + SLAB_H / 2 - 14, fontSize: 23 }}>
                {l.ex}
              </div>
            </div>
          );
        })}

        <Deco className="r-deco" x={1600} y={170} kind="pinwheel" grad="purple" size={110} />
        <Deco className="r-deco" x={1560} y={360} kind="ring" grad="orange" size={90} />
      </div>

      <p className="punch statement" style={{ marginTop: 40, fontSize: 52 }}>
        Reuso em vários níveis → <Mark color="green" tilt={-2}>consistência</Mark> em vários níveis.
      </p>
    </div>
  );
}
