import type { ReactNode } from "react";
import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { arcIn, breathe, exit, float, pop, reveal, rise, spin, step } from "../engine/anim";
import { ArrowDot, Eyebrow, Mark } from "../components/ui";
import { Shape } from "../components/Shape";
import type { GradName, ShapeKind } from "../components/Shape";

const challenges: [string, string, ShapeKind, GradName][] = [
  ["Adoção", "não basta existir, os times precisam usar", "circle", "tangerine"],
  ["Manutenção contínua", "é um produto, não um projeto com fim", "ring", "summer"],
  ["Rigidez", "padrão demais pode limitar a criatividade", "squircle", "text"],
  ["Breaking changes", "dependência entre times e versões", "diamond", "lipstick"],
  ["Custo", "alto para empresas pequenas", "flower", "core"],
];

const recap = [
  ["Design System", "é reuso em vários níveis", "var(--gradient-macha)"],
  ["Case iFood", "é a prova prática", "var(--gradient-lipstick)"],
  ["GenAI", "é o motivo para investir agora", "var(--gradient-purple-haze)"],
];

// the closing party: DS pieces + gradient shapes
const party: { x: number; y: number; el: ReactNode }[] = [
  { x: 170, y: 170, el: <span className="chip mono">color.brand</span> },
  { x: 1480, y: 150, el: <span className="btn">Pedir <ArrowDot /></span> },
  { x: 1600, y: 760, el: <span className="chip mono">space.md</span> },
  { x: 230, y: 770, el: <span className="btn fill">Continuar <ArrowDot /></span> },
];

export default function S15Fechamento() {
  const root = useScene((tl) => {
    gsap.set(".layer-b, .layer-c", { autoAlpha: 0 });

    // A — desafios
    rise(tl, ".eyebrow-a", 0.1);
    reveal(tl, ".a-title", 0.2);
    arcIn(tl, ".ch", 0.6, { x: 120, y: 140, rotation: 6 }, { stagger: 0.14 });
    pop(tl, ".ch .icon", 1.0, { stagger: 0.14 });
    step(tl);

    // B — conclusão
    exit(tl, ".layer-a");
    tl.set(".layer-b", { autoAlpha: 1 });
    rise(tl, ".eyebrow-b");
    reveal(tl, ".b1", "-=0.8");
    reveal(tl, ".b2", "-=1");
    reveal(tl, ".b3", "-=1");
    pop(tl, ".b2 .mark, .b3 .mark", "-=0.6", { stagger: 0.25 });
    rise(tl, ".rc", "-=0.4", { x: -50, y: 0, stagger: 0.18 });
    step(tl);

    // C — kahoot + perguntas
    exit(tl, ".layer-b");
    tl.set(".layer-c", { autoAlpha: 1 });
    pop(tl, ".cf", undefined, { stagger: 0.07 });
    pop(tl, ".kahoot", "-=0.6");
    rise(tl, ".pin", "-=0.5");
    reveal(tl, ".perguntas", "-=0.3");
    pop(tl, ".perguntas .mark", "-=0.5");
    rise(tl, ".thanks", "-=0.4");

    float(".ch .icon", 10, 10);
    float(".cf-inner", 14, 8);
    spin(".cf .d-spin .shape", 14);
    breathe(".kahoot-inner", 0.05);
  });

  return (
    <div className="scene" ref={root}>
      <div className="layer-a abs" style={{ inset: 0, padding: "92px var(--gutter) 110px" }}>
        <div className="eyebrow-a">
          <Eyebrow>08 · Desafios e limitações</Eyebrow>
        </div>
        <h2 className="h1 a-title" style={{ marginTop: 34 }}>
          Não é bala de prata.
        </h2>
        <div className="row" style={{ marginTop: 70, gap: 22, alignItems: "stretch" }}>
          {challenges.map(([t, d, shape, grad]) => (
            <div key={t} className="ch" style={{ flex: 1 }}>
              <div className="card col" style={{ height: 460, justifyContent: "space-between", padding: 30 }}>
                <div className="icon">
                  <Shape kind={shape} grad={grad} size={96} />
                </div>
                <div>
                  <div className="h3" style={{ fontSize: 34, fontWeight: 600 }}>{t}</div>
                  <div className="soft" style={{ fontSize: 21, marginTop: 10, lineHeight: 1.35 }}>{d}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="layer-b abs" style={{ inset: 0, padding: "92px var(--gutter) 110px" }}>
        <div className="eyebrow-b">
          <Eyebrow>09 · Conclusão</Eyebrow>
        </div>
        <div style={{ marginTop: 80 }}>
          <div className="statement b1" style={{ fontSize: 80 }}>Dá para ir rápido sem virar bagunça,</div>
          <div className="statement b2" style={{ fontSize: 80, marginTop: 14 }}>
            desde que o reuso seja <Mark color="green" tilt={-2}>estratégia</Mark>
          </div>
          <div className="statement b3" style={{ fontSize: 80, marginTop: 14 }}>
            e não <Mark color="orange" tilt={2}>acaso.</Mark>
          </div>
        </div>
        <div className="col" style={{ marginTop: 70, gap: 26 }}>
          {recap.map(([a, b, bg]) => (
            <div key={a} className="rc row" style={{ gap: 26 }}>
              <span style={{ width: 30, height: 30, borderRadius: "50%", background: bg, flexShrink: 0 }} />
              <span className="h2" style={{ fontWeight: 600 }}>{a}</span>
              <span className="h2 soft" style={{ fontWeight: 400 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="layer-c abs" style={{ inset: 0 }}>
        {party.map((c, i) => (
          <div key={i} className="cf abs" style={{ left: c.x, top: c.y }}>
            <div className="cf-inner">{c.el}</div>
          </div>
        ))}
        <div className="cf abs" style={{ left: 380, top: 380 }}>
          <div className="cf-inner d-spin"><Shape kind="pinwheel" grad="orange" size={110} /></div>
        </div>
        <div className="cf abs" style={{ left: 1430, top: 420 }}>
          <div className="cf-inner"><Shape kind="flower" grad="purple" size={140} /></div>
        </div>
        <div className="cf abs" style={{ left: 1720, top: 330 }}>
          <div className="cf-inner d-spin"><Shape kind="star" grad="tangerine" size={80} /></div>
        </div>
        <div className="cf abs" style={{ left: 120, top: 520 }}>
          <div className="cf-inner"><Shape kind="ring" grad="summer" size={100} /></div>
        </div>
        <div className="cf abs" style={{ left: 1560, top: 860 }}>
          <div className="cf-inner"><Shape kind="dome" grad="core" size={220} /></div>
        </div>

        <div className="abs col center" style={{ inset: 0, textAlign: "center" }}>
          <div className="kahoot">
            <div className="kahoot-inner btn fill" style={{ height: 70, fontSize: 30, padding: "0 16px 0 34px" }}>
              Hora do Kahoot! <ArrowDot />
            </div>
          </div>
          <div className="pin" style={{ marginTop: 28, fontSize: 40 }}>
            <span className="dado">[PIN do jogo]</span>
          </div>
          <div className="hero perguntas" style={{ marginTop: 50, fontSize: 190 }}>
            Perguntas<Mark color="orange" tilt={6} style={{ marginLeft: 12 }}>?</Mark>
          </div>
          <div className="thanks body-lg soft" style={{ marginTop: 34 }}>
            Obrigado! · Ana Lívia · Bruno · Bueno · Gabriel · Prato
          </div>
        </div>
      </div>
    </div>
  );
}
