import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative base: the same build works at / (dev, export) and at
  // /<repo>/ on GitHub Pages.
  base: "./",
  server: { port: 5173 },
});
