"use client";

import { useState } from "react";
import { SalesChart } from "@/components/app/sales-chart";
import { cx } from "@/lib/cx";
import type { SalesPoint } from "@/lib/types";

export type SalesView = { stats: { label: string; value: string }[]; points: SalesPoint[] };
export type SalesTab = { key: string; label: string; today: SalesView; month: SalesView };

const PERIODS = [
  { key: "today", label: "Vendas de Hoje" },
  { key: "month", label: "Últimos 30 dias" },
] as const;

/** Vendas por loja com Hoje / Últimos 30 dias e gráfico, como no Início do UpSeller (Bloco 60.9). */
export function SalesTabs({ tabs }: { tabs: SalesTab[] }) {
  const [store, setStore] = useState(tabs[0]?.key);
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["key"]>("month");
  const tab = tabs.find((t) => t.key === store) ?? tabs[0];
  const view = tab[period];
  const periodLabel = PERIODS.find((p) => p.key === period)?.label ?? "";

  return (
    <div>
      <div
        role="tablist"
        aria-label="Lojas"
        className="flex gap-1 overflow-x-auto border-b border-line"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`aba-${t.key}`}
            aria-selected={t.key === tab.key}
            aria-controls="painel-vendas"
            onClick={() => setStore(t.key)}
            className={cx(
              "-mb-px whitespace-nowrap border-b-2 px-4 py-2 text-sm",
              t.key === tab.key
                ? "border-primary font-medium text-primary"
                : "border-transparent text-fg-muted hover:text-fg",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id="painel-vendas" role="tabpanel" aria-labelledby={`aba-${tab.key}`} className="pt-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            {view.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="text-sm text-fg-muted">{stat.label}</dt>
                <dd className="text-2xl font-semibold tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <fieldset className="inline-flex rounded-md border border-line">
            <legend className="sr-only">Período</legend>
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                aria-pressed={p.key === period}
                onClick={() => setPeriod(p.key)}
                className={cx(
                  "px-3 py-1.5 text-sm first:rounded-l-md last:rounded-r-md",
                  p.key === period
                    ? "bg-info-soft font-medium text-primary ring-1 ring-primary"
                    : "text-fg-muted hover:text-fg",
                )}
              >
                {p.label}
              </button>
            ))}
          </fieldset>
        </div>
        <div className="mt-4">
          <SalesChart
            points={view.points}
            title={`Valor de vendas · ${tab.label} · ${periodLabel}`}
          />
        </div>
      </div>
    </div>
  );
}
