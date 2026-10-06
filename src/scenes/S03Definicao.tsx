import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { breathe, drawIn, drift, pop, reveal, rise } from "../engine/anim";
import { Eyebrow, Mark } from "../components/ui";
import { Deco, GradDef } from "../components/Shape";

const C = 380; // diagram center (760 x 760)

// satellites riding each ring (angles in degrees, 0 = top)
const sats = {
  mid: { r: 225, angles: [40, 160, 280], fill: "var(--color-pink)" },
  out: { r: 345, angles: [100, 210, 330], fill: "var(--color-lt-green)" },
};
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return { cx: C + r * Math.cos(a), cy: C + r * Math.sin(a) };
};

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
    pop(tl, ".sat-mid", 2.2, { stagger: 0.1, transformOrigin: "50% 50%" });
    pop(tl, ".sat-out", 3.0, { stagger: 0.1, transformOrigin: "50% 50%" });

    // secondary action: gradients and satellites orbit, the core breathes and
    // sends ripples out through the layers (the single source of truth)
    gsap.to(".ring-mid", { rotation: 360, svgOrigin: `${C} ${C}`, duration: 18, ease: "none", repeat: -1 });
    gsap.to(".ring-out", { rotation: -360, svgOrigin: `${C} ${C}`, duration: 26, ease: "none", repeat: -1 });
    gsap.to(".orbit-mid", { rotation: 360, svgOrigin: `${C} ${C}`, duration: 14, ease: "none", repeat: -1 });
    gsap.to(".orbit-out", { rotation: -360, svgOrigin: `${C} ${C}`, duration: 22, ease: "none", repeat: -1 });
    gsap.set(".ripple", { autoAlpha: 0 });
    gsap.fromTo(
      ".ripple",
      { scale: 1, autoAlpha: 0.8 },
      {
        scale: 2.8,
        autoAlpha: 0,
        svgOrigin: `${C} ${C}`,
        duration: 3.4,
        ease: "power2.out",
        delay: 1.6,
        stagger: { each: 1.7, repeat: -1 },
        immediateRender: false,
      },
    );
    breathe(".inner-shape", 0.06);
    drift(".badge-mid .chip, .badge-out .chip", 8, 2);
    drift(".s-deco .deco-inner", 26, 12);
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
            {[0, 1].map((i) => (
              <circle key={i} className="ripple" cx={C} cy={C} r={125} fill="none" stroke="var(--color-orangey)" strokeWidth={3} vectorEffect="non-scaling-stroke" />
            ))}
            {(["mid", "out"] as const).map((k) => (
              <g key={k} className={`orbit-${k}`}>
                {sats[k].angles.map((deg) => (
                  <circle
                    key={deg}
                    className={`sat-${k}`}
                    {...polar(sats[k].r, deg)}
                    r={13}
                    fill={sats[k].fill}
                    stroke="var(--color-bg)"
                    strokeWidth={6}
                  />
                ))}
              </g>
            ))}
          </svg>

          <div className="inner abs" style={{ left: C - 125, top: C - 125 }}>
            <div className="inner-shape center" style={{ width: 250, height: 250, borderRadius: "50%", background: "var(--gradient-tangerine)" }}>
              <span style={{ color: "var(--color-just-black)", fontSize: 30, fontWeight: 600 }}>Style guide</span>
            </div>
          </div>

          <div className="badge-mid abs" style={{ left: C, top: C - 225, translate: "-50% -50%" }}>
            <span className="chip" style={{ background: "var(--color-bg)", borderColor: "var(--color-lilac-soft)", fontSize: 20 }}>
              Biblioteca de componentes
            </span>
          </div>
          <div className="badge-out abs" style={{ left: C, top: C - 345, translate: "-50% -50%" }}>
            <span className="chip" style={{ background: "var(--color-bg)", borderColor: "var(--color-shockingly-green)", fontSize: 22 }}>
              Design System
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
