import type { ReactNode } from "react";
import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { drift, exit, pop, reveal, rise, spin, step } from "../engine/anim";
import { ArrowDot, Eyebrow, Mark } from "../components/ui";
import { Shape } from "../components/Shape";

const recap = [
  ["Design System", "é reuso em vários níveis", "var(--gradient-macha)"],
  ["Case iFood", "é a prova prática", "var(--gradient-lipstick)"],
  ["GenAI", "é o motivo para investir agora", "var(--gradient-purple-haze)"],
];

// the closing party: DS pieces + gradient shapes, clear of the centre column
const party: { x: number; y: number; el: ReactNode; spin?: boolean }[] = [
  { x: 170, y: 200, el: <span className="chip mono">color.brand</span> },
  { x: 1500, y: 160, el: <span className="btn">Pedir <ArrowDot /></span> },
  { x: 1640, y: 650, el: <span className="chip mono">space.md</span> },
  { x: 210, y: 880, el: <span className="btn fill">Continuar <ArrowDot /></span> },
  { x: 330, y: 360, el: <Shape kind="pinwheel" grad="orange" size={110} />, spin: true },
  { x: 1560, y: 420, el: <Shape kind="flower" grad="purple" size={140} /> },
  { x: 1760, y: 300, el: <Shape kind="star" grad="tangerine" size={80} />, spin: true },
  { x: 130, y: 560, el: <Shape kind="ring" grad="summer" size={100} /> },
  { x: 1690, y: 850, el: <Shape kind="circle" grad="core" size={110} /> },
  { x: 480, y: 860, el: <Shape kind="squircle" grad="lipstick" size={70} /> },
];

export default function S15bConclusao() {
  const root = useScene((tl) => {
    gsap.set(".layer-c", { autoAlpha: 0 });

    // B — conclusão
    rise(tl, ".eyebrow-b", 0.1);
    reveal(tl, ".b1", 0.2);
    reveal(tl, ".b2", 0.45);
    reveal(tl, ".b3", 0.7);
    pop(tl, ".b2 .mark, .b3 .mark", "-=0.6", { stagger: 0.25 });
    rise(tl, ".rc", "-=0.4", { x: -50, y: 0, stagger: 0.18 });
    step(tl);

    // C — kahoot + perguntas
    exit(tl, ".layer-b");
    tl.set(".layer-c", { autoAlpha: 1 });
    tl.addLabel("c");
    pop(tl, ".join", "c");
    pop(tl, ".kahoot-logo", "c+=0.3");
    reveal(tl, ".perguntas", "c+=0.6");
    pop(tl, ".perguntas .mark", "c+=1.3");
    rise(tl, ".thanks", "c+=1.5");
    pop(tl, ".cf", "c+=0.2", { stagger: { each: 0.06, from: "random" } });

    drift(".cf-inner", 22, 8);
    spin(".cf-spin .shape", 14);
    drift(".join-inner", 8, 1);
  });

  return (
    <div className="scene" ref={root}>
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
            <div className={`cf-inner ${c.spin ? "cf-spin" : ""}`}>{c.el}</div>
          </div>
        ))}

        <div
          className="abs"
          style={{ inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}
        >
          <div className="join">
            <div
              className="join-inner row"
              style={{
                padding: "36px 48px",
                borderRadius: 28,
                background: "var(--color-surface)",
                border: "2px solid var(--color-border)",
                color: "var(--color-just-black)",
                alignItems: "center",
              }}
            >
              <img
                className="kahoot-logo"
                src={`${import.meta.env.BASE_URL}kahoot-logo.svg`}
                alt="Kahoot!"
                style={{ width: 360, display: "block" }}
              />
            </div>
          </div>
          <div className="hero perguntas" style={{ marginTop: 64, fontSize: 170 }}>
            Perguntas<Mark color="orange" tilt={6} style={{ marginLeft: 12 }}>?</Mark>
          </div>
          <div className="thanks body-lg soft" style={{ marginTop: 34 }}>
            Obrigado! · Ana Lívia Garbin · Bruno Breda · Guilherme Bueno · Gabriel Fachini · Felipe Corerato
          </div>
        </div>
      </div>
    </div>
  );
}
