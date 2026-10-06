import type { ReactNode } from "react";
import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { drawIn, drift, drop, float, pop, reveal, rise } from "../engine/anim";
import { ArrowDot, Eyebrow, Mark } from "../components/ui";

function Flow({ side, code, box, out }: { side: "bb" | "wb"; code: ReactNode; box: ReactNode; out: ReactNode }) {
  return (
    <div style={{ position: "relative", width: 800, height: 200 }}>
      <svg className="abs" width={800} height={200} style={{ left: 0, top: 0, overflow: "visible" }}>
        {[
          [270, 340],
          [530, 600],
        ].map(([a, b]) => (
          <path
            key={a}
            className="flow-arrow"
            d={`M${a} 100 H${b} M${b - 12} 90 L${b} 100 L${b - 12} 110`}
            stroke="var(--color-surface50)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </svg>
      <div
        className="packet abs"
        style={{
          left: 260,
          top: 91,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: side === "bb" ? "var(--gradient-orange-crush)" : "var(--gradient-macha)",
        }}
      />
      <div className="code-card abs" style={{ left: 0, top: 30 }}>
        <div className="code-inner code" style={{ width: 260, fontSize: 17, padding: "16px 18px" }}>
          {code}
        </div>
      </div>
      <div className="box abs" style={{ left: 350, top: 15, width: 170, height: 170 }}>
        {box}
      </div>
      <div className="out abs" style={{ left: 612, top: 69 }}>
        <div className="out-inner">{out}</div>
      </div>
    </div>
  );
}

export default function S05Caixas() {
  const root = useScene((tl) => {
    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".title", 0.2);

    const side = (s: "bb" | "wb", t: number) => {
      rise(tl, `.${s} .side-title`, t);
      rise(tl, `.${s} .code-card`, t + 0.2, { x: -40, y: 0 });
      if (s === "bb") drop(tl, `.${s} .box`, t + 0.5);
      else pop(tl, `.${s} .box`, t + 0.5);
      drawIn(tl, `.${s} .flow-arrow`, t + 0.8, { duration: 0.6 });
      // the packet travels through the box: slow in, fast through, slow out
      tl.fromTo(
        `.${s} .packet`,
        { x: 0, autoAlpha: 0 },
        {
          keyframes: [
            { autoAlpha: 1, duration: 0.15 },
            { x: 350, scaleX: 1.6, scaleY: 0.7, duration: 1.0, ease: "power2.inOut" },
            { scaleX: 1, scaleY: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" },
            { autoAlpha: 0, duration: 0.15 },
          ],
        },
        t + 1.1,
      );
      pop(tl, `.${s} .out`, t + 2.1);
      rise(tl, `.${s} .verdict`, t + 2.3);
    };
    side("bb", 0.7);
    side("wb", 3.2);

    rise(tl, ".spectrum", 5.8);
    tl.from(".spectrum .marker", { left: "50%", duration: 1.6, ease: "elastic.out(1, 0.45)", stagger: 0.2 }, 6.1);

    gsap.to(".gear", { rotation: (i: number) => (i % 2 ? -360 : 360), duration: 5, ease: "none", repeat: -1 });
    drift(".bb .code-inner, .bb .box-inner, .bb .out-inner", 12, 2);
    float(".wb .box-inner", 3, 2);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>03 · Design System à luz do Reuso</Eyebrow>
      <h2 className="h1 title" style={{ marginTop: 34 }}>
        Caixa-preta <span className="muted">×</span> caixa-branca
      </h2>

      <div className="row" style={{ marginTop: 60, gap: 80, alignItems: "flex-start" }}>
        <div className="bb col" style={{ gap: 30 }}>
          <div className="side-title h3">
            <Mark color="orange" tilt={-2}>Caixa-preta</Mark> <span className="soft">usar pronto</span>
          </div>
          <Flow
            side="bb"
            code={
              <>
                {"<"}
                <span className="k">Button</span>
                {"\n  variant="}
                <span className="s">"primary"</span>
                {">\n  Pedir\n</"}
                <span className="k">Button</span>
                {">"}
              </>
            }
            box={
              <div
                className="box-inner center"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 36,
                  background: "var(--gradient-ink)",
                  border: "1px solid var(--color-surface25)",
                }}
              >
                <span style={{ fontSize: 72, fontWeight: 600, color: "var(--color-surface50)" }}>?</span>
              </div>
            }
            out={
              <span className="btn">
                Pedir <ArrowDot />
              </span>
            }
          />
          <p className="verdict body soft">
            Não altera nada por dentro. <span className="green">Baixo custo, alta consistência.</span>
          </p>
        </div>

        <div className="wb col" style={{ gap: 30 }}>
          <div className="side-title h3">
            <Mark color="green" tilt={2}>Caixa-branca</Mark> <span className="soft">estender</span>
          </div>
          <Flow
            side="wb"
            code={
              <>
                <span className="k">const</span>
                {" Promo =\n  extend("}
                <span className="k">Button</span>
                {", {\n    icon: "}
                <span className="s">"star"</span>
                {"\n  })"}
              </>
            }
            box={
              <div
                className="box-inner"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 36,
                  background: "var(--gradient-ui)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  placeItems: "center",
                  padding: 26,
                }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="gear"
                    style={{ width: 46, height: 46, borderRadius: "50%", border: "5px dashed var(--color-just-black)" }}
                  />
                ))}
              </div>
            }
            out={
              <span className="btn fill">
                ★ Promo <ArrowDot />
              </span>
            }
          />
          <p className="verdict body soft">
            Customiza o comportamento. <span className="orange">Mais flexível, mais risco de divergir.</span>
          </p>
        </div>
      </div>

      <div className="spectrum" style={{ marginTop: 70 }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 20 }}>
          <span className="label green">consistência</span>
          <span className="label orange">flexibilidade</span>
        </div>
        <div style={{ position: "relative", height: 8, borderRadius: 4, background: "var(--gradient-spectrum)" }}>
          {[
            { left: "18%", text: "caixa-preta" },
            { left: "78%", text: "caixa-branca" },
          ].map((m) => (
            <div key={m.text} className="marker abs" style={{ left: m.left, top: -14, translate: "-50% 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--color-just-black)", border: "5px solid var(--color-primary)", margin: "0 auto" }} />
              <div className="label" style={{ marginTop: 14, fontSize: 20, whiteSpace: "nowrap" }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
