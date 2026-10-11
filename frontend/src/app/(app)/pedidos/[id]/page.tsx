import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { Skeleton } from "@/components/ui/states";
import { cx } from "@/lib/cx";
import { DEMO_NOW, getOrder, orders } from "@/lib/demo/order-data";
import {
  orderAttention,
  orderStatus,
  orderTimeline,
  RETURN_CONDITION_LABEL,
} from "@/lib/demo/orders";
import { conversationForOrder } from "@/lib/demo/support-data";
import { formatBRL, formatDateTime } from "@/lib/format";

// A Shopee não libera chat para aplicativos no Brasil (Bloco 60.3): o seller abre o chat lá.
const SHOPEE_SELLER_CENTER = "https://seller.shopee.com.br/";

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: PageProps<"/pedidos/[id]">) {
  const { id } = await params;
  return { title: `Pedido #${id}` };
}

export default function OrderPage({ params }: PageProps<"/pedidos/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <OrderDetail params={params} />
    </Suspense>
  );
}

async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();

  const status = orderStatus(order);
  const attention = orderAttention(order, DEMO_NOW);
  const conversation = conversationForOrder(order.id);

  return (
    <div className="space-y-6">
      <nav aria-label="Trilha" className="text-sm text-fg-muted">
        <Link href="/pedidos" className="hover:text-fg hover:underline">
          Pedidos
        </Link>{" "}
        / <span aria-current="page">#{order.id}</span>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {order.units > 1 && `${order.units}× `}
            {order.productName}
          </h1>
          <p className="flex flex-wrap items-center gap-x-2 text-sm text-fg-muted">
            #{order.id} · <MarketplaceBadge marketplace={order.marketplace} />· {order.storeName}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 text-sm">
          <Badge tone={status.tone}>{status.label}</Badge>
          <span className="tabular-nums">
            {formatBRL(order.total)}
            {order.profit !== null &&
              (order.profit < 0 ? (
                <span className="text-danger"> · prejuízo {formatBRL(-order.profit)}</span>
              ) : (
                <span className="text-fg-muted"> · lucro {formatBRL(order.profit)}</span>
              ))}
          </span>
        </div>
      </header>

      {attention && (
        <div
          role="status"
          className={cx(
            "rounded-lg border p-4",
            attention.tone === "danger"
              ? "border-danger/30 bg-danger-soft"
              : attention.tone === "warning"
                ? "border-warning/30 bg-warning-soft"
                : "border-info/30 bg-info-soft",
          )}
        >
          <p className="font-semibold">{attention.title}</p>
          <p className="text-sm">→ {attention.action}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {conversation && (
          <ButtonLink href={`/atendimento/${conversation.id}`} variant="secondary">
            Ver conversa do pedido
          </ButtonLink>
        )}
        {order.marketplace === "shopee" && (
          <ButtonLink
            href={SHOPEE_SELLER_CENTER}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            Abrir chat na Shopee
          </ButtonLink>
        )}
      </div>

      {order.returnInfo && (
        <Card>
          <CardHeader
            title="Devolução"
            description={RETURN_CONDITION_LABEL[order.returnInfo.condition]}
          />
          <dl className="space-y-2 text-sm">
            {[
              { label: "Frete de ida", value: order.returnInfo.cost.outboundShipping },
              { label: "Frete de volta", value: order.returnInfo.cost.returnShipping },
              { label: "Produto perdido", value: order.returnInfo.cost.lostProduct },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <dt>{label}</dt>
                <dd className="tabular-nums text-danger">
                  {value === null ? "—" : `− ${formatBRL(value)}`}
                </dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 border-t border-line pt-2 font-semibold">
              <dt>Custo da devolução</dt>
              <dd className="tabular-nums">
                {order.returnInfo.cost.total === null
                  ? "Cadastre o custo do produto"
                  : formatBRL(order.returnInfo.cost.total)}
              </dd>
            </div>
          </dl>
        </Card>
      )}

      <Card>
        <CardHeader title="Linha do tempo" />
        <ol className="space-y-3">
          {orderTimeline(order).map((step) => (
            <li key={step.stage} className="flex items-start gap-3 text-sm">
              <span
                aria-hidden="true"
                className={cx(
                  "mt-1 size-3 shrink-0 rounded-full",
                  step.done ? "bg-primary" : "border-2 border-line bg-surface",
                )}
              />
              <span className={cx("font-medium", !step.done && "text-fg-muted")}>{step.label}</span>
              <span className="ml-auto text-fg-muted tabular-nums">
                {step.at
                  ? `${step.done ? "" : "previsto "}${formatDateTime(step.at)}`
                  : step.done
                    ? ""
                    : "pendente"}
              </span>
              <span className="sr-only">{step.done ? "concluído" : "pendente"}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
