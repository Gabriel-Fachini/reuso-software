import type { ReactNode } from "react";
import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { arcIn, drift, exit, float, pop, reveal, rise, spin, step } from "../engine/anim";
import { ArrowDot, Eyebrow, Mark } from "../components/ui";
import { GradDef, Shape } from "../components/Shape";
import type { GradName, ShapeKind } from "../components/Shape";

const challenges: [string, string, ShapeKind, GradName][] = [
  ["Adoção", "não basta existir, os times precisam usar", "circle", "tangerine"],
  ["Manutenção contínua", "é um produto, não um projeto com fim", "ring", "summer"],
  ["Rigidez", "padrão demais pode limitar a criatividade", "squircle", "text"],
  ["Breaking changes", "dependência entre times e versões", "diamond", "lipstick"],
  ["Custo", "alto para empresas pequenas", "flower", "core"],
];

/*
 * Silver bullet geometry, in coordinates of the cards row (x = 0 is the left
 * margin). Cards have exact sizes so the holes line up with the bullet path.
 */
const CARD_W = 320;
const CARD_H = 460;
const CARD_GAP = 20;
const ROW_W = challenges.length * CARD_W + (challenges.length - 1) * CARD_GAP; // 1680
const LANE_Y = 223; // bullet path, inside each card (between icon and title)
const BULLET_W = 230;
const BULLET_H = 55;
const TIP_END = ROW_W + 98; // the nose sticks out of the last card
const TRAVEL = 1900;
const TIP_START = TIP_END - TRAVEL;
const FLIGHT = 1.5;
const holeX = (i: number) => i * (CARD_W + CARD_GAP) + CARD_W / 2;
// the flight uses power3.out; invert it to know when the nose reaches x
const reachAt = (x: number) => FLIGHT * (1 - Math.cbrt(1 - (x - TIP_START) / TRAVEL));

const recap = [
  ["Design System", "é reuso em vários níveis", "var(--gradient-macha)"],
  ["Case iFood", "é a prova prática", "var(--gradient-lipstick)"],
  ["GenAI", "é o motivo para investir agora", "var(--gradient-purple-haze)"],
];

// QR placeholder: real-looking finder/timing patterns + seeded noise
const QR_N = 25;
const QR_PATH = (() => {
  let seed = 20261005;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const finder = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < 7 && y < 7 && (x === 0 || y === 0 || x === 6 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4));
  const far = QR_N - 7;
  let d = "";
  for (let y = 0; y < QR_N; y++) {
    for (let x = 0; x < QR_N; x++) {
      let on: boolean;
      if ((x < 8 && y < 8) || (x >= far - 1 && y < 8) || (x < 8 && y >= far - 1)) {
        on = finder(x >= far - 1 ? x - far : x, y >= far - 1 ? y - far : y);
      } else if (x === 6 || y === 6) on = (x + y) % 2 === 0;
      else if (x >= 9 && x <= 15 && y >= 9 && y <= 15) on = false; // center badge
      else on = rand() < 0.5;
      if (on) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return d;
})();

function QrPlaceholder({ size }: { size: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`-1 -1 ${QR_N + 2} ${QR_N + 2}`} shapeRendering="crispEdges" style={{ display: "block" }}>
        <path d={QR_PATH} style={{ fill: "var(--color-just-black)" }} />
      </svg>
      <span
        className="abs center mono"
        style={{
          left: "50%",
          top: "50%",
          translate: "-50% -50%",
          width: 58,
          height: 58,
          borderRadius: 12,
          border: "3px solid var(--color-just-black)",
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        QR
      </span>
    </div>
  );
}

function Bullet() {
  return (
    <svg width={BULLET_W} height={BULLET_H} viewBox="0 0 200 48" style={{ display: "block", overflow: "visible" }}>
      <GradDef name="silver" id="bullet-g" w={200} h={48} />
      <rect x={0} y={4} width={22} height={40} rx={5} fill="url(#bullet-g)" />
      <path d="M18 7 H118 C160 7 188 17 200 24 C188 31 160 41 118 41 H18 Z" fill="url(#bullet-g)" />
      <rect x={40} y={7} width={5} height={34} style={{ fill: "var(--color-surface50)" }} />
      <path d="M28 13 H120 C150 13 170 17 182 21" fill="none" stroke="var(--color-surface-white)" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

function Hole({ i }: { i: number }) {
  // torn edge + uneven cracks; each card's hole is turned a little differently
  const radii = [16, 12, 18, 13, 16, 11, 17, 14, 15, 12];
  const edge = radii
    .map((r, k) => {
      const a = (k * 36 * Math.PI) / 180;
      return `${40 + r * Math.cos(a)},${40 + r * Math.sin(a)}`;
    })
    .join(" ");
  const cracks = ["40,40 52,29 57,16", "40,40 61,45 72,41", "40,40 46,59 43,72", "40,40 25,52 14,55", "40,40 29,30 25,17"];
  return (
    <svg
      className={`hole hole-${i} abs`}
      width={120}
      height={120}
      viewBox="0 0 80 80"
      style={{ left: CARD_W / 2 - 60, top: LANE_Y - 60, overflow: "visible", rotate: `${i * 47}deg` }}
    >
      <g fill="none" stroke="var(--color-surface50)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        {cracks.map((c) => (
          <polyline key={c} points={c} />
        ))}
      </g>
      <polygon points={edge} fill="var(--color-just-black)" stroke="var(--color-surface25)" strokeWidth={4} strokeLinejoin="round" />
    </svg>
  );
}

// the closing party: DS pieces + gradient shapes, clear of the centre column
const party: { x: number; y: number; el: ReactNode; spin?: boolean }[] = [
  { x: 170, y: 200, el: <span className="chip mono">color.brand</span> },
  { x: 1500, y: 160, el: <span className="btn">Pedir <ArrowDot /></span> },
  { x: 1620, y: 760, el: <span className="chip mono">space.md</span> },
  { x: 210, y: 800, el: <span className="btn fill">Continuar <ArrowDot /></span> },
  { x: 330, y: 360, el: <Shape kind="pinwheel" grad="orange" size={110} />, spin: true },
  { x: 1560, y: 420, el: <Shape kind="flower" grad="purple" size={140} /> },
  { x: 1760, y: 300, el: <Shape kind="star" grad="tangerine" size={80} />, spin: true },
  { x: 130, y: 560, el: <Shape kind="ring" grad="summer" size={100} /> },
  { x: 1690, y: 850, el: <Shape kind="circle" grad="core" size={110} /> },
  { x: 480, y: 860, el: <Shape kind="squircle" grad="lipstick" size={70} /> },
];

export default function S15Fechamento() {
  const root = useScene((tl) => {
    gsap.set(".layer-b, .layer-c", { autoAlpha: 0 });
    gsap.set(".hole", { autoAlpha: 0 });

    // A — desafios, then the silver bullet goes through every one of them
    rise(tl, ".eyebrow-a", 0.1);
    reveal(tl, ".a-title", 0.2);
    arcIn(tl, ".ch", 0.6, { x: 120, y: 140, rotation: 6 }, { stagger: 0.14 });
    pop(tl, ".ch .icon", 1.0, { stagger: 0.14 });

    const FIRE = 2.4;
    tl.fromTo(".bullet", { x: -TRAVEL }, { x: 0, duration: FLIGHT, ease: "power3.out" }, FIRE);
    // the trail's right end follows the nose (same ease, linear mapping)
    tl.fromTo(
      ".trail-line",
      { scaleX: Math.max(0, (TIP_START + 120) / (ROW_W + 120)), transformOrigin: "0% 50%" },
      { scaleX: (TIP_END + 120) / (ROW_W + 120), duration: FLIGHT, ease: "power3.out" },
      FIRE,
    );
    challenges.forEach((_, i) => {
      const hit = FIRE + reachAt(holeX(i));
      tl.fromTo(`.hole-${i}`, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(3)", transformOrigin: "50% 50%" }, hit);
      tl.fromTo(
        `.ch-${i} .card`,
        { x: 0, rotation: 0 },
        {
          keyframes: [
            { x: 14, rotation: 1, duration: 0.06, ease: "power2.out" },
            { x: 0, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.35)" },
          ],
        },
        hit,
      );
    });
    tl.to(".trail", { autoAlpha: 0.5, duration: 0.8 }, FIRE + FLIGHT);
    step(tl);

    // B — conclusão
    exit(tl, ".layer-a");
    tl.set(".layer-b", { autoAlpha: 1 });
    rise(tl, ".eyebrow-b");
    reveal(tl, ".b1", "-=0.8");
    reveal(tl, ".b2", "-=1");
    reveal(tl, ".b3", "-=1");
    pop(tl, ".b2 .mark, .b3 .mark", "-=0.6", { stagger: 0.25 });
    rise(tl, ".rc", "-=0.4", { x: -50, y: 0, stagger: 0.18 });
    step(tl);

    // C — kahoot + perguntas
    exit(tl, ".layer-b");
    tl.set(".layer-c", { autoAlpha: 1 });
    tl.addLabel("c");
    pop(tl, ".join", "c");
    pop(tl, ".kahoot-logo", "c+=0.3");
    rise(tl, ".join-text", "c+=0.4", { y: 30, stagger: 0.12 });
    reveal(tl, ".perguntas", "c+=0.6");
    pop(tl, ".perguntas .mark", "c+=1.3");
    rise(tl, ".thanks", "c+=1.5");
    pop(tl, ".cf", "c+=0.2", { stagger: { each: 0.06, from: "random" } });

    float(".ch .icon", 10, 10);
    gsap.set(".glint", { autoAlpha: 0 });
    gsap
      .timeline({ repeat: -1, repeatDelay: 2.4, delay: FIRE + FLIGHT + 0.6 })
      .fromTo(".glint", { autoAlpha: 0, scale: 0, rotation: 0 }, { autoAlpha: 1, scale: 1, rotation: 45, duration: 0.3, ease: "back.out(2)", immediateRender: false })
      .to(".glint", { autoAlpha: 0, scale: 0, rotation: 90, duration: 0.35, ease: "power2.in" });
    drift(".cf-inner", 22, 8);
    spin(".cf-spin .shape", 14);
    drift(".join-inner", 8, 1);
  });

  return (
    <div className="scene" ref={root}>
      <div className="layer-a abs" style={{ inset: 0, padding: "92px var(--gutter) 110px" }}>
        <div className="eyebrow-a">
          <Eyebrow>08 · Desafios e limitações</Eyebrow>
        </div>
        <h2 className="h1 a-title" style={{ marginTop: 34 }}>
          Não é bala de prata.
        </h2>
        <div style={{ position: "relative", display: "flex", gap: CARD_GAP, width: ROW_W, height: CARD_H, marginTop: 70 }}>
          {/* behind the cards: only seen in the gaps and coming out of the last one */}
          <div className="bullet abs" style={{ left: TIP_END - BULLET_W, top: LANE_Y - BULLET_H / 2, zIndex: 0 }}>
            <Bullet />
          </div>
          {challenges.map(([t, d, shape, grad], i) => (
            <div key={t} className={`ch ch-${i}`} style={{ position: "relative", zIndex: 1, width: CARD_W, flexShrink: 0 }}>
              <div className="card col" style={{ position: "relative", height: CARD_H, justifyContent: "space-between", padding: 30 }}>
                <div className="icon">
                  <Shape kind={shape} grad={grad} size={96} />
                </div>
                <Hole i={i} />
                <div>
                  <div className="h3" style={{ fontSize: 34, fontWeight: 600 }}>{t}</div>
                  <div className="soft" style={{ fontSize: 21, marginTop: 10, lineHeight: 1.35 }}>{d}</div>
                </div>
              </div>
            </div>
          ))}
          {/* the bullet's path, behind the cards too: it shows in the margin and gaps */}
          <div className="trail abs" style={{ left: -120, top: LANE_Y - 1, width: ROW_W + 120, height: 2, overflow: "hidden", zIndex: 0 }}>
            <div className="trail-line" style={{ width: "100%", height: 2, background: "var(--color-surface75)" }} />
          </div>
          <div className="deco abs" style={{ left: TIP_END - 20, top: LANE_Y - 20, zIndex: 2 }}>
            <div className="glint">
              <Shape kind="star" grad="silver" size={40} />
            </div>
          </div>
        </div>
      </div>

      <div className="layer-b abs" style={{ inset: 0, padding: "92px var(--gutter) 110px" }}>
        <div className="eyebrow-b">
          <Eyebrow>09 · Conclusão</Eyebrow>
        </div>
        <div style={{ marginTop: 80 }}>
          <div className="statement b1" style={{ fontSize: 80 }}>Dá para ir rápido sem virar bagunça,</div>
          <div className="statement b2" style={{ fontSize: 80, marginTop: 14 }}>
            desde que o reuso seja <Mark color="green" tilt={-2}>estratégia</Mark>
          </div>
          <div className="statement b3" style={{ fontSize: 80, marginTop: 14 }}>
            e não <Mark color="orange" tilt={2}>acaso.</Mark>
          </div>
        </div>
        <div className="col" style={{ marginTop: 70, gap: 26 }}>
          {recap.map(([a, b, bg]) => (
            <div key={a} className="rc row" style={{ gap: 26 }}>
              <span style={{ width: 30, height: 30, borderRadius: "50%", background: bg, flexShrink: 0 }} />
              <span className="h2" style={{ fontWeight: 600 }}>{a}</span>
              <span className="h2 soft" style={{ fontWeight: 400 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="layer-c abs" style={{ inset: 0 }}>
        {party.map((c, i) => (
          <div key={i} className="cf abs" style={{ left: c.x, top: c.y }}>
            <div className={`cf-inner ${c.spin ? "cf-spin" : ""}`}>{c.el}</div>
          </div>
        ))}

        <div
          className="abs"
          style={{ inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}
        >
          <div className="join">
            <div
              className="join-inner row"
              style={{
                gap: 40,
                padding: 28,
                borderRadius: 28,
                background: "var(--color-surface-white)",
                color: "var(--color-just-black)",
                alignItems: "center",
              }}
            >
              <QrPlaceholder size={220} />
              <div className="col" style={{ gap: 20, alignItems: "flex-start", textAlign: "left" }}>
                <img
                  className="kahoot-logo"
                  src={`${import.meta.env.BASE_URL}kahoot-logo.svg`}
                  alt="Kahoot!"
                  style={{ width: 270, display: "block" }}
                />
                <span className="join-text" style={{ fontSize: 26, fontWeight: 500 }}>
                  Entre em <span className="mono" style={{ fontWeight: 700 }}>kahoot.it</span>
                </span>
                <span className="join-text dado" style={{ fontSize: 34 }}>[PIN do jogo]</span>
              </div>
            </div>
          </div>
          <div className="hero perguntas" style={{ marginTop: 64, fontSize: 170 }}>
            Perguntas<Mark color="orange" tilt={6} style={{ marginLeft: 12 }}>?</Mark>
          </div>
          <div className="thanks body-lg soft" style={{ marginTop: 34 }}>
            Obrigado! · Ana Lívia · Bruno · Bueno · Gabriel · Prato
          </div>
        </div>
      </div>
    </div>
  );
}
