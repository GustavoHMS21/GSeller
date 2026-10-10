import type { Metadata } from "next";
import { CostsEditor } from "@/components/app/costs-editor";
import { products } from "@/lib/demo/data";

export const metadata: Metadata = { title: "Custos" };

export default function CostsPage() {
  const rows = products.map(({ id, name, sku, cost }) => ({ id, name, sku, cost }));
  const missing = rows.filter((r) => r.cost.unitCost === null).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Custos</h1>
        <p className="max-w-2xl text-sm text-fg-muted">
          Sem custo não existe resultado real. Informe o custo de cada produto e o imposto estimado
          da sua operação. Alterações criam uma nova vigência: pedidos antigos continuam usando o
          custo da época.
        </p>
      </div>

      {missing > 0 && (
        <p role="status" className="rounded-md bg-warning-soft p-3 text-sm text-warning">
          <span aria-hidden="true">▲ </span>
          {missing} {missing === 1 ? "produto está" : "produtos estão"} sem custo. O resultado
          desses produtos não é calculado até o custo ser informado.
        </p>
      )}

      <CostsEditor rows={rows} />

      <p className="text-xs text-fg-muted">
        Protótipo: as alterações ficam apenas nesta tela e não são salvas.
      </p>
    </div>
  );
}
