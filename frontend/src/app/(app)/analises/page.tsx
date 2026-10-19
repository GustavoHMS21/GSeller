import type { Metadata } from "next";
import Link from "next/link";
import { ANALYSES_NAV, ModuleLayout, ModuleSidebar } from "@/components/app/module-sidebar";
import { SalesChart } from "@/components/app/sales-chart";
import { Card, CardHeader } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { products, storeSummary } from "@/lib/demo/data";
import { last30Days } from "@/lib/demo/sales";
import { formatBRL, formatBRLRounded, formatInt, formatPct, relativeChange } from "@/lib/format";
import type { Marketplace } from "@/lib/types";

export const metadata: Metadata = { title: "Vista Geral" };

const RANKING_SIZE = 5;

/** Relatório de vendas, como a Vista Geral do UpSeller, com lucro e margem (Bloco 60.9). */
export default function SalesOverviewPage() {
  const store = storeSummary();
  const cur = store.revenue.current;
  const prev = store.revenue.previous;
  const res = store.result;
  const ticket = (e: { revenue: number; orders: number }) => (e.orders ? e.revenue / e.orders : 0);

  const ranking = [...products]
    .sort((a, b) => b.totals.current.revenue - a.totals.current.revenue)
    .slice(0, RANKING_SIZE);
  const maxRevenue = ranking[0]?.totals.current.revenue || 1;

  return (
    <ModuleLayout
      sidebar={<ModuleSidebar title="Análises" sections={ANALYSES_NAV} activeHref="/analises" />}
    >
      <h1 className="text-2xl font-semibold">Vista Geral</h1>

      <section aria-labelledby="kpis">
        <h2 id="kpis" className="mb-3 text-lg font-semibold">
          Desempenho · últimos 30 dias
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
          <KpiCard
            title="Receita"
            value={formatBRLRounded(cur.revenue)}
            delta={relativeChange(cur.revenue, prev.revenue)}
          />
          <KpiCard
            title="Lucro estimado"
            value={res.current.result === null ? "—" : formatBRLRounded(res.current.result)}
            delta={
              res.current.result !== null && res.previous.result !== null
                ? relativeChange(res.current.result, res.previous.result)
                : null
            }
            note={
              store.productsWithoutCost > 0 && (
                <Link href="/custos" className="text-warning hover:underline">
                  ▲ {store.productsWithoutCost} produto sem custo
                </Link>
              )
            }
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
          />
          <KpiCard
            title="Pedidos"
            value={formatInt(cur.orders)}
            delta={relativeChange(cur.orders, prev.orders)}
          />
          <KpiCard
            title="Ticket médio"
            value={formatBRL(ticket(cur))}
            delta={relativeChange(ticket(cur), ticket(prev))}
          />
        </div>
      </section>

      <Card>
        <CardHeader title="Valor de vendas · últimos 30 dias" />
        <SalesChart points={last30Days()} title="Valor de vendas por dia, todas as lojas" />
      </Card>

      <div className="space-y-6">
        <section id="marketplaces" className="scroll-mt-20">
          <Card>
            <CardHeader title="Por marketplace" />
            <MarketplaceComparison />
          </Card>
        </section>
        <Card>
          <CardHeader title="Ranking de produtos" />
          <ol className="space-y-3">
            {ranking.map((p) => {
              const revenue = p.totals.current.revenue;
              return (
                <li key={p.id}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <Link
                      href={`/produtos/${p.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {p.name}
                    </Link>
                    <span className="tabular-nums">{formatBRL(revenue)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-surface-muted" aria-hidden="true">
                    <div
                      className="h-2 rounded-full bg-chart-1"
                      style={{ width: `${(revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>
    </ModuleLayout>
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
              Lucro est.
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
    </div>
  );
}
