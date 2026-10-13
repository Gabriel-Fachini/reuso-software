import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { arcIn, float, pop, reveal, rise } from "../engine/anim";
import { Eyebrow } from "../components/ui";
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

function Bullet() {
  return (
    <svg width={BULLET_W} height={BULLET_H} viewBox="0 0 200 48" style={{ display: "block", overflow: "visible" }}>
      <GradDef name="silver" id="bullet-g" w={200} h={48} />
      <rect x={0} y={4} width={22} height={40} rx={5} fill="url(#bullet-g)" />
      <path d="M18 7 H118 C160 7 188 17 200 24 C188 31 160 41 118 41 H18 Z" fill="url(#bullet-g)" />
      <rect x={40} y={7} width={5} height={34} style={{ fill: "var(--color-muted)" }} />
      <path d="M28 13 H120 C150 13 170 17 182 21" fill="none" stroke="var(--color-primary)" strokeWidth={3} strokeLinecap="round" />
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
      <g fill="none" stroke="var(--color-muted)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        {cracks.map((c) => (
          <polyline key={c} points={c} />
        ))}
      </g>
      <polygon points={edge} fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth={4} strokeLinejoin="round" />
    </svg>
  );
}

export default function S15Desafios() {
  const root = useScene((tl) => {
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

    float(".ch .icon", 10, 10);
    gsap.set(".glint", { autoAlpha: 0 });
    gsap
      .timeline({ repeat: -1, repeatDelay: 2.4, delay: FIRE + FLIGHT + 0.6 })
      .fromTo(".glint", { autoAlpha: 0, scale: 0, rotation: 0 }, { autoAlpha: 1, scale: 1, rotation: 45, duration: 0.3, ease: "back.out(2)", immediateRender: false })
      .to(".glint", { autoAlpha: 0, scale: 0, rotation: 90, duration: 0.35, ease: "power2.in" });
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
            <div className="trail-line" style={{ width: "100%", height: 2, background: "var(--color-soft)" }} />
          </div>
          <div className="deco abs" style={{ left: TIP_END - 20, top: LANE_Y - 20, zIndex: 2 }}>
            <div className="glint">
              <Shape kind="star" grad="silver" size={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
