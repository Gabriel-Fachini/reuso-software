import type { CSSProperties, ReactNode } from "react";
import { useScene } from "../engine/useScene";
import { arcIn, breathe, float, pop, reveal, rise } from "../engine/anim";
import { Arrow, Eyebrow, Mark } from "../components/ui";
import { Shape } from "../components/Shape";

/*
 * Every illustration is sized in exact pixels to fit the 236px inner width
 * of its card — nothing may spill over the card edge.
 */

const CARD_W = 280;
const INNER = 236;

const pill = (w: number, h: number, bg: string, outline = false): CSSProperties => ({
  width: w,
  height: h,
  borderRadius: h / 2,
  flexShrink: 0,
  ...(outline ? { border: "2px solid var(--color-border)", background: "var(--color-bg)" } : { background: bg }),
});

function Search({ input, btn, h }: { input: number; btn: number; h: number }) {
  return (
    <div className="row" style={{ gap: 6 }}>
      <div style={pill(input, h, "", true)} />
      <div style={pill(btn, h, "var(--gradient-macha)")} />
    </div>
  );
}

function Header({ filled }: { filled?: boolean }) {
  return (
    <div
      className="row"
      style={{
        width: INNER,
        padding: "8px 10px",
        border: "2px solid var(--color-border)",
        borderRadius: 16,
        justifyContent: "space-between",
        background: "var(--color-bg)",
      }}
    >
      <div style={{ width: 26, height: 26, borderRadius: 8, background: filled ? "var(--gradient-purple-haze)" : "var(--color-border)" }} />
      {filled ? <Search input={92} btn={40} h={28} /> : <div style={pill(138, 28, "var(--color-border)")} />}
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: filled ? "var(--gradient-orange-crush)" : "var(--color-border)" }} />
    </div>
  );
}

const foods = [
  { name: "Pizza", price: "R$ 39", kind: "circle", grad: "tangerine" },
  { name: "Sushi", price: "R$ 72", kind: "flower", grad: "lipstick" },
  { name: "Açaí", price: "R$ 18", kind: "dome", grad: "purple" },
  { name: "Burger", price: "R$ 34", kind: "squircle", grad: "core" },
] as const;

function Body({ filled }: { filled?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10, width: INNER }}>
      {foods.map((f) => (
        <div
          key={f.name}
          style={{
            height: 78,
            borderRadius: 12,
            padding: 10,
            border: filled ? "none" : "2px dashed var(--color-border)",
            background: filled ? "var(--color-bg)" : "transparent",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {filled ? (
            <>
              <Shape kind={f.kind} grad={f.grad} size={30} />
              <div className="col" style={{ gap: 2 }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{f.name}</span>
                <span style={{ fontSize: 13, color: "var(--color-green-deep)" }}>{f.price}</span>
              </div>
            </>
          ) : (
            <div className="col" style={{ gap: 6, width: "100%" }}>
              <div style={pill(70, 9, "var(--color-border)")} />
              <div style={pill(40, 9, "var(--color-border)")} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const stages: { name: string; ex: string; art: ReactNode }[] = [
  {
    name: "Átomos",
    ex: "cor, fonte, input, botão",
    art: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, placeItems: "center", width: INNER }}>
        <span className="bit atom gt gt-text" style={{ fontSize: 58, fontWeight: 600, lineHeight: 1 }}>Aa</span>
        <div className="bit atom">
          <Shape kind="circle" grad="tangerine" size={58} />
        </div>
        <div className="bit atom" style={pill(100, 42, "", true)} />
        <div className="bit atom" style={pill(70, 42, "var(--gradient-macha)")} />
      </div>
    ),
  },
  {
    name: "Moléculas",
    ex: "campo de busca",
    art: (
      <div className="bit">
        <Search input={146} btn={70} h={48} />
      </div>
    ),
  },
  {
    name: "Organismos",
    ex: "cabeçalho",
    art: (
      <div className="bit">
        <Header filled />
      </div>
    ),
  },
  {
    name: "Templates",
    ex: "estrutura da página",
    art: (
      <div>
        <div className="bit">
          <Header />
        </div>
        <div className="bit">
          <Body />
        </div>
      </div>
    ),
  },
  {
    name: "Páginas",
    ex: "conteúdo real",
    art: (
      <div>
        <div className="bit">
          <Header filled />
        </div>
        <div className="bit">
          <Body filled />
        </div>
      </div>
    ),
  },
];

export default function S06Atomic() {
  const root = useScene((tl) => {
    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".title", 0.2);
    reveal(tl, ".sub", 0.5);

    // each level is assembled from the previous one: pieces arrive on arcs
    // from the left, overlapping the next card's entrance
    stages.forEach((_, i) => {
      const t = 0.9 + i * 0.55;
      rise(tl, `.stage-${i} .frame`, t, { duration: 0.9 });
      if (i === 0) pop(tl, `.stage-0 .bit`, t + 0.25, { stagger: 0.1 });
      else arcIn(tl, `.stage-${i} .bit`, t + 0.2, { x: -170, y: -90, rotation: -12 }, { duration: 1.1, stagger: 0.12 });
      rise(tl, `.stage-${i} .caption`, t + 0.35, { y: 30, duration: 0.8 });
      if (i < stages.length - 1) tl.from(`.arrow-${i}`, { scaleX: 0, transformOrigin: "left", duration: 0.5, ease: "power3.out" }, t + 0.45);
    });

    tl.from(".bracket", { scaleX: 0, transformOrigin: "left", duration: 1.6, ease: "power3.inOut" }, 3.6);
    rise(tl, ".bracket-labels > *", 4.2, { stagger: 0.25 });
    pop(tl, ".bracket-labels .mark", 4.5, { stagger: 0.25 });

    float(".atom", 8, 8);
    breathe(".stage-0 .shape", 0.06);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>03 · Design System à luz do Reuso</Eyebrow>
      <div className="row" style={{ marginTop: 34, gap: 30, alignItems: "baseline" }}>
        <h2 className="h1 title">Atomic Design</h2>
        <p className="statement soft sub" style={{ fontSize: 44 }}>
          granularidade como modelo de composição
        </p>
      </div>

      <div className="row" style={{ marginTop: 70, gap: 12, alignItems: "flex-start" }}>
        {stages.map((s, i) => (
          <div key={s.name} className="row" style={{ gap: 12, alignItems: "flex-start" }}>
            <div className={`stage-${i} col`} style={{ width: CARD_W, gap: 22 }}>
              <div className="frame card center" style={{ width: CARD_W, height: 330, padding: 22, overflow: "hidden" }}>
                {s.art}
              </div>
              <div className="caption">
                <div className="h3" style={{ fontSize: 34, fontWeight: 600 }}>{s.name}</div>
                <div className="muted" style={{ fontSize: 20, marginTop: 4 }}>{s.ex}</div>
              </div>
            </div>
            {i < stages.length - 1 && <Arrow className={`arrow-${i}`} width={34} style={{ marginTop: 153 }} />}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 56 }}>
        <div className="bracket" style={{ height: 6, borderRadius: 3, background: "var(--gradient-spectrum)" }} />
        <div className="bracket-labels row" style={{ justifyContent: "space-between", marginTop: 20 }}>
          <span className="body-lg">
            menor peça → <Mark color="green" tilt={-2}>mais reusável</Mark>
          </span>
          <span className="body-lg">
            maior peça → <Mark color="orange" tilt={2}>mais específica</Mark>
          </span>
        </div>
      </div>
    </div>
  );
}
