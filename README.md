# Design System como Estratégia de Reuso

Apresentação do seminário de **Reuso de Software**: 15 cenas em motion graphics (React + GSAP), palco fixo 1920×1080, roteiro em [`roteiro-seminario-design-system.md`](roteiro-seminario-design-system.md).

**Ao vivo:** https://gabriel-fachini.github.io/reuso-software/ — atualizada automaticamente a cada commit na `main` (`.github/workflows/deploy.yml`).

## Design system

Baseado no próprio gsap.com: paleta, os 7 gradientes nomeados (*macha*, *orange-crush*, *lipstick*, *purple-haze*, *skyfall*, *emerald-city*, *summer-fair*) e os easings foram extraídos das variáveis CSS do site (`src/styles/tokens.css`). Componentes: rótulos `{ entre chaves }`, palavras em blocos coloridos inclinados (`Mark`), botões em pílula com seta, granulado. As figuras com gradiente (`src/components/Shape.tsx`) são desenhos próprios usando os gradientes do site.

As animações seguem os 12 princípios da Disney (ver comentário no topo de `src/engine/anim.ts`): squash & stretch nos pops e quedas, antecipação nas saídas, arcos nas entradas, follow-through/overlap nos staggers, ações secundárias em loop.

## Começar (para quem vai editar)

```bash
git clone <url-do-repo> && cd reuso-software
```

```bash
npm install && npx playwright install chromium
```

Depois abra o Claude Code na pasta e peça o que quer mudar. As regras do projeto estão em [`CLAUDE.md`](CLAUDE.md) e o Claude já as segue. Atalhos:

| Comando | Para quê |
| --- | --- |
| `/cena 11 troca o título e deixa o diagrama entrar mais devagar` | edita uma cena e confere o resultado com prints |
| `/revisar 10-13` | revisão visual + verificações, sem mudar nada |
| `/video` | gera o MP4 de prévia |
| `/dados-ifood` | preenche os `[DADO: …]` do case iFood |

Proteções automáticas (em `.claude/settings.json`): depois de cada edição em `src/`, o Claude roda o typecheck e o lint de design system (`scripts/check-ds.mjs`); arquivos compartilhados (motor, tokens, componentes, ordem das cenas) pedem confirmação antes de mudar; o roteiro original e o `push --force` são bloqueados.

## Rodar

```bash
npm install
```

```bash
npm run dev
```

Abre em `http://localhost:5173`. Cada cena tem a própria URL (`#1` … `#15`).

## Controles

| Tecla | Ação |
| --- | --- |
| `→` `espaço` `Enter` clique | próximo passo / próxima cena |
| `←` clique direito | cena anterior (já no estado final) |
| `F` | tela cheia |
| `Home` / `End` | primeira / última cena |

Se uma animação ainda está rodando, avançar pula para o fim do passo atual em vez de trocar de cena.

As cenas 1–9 e 11 rodam inteiras com um único avanço. As cenas 10, 12, 13, 14 e 15 têm passos (um clique por momento).

## Exportar vídeo

```bash
npm run export:mp4
```

Gera `out/apresentacao.mp4` (1080p, 30 fps) reproduzindo a apresentação em modo automático (`?autoplay`). O tempo de cada passo no vídeo é o campo `hold` em `src/scenes/index.ts`.

## Estrutura

```
src/
  engine/       Deck (navegação, autoplay), useScene, helpers de animação
  scenes/       S01…S15, uma cena por arquivo + index.ts (ordem e tempos)
  components/   peças compartilhadas (Eyebrow, Dado, Chaos, Arrow)
  styles/       tokens.css (do design.md) e global.css
scripts/
  export-mp4.mjs    grava o MP4
  snap.mjs          tira print de cada passo das cenas (revisão visual)
  check-ds.mjs      lint de design system (cores/fontes cruas, regras de cena)
  check-layout.mjs  detecta elementos vazando do palco ou do card
.claude/
  settings.json     permissões + hook pós-edição
  skills/           /cena, /revisar, /video, /dados-ifood
```

Antes de commitar: `npm run check` (typecheck + design system + layout). `scripts/check-layout.mjs` renderiza cada passo de cada cena e acusa qualquer elemento que vaze do palco, do card ou invada o rodapé.

Para editar uma cena: abra `src/scenes/SNN*.tsx`. A animação fica no `useScene((tl) => …)`; cada `step(tl)` é um clique do apresentador.

## Pendências do grupo

- **Dados do case iFood** (cenas 10 e 11): procurar por `<Dado>` e substituir pelos números reais (sem informação confidencial).
- **PIN e QR code do Kahoot** (cena 15): substituir `[PIN do jogo]` e o QR de placeholder (`QrPlaceholder` em `S15Fechamento.tsx`) pelo QR real do jogo.
- **Fonte Mori**: é comercial. Se estiver instalada no computador da apresentação, é usada automaticamente; senão a apresentação usa Inter Tight.

Os logos do iFood (cena 10, `public/ifood-logo.svg`) e do Kahoot (cena 15, `public/kahoot-logo.svg`) vêm do Wikimedia Commons (domínio público; marcas registradas dos donos).
