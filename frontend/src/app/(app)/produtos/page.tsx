import type { Metadata } from "next";
import { ProductsTable } from "@/components/app/products-table";
import { products } from "@/lib/demo/data";

export const metadata: Metadata = { title: "Produtos" };

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Produtos</h1>
      <ProductsTable products={products} />
    </div>
  );
}
