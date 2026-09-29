/// <reference types="vitest/config" />
/** Configuración de Vite: React, Tailwind y aliases del proyecto. */
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.join(rootDir, "src"),
      "@components": path.join(rootDir, "src/components"),
      "@features": path.join(rootDir, "src/features"),
      "@hooks": path.join(rootDir, "src/hooks"),
      "@lib": path.join(rootDir, "src/lib"),
      "@store": path.join(rootDir, "src/store"),
      "@styles": path.join(rootDir, "src/styles"),
      "@assets": path.join(rootDir, "src/assets"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
