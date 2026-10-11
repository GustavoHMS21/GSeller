// Hook de pre-commit: roda o Biome dentro de frontend/ nos arquivos do commit.
// Node em vez de `bash -c`: no Windows o bash do PATH pode ser o do WSL, que falha sem distribuição.
import { spawnSync } from "node:child_process";

const files = process.argv.slice(2).map((file) => file.replace(/^frontend[\\/]/, ""));
const result = spawnSync(
  process.execPath,
  [
    "node_modules/@biomejs/biome/bin/biome",
    "check",
    "--write",
    "--no-errors-on-unmatched",
    "--files-ignore-unknown=true",
    ...files,
  ],
  { cwd: "frontend", stdio: "inherit" },
);
process.exit(result.status ?? 1);
