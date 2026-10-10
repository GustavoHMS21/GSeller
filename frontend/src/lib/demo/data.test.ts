import { describe, expect, it } from "vitest";
import { storeSummary } from "@/lib/demo/data";

describe("storeSummary", () => {
  it("calcula o resultado só com produtos que têm custo e informa a cobertura", () => {
    const summary = storeSummary();
    expect(summary.productsWithoutCost).toBe(1);
    expect(summary.coverage).toBeGreaterThan(0.9);
    expect(summary.coverage).toBeLessThan(1);
    expect(summary.result.current.revenue).toBeLessThan(summary.revenue.current.revenue);
    expect(summary.result.current.result).not.toBeNull();
  });

  it("filtra por marketplace", () => {
    const ml = storeSummary("mercadolivre").revenue.current.revenue;
    const shopee = storeSummary("shopee").revenue.current.revenue;
    expect(ml + shopee).toBeCloseTo(storeSummary().revenue.current.revenue);
    expect(storeSummary("shopee").productsWithoutCost).toBe(0);
  });
});
