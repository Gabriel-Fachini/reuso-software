import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { arcIn, drawIn, exit, float, pop, reveal, rise, step } from "../engine/anim";
import { Eyebrow, Mark } from "../components/ui";
import { GradDef, Shape } from "../components/Shape";
import type { GradName, ShapeKind } from "../components/Shape";

const mfes = ["Busca", "Restaurante", "Carrinho", "Checkout", "Pedidos", "Conta"];
const mfeGrads = [
  "var(--gradient-orange-crush)",
  "var(--gradient-macha)",
  "var(--gradient-purple-haze)",
  "var(--gradient-summer-fair)",
  "var(--gradient-lipstick)",
  "var(--gradient-emerald-city)",
];

function Node({
  cls,
  title,
  sub,
  x,
  y,
  w,
  h,
  shape,
  grad,
}: {
  cls: string;
  title: string;
  sub: string;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: ShapeKind;
  grad: GradName;
}) {
  return (
    <div className={`${cls} abs`} style={{ left: x, top: y }}>
      <div className="card row" style={{ width: w, height: h, padding: "0 24px", gap: 18 }}>
        <Shape kind={shape} grad={grad} size={h > 120 ? 64 : 40} />
        <div className="col" style={{ gap: 4 }}>
          <span className="h3" style={{ fontSize: h > 120 ? 32 : 26, fontWeight: 600 }}>{title}</span>
          <span className="muted" style={{ fontSize: 18, whiteSpace: "nowrap" }}>{sub}</span>
        </div>
      </div>
    </div>
  );
}

// a small dictionary before the architecture: the case's key terms
const glossary: { term: string; tag: string; def: string; ex: string; shape: ShapeKind; grad: GradName }[] = [
  { term: "Fail-fast", tag: "cultura", def: "testar ideias cedo e corrigir rápido: errar barato faz parte do processo.", ex: "lança → mede → ajusta", shape: "star", grad: "tangerine" },
  { term: "Squad", tag: "time", def: "time pequeno e autônomo, dono de uma parte do produto de ponta a ponta.", ex: "~22–27 squads em paralelo", shape: "flower", grad: "purple" },
  { term: "Microfrontend", tag: "MFE", def: "pedaço da interface com deploy próprio, mantido por um time; juntos formam o app.", ex: "Busca · Carrinho · Checkout", shape: "squircle", grad: "core" },
];

// glossary terms are underlined where they show up in the case
const term = { textDecoration: "underline", textDecorationColor: "var(--color-shockingly-green)", textDecorationThickness: 4, textUnderlineOffset: 6 } as const;

const GL = { x: 160, y: 250, w: 1600, h: 560 };

export default function S11IfoodSolucao() {
  const root = useScene((tl) => {
    rise(tl, ".eyebrow", 0.1);

    // A — glossary card (the 11 → 12 transition lands on .gloss-box)
    rise(tl, ".gloss-box", 0.1, { y: 60 });
    rise(tl, ".gloss-head", 0.35, { y: 20 });
    arcIn(tl, ".entry", 0.45, { x: 80, y: 80, rotation: 3 }, { stagger: 0.14 });
    pop(tl, ".entry .icon", 0.8, { stagger: 0.14 });
    rise(tl, ".entry .ex", 1.1, { y: 14, stagger: 0.1 });
    step(tl);

    // B — the architecture
    exit(tl, ".gloss", undefined, { y: -60, scale: 0.94 });
    tl.addLabel("b", "-=0.2");
    reveal(tl, ".title", "b");
    reveal(tl, ".title2", "b+=0.25");

    // web: Figma -> React lib -> microfrontends
    rise(tl, ".n-figma", "b+=0.6", { x: -50, y: 0 });
    drawIn(tl, ".c-1", "b+=1.1", { duration: 0.5 });
    rise(tl, ".n-react", "b+=1.3", { x: -50, y: 0 });
    drawIn(tl, ".c-2", "b+=1.8", { duration: 0.6 });
    pop(tl, ".mfe", "b+=2.1", { stagger: { each: 0.08, from: "start" } });
    rise(tl, ".mfe-label", "b+=2.7");

    // mobile expansion
    drawIn(tl, ".c-3", "b+=3.0", { duration: 1 });
    pop(tl, ".n-mobile", "b+=3.6", { stagger: 0.15 });
    rise(tl, ".mobile-label", "b+=3.9");
    pop(tl, ".mobile-label .mark", "b+=4.2");

    // numbers + learnings
    rise(tl, ".metric", "b+=4.4", { stagger: 0.12 });
    rise(tl, ".learn", "b+=4.8");

    // autonomous teams pulsing on a shared base
    gsap.utils.toArray<HTMLElement>(".mfe-dot").forEach((d) => {
      gsap.to(d, {
        scale: 0.5,
        opacity: 0.4,
        duration: gsap.utils.random(0.5, 1.1),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: gsap.utils.random(0, 1),
      });
    });
    float(".mfe-inner", 4, 1.5);
    float(".entry .icon", 10, 10);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>05 · Case iFood</Eyebrow>

      <div className="gloss abs" style={{ left: GL.x, top: GL.y, width: GL.w, height: GL.h, zIndex: 2 }}>
        <div className="gloss-box col" style={{ width: GL.w, height: GL.h, padding: "40px 44px", gap: 30, borderRadius: 32, background: "var(--color-surface)" }}>
          <div className="gloss-head row" style={{ gap: 18, alignItems: "baseline" }}>
            <span className="label green" style={{ fontSize: 24 }}>GLOSSÁRIO</span>
            <span className="h3" style={{ fontSize: 40, fontWeight: 600 }}>Três termos para entender o case</span>
          </div>
          <div className="row" style={{ gap: 28, flex: 1, alignItems: "stretch" }}>
            {glossary.map((g) => (
              <div key={g.term} className="entry">
                <div className="col" style={{ width: 486, height: "100%", padding: 30, gap: 16, borderRadius: 22, background: "var(--color-bg)" }}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <span className="chip mono" style={{ fontSize: 18, padding: "4px 14px" }}>{g.tag}</span>
                    <div className="icon">
                      <Shape kind={g.shape} grad={g.grad} size={52} />
                    </div>
                  </div>
                  <span className="h3" style={{ fontSize: 44, fontWeight: 600 }}>{g.term}</span>
                  <span className="soft" style={{ fontSize: 27, lineHeight: 1.35 }}>{g.def}</span>
                  <span style={{ flex: 1 }} />
                  <span className="ex mono green" style={{ fontSize: 21 }}>{g.ex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row" style={{ marginTop: 34, gap: 26, alignItems: "baseline" }}>
        <h2 className="h1 title">Uma base comum,</h2>
        <h2 className="statement soft title2" style={{ fontSize: 64 }}>times autônomos.</h2>
      </div>

      <div style={{ position: "relative", width: 1680, height: 390, marginTop: 44 }}>
        <svg className="abs" width={1680} height={390} style={{ left: 0, top: 0, overflow: "visible" }}>
          <GradDef name="summer" id="c-g" w={1680} h={390} />
          <GradDef name="macha" id="c3-g" w={1680} h={390} />
          <path className="c-1" d="M 340 90 H 420" stroke="url(#c-g)" strokeWidth={4} fill="none" />
          {[0, 1].map((r) => (
            <path key={r} className="c-2" d={`M 790 90 C 830 90, 830 ${44 + r * 102}, 870 ${44 + r * 102}`} stroke="url(#c-g)" strokeWidth={4} fill="none" />
          ))}
          {[0, 1].map((i) => (
            <path
              key={i}
              className="c-3"
              d={`M 170 180 C 170 280, ${i ? 670 : 410} 230, ${i ? 670 : 410} 300`}
              stroke="url(#c3-g)"
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </svg>

        <Node cls="n-figma" title="Figma" sub="tokens + componentes" x={0} y={0} w={340} h={180} shape="flower" grad="purple" />
        <Node cls="n-react" title="Biblioteca React" sub="todos os sistemas web" x={420} y={0} w={370} h={180} shape="ring" grad="ui" />

        <div className="abs" style={{ left: 870, top: 0, width: 810 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {mfes.map((m, i) => (
              <div key={m} className="mfe">
                <div className="mfe-inner card row" style={{ height: 88, padding: "0 22px", gap: 14, borderRadius: 18 }}>
                  <span className="mfe-dot" style={{ width: 16, height: 16, borderRadius: "50%", background: mfeGrads[i] }} />
                  <span style={{ fontSize: 22, fontWeight: 600 }}>{m}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mfe-label soft" style={{ fontSize: 21, marginTop: 14 }}>
            <strong style={term}>microfrontends</strong> (nomes ilustrativos) · cada squad experimenta sobre a mesma base
          </div>
        </div>

        <Node cls="n-mobile" title="Android" sub="mesmos tokens" x={290} y={300} w={240} h={84} shape="squircle" grad="core" />
        <Node cls="n-mobile" title="iOS" sub="mesmos tokens" x={550} y={300} w={240} h={84} shape="circle" grad="core" />
        <div className="mobile-label abs body-lg" style={{ left: 830, top: 320, width: 850 }}>
          Depois, mobile: <Mark color="green" tilt={-2}>tokens como fonte da verdade</Mark> multiplataforma.
        </div>
      </div>

      <div className="row" style={{ marginTop: 44, gap: 20, alignItems: "stretch" }}>
        {[
          ["~187", "componentes na biblioteca"],
          ["47", "microfrontends em produção"],
          ["~50%", "menos tempo que do zero · ~40% vs. lib OSS · ~10% vs. copiar tela irmã"],
        ].map(([num, label]) => (
          <div key={label} className="metric card col" style={{ width: 330, gap: 10, justifyContent: "space-between", padding: 26 }}>
            <span className="h2" style={{ fontSize: 56, fontWeight: 600, lineHeight: 1 }}>{num}</span>
            <span className="muted" style={{ fontSize: 18, lineHeight: 1.3 }}>{label}</span>
          </div>
        ))}
        <div className="learn card col grow" style={{ gap: 12, padding: 26 }}>
          <span className="label muted" style={{ fontSize: 17 }}>APRENDIZADOS</span>
          <div style={{ fontSize: 23 }}>
            <span className="green">✓</span> base comum + autonomia de ~22–27 squads
          </div>
          <div style={{ fontSize: 23 }}>
            <span className="orange">✗</span> adoção · versionamento entre MFEs · contribuição
          </div>
        </div>
      </div>
    </div>
  );
}
