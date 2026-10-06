import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { beat, countTo, drift, exit, pop, reveal, rise } from "../engine/anim";
import { Eyebrow, Mark } from "../components/ui";
import { Chaos } from "../components/Chaos";
import { Deco } from "../components/Shape";

const SQUADS = 60;
const tribe = [
  "var(--gradient-orange-crush)",
  "var(--gradient-macha)",
  "var(--gradient-purple-haze)",
  "var(--gradient-summer-fair)",
  "var(--gradient-lipstick)",
];

// Runs as one continuous sequence (no clicks): growth → chaos → question.
export default function S02Caos() {
  const root = useScene((tl, el) => {
    gsap.set(".chaos, .question", { autoAlpha: 0 });

    // 1. a empresa cresce
    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".l1", 0.2);
    pop(tl, ".l1 .mark", 0.9);
    tl.fromTo(
      ".squad",
      { scale: 0, autoAlpha: 0 },
      {
        keyframes: [
          { autoAlpha: 1, scaleX: 0.7, scaleY: 1.3, duration: 0.22, ease: "power2.out" },
          { scaleX: 1.15, scaleY: 0.85, duration: 0.14, ease: "power2.in" },
          { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
        ],
        stagger: { each: 0.025, grid: [4, 15], from: "center" },
      },
      0.7,
    );
    countTo(tl, el.querySelector(".count"), SQUADS, 0.7);
    rise(tl, ".count-wrap", 0.7);
    rise(tl, ".l2", 1.1);
    beat(tl, 1.4);

    // 2. squads collapse (anticipation: they swell first), chaos explodes in
    tl.to(".squad", { scale: 1.2, duration: 0.25, ease: "power1.out", stagger: { each: 0.004, from: "center" } });
    tl.to(".squad", { scale: 0, autoAlpha: 0, duration: 0.45, ease: "back.in(2)", stagger: { each: 0.004, from: "center" } });
    exit(tl, ".count-wrap, .l2", "<");
    tl.set(".chaos", { autoAlpha: 1 });
    tl.fromTo(
      ".chaos-piece",
      {
        autoAlpha: 0,
        scale: 0.2,
        x: () => gsap.utils.random(-420, 420),
        y: () => gsap.utils.random(-260, 260),
        rotation: () => gsap.utils.random(-60, 60),
      },
      { autoAlpha: 1, scale: 1, x: 0, y: 0, rotation: 0, duration: 1.2, ease: "back.out(1.5)", stagger: { each: 0.05, from: "random" } },
      "-=0.2",
    );
    reveal(tl, ".l3", "-=0.9");
    beat(tl, 1.8);

    // 3. a pergunta
    tl.to(".chaos", { autoAlpha: 0.12, scale: 0.94, duration: 0.9, ease: "power2.inOut" });
    exit(tl, ".l1, .l3", "<");
    tl.set(".question", { autoAlpha: 1 });
    reveal(tl, ".q1", "-=0.3");
    reveal(tl, ".q2", "-=1");
    pop(tl, ".q2 .mark", "-=0.6");
    pop(tl, ".q-deco", "-=0.8", { stagger: 0.1 });

    drift(".squad-inner", 7, 0);
    drift(".chaos-inner", 16, 4);
    drift(".q-deco .deco-inner", 30, 10);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>01 · Abertura</Eyebrow>
      <div style={{ position: "relative", marginTop: 44 }}>
        <h2 className="statement l1">
          Uma empresa de tecnologia <Mark color="green" tilt={-2}>cresce.</Mark>
        </h2>
        <h3 className="statement soft l3 abs" style={{ top: 96, left: 0 }}>
          …e o mesmo produto passa a ter isto.
        </h3>
      </div>

      <div className="row" style={{ marginTop: 80, gap: 90, alignItems: "flex-start" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(15, 40px)", gap: 18 }}>
          {Array.from({ length: SQUADS }, (_, i) => (
            <div key={i} className="squad" style={{ width: 40, height: 40 }}>
              <div className="squad-inner" style={{ width: 40, height: 40, borderRadius: "50%", background: tribe[i % tribe.length] }} />
            </div>
          ))}
        </div>
        <div className="col" style={{ gap: 22 }}>
          <div className="count-wrap row" style={{ gap: 20, alignItems: "baseline" }}>
            <span className="count hero gt gt-macha" style={{ fontSize: 170 }}>0</span>
            <span className="h3 soft">squads</span>
          </div>
          <p className="body-lg l2 soft" style={{ maxWidth: 560 }}>
            Cada squad com autonomia para experimentar e entregar rápido.
          </p>
        </div>
      </div>

      <Chaos style={{ position: "absolute", left: 180, top: 430 }} />

      <div className="question abs center" style={{ inset: 0, textAlign: "center" }}>
        <Deco className="q-deco" x={250} y={200} kind="star" grad="tangerine" size={110} />
        <Deco className="q-deco" x={1560} y={260} kind="ring" grad="purple" size={150} />
        <Deco className="q-deco" x={1500} y={760} kind="squiggle" grad="orange" size={200} />
        <div style={{ position: "relative" }}>
          <div className="display q1">Como ir rápido</div>
          <div className="display q2" style={{ marginTop: 20 }}>
            sem virar <Mark color="orange" tilt={-3}>bagunça?</Mark>
          </div>
        </div>
      </div>
    </div>
  );
}
