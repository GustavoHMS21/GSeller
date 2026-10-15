import { describe, expect, it } from "vitest";
import { computeEconomics, type PeriodInput } from "@/lib/demo/economics";
import { minimumPrice } from "@/lib/demo/min-price";
import type { ProductCost } from "@/lib/types";

// 10 unidades a R$ 100; comissão 14%, imposto 6%; frete R$ 100, Ads R$ 50; custo R$ 30 + R$ 2.
const input: PeriodInput = {
  units: 10,
  orders: 10,
  avgPrice: 100,
  sellerDiscount: 0,
  commissionRate: 0.14,
  fixedFeePerUnit: 0,
  sellerShipping: 100,
  adsSpend: 50,
  adsAttributedRevenue: 0,
  visits: null,
  refunds: 0,
};
const cost: ProductCost = { unitCost: 30, taxRate: 0.06, additionalUnitCost: 2, validFrom: null };

describe("preço mínimo sem prejuízo", () => {
  it("é o preço em que o lucro da unidade zera (conferido à mão)", () => {
    // P × (1 − 0,14 − 0,06) = 30 + 2 + 10 (frete) + 5 (Ads)  →  P = 47 ÷ 0,8 = 58,75
    const min = minimumPrice(computeEconomics("mercadolivre", input, cost));
    expect(min?.price).toBeCloseTo(58.75, 2);
    expect(min?.headroom).toBeCloseTo(100 / 58.75 - 1, 4);
  });

  it("vender no preço mínimo dá lucro zero", () => {
    const price = minimumPrice(computeEconomics("shopee", input, cost))?.price ?? 0;
    const atMin = computeEconomics("shopee", { ...input, avgPrice: price }, cost);
    expect(atMin.result).toBeCloseTo(0, 6);
  });

  it("tarifa fixa por unidade entra no mínimo", () => {
    const min = minimumPrice(
      computeEconomics("mercadolivre", { ...input, fixedFeePerUnit: 6.75 }, cost),
    );
    expect(min?.price).toBeCloseTo((47 + 6.75) / 0.8, 2);
  });

  it("folga negativa quando o preço atual está abaixo do mínimo", () => {
    const min = minimumPrice(computeEconomics("mercadolivre", { ...input, avgPrice: 50 }, cost));
    expect(min?.headroom).toBeLessThan(0);
  });

  it.each<[string, PeriodInput, ProductCost]>([
    ["sem custo do produto", input, { ...cost, unitCost: null }],
    ["sem vendas no período", { ...input, units: 0, orders: 0 }, cost],
    ["comissão e imposto somam 100%", { ...input, commissionRate: 0.94 }, cost],
  ])("não calcula %s", (_, period, productCost) => {
    expect(minimumPrice(computeEconomics("mercadolivre", period, productCost))).toBeNull();
  });
});
