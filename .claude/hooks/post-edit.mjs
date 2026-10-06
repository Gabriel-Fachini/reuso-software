// PostToolUse hook (Edit|Write): after Claude changes a file under src/,
// run the typecheck and the design-system lint. Failures go back to Claude
// (exit 2 + stderr) so it fixes them before finishing.
import { execFileSync } from "node:child_process";
import { relative, resolve } from "node:path";

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
let input = "";
for await (const chunk of process.stdin) input += chunk;

const file = JSON.parse(input || "{}")?.tool_input?.file_path;
if (!file) process.exit(0);
const rel = relative(root, resolve(root, file));
if (!rel.startsWith("src/")) process.exit(0);

const failures = [];
const run = (label, cmd, args) => {
  try {
    execFileSync(cmd, args, { cwd: root, stdio: "pipe", encoding: "utf8" });
  } catch (e) {
    failures.push(`── ${label} ──\n${(e.stdout || "") + (e.stderr || "")}`.trim());
  }
};

run("typecheck (tsc)", "npx", ["tsc", "--noEmit"]);
run("design system (check-ds)", "node", ["scripts/check-ds.mjs", rel]);

if (failures.length) {
  console.error(
    `Verificação automática falhou depois de editar ${rel}.\n` +
      `Se você ainda está no meio de uma mudança em vários arquivos, continue; senão, corrija antes de terminar.\n\n` +
      failures.join("\n\n"),
  );
  process.exit(2);
}
