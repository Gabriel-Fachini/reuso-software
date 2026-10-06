// Reuses the dev server on :5173 if it is already running, otherwise starts
// one for the duration of the script.
import { spawn } from "node:child_process";

export const BASE = "http://localhost:5173";

async function up() {
  try {
    const r = await fetch(BASE, { signal: AbortSignal.timeout(1500) });
    return r.ok;
  } catch {
    return false;
  }
}

export async function ensureServer() {
  if (await up()) return () => {};
  const child = spawn("npx", ["vite", "--port", "5173", "--strictPort"], { stdio: "ignore" });
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 250));
    if (await up()) return () => child.kill();
  }
  child.kill();
  throw new Error("não consegui subir o servidor de desenvolvimento na porta 5173");
}

/** "6" | "3-5" | "3,6,9" | "all" (default) → [3, 4, 5] … */
export function parseScenes(arg, total = 15) {
  if (!arg || arg === "all") return Array.from({ length: total }, (_, i) => i + 1);
  return arg.split(",").flatMap((part) => {
    const [a, b] = part.split("-").map(Number);
    return b ? Array.from({ length: b - a + 1 }, (_, i) => a + i) : [a];
  });
}
