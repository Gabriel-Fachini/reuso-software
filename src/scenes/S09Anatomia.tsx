import type { ReactNode } from "react";
import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { arcIn, float, pop, reveal, rise, spin } from "../engine/anim";
import { cssVar } from "../engine/tokens";
import { ArrowDot, Eyebrow } from "../components/ui";
import { Shape } from "../components/Shape";
import type { GradName, ShapeKind } from "../components/Shape";

function Panel({
  n,
  title,
  sub,
  shape,
  grad,
  children,
}: {
  n: number;
  title: string;
  sub: string;
  shape: ShapeKind;
  grad: GradName;
  children: ReactNode;
}) {
  return (
    <div className={`panel panel-${n}`}>
      <div className="panel-inner card col" style={{ width: 396, height: 640, padding: 30, gap: 18 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="h3" style={{ fontSize: 36, fontWeight: 600 }}>{title}</div>
            <div className="muted" style={{ fontSize: 19, marginTop: 6, lineHeight: 1.35 }}>{sub}</div>
          </div>
          <div className="icon">
            <Shape kind={shape} grad={grad} size={64} />
          </div>
        </div>
        <div className="body col grow" style={{ gap: 16, justifyContent: "flex-end" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const states = ["default", "hover", "disabled", "loading"] as const;

function ButtonStates() {
  const style = (s: (typeof states)[number]) => {
    switch (s) {
      case "hover":
        return { background: "var(--color-primary)", color: "var(--color-just-black)" };
      case "disabled":
        return { borderColor: "var(--color-surface25)", color: "var(--color-surface50)" };
      default:
        return {};
    }
  };
  return (
    <div style={{ position: "relative", height: 124 }}>
      {states.map((s) => (
        <div key={s} className={`bstate bstate-${s} abs col`} style={{ inset: 0, alignItems: "center", gap: 14 }}>
          <div className="btn" style={{ ...style(s), minWidth: 200 }}>
            {s === "loading" ? (
              <span
                className="spinner"
                style={{ width: 26, height: 26, borderRadius: "50%", border: "3px solid var(--color-surface25)", borderTopColor: "var(--color-shockingly-green)" }}
              />
            ) : (
              <>
                Pedir <ArrowDot />
              </>
            )}
          </div>
          <span className="chip mono" style={{ fontSize: 15 }}>state: {s}</span>
        </div>
      ))}
    </div>
  );
}

export default function S09Anatomia() {
  const root = useScene((tl) => {
    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".title", 0.2);

    // overlapping action: each panel starts before the previous one settles
    arcIn(tl, ".panel", 0.6, { x: 140, y: 120, rotation: 5 }, { stagger: 0.28, duration: 1.3 });
    pop(tl, ".panel .icon", 1.0, { stagger: 0.28 });
    for (let i = 1; i <= 4; i++) {
      rise(tl, `.panel-${i} .body > *`, 1.1 + (i - 1) * 0.28, { y: 30, stagger: 0.1, duration: 0.9 });
    }

    // 01 — component cycles through its states
    gsap.set(".bstate", { autoAlpha: 0 });
    gsap.set(".bstate-default", { autoAlpha: 1 });
    const cyc = gsap.timeline({ repeat: -1, delay: 2 });
    states.forEach((_, i) => {
      const cur = `.bstate-${states[i]}`;
      const nxt = `.bstate-${states[(i + 1) % states.length]}`;
      cyc
        .to(cur, { autoAlpha: 0, scale: 0.92, duration: 0.25, ease: "power2.in" }, "+=1.1")
        .fromTo(nxt, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false });
    });
    spin(".spinner", 0.8);

    // 03 — semver ticking
    const ver = gsap.timeline({ repeat: -1, repeatDelay: 0.6, delay: 2 });
    const bumps: [string, number][] = [
      ["2.4.2", 2],
      ["2.5.0", 1],
      ["3.0.0", 0],
      ["2.4.1", -1],
    ];
    bumps.forEach(([v, part]) => {
      const [a, b, c] = v.split(".");
      ver
        .set(".v-0", { textContent: a }, "+=1.3")
        .set(".v-1", { textContent: b }, "<")
        .set(".v-2", { textContent: c }, "<");
      if (part >= 0) {
        ver
          .fromTo(`.v-${part}`, { yPercent: -40, scaleY: 1.2 }, { yPercent: 0, scaleY: 1, duration: 0.6, ease: "bounce.out", immediateRender: false }, "<")
          .fromTo(`.v-lab-${part}`, { color: cssVar("--color-shockingly-green") }, { color: cssVar("--color-surface50"), duration: 1.4, immediateRender: false }, "<");
      }
    });

    // 04 — governance pipeline highlight
    gsap.to(".gov-dot", {
      backgroundColor: cssVar("--color-shockingly-green"),
      borderColor: cssVar("--color-lt-green"),
      scale: 1.15,
      duration: 0.3,
      stagger: { each: 0.7, repeat: -1, yoyo: true, repeatDelay: 2.2 },
      delay: 2,
    });

    float(".panel .icon", 10, 10);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>04 · Anatomia de um Design System</Eyebrow>
      <h2 className="h1 title" style={{ marginTop: 34 }}>
        Além dos tokens
      </h2>

      <div className="row" style={{ marginTop: 44, gap: 32, alignItems: "stretch" }}>
        <Panel n={1} title="Componentes" sub="API clara (props), estados e acessibilidade" shape="circle" grad="tangerine">
          <div className="code" style={{ fontSize: 17, padding: "14px 18px" }}>
            {"<"}
            <span className="k">Button</span>
            {"\n  variant="}
            <span className="s">"primary"</span>
            {"\n  size="}
            <span className="s">"md"</span>
            {"\n  loading={"}
            <span className="o">false</span>
            {"}\n/>"}
          </div>
          <ButtonStates />
          <div className="row" style={{ gap: 8 }}>
            <span className="chip">foco visível</span>
            <span className="chip">contraste AA</span>
          </div>
        </Panel>

        <Panel n={2} title="Documentação" sub="uso, exemplos, boas e más práticas" shape="squircle" grad="text">
          <div className="row" style={{ gap: 14, alignItems: "stretch" }}>
            <div className="col" style={{ gap: 12, width: 92, paddingTop: 4 }}>
              {["Button", "Card", "Input", "Chip"].map((x, i) => (
                <span key={x} style={{ fontSize: 18, color: i === 0 ? "var(--color-lilac)" : "var(--color-surface50)" }}>
                  {x}
                </span>
              ))}
            </div>
            <div className="col grow" style={{ gap: 12 }}>
              <div style={{ border: "2px solid var(--color-shockingly-green)", borderRadius: 14, padding: 14 }}>
                <div className="green label" style={{ fontSize: 17 }}>✓ Faça</div>
                <span className="btn" style={{ height: 42, fontSize: 16, padding: "0 6px 0 16px", marginTop: 10 }}>
                  Pedir <ArrowDot />
                </span>
              </div>
              <div style={{ border: "2px solid var(--color-error)", borderRadius: 14, padding: 14 }}>
                <div className="label" style={{ fontSize: 17, color: "var(--color-error)" }}>✗ Evite</div>
                <div className="center" style={{ marginTop: 10, height: 42, background: "#ff6a00" /* ds-allow: exemplo de "não faça" */, borderRadius: 2, fontSize: 15, fontWeight: 800, color: "#0e100f" }}>
                  PEDIR AGORA!!
                </div>
              </div>
            </div>
          </div>
          <span className="chip" style={{ alignSelf: "flex-start" }}>ex.: Storybook</span>
        </Panel>

        <Panel n={3} title="Distribuição" sub="pacote npm + versionamento semântico" shape="ring" grad="summer">
          <div className="code" style={{ fontSize: 18, padding: "14px 18px" }}>
            <span className="c">$</span> npm i <span className="s">@acme/ui</span>
          </div>
          <div className="row" style={{ justifyContent: "center", fontSize: 104, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }}>
            <span className="v-part v-0 gt gt-summer" style={{ display: "inline-block" }}>2</span>
            <span className="muted">.</span>
            <span className="v-part v-1 gt gt-summer" style={{ display: "inline-block" }}>4</span>
            <span className="muted">.</span>
            <span className="v-part v-2 gt gt-summer" style={{ display: "inline-block" }}>1</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", textAlign: "center", fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>
            {[
              ["MAJOR", "quebra"],
              ["MINOR", "novo"],
              ["PATCH", "correção"],
            ].map(([a, b], i) => (
              <span key={a} className={`v-lab-${i} muted`}>
                {a}
                <br />
                {b}
              </span>
            ))}
          </div>
        </Panel>

        <Panel n={4} title="Governança" sub="quem contribui, quem aprova e como depreciar" shape="flower" grad="core">
          <div className="col">
            {["Proposta", "Revisão (design + tech)", "Release", "Depreciação"].map((x, i, arr) => (
              <div key={x} className="row" style={{ gap: 18, alignItems: "flex-start" }}>
                <div className="col" style={{ alignItems: "center" }}>
                  <div className="gov-dot" style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid var(--color-surface75)", background: "var(--color-just-black)" }} />
                  {i < arr.length - 1 && <div style={{ width: 3, height: 54, background: "var(--color-surface25)" }} />}
                </div>
                <span style={{ fontSize: 23, lineHeight: "28px" }}>{x}</span>
              </div>
            ))}
          </div>
          <span className="chip" style={{ alignSelf: "flex-start" }}>DS é produto, não projeto</span>
        </Panel>
      </div>
    </div>
  );
}
