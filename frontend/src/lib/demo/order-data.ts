// Pedidos de DEMONSTRAÇÃO (issue #50): um caso de cada situação que o seller precisa enxergar.
// Nenhum dado de comprador: o pedido nunca guarda nome, telefone ou endereço (Bloco 50.4).

import { connections, DEMO, getProduct } from "@/lib/demo/data";
import { returnCost } from "@/lib/demo/orders";
import type { Marketplace, Order, OrderStage, ReturnCondition } from "@/lib/types";

/** "Agora" da demonstração: a última sincronização, para os prazos fazerem sentido. */
export const DEMO_NOW = new Date(DEMO.lastSyncAt);

interface OrderSeed {
  id: string;
  productId: string;
  marketplace: Marketplace;
  units: number;
  events: [OrderStage, string][];
  shipBy?: string;
  deliverBy?: string;
  claimReplyBy?: string;
  /** Obrigatório quando o pedido tem devolução ou reembolso. */
  returned?: { condition: ReturnCondition; returnShipping: number };
}

const SEEDS: OrderSeed[] = [
  {
    id: "2000012345678901",
    productId: "cam-ovs-pt",
    marketplace: "mercadolivre",
    units: 1,
    events: [
      ["paid", "2026-10-08T09:10:00-03:00"],
      ["invoiced", "2026-10-08T09:30:00-03:00"],
      ["ready_to_ship", "2026-10-08T09:40:00-03:00"],
    ],
    shipBy: "2026-10-08T18:00:00-03:00",
    deliverBy: "2026-10-11T21:00:00-03:00",
  },
  {
    id: "2000012345678902",
    productId: "gar-trm-1l",
    marketplace: "mercadolivre",
    units: 2,
    events: [
      ["paid", "2026-10-06T20:05:00-03:00"],
      ["invoiced", "2026-10-06T20:20:00-03:00"],
      ["ready_to_ship", "2026-10-07T08:00:00-03:00"],
    ],
    shipBy: "2026-10-07T18:00:00-03:00",
    deliverBy: "2026-10-10T21:00:00-03:00",
  },
  {
    id: "2000012345678911",
    productId: "fon-bt-x1",
    marketplace: "mercadolivre",
    units: 1,
    events: [
      ["paid", "2026-09-29T15:00:00-03:00"],
      ["invoiced", "2026-09-29T15:20:00-03:00"],
      ["ready_to_ship", "2026-09-30T09:00:00-03:00"],
      ["shipped", "2026-10-01T11:00:00-03:00"],
      ["claim_opened", "2026-10-07T10:15:00-03:00"],
    ],
    deliverBy: "2026-10-04T21:00:00-03:00",
    claimReplyBy: "2026-10-08T20:00:00-03:00",
  },
  {
    id: "2000012345678905",
    productId: "lum-led-m",
    marketplace: "mercadolivre",
    units: 1,
    events: [
      ["paid", "2026-09-30T19:40:00-03:00"],
      ["invoiced", "2026-09-30T20:00:00-03:00"],
      ["ready_to_ship", "2026-10-01T08:30:00-03:00"],
      ["shipped", "2026-10-01T16:00:00-03:00"],
      ["delivered", "2026-10-04T14:10:00-03:00"],
      ["claim_opened", "2026-10-07T16:00:00-03:00"],
    ],
    deliverBy: "2026-10-05T21:00:00-03:00",
    claimReplyBy: "2026-10-09T16:00:00-03:00",
  },
  {
    id: "2000012345678903",
    productId: "fon-bt-x1",
    marketplace: "mercadolivre",
    units: 1,
    events: [
      ["paid", "2026-10-02T10:00:00-03:00"],
      ["invoiced", "2026-10-02T10:20:00-03:00"],
      ["ready_to_ship", "2026-10-02T14:00:00-03:00"],
      ["shipped", "2026-10-03T10:00:00-03:00"],
    ],
    deliverBy: "2026-10-06T21:00:00-03:00",
  },
  {
    id: "251001P9R2LT",
    productId: "moc-exe-01",
    marketplace: "shopee",
    units: 1,
    events: [
      ["paid", "2026-09-26T21:00:00-03:00"],
      ["invoiced", "2026-09-26T21:30:00-03:00"],
      ["ready_to_ship", "2026-09-27T09:00:00-03:00"],
      ["shipped", "2026-09-27T15:00:00-03:00"],
      ["delivered", "2026-10-01T12:00:00-03:00"],
      ["claim_opened", "2026-10-03T09:00:00-03:00"],
      ["return_shipped", "2026-10-07T13:00:00-03:00"],
    ],
    returned: { condition: "on_the_way", returnShipping: 24 },
  },
  {
    id: "251007K3M8QX",
    productId: "kit-cue-3",
    marketplace: "shopee",
    units: 1,
    events: [["paid", "2026-10-07T11:00:00-03:00"]],
    shipBy: "2026-10-09T23:59:00-03:00",
    deliverBy: "2026-10-13T21:00:00-03:00",
  },
  {
    id: "2000012345678910",
    productId: "cam-ovs-pt",
    marketplace: "mercadolivre",
    units: 2,
    events: [
      ["paid", "2026-10-08T13:50:00-03:00"],
      ["invoiced", "2026-10-08T14:05:00-03:00"],
    ],
    shipBy: "2026-10-09T18:00:00-03:00",
    deliverBy: "2026-10-12T21:00:00-03:00",
  },
  {
    id: "2000012345678907",
    productId: "cap-nb-15",
    marketplace: "mercadolivre",
    units: 1,
    events: [
      ["paid", "2026-10-06T08:15:00-03:00"],
      ["invoiced", "2026-10-06T08:40:00-03:00"],
      ["ready_to_ship", "2026-10-06T10:00:00-03:00"],
      ["shipped", "2026-10-07T09:30:00-03:00"],
    ],
    deliverBy: "2026-10-10T21:00:00-03:00",
  },
  {
    id: "251006T4W7ZB",
    productId: "cam-ovs-pt",
    marketplace: "shopee",
    units: 3,
    events: [
      ["paid", "2026-10-06T17:20:00-03:00"],
      ["invoiced", "2026-10-06T17:45:00-03:00"],
      ["ready_to_ship", "2026-10-07T08:00:00-03:00"],
      ["shipped", "2026-10-07T14:00:00-03:00"],
    ],
    deliverBy: "2026-10-11T21:00:00-03:00",
  },
  {
    id: "2000012345678904",
    productId: "org-gav-6",
    marketplace: "mercadolivre",
    units: 1,
    events: [
      ["paid", "2026-10-01T12:00:00-03:00"],
      ["invoiced", "2026-10-01T12:20:00-03:00"],
      ["ready_to_ship", "2026-10-01T15:00:00-03:00"],
      ["shipped", "2026-10-02T10:00:00-03:00"],
      ["delivered", "2026-10-05T11:30:00-03:00"],
    ],
    deliverBy: "2026-10-06T21:00:00-03:00",
  },
  {
    id: "2000012345678909",
    productId: "moc-exe-01",
    marketplace: "mercadolivre",
    units: 1,
    events: [
      ["paid", "2026-10-02T18:00:00-03:00"],
      ["invoiced", "2026-10-02T18:30:00-03:00"],
      ["ready_to_ship", "2026-10-03T08:00:00-03:00"],
      ["shipped", "2026-10-03T13:00:00-03:00"],
      ["delivered", "2026-10-06T10:00:00-03:00"],
    ],
    deliverBy: "2026-10-07T21:00:00-03:00",
  },
  {
    id: "2000012345678906",
    productId: "kit-cue-3",
    marketplace: "mercadolivre",
    units: 2,
    events: [
      ["paid", "2026-09-25T10:00:00-03:00"],
      ["invoiced", "2026-09-25T10:30:00-03:00"],
      ["ready_to_ship", "2026-09-25T14:00:00-03:00"],
      ["shipped", "2026-09-26T09:00:00-03:00"],
      ["delivered", "2026-09-29T15:00:00-03:00"],
      ["claim_opened", "2026-09-30T08:00:00-03:00"],
      ["return_shipped", "2026-10-01T10:00:00-03:00"],
      ["returned", "2026-10-04T11:00:00-03:00"],
      ["refunded", "2026-10-04T11:05:00-03:00"],
    ],
    returned: { condition: "good", returnShipping: 19.9 },
  },
  {
    id: "2000012345678912",
    productId: "moc-exe-01",
    marketplace: "mercadolivre",
    units: 1,
    events: [
      ["paid", "2026-09-27T14:00:00-03:00"],
      ["invoiced", "2026-09-27T14:20:00-03:00"],
      ["ready_to_ship", "2026-09-28T08:00:00-03:00"],
      ["shipped", "2026-09-28T13:00:00-03:00"],
      ["delivered", "2026-10-01T10:00:00-03:00"],
      ["claim_opened", "2026-10-02T09:00:00-03:00"],
      ["return_shipped", "2026-10-03T11:00:00-03:00"],
      ["returned", "2026-10-07T15:30:00-03:00"],
    ],
    returned: { condition: "damaged", returnShipping: 29.9 },
  },
  {
    id: "2000012345678913",
    productId: "fon-bt-x1",
    marketplace: "mercadolivre",
    units: 1,
    events: [
      ["paid", "2026-09-22T09:00:00-03:00"],
      ["invoiced", "2026-09-22T09:20:00-03:00"],
      ["ready_to_ship", "2026-09-22T13:00:00-03:00"],
      ["shipped", "2026-09-23T10:00:00-03:00"],
      ["claim_opened", "2026-09-30T08:00:00-03:00"],
      ["refunded", "2026-10-02T16:00:00-03:00"],
    ],
    returned: { condition: "not_returned", returnShipping: 0 },
  },
  {
    id: "2000012345678908",
    productId: "gar-trm-1l",
    marketplace: "mercadolivre",
    units: 1,
    events: [
      ["paid", "2026-10-05T09:00:00-03:00"],
      ["cancelled", "2026-10-05T09:40:00-03:00"],
    ],
  },
];

const RETURN_STAGES: OrderStage[] = ["return_shipped", "returned", "refunded"];

function buildOrder(seed: OrderSeed): Order {
  const product = getProduct(seed.productId);
  const listing = product?.listings.find((l) => l.marketplace === seed.marketplace);
  if (!product || !listing) throw new Error(`Pedido de demonstração inválido: ${seed.id}`);
  const economics = listing.period.current;
  // Lucro por unidade do anúncio, o mesmo número das telas de produto.
  const unitProfit = economics.result === null ? null : economics.result / economics.units;
  const hasReturn = seed.events.some(([stage]) => RETURN_STAGES.includes(stage));
  if (hasReturn !== Boolean(seed.returned)) {
    throw new Error(`Pedido de demonstração sem dados da devolução: ${seed.id}`);
  }
  const shippingPerUnit =
    (economics.components.find((c) => c.key === "shipping")?.amount ?? 0) / economics.units;
  const unitCost =
    product.cost.unitCost === null ? null : product.cost.unitCost + product.cost.additionalUnitCost;
  const returnInfo = seed.returned
    ? {
        condition: seed.returned.condition,
        cost: returnCost({
          condition: seed.returned.condition,
          units: seed.units,
          unitCost,
          outboundShipping: shippingPerUnit * seed.units,
          returnShipping: seed.returned.returnShipping,
        }),
      }
    : null;
  const cancelled = seed.events.some(([stage]) => stage === "cancelled");
  // Devolução: o pedido vira prejuízo do tamanho do custo da devolução.
  const profit = returnInfo
    ? returnInfo.cost.total === null
      ? null
      : -returnInfo.cost.total
    : unitProfit === null || cancelled
      ? null
      : unitProfit * seed.units;
  return {
    id: seed.id,
    marketplace: seed.marketplace,
    storeName: connections.find((c) => c.marketplace === seed.marketplace)?.shopName ?? "",
    productId: product.id,
    productName: product.name,
    units: seed.units,
    total: economics.avgPrice * seed.units,
    profit,
    shipBy: seed.shipBy ?? null,
    deliverBy: seed.deliverBy ?? null,
    claimReplyBy: seed.claimReplyBy ?? null,
    events: seed.events.map(([stage, at]) => ({ stage, at })),
    returnInfo,
  };
}

export const orders: Order[] = SEEDS.map(buildOrder);

export function getOrder(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}
