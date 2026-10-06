---
name: revisar
description: Revisão visual da apresentação — tira prints de cada passo das cenas, roda as verificações automáticas e lista problemas de layout, legibilidade e consistência com o design system. Use antes de um ensaio, de abrir PR ou quando pedirem "revisa os slides".
argument-hint: "[cenas: 6 | 3-5 | 3,6,9 | all]"
---

Cenas a revisar: $ARGUMENTS (se vazio, todas)

1. Rode `npm run typecheck`, `node scripts/check-ds.mjs` e `node scripts/check-layout.mjs <cenas>`. Anote as falhas.
2. Rode `node scripts/snap.mjs <cenas>`.
3. Para economizar contexto, monte folhas de contato 2×2 com ffmpeg (4 prints por imagem, 960×540 cada) em `out/snaps/` e abra as folhas com Read. Abra um print individual só quando precisar de detalhe.
4. Para cada cena, avalie:
   - nada vaza, corta ou sobrepõe; rodapé livre;
   - hierarquia clara (um foco por momento), no máximo 1–2 `Mark` por slide;
   - estilo gsap.com: fundo preto, figuras com gradiente, tipografia grande, sem sombras;
   - texto em português, sem erro de digitação; iFood só a partir da cena 10;
   - `[DADO: …]` ainda pendentes (liste-os).
5. Entregue uma lista por cena: `cena N — problema — sugestão`, do mais grave para o menos grave. **Não corrija nada** sem a pessoa pedir; ofereça usar `/cena` para cada item.
