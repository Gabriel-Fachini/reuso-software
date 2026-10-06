import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { breathe, drift, drop, exit, pop, reveal, rise, step } from "../engine/anim";
import { Dado, Eyebrow, Mark } from "../components/ui";
import { Chaos } from "../components/Chaos";
import { Deco } from "../components/Shape";

export default function S10IfoodProblema() {
  const root = useScene((tl) => {
    gsap.set(".layer-b, .layer-c", { autoAlpha: 0 });
    gsap.set(".venn-mid", { xPercent: -50, yPercent: -50 });

    // A — callback to the opening
    rise(tl, ".eyebrow", 0.1);
    tl.from(".echo", { autoAlpha: 0, scale: 1.08, duration: 1.4, ease: "power2.out" }, 0.2);
    reveal(tl, ".qa", 0.4);
    step(tl);

    // B — the reveal: the logo falls in with weight and squashes on landing
    exit(tl, ".layer-a");
    tl.set(".layer-b", { autoAlpha: 1 });
    reveal(tl, ".rb1");
    drop(tl, ".logo", "-=0.6");
    pop(tl, ".b-deco", "-=0.6", { stagger: 0.12 });
    step(tl);

    // C — problem + organisational answer
    exit(tl, ".layer-b");
    tl.set(".layer-c", { autoAlpha: 1 });
    reveal(tl, ".c-title");
    rise(tl, ".prob li", "-=0.8", { x: -40, y: 0, stagger: 0.18 });
    tl.from(".venn-a", { x: -220, autoAlpha: 0, duration: 1.3, ease: "expo.out" }, "-=0.6");
    tl.from(".venn-b", { x: 220, autoAlpha: 0, duration: 1.3, ease: "expo.out" }, "<");
    pop(tl, ".venn-mid", "-=0.5");
    rise(tl, ".insight", "-=0.4");
    pop(tl, ".insight .mark", "-=0.6");

    drift(".echo .chaos-inner", 14, 4);
    drift(".b-deco .deco-inner", 34, 14);
    drift(".venn-shape", 14, 3);
    breathe(".venn-shape", 0.03);
    gsap.to(".logo-inner", { y: -22, rotation: -1.5, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>05 · Case iFood</Eyebrow>

      <div className="layer-a abs" style={{ inset: 0 }}>
        <div className="echo abs" style={{ left: 180, top: 380, opacity: 0.16 }}>
          <Chaos />
        </div>
        <div className="abs center" style={{ inset: 0 }}>
          <h2 className="display qa" style={{ textAlign: "center", fontSize: 128 }}>
            Lembram daquela empresa?
          </h2>
        </div>
      </div>

      <div className="layer-b abs center" style={{ inset: 0, textAlign: "center" }}>
        <Deco className="b-deco" x={260} y={240} kind="star" grad="tangerine" size={110} />
        <Deco className="b-deco" x={1520} y={220} kind="ring" grad="lipstick" size={150} />
        <Deco className="b-deco" x={1460} y={760} kind="flower" grad="purple" size={150} />
        <Deco className="b-deco" x={330} y={740} kind="squiggle" grad="orange" size={190} />
        <div style={{ position: "relative" }}>
          <div className="statement soft rb1">Esse cenário aconteceu no</div>
          <div className="logo" style={{ marginTop: 50 }}>
            <img className="logo-inner" src={`${import.meta.env.BASE_URL}ifood-logo.svg`} alt="iFood" style={{ width: 640, display: "block", margin: "0 auto" }} />
          </div>
        </div>
      </div>

      <div className="layer-c abs" style={{ inset: 0, padding: "190px var(--gutter) 110px" }}>
        <h2 className="h1 c-title">O problema era de escala.</h2>
        <div className="row" style={{ marginTop: 70, gap: 90, alignItems: "flex-start" }}>
          <ul className="prob col" style={{ listStyle: "none", gap: 40, width: 760 }}>
            {[
              <>Cultura <Mark color="orange" tilt={-2}>fail-fast</Mark>: experimentar e entregar rápido</>,
              <>Muitos times entregando em paralelo <Dado>nº de times</Dado></>,
              <>Consistência de design cada vez mais difícil de manter</>,
            ].map((t, i) => (
              <li key={i} className="row body-lg" style={{ gap: 26, alignItems: "baseline" }}>
                <span className="mono muted" style={{ fontSize: 22 }}>0{i + 1}</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div className="col" style={{ alignItems: "center", gap: 40 }}>
            <div style={{ position: "relative", width: 600, height: 320 }}>
              <div className="venn-a abs" style={{ left: 30, top: 0, mixBlendMode: "multiply" }}>
                <div className="venn-shape center" style={{ width: 320, height: 320, borderRadius: "50%", background: "var(--gradient-orange-crush)", opacity: 0.85 }}>
                  <span className="h3" style={{ color: "var(--color-just-black)", fontWeight: 600, marginRight: 110 }}>Tech</span>
                </div>
              </div>
              <div className="venn-b abs" style={{ left: 250, top: 0, mixBlendMode: "multiply" }}>
                <div className="venn-shape center" style={{ width: 320, height: 320, borderRadius: "50%", background: "var(--gradient-purple-haze)", opacity: 0.85 }}>
                  <span className="h3" style={{ color: "var(--color-just-black)", fontWeight: 600, marginLeft: 110 }}>Design</span>
                </div>
              </div>
              <div className="venn-mid abs" style={{ left: 300, top: 160 }}>
                <span className="chip" style={{ background: "var(--color-bg)", borderColor: "var(--color-primary)", fontSize: 20 }}>
                  força-tarefa
                </span>
              </div>
            </div>
            <p className="insight body-lg" style={{ maxWidth: 600, textAlign: "center" }}>
              Design System é problema de <Mark color="green" tilt={-2}>pessoas e processos</Mark> tanto quanto de código.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
