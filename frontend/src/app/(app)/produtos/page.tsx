import type { Metadata } from "next";
import { ProductsTable } from "@/components/app/products-table";
import { products } from "@/lib/demo/data";

export const metadata: Metadata = { title: "Produtos" };

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <p className="text-sm text-fg-muted">
          Cada produto reúne seus anúncios em todos os canais. Por padrão, os que precisam de mais
          atenção aparecem primeiro.
        </p>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
