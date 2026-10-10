"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBRL, formatPct } from "@/lib/format";
import type { ProductCost } from "@/lib/types";

interface CostRow {
  id: string;
  name: string;
  sku: string;
  cost: ProductCost;
}

interface HistoryEntry {
  id: string;
  productName: string;
  previous: ProductCost;
  next: ProductCost;
}

const INPUT = "w-full rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm tabular-nums";

const formatDate = (iso: string | null) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR") : "—";

/**
 * Custos versionados (Bloco 6, Tela 6): alterar um custo cria uma nova vigência
 * e encerra a anterior — o histórico nunca é sobrescrito.
 * No protótipo, as alterações ficam apenas na tela.
 */
export function CostsEditor({ rows: initialRows }: { rows: CostRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  function save(row: CostRow, form: FormData) {
    const unitCost = Number(String(form.get("unitCost")).replace(",", "."));
    const taxPercent = Number(String(form.get("taxRate")).replace(",", "."));
    const additional = Number(String(form.get("additional") || "0").replace(",", "."));
    const validFrom = String(form.get("validFrom"));
    if (!Number.isFinite(unitCost) || unitCost <= 0 || !validFrom) return;

    const next: ProductCost = {
      unitCost,
      taxRate: taxPercent / 100,
      additionalUnitCost: Number.isFinite(additional) ? additional : 0,
      validFrom,
    };
    setHistory((h) => [
      { id: crypto.randomUUID(), productName: row.name, previous: row.cost, next },
      ...h,
    ]);
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, cost: next } : r)));
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full min-w-[760px] text-sm">
          <caption className="sr-only">Custos vigentes por produto</caption>
          <thead>
            <tr className="border-b border-line text-left text-xs text-fg-muted">
              <th scope="col" className="px-4 py-3 font-medium">
                Produto
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Custo unitário
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Imposto estimado
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Custo adicional
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Vigente desde
              </th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) =>
              editing === row.id ? (
                <tr key={row.id} className="border-b border-line bg-surface-muted">
                  <td colSpan={6} className="px-4 py-4">
                    <form
                      action={(form) => save(row, form)}
                      className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] sm:items-end"
                    >
                      <p className="font-medium">
                        {row.name}
                        <span className="block text-xs font-normal text-fg-muted">{row.sku}</span>
                      </p>
                      <label className="text-xs text-fg-muted">
                        Custo unitário (R$)
                        <input
                          name="unitCost"
                          required
                          inputMode="decimal"
                          defaultValue={row.cost.unitCost ?? ""}
                          className={INPUT}
                        />
                      </label>
                      <label className="text-xs text-fg-muted">
                        Imposto (%)
                        <input
                          name="taxRate"
                          required
                          inputMode="decimal"
                          defaultValue={row.cost.taxRate * 100}
                          className={INPUT}
                        />
                      </label>
                      <label className="text-xs text-fg-muted">
                        Adicional (R$)
                        <input
                          name="additional"
                          inputMode="decimal"
                          defaultValue={row.cost.additionalUnitCost}
                          className={INPUT}
                        />
                      </label>
                      <label className="text-xs text-fg-muted">
                        Vigente a partir de
                        <input
                          name="validFrom"
                          required
                          type="date"
                          defaultValue="2026-10-08"
                          className={INPUT}
                        />
                      </label>
                      <div className="flex gap-2">
                        <Button type="submit">Salvar</Button>
                        <Button variant="secondary" onClick={() => setEditing(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <th scope="row" className="px-4 py-3 text-left font-normal">
                    <span className="font-medium">{row.name}</span>
                    <span className="block text-xs text-fg-muted">{row.sku}</span>
                  </th>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {row.cost.unitCost === null ? (
                      <Badge tone="warning" icon="▲">
                        Sem custo
                      </Badge>
                    ) : (
                      formatBRL(row.cost.unitCost)
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatPct(row.cost.taxRate)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatBRL(row.cost.additionalUnitCost)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{formatDate(row.cost.validFrom)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      onClick={() => setEditing(row.id)}
                      aria-label={`${row.cost.unitCost === null ? "Informar custo" : "Alterar custo"} de ${row.name}`}
                    >
                      {row.cost.unitCost === null ? "Informar custo" : "Alterar"}
                    </Button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      <section aria-labelledby="cost-history">
        <h2 id="cost-history" className="text-lg font-semibold">
          Histórico de alterações
        </h2>
        {history.length === 0 ? (
          <p className="mt-1 text-sm text-fg-muted">
            Nenhuma alteração nesta sessão. Ao alterar um custo, a vigência anterior é encerrada e o
            resultado dos pedidos antigos continua usando o custo da época.
          </p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {history.map((h) => (
              <li key={h.id} className="rounded-md border border-line bg-surface p-3">
                <span className="font-medium">{h.productName}</span>: custo{" "}
                {h.previous.unitCost === null ? "não informado" : formatBRL(h.previous.unitCost)} →{" "}
                <strong>{formatBRL(h.next.unitCost ?? 0)}</strong> a partir de{" "}
                {formatDate(h.next.validFrom)}.{" "}
                <span className="text-fg-muted">
                  Vigência anterior preservada para o histórico.
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
