// Conventional Commits (Bloco 23). Validado no CI e, opcionalmente, no hook commit-msg.
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "security", "refactor", "perf", "docs", "test", "chore", "ci", "build", "revert"],
    ],
    // Assuntos em português citam nomes próprios ("Vitest", "Biome"); caixa não é padronizada.
    "subject-case": [0],
    "header-max-length": [2, "always", 100],
    // Commits automáticos (Dependabot) trazem changelogs com linhas longas.
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};
