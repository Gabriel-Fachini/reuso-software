import type { SceneDef } from "../engine/Deck";
import S01Capa from "./S01Capa";
import S02Caos from "./S02Caos";
import S03Definicao from "./S03Definicao";
import S04OQueReusa from "./S04OQueReusa";
import S05Caixas from "./S05Caixas";
import S06Atomic from "./S06Atomic";
import S07LinhasCusto from "./S07LinhasCusto";
import S08Tokens from "./S08Tokens";
import S09Anatomia from "./S09Anatomia";
import S10IfoodProblema from "./S10IfoodProblema";
import S11IfoodSolucao from "./S11IfoodSolucao";
import S12GenAI from "./S12GenAI";
import S13GenAIPratica from "./S13GenAIPratica";
import S14Demo from "./S14Demo";
import S15Fechamento from "./S15Fechamento";

// Order = presentation order. `flow: true` = plays in one go (no step()).
// `hold` only matters for autoplay / MP4 export (ms per step).
// Owners and the scene map live in CLAUDE.md.
export const scenes: SceneDef[] = [
  { id: "capa", block: "Design System como Estratégia de Reuso", Component: S01Capa, flow: true, hold: 3000 },
  { id: "caos", block: "01 · Abertura", Component: S02Caos, flow: true },
  { id: "definicao", block: "02 · O que é um Design System", Component: S03Definicao, flow: true },
  { id: "o-que-reusa", block: "03 · Design System e Reuso", Component: S04OQueReusa, flow: true },
  { id: "caixas", block: "03 · Design System e Reuso", Component: S05Caixas, flow: true, hold: 3200 },
  { id: "atomic", block: "03 · Design System e Reuso", Component: S06Atomic, flow: true },
  { id: "linhas-custo", block: "03 · Design System e Reuso", Component: S07LinhasCusto, flow: true, hold: 3200 },
  { id: "tokens", block: "04 · Anatomia", Component: S08Tokens, flow: true, hold: 3500 },
  { id: "anatomia", block: "04 · Anatomia", Component: S09Anatomia, flow: true, hold: 3500 },
  { id: "ifood-problema", block: "05 · Case iFood", Component: S10IfoodProblema },
  { id: "ifood-solucao", block: "05 · Case iFood", Component: S11IfoodSolucao, flow: true, hold: 3500 },
  { id: "genai", block: "06 · Design System na era da GenAI", Component: S12GenAI, hold: 3200 },
  { id: "genai-pratica", block: "06 · Design System na era da GenAI", Component: S13GenAIPratica, hold: 3200 },
  { id: "demo", block: "07 · Demonstração", Component: S14Demo, hold: 2400 },
  { id: "fechamento", block: "08 · Desafios · 09 · Conclusão", Component: S15Fechamento, hold: 3600 },
];
