import type { ReactNode } from "react";
import { gsap, SplitText } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { arcIn, float, pop, reveal, rise, step } from "../engine/anim";
import { Arrow, ArrowDot, Eyebrow, Mark } from "../components/ui";
import { Deco, Shape } from "../components/Shape";
import type { GradName, ShapeKind } from "../components/Shape";

function Card({ n, title, shape, grad, children }: { n: number; title: string; shape: ShapeKind; grad: GradName; children: ReactNode }) {
  return (
    <div className={`pc pc-${n}`}>
      <div className="card col" style={{ width: 540, height: 500, padding: 32, gap: 22 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="h3" style={{ fontSize: 36, fontWeight: 600 }}>{title}</span>
          <div className="icon">
            <Shape kind={shape} grad={grad} size={56} />
          </div>
        </div>
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

    // 01 docs as context — "typed" into the assistant
    arcIn(tl, ".pc-1", 0.5, { x: -120, y: 100, rotation: -4 });
    pop(tl, ".pc-1 .icon", 0.9);
    const typed = SplitText.create(".typed", { type: "chars" });
    tl.from(typed.chars, { autoAlpha: 0, duration: 0.01, stagger: 0.018, ease: "none" }, 1.2);
    rise(tl, ".pc-1 .note", "-=0.2");
    step(tl);

    // 02 design-to-code
    arcIn(tl, ".pc-2", undefined, { x: -120, y: 100, rotation: -4 });
    pop(tl, ".pc-2 .icon", "-=0.9");
    pop(tl, ".frame", "-=0.6");
    tl.from(".pc-2 .arrow", { scaleX: 0, transformOrigin: "left", duration: 0.5 });
    rise(tl, ".d2c-code", "-=0.2", { x: -30, y: 0 });
    rise(tl, ".pc-2 .note", "-=0.5");
    step(tl);

    // 03 lint — the card and its text enter once; the lint demo inside loops
    // on its own timeline (restarted here so it begins from the top)
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

    arcIn(tl, ".pc-3", undefined, { x: -120, y: 100, rotation: -4 });
    tl.call(() => lint.restart(), [], "<0.05");
    pop(tl, ".pc-3 .icon", "-=0.9");
    rise(tl, ".pc-3 .note", "-=0.6");
    step(tl);

    tl.to(".cards", { autoAlpha: 0.06, scale: 0.97, duration: 0.8, ease: "power2.inOut" });
    tl.set(".message", { autoAlpha: 1 });
    reveal(tl, ".m1");
    reveal(tl, ".m2", "-=1");
    pop(tl, ".m2 .mark", "-=0.6");
    pop(tl, ".m-deco", "-=0.8", { stagger: 0.12 });

    gsap.to(".cursor", { autoAlpha: 0, repeat: -1, yoyo: true, duration: 0.5, ease: "steps(1)" });
    float(".pc .icon", 10, 10);
    float(".m-deco .deco-inner", 12, 10);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>06 · Design System na era da GenAI</Eyebrow>
      <h2 className="h1 title" style={{ marginTop: 34 }}>
        Na prática
      </h2>

      <div className="cards row" style={{ marginTop: 50, gap: 30, alignItems: "stretch" }}>
        <Card n={1} title="Docs como contexto" shape="squircle" grad="text">
          <div className="code" style={{ fontSize: 19, padding: "18px 22px", minHeight: 220 }}>
            <div className="c"># AGENTS.md</div>
            {["- Use os componentes de @acme/ui", "- Cores e espaços só via tokens", "- Não crie botão novo:", "  use <Button variant>"].map((l) => (
              <div key={l} className="typed">
                {l}
              </div>
            ))}
            <span className="cursor" style={{ color: "var(--color-shockingly-green)" }}>▍</span>
          </div>
          <p className="note body soft">A documentação do DS vira contexto para o assistente de código.</p>
        </Card>

        <Card n={2} title="Design-to-code" shape="flower" grad="purple">
          <div className="row" style={{ gap: 16 }}>
            <div className="frame" style={{ border: "2px solid var(--color-lilac)", borderRadius: 14, padding: 14, width: 176 }}>
              <div className="label lilac" style={{ fontSize: 14 }}>Figma · Frame</div>
              <span className="btn" style={{ height: 40, fontSize: 15, padding: "0 6px 0 14px", marginTop: 12 }}>
                Pedir <ArrowDot />
              </span>
            </div>
            <Arrow className="arrow" width={40} />
            <div className="d2c-code code" style={{ fontSize: 16, padding: "14px 16px" }}>
              {"<"}
              <span className="k">Button</span>
              {"\n  variant="}
              <span className="s">"primary"</span>
              {">\n  Pedir\n</"}
              <span className="k">Button</span>
              {">"}
            </div>
          </div>
          <p className="note body soft">O design no Figma já aponta para o componente real, não para pixels soltos.</p>
        </Card>

        <Card n={3} title="Lint de tokens" shape="circle" grad="core">
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
          <span className="fixed chip" style={{ alignSelf: "flex-start", borderColor: "var(--color-shockingly-green)", color: "var(--color-shockingly-green)" }}>
            ✓ autofix aplicado
          </span>
          <p className="note body soft">Estilo fora dos tokens não passa no CI, venha de gente ou de IA.</p>
        </Card>
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
