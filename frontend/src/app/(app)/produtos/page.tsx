import type { Metadata } from "next";
import { ModuleLayout, ModuleSidebar, PRODUCTS_NAV } from "@/components/app/module-sidebar";
import { ProductsTable } from "@/components/app/products-table";
import { products } from "@/lib/demo/data";

export const metadata: Metadata = { title: "Produtos" };

export default function ProductsPage() {
  return (
    <ModuleLayout
      sidebar={<ModuleSidebar title="Produtos" sections={PRODUCTS_NAV} activeHref="/produtos" />}
    >
      <h1 className="text-2xl font-semibold">Lista de Produtos</h1>
      <ProductsTable products={products} />
    </ModuleLayout>
  );
}
