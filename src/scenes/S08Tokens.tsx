import type { ReactNode } from "react";
import { gsap } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { drawIn, float, pop, reveal, rise, spin } from "../engine/anim";
import { cssVar } from "../engine/tokens";
import { Eyebrow, Mark } from "../components/ui";
import { GradDef, Shape } from "../components/Shape";
import type { GradName, ShapeKind } from "../components/Shape";

const outputs: { platform: string; y: number; shape: ShapeKind; grad: GradName; code: ReactNode }[] = [
  {
    platform: "Web · CSS",
    y: 0,
    shape: "circle",
    grad: "ui",
    code: (
      <>
        <span className="c">/* tokens.css */</span>
        {"\n--color-brand-primary: "}
        <span className="o">#ff8709</span>;
        {"\n--space-md: "}
        <span className="s">32px</span>;
      </>
    ),
  },
  {
    platform: "Android · XML",
    y: 200,
    shape: "squircle",
    grad: "core",
    code: (
      <>
        {"<"}
        <span className="k">color</span>
        {' name="brand_primary">'}
        <span className="o">#FFFF8709</span>
        {"</"}
        <span className="k">color</span>
        {">\n<"}
        <span className="k">dimen</span>
        {' name="space_md">'}
        <span className="s">32dp</span>
        {"</"}
        <span className="k">dimen</span>
        {">"}
      </>
    ),
  },
  {
    platform: "iOS · Swift",
    y: 400,
    shape: "flower",
    grad: "text",
    code: (
      <>
        <span className="k">static let</span>
        {" brandPrimary = "}
        <span className="o">Color(hex: 0xFF8709)</span>
        {"\n"}
        <span className="k">static let</span>
        {" spaceMd: "}
        <span className="k">CGFloat</span>
        {" = "}
        <span className="s">32</span>
      </>
    ),
  },
];

const wire = (y: number) => `M 910 270 C 990 270, 990 ${y + 76}, 1070 ${y + 76}`;

export default function S08Tokens() {
  const root = useScene((tl) => {
    gsap.set(".particle", { autoAlpha: 0 });

    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".title", 0.2);
    reveal(tl, ".title2", 0.45);
    rise(tl, ".source", 0.8, { x: -60, y: 0 });
    tl.from(".source .tok", { backgroundColor: cssVar("--color-highlight"), duration: 1.2, stagger: 0.2 }, 1.3);
    pop(tl, ".kinds .chip", 1.2, { stagger: 0.08 });

    drawIn(tl, ".w0", 1.8, { duration: 0.6 });
    pop(tl, ".build", 2.1);
    drawIn(tl, ".wire", 2.5, { duration: 0.8, stagger: 0.12 });
    rise(tl, ".out", 2.8, { x: 70, y: 0, stagger: 0.15 });
    pop(tl, ".out .shape", 3.0, { stagger: 0.15 });
    tl.to(".particle", { autoAlpha: 1, duration: 0.4 }, 3.4);
    reveal(tl, ".punch", 3.6);
    pop(tl, ".punch .mark", 4.1, { stagger: 0.12 });

    // token packets flowing source -> build -> platforms, squashing at speed
    gsap.utils.toArray<SVGCircleElement>(".particle").forEach((p, i) => {
      const path = `.wire-${i % 3}`;
      // start each packet part-way along its wire instead of delaying it,
      // so none sits at the SVG origin while waiting
      gsap
        .to(p, {
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
          duration: 1.8,
          ease: "power2.inOut",
          repeat: -1,
        })
        .progress((i * 0.37) % 1);
    });
    spin(".build-ring", 6);
    float(".out-inner", 3, 0.8);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>04 · Anatomia de um Design System</Eyebrow>
      <div className="row" style={{ marginTop: 34, gap: 30, alignItems: "baseline" }}>
        <h2 className="h1 title">Design tokens</h2>
        <p className="statement soft title2" style={{ fontSize: 50 }}>decisões de design como dados</p>
      </div>

      <div style={{ position: "relative", width: 1680, height: 560, marginTop: 50 }}>
        <svg className="abs" width={1680} height={560} style={{ left: 0, top: 0, overflow: "visible" }}>
          <GradDef name="summer" id="wire-g" w={1680} h={560} />
          <path className="w0" d="M 560 270 H 710" stroke="url(#wire-g)" strokeWidth={4} fill="none" />
          {outputs.map((o, i) => (
            <path key={i} className={`wire wire-${i}`} d={wire(o.y)} stroke="url(#wire-g)" strokeWidth={4} fill="none" />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <circle key={i} className="particle" r={8} fill={["var(--color-orangey)", "var(--color-shockingly-green)", "var(--color-pink)"][i % 3]} />
          ))}
        </svg>

        <div className="source code abs" style={{ left: 0, top: 150, width: 560, fontSize: 21 }}>
          <span className="c">// tokens.json · fonte da verdade</span>
          {"\n{\n  "}
          <span className="tok">
            "color.brand.primary": <span className="o">"#ff8709"</span>
          </span>
          {",\n  "}
          <span className="tok">
            "space.md": <span className="s">"32px"</span>
          </span>
          {",\n  "}
          <span className="tok">
            "font.size.body": <span className="s">"16px"</span>
          </span>
          {"\n}"}
        </div>

        <div className="kinds row abs" style={{ left: 0, top: 440, gap: 12 }}>
          <span className="chip">cores</span>
          <span className="chip">tipografia</span>
          <span className="chip">espaçamentos</span>
          <span className="chip">raios</span>
        </div>

        <div className="build abs center" style={{ left: 710, top: 170, width: 200, height: 200 }}>
          <div className="build-ring abs" style={{ inset: 0 }}>
            <Shape kind="ring" grad="summer" size={200} />
          </div>
          <span className="label" style={{ fontSize: 24, position: "relative" }}>build</span>
        </div>

        {outputs.map((o) => (
          <div key={o.platform} className="out abs" style={{ left: 1070, top: o.y, width: 610 }}>
            <div className="out-inner">
              <div className="row" style={{ gap: 12, marginBottom: 10 }}>
                <Shape kind={o.shape} grad={o.grad} size={26} />
                <span className="label soft" style={{ fontSize: 19 }}>{o.platform}</span>
              </div>
              <div className="code" style={{ fontSize: 18, padding: "14px 20px" }}>
                {o.code}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="punch statement" style={{ marginTop: 20, fontSize: 52 }}>
        Muda <Mark color="orange" tilt={-3}>um</Mark> token → muda em <Mark color="green" tilt={2}>todas</Mark> as plataformas.
      </p>
    </div>
  );
}
