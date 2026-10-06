# Seminário: Design System como Estratégia de Reuso

Apresentação em motion graphics (React + Vite + GSAP) para a disciplina de Reuso de Software. Palco fixo de 1920×1080, 15 cenas, identidade visual do gsap.com. Roteiro original: `roteiro-seminario-design-system.md` (não editar).

Várias pessoas do grupo editam este projeto pedindo mudanças em linguagem natural ("na cena 11, troca X"). Seu trabalho é transformar o pedido em código que respeite as regras abaixo, **sem afetar as cenas dos outros**, e mostrar o resultado visual antes de terminar.

Responda sempre em **português**.

## Rodar

```bash
npm run dev          # http://localhost:5173  (#N abre a cena N)
npm run check        # typecheck + design system + layout (use antes de commitar)
npm run snap 6       # prints de cada passo da cena 6 em out/snaps/
npm run export:mp4   # vídeo de prévia em out/apresentacao.mp4
```

## Mapa das cenas

| # | id | Bloco | Arquivo | Modo | Responsável |
|---|----|-------|---------|------|-------------|
| 1 | capa | — | `src/scenes/S01Capa.tsx` | fluxo | a definir |
| 2 | caos | 01 Abertura | `S02Caos.tsx` | fluxo | a definir |
| 3 | definicao | 02 O que é um DS | `S03Definicao.tsx` | fluxo | a definir |
| 4 | o-que-reusa | 03 DS e Reuso | `S04OQueReusa.tsx` | fluxo | a definir |
| 5 | caixas | 03 DS e Reuso | `S05Caixas.tsx` | fluxo | a definir |
| 6 | atomic | 03 DS e Reuso | `S06Atomic.tsx` | fluxo | a definir |
| 7 | linhas-custo | 03 DS e Reuso | `S07LinhasCusto.tsx` | fluxo | a definir |
| 8 | tokens | 04 Anatomia | `S08Tokens.tsx` | fluxo | a definir |
| 9 | anatomia | 04 Anatomia | `S09Anatomia.tsx` | fluxo | a definir |
| 10 | ifood-problema | 05 Case iFood | `S10IfoodProblema.tsx` | 3 passos | @prato |
| 11 | ifood-solucao | 05 Case iFood | `S11IfoodSolucao.tsx` | fluxo | @prato |
| 12 | genai | 06 GenAI | `S12GenAI.tsx` | 3 passos | Gabriel |
| 13 | genai-pratica | 06 GenAI | `S13GenAIPratica.tsx` | 4 passos | Gabriel |
| 14 | demo | 07 Demonstração | `S14Demo.tsx` (+ `demo.css`) | 5 passos | a definir |
| 15 | fechamento | 08 Desafios + 09 Conclusão | `S15Fechamento.tsx` | 3 passos | a definir |

- **Fluxo** = a animação inteira roda com um único avanço (`flow: true` em `src/scenes/index.ts`). Não use `step()` nessas cenas.
- **Passos** = cada `step(tl)` é um clique do apresentador.
- Quando alguém disser "minha cena" e não der o número, pergunte qual é (ou use a coluna Responsável).

## Como atender um pedido

1. Identifique a(s) cena(s) pelo mapa. Leia o arquivo inteiro antes de mexer.
2. Mude **só** os arquivos daquela cena. Se a mudança exigir mexer em arquivo compartilhado (lista abaixo), explique o porquê e peça confirmação.
3. Siga as regras de design system e animação abaixo.
4. Verifique: `npm run snap <n>` e **olhe as imagens** com Read; rode `node scripts/check-layout.mjs <n>`. Corrija o que vazar, sobrepor ou ficar ilegível.
5. Responda com um resumo curto do que mudou e o caminho do print final.

O hook pós-edição já roda `tsc` e `check-ds` automaticamente a cada arquivo alterado em `src/`; se ele reclamar, corrija.

## Design system (gsap.com)

Tudo vem de `src/styles/tokens.css`. **Nunca** escreva cor, gradiente ou fonte literal em cena: use os tokens. Para tweens de cor no GSAP, use `cssVar("--color-…")` de `src/engine/tokens.ts`.

- **Cores:** `--color-just-black` (fundo), `--color-surface-white` (texto), `--color-surface75/50/25` (texto suave / muted / bordas), `--color-off-black` (cards), acentos `--color-shockingly-green`, `--color-orangey`, `--color-pink`, `--color-shockingly-pink`, `--color-lilac`, `--color-blue`.
- **Gradientes:** `--gradient-macha`, `-orange-crush`, `-lipstick`, `-purple-haze`, `-skyfall`, `-emerald-city`, `-summer-fair`, `-text`, `-scroll`, e os radiais de volume `-core`, `-tangerine`, `-ui`.
- **Tipografia:** classes `.hero`, `.display`, `.h1` (peso 600, linhas coladas), `.statement` (peso 400), `.h2`, `.h3`, `.body-lg`, `.body`, `.label`; cores `.soft`, `.muted`; texto em gradiente `.gt .gt-macha` etc.
- **Componentes** (`src/components/`):
  - `<Eyebrow>` — rótulo `{ entre chaves }` no topo de toda cena (`{NN · Nome do bloco}`).
  - `<Mark color tilt>` — palavra-chave em bloco colorido inclinado. Use 1–2 por slide, não mais.
  - `<Shape kind grad size>` / `<Deco x y …>` — figuras com gradiente. `kind`: circle, dome, flower, pinwheel, ring, squircle, diamond, star, arch, hourglass, pill, squiggle, arc. `grad`: macha, orange, lipstick, purple, skyfall, emerald, summer, scroll, core, tangerine, ui, text, ink.
  - `<ArrowDot>` dentro de `.btn` (pílula com seta); `.btn.fill` (gradiente + granulado); `.chip`; `.card`; `.code` (com `.k .s .o .c` para sintaxe); `<Dado>` para dados pendentes.
- **Layout:** margem lateral 120px; conteúdo útil entre y=92 e y≈1000 (o rodapé/HUD fica abaixo). Dê medidas explícitas a tudo que fica dentro de card. Visual chapado: sem sombras nem blur.
- A capa (cena 1) mistura elementos de UI do DS (botões, chips, swatches, card, toggle, "Aa") com algumas formas com gradiente — esse é o estilo aprovado.

## Animação (12 princípios da Disney)

Use os helpers de `src/engine/anim.ts`; não escreva entradas com `gsap.from/to` cru se um helper resolve.

- Entradas: `reveal` (títulos, palavra a palavra), `revealChars` (hero), `rise` (blocos), `pop` (squash & stretch), `drop` (gravidade), `arcIn` (entra em arco), `drawIn` (linhas SVG).
- Saídas dentro da cena: `exit` (antecipação + saída). Pausas de leitura em cenas de fluxo: `beat(tl, s)`.
- Loops (ação secundária): `float`, `spin`, `breathe` — sempre em um elemento **interno** (`.deco-inner`, `*-inner`, `.shape`), nunca no mesmo elemento animado pela entrada (os transforms brigam).
- Use posições absolutas no timeline (`rise(tl, ".x", 1.2)`) para sobrepor ações; evite tudo em sequência rígida.
- Timelines em loop (`repeat: -1`) com `fromTo` precisam de `immediateRender: false`, senão o estado inicial é aplicado na hora e esconde/desloca elementos.
- Escreva a cena com `useScene((tl) => { … })` e componentes com `className` para os seletores (o escopo é a própria cena).

## Conteúdo

- Português do Brasil. Textos baseados no roteiro.
- **iFood só aparece a partir da cena 10** (a revelação é parte da narrativa). O `check-ds` bloqueia isso.
- Nada confidencial do iFood. Dado que o grupo ainda não passou vira `<Dado>descrição</Dado>`. Os nomes dos microfrontends na cena 11 são ilustrativos.
- Exemplos de código usam o pacote fictício `@acme/ui`.
- Máximo de 15 cenas. Nova cena ou mudança de ordem = mexer em `src/scenes/index.ts` (compartilhado → confirmar antes).

## Arquivos compartilhados (pedir confirmação antes de editar)

`src/engine/**` (motor, helpers), `src/styles/**` (tokens), `src/components/**` (Shape, Chaos, ui), `src/scenes/index.ts`, `scripts/**`, `.claude/**`, `package.json`. Uma mudança aqui afeta todas as cenas: depois dela rode `npm run check` completo.

## Definição de pronto

- `npm run check` passa (tsc + check-ds + check-layout).
- Você viu os prints da(s) cena(s) alterada(s) e nada vaza, sobrepõe ou fica ilegível.
- Cenas de fluxo continuam sem `step()`; cenas com passos continuam com o mesmo número de cliques, a menos que o pedido seja mudar isso.

## Git

- Uma branch por pessoa/cena: `cena/11-ifood`, `cena/12-genai`.
- Commits pequenos, mensagem em português no imperativo ("Ajusta diagrama da cena 11").
- Nunca `push --force` na `main`; mudanças entram por PR.
