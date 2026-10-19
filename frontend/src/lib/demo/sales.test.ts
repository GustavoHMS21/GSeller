import { describe, expect, it } from "vitest";
import { storeSummary } from "@/lib/demo/data";
import { last30Days, today } from "@/lib/demo/sales";

describe("série de vendas da demonstração", () => {
  it.each([undefined, "mercadolivre", "shopee"] as const)(
    "os 30 dias somam exatamente os indicadores do período (%s)",
    (marketplace) => {
      const days = last30Days(marketplace);
      const { revenue, orders } = storeSummary(marketplace).revenue.current;
      expect(days).toHaveLength(30);
      expect(days.reduce((a, d) => a + d.revenue, 0)).toBeCloseTo(revenue, 6);
      expect(days.reduce((a, d) => a + d.orders, 0)).toBe(orders);
      expect(days[0].label).toBe("08/09");
      expect(days.at(-1)?.label).toBe("07/10");
    },
  );

  it("hoje vai de 0h a 14h, sem pedido fracionado", () => {
    const hours = today();
    expect(hours.map((h) => h.label)).toEqual(Array.from({ length: 15 }, (_, h) => `${h}h`));
    for (const h of hours) expect(Number.isInteger(h.orders)).toBe(true);
  });
});
