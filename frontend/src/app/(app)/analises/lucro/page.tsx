import type { Metadata } from "next";
import Link from "next/link";
import { InsightCard } from "@/components/app/insight-card";
import { ANALYSES_NAV, ModuleLayout, ModuleSidebar } from "@/components/app/module-sidebar";
import { Card, CardHeader } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { insights, products } from "@/lib/demo/data";
import { formatBRL, formatPct } from "@/lib/format";

export const metadata: Metadata = { title: "Análise de Lucro" };

const VISIBLE_INSIGHTS = 4;

export default function ProfitAnalysisPage() {
  const [topInsights, moreInsights] = [
    insights.slice(0, VISIBLE_INSIGHTS),
    insights.slice(VISIBLE_INSIGHTS),
  ];

  const costed = products.filter((p) => p.totals.current.result !== null);
  const topContributors = [...costed]
    .sort((a, b) => (b.totals.current.result ?? 0) - (a.totals.current.result ?? 0))
    .slice(0, 3);
  const maxContribution = topContributors[0]?.totals.current.result ?? 1;
  const deteriorating = costed
    .map((p) => ({ p, drop: (p.totals.previous.margin ?? 0) - (p.totals.current.margin ?? 0) }))
    .filter((x) => x.drop > 0.005)
    .sort((a, b) => b.drop - a.drop)
    .slice(0, 3);

  return (
    <ModuleLayout
      sidebar={
        <ModuleSidebar title="Análises" sections={ANALYSES_NAV} activeHref="/analises/lucro" />
      }
    >
      <h1 className="text-2xl font-semibold">Análise de Lucro</h1>

      <section aria-labelledby="atencao">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="atencao" className="text-lg font-semibold">
            O que corrigir no lucro
          </h2>
          <span className="text-sm text-fg-muted">{insights.length} itens</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {topInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
        {moreInsights.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-primary">
              Ver mais {moreInsights.length} itens
            </summary>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {moreInsights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </details>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Quem mais lucra" />
          <ol className="space-y-3">
            {topContributors.map((p) => {
              const result = p.totals.current.result ?? 0;
              return (
                <li key={p.id}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <Link
                      href={`/produtos/${p.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {p.name}
                    </Link>
                    <span className="tabular-nums">{formatBRL(result)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-surface-muted" aria-hidden="true">
                    <div
                      className="h-2 rounded-full bg-success"
                      style={{ width: `${(result / maxContribution) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
        <Card>
          <CardHeader title="Maior perda de margem" />
          {deteriorating.length === 0 ? (
            <p className="text-sm text-fg-muted">Nenhum produto perdeu margem no período.</p>
          ) : (
            <ol className="space-y-3">
              {deteriorating.map(({ p, drop }) => (
                <li key={p.id} className="flex items-baseline justify-between gap-2 text-sm">
                  <Link
                    href={`/produtos/${p.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {p.name}
                  </Link>
                  <span className="flex items-baseline gap-2">
                    <span className="tabular-nums text-fg-muted">
                      {formatPct(p.totals.previous.margin ?? 0)} →{" "}
                      {formatPct(p.totals.current.margin ?? 0)}
                    </span>
                    <Delta value={-drop} kind="pp" />
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </ModuleLayout>
  );
}
