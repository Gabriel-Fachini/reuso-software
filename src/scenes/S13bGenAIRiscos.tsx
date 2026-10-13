import { useScene } from "../engine/useScene";
import { arcIn, float, pop, reveal, rise } from "../engine/anim";
import { Eyebrow, Mark } from "../components/ui";
import { Shape } from "../components/Shape";
import type { GradName, ShapeKind } from "../components/Shape";

/*
 * The risks of putting the DS in the agents' loop, then the closing line.
 * One flow. The green tide of scene 16 drains into "riscos?" (praticaRiscos).
 */

const risks: { title: string; desc: string; shape: ShapeKind; grad: GradName }[] = [
  { title: "DS desatualizado", desc: "a IA repete o erro em escala, em todas as telas", shape: "diamond", grad: "lipstick" },
  { title: "Contexto custa caro", desc: "cada componente documentado ocupa a janela do modelo", shape: "hourglass", grad: "tangerine" },
  { title: "Ferramentas imaturas", desc: "boa parte ainda em preview ou beta; muda a cada versão", shape: "squircle", grad: "summer" },
  { title: "Tudo com a mesma cara", desc: "sem identidade própria, todo produto parece igual", shape: "circle", grad: "text" },
];

export default function S13bGenAIRiscos() {
  const root = useScene((tl) => {
    rise(tl, ".eyebrow", 0.1);
    rise(tl, ".t1", 0.2, { y: 40 });
    pop(tl, ".t-mark", 0.4);
    arcIn(tl, ".risk", 0.6, { x: 120, y: 140, rotation: 5 }, { stagger: 0.12 });
    pop(tl, ".risk .icon", 0.9, { stagger: 0.12 });
    reveal(tl, ".c-end", 1.8);
    pop(tl, ".c-end .mark", 2.3);

    float(".risk .icon", 10, 10);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>06 · Design System na era da GenAI</Eyebrow>
      <h2 className="h1 title" style={{ marginTop: 34 }}>
        <span className="t1" style={{ display: "inline-block" }}>E os</span>{" "}
        <Mark className="t-mark" color="green" tilt={-2} style={{ display: "inline-block" }}>
          riscos?
        </Mark>
      </h2>

      <div className="row" style={{ gap: 40, marginTop: 90 }}>
        {risks.map((r) => (
          <div key={r.title} className="risk">
            <div className="card col" style={{ width: 390, height: 340, padding: 30, gap: 14 }}>
              <div className="icon center" style={{ width: 56, height: 56 }}>
                <Shape kind={r.shape} grad={r.grad} size={r.shape === "hourglass" ? 40 : 56} />
              </div>
              <span className="h3" style={{ fontSize: 34, fontWeight: 600, marginTop: 8 }}>{r.title}</span>
              <span className="soft" style={{ fontSize: 25, lineHeight: 1.35 }}>{r.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="c-end statement" style={{ fontSize: 48, marginTop: 80 }}>
        O DS vira <Mark color="green" tilt={-1}>infraestrutura crítica:</Mark> governança e versionamento pesam mais.
      </p>
    </div>
  );
}
