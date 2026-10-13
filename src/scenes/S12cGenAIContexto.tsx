import { SplitText } from "../engine/gsap";
import { useScene } from "../engine/useScene";
import { drift, drop, pop, reveal, rise } from "../engine/anim";
import { Eyebrow, Mark } from "../components/ui";
import { Shape } from "../components/Shape";
import { AgentChip } from "./S12bGenAIReuso";

/*
 * How an agent reads a design system, as a staircase from docs written for
 * people to an MCP server that answers the agent's questions.
 * One flow: the stairs build and the agent climbs them, a conversation with
 * the DS's MCP server plays, then the punchline (the DS needs an API for machines).
 */

const ROW_W = 640;
const ROW_H = 106;
const rowX = (i: number) => 200 + i * 60;
const rowY = (i: number) => 704 - i * 122;
const TOKEN = 56;

// bottom → top
const levels = [
  { name: "Site de documentação", desc: "feito para pessoas: o agente lê mal", ex: ["páginas", "exemplos visuais"] },
  { name: "AGENTS.md", desc: "regras do projeto sempre no contexto", ex: ["AGENTS.md", "CLAUDE.md"] },
  { name: "llms.txt", desc: "índice da documentação em Markdown", ex: ["Cloudscape · AWS", "Nord", "CMS.gov"] },
  { name: "Servidor MCP", desc: "o agente pergunta, o DS responde", ex: ["Primer", "Polaris", "Storybook", "Figma"] },
];

const components = ["Button", "Card", "Input", "Avatar", "Rating", "Badge"];

export default function S12cGenAIContexto() {
  const root = useScene((tl) => {
    // A — the stairs build from the bottom; the agent hops up each one
    rise(tl, ".eyebrow", 0.1);
    reveal(tl, ".title", 0.2);
    pop(tl, ".climber-in", 0.5);
    levels.forEach((_, i) => {
      const t = 0.6 + i * 0.55;
      drop(tl, `.st-${i}`, t);
      if (i === 0) return;
      // crouch, jump on an arc, land with a squash
      const hop = t + 0.45;
      tl.to(".climber", { scaleX: 1.15, scaleY: 0.8, transformOrigin: "50% 100%", duration: 0.12, ease: "power2.out" }, hop);
      tl.to(".climber", { x: i * 60, duration: 0.42, ease: "power1.inOut" }, hop + 0.12);
      tl.to(".climber", { keyframes: [{ y: -i * 122 + 122 - 60, duration: 0.21, ease: "power2.out" }, { y: -i * 122, duration: 0.21, ease: "power2.in" }] }, hop + 0.12);
      tl.to(".climber", { scaleX: 0.9, scaleY: 1.12, duration: 0.2, ease: "power2.out" }, hop + 0.12);
      tl.to(".climber", { keyframes: [{ scaleX: 1.18, scaleY: 0.82, duration: 0.08 }, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.45)" }] }, hop + 0.54);
    });
    rise(tl, ".st .ex", 1.2, { y: 14, stagger: 0.05, duration: 0.8 });
    rise(tl, ".axis", 2.6);
    pop(tl, ".st-3 .ring", 2.9);

    // B — a conversation with the DS's MCP server, as the agent reaches the top
    tl.from(".mcp", { autoAlpha: 0, x: 80, duration: 1, ease: "expo.out" }, 2.9);
    pop(tl, ".mcp .icon", "-=0.7");
    const typing = (sel: string, at: string) => {
      const split = SplitText.create(sel, { type: "chars" });
      tl.from(split.chars, { autoAlpha: 0, duration: 0.01, stagger: 0.022, ease: "none" }, at);
    };
    typing(".q1 .call", "-=0.3");
    pop(tl, ".r1 .chip", "+=0.1", { stagger: 0.05 });
    typing(".q2 .call", "+=0.1");
    rise(tl, ".r2", "+=0.1", { y: 20, duration: 0.8 });
    typing(".q3 .call", "+=0.2");
    rise(tl, ".r3", "+=0.1", { y: 20, duration: 0.8 });
    pop(tl, ".ok", "-=0.3");

    // C — the punchline
    reveal(tl, ".punch");
    pop(tl, ".punch .mark", "-=0.6");

    drift(".climber-bob", 4, 3);
  });

  return (
    <div className="scene" ref={root}>
      <Eyebrow>06 · Design System na era da GenAI</Eyebrow>
      <h2 className="h1 title" style={{ marginTop: 34, fontSize: 96 }}>
        Como o agente lê o seu DS?
      </h2>

      <span className="axis abs mono muted" style={{ left: rowX(3), top: rowY(3) - 38, fontSize: 16, letterSpacing: "0.04em" }}>
        ↑ MAIS LEGÍVEL POR MÁQUINA
      </span>

      {levels.map((l, i) => (
        <div key={l.name} className={`st st-${i} abs`} style={{ left: rowX(i), top: rowY(i), width: ROW_W, height: ROW_H }}>
          {i === 3 && (
            <div className="ring abs" style={{ inset: -6, borderRadius: 28, border: "3px solid var(--color-shockingly-green)" }} />
          )}
          <div className="card row" style={{ position: "relative", width: ROW_W, height: ROW_H, padding: "0 26px", gap: 20, borderRadius: 22 }}>
            <span className="mono muted" style={{ fontSize: 18, width: 22 }}>{i + 1}</span>
            <div className="col" style={{ width: 350, gap: 4, flexShrink: 0 }}>
              <span className="h3" style={{ fontSize: 28, fontWeight: 600 }}>{l.name}</span>
              <span className="soft" style={{ fontSize: 18, whiteSpace: "nowrap" }}>{l.desc}</span>
            </div>
            <div className="row" style={{ flex: 1, flexWrap: "wrap", gap: 6, justifyContent: "flex-end" }}>
              {l.ex.map((e) => (
                <span key={e} className="ex chip mono" style={{ fontSize: 14, padding: "4px 10px" }}>{e}</span>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="climber abs" style={{ left: rowX(0) - TOKEN - 18, top: rowY(0) + (ROW_H - TOKEN) / 2 }}>
        <div className="climber-in">
          <div className="climber-bob">
            <AgentChip size={TOKEN} />
          </div>
        </div>
      </div>

      {/* the MCP server, framed like the harness of scene 13 */}
      <div className="mcp abs" style={{ left: 1080, top: 330, width: 720, height: 405, padding: 3, borderRadius: 26, background: "var(--gradient-macha)" }}>
        <div className="col" style={{ height: "100%", borderRadius: 23, background: "var(--color-bg)", padding: "22px 26px", gap: 12 }}>
          <div className="row" style={{ gap: 14 }}>
            <div className="icon">
              <Shape kind="ring" grad="ui" size={34} />
            </div>
            <span className="h3" style={{ fontSize: 26, fontWeight: 600 }}>Servidor MCP do DS</span>
            <span className="mono muted" style={{ fontSize: 16, marginLeft: "auto" }}>@acme/ui-mcp</span>
          </div>

          <div className="q1 row mono" style={{ gap: 10, fontSize: 18 }}>
            <AgentChip size={26} />
            <span className="call lilac">list_components()</span>
          </div>
          <div className="r1 row" style={{ gap: 6, paddingLeft: 36, flexWrap: "wrap" }}>
            {components.map((c) => (
              <span key={c} className="chip mono" style={{ fontSize: 14, padding: "3px 10px" }}>{c}</span>
            ))}
            <span className="chip mono muted" style={{ fontSize: 14, padding: "3px 10px" }}>+38</span>
          </div>

          <div className="q2 row mono" style={{ gap: 10, fontSize: 18 }}>
            <AgentChip size={26} />
            <span className="call lilac">get_component("Button")</span>
          </div>
          <div className="r2 code" style={{ fontSize: 16, padding: "10px 16px", marginLeft: 36, lineHeight: 1.5 }}>
            <div><span className="k">variant</span>: <span className="s">"primary"</span> | <span className="s">"secondary"</span> | <span className="s">"ghost"</span></div>
            <div><span className="k">size</span>: <span className="s">"sm"</span> | <span className="s">"md"</span> | <span className="s">"lg"</span></div>
            <div className="c">// uso: ação principal, uma por tela</div>
          </div>

          <div className="q3 row mono" style={{ gap: 10, fontSize: 18 }}>
            <AgentChip size={26} />
            <span className="call lilac">escreve o código</span>
          </div>
          <div className="r3 row" style={{ gap: 12, marginLeft: 36 }}>
            <div className="code" style={{ fontSize: 16, padding: "8px 16px" }}>
              {"<"}<span className="k">Button</span> variant=<span className="s">"primary"</span>{">"}Pedir{"</"}<span className="k">Button</span>{">"}
            </div>
            <span className="ok chip" style={{ fontSize: 15, padding: "6px 12px", borderColor: "var(--color-shockingly-green)", color: "var(--color-green-deep)" }}>
              ✓ só peças que existem
            </span>
          </div>
        </div>
      </div>

      <p className="punch abs body-lg" style={{ left: 120, top: 876, width: 1680, textAlign: "center" }}>
        Doc boa para pessoas não basta: o DS precisa de uma <Mark color="green" tilt={-1}>API para máquinas.</Mark>
      </p>
    </div>
  );
}
