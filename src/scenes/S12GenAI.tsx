import type { CSSProperties } from "react";
import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { exit, float, pop, reveal, rise, step } from "../engine/anim";
import { Arrow, ArrowDot, Eyebrow, Mark } from "../components/ui";
import { chaosPieces } from "../components/Chaos";
import { Deco, GradDef } from "../components/Shape";

const prompts = ["gere a tela de checkout", "crie um botão de pedir", "faça o card de produto"];

// three random-ish outputs from the "no context" side
const wild = [chaosPieces[1], chaosPieces[8], chaosPieces[4]];

const agentGrads = [
  "var(--gradient-macha)",
  "var(--gradient-summer-fair)",
  "var(--gradient-purple-haze)",
  "var(--gradient-orange-crush)",
  "var(--gradient-lipstick)",
];

const base: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
};

function Prompt({ text }: { text: string }) {
  return (
    <div className="prompt code" style={{ fontSize: 18, padding: "12px 18px" }}>
      <span className="s">›</span> {text}
    </div>
  );
}

function Agent({ i }: { i: number }) {
  return (
    <div className="agent">
      <div
        className="agent-inner center"
        style={{
          width: 70,
          height: 70,
          borderRadius: 20,
          background: agentGrads[i % agentGrads.length],
          fontFamily: "var(--font-mono)",
          fontSize: 20,
          fontWeight: 700,
          color: "var(--color-just-black)",
        }}
      >
        AI
      </div>
    </div>
  );
}

function Person() {
  return (
    <div className="person col" style={{ alignItems: "center", gap: 4 }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--color-primary)" }} />
      <div style={{ width: 56, height: 32, borderRadius: "28px 28px 8px 8px", background: "var(--color-primary)" }} />
    </div>
  );
}

export default function S12GenAI() {
  const root = useScene((tl) => {
    gsap.set(".layer-b", { autoAlpha: 0 });

    // A — the new scenario
    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".a1", 0.2);
    rise(tl, ".person", 0.8, { y: 40, stagger: 0.08 });
    pop(tl, ".plus", 1.2);
    pop(tl, ".agent", 1.3, { stagger: 0.06 });
    reveal(tl, ".a2", 1.6);
    pop(tl, ".a2 .mark", 2.0);
    rise(tl, ".a3", 2.1);
    step(tl);

    // B — without vs with the DS
    exit(tl, ".layer-a");
    tl.set(".layer-b", { autoAlpha: 1 });
    reveal(tl, ".b-title");
    rise(tl, ".left .side-title", "-=0.9");
    rise(tl, ".left .prompt", "-=0.7", { x: -40, y: 0, stagger: 0.12 });
    tl.from(".left .arrow", { scaleX: 0, transformOrigin: "left", duration: 0.4, stagger: 0.1 }, "-=0.5");
    tl.fromTo(
      ".left .out",
      { autoAlpha: 0, scale: 0.2, rotation: () => gsap.utils.random(-40, 40) },
      { autoAlpha: 1, scale: 1, rotation: () => gsap.utils.random(-6, 6), duration: 0.9, ease: "back.out(2.2)", stagger: 0.15 },
    );
    rise(tl, ".left .verdict", "-=0.4");
    pop(tl, ".left .verdict .mark", "-=0.6");
    // the lightning strikes down from the word: stretch on the way, flicker, settle
    tl.fromTo(
      ".bolt",
      { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 0%" },
      {
        keyframes: [
          { autoAlpha: 1, scaleY: 1.18, scaleX: 0.86, duration: 0.2, ease: "power4.in" },
          { autoAlpha: 0.25, duration: 0.05, ease: "steps(1)" },
          { autoAlpha: 1, duration: 0.05, ease: "steps(1)" },
          { autoAlpha: 0.25, duration: 0.05, ease: "steps(1)" },
          { autoAlpha: 1, duration: 0.05, ease: "steps(1)" },
          { scaleY: 1, scaleX: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" },
        ],
      },
      "-=0.3",
    );
    step(tl);

    rise(tl, ".right .side-title");
    rise(tl, ".right .prompt", "-=0.8", { x: -40, y: 0, stagger: 0.12 });
    pop(tl, ".harness", "-=0.5");
    pop(tl, ".harness .chip", "-=0.5", { stagger: 0.05 });
    tl.from(".right .arrow", { scaleX: 0, transformOrigin: "left", duration: 0.4, stagger: 0.1 }, "-=0.3");
    rise(tl, ".right .out", "-=0.2", { x: -40, y: 0, stagger: 0.12 });
    rise(tl, ".right .verdict", "-=0.4");
    pop(tl, ".right .verdict .mark", "-=0.6");

    gsap
      .timeline({ repeat: -1, repeatDelay: 2.2, delay: 1 })
      .to(".bolt-inner", { opacity: 0.3, duration: 0.06, repeat: 3, yoyo: true, ease: "steps(1)" })
      .to(".bolt-inner", { scaleX: 1.08, scaleY: 0.94, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out", transformOrigin: "50% 0%" }, 0);
    float(".agent-inner", 10, 8);
    float(".a-deco .deco-inner", 12, 10);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>06 · Design System na era da GenAI</Eyebrow>

      <div className="layer-a abs" style={{ inset: 0, padding: "210px var(--gutter) 110px" }}>
        <Deco className="a-deco" x={1560} y={150} kind="pinwheel" grad="macha" size={140} />
        <Deco className="a-deco" x={1660} y={720} kind="ring" grad="summer" size={110} />
        <h2 className="display a1">Agora não são só pessoas.</h2>
        <div className="row" style={{ gap: 24, marginTop: 70 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <Person key={i} />
          ))}
          <span className="plus h1 muted" style={{ margin: "0 18px" }}>+</span>
          {Array.from({ length: 9 }, (_, i) => (
            <Agent key={i} i={i} />
          ))}
        </div>
        <h3 className="h1 a2" style={{ marginTop: 64 }}>
          São <Mark color="green" tilt={-2}>agentes</Mark> também.
        </h3>
        <p className="a3 body-lg soft" style={{ marginTop: 26 }}>
          Gerando código e interfaces em paralelo, o tempo todo.
        </p>
      </div>

      <div className="layer-b abs" style={{ inset: 0, padding: "190px var(--gutter) 110px" }}>
        <h2 className="h1 b-title">Cada prompt, um botão novo?</h2>
        <div className="row" style={{ marginTop: 60, gap: 80, alignItems: "flex-start" }}>
          {/* sem DS */}
          <div className="left col grow" style={{ gap: 24 }}>
            <div className="side-title h3">
              <Mark color="orange" tilt={-2}>Sem padrão</Mark>
            </div>
            {prompts.map((p, i) => (
              <div key={p} className="row" style={{ gap: 18, height: 86 }}>
                <Prompt text={p} />
                <Arrow className="arrow" width={50} />
                <div className="out">
                  <div style={{ ...base, ...wild[i].s }}>Pedir</div>
                </div>
              </div>
            ))}
            <p className="verdict body-lg">
              O produto vira um{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                <Mark color="orange" tilt={1}>Frankenstein</Mark>
                <span className="bolt abs" style={{ left: "50%", top: "100%", marginLeft: -40, marginTop: 4 }}>
                  <svg className="bolt-inner" width={80} height={140} viewBox="0 0 60 105" style={{ display: "block", overflow: "visible" }}>
                    <GradDef name="tangerine" id="bolt-g" w={60} h={105} />
                    <path d="M38 0 L6 60 H28 L16 105 L56 40 H34 L48 0 Z" fill="url(#bolt-g)" stroke="url(#bolt-g)" strokeWidth={3} strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
              .
            </p>
          </div>

          {/* com DS */}
          <div className="right col grow" style={{ gap: 24 }}>
            <div className="side-title h3">
              <Mark color="green" tilt={2}>Com o DS como harness</Mark>
            </div>
            <div className="row" style={{ gap: 18, alignItems: "stretch" }}>
              <div className="col" style={{ gap: 24 }}>
                {prompts.map((p) => (
                  <div key={p} className="row" style={{ height: 86 }}>
                    <Prompt text={p} />
                  </div>
                ))}
              </div>
              <div
                className="harness col"
                style={{
                  width: 196,
                  borderRadius: 22,
                  padding: 3,
                  background: "var(--gradient-macha)",
                }}
              >
                <div className="col" style={{ flex: 1, borderRadius: 19, background: "var(--color-bg)", padding: 14, gap: 8, justifyContent: "center" }}>
                  <span className="label muted" style={{ fontSize: 14 }}>VOCABULÁRIO</span>
                  {["<Button>", "<Card>", "<Input>", "color.brand", "space.md"].map((c) => (
                    <span key={c} className="chip mono" style={{ fontSize: 14, padding: "6px 12px", alignSelf: "flex-start" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col" style={{ gap: 24 }}>
                {prompts.map((p) => (
                  <div key={p} className="row" style={{ gap: 16, height: 86 }}>
                    <Arrow className="arrow" width={40} />
                    <span className="btn fill out" style={{ height: 54, fontSize: 20 }}>
                      Pedir <ArrowDot />
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="verdict body-lg">
              A IA <Mark color="green" tilt={-1}>compõe</Mark> com peças existentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
