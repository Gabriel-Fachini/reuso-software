---
name: dados-ifood
description: Preenche os dados pendentes do case iFood (marcadores [DADO: …] nas cenas 10 e 11) com os números que a pessoa informar, sem inventar nada. Use quando alguém trouxer números do case iFood ou pedir para "preencher os dados".
disable-model-invocation: true
---

1. Liste todos os `<Dado>` em `src/scenes/S10IfoodProblema.tsx` e `src/scenes/S11IfoodSolucao.tsx` (procure por `<Dado>`), mostrando a descrição de cada um e onde aparece.
2. Pergunte o valor de cada um. Lembre a pessoa: **nada confidencial**; números aproximados ("+40 times", "~120 componentes") são preferíveis a exatos.
3. Nunca invente nem estime um valor. O que a pessoa não souber continua como `<Dado>`.
4. Substitua cada `<Dado>` pelo texto final, com o mesmo tamanho visual (por exemplo, número grande em `.gt .gt-macha` nas métricas da cena 11).
5. Valide com `node scripts/check-layout.mjs 10,11` e `node scripts/snap.mjs 10,11`, olhe os prints e responda com o que foi preenchido e o que ainda falta.
