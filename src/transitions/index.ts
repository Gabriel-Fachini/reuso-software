import type { Transition } from "../engine/transition";
import { capaCaos } from "./capaCaos";
import { caosDefinicao } from "./caosDefinicao";
import { definicaoOQueReusa } from "./definicaoOQueReusa";
import { oQueReusaCaixas } from "./oQueReusaCaixas";
import { caixasAtomic } from "./caixasAtomic";
import { atomicLinhas } from "./atomicLinhas";
import { linhasTokens } from "./linhasTokens";
import { tokensAnatomia } from "./tokensAnatomia";
import { anatomiaIfood } from "./anatomiaIfood";
import { ifoodSolucao } from "./ifoodSolucao";
import { solucaoGenai } from "./solucaoGenai";
import { genaiPratica } from "./genaiPratica";
import { praticaDemo } from "./praticaDemo";
import { demoFechamento } from "./demoFechamento";

// Custom transitions, keyed "<from id>><to id>" (ids from src/scenes/index.ts).
// Only used when moving forward; any pair not listed uses the deck's default.
// Each transition carries its own state type from out() to in().
export const transitions: Record<string, Transition<any>> = {
  "capa>caos": capaCaos,
  "caos>definicao": caosDefinicao,
  "definicao>o-que-reusa": definicaoOQueReusa,
  "o-que-reusa>caixas": oQueReusaCaixas,
  "caixas>atomic": caixasAtomic,
  "atomic>linhas-custo": atomicLinhas,
  "linhas-custo>tokens": linhasTokens,
  "tokens>anatomia": tokensAnatomia,
  "anatomia>ifood-problema": anatomiaIfood,
  "ifood-problema>ifood-solucao": ifoodSolucao,
  "ifood-solucao>genai": solucaoGenai,
  "genai>genai-pratica": genaiPratica,
  "genai-pratica>demo": praticaDemo,
  "demo>fechamento": demoFechamento,
};
