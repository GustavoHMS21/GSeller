import { cx } from "@/lib/cx";
import { formatPct, formatPP } from "@/lib/format";

/**
 * Variação entre períodos. `goodWhen` define se subir é bom (receita) ou ruim (custo):
 * a cor comunica significado, não direção (Bloco 16.2).
 */
export function Delta({
  value,
  kind = "pct",
  goodWhen = "up",
}: {
  value: number | null;
  kind?: "pct" | "pp";
  goodWhen?: "up" | "down";
}) {
  if (value === null) return <span className="text-sm text-fg-muted">sem base de comparação</span>;

  const threshold = kind === "pp" ? 0.001 : 0.005;
  const flat = Math.abs(value) < threshold;
  const up = value > 0;
  const good = flat ? null : goodWhen === "up" ? up : !up;
  const text = kind === "pp" ? formatPP(value) : formatPct(Math.abs(value));
  const direction = flat ? "estável" : up ? "aumento de" : "queda de";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 text-sm font-medium tabular-nums",
        good === null ? "text-fg-muted" : good ? "text-success" : "text-danger",
      )}
    >
      <span aria-hidden="true">{flat ? "→" : up ? "▲" : "▼"}</span>
      <span className="sr-only">{direction}</span>
      {text}
    </span>
  );
}
