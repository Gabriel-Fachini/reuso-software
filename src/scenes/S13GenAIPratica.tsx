import type { ReactNode } from "react";
import { gsap, SplitText } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { arcIn, float, pop, reveal, rise, step } from "../engine/anim";
import { Arrow, ArrowDot, Eyebrow, Mark } from "../components/ui";
import { Deco, Shape } from "../components/Shape";
import type { GradName, ShapeKind } from "../components/Shape";
import { AgentChip } from "./S12bGenAIReuso";

/*
 * The DS around the generation, as one flow from Figma to CI:
 *   before (design) → during (the agent generates with the context of
 *   scene 15) → after (lint in CI). Then the message.
 * The MCP frame of scene 15 lands on the middle card (contextoPratica).
 */

const CARD_W = 520;
const CARD_H = 520;
const GAP = 60;

function Card({ n, when, title, shape, grad, children }: { n: number; when: string; title: string; shape: ShapeKind; grad: GradName; children: ReactNode }) {
  return (
    <div className={`pc pc-${n}`}>
      <div className="card col" style={{ width: CARD_W, height: CARD_H, padding: 32, gap: 18 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="label green" style={{ fontSize: 21 }}>{when}</span>
          <div className="icon">
            <Shape kind={shape} grad={grad} size={52} />
          </div>
        </div>
        <span className="h3" style={{ fontSize: 36, fontWeight: 600 }}>{title}</span>
        <div className="col grow" style={{ gap: 18, justifyContent: "center" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function S13GenAIPratica() {
  const root = useScene((tl) => {
    gsap.set(".message", { autoAlpha: 0 });

    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".title", 0.2);
    reveal(tl, ".title2", 0.45);

    // all three stages enter together, then the flow arrows draw between them
    arcIn(tl, ".pc-1", 0.5, { x: -120, y: 100, rotation: -4 });
    arcIn(tl, ".pc-2", 0.65, { x: -120, y: 100, rotation: -4 });
    arcIn(tl, ".pc-3", 0.8, { x: -120, y: 100, rotation: -4 });
    pop(tl, ".pc .icon", 0.9, { stagger: 0.15 });
    tl.from(".flow-arrow", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.5, ease: "power2.out", stagger: 0.2 }, 1.2);

    // 01 before — the Figma frame already points at the real component
    pop(tl, ".frame", 1.1);
    tl.from(".pc-1 .arrow", { scaleX: 0, transformOrigin: "left", duration: 0.5 }, 1.4);
    rise(tl, ".d2c-code", 1.7, { x: -30, y: 0 });
    rise(tl, ".pc-1 .note", 1.9);

    // 02 during — the agent asks the DS (scene 15) and writes with what exists
    const typed = SplitText.create(".pc-2 .call", { type: "chars" });
    tl.from(typed.chars, { autoAlpha: 0, duration: 0.01, stagger: 0.025, ease: "none" }, 1.3);
    rise(tl, ".pc-2 .answer", 2.0, { y: 16 });
    rise(tl, ".pc-2 .gen", 2.4, { y: 16 });
    rise(tl, ".pc-2 .note", 2.6);

    // 03 after — the lint demo loops on its own timeline
    // (restarted here so it begins from the top)
    const lint = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
    lint
      .set(".bad", { autoAlpha: 1, x: 0, y: 0 })
      .set(".good, .fixed", { autoAlpha: 0 })
      .set(".squiggle", { scaleX: 0, transformOrigin: "left" })
      .set(".lint-err", { autoAlpha: 0, y: -10 })
      .to(".squiggle", { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, 0.6)
      .to(".lint-err", { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" }, 1.2)
      .to(".bad", { x: 6, duration: 0.06, repeat: 5, yoyo: true, ease: "none" }, 1.9)
      .to(".bad", { autoAlpha: 0, y: -14, duration: 0.35, ease: "power2.in" }, 2.5)
      .to(".lint-err", { autoAlpha: 0, duration: 0.3 }, 2.5)
      .fromTo(".good", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out", immediateRender: false }, 2.75)
      .fromTo(
        ".fixed",
        { autoAlpha: 0, scale: 0 },
        {
          keyframes: [
            { autoAlpha: 1, scaleX: 0.75, scaleY: 1.25, duration: 0.22, ease: "power2.out" },
            { scaleX: 1, scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" },
          ],
          immediateRender: false,
        },
        2.95,
      )
      .to(".good, .fixed", { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, 5.6);
    tl.call(() => lint.restart(), [], 0.85);
    rise(tl, ".pc-3 .note", 2.1);
    step(tl);

    tl.to(".cards", { autoAlpha: 0.06, scale: 0.97, duration: 0.8, ease: "power2.inOut" });
    tl.set(".message", { autoAlpha: 1 });
    reveal(tl, ".m1");
    reveal(tl, ".m2", "-=1");
    pop(tl, ".m2 .mark", "-=0.6");
    pop(tl, ".m-deco", "-=0.8", { stagger: 0.12 });

    float(".pc .icon", 10, 10);
    float(".m-deco .deco-inner", 12, 10);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>06 · Design System na era da GenAI</Eyebrow>
      <div className="row" style={{ marginTop: 34, gap: 26, alignItems: "baseline" }}>
        <h2 className="h1 title">Do Figma ao CI</h2>
        <h2 className="statement soft title2" style={{ fontSize: 52 }}>o DS antes, durante e depois</h2>
      </div>

      <div className="cards row" style={{ position: "relative", marginTop: 50, gap: GAP, alignItems: "stretch" }}>
        <Card n={1} when="ANTES · DESIGN" title="Figma → componente" shape="flower" grad="purple">
          <div className="row" style={{ gap: 14 }}>
            <div className="frame" style={{ border: "2px solid var(--color-lilac)", borderRadius: 14, padding: 14, width: 170 }}>
              <div className="label lilac" style={{ fontSize: 15 }}>Figma · Frame</div>
              <span className="btn" style={{ height: 40, fontSize: 16, padding: "0 6px 0 14px", marginTop: 12 }}>
                Pedir <ArrowDot />
              </span>
            </div>
            <Arrow className="arrow" width={36} />
            <div className="d2c-code code" style={{ fontSize: 17, padding: "14px 16px" }}>
              {"<"}
              <span className="k">Button</span>
              {"\n  variant="}
              <span className="s">"primary"</span>
              {">\n  Pedir\n</"}
              <span className="k">Button</span>
              {">"}
            </div>
          </div>
          <p className="note soft" style={{ fontSize: 23, lineHeight: 1.35 }}>O design já aponta para o componente real, não para pixels soltos.</p>
        </Card>

        <Card n={2} when="DURANTE · GERAÇÃO" title="Agente com contexto" shape="ring" grad="ui">
          <div className="col" style={{ gap: 12 }}>
            <div className="row mono" style={{ gap: 10, fontSize: 19 }}>
              <AgentChip size={28} />
              <span className="call lilac">get_component("Button")</span>
            </div>
            <div className="answer code" style={{ fontSize: 16, padding: "10px 16px", lineHeight: 1.5 }}>
              <div><span className="k">variant</span>: <span className="s">"primary"</span> | <span className="s">"ghost"</span></div>
              <div className="c">// uma ação principal por tela</div>
            </div>
            <div className="gen code" style={{ fontSize: 16, padding: "10px 16px" }}>
              {"<"}<span className="k">Button</span> variant=<span className="s">"primary"</span>{">"}Pedir{"</"}<span className="k">Button</span>{">"}
            </div>
          </div>
          <p className="note soft" style={{ fontSize: 23, lineHeight: 1.35 }}>O agente consulta o DS e gera só com peças que existem.</p>
        </Card>

        <Card n={3} when="DEPOIS · CI" title="Lint de tokens" shape="circle" grad="core">
          {/* bad and good share one line and the error/chip keep their space,
              so the looping demo never shifts the card layout */}
          <div className="code" style={{ fontSize: 19, padding: "18px 22px" }}>
            <div>.cta {"{"}</div>
            <div style={{ position: "relative" }}>
              <div className="bad" style={{ position: "relative", width: "fit-content" }}>
                {"  color: "}
                <span style={{ color: "var(--color-error)" }}>#ff6a00</span>; {/* ds-allow: texto do exemplo de lint */}
                <div className="squiggle abs" style={{ left: 100, right: 10, bottom: -2, height: 3, background: "var(--color-error)", borderRadius: 2 }} />
              </div>
              <div className="good abs" style={{ left: 0, top: 0 }}>
                {"  color: "}
                <span className="s">var(--color-brand)</span>;
              </div>
            </div>
            <div>{"}"}</div>
            <div className="lint-err" style={{ marginTop: 12, color: "var(--color-error)", fontSize: 16, whiteSpace: "normal" }}>
              ✗ ds/no-raw-color: use um token de cor
            </div>
          </div>
          <span className="fixed chip" style={{ alignSelf: "flex-start", borderColor: "var(--color-shockingly-green)", color: "var(--color-green-deep)" }}>
            ✓ autofix aplicado
          </span>
          <p className="note soft" style={{ fontSize: 23, lineHeight: 1.35 }}>Fora dos tokens não passa no CI, venha de gente ou de IA.</p>
        </Card>

        {[0, 1].map((i) => (
          <svg
            key={i}
            className="flow-arrow abs"
            width={34}
            height={26}
            viewBox="0 0 34 26"
            style={{ left: (i + 1) * (CARD_W + GAP) - GAP / 2 - 17, top: CARD_H / 2 - 13, overflow: "visible" }}
          >
            <path d="M2 13 H30 M21 4 L30 13 L21 22" fill="none" style={{ stroke: "var(--color-muted)" }} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ))}
      </div>

      <div className="message abs center" style={{ inset: 0, textAlign: "center" }}>
        <Deco className="m-deco" x={1600} y={230} kind="star" grad="tangerine" size={100} />
        <Deco className="m-deco" x={190} y={700} kind="flower" grad="core" size={150} />
        <div style={{ position: "relative", maxWidth: 1680 }}>
          <div className="statement m1" style={{ fontSize: 80 }}>O reuso deixa de ser só entre pessoas</div>
          <div className="statement m2" style={{ fontSize: 80, marginTop: 16 }}>
            e passa a incluir as <Mark color="green" tilt={-2}>máquinas.</Mark>
          </div>
        </div>
      </div>
    </div>
  );
}
