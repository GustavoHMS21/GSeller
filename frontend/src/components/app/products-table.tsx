"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Delta } from "@/components/ui/delta";
import { HealthBadge } from "@/components/ui/health-badge";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { EmptyState } from "@/components/ui/states";
import { formatBRL, formatInt, formatPct, relativeChange } from "@/lib/format";
import type { HealthLevel, Marketplace, Product } from "@/lib/types";

type SortKey = "health" | "revenue" | "margin";

const HEALTH_FILTERS: Array<{ value: HealthLevel | "all"; label: string }> = [
  { value: "all", label: "Todas" },
  { value: "critical", label: "Crítico" },
  { value: "attention", label: "Atenção" },
  { value: "healthy", label: "Saudável" },
  { value: "unknown", label: "Sem dados" },
];

const SELECT =
  "rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm text-fg focus-visible:outline-2";

export function ProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [marketplace, setMarketplace] = useState<Marketplace | "all">("all");
  const [health, setHealth] = useState<HealthLevel | "all">("all");
  const [sort, setSort] = useState<SortKey>("health");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      .filter((p) => marketplace === "all" || p.listings.some((l) => l.marketplace === marketplace))
      .filter((p) => health === "all" || p.health.level === health)
      .sort((a, b) => {
        if (sort === "revenue") return b.totals.current.revenue - a.totals.current.revenue;
        if (sort === "margin")
          return (a.totals.current.margin ?? -1) - (b.totals.current.margin ?? -1);
        return (a.health.score ?? -1) - (b.health.score ?? -1);
      });
  }, [products, query, marketplace, health, sort]);

  return (
    <div>
      <search className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs text-fg-muted">
          Buscar
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome ou SKU"
            className={`${SELECT} w-56`}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-fg-muted">
          Marketplace
          <select
            value={marketplace}
            onChange={(e) => setMarketplace(e.target.value as Marketplace | "all")}
            className={SELECT}
          >
            <option value="all">Todos</option>
            <option value="mercadolivre">Mercado Livre</option>
            <option value="shopee">Shopee</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-fg-muted">
          Saúde
          <select
            value={health}
            onChange={(e) => setHealth(e.target.value as HealthLevel | "all")}
            className={SELECT}
          >
            {HEALTH_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-fg-muted">
          Ordenar por
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className={SELECT}
          >
            <option value="health">Pior saúde primeiro</option>
            <option value="margin">Menor margem primeiro</option>
            <option value="revenue">Maior receita primeiro</option>
          </select>
        </label>
        <p className="ml-auto text-sm text-fg-muted" aria-live="polite">
          {rows.length} de {products.length} produtos
        </p>
      </search>

      {rows.length === 0 ? (
        <EmptyState
          title="Nenhum produto com esses filtros"
          description="Ajuste a busca ou os filtros para ver mais produtos."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full min-w-[820px] text-sm">
            <caption className="sr-only">
              Produtos com receita, resultado e saúde no período
            </caption>
            <thead>
              <tr className="border-b border-line text-left text-xs text-fg-muted">
                <th scope="col" className="px-4 py-3 font-medium">
                  Produto
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Canais
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Receita
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Lucro est.
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Margem est.
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Pedidos
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Saúde
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const cur = p.totals.current;
                const prev = p.totals.previous;
                return (
                  <tr
                    key={p.id}
                    className="border-b border-line last:border-0 hover:bg-surface-muted"
                  >
                    <th scope="row" className="px-4 py-3 text-left font-normal">
                      <Link
                        href={`/produtos/${p.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {p.name}
                      </Link>
                      <span className="block text-xs text-fg-muted">{p.sku}</span>
                    </th>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {p.listings.map((l) => (
                          <MarketplaceBadge key={l.marketplace} marketplace={l.marketplace} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatBRL(cur.revenue)}
                      <span className="block">
                        <Delta value={relativeChange(cur.revenue, prev.revenue)} />
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {cur.result === null ? (
                        <span className="text-fg-muted">sem custo</span>
                      ) : (
                        formatBRL(cur.result)
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {cur.margin === null ? "—" : formatPct(cur.margin)}
                      {cur.margin !== null && prev.margin !== null && (
                        <span className="block">
                          <Delta value={cur.margin - prev.margin} kind="pp" />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatInt(cur.orders)}</td>
                    <td className="px-4 py-3">
                      <HealthBadge level={p.health.level} score={p.health.score} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
