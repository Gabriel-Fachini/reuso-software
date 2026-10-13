import type { ReactNode } from "react";
import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { drawIn, drift, pop, reveal, rise } from "../engine/anim";
import { cssVar } from "../engine/tokens";
import { ArrowDot, Eyebrow } from "../components/ui";
import { Deco, GradDef, Shape } from "../components/Shape";

/*
 * Design System ≠ System Design.
 *
 * Hook: "Design System" sits big in the middle; a copy peels off below and its
 * words swap places on arcs → "System Design", and a ≠ strikes between them.
 * Then both lines fly up into the headers of a two-column comparison.
 *
 * The headers' natural layout is the comparison; the hook is only a transform
 * offset on top of it (see place()), so the final state is crisp.
 */

const COL_L = 120;
const COL_R = 1030;
const COL_W = 770;
const HEAD_Y = 168;
const HEAD_FS = 84;
const HOOK_SCALE = 150 / HEAD_FS;
const HOOK = { cx: 960, l1: 360, l2: 660, neq: 510 };
const NEQ = 96;
const NEQ_Y = HEAD_Y + HEAD_FS / 2;
const VIZ_Y = 330;
const VIZ_H = 240;
const ROWS_Y = 600;

const rows: [string, string, string][] = [
  ["CAMADA", "Interface: o que o usuário vê e toca", "Arquitetura: o que roda por trás da tela"],
  ["O QUE SE REUSA", "tokens, componentes, padrões e documentação", "serviços, APIs, filas, cache e bancos"],
  ["SUCESSO É", "consistência e velocidade para criar telas", "escala, disponibilidade e baixa latência"],
];

// particle routes (invisible): token → component → screen, request → API → service → data
const dsRoutes = [
  ["M 60 76 C 150 76, 160 130, 220 130 H 624", "var(--color-orangey)"],
  ["M 60 130 H 624", "var(--color-shockingly-green)"],
  ["M 60 184 C 150 184, 160 130, 220 130 H 624", "var(--color-lilac)"],
];
const sdRoutes = [
  ["M 80 131 H 290 C 322 131, 322 71, 352 71 H 512 C 552 71, 562 84, 646 90", "var(--color-blue)"],
  ["M 80 131 H 512 C 552 129, 562 104, 646 100", "var(--color-lilac)"],
  ["M 80 131 H 290 C 322 131, 322 187, 352 187 H 662", "var(--color-shockingly-pink)"],
];
const services: [string, string][] = [
  ["auth", "var(--color-blue)"],
  ["catálogo", "var(--color-lilac)"],
  ["pagamento", "var(--color-shockingly-pink)"],
];

const nodeBox = {
  background: "var(--color-bg)",
  border: "2px solid var(--color-border)",
  borderRadius: 14,
} as const;

function At({ cls, x, y, children }: { cls: string; x: number; y: number; children: ReactNode }) {
  return (
    <div className={`${cls} abs`} style={{ left: x, top: y }}>
      {children}
    </div>
  );
}

function VizLabel({ x, children }: { x: number; children: ReactNode }) {
  return (
    <span className="viz-lb abs mono soft" style={{ left: x, top: 12, fontSize: 19, fontWeight: 600, letterSpacing: "0.04em" }}>
      {children}
    </span>
  );
}

function Screen() {
  const bar = (w: string) => <span style={{ height: 6, width: w, borderRadius: 3, background: "var(--color-border)" }} />;
  return (
    <div className="col" style={{ ...nodeBox, width: 72, height: 160, padding: 8, gap: 7 }}>
      <span style={{ height: 8, borderRadius: 4, background: "var(--gradient-macha)" }} />
      {bar("80%")}
      {bar("55%")}
      <span style={{ height: 22, borderRadius: 8, border: "2px solid var(--color-border)" }} />
      <span style={{ flex: 1 }} />
      <span style={{ height: 16, borderRadius: 8, background: "var(--gradient-orange-crush)" }} />
    </div>
  );
}

function Strokes({ cls, paths, grad, id }: { cls: string; paths: string[]; grad: "macha" | "summer"; id: string }) {
  return (
    <>
      <GradDef name={grad} id={id} w={COL_W} h={VIZ_H} />
      {paths.map((d) => (
        <path key={d} className={cls} d={d} stroke={`url(#${id})`} strokeWidth={3} strokeLinecap="round" fill="none" />
      ))}
    </>
  );
}

function Particles({ routes, prefix }: { routes: string[][]; prefix: string }) {
  return (
    <>
      {routes.map(([d], i) => (
        <path key={d} className={`${prefix}-r${i}`} d={d} fill="none" stroke="none" />
      ))}
      {routes.map(([, fill], i) => (
        <circle key={i} className="pk" data-route={`${prefix}-r${i}`} cx={0} cy={0} r={7} style={{ fill }} />
      ))}
    </>
  );
}

/** Design System side: tokens flow into components, components into screens. */
function DsViz() {
  return (
    <div className="viz card abs" style={{ left: COL_L, top: VIZ_Y, width: COL_W, height: VIZ_H, padding: 0 }}>
      <svg className="abs" width={COL_W} height={VIZ_H} style={{ left: 0, top: 0, overflow: "visible" }}>
        <Strokes
          cls="ds-p"
          grad="macha"
          id="ds-p-g"
          paths={[
            "M 84 76 C 150 76, 160 130, 220 130",
            "M 84 130 H 220",
            "M 84 184 C 150 184, 160 130, 220 130",
            "M 468 130 C 520 130, 530 130, 580 130",
          ]}
        />
        <Particles routes={dsRoutes} prefix="ds" />
      </svg>

      <VizLabel x={30}>TOKENS</VizLabel>
      <VizLabel x={226}>COMPONENTES</VizLabel>
      <VizLabel x={590}>TELAS</VizLabel>

      {["var(--gradient-tangerine)", "var(--gradient-core)", "var(--gradient-text)"].map((bg, i) => (
        <At key={bg} cls="ds-n" x={38} y={54 + i * 54}>
          <div className={`sw sw-${i}`} style={{ width: 44, height: 44, borderRadius: "50%", background: bg }} />
        </At>
      ))}
      <At cls="ds-n" x={226} y={50}>
        <span className="btn fill" style={{ height: 50, fontSize: 21, padding: "0 8px 0 22px", gap: 10 }}>
          Pedir <ArrowDot />
        </span>
      </At>
      <At cls="ds-n" x={376} y={57}>
        <div style={{ position: "relative", width: 66, height: 36, borderRadius: 18, background: "var(--gradient-macha)" }}>
          <span className="abs" style={{ right: 5, top: 5, width: 26, height: 26, borderRadius: "50%", background: "var(--color-just-black)" }} />
        </div>
      </At>
      <At cls="ds-n" x={226} y={116}>
        <span className="chip" style={{ fontSize: 17, padding: "6px 14px", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-orangey)" }} />
          Novo
        </span>
      </At>
      <At cls="ds-n" x={226} y={168}>
        <div
          className="row muted"
          style={{ width: 232, height: 40, padding: "0 16px", fontSize: 17, borderRadius: 20, border: "2px solid var(--color-border)", background: "var(--color-bg)" }}
        >
          Buscar…
        </div>
      </At>
      <At cls="ds-n" x={588} y={48}>
        <Screen />
      </At>
      <At cls="ds-n" x={674} y={48}>
        <Screen />
      </At>
    </div>
  );
}

/** System Design side: a request crosses gateway, services and data stores. */
function SdViz() {
  return (
    <div className="viz card abs" style={{ left: COL_R, top: VIZ_Y, width: COL_W, height: VIZ_H, padding: 0 }}>
      <svg className="abs" width={COL_W} height={VIZ_H} style={{ left: 0, top: 0, overflow: "visible" }}>
        <Strokes
          cls="sd-p"
          grad="summer"
          id="sd-p-g"
          paths={[
            "M 140 131 H 178",
            "M 290 131 C 322 131, 322 71, 352 71",
            "M 290 131 H 352",
            "M 290 131 C 322 131, 322 187, 352 187",
            "M 512 71 C 552 71, 562 84, 602 84",
            "M 512 129 C 552 129, 562 104, 602 104",
            "M 512 187 H 582",
          ]}
        />
        <Particles routes={sdRoutes} prefix="sd" />
      </svg>

      <VizLabel x={22}>CLIENTE</VizLabel>
      <VizLabel x={180}>GATEWAY</VizLabel>
      <VizLabel x={352}>SERVIÇOS</VizLabel>
      <VizLabel x={590}>DADOS</VizLabel>

      <At cls="sd-n" x={20} y={98}>
        <div className="row" style={{ ...nodeBox, width: 120, height: 66, padding: "0 16px", gap: 12 }}>
          <Shape kind="squircle" grad="summer" size={26} />
          <span className="mono" style={{ fontSize: 19, fontWeight: 600 }}>app</span>
        </div>
      </At>
      <At cls="sd-n" x={178} y={98}>
        <div className="row" style={{ ...nodeBox, width: 112, height: 66, padding: "0 16px", gap: 12 }}>
          <Shape kind="ring" grad="ui" size={26} />
          <span className="mono" style={{ fontSize: 19, fontWeight: 600 }}>API</span>
        </div>
      </At>
      {services.map(([name, dot], i) => (
        <At key={name} cls="sd-n" x={352} y={48 + i * 58}>
          <div className="row" style={{ ...nodeBox, width: 160, height: 46, padding: "0 14px", gap: 10, borderRadius: 12 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: dot, flexShrink: 0 }} />
            <span className="mono" style={{ fontSize: 17 }}>{name}</span>
          </div>
        </At>
      ))}
      <At cls="sd-n" x={600} y={42}>
        <svg width={92} height={96} viewBox="0 0 92 96" style={{ display: "block", overflow: "visible" }}>
          <path d="M 6 18 V 80 A 40 12 0 0 0 86 80 V 18" style={{ fill: "var(--color-bg)", stroke: "var(--color-border)" }} strokeWidth={2} />
          <path d="M 6 42 A 40 12 0 0 0 86 42" fill="none" style={{ stroke: "var(--color-border)" }} strokeWidth={2} />
          <ellipse cx={46} cy={18} rx={40} ry={12} style={{ fill: "var(--color-bg)", stroke: "var(--color-border)" }} strokeWidth={2} />
          <text className="mono" x={46} y={76} textAnchor="middle" style={{ fill: "var(--color-soft)", fontSize: 17, fontWeight: 600 }}>
            db
          </text>
        </svg>
      </At>
      <At cls="sd-n" x={582} y={164}>
        <div className="row" style={{ ...nodeBox, width: 160, height: 46, padding: "0 14px", gap: 6, borderRadius: 12 }}>
          {[0, 1, 2, 3].map((k) => (
            <span key={k} style={{ width: 10, height: 24, borderRadius: 3, background: "var(--gradient-purple-haze)" }} />
          ))}
          <span className="mono" style={{ fontSize: 17, marginLeft: 10 }}>fila</span>
        </div>
      </At>
    </div>
  );
}

/** ≠ (or = without the slash) drawn as strokes so it can be drawn on. */
function Equals({ slash, size }: { slash?: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <g style={{ stroke: "var(--color-just-black)" }} strokeWidth={9} strokeLinecap="round">
        <line className="neq-bar" x1={24} y1={40} x2={76} y2={40} />
        <line className="neq-bar" x1={24} y1={60} x2={76} y2={60} />
        {slash && <line className="neq-slash" x1={64} y1={16} x2={36} y2={84} />}
      </g>
    </svg>
  );
}

export default function S03bDsVsSd() {
  const root = useScene((tl, el) => {
    const q = <T extends HTMLElement>(s: string) => el.querySelector<T>(s)!;
    const qa = (s: string) => [...el.querySelectorAll<HTMLElement>(s)];

    // put an element's center at (cx, cy) with a scale, as an offset from its layout box
    const place = (node: HTMLElement, cx: number, cy: number, scale = 1) =>
      gsap.set(node, {
        x: cx - (node.offsetLeft + node.offsetWidth / 2),
        y: cy - (node.offsetTop + node.offsetHeight / 2),
        scale,
        transformOrigin: "50% 50%",
      });

    const l1w = qa(".l1 .w"); // Design, System
    const l2w = qa(".l2 .w"); // System, Design
    place(q(".l1"), HOOK.cx, HOOK.l1, HOOK_SCALE);
    // the copy starts exactly on top of line 1, its words already in line 1's order
    place(q(".l2"), HOOK.cx, HOOK.l1, HOOK_SCALE);
    gsap.set(l2w[1], { x: l1w[0].offsetLeft - l2w[1].offsetLeft });
    gsap.set(l2w[0], { x: l1w[1].offsetLeft - l2w[0].offsetLeft });
    gsap.set(".l2", { autoAlpha: 0 });
    place(q(".neq"), HOOK.cx, HOOK.neq, 1.4);

    // --- hook -------------------------------------------------------------
    rise(tl, ".eyebrow", 0.1);
    tl.from(".l1-in", { autoAlpha: 0, yPercent: 60, rotation: 4, duration: 1.2, ease: "expo.out" }, 0.15);
    pop(tl, ".h-deco", 0.4, { stagger: 0.1 });

    // the copy peels off downwards…
    tl.set(".l2", { autoAlpha: 1 }, 1.5);
    tl.to(".l2", { y: `+=${HOOK.l2 - HOOK.l1}`, duration: 0.8, ease: "back.out(1.4)" }, 1.55);
    tl.fromTo(".l2", { color: cssVar("--color-primary") }, { color: cssVar("--color-lilac-deep"), duration: 0.8 }, 2.3);

    // …and its words swap on arcs: crouch, jump (one over, one under), land
    const SW = 2.1;
    tl.to(l2w, { scaleX: 1.08, scaleY: 0.84, transformOrigin: "50% 100%", duration: 0.18, ease: "power2.out" }, SW);
    tl.to(l2w, { scaleX: 0.96, scaleY: 1.06, duration: 0.3, ease: "power2.out" }, SW + 0.18);
    tl.to(l2w, { x: 0, duration: 0.9, ease: "power2.inOut" }, SW + 0.18);
    tl.to(l2w[1], { keyframes: [{ y: -110, duration: 0.45, ease: "power2.out" }, { y: 0, duration: 0.45, ease: "power2.in" }] }, SW + 0.18);
    tl.to(l2w[0], { keyframes: [{ y: 80, duration: 0.45, ease: "power2.out" }, { y: 0, duration: 0.45, ease: "power2.in" }] }, SW + 0.18);
    tl.to(
      l2w,
      { keyframes: [{ scaleX: 1.1, scaleY: 0.86, duration: 0.09, ease: "power2.out" }, { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1, 0.45)" }] },
      SW + 1.08,
    );

    // ≠ : the box pops, the bars draw, the slash strikes and shakes it
    const NQ = 3.1;
    pop(tl, ".neq-box", NQ);
    drawIn(tl, ".neq .neq-bar", NQ + 0.2, { duration: 0.35, stagger: 0.1 });
    drawIn(tl, ".neq .neq-slash", NQ + 0.6, { duration: 0.25, ease: "power4.in" });
    tl.to(".neq-box", { keyframes: [{ rotation: -9, duration: 0.08 }, { rotation: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" }] }, NQ + 0.85);
    reveal(tl, ".hook-q", 3.4);

    // --- the lines become the headers of the comparison --------------------
    const P = 5.6;
    tl.to(".hook-q", { y: -30, autoAlpha: 0, duration: 0.45, ease: "power2.in" }, P);
    tl.to(".h-deco", { scale: 0, autoAlpha: 0, duration: 0.45, ease: "back.in(2)", stagger: 0.05 }, P);
    [".l1", ".l2"].forEach((s, i) => {
      tl.to(s, { x: 0, duration: 1.2, ease: "power3.inOut" }, P + 0.1 + i * 0.08);
      tl.to(s, { y: 0, scale: 1, duration: 1.2, ease: "power2.inOut" }, P + 0.1 + i * 0.08);
    });
    tl.to(".neq", { x: 0, y: 0, scale: 1, rotation: 360, duration: 1.2, ease: "power3.inOut" }, P + 0.15);

    const C = P + 1.0;
    drawIn(tl, ".divider", C, { duration: 1.1 });
    rise(tl, ".q", C, { y: 30, stagger: 0.1 });
    rise(tl, ".viz", C + 0.1, { y: 50, stagger: 0.12 });
    rise(tl, ".viz-lb", C + 0.5, { y: 14, stagger: 0.04, duration: 0.8 });
    pop(tl, ".ds-n", C + 0.45, { stagger: 0.05 });
    pop(tl, ".sd-n", C + 0.55, { stagger: 0.05 });
    drawIn(tl, ".ds-p", C + 0.8, { duration: 0.7, stagger: 0.08 });
    drawIn(tl, ".sd-p", C + 0.9, { duration: 0.7, stagger: 0.05 });

    // rows open outwards from the divider
    const R = C + 1.3;
    tl.from(".ri-l", { x: 60, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.12 }, R);
    tl.from(".ri-r", { x: -60, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.12 }, R);

    const E = R + 0.8;
    tl.from(".common", { scaleX: 0, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.9, ease: "expo.out" }, E);
    pop(tl, ".eq", E + 0.3);
    drawIn(tl, ".eq .neq-bar", E + 0.45, { duration: 0.35, stagger: 0.1 });
    rise(tl, ".common-t", E + 0.35, { y: 20, duration: 0.9 });

    // --- secondary action --------------------------------------------------
    drift(".h-deco .deco-inner", 26, 10);
    drift(".neq-inner", 6, 3);
    // tokens travel into components and screens; requests cross the services
    qa(".pk").forEach((dot, i) => {
      const path = el.querySelector<SVGPathElement>(`.${dot.dataset.route}`)!;
      gsap.set(dot, { opacity: 0 });
      gsap
        .timeline({ repeat: -1, delay: C + 1.8 + (i % 3) * 0.45 + (i >= 3 ? 0.2 : 0), repeatDelay: 0.8 })
        .to(dot, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] as [number, number] }, duration: 1.7, ease: "power1.inOut" }, 0)
        .fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, 0)
        .to(dot, { opacity: 0, duration: 0.25 }, 1.45);
    });
  });

  const head = { fontSize: HEAD_FS, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.03em", whiteSpace: "nowrap" } as const;

  return (
    <div className="scene" ref={root}>
      <Eyebrow>02 · O que é um Design System</Eyebrow>

      <Deco className="h-deco" x={200} y={190} kind="star" grad="tangerine" size={90} />
      <Deco className="h-deco" x={1610} y={160} kind="ring" grad="summer" size={120} />
      <Deco className="h-deco" x={1590} y={760} kind="flower" grad="purple" size={130} />
      <Deco className="h-deco" x={220} y={780} kind="squiggle" grad="orange" size={170} />

      <div className="hook-q abs h3 soft" style={{ left: 0, top: 772, width: 1920, textAlign: "center" }}>
        Mesmas palavras. Outro problema.
      </div>

      {/* headers (their layout is the comparison; the hook is a transform) */}
      <div className="l1 abs" style={{ left: COL_L, top: HEAD_Y, ...head }}>
        <div className="l1-in">
          <span className="w" style={{ display: "inline-block" }}>Design</span>{" "}
          <span className="w" style={{ display: "inline-block" }}>System</span>
        </div>
      </div>
      <div className="l2 abs" style={{ left: COL_R, top: HEAD_Y, color: "var(--color-lilac-deep)", ...head }}>
        <span className="w" style={{ display: "inline-block" }}>System</span>{" "}
        <span className="w" style={{ display: "inline-block" }}>Design</span>
      </div>
      <div className="neq abs" style={{ left: HOOK.cx - NEQ / 2, top: NEQ_Y - NEQ / 2, width: NEQ, height: NEQ }}>
        <div className="neq-inner">
          <div className="neq-box center" style={{ width: NEQ, height: NEQ, borderRadius: 22, background: "var(--color-pink)", rotate: "-4deg" }}>
            <Equals slash size={78} />
          </div>
        </div>
      </div>

      <div className="q abs body-lg soft" style={{ left: COL_L, top: 270, width: COL_W }}>
        Como a interface fica consistente?
      </div>
      <div className="q abs body-lg soft" style={{ left: COL_R, top: 270, width: COL_W }}>
        Como o sistema aguenta a escala?
      </div>

      <svg className="abs" width={4} height={540} style={{ left: HOOK.cx - 2, top: 292, overflow: "visible" }}>
        <line className="divider" x1={2} y1={0} x2={2} y2={540} style={{ stroke: "var(--color-border)" }} strokeWidth={2} strokeLinecap="round" />
      </svg>

      <DsViz />
      <SdViz />

      {(["l", "r"] as const).map((side) => (
        <div key={side} className="abs col" style={{ left: side === "l" ? COL_L : COL_R, top: ROWS_Y, width: COL_W, gap: 16 }}>
          {rows.map(([label, ds, sd]) => (
            <div key={label} className={`ri-${side} col`} style={{ gap: 4 }}>
              <span className="label soft mono" style={{ fontSize: 21, fontWeight: 600, letterSpacing: "0.04em" }}>{label}</span>
              <span style={{ fontSize: 30, lineHeight: 1.25 }}>{side === "l" ? ds : sd}</span>
            </div>
          ))}
        </div>
      ))}

      <div
        className="common abs row"
        style={{ left: COL_L, top: 862, width: 1680, height: 86, padding: "0 30px", gap: 22, borderRadius: 43, background: "var(--color-surface)" }}
      >
        <div className="eq center" style={{ width: 58, height: 58, borderRadius: "50%", background: "var(--gradient-macha)", flexShrink: 0 }}>
          <Equals size={46} />
        </div>
        <span className="common-t" style={{ fontSize: 27 }}>
          <strong className="green">Em comum:</strong> os dois são reuso em escala, com contratos estáveis (props ↔ APIs) que vários times
          consomem.
        </span>
      </div>
    </div>
  );
}
