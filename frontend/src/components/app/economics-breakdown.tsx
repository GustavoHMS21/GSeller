import { Badge } from "@/components/ui/badge";
import { formatBRL, formatPct } from "@/lib/format";
import type { Economics, ValueOrigin } from "@/lib/types";

export const ORIGIN_LABEL: Record<ValueOrigin, string> = {
  marketplace: "Dado do marketplace",
  seller: "Informado por você",
  estimated: "Estimado",
};

/** "Para onde foi o dinheiro": cada componente com valor, peso e origem (data lineage). */
export function EconomicsBreakdown({ economics }: { economics: Economics }) {
  const { revenue, components, result, margin } = economics;
  const rows = components.filter((c) => c.amount > 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <caption className="sr-only">Composição do resultado estimado</caption>
        <thead>
          <tr className="border-b border-line text-left text-xs text-fg-muted">
            <th scope="col" className="py-2 pr-3 font-medium">Componente</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Valor</th>
            <th scope="col" className="hidden py-2 pr-3 font-medium sm:table-cell">% da receita</th>
            <th scope="col" className="py-2 font-medium">Origem</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-line">
            <th scope="row" className="py-2 pr-3 text-left font-medium">Receita elegível</th>
            <td className="py-2 pr-3 text-right font-medium tabular-nums">{formatBRL(revenue)}</td>
            <td className="hidden py-2 pr-3 sm:table-cell" />
            <td className="py-2">
              <Badge>{ORIGIN_LABEL.marketplace}</Badge>
            </td>
          </tr>
          {rows.map((c) => {
            const share = revenue ? c.amount / revenue : 0;
            return (
              <tr key={c.key} className="border-b border-line">
                <th scope="row" className="py-2 pr-3 text-left font-normal">
                  {c.label}
                  <span className="block text-xs text-fg-muted">{c.source}</span>
                </th>
                <td className="py-2 pr-3 text-right tabular-nums text-danger">− {formatBRL(c.amount)}</td>
                <td className="hidden py-2 pr-3 sm:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-surface-muted" aria-hidden="true">
                      <div className="h-1.5 rounded-full bg-fg-muted" style={{ width: `${Math.min(100, share * 100 * 2)}%` }} />
                    </div>
                    <span className="tabular-nums text-fg-muted">{formatPct(share)}</span>
                  </div>
                </td>
                <td className="py-2">
                  <Badge tone={c.origin === "estimated" ? "warning" : c.origin === "seller" ? "info" : "neutral"}>
                    {ORIGIN_LABEL[c.origin]}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className="pt-3 pr-3 text-left font-semibold">Resultado estimado</th>
            <td className="pt-3 pr-3 text-right font-semibold tabular-nums">
              {result === null ? "—" : formatBRL(result)}
            </td>
            <td className="hidden pt-3 pr-3 font-semibold tabular-nums sm:table-cell">
              {margin === null ? "" : `margem ${formatPct(margin)}`}
            </td>
            <td className="pt-3" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
