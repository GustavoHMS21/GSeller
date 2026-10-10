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
      // Cobertura é relatório; meta só nos módulos de risco (Blocos 56.3 e 57.5).
      thresholds: {
        "src/lib/demo/{economics,health,rules}.ts": {
          lines: 90,
          functions: 90,
          statements: 90,
          branches: 85,
        },
      },
    },
  },
});
