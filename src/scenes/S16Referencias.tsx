import { useScene } from "../engine/useScene";
import { Eyebrow } from "../components/ui";

/*
 * References, gathered in one static slide (no animation): the other scenes
 * cite only inline, so their layout stays free for the content.
 */

type Ref = { who: string; title: string; where: string };

const groups: { name: string; dot: string; refs: Ref[] }[] = [
  {
    name: "Reuso de software",
    dot: "var(--gradient-orange-crush)",
    refs: [
      { who: "KRUEGER, C. W.", title: "Software reuse.", where: "ACM Computing Surveys, v. 24, n. 2, p. 131–183, 1992." },
      {
        who: "POHL, K.; BÖCKLE, G.; VAN DER LINDEN, F.",
        title: "Software Product Line Engineering.",
        where: "Springer, 2005.",
      },
    ],
  },
  {
    name: "Design System",
    dot: "var(--gradient-macha)",
    refs: [
      { who: "FROST, B.", title: "Atomic Design.", where: "Brad Frost, 2016. atomicdesign.bradfrost.com" },
      { who: "GOOGLE.", title: "Material Design.", where: "m3.material.io" },
      { who: "W3C DESIGN TOKENS COMMUNITY GROUP.", title: "Design Tokens Format Module.", where: "designtokens.org" },
      { who: "STORYBOOK.", title: "Documentação.", where: "storybook.js.org" },
    ],
  },
  {
    name: "GenAI",
    dot: "var(--gradient-purple-haze)",
    refs: [
      { who: "ANTHROPIC.", title: "Model Context Protocol.", where: "modelcontextprotocol.io" },
      { who: "HOWARD, J.", title: "The /llms.txt file.", where: "llmstxt.org, 2024." },
      { who: "AGENTS.md.", title: "Formato aberto de instruções para agentes.", where: "agents.md" },
      { who: "GOOGLE.", title: "A2UI: Agent-to-User Interface.", where: "2025." },
      { who: "MODEL CONTEXT PROTOCOL.", title: "MCP Apps.", where: "2025." },
    ],
  },
];

export default function S16Referencias() {
  const root = useScene(() => {});

  return (
    <div className="scene" ref={root}>
      <Eyebrow>10 · Referências</Eyebrow>
      <h2 className="h1 title" style={{ marginTop: 34 }}>
        Referências
      </h2>

      <div className="row" style={{ marginTop: 56, gap: 60, alignItems: "flex-start" }}>
        {groups.map((g) => (
          <div key={g.name} className="col" style={{ width: 520, gap: 26 }}>
            <div className="row" style={{ gap: 14 }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: g.dot, flexShrink: 0 }} />
              <span className="h3" style={{ fontSize: 34, fontWeight: 600 }}>{g.name}</span>
            </div>
            {g.refs.map((r) => (
              <p key={r.who + r.title} style={{ fontSize: 24, lineHeight: 1.35 }}>
                <span className="soft">{r.who} </span>
                <strong>{r.title}</strong> <span className="soft">{r.where}</span>
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
