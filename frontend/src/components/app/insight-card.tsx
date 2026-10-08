import Link from "next/link";
import { Badge, type Tone } from "@/components/ui/badge";
import { formatBRLRounded } from "@/lib/format";
import type { Insight, Severity } from "@/lib/types";

const SEVERITY: Record<Severity, { tone: Tone; icon: string; label: string; border: string }> = {
  critical: { tone: "danger", icon: "■", label: "Crítico", border: "border-l-danger" },
  warning: { tone: "warning", icon: "▲", label: "Atenção", border: "border-l-warning" },
  info: { tone: "info", icon: "●", label: "Oportunidade", border: "border-l-info" },
};

/**
 * Card de insight: o que aconteceu, evidência, o que investigar e limitação (Bloco 17).
 * A recomendação é sempre "investigar", nunca uma verdade absoluta.
 */
export function InsightCard({ insight, showProduct = true }: { insight: Insight; showProduct?: boolean }) {
  const severity = SEVERITY[insight.severity];
  return (
    <article className={`rounded-lg border border-l-4 border-line ${severity.border} bg-surface p-4`}>
      <header className="flex flex-wrap items-center gap-2">
        <Badge tone={severity.tone} icon={severity.icon}>
          {severity.label}
        </Badge>
        {showProduct && (
          <Link
            href={`/produtos/${insight.productId}`}
            className="text-sm font-medium text-primary underline-offset-2 hover:underline"
          >
            {insight.productName}
          </Link>
        )}
        <span className="ml-auto text-xs text-fg-muted">Regra {insight.ruleId}</span>
      </header>

      <h3 className="mt-2 font-semibold">{insight.title}</h3>

      {insight.impact !== null && insight.impactLabel && (
        <p className="mt-1 text-sm">
          <span className="font-semibold tabular-nums">≈ {formatBRLRounded(insight.impact)}</span>{" "}
          <span className="text-fg-muted">{insight.impactLabel}</span>
        </p>
      )}

      <ul className="mt-2 space-y-0.5 text-sm text-fg-muted">
        {insight.evidence.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <p className="mt-3 text-sm">
        <span className="font-medium">Investigue: </span>
        {insight.investigate.join(" · ")}
      </p>
      <p className="mt-1 text-xs text-fg-muted">Limitação: {insight.limitation}</p>
    </article>
  );
}
