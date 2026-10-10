import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    // Lógica pura roda em Node (rápido); só componentes precisam do DOM simulado.
    // Componentes assíncronos de servidor não rodam no Vitest: ficam para os testes E2E (#17).
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["src/lib/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "components",
          environment: "jsdom",
          include: ["src/components/**/*.test.tsx"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/lib/**", "src/components/**"],
      exclude: ["src/**/*.test.{ts,tsx}"],
      thresholds: {
        // Regras de insight, health score e formatação: núcleo do produto (Bloco 56.3).
        "src/lib/**": { lines: 90, functions: 90, statements: 90, branches: 85 },
      },
    },
  },
});
