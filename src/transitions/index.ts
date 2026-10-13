import type { Transition } from "../engine/transition";
import { capaCaos } from "./capaCaos";
import { caosDefinicao } from "./caosDefinicao";
import { definicaoDsVsSd } from "./definicaoDsVsSd";
import { dsVsSdOQueReusa } from "./dsVsSdOQueReusa";
import { oQueReusaCaixas } from "./oQueReusaCaixas";
import { caixasAtomic } from "./caixasAtomic";
import { atomicLinhas } from "./atomicLinhas";
import { linhasTokens } from "./linhasTokens";
import { tokensAnatomia } from "./tokensAnatomia";
import { anatomiaIfood } from "./anatomiaIfood";
import { ifoodSolucao } from "./ifoodSolucao";
import { solucaoGenai } from "./solucaoGenai";
import { genaiReuso } from "./genaiReuso";
import { reusoContexto } from "./reusoContexto";
import { contextoPratica } from "./contextoPratica";
import { praticaDemo } from "./praticaDemo";
import { demoFechamento } from "./demoFechamento";
import { desafiosConclusao } from "./desafiosConclusao";

// Custom transitions, keyed "<from id>><to id>" (ids from src/scenes/index.ts).
// Only used when moving forward; any pair not listed uses the deck's default.
// Each transition carries its own state type from out() to in().
export const transitions: Record<string, Transition<any>> = {
  "capa>caos": capaCaos,
  "caos>definicao": caosDefinicao,
  "definicao>ds-vs-sd": definicaoDsVsSd,
  "ds-vs-sd>o-que-reusa": dsVsSdOQueReusa,
  "o-que-reusa>caixas": oQueReusaCaixas,
  "caixas>atomic": caixasAtomic,
  "atomic>linhas-custo": atomicLinhas,
  "linhas-custo>tokens": linhasTokens,
  "tokens>anatomia": tokensAnatomia,
  "anatomia>ifood-problema": anatomiaIfood,
  "ifood-problema>ifood-solucao": ifoodSolucao,
  "ifood-solucao>genai": solucaoGenai,
  "genai>genai-reuso": genaiReuso,
  "genai-reuso>genai-contexto": reusoContexto,
  "genai-contexto>genai-pratica": contextoPratica,
  "genai-pratica>demo": praticaDemo,
  "demo>desafios": demoFechamento,
  "desafios>conclusao": desafiosConclusao,
};
