import Link from "next/link";
import { Badge, type Tone } from "@/components/ui/badge";
import { formatBRLRounded } from "@/lib/format";
import type { Insight, Severity } from "@/lib/types";

const SEVERITY: Record<Severity, { tone: Tone; icon: string; label: string; border: string }> = {
  critical: { tone: "danger", icon: "■", label: "Crítico", border: "border-l-danger" },
  warning: { tone: "warning", icon: "▲", label: "Atenção", border: "border-l-warning" },
  info: { tone: "info", icon: "●", label: "Oportunidade", border: "border-l-info" },
};

/** Alerta direto: o problema, o número que o comprova e o que fazer (Bloco 17, v0.16). */
export function InsightCard({
  insight,
  showProduct = true,
}: {
  insight: Insight;
  showProduct?: boolean;
}) {
  const severity = SEVERITY[insight.severity];
  return (
    <article
      className={`rounded-lg border border-l-4 border-line ${severity.border} bg-surface p-4`}
    >
      <header className="flex items-center gap-2">
        <Badge tone={severity.tone} icon={severity.icon}>
          {severity.label}
        </Badge>
        {showProduct && (
          <Link
            href={`/produtos/${insight.productId}`}
            className="truncate text-sm font-medium text-primary underline-offset-2 hover:underline"
          >
            {insight.productName}
          </Link>
        )}
        {insight.impact !== null && (
          <span className="ml-auto whitespace-nowrap font-semibold tabular-nums">
            <span className="sr-only">Impacto estimado: </span>≈ {formatBRLRounded(insight.impact)}
            <span className="text-xs font-normal text-fg-muted">/mês</span>
          </span>
        )}
      </header>
      <h3 className="mt-2 font-semibold">
        {insight.title} <span className="font-normal text-fg-muted">· {insight.detail}</span>
      </h3>
      <p className="mt-1 text-sm">
        <span aria-hidden="true" className="text-primary">
          →{" "}
        </span>
        {insight.action}
      </p>
    </article>
  );
}
