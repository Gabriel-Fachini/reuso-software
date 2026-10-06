// Design-system lint for the deck (the same idea the deck pitches in scene 13).
// Usage: node scripts/check-ds.mjs [arquivos...]   (sem argumentos: tudo)
//
// Rules
//  1. cor-crua      hex/rgb/hsl in a style context of scenes/components → use a token
//  2. fonte-crua    fontFamily without var(--font-*)
//  3. flow-step     a scene marked `flow: true` in scenes/index.ts uses step()
//  4. ifood-cedo    a scene before the iFood reveal mentions iFood
//
// Escape hatches (use sparingly, always with a reason):
//  - line:  `ds-allow: motivo` in a comment on the same line
//  - file:  `ds-allow-file: motivo` anywhere in the file
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SCAN_DIRS = ["src/scenes", "src/components"];

const files = process.argv.slice(2).length
  ? process.argv.slice(2).map((f) => resolve(f))
  : SCAN_DIRS.flatMap((d) => readdirSync(join(ROOT, d)).map((f) => join(ROOT, d, f)));

const inScope = (f) =>
  SCAN_DIRS.some((d) => f.startsWith(join(ROOT, d) + "/")) && /\.(tsx?|css)$/.test(f) && existsSync(f);

const COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;
const STYLE_CTX = /\b(background|backgroundColor|color|fill|stroke|stopColor|borderColor|border(Top|Bottom|Left|Right)?|outline|boxShadow)\s*[:=]|^\s*--[\w-]+\s*:/;

// scene registry: which components are flow scenes, and the order
const registry = readFileSync(join(ROOT, "src/scenes/index.ts"), "utf8");
const order = [...registry.matchAll(/\{\s*id:\s*"([^"]+)"[^}]*Component:\s*(\w+)([^}]*)\}/g)].map((m) => ({
  id: m[1],
  component: m[2],
  flow: /flow:\s*true/.test(m[3]),
}));
const firstIfood = order.findIndex((s) => s.id.startsWith("ifood"));

const problems = [];
const report = (file, line, rule, msg) => problems.push({ file: relative(ROOT, file), line, rule, msg });

for (const file of files.filter(inScope)) {
  const src = readFileSync(file, "utf8");
  if (/ds-allow-file:/.test(src)) continue;
  const lines = src.split("\n");
  const component = file.match(/(S\d+\w*)\.tsx$/)?.[1];
  const scene = order.find((s) => s.component === component);
  const sceneIndex = scene ? order.indexOf(scene) : -1;

  lines.forEach((text, i) => {
    if (/ds-allow:/.test(text)) return;
    const n = i + 1;
    if (COLOR.test(text) && STYLE_CTX.test(text)) {
      report(file, n, "cor-crua", "cor literal em estilo; use var(--color-*) / var(--gradient-*) de src/styles/tokens.css (ou cssVar() em tweens)");
    }
    if (/fontFamily\s*:\s*["'`](?!var\()/.test(text)) {
      report(file, n, "fonte-crua", "use var(--font-sans) ou var(--font-mono)");
    }
    if (scene?.flow && /\bstep\(\s*tl\s*\)/.test(text)) {
      report(file, n, "flow-step", `a cena "${scene.id}" é de fluxo (flow: true): roda inteira sem cliques, não use step()`);
    }
    if (sceneIndex >= 0 && firstIfood >= 0 && sceneIndex < firstIfood && /ifood/i.test(text)) {
      report(file, n, "ifood-cedo", "o iFood só pode ser citado a partir da cena do case (bloco 05)");
    }
  });
}

if (problems.length) {
  console.error(`check-ds: ${problems.length} problema(s)\n`);
  for (const p of problems) console.error(`  ${p.file}:${p.line}  [${p.rule}]  ${p.msg}`);
  process.exit(1);
}
console.log("check-ds: ok");
