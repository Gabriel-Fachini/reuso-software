import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { arcIn, exit, float, pop, reveal, rise, step } from "../engine/anim";
import { Arrow, ArrowDot, Eyebrow, Mark } from "../components/ui";
import { Shape } from "../components/Shape";
import type { GradName, ShapeKind } from "../components/Shape";
import { AgentChip } from "./S12bGenAIReuso";

/*
 * Next frontier: the agent assembles the interface at runtime.
 *   A  a spectrum of who owns the layout; the DS shines in the middle
 *   B  declarative generative UI: question → spec → validate → render
 *   C  the risks
 */

const BAR_Y = 400;
const BAR_X = 120;
const BAR_W = 1680;
const stops = [
  { at: 0.14, name: "Controlado", desc: "você escreve cada componente; o agente só escolhe qual mostrar" },
  { at: 0.5, name: "Declarativo", desc: "o agente descreve a tela; o app monta com o catálogo do DS" },
  { at: 0.86, name: "Livre", desc: "o agente inventa HTML e CSS do zero" },
];
const stopX = (i: number) => BAR_X + stops[i].at * BAR_W;
const KNOB = 44;

const spec = [
  ["{ ", '"component"', ": ", '"Card"', ", ", '"title"', ": ", '"Pedidos atrasados"', ","],
  ["  ", '"children"', ": ["],
  ["BAD"],
  ["    { ", '"component"', ": ", '"Badge"', ", ", '"variant"', ": ", '"warning"', " },"],
  ["    { ", '"component"', ": ", '"Button"', ", ", '"label"', ": ", '"Avisar clientes"', " }"],
  ["  ] }"],
];
const orders = [
  ["#1042", "Centro", "25 min"],
  ["#1047", "Pinheiros", "18 min"],
  ["#1051", "Mooca", "12 min"],
];

const risks: { title: string; desc: string; shape: ShapeKind; grad: GradName }[] = [
  { title: "DS desatualizado", desc: "a IA repete o erro em escala, em todas as telas", shape: "diamond", grad: "lipstick" },
  { title: "Contexto custa caro", desc: "cada componente documentado ocupa a janela do modelo", shape: "hourglass", grad: "tangerine" },
  { title: "Ferramentas imaturas", desc: "boa parte ainda em preview ou beta; muda a cada versão", shape: "squircle", grad: "summer" },
  { title: "Tudo com a mesma cara", desc: "sem identidade própria, todo produto parece igual", shape: "circle", grad: "text" },
];

function Json({ line }: { line: string[] }) {
  if (line[0] === "BAD") {
    return (
      <div style={{ position: "relative", height: 26 }}>
        {"    { "}
        <span className="k">"component"</span>
        {": "}
        <span className="swap" style={{ position: "relative", display: "inline-block" }}>
          <span className="bad o" style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>"FancyTable"</span>
          <span className="fix s" style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", width: 0 }}>"Table"</span>
          <span className="squiggle abs" style={{ left: 0, right: 0, bottom: -1, height: 3, borderRadius: 2, background: "var(--color-error)" }} />
        </span>
        {", "}
        <span className="k">"rows"</span>
        {": 3 },"}
      </div>
    );
  }
  return (
    <div>
      {line.map((t, i) => (
        <span key={i} className={t.startsWith('"') ? (line[i + 1]?.startsWith(":") ? "k" : "s") : undefined}>
          {t}
        </span>
      ))}
    </div>
  );
}

export default function S13bGenAIRuntime() {
  const root = useScene((tl) => {
    gsap.set(".layer-c", { autoAlpha: 0 });
    gsap.set(".knob", { x: stopX(0) - stopX(1) });

    // A — the spectrum; the knob lands on "declarativo"
    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".title", 0.2);
    rise(tl, ".sub", 0.6);
    tl.from(".bar", { scaleX: 0, transformOrigin: "0% 50%", duration: 1.1, ease: "expo.out" }, 0.8);
    rise(tl, ".bar-end", 1.0, { y: 14, stagger: 0.1 });
    pop(tl, ".stop-dot", 1.1, { stagger: 0.12 });
    rise(tl, ".stop-txt", 1.2, { y: 24, stagger: 0.12 });
    pop(tl, ".knob", 1.4);
    tl.to(".knob", { x: 0, duration: 0.9, ease: "back.out(1.6)" }, 1.9);
    tl.to(".stop-txt-0, .stop-txt-2", { opacity: 0.45, duration: 0.5 }, 2.6);
    step(tl);

    // B — question → spec → validation → UI built from the catalog
    pop(tl, ".ask", 0);
    tl.from(".ask-arrow", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.4 }, "+=0.1");
    arcIn(tl, ".spec", "-=0.1", { x: -80, y: 60, rotation: -3 });
    tl.from(".spec .code > div", { autoAlpha: 0, x: -14, duration: 0.3, stagger: 0.12, ease: "power2.out" }, "-=0.8");
    // validate: the unknown component is flagged and fixed
    tl.from(".squiggle", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.45, ease: "power2.inOut" }, "+=0.2");
    tl.from(".v-err", { autoAlpha: 0, y: -8, duration: 0.4, ease: "expo.out" }, "-=0.1");
    tl.to(".bad", { x: 5, duration: 0.05, repeat: 5, yoyo: true, ease: "none" }, "+=0.2");
    tl.to(".squiggle", { autoAlpha: 0, duration: 0.2 });
    tl.to(".bad", { width: 0, duration: 0.45, ease: "power3.inOut" }, "<");
    tl.to(".fix", { width: "auto", duration: 0.45, ease: "power3.inOut" }, "<0.1");
    tl.to(".v-err", { autoAlpha: 0, duration: 0.25 }, "<");
    pop(tl, ".v-ok", "<");
    tl.from(".out-arrow", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.4 }, "+=0.1");
    // the app renders it with real DS components
    tl.from(".ui", { autoAlpha: 0, y: 40, duration: 0.9, ease: "expo.out" }, "-=0.1");
    pop(tl, ".ui .badge", "-=0.5");
    rise(tl, ".ui .tr", "-=0.4", { x: -20, y: 0, stagger: 0.1, duration: 0.6 });
    pop(tl, ".ui .btn", "-=0.2");
    rise(tl, ".refs", "-=0.3", { y: 14 });
    step(tl);

    // C — the risks
    exit(tl, ".layer-ab");
    tl.set(".layer-c", { autoAlpha: 1 });
    reveal(tl, ".c-title");
    arcIn(tl, ".risk", "-=0.9", { x: 120, y: 140, rotation: 5 }, { stagger: 0.12 });
    pop(tl, ".risk .icon", "-=0.9", { stagger: 0.12 });
    reveal(tl, ".c-end", "-=0.5");
    pop(tl, ".c-end .mark", "-=0.6");

    float(".risk .icon", 10, 10);
    gsap.to(".knob-glow", { scale: 1.6, opacity: 0, duration: 1.6, ease: "power2.out", repeat: -1, delay: 3 });
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>06 · Design System na era da GenAI</Eyebrow>
      <h2 className="h1 title" style={{ marginTop: 34, fontSize: 88 }}>
        Próxima fronteira: a tela gerada na hora.
      </h2>

      <div className="layer-ab abs" style={{ inset: 0 }}>
        <p className="sub abs body-lg soft" style={{ left: 120, top: 268 }}>
          O agente não só escreve código: ele monta a interface com o usuário já usando o app.
        </p>

        {/* spectrum */}
        <span className="bar-end abs mono muted" style={{ left: BAR_X, top: BAR_Y - 44, fontSize: 15, letterSpacing: "0.04em" }}>
          MAIS PREVISÍVEL
        </span>
        <span className="bar-end abs mono muted" style={{ left: BAR_X + BAR_W - 120, top: BAR_Y - 44, fontSize: 15, letterSpacing: "0.04em", width: 120, textAlign: "right" }}>
          MAIS LIVRE
        </span>
        <div className="bar abs" style={{ left: BAR_X, top: BAR_Y, width: BAR_W, height: 10, borderRadius: 5, background: "var(--gradient-spectrum)" }} />
        {stops.map((s, i) => (
          <div key={s.name}>
            <div className="stop-dot abs" style={{ left: stopX(i) - 12, top: BAR_Y - 7, width: 24, height: 24, borderRadius: "50%", background: "var(--color-bg)", border: "3px solid var(--color-primary)" }} />
            <div className={`stop-txt stop-txt-${i} abs`} style={{ left: stopX(i) - 230, top: BAR_Y + 34, width: 460, textAlign: "center" }}>
              <div className="h3" style={{ fontSize: 30, fontWeight: 600 }}>{s.name}</div>
              <div className="soft" style={{ fontSize: 20, marginTop: 4 }}>{s.desc}</div>
            </div>
          </div>
        ))}
        <div className="knob abs" style={{ left: stopX(1) - KNOB / 2, top: BAR_Y + 5 - KNOB / 2, width: KNOB, height: KNOB }}>
          <div className="knob-glow abs" style={{ inset: 0, borderRadius: "50%", border: "3px solid var(--color-shockingly-green)" }} />
          <div className="abs" style={{ inset: 0, borderRadius: "50%", background: "var(--color-shockingly-green)", border: "4px solid var(--color-just-black)" }} />
        </div>

        {/* B — declarative generative UI */}
        <div className="ask abs" style={{ left: 120, top: 640 }}>
          <div className="row" style={{ gap: 12, padding: "16px 20px", borderRadius: "22px 22px 22px 6px", background: "var(--color-surface)", width: 330 }}>
            <span className="label muted" style={{ fontSize: 14, position: "absolute", top: -26, left: 4 }}>USUÁRIO</span>
            <span style={{ fontSize: 23, lineHeight: 1.3 }}>Quais pedidos atrasaram hoje?</span>
          </div>
        </div>
        <div className="abs" style={{ left: 466, top: 680 }}>
          <Arrow className="ask-arrow" width={44} />
        </div>

        <div className="spec abs" style={{ left: 530, top: 588 }}>
          <div className="row" style={{ gap: 10, marginBottom: 10 }}>
            <AgentChip size={28} />
            <span className="label muted" style={{ fontSize: 14 }}>O AGENTE DESCREVE A TELA</span>
          </div>
          <div className="code" style={{ fontSize: 16, padding: "14px 18px", width: 640, lineHeight: 1.6 }}>
            {spec.map((l, i) => (
              <Json key={i} line={l} />
            ))}
          </div>
          <div style={{ position: "relative", height: 40, marginTop: 10 }}>
            <span className="v-err abs" style={{ left: 0, top: 0, fontSize: 17, color: "var(--color-error)", whiteSpace: "nowrap" }}>
              ✗ FancyTable não existe no catálogo
            </span>
            <span className="v-ok chip abs" style={{ left: 0, top: -4, fontSize: 16, padding: "6px 12px", borderColor: "var(--color-shockingly-green)", color: "var(--color-green-deep)", whiteSpace: "nowrap" }}>
              ✓ validado e corrigido: gerar → validar → corrigir
            </span>
          </div>
        </div>
        <div className="abs" style={{ left: 1186, top: 730 }}>
          <Arrow className="out-arrow" width={44} />
        </div>

        <div className="ui abs" style={{ left: 1250, top: 590 }}>
          <span className="label muted" style={{ fontSize: 14, position: "absolute", top: -26, left: 4 }}>O APP MONTA COM O DS</span>
          <div className="card col" style={{ width: 550, height: 330, padding: 24, gap: 12 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="h3" style={{ fontSize: 26, fontWeight: 600 }}>Pedidos atrasados</span>
              <span className="badge chip" style={{ fontSize: 15, padding: "4px 12px", background: "var(--color-orangey)", borderColor: "var(--color-orangey)", color: "var(--color-just-black)", fontWeight: 600 }}>
                3 atrasados
              </span>
            </div>
            <div className="col" style={{ gap: 6 }}>
              {orders.map(([id, place, late]) => (
                <div key={id} className="tr row mono" style={{ fontSize: 16, height: 38, padding: "0 14px", borderRadius: 10, background: "var(--color-bg)", gap: 16 }}>
                  <span style={{ width: 70 }}>{id}</span>
                  <span className="soft" style={{ flex: 1 }}>{place}</span>
                  <span className="orange">+{late}</span>
                </div>
              ))}
            </div>
            <span style={{ flex: 1 }} />
            <span className="btn fill" style={{ height: 50, fontSize: 19, padding: "0 8px 0 22px", gap: 10, alignSelf: "flex-start" }}>
              Avisar clientes <ArrowDot />
            </span>
          </div>
        </div>

        <div className="refs abs row" style={{ left: 530, top: 960, gap: 10 }}>
          <span className="muted label" style={{ fontSize: 15 }}>EXEMPLO</span>
          <span className="chip mono" style={{ fontSize: 14, padding: "4px 10px" }}>A2UI · Google</span>
        </div>
      </div>

      {/* C — risks */}
      <div className="layer-c abs" style={{ inset: 0, padding: "92px var(--gutter) 110px" }}>
        <h3 className="h2 c-title" style={{ marginTop: 230 }}>E os riscos?</h3>
        <div className="row" style={{ gap: 40, marginTop: 50 }}>
          {risks.map((r) => (
            <div key={r.title} className="risk">
              <div className="card col" style={{ width: 390, height: 310, padding: 30, gap: 14 }}>
                <div className="icon center" style={{ width: 56, height: 56 }}>
                  <Shape kind={r.shape} grad={r.grad} size={r.shape === "hourglass" ? 40 : 56} />
                </div>
                <span className="h3" style={{ fontSize: 32, fontWeight: 600, marginTop: 8 }}>{r.title}</span>
                <span className="soft" style={{ fontSize: 22, lineHeight: 1.35 }}>{r.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="c-end statement" style={{ fontSize: 44, marginTop: 70 }}>
          O DS vira <Mark color="green" tilt={-1}>infraestrutura crítica:</Mark> governança e versionamento pesam mais.
        </p>
      </div>
    </div>
  );
}
