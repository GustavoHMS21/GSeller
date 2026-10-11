import { describe, expect, it } from "vitest";
import { DEMO_NOW, orders } from "@/lib/demo/order-data";
import {
  matchesFilter,
  ORDER_FILTERS,
  orderAttention,
  orderTimeline,
  returnCost,
} from "@/lib/demo/orders";
import type { Order, OrderStage } from "@/lib/types";

const NOW = new Date("2026-10-08T14:32:00-03:00");

function order(events: [OrderStage, string][], extra: Partial<Order> = {}): Order {
  return {
    id: "1",
    marketplace: "mercadolivre",
    storeName: "Loja",
    productId: "p",
    productName: "Produto",
    units: 1,
    total: 100,
    profit: 10,
    shipBy: null,
    deliverBy: null,
    claimReplyBy: null,
    events: events.map(([stage, at]) => ({ stage, at })),
    returnInfo: null,
    ...extra,
  };
}

const PAID: [OrderStage, string] = ["paid", "2026-10-07T10:00:00-03:00"];
const SHIPPED: [OrderStage, string] = ["shipped", "2026-10-07T15:00:00-03:00"];

describe("orderAttention", () => {
  it("envio vencido é atrasado", () => {
    const o = order([PAID], { shipBy: "2026-10-08T12:00:00-03:00" });
    expect(orderAttention(o, NOW)?.problem).toBe("late_to_ship");
  });

  it("prazo de postagem hoje, ainda no horário, pede para postar até a hora", () => {
    const o = order([PAID], { shipBy: "2026-10-08T18:00:00-03:00" });
    expect(orderAttention(o, NOW)).toMatchObject({
      problem: "ship_today",
      action: "Poste até 18:00 para não atrasar.",
    });
  });

  it("prazo de postagem amanhã não pede ação", () => {
    const o = order([PAID], { shipBy: "2026-10-09T00:30:00-03:00" });
    expect(orderAttention(o, NOW)).toBeNull();
  });

  it("enviado depois da previsão de entrega é entrega atrasada", () => {
    const o = order([PAID, SHIPPED], { deliverBy: "2026-10-08T12:00:00-03:00" });
    expect(orderAttention(o, NOW)?.problem).toBe("late_delivery");
  });

  it("reclamação vem antes de qualquer outro problema e mostra o prazo", () => {
    const o = order([PAID, SHIPPED, ["claim_opened", "2026-10-08T09:00:00-03:00"]], {
      deliverBy: "2026-10-08T12:00:00-03:00",
      claimReplyBy: "2026-10-09T16:00:00-03:00",
    });
    expect(orderAttention(o, NOW)).toMatchObject({
      problem: "claim",
      action: "Responda até 09/10, 16:00 para não perder a disputa.",
    });
  });

  it("produto que voltou avariado pede para contestar a devolução", () => {
    const o = order([PAID, SHIPPED, ["returned", "2026-10-08T09:00:00-03:00"]], {
      returnInfo: {
        condition: "damaged",
        cost: { outboundShipping: 0, returnShipping: 0, lostProduct: 0, total: 0 },
      },
    });
    expect(orderAttention(o, NOW)?.problem).toBe("return_damaged");
  });

  it("entregue não pede ação", () => {
    const o = order([PAID, SHIPPED, ["delivered", "2026-10-08T10:00:00-03:00"]], {
      deliverBy: "2026-10-08T09:00:00-03:00",
    });
    expect(orderAttention(o, NOW)).toBeNull();
  });
});

describe("returnCost", () => {
  const base = { units: 2, unitCost: 50, outboundShipping: 18, returnShipping: 20 };

  it("produto que volta inteiro: perde só os dois fretes", () => {
    expect(returnCost({ ...base, condition: "good" })).toEqual({
      outboundShipping: 18,
      returnShipping: 20,
      lostProduct: 0,
      total: 38,
    });
  });

  it("produto avariado: perde também o custo das unidades", () => {
    expect(returnCost({ ...base, condition: "damaged" }).total).toBe(138);
  });

  it("reembolso sem o produto voltar: sem frete de volta, produto perdido", () => {
    expect(returnCost({ ...base, condition: "not_returned" })).toMatchObject({
      returnShipping: 0,
      lostProduct: 100,
      total: 118,
    });
  });

  it("sem custo cadastrado, não inventa o prejuízo", () => {
    expect(returnCost({ ...base, unitCost: null, condition: "damaged" }).total).toBeNull();
  });
});

describe("orderTimeline", () => {
  it("prevê as etapas que faltam a partir da etapa atual, mesmo sem nota emitida", () => {
    const o = order([PAID, ["ready_to_ship", "2026-10-07T12:00:00-03:00"]], {
      deliverBy: "2026-10-10T21:00:00-03:00",
    });
    const steps = orderTimeline(o);
    expect(steps.map((s) => [s.stage, s.done])).toEqual([
      ["paid", true],
      ["ready_to_ship", true],
      ["shipped", false],
      ["delivered", false],
    ]);
    expect(steps.at(-1)?.at).toBe("2026-10-10T21:00:00-03:00");
  });

  it("depois de um desvio (reclamação, devolução) mostra só o que aconteceu", () => {
    const o = order([PAID, SHIPPED, ["claim_opened", "2026-10-08T09:00:00-03:00"]]);
    expect(orderTimeline(o).every((s) => s.done)).toBe(true);
  });
});

describe("pedidos de demonstração", () => {
  it("cada filtro tem ao menos um pedido, para a entrevista mostrar todos os casos", () => {
    for (const { value } of ORDER_FILTERS) {
      expect(
        orders.some((o) => matchesFilter(o, value, DEMO_NOW)),
        value,
      ).toBe(true);
    }
  });

  it("cada pedido está em exatamente uma aba de status (fora Atrasados, que é atalho)", () => {
    const statusTabs = ORDER_FILTERS.filter(
      (f) => f.value !== "atrasados" && f.value !== "devolvidos",
    );
    for (const o of orders.filter((o) => !o.returnInfo)) {
      const tabs = statusTabs.filter((f) => matchesFilter(o, f.value, DEMO_NOW));
      expect(tabs.length, o.id).toBe(1);
    }
  });

  it("pedido devolvido entra com prejuízo igual ao custo da devolução", () => {
    for (const o of orders.filter((o) => o.returnInfo)) {
      expect(o.profit, o.id).toBe(
        o.returnInfo?.cost.total == null ? null : -o.returnInfo.cost.total,
      );
    }
  });

  it("todo pedido começa no pagamento e tem etapas em ordem cronológica", () => {
    for (const o of orders) {
      expect(o.events[0].stage).toBe("paid");
      const times = o.events.map((e) => Date.parse(e.at));
      expect(times).toEqual([...times].sort((a, b) => a - b));
    }
  });
});
