import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ModuleLayout, ModuleSidebar, PRODUCTS_NAV } from "@/components/app/module-sidebar";
import { Badge } from "@/components/ui/badge";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { EmptyState, Skeleton } from "@/components/ui/states";
import { listingMappings, products } from "@/lib/demo/data";
import {
  hasProblem,
  listingKey,
  MAPPING_FILTERS,
  matchesMappingFilter,
  STATUS_LABEL,
} from "@/lib/demo/mapping";
import { formatBRL, formatInt } from "@/lib/format";
import { LinkForm } from "./link-form";

export const metadata: Metadata = { title: "Mapeamento de SKU" };

export default function MappingPage({ searchParams }: PageProps<"/produtos/mapeamento">) {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <MappingList searchParams={searchParams} />
    </Suspense>
  );
}

async function MappingList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { filtro } = await searchParams;
  const active = MAPPING_FILTERS.find((f) => f.value === filtro);
  const rows = listingMappings
    .filter((m) => !active || matchesMappingFilter(m, active.value))
    .sort(
      (a, b) =>
        Number(hasProblem(b)) - Number(hasProblem(a)) || b.listing.revenue - a.listing.revenue,
    );
  const problems = listingMappings.filter(hasProblem);
  const lostRevenue = problems.reduce((sum, m) => sum + m.listing.revenue, 0);
  const options = products.map((p) => ({ id: p.id, label: `${p.name} (${p.sku})` }));

  const href = (value?: string) =>
    value ? `/produtos/mapeamento?filtro=${value}` : "/produtos/mapeamento";

  return (
    <ModuleLayout
      sidebar={
        <ModuleSidebar
          title="Produtos"
          activeHref={href(active?.value)}
          sections={[
            ...PRODUCTS_NAV,
            {
              title: "Anúncios",
              items: MAPPING_FILTERS.map((f) => ({
                href: href(f.value),
                label: f.label,
                count: listingMappings.filter((m) => matchesMappingFilter(m, f.value)).length,
              })),
            },
          ]}
        />
      }
    >
      <div>
        <h1 className="text-2xl font-semibold">Mapeamento de SKU</h1>
        <p className="mt-1 text-sm text-fg-muted">
          {problems.length === 0
            ? "Todos os anúncios estão vinculados a um produto com custo."
            : `${formatBRL(lostRevenue)} em vendas de ${problems.length} anúncios sem lucro calculado nos últimos 30 dias.`}
        </p>
      </div>
      {rows.length === 0 ? (
        <EmptyState title="Nenhum anúncio" description="Nada neste filtro." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full min-w-[820px] text-sm">
            <caption className="sr-only">Anúncios e o produto vinculado a cada um</caption>
            <thead>
              <tr className="border-b border-line text-left text-xs text-fg-muted">
                <th scope="col" className="px-4 py-3 font-medium">
                  Anúncio
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  SKU no anúncio
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Produto
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Vendas · 30 dias
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Situação
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  O que fazer
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => {
                const status = STATUS_LABEL[m.status];
                return (
                  <tr
                    key={listingKey(m.listing)}
                    className="border-b border-line align-top last:border-0"
                  >
                    <th scope="row" className="px-4 py-3 text-left font-normal">
                      <span className="font-medium">{m.listing.title}</span>
                      <span className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
                        <MarketplaceBadge marketplace={m.listing.marketplace} />
                        {m.listing.externalId}
                      </span>
                    </th>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                      {m.listing.sku?.trim() || <span className="text-fg-muted">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {m.product ? (
                        <Link
                          href={`/produtos/${m.product.id}`}
                          className="text-primary hover:underline"
                        >
                          {m.product.name}
                        </Link>
                      ) : (
                        <span className="text-fg-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatBRL(m.listing.revenue)}
                      <span className="block text-xs text-fg-muted">
                        {formatInt(m.listing.orders)} pedidos
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={status.tone} icon={hasProblem(m) ? "!" : "✓"}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {m.action}
                      {m.status === "no_cost" && (
                        <Link href="/custos" className="ml-1 text-primary hover:underline">
                          Ir para Custos
                        </Link>
                      )}
                      {(m.status === "unknown_sku" || m.status === "no_sku") && (
                        <LinkForm products={options} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ModuleLayout>
  );
}
