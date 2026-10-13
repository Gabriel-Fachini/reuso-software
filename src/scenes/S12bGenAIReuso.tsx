import type { ReactNode } from "react";
import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { arcIn, drift, drop, float, pop, reveal, rise, step } from "../engine/anim";
import { Eyebrow, Mark } from "../components/ui";
import { Shape } from "../components/Shape";
import type { GradName, ShapeKind } from "../components/Shape";

/*
 * The four facets of reuse (Krueger, 1992) with an agent in the loop.
 *   A  the facets, as four stations of the same flow, and who does each one
 *      now: the DS gives the abstraction, the agent does the rest
 *   B  spotlight on selection — reuse's historical bottleneck
 */

const CARD_W = 390;
const CARD_H = 420;
const GAP = 40;
const TOP = 380;

const facets: { name: string; desc: string; ex: ReactNode; shape: ShapeKind; grad: GradName; owner: "ds" | "ai" }[] = [
  { name: "Abstração", desc: "descrever a peça sem expor como ela é feita", ex: "color.brand · <Button>", shape: "squircle", grad: "text", owner: "ds" },
  { name: "Seleção", desc: "achar a peça certa e entender como usar", ex: "<Button> ou <Link>?", shape: "ring", grad: "ui", owner: "ai" },
  { name: "Especialização", desc: "ajustar por parâmetros, sem mexer por dentro", ex: 'variant="primary"', shape: "flower", grad: "purple", owner: "ai" },
  { name: "Integração", desc: "encaixar no sistema e verificar se funciona", ex: "lint · testes · CI", shape: "circle", grad: "core", owner: "ai" },
];

export function AgentChip({ size = 30 }: { size?: number }) {
  return (
    <span
      className="center mono"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: "var(--gradient-purple-haze)",
        color: "var(--color-just-black)",
        fontSize: size * 0.38,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      AI
    </span>
  );
}

function Owner({ kind }: { kind: "ds" | "ai" }) {
  const pill = { display: "inline-flex", height: 46, padding: "0 18px 0 8px", gap: 10, borderRadius: 23, fontSize: 19, fontWeight: 600 } as const;
  return (
    <div className="owner" style={{ display: "inline-block" }}>
      <div className="owner-inner">
        {kind === "ds" ? (
          <span className="row" style={{ ...pill, paddingLeft: 18, background: "var(--gradient-macha)", color: "var(--color-just-black)" }}>
            Design System
          </span>
        ) : (
          <span className="row" style={{ ...pill, border: "2px solid var(--color-lilac-soft)", background: "var(--color-bg)" }}>
            <AgentChip />
            agente
          </span>
        )}
      </div>
    </div>
  );
}

export default function S12bGenAIReuso() {
  const root = useScene((tl) => {
    gsap.set(".spot", { autoAlpha: 0 });
    gsap.set(".punch", { autoAlpha: 0 });

    // A — the four facets
    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".title", 0.2);
    rise(tl, ".sub", 0.7);
    arcIn(tl, ".fc", 0.8, { x: 120, y: 140, rotation: 5 }, { stagger: 0.14 });
    pop(tl, ".fc .icon", 1.2, { stagger: 0.14 });
    rise(tl, ".fc .ex", 1.6, { y: 20, stagger: 0.1 });
    tl.from(".flow-arrow", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.5, ease: "power2.out", stagger: 0.12 }, 1.7);
    // who does what: the badges fall into their cards, the caption follows
    drop(tl, ".owner", 1.5, { stagger: 0.14 });
    tl.from(".who", { autoAlpha: 0, y: 30, duration: 1, ease: "expo.out" }, 2.2);
    pop(tl, ".who .mark", 2.5);
    step(tl);

    // C — selection was always the bottleneck
    tl.to(".who", { autoAlpha: 0, y: -20, duration: 0.4, ease: "power2.in" });
    tl.to(".fc-0, .fc-2, .fc-3", { autoAlpha: 0.32, duration: 0.6, ease: "power2.inOut" }, "<");
    tl.to(".fc-1", { scale: 1.05, duration: 0.7, ease: "back.out(2)" }, "<0.1");
    pop(tl, ".spot", "<0.15");
    tl.set(".punch", { autoAlpha: 1 }, "<");
    reveal(tl, ".punch-1", "-=0.4");
    reveal(tl, ".punch-2", "-=0.9");
    pop(tl, ".punch-2 .mark", "-=0.5");

    float(".fc .icon", 10, 10);
    drift(".owner-inner", 5, 2);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>06 · Design System na era da GenAI</Eyebrow>
      <h2 className="h1 title" style={{ marginTop: 34 }}>
        A IA reusa como a gente.
      </h2>
      <p className="sub body-lg soft" style={{ marginTop: 18 }}>
        As quatro facetas do reuso de software, segundo Krueger (1992)
      </p>

      {facets.map((f, i) => (
        <div
          key={f.name}
          className={`fc fc-${i} abs`}
          style={{ left: 120 + i * (CARD_W + GAP), top: TOP, width: CARD_W, height: CARD_H }}
        >
          {i === 1 && <div className="spot abs" style={{ inset: -8, borderRadius: 32, border: "4px solid var(--color-shockingly-green)" }} />}
          <div className="card col" style={{ position: "relative", width: CARD_W, height: CARD_H, padding: 30, gap: 16 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="mono muted" style={{ fontSize: 20 }}>0{i + 1}</span>
              <div className="icon">
                <Shape kind={f.shape} grad={f.grad} size={56} />
              </div>
            </div>
            <span className="h3" style={{ fontSize: 38, fontWeight: 600 }}>{f.name}</span>
            <span className="soft" style={{ fontSize: 23, lineHeight: 1.35 }}>{f.desc}</span>
            <span style={{ flex: 1 }} />
            <span className="ex chip mono" style={{ fontSize: 16, padding: "6px 14px", alignSelf: "flex-start" }}>{f.ex}</span>
            <div style={{ height: 46 }}>
              <Owner kind={f.owner} />
            </div>
          </div>
        </div>
      ))}
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          className="flow-arrow abs"
          width={30}
          height={24}
          viewBox="0 0 30 24"
          style={{ left: 120 + (i + 1) * (CARD_W + GAP) - GAP / 2 - 15, top: TOP + CARD_H / 2 - 12, overflow: "visible" }}
        >
          <path d="M2 12 H26 M18 4 L26 12 L18 20" fill="none" style={{ stroke: "var(--color-muted)" }} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}

      <p className="who abs body-lg" style={{ left: 120, top: 850, width: 1680, textAlign: "center" }}>
        O <Mark color="green" tilt={-1}>Design System</Mark> entrega a abstração. O agente faz o resto.
      </p>

      <div className="punch abs" style={{ left: 120, top: 856, width: 1680, textAlign: "center" }}>
        <div className="punch-1 body-lg soft">A seleção sempre foi o gargalo do reuso: achar e entender a peça custa caro.</div>
        <div className="punch-2 body-lg" style={{ marginTop: 10 }}>
          O agente só seleciona bem o que for <Mark color="green" tilt={-1}>legível por máquina.</Mark>
        </div>
      </div>
    </div>
  );
}
