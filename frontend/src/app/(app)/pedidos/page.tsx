import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { EmptyState, Skeleton } from "@/components/ui/states";
import { cx } from "@/lib/cx";
import { DEMO_NOW, orders } from "@/lib/demo/order-data";
import {
  matchesFilter,
  ORDER_FILTERS,
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

export default function OrdersPage({ searchParams }: PageProps<"/pedidos">) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pedidos</h1>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <OrdersList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function OrdersList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { filtro } = await searchParams;
  const active = ORDER_FILTERS.find((f) => f.value === filtro);
  const rows = orders
    .filter((o) => !active || matchesFilter(o, active.value, DEMO_NOW))
    .map((order) => ({ order, attention: orderAttention(order, DEMO_NOW) }))
    .sort(
      (a, b) =>
        (a.attention ? URGENCY[a.attention.problem] : 9) -
          (b.attention ? URGENCY[b.attention.problem] : 9) ||
        Date.parse(b.order.events[0].at) - Date.parse(a.order.events[0].at),
    );

  const tabs = [
    { href: "/pedidos", label: "Todos", count: orders.length, current: !active },
    ...ORDER_FILTERS.map((f) => ({
      href: `/pedidos?filtro=${f.value}`,
      label: f.label,
      count: orders.filter((o) => matchesFilter(o, f.value, DEMO_NOW)).length,
      current: active?.value === f.value,
    })),
  ];

  return (
    <>
      <nav aria-label="Filtrar pedidos">
        <ul className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={tab.current ? "page" : undefined}
                className={cx(
                  "inline-flex rounded-full border px-3 py-1 text-sm font-medium",
                  tab.current
                    ? "border-primary bg-primary text-primary-fg"
                    : "border-line bg-surface text-fg-muted hover:text-fg",
                )}
              >
                {tab.label} ({tab.count})
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {rows.length === 0 ? (
        <EmptyState title="Nenhum pedido aqui" description="Tudo em dia neste filtro." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full text-sm">
            <caption className="sr-only">Pedidos e o que fazer em cada um</caption>
            <thead>
              <tr className="border-b border-line text-left text-xs text-fg-muted">
                <th scope="col" className="px-4 py-2 font-medium">
                  Pedido
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Produto
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Situação
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  O que fazer
                </th>
                <th scope="col" className="px-4 py-2 text-right font-medium">
                  Lucro
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ order, attention }) => {
                const status = orderStatus(order);
                return (
                  <tr key={order.id} className="border-b border-line last:border-0 align-top">
                    <td className="px-4 py-3">
                      <Link
                        href={`/pedidos/${order.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        #{order.id}
                      </Link>
                      <p className="text-xs text-fg-muted">{formatDateTime(order.events[0].at)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {order.units > 1 && `${order.units}× `}
                        {order.productName}
                      </p>
                      <p className="flex flex-wrap items-center gap-x-2 text-xs text-fg-muted">
                        <MarketplaceBadge marketplace={order.marketplace} />· {order.storeName}
                      </p>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
