import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { arcIn, breathe, drawIn, float, pop, reveal, rise } from "../engine/anim";
import { ArrowDot, Eyebrow, Mark } from "../components/ui";
import { GradDef, Shape } from "../components/Shape";
import type { GradName, ShapeKind } from "../components/Shape";

const products: { name: string; btn: string; shape: ShapeKind; grad: GradName; y: number }[] = [
  { name: "App cliente", btn: "var(--gradient-orange-crush)", shape: "circle", grad: "tangerine", y: 0 },
  { name: "Portal parceiro", btn: "var(--gradient-macha)", shape: "flower", grad: "core", y: 170 },
  { name: "Backoffice", btn: "var(--gradient-purple-haze)", shape: "squircle", grad: "text", y: 340 },
];

export default function S07LinhasCusto() {
  const root = useScene((tl) => {
    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".title", 0.2);

    // linha de produtos
    rise(tl, ".spl-title", 0.7);
    pop(tl, ".core", 0.9);
    drawIn(tl, ".branch", 1.4, { duration: 0.8, stagger: 0.15 });
    arcIn(tl, ".product", 1.7, { x: -120, y: 60, rotation: -6 }, { stagger: 0.18 });
    rise(tl, ".spl-note", 2.5);

    // custo x benefício
    rise(tl, ".cb-title", 2.6);
    drawIn(tl, ".axis", 2.8, { duration: 0.7 });
    rise(tl, ".axis-text", 3.1, { y: 10 });
    drawIn(tl, ".l-sem", 3.3, { duration: 1.8, ease: "power1.inOut" });
    rise(tl, ".lab-sem", 4.4, { y: 10 });
    drawIn(tl, ".l-com", 3.7, { duration: 1.8, ease: "power1.inOut" });
    rise(tl, ".lab-com", 4.8, { y: 10 });
    tl.from(".gain", { autoAlpha: 0, duration: 1 }, 5.2);
    pop(tl, ".be", 5.3, { transformOrigin: "50% 50%" });
    rise(tl, ".be-label", 5.5, { y: 10 });

    float(".product-inner", 4, 1.5);
    breathe(".core-shape", 0.05);
    gsap.to(".be-pulse", { attr: { r: 30 }, opacity: 0, duration: 1.6, ease: "power2.out", repeat: -1, delay: 6 });
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>03 · Design System à luz do Reuso</Eyebrow>
      <h2 className="h1 title" style={{ marginTop: 34 }}>
        Variabilidade <span className="soft" style={{ fontWeight: 400 }}>e</span> custo
      </h2>

      <div className="row" style={{ marginTop: 50, gap: 80, alignItems: "flex-start" }}>
        {/* --- linha de produtos --- */}
        <div style={{ width: 800 }}>
          <div className="spl-title h3">Linhas de produto de software</div>
          <div style={{ position: "relative", height: 460, marginTop: 30 }}>
            <svg className="abs" width={800} height={460} style={{ left: 0, top: 0, overflow: "visible" }}>
              <GradDef name="summer" id="branch-g" w={800} h={460} />
              {products.map((p) => (
                <path
                  key={p.name}
                  className="branch"
                  d={`M 250 220 C 340 220, 340 ${p.y + 60}, 430 ${p.y + 60}`}
                  stroke="url(#branch-g)"
                  strokeWidth={4}
                  strokeLinecap="round"
                  fill="none"
                />
              ))}
            </svg>
            <div className="core abs" style={{ left: 0, top: 110 }}>
              <div
                className="core-shape col center"
                style={{
                  width: 240,
                  height: 220,
                  borderRadius: 40,
                  background: "var(--gradient-core)",
                  color: "var(--color-just-black)",
                  textAlign: "center",
                  padding: 20,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "0.04em", opacity: 0.7 }}>NÚCLEO COMUM</span>
                <span style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.1, marginTop: 8 }}>tokens + componentes</span>
              </div>
            </div>
            {products.map((p) => (
              <div key={p.name} className="product abs" style={{ left: 440, top: p.y }}>
                <div className="product-inner card row" style={{ width: 340, padding: "20px 22px", gap: 18 }}>
                  <Shape kind={p.shape} grad={p.grad} size={52} />
                  <div className="col" style={{ gap: 10 }}>
                    <span style={{ fontSize: 22, fontWeight: 600 }}>{p.name}</span>
                    <span className="row" style={{ height: 36, padding: "0 6px 0 16px", gap: 8, borderRadius: 100, background: p.btn, color: "var(--color-just-black)", fontSize: 16, fontWeight: 600, alignSelf: "flex-start" }}>
                      Ação <ArrowDot />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="spl-note body soft">
            Variação por <Mark color="orange" tilt={-2}>temas e tokens</Mark>, não por cópia de código.
          </p>
        </div>

        {/* --- custo x benefício --- */}
        <div style={{ width: 800 }}>
          <div className="cb-title h3">Custo × benefício</div>
          <svg width={800} height={500} style={{ marginTop: 30, overflow: "visible" }}>
            <GradDef name="orange" id="sem-g" w={800} h={500} />
            <GradDef name="macha" id="com-g" w={800} h={500} />
            <defs>
              <linearGradient id="gain-g" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--color-shockingly-green)" stopOpacity="0.05" />
                <stop offset="1" stopColor="var(--color-shockingly-green)" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <polygon className="gain" points="390,210 720,40 720,170" fill="url(#gain-g)" />
            <path className="axis" d="M 60 20 V 400" stroke="var(--color-border)" strokeWidth={3} />
            <path className="axis" d="M 60 400 H 740" stroke="var(--color-border)" strokeWidth={3} />
            <text className="axis-text" x={60} y={448} fill="var(--color-muted)" fontSize={20} fontFamily="var(--font-sans)">
              nº de produtos / times →
            </text>
            <text className="axis-text" x={-400} y={36} transform="rotate(-90)" fill="var(--color-muted)" fontSize={20} fontFamily="var(--font-sans)">
              custo acumulado →
            </text>

            <path className="l-sem" d="M 60 380 L 720 40" stroke="url(#sem-g)" strokeWidth={8} strokeLinecap="round" fill="none" />
            <text className="lab-sem" x={590} y={36} fill="var(--color-orange-deep)" fontSize={24} fontWeight={600} fontFamily="var(--font-sans)">
              sem DS
            </text>
            <path className="l-com" d="M 60 250 L 720 170" stroke="url(#com-g)" strokeWidth={8} strokeLinecap="round" fill="none" />
            <text className="lab-com" x={600} y={212} fill="var(--color-green-deep)" fontSize={24} fontWeight={600} fontFamily="var(--font-sans)">
              com DS
            </text>
            <text className="lab-com" x={70} y={214} fill="var(--color-soft)" fontSize={17} fontFamily="var(--font-sans)">
              investimento inicial alto
            </text>

            <circle className="be-pulse" cx={390} cy={210} r={14} fill="none" stroke="var(--color-primary)" strokeWidth={2} />
            <circle className="be" cx={390} cy={210} r={14} fill="var(--color-bg)" stroke="var(--color-primary)" strokeWidth={5} />
            <text className="be-label" x={350} y={300} fill="var(--color-primary)" fontSize={24} fontWeight={600} fontFamily="var(--font-sans)">
              ponto de equilíbrio
            </text>
            <text className="be-label" x={350} y={332} fill="var(--color-soft)" fontSize={20} fontFamily="var(--font-sans)">
              o retorno cresce com a escala
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
