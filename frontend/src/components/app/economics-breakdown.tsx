import { formatBRL, formatPct } from "@/lib/format";
import type { Economics } from "@/lib/types";

/** "Para onde foi o dinheiro": cada custo com valor e peso sobre a receita. */
export function EconomicsBreakdown({ economics }: { economics: Economics }) {
  const { revenue, components, result, margin } = economics;
  const rows = components.filter((c) => c.amount > 0).sort((a, b) => b.amount - a.amount);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <caption className="sr-only">Composição do lucro estimado</caption>
        <thead>
          <tr className="border-b border-line text-left text-xs text-fg-muted">
            <th scope="col" className="py-2 pr-3 font-medium">
              Item
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">
              Valor
            </th>
            <th scope="col" className="hidden py-2 font-medium sm:table-cell">
              % da receita
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-line">
            <th scope="row" className="py-2 pr-3 text-left font-medium">
              Receita
            </th>
            <td className="py-2 pr-3 text-right font-medium tabular-nums">{formatBRL(revenue)}</td>
            <td className="hidden py-2 sm:table-cell" />
          </tr>
          {rows.map((c) => {
            const share = revenue ? c.amount / revenue : 0;
            return (
              <tr key={c.key} className="border-b border-line">
                <th scope="row" className="py-2 pr-3 text-left font-normal">
                  {c.label}
                </th>
                <td className="py-2 pr-3 text-right tabular-nums text-danger">
                  − {formatBRL(c.amount)}
                </td>
                <td className="hidden py-2 sm:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-surface-muted" aria-hidden="true">
                      <div
                        className="h-1.5 rounded-full bg-fg-muted"
                        style={{ width: `${Math.min(100, share * 100 * 2)}%` }}
                      />
                    </div>
                    <span className="tabular-nums text-fg-muted">{formatPct(share)}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className="pt-3 pr-3 text-left font-semibold">
              Lucro estimado
            </th>
            <td className="pt-3 pr-3 text-right font-semibold tabular-nums">
              {result === null ? "—" : formatBRL(result)}
            </td>
            <td className="hidden pt-3 font-semibold tabular-nums sm:table-cell">
              {margin === null ? "" : `margem ${formatPct(margin)}`}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
