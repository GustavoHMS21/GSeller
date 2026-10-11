import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EconomicsBreakdown } from "@/components/app/economics-breakdown";
import { InsightCard } from "@/components/app/insight-card";
import { Card, CardHeader } from "@/components/ui/card";
import { HealthBadge } from "@/components/ui/health-badge";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { Skeleton } from "@/components/ui/states";
import { getProduct, insights, products } from "@/lib/demo/data";
import { formatBRL, formatInt, formatPct } from "@/lib/format";
import type { Economics, Product } from "@/lib/types";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/produtos/[id]">) {
  const { id } = await params;
  return { title: getProduct(id)?.name ?? "Produto" };
}

export default function ProductPage({ params }: PageProps<"/produtos/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const productInsights = insights.filter((i) => i.productId === product.id);
  const { cost } = product;

  return (
    <div className="space-y-6">
      <nav aria-label="Trilha" className="text-sm text-fg-muted">
        <Link href="/produtos" className="hover:text-fg hover:underline">
          Produtos
        </Link>{" "}
        / <span aria-current="page">{product.name}</span>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-sm text-fg-muted">
            {product.sku} · {product.category} · {product.listings.length}{" "}
            {product.listings.length === 1 ? "anúncio" : "anúncios"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 text-sm">
          <HealthBadge level={product.health.level} score={product.health.score} />
          <span className="text-fg-muted">
            {cost.unitCost === null ? (
              <Link href="/custos" className="text-primary hover:underline">
                Informar custo do produto
              </Link>
            ) : (
              <>
                Custo {formatBRL(cost.unitCost)}/un. ·{" "}
                <Link href="/custos" className="text-primary hover:underline">
                  editar
                </Link>
              </>
            )}
          </span>
        </div>
      </header>

      <section aria-labelledby="alertas" className="space-y-3">
        <h2 id="alertas" className="text-lg font-semibold">
          O que corrigir
        </h2>
        {productInsights.length === 0 ? (
          <p className="text-sm text-fg-muted">Nada a corrigir neste produto.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {productInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} showProduct={false} />
            ))}
          </div>
        )}
      </section>

      <Card>
        <CardHeader title="Por marketplace" />
        <ChannelComparison product={product} />
      </Card>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader title="Para onde foi o dinheiro" />
          {product.totals.current.result === null && (
            <Link
              href="/custos"
              className="mb-3 block rounded-md bg-warning-soft p-3 text-sm text-warning hover:underline"
            >
              ▲ Cadastre o custo para ver o lucro.
            </Link>
          )}
          <EconomicsBreakdown economics={product.totals.current} />
        </Card>

        <Card>
          <CardHeader title="Saúde do produto" />
          <p className="text-hero font-semibold tabular-nums">{product.health.score ?? "—"}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {product.health.components.length === 0 ? (
              <li className="text-fg-muted">Tudo em ordem.</li>
            ) : (
              product.health.components.map((c) => (
                <li key={c.label} className="flex justify-between gap-2">
                  <span>{c.label}</span>
                  <span className="tabular-nums text-danger">{c.points !== 0 ? c.points : ""}</span>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>

      {product.variants.length > 0 && (
        <Card>
          <CardHeader title="Variações" />
          <table className="w-full max-w-xl text-sm">
            <caption className="sr-only">Unidades por variação</caption>
            <thead>
              <tr className="border-b border-line text-left text-xs text-fg-muted">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Variação
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  SKU
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-medium">
                  Unidades
                </th>
                <th scope="col" className="py-2 text-right font-medium">
                  Participação
                </th>
              </tr>
            </thead>
            <tbody>
              {product.variants.map((v) => (
                <tr key={v.sku} className="border-b border-line last:border-0">
                  <th scope="row" className="py-2 pr-4 text-left font-normal">
                    {v.name}
                  </th>
                  <td className="py-2 pr-4 text-fg-muted">{v.sku}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{formatInt(v.unitsCurrent)}</td>
                  <td className="py-2 text-right tabular-nums">
                    {formatPct(v.unitsCurrent / product.totals.current.units)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function ChannelComparison({ product }: { product: Product }) {
  const listings = product.listings;
  const unit = (e: Economics) => (e.result !== null && e.units ? e.result / e.units : null);
  const money = (v: number | null) => (v === null ? "—" : formatBRL(v));
  const pct = (v: number | null) => (v === null ? "—" : formatPct(v));

  const metrics: Array<{ label: string; value: (e: Economics) => string }> = [
    { label: "Preço médio", value: (e) => formatBRL(e.avgPrice) },
    { label: "Receita", value: (e) => formatBRL(e.revenue) },
    { label: "Unidades", value: (e) => formatInt(e.units) },
    { label: "Visitas", value: (e) => (e.visits === null ? "—" : formatInt(e.visits)) },
    { label: "Conversão", value: (e) => pct(e.conversion) },
    { label: "Gasto com Ads", value: (e) => formatBRL(e.adsSpend) },
    { label: "Vendas por Ads", value: (e) => formatBRL(e.adsAttributedRevenue) },
    { label: "Lucro estimado", value: (e) => money(e.result) },
    { label: "Lucro por unidade", value: (e) => money(unit(e)) },
    { label: "Margem estimada", value: (e) => pct(e.margin) },
  ];

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <caption className="sr-only">Métricas do produto por marketplace</caption>
          <thead>
            <tr className="border-b border-line text-left text-xs text-fg-muted">
              <th scope="col" className="py-2 pr-4 font-medium">
                Métrica
              </th>
              {listings.map((l) => (
                <th key={l.marketplace} scope="col" className="py-2 pr-4 text-right font-medium">
                  <MarketplaceBadge marketplace={l.marketplace} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.label} className="border-b border-line last:border-0">
                <th scope="row" className="py-2 pr-4 text-left font-normal text-fg-muted">
                  {m.label}
                </th>
                {listings.map((l) => (
                  <td key={l.marketplace} className="py-2 pr-4 text-right tabular-nums">
                    {m.value(l.period.current)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
