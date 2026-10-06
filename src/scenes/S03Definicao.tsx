import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { breathe, drawIn, float, pop, reveal, rise } from "../engine/anim";
import { Eyebrow, Mark } from "../components/ui";
import { Deco, GradDef } from "../components/Shape";

const C = 380; // diagram center (760 x 760)

const legend = [
  { name: "Style guide", desc: "regras visuais: cores, tipografia, tom de voz", bg: "var(--gradient-orange-crush)" },
  { name: "Biblioteca de componentes", desc: "código reutilizável", bg: "var(--gradient-purple-haze)" },
  { name: "Design System", desc: "os dois + governança, documentação e processo", bg: "var(--gradient-macha)" },
];

export default function S03Definicao() {
  const root = useScene((tl) => {
    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".title", 0.2);
    rise(tl, ".def", 0.8);

    // inner → outer, each ring "draws" itself and its legend row follows
    pop(tl, ".inner", 1.0);
    rise(tl, ".lg-0", 1.1, { x: -40, y: 0 });
    drawIn(tl, ".ring-mid", 1.4, { duration: 1.3 });
    pop(tl, ".badge-mid", 2.0);
    rise(tl, ".lg-1", 1.7, { x: -40, y: 0 });
    drawIn(tl, ".ring-out", 2.1, { duration: 1.5 });
    pop(tl, ".badge-out", 2.9);
    rise(tl, ".lg-2", 2.4, { x: -40, y: 0 });
    pop(tl, ".def .mark", 2.6, { stagger: 0.08 });
    rise(tl, ".refs", 3.1);
    pop(tl, ".s-deco", 1.2, { stagger: 0.15 });

    // secondary action: gradients orbit, the core breathes
    gsap.to(".ring-mid", { rotation: 360, svgOrigin: `${C} ${C}`, duration: 18, ease: "none", repeat: -1 });
    gsap.to(".ring-out", { rotation: -360, svgOrigin: `${C} ${C}`, duration: 26, ease: "none", repeat: -1 });
    breathe(".inner-shape", 0.04);
    float(".s-deco .deco-inner", 12, 10);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>02 · O que é um Design System</Eyebrow>

      <div className="row" style={{ flex: 1, gap: 60, alignItems: "center" }}>
        <div style={{ width: 860 }}>
          <h2 className="h1 title">Fonte única da verdade.</h2>
          <p className="def body-lg soft" style={{ marginTop: 34, lineHeight: 1.5 }}>
            Conjunto de <Mark color="ivory" tilt={0}>padrões</Mark>, <Mark color="ivory" tilt={0}>componentes</Mark>,{" "}
            <Mark color="ivory" tilt={0}>tokens</Mark>, <Mark color="ivory" tilt={0}>documentação</Mark> e{" "}
            <Mark color="ivory" tilt={0}>governança</Mark> compartilhado por design e desenvolvimento.
          </p>

          <div className="col" style={{ gap: 22, marginTop: 44 }}>
            {legend.map((l, i) => (
              <div key={l.name} className={`lg-${i} row`} style={{ gap: 20 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: l.bg, flexShrink: 0 }} />
                <span className="label" style={{ fontSize: 26 }}>{l.name}</span>
                <span className="muted" style={{ fontSize: 21 }}>{l.desc}</span>
              </div>
            ))}
          </div>

          <div className="refs row" style={{ gap: 14, marginTop: 44 }}>
            <span className="muted label" style={{ fontSize: 17 }}>REFERÊNCIAS</span>
            <span className="chip">Material Design · Google</span>
            <span className="chip">Atomic Design · Brad Frost</span>
          </div>
        </div>

        <div style={{ position: "relative", width: 760, height: 760, flexShrink: 0 }}>
          <Deco className="s-deco" x={640} y={40} kind="star" grad="tangerine" size={70} />
          <Deco className="s-deco" x={30} y={640} kind="diamond" grad="summer" size={60} />

          <svg width={760} height={760} style={{ overflow: "visible" }}>
            <GradDef name="purple" id="ring-mid-g" w={760} h={760} />
            <GradDef name="macha" id="ring-out-g" w={760} h={760} />
            <circle className="ring-out" cx={C} cy={C} r={345} fill="none" stroke="url(#ring-out-g)" strokeWidth={30} strokeLinecap="round" transform={`rotate(-90 ${C} ${C})`} />
            <circle className="ring-mid" cx={C} cy={C} r={225} fill="none" stroke="url(#ring-mid-g)" strokeWidth={30} strokeLinecap="round" transform={`rotate(-90 ${C} ${C})`} />
          </svg>

          <div className="inner abs" style={{ left: C - 125, top: C - 125 }}>
            <div className="inner-shape center" style={{ width: 250, height: 250, borderRadius: "50%", background: "var(--gradient-tangerine)" }}>
              <span style={{ color: "var(--color-just-black)", fontSize: 30, fontWeight: 600 }}>Style guide</span>
            </div>
          </div>

          <div className="badge-mid abs" style={{ left: C, top: C - 225, translate: "-50% -50%" }}>
            <span className="chip" style={{ background: "var(--color-just-black)", borderColor: "var(--color-lilac-soft)", fontSize: 20 }}>
              Biblioteca de componentes
            </span>
          </div>
          <div className="badge-out abs" style={{ left: C, top: C - 345, translate: "-50% -50%" }}>
            <span className="chip" style={{ background: "var(--color-just-black)", borderColor: "var(--color-shockingly-green)", fontSize: 22 }}>
              Design System
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
