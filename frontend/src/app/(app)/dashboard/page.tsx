import type { Metadata } from "next";
import Link from "next/link";
import { MarginFormula, ResultFormula, RevenueFormula } from "@/components/app/formula-text";
import { InsightCard } from "@/components/app/insight-card";
import { Card, CardHeader } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { KpiCard } from "@/components/ui/kpi-card";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { DEMO, insights, products, storeSummary } from "@/lib/demo/data";
import { formatBRL, formatBRLRounded, formatInt, formatPct, relativeChange } from "@/lib/format";
import type { Marketplace } from "@/lib/types";

export const metadata: Metadata = { title: "Visão geral" };

const VISIBLE_INSIGHTS = 4;

export default function DashboardPage() {
  const store = storeSummary();
  const cur = store.revenue.current;
  const prev = store.revenue.previous;
  const res = store.result;
  const ticket = (e: { revenue: number; orders: number }) => (e.orders ? e.revenue / e.orders : 0);

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Visão geral</h1>
        <p className="text-sm text-fg-muted">
          O que aconteceu na sua operação e o que merece atenção primeiro.
        </p>
      </div>

      <section aria-labelledby="kpis">
        <h2 id="kpis" className="sr-only">
          Indicadores do período
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
          <KpiCard
            title="Receita"
            value={formatBRLRounded(cur.revenue)}
            delta={relativeChange(cur.revenue, prev.revenue)}
            comparison={DEMO.comparisonLabel}
            formula={<RevenueFormula />}
          />
          <KpiCard
            title="Resultado estimado"
            value={res.current.result === null ? "—" : formatBRLRounded(res.current.result)}
            delta={
              res.current.result !== null && res.previous.result !== null
                ? relativeChange(res.current.result, res.previous.result)
                : null
            }
            comparison={DEMO.comparisonLabel}
            note={
              store.productsWithoutCost > 0 && (
                <>
                  Cobre {formatPct(store.coverage)} da receita.{" "}
                  <Link href="/custos" className="text-primary hover:underline">
                    {store.productsWithoutCost} produto sem custo
                  </Link>
                </>
              )
            }
            formula={<ResultFormula />}
          />
          <KpiCard
            title="Margem estimada"
            value={res.current.margin === null ? "—" : formatPct(res.current.margin)}
            delta={
              res.current.margin !== null && res.previous.margin !== null
                ? res.current.margin - res.previous.margin
                : null
            }
            deltaKind="pp"
            comparison={DEMO.comparisonLabel}
            formula={<MarginFormula />}
          />
          <KpiCard
            title="Pedidos"
            value={formatInt(cur.orders)}
            delta={relativeChange(cur.orders, prev.orders)}
            comparison={DEMO.comparisonLabel}
            formula={
              <p>Pedidos pagos e não cancelados no período, em todos os canais conectados.</p>
            }
          />
          <KpiCard
            title="Ticket médio"
            value={formatBRL(ticket(cur))}
            delta={relativeChange(ticket(cur), ticket(prev))}
            comparison={DEMO.comparisonLabel}
            formula={<p>Ticket médio = receita elegível ÷ número de pedidos.</p>}
          />
        </div>
      </section>

      <section aria-labelledby="atencao">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 id="atencao" className="text-lg font-semibold">
              Precisa da sua atenção
            </h2>
            <p className="text-sm text-fg-muted">
              Ordenado por gravidade e impacto estimado em R$. Cada item mostra a evidência e o que
              investigar.
            </p>
          </div>
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

      <Card>
        <CardHeader
          title="Comparação entre marketplaces"
          description="Receita sozinha não diz qual canal é melhor: compare resultado e margem."
        />
        <MarketplaceComparison />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Quem mais contribui"
            description="Maior resultado estimado no período"
          />
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
          <CardHeader
            title="Maior perda de margem"
            description="Queda em pontos percentuais vs. período anterior"
          />
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
    </div>
  );
}

function MarketplaceComparison() {
  const channels: Marketplace[] = ["mercadolivre", "shopee"];
  const total = storeSummary().revenue.current.revenue;
  const rows = channels.map((m) => ({ m, s: storeSummary(m) }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <caption className="sr-only">Indicadores por marketplace no período</caption>
        <thead>
          <tr className="border-b border-line text-left text-xs text-fg-muted">
            <th scope="col" className="py-2 pr-4 font-medium">
              Canal
            </th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">
              Receita
            </th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">
              % do total
            </th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">
              Resultado est.
            </th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">
              Margem est.
            </th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">
              Pedidos
            </th>
            <th scope="col" className="py-2 text-right font-medium">
              Ads / receita
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ m, s }) => {
            const cur = s.revenue.current;
            return (
              <tr key={m} className="border-b border-line last:border-0">
                <th scope="row" className="py-3 pr-4 text-left font-normal">
                  <MarketplaceBadge marketplace={m} />
                </th>
                <td className="py-3 pr-4 text-right tabular-nums">{formatBRL(cur.revenue)}</td>
                <td className="py-3 pr-4 text-right tabular-nums">
                  {formatPct(total ? cur.revenue / total : 0)}
                </td>
                <td className="py-3 pr-4 text-right tabular-nums">
                  {s.result.current.result === null ? "—" : formatBRL(s.result.current.result)}
                </td>
                <td className="py-3 pr-4 text-right font-medium tabular-nums">
                  {s.result.current.margin === null ? "—" : formatPct(s.result.current.margin)}
                </td>
                <td className="py-3 pr-4 text-right tabular-nums">{formatInt(cur.orders)}</td>
                <td className="py-3 text-right tabular-nums">
                  {formatPct(cur.revenue ? cur.adsSpend / cur.revenue : 0)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-fg-muted">
        Margem por canal considera apenas produtos com custo cadastrado. Produtos diferentes em cada
        canal afetam a comparação — veja a comparação do mesmo produto na página dele.
      </p>
    </div>
  );
}
