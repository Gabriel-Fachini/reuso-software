import { useRef, useState } from "react";
import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { arcIn, float, pop, reveal, rise, step } from "../engine/anim";
import { Eyebrow, Mark } from "../components/ui";
import { Deco } from "../components/Shape";
import { cssVar } from "../engine/tokens";
import "./demo.css";

type Tokens = { brand: string; radius: number; space: number };

// Brand options are the real palette tokens; values are read at runtime.
const BRAND_TOKENS = [
  "--color-orangey",
  "--color-shockingly-green",
  "--color-shockingly-pink",
  "--color-lilac",
  "--color-blue",
] as const;

const radii = [
  { v: 0, label: "0" },
  { v: 8, label: "8px" },
  { v: 100, label: "pill" },
];
const spaces = [
  { v: 0.7, label: "compacto" },
  { v: 1, label: "padrão" },
  { v: 1.35, label: "amplo" },
];

export default function S14Demo() {
  const [brands] = useState(() => BRAND_TOKENS.map((t) => cssVar(t)));
  const [DEFAULTS] = useState<Tokens>(() => ({ brand: brands[0], radius: 100, space: 1 }));
  const [tokens, setTokens] = useState<Tokens>(DEFAULTS);
  const tokensRef = useRef(tokens);
  const flashRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  const apply = (next: Partial<Tokens>, duration = 0.8) => {
    const t = { ...tokensRef.current, ...next };
    tokensRef.current = t;
    setTokens(t);
    gsap.to(appRef.current, {
      "--d-brand": t.brand,
      "--d-radius": `${t.radius}px`,
      "--d-space": t.space,
      duration,
      ease: "power3.inOut",
    });
    const count = appRef.current?.querySelectorAll('[class^="d-"], [class*=" d-"]').length ?? 0;
    const flash = flashRef.current;
    if (flash) {
      flash.textContent = `↻ ${count} componentes atualizados`;
      gsap.fromTo(flash, { autoAlpha: 1, y: 0, scaleX: 0.7, scaleY: 1.3 }, { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1, 0.45)" });
      gsap.to(flash, { autoAlpha: 0, y: -10, delay: 1.6, duration: 0.4, overwrite: false });
    }
  };

  const root = useScene((tl) => {
    gsap.set(".flash", { autoAlpha: 0 });

    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".title", 0.2);
    pop(tl, ".title .mark", 0.8);
    arcIn(tl, ".demo-panel", 0.6, { x: -120, y: 80, rotation: -3 });
    rise(tl, ".demo-app-wrap", 0.8, { x: 80, y: 0 });
    tl.from(".demo-app [data-c]", { autoAlpha: 0, y: 30, duration: 0.8, ease: "expo.out", stagger: 0.07 }, 1.1);
    pop(tl, ".x-deco", 1.4, { stagger: 0.15 });
    float(".x-deco .deco-inner", 12, 10);
    step(tl);

    // Scripted path through the demo (live, the presenter can click instead).
    // Calls sit just after each pause so resuming always fires them.
    tl.call(() => apply({ brand: brands[1] }), [], "+=0.05");
    step(tl);
    tl.call(() => apply({ radius: 0 }), [], "+=0.05");
    step(tl);
    tl.call(() => apply({ space: 1.35 }), [], "+=0.05");
    step(tl);
    tl.call(() => apply(DEFAULTS), [], "+=0.05");
    tl.to({}, { duration: 1 });
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>07 · Demonstração</Eyebrow>
      <h2 className="h1 title" style={{ marginTop: 40 }}>
        Muda o token, <Mark color="orange" tilt={-2}>muda tudo.</Mark>
      </h2>

      <div className="row" style={{ marginTop: 44, gap: 60, alignItems: "flex-start" }}>
        {/* token editor */}
        <div className="demo-panel card col" data-interactive style={{ width: 520, gap: 30, padding: 32 }}>
          <div className="col" style={{ gap: 14 }}>
            <span className="mono" style={{ fontSize: 20 }}>color.brand.primary</span>
            <div className="row" style={{ gap: 14 }}>
              {brands.map((b) => (
                <button
                  key={b}
                  className={`sw ${tokens.brand === b ? "on" : ""}`}
                  style={{ background: b }}
                  onClick={() => apply({ brand: b })}
                  aria-label={b}
                />
              ))}
            </div>
          </div>
          <div className="col" style={{ gap: 14 }}>
            <span className="mono" style={{ fontSize: 20 }}>radius.control</span>
            <div className="row" style={{ gap: 10 }}>
              {radii.map((r) => (
                <button key={r.v} className={`opt ${tokens.radius === r.v ? "on" : ""}`} onClick={() => apply({ radius: r.v })}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div className="col" style={{ gap: 14 }}>
            <span className="mono" style={{ fontSize: 20 }}>space.scale</span>
            <div className="row" style={{ gap: 10 }}>
              {spaces.map((s) => (
                <button key={s.v} className={`opt ${tokens.space === s.v ? "on" : ""}`} onClick={() => apply({ space: s.v })}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="code" style={{ fontSize: 19, padding: "16px 20px" }}>
            {"{\n  "}
            <span className="k">"color.brand.primary"</span>: <span className="s">"{tokens.brand}"</span>
            {",\n  "}
            <span className="k">"radius.control"</span>: <span className="s">"{tokens.radius}px"</span>
            {",\n  "}
            <span className="k">"space.scale"</span>: <span className="s">{tokens.space}</span>
            {"\n}"}
          </div>
          <button className="opt" style={{ alignSelf: "flex-start" }} onClick={() => apply(DEFAULTS)}>
            ↺ restaurar
          </button>
        </div>

        {/* the "product" */}
        <div className="demo-app-wrap" style={{ position: "relative" }}>
          <Deco className="x-deco" x={990} y={330} kind="pinwheel" grad="orange" size={90} />
          <Deco className="x-deco" x={-40} y={560} kind="ring" grad="summer" size={70} />
          <div ref={appRef} className="demo-app">
            <div className="d-header" data-c>
              <div className="d-logo" />
              <div className="d-input">Buscar pratos e mercados</div>
              <div className="d-avatar" />
            </div>
            <div className="d-tabs" data-c>
              <span className="d-tab on">Restaurantes</span>
              <span className="d-tab">Mercados</span>
              <span className="d-tab">Farmácias</span>
            </div>
            <div className="d-chips" data-c>
              <span className="d-chip on">Entrega grátis</span>
              <span className="d-chip">Até 30 min</span>
              <span className="d-chip">Promoções</span>
            </div>
            <div className="d-grid">
              <div className="d-card" data-c>
                <span className="d-badge">NOVO</span>
                <span className="d-title">Combo da casa</span>
                <span className="d-price">R$ 39,90</span>
                <div className="d-btns">
                  <span className="d-btn primary">Adicionar</span>
                  <span className="d-btn">Detalhes</span>
                </div>
              </div>
              <div className="d-card" data-c>
                <div className="d-row">
                  <span>Notificações</span>
                  <span className="d-toggle" />
                </div>
                <div className="d-row">
                  <span>Pedido a caminho</span>
                  <span className="muted">64%</span>
                </div>
                <div className="d-progress">
                  <div />
                </div>
                <span className="d-link">Acompanhar pedido</span>
              </div>
            </div>
          </div>
          <div
            ref={flashRef}
            className="flash chip abs"
            style={{ right: 0, top: -64, background: "var(--color-primary)", color: "var(--color-bg)", borderColor: "transparent" }}
          />
        </div>
      </div>
    </div>
  );
}
