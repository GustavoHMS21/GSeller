import type { Metadata } from "next";
import { CostsEditor } from "@/components/app/costs-editor";
import { products } from "@/lib/demo/data";

export const metadata: Metadata = { title: "Custos" };

export default function CostsPage() {
  const rows = products.map(({ id, name, sku, cost }) => ({ id, name, sku, cost }));
  const missing = rows.filter((r) => r.cost.unitCost === null).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Custos</h1>

      {missing > 0 && (
        <p role="status" className="rounded-md bg-warning-soft p-3 text-sm text-warning">
          <span aria-hidden="true">▲ </span>
          {missing} {missing === 1 ? "produto sem custo" : "produtos sem custo"}: cadastre para ver
          o lucro.
        </p>
      )}

      <CostsEditor rows={rows} />

      <p className="text-xs text-fg-muted">
        Protótipo: as alterações ficam apenas nesta tela e não são salvas.
      </p>
    </div>
  );
}
