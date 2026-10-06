---
name: cena
description: Edita uma cena da apresentação a partir de um pedido em linguagem natural, respeitando o design system, as regras de animação e o mapa de cenas do CLAUDE.md, e valida visualmente com prints. Use quando alguém pedir para mudar texto, layout, animação ou conteúdo de um slide/cena.
when_to_use: "muda a cena 11", "no meu slide…", "deixa a animação da cena 6 mais suave", "troca o texto do título da cena 3"
argument-hint: "<número da cena> <o que mudar>"
---

Pedido: $ARGUMENTS

Siga este roteiro:

1. **Localize a cena.** Use o mapa do `CLAUDE.md`. Se o número não estiver claro, pergunte. Leia o arquivo da cena inteiro e confira em `src/scenes/index.ts` se ela é de fluxo (`flow: true`) ou tem passos.

2. **Antes de editar**, diga em uma ou duas frases o que vai mudar. Se o pedido for ambíguo (por exemplo "deixa mais bonito"), proponha 1–2 direções concretas e pergunte.

3. **Edite só a cena pedida.** Se precisar de algo em arquivo compartilhado (`src/engine`, `src/styles`, `src/components`, `src/scenes/index.ts`), explique o porquê e peça confirmação primeiro.
   - Cores, gradientes e fontes: só tokens (`var(--…)`, `cssVar()`).
   - Figuras: `<Shape>` / `<Deco>`; destaque: `<Mark>`; rótulo: `<Eyebrow>`.
   - Animação: helpers de `src/engine/anim.ts`; loops só em elementos internos; `immediateRender: false` em `fromTo` dentro de loops.
   - Cena de fluxo: sem `step()`. Cena com passos: mantenha o número de cliques, a menos que o pedido seja mudar isso.

4. **Valide.**
   - O hook já roda `tsc` e `check-ds` a cada edição; corrija o que ele apontar.
   - `node scripts/check-layout.mjs <n>` — nada pode vazar do palco, do card ou invadir o rodapé.
   - `node scripts/snap.mjs <n>` e **abra cada imagem** de `out/snaps/sNN-*.png` com Read. Procure: texto sobreposto, elementos cortados, desalinhamento, contraste ruim, espaço vazio estranho. Corrija e repita até ficar bom.

5. **Responda** com: o que mudou (bullets curtos), os caminhos dos prints finais e qualquer decisão que a pessoa precise revisar.
