import { describe, expect, it } from "vitest";
import { computeEconomics, type PeriodInput, sumEconomics } from "@/lib/demo/economics";
import type { ProductCost } from "@/lib/types";

const INPUT: PeriodInput = {
  units: 10,
  orders: 8,
  avgPrice: 100,
  sellerDiscount: 50,
  commissionRate: 0.1,
  fixedFeePerUnit: 2,
  sellerShipping: 30,
  adsSpend: 40,
  adsAttributedRevenue: 500,
  visits: 200,
  refunds: 20,
};

const COST: ProductCost = {
  unitCost: 30,
  taxRate: 0.05,
  additionalUnitCost: 1,
  validFrom: "2026-01-01",
};

const amountOf = (keys: string[], components: { key: string; amount: number }[]) =>
  Object.fromEntries(keys.map((k) => [k, components.find((c) => c.key === k)?.amount]));

describe("computeEconomics", () => {
  it("calcula resultado e margem a partir de todos os componentes (golden case)", () => {
    const e = computeEconomics("mercadolivre", INPUT, COST);

    expect(e.revenue).toBe(1000);
    expect(
      amountOf(
        [
          "discount",
          "commission",
          "fixed_fee",
          "shipping",
          "ads",
          "refunds",
          "product_cost",
          "additional_cost",
          "tax",
        ],
        e.components,
      ),
    ).toEqual({
      discount: 50,
      commission: 100,
      fixed_fee: 20,
      shipping: 30,
      ads: 40,
      refunds: 20,
      product_cost: 300,
      additional_cost: 10,
      tax: 50,
    });
    expect(e.result).toBe(380);
    expect(e.margin).toBeCloseTo(0.38);
    expect(e.conversion).toBeCloseTo(0.04);
  });

  it("não calcula resultado nem margem sem custo do produto", () => {
    const e = computeEconomics("mercadolivre", INPUT, { ...COST, unitCost: null });
    expect(e.result).toBeNull();
    expect(e.margin).toBeNull();
    expect(e.components.find((c) => c.key === "product_cost")).toBeUndefined();
    // As despesas conhecidas continuam visíveis.
    expect(e.components.find((c) => c.key === "tax")?.amount).toBe(50);
  });

  it("registra a origem de cada componente (data lineage)", () => {
    const e = computeEconomics("shopee", INPUT, COST);
    const byKey = Object.fromEntries(e.components.map((c) => [c.key, c]));
    expect(byKey.commission.origin).toBe("marketplace");
    expect(byKey.commission.source).toContain("API Shopee");
    expect(byKey.product_cost.origin).toBe("seller");
    expect(byKey.tax.origin).toBe("estimated");
  });

  it("não inclui receita atribuída a Ads no resultado", () => {
    const withAttribution = computeEconomics("mercadolivre", INPUT, COST);
    const without = computeEconomics("mercadolivre", { ...INPUT, adsAttributedRevenue: 0 }, COST);
    expect(withAttribution.result).toBe(without.result);
  });

  it("retorna conversão nula sem visitas e margem nula sem receita", () => {
    expect(
      computeEconomics("mercadolivre", { ...INPUT, visits: null }, COST).conversion,
    ).toBeNull();
    expect(computeEconomics("mercadolivre", { ...INPUT, visits: 0 }, COST).conversion).toBeNull();
    expect(computeEconomics("mercadolivre", { ...INPUT, units: 0 }, COST).margin).toBeNull();
  });
});

describe("sumEconomics", () => {
  const ml = computeEconomics("mercadolivre", INPUT, COST);
  const shopee = computeEconomics("shopee", INPUT, COST);

  it("soma receita, pedidos, unidades, visitas e resultado", () => {
    const total = sumEconomics([ml, shopee]);
    expect(total.revenue).toBe(2000);
    expect(total.orders).toBe(16);
    expect(total.units).toBe(20);
    expect(total.visits).toBe(400);
    expect(total.result).toBe(760);
    expect(total.avgPrice).toBe(100);
  });

  it("agrupa componentes por tipo e indica quando vêm de vários canais", () => {
    const total = sumEconomics([ml, shopee]);
    const commission = total.components.find((c) => c.key === "commission");
    expect(commission?.amount).toBe(200);
    expect(commission?.source).toBe("Vários canais");
  });

  it("não altera os componentes originais", () => {
    const before = ml.components.map((c) => c.amount);
    sumEconomics([ml, shopee]);
    expect(ml.components.map((c) => c.amount)).toEqual(before);
  });

  it("anula resultado e visitas se algum canal não os tiver", () => {
    const noCost = computeEconomics(
      "shopee",
      { ...INPUT, visits: null },
      { ...COST, unitCost: null },
    );
    const total = sumEconomics([ml, noCost]);
    expect(total.result).toBeNull();
    expect(total.margin).toBeNull();
    expect(total.visits).toBeNull();
    expect(total.conversion).toBeNull();
  });

  it("lida com lista vazia", () => {
    const total = sumEconomics([]);
    expect(total.revenue).toBe(0);
    expect(total.result).toBeNull();
    expect(total.avgPrice).toBe(0);
  });
});
