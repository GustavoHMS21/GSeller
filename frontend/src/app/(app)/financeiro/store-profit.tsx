"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  type FixedCost,
  fixedCostInPeriod,
  type Period,
  storeProfit,
  totalFixedCosts,
  validateFixedCost,
} from "@/lib/demo/fixed-costs";
import { formatBRL, formatPct } from "@/lib/format";

type Side = { period: Period; revenue: number; productsProfit: number | null };

const INPUT = "rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm text-fg";

const formatDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR");
const money = (value: number | null) => (value === null ? "—" : formatBRL(value));

/**
 * Lucro da loja depois dos custos fixos, nos dois períodos, e lançamento de custos.
 * Na demonstração, os custos lançados ficam só na tela.
 */
export function StoreProfit({
  initialCosts,
  current,
  previous,
}: {
  initialCosts: FixedCost[];
  current: Side;
  previous: Side;
}) {
  const [costs, setCosts] = useState(initialCosts);
  const [error, setError] = useState<string | null>(null);
  const added = new Set(costs.slice(initialCosts.length).map((c) => c.id));

  const view = (side: Side) => {
    const fixed = totalFixedCosts(costs, side.period);
    return { ...side, fixed, ...storeProfit(side.productsProfit, fixed, side.revenue) };
  };
  const cur = view(current);
  const prev = view(previous);

  function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const entry = {
      description: String(form.get("description") ?? ""),
      monthlyAmount: Number(String(form.get("monthlyAmount") ?? "").replace(",", ".")),
      validFrom: String(form.get("validFrom") ?? ""),
      validTo: null,
    };
    const problem = validateFixedCost(entry);
    setError(problem);
    if (problem) return;
    setCosts([
      ...costs,
      { ...entry, description: entry.description.trim(), id: `novo-${costs.length}` },
    ]);
    event.currentTarget.reset();
  }

  const rows: { label: string; cur: string; prev: string; strong?: boolean }[] = [
    { label: "Receita", cur: money(cur.revenue), prev: money(prev.revenue) },
    {
      label: "Lucro estimado dos produtos",
      cur: money(cur.productsProfit),
      prev: money(prev.productsProfit),
    },
    { label: "− Custos fixos", cur: money(cur.fixed), prev: money(prev.fixed) },
    { label: "Lucro da loja", cur: money(cur.result), prev: money(prev.result), strong: true },
    {
      label: "Margem da loja",
      cur: cur.margin === null ? "—" : formatPct(cur.margin),
      prev: prev.margin === null ? "—" : formatPct(prev.margin),
    },
  ];

  return (
    <div className="space-y-6">
      {cur.result !== null && cur.result < 0 && (
        <p role="status" className="rounded-md bg-danger-soft p-3 text-sm text-danger">
          <span aria-hidden="true">▲ </span>
          Os custos fixos passam do lucro dos produtos: a loja fechou o período com prejuízo de{" "}
          {formatBRL(-cur.result)}.
        </p>
      )}

      <Card>
        <CardHeader title="Do lucro dos produtos ao lucro da loja" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <caption className="sr-only">
              Lucro da loja nos últimos 30 dias e no período anterior
            </caption>
            <thead>
              <tr className="border-b border-line text-left text-xs text-fg-muted">
                <th scope="col" className="py-2 font-medium" />
                <th scope="col" className="py-2 text-right font-medium">
                  Últimos 30 dias
                </th>
                <th scope="col" className="py-2 text-right font-medium">
                  30 dias anteriores
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <th
                    scope="row"
                    className={`py-2 text-left ${r.strong ? "font-semibold" : "font-normal"}`}
                  >
                    {r.label}
                  </th>
                  <td className={`py-2 text-right tabular-nums ${r.strong ? "font-semibold" : ""}`}>
                    {r.cur}
                  </td>
                  <td className="py-2 text-right tabular-nums text-fg-muted">{r.prev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader title="Custos fixos da loja" />
        <ul className="divide-y divide-line">
          {costs.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2 text-sm">
              <span className="min-w-0 flex-1 font-medium">{c.description}</span>
              <span className="text-fg-muted">
                desde {formatDate(c.validFrom)}
                {c.validTo && ` até ${formatDate(c.validTo)}`}
              </span>
              <span className="tabular-nums">{formatBRL(c.monthlyAmount)}/mês</span>
              <span className="w-44 text-right tabular-nums text-fg-muted">
                {formatBRL(fixedCostInPeriod(c, current.period))} no período
              </span>
              {added.has(c.id) && (
                <Button
                  variant="ghost"
                  onClick={() => setCosts(costs.filter((x) => x.id !== c.id))}
                  aria-label={`Remover ${c.description}`}
                >
                  Remover
                </Button>
              )}
            </li>
          ))}
        </ul>

        <form
          onSubmit={add}
          className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4"
        >
          <label className="flex flex-col gap-1 text-xs text-fg-muted">
            Descrição
            <input
              name="description"
              maxLength={80}
              placeholder="Ex.: Internet"
              className={`${INPUT} w-56`}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-fg-muted">
            Valor mensal (R$)
            <input
              name="monthlyAmount"
              inputMode="decimal"
              placeholder="0,00"
              className={`${INPUT} w-32 tabular-nums`}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-fg-muted">
            Desde
            <input
              name="validFrom"
              type="date"
              defaultValue={current.period.from}
              className={INPUT}
            />
          </label>
          <Button type="submit" variant="secondary">
            Lançar custo
          </Button>
        </form>
        {error && (
          <p role="alert" className="mt-3 rounded-md bg-danger-soft p-3 text-sm text-danger">
            {error}
          </p>
        )}
      </Card>
    </div>
  );
}
