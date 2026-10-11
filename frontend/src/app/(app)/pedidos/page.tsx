import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ModuleLayout, ModuleSidebar } from "@/components/app/module-sidebar";
import { Badge } from "@/components/ui/badge";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { EmptyState, Skeleton } from "@/components/ui/states";
import { MARKETPLACES } from "@/lib/business";
import { cx } from "@/lib/cx";
import { DEMO_NOW, orders } from "@/lib/demo/order-data";
import {
  matchesFilter,
  ORDER_FILTERS,
  type OrderFilter,
  type OrderProblem,
  orderAttention,
  orderStatus,
} from "@/lib/demo/orders";
import { formatBRL, formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Pedidos" };

// O mais urgente primeiro; sem problema, o mais recente primeiro.
const URGENCY: Record<OrderProblem, number> = {
  claim: 0,
  return_damaged: 0,
  late_to_ship: 1,
  ship_today: 2,
  late_delivery: 3,
  return_on_the_way: 4,
};

// Grupos da lateral na lógica do UpSeller: processar, concluídos e pós-venda (Bloco 60.9).
const SIDEBAR_GROUPS: { title: string; filters: OrderFilter[] }[] = [
  { title: "Processando Pedidos", filters: ["emitir", "enviar", "atrasados"] },
  { title: "Concluídos", filters: ["enviados", "entregues", "cancelados"] },
  { title: "Pós-venda", filters: ["reclamacao", "devolvidos"] },
];

const filterHref = (filter?: OrderFilter) => (filter ? `/pedidos?filtro=${filter}` : "/pedidos");
const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default function OrdersPage({ searchParams }: PageProps<"/pedidos">) {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <OrdersModule searchParams={searchParams} />
    </Suspense>
  );
}

async function OrdersModule({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const active = ORDER_FILTERS.find((f) => f.value === one(params.filtro));
  const query = (one(params.q) ?? "").trim().toLowerCase();
  const platform = MARKETPLACES.find((m) => m.value === one(params.plataforma))?.value;

  const rows = orders
    .filter((o) => !active || matchesFilter(o, active.value, DEMO_NOW))
    .filter((o) => !platform || o.marketplace === platform)
    .filter(
      (o) =>
        !query || o.id.toLowerCase().includes(query) || o.productName.toLowerCase().includes(query),
    )
    .map((order) => ({ order, attention: orderAttention(order, DEMO_NOW) }))
    .sort(
      (a, b) =>
        (a.attention ? URGENCY[a.attention.problem] : 9) -
          (b.attention ? URGENCY[b.attention.problem] : 9) ||
        Date.parse(b.order.events[0].at) - Date.parse(a.order.events[0].at),
    );

  const count = (filter: OrderFilter) =>
    orders.filter((o) => matchesFilter(o, filter, DEMO_NOW)).length;
  const label = (filter: OrderFilter) => ORDER_FILTERS.find((f) => f.value === filter)?.label;

  return (
    <ModuleLayout
      sidebar={
        <ModuleSidebar
          title="Pedidos"
          activeHref={filterHref(active?.value)}
          sections={[
            { items: [{ href: "/pedidos", label: "Todos os Pedidos", count: orders.length }] },
            ...SIDEBAR_GROUPS.map((group) => ({
              title: group.title,
              items: group.filters.map((f) => ({
                href: filterHref(f),
                label: label(f) ?? f,
                count: count(f),
              })),
            })),
          ]}
        />
      }
    >
      <h1 className="text-2xl font-semibold">{active ? active.label : "Todos os Pedidos"}</h1>

      <search>
        <form
          method="get"
          action="/pedidos"
          className="flex flex-wrap items-end gap-3 rounded-lg border border-line bg-surface p-3"
        >
          {active && <input type="hidden" name="filtro" value={active.value} />}
          <label className="min-w-56 flex-1 space-y-1 text-sm">
            <span className="text-fg-muted">Nº do pedido ou produto</span>
            <input
              name="q"
              defaultValue={one(params.q)}
              placeholder="Ex.: 2000012345678901"
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-fg-muted">Plataforma</span>
            <select
              name="plataforma"
              defaultValue={platform ?? ""}
              className="block rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg"
            >
              <option value="">Todas</option>
              {MARKETPLACES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover"
          >
            Buscar
          </button>
          {(query || platform) && (
            <Link
              href={filterHref(active?.value)}
              className="py-2 text-sm text-primary hover:underline"
            >
              Limpar
            </Link>
          )}
        </form>
      </search>

      {rows.length === 0 ? (
        <EmptyState title="Nenhum pedido encontrado" description="Tudo em dia com estes filtros." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full text-sm">
            <caption className="sr-only">Pedidos e o que fazer em cada um</caption>
            <thead>
              <tr className="border-b border-line bg-surface-muted text-left text-xs text-fg-muted">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Produtos
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  Valor do Pedido
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Nº de Pedido da Plataforma
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Tempo
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Estado
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  O que fazer
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  Lucro
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ order, attention }) => {
                const status = orderStatus(order);
                return (
                  <tr key={order.id} className="border-b border-line align-top last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {order.units > 1 && `${order.units}× `}
                        {order.productName}
                      </p>
                      <p className="flex flex-wrap items-center gap-x-2 text-xs text-fg-muted">
                        <MarketplaceBadge marketplace={order.marketplace} />· {order.storeName}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatBRL(order.total)}</td>
                    <td className="px-4 py-3 tabular-nums">{order.id}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-fg-muted">
                      {formatDateTime(order.events[0].at)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {attention ? (
                        <>
                          <p className="font-medium">{attention.title}</p>
                          <p className="text-fg-muted">{attention.action}</p>
                        </>
                      ) : (
                        <span className="text-fg-muted">—</span>
                      )}
                    </td>
                    <td
                      className={cx(
                        "px-4 py-3 text-right tabular-nums",
                        order.profit !== null && order.profit < 0 && "text-danger",
                      )}
                    >
                      {order.profit === null ? "—" : formatBRL(order.profit)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/pedidos/${order.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        Ver
                        <span className="sr-only"> pedido {order.id}</span>
                      </Link>
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
