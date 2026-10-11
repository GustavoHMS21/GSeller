"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";

export type SalesTab = {
  key: string;
  label: string;
  stats: { label: string; value: string }[];
};

/** Vendas por loja, em abas como no Início do UpSeller (Bloco 60.9). */
export function SalesTabs({ tabs }: { tabs: SalesTab[] }) {
  const [active, setActive] = useState(tabs[0]?.key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];
  return (
    <div>
      <div role="tablist" aria-label="Lojas" className="flex gap-1 border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`aba-${tab.key}`}
            aria-selected={tab.key === current.key}
            aria-controls="painel-vendas"
            onClick={() => setActive(tab.key)}
            className={cx(
              "-mb-px border-b-2 px-4 py-2 text-sm",
              tab.key === current.key
                ? "border-primary font-medium text-primary"
                : "border-transparent text-fg-muted hover:text-fg",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id="painel-vendas"
        role="tabpanel"
        aria-labelledby={`aba-${current.key}`}
        className="grid grid-cols-2 gap-6 pt-5 sm:grid-cols-4"
      >
        {current.stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
            <p className="text-sm text-fg-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
