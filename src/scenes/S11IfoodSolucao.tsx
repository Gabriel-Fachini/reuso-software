import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { drawIn, float, pop, reveal, rise } from "../engine/anim";
import { Dado, Eyebrow, Mark } from "../components/ui";
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

export default function S11IfoodSolucao() {
  const root = useScene((tl) => {
    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".title", 0.2);
    reveal(tl, ".title2", 0.45);

    // web: Figma -> React lib -> microfrontends
    rise(tl, ".n-figma", 0.8, { x: -50, y: 0 });
    drawIn(tl, ".c-1", 1.3, { duration: 0.5 });
    rise(tl, ".n-react", 1.5, { x: -50, y: 0 });
    drawIn(tl, ".c-2", 2.0, { duration: 0.6 });
    pop(tl, ".mfe", 2.3, { stagger: { each: 0.08, from: "start" } });
    rise(tl, ".mfe-label", 2.9);

    // mobile expansion
    drawIn(tl, ".c-3", 3.2, { duration: 1 });
    pop(tl, ".n-mobile", 3.8, { stagger: 0.15 });
    rise(tl, ".mobile-label", 4.1);
    pop(tl, ".mobile-label .mark", 4.4);

    // numbers + learnings
    rise(tl, ".metric", 4.6, { stagger: 0.12 });
    rise(tl, ".learn", 5.0);

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
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>05 · Case iFood</Eyebrow>
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
          <div className="mfe-label muted" style={{ fontSize: 19, marginTop: 14 }}>
            microfrontends (nomes ilustrativos) · UI encapsulada, cada time experimenta sobre a mesma base
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
          ["componentes na biblioteca", "nº componentes"],
          ["microfrontends consumindo", "nº de MFEs"],
          ["para construir uma tela", "ganho de tempo"],
        ].map(([label, dado]) => (
          <div key={label} className="metric card col" style={{ width: 330, gap: 14, justifyContent: "space-between", padding: 26 }}>
            <span style={{ fontSize: 26 }}>
              <Dado>{dado}</Dado>
            </span>
            <span className="muted" style={{ fontSize: 20 }}>{label}</span>
          </div>
        ))}
        <div className="learn card col grow" style={{ gap: 12, padding: 26 }}>
          <span className="label muted" style={{ fontSize: 17 }}>APRENDIZADOS</span>
          <div style={{ fontSize: 23 }}>
            <span className="green">✓</span> base comum + autonomia dos times <Dado>o que mais funcionou</Dado>
          </div>
          <div style={{ fontSize: 23 }}>
            <span className="orange">✗</span> adoção · versionamento entre MFEs · contribuição
          </div>
        </div>
      </div>
    </div>
  );
}
