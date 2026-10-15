import { describe, expect, it } from "vitest";
import {
  type FixedCost,
  fixedCostInPeriod,
  storeProfit,
  totalFixedCosts,
  validateFixedCost,
} from "@/lib/demo/fixed-costs";

const cost = (monthlyAmount: number, validFrom: string, validTo: string | null = null) =>
  ({ id: "c", description: "Aluguel", monthlyAmount, validFrom, validTo }) satisfies FixedCost;

// Período da demonstração: 08/09 a 07/10/2026 (23 dias de setembro + 7 de outubro).
const PERIOD = { from: "2026-09-08", to: "2026-10-07" };

describe("custo fixo no período", () => {
  // Valores conferidos à mão: setembro tem 30 dias, outubro 31.
  it.each<[string, FixedCost, { from: string; to: string }, number]>([
    [
      "mês inteiro custa o valor mensal",
      cost(3000, "2026-01-01"),
      { from: "2026-09-01", to: "2026-09-30" },
      3000,
    ],
    ["período que cruza dois meses", cost(3100, "2026-01-01"), PERIOD, 2376.67 + 700],
    ["começou no meio do período", cost(3100, "2026-10-01"), PERIOD, 700],
    ["encerrado no meio do período", cost(3100, "2026-01-01", "2026-09-30"), PERIOD, 2376.67],
    ["vale um único dia", cost(3000, "2026-09-10", "2026-09-10"), PERIOD, 100],
    ["encerrado antes do período", cost(3000, "2026-01-01", "2026-09-07"), PERIOD, 0],
    ["começa depois do período", cost(3000, "2026-10-08"), PERIOD, 0],
  ])("%s", (_, c, period, expected) => {
    expect(fixedCostInPeriod(c, period)).toBeCloseTo(expected, 2);
  });

  it("soma os custos da loja", () => {
    expect(
      totalFixedCosts([cost(3000, "2026-01-01"), cost(600, "2026-01-01")], {
        from: "2026-09-01",
        to: "2026-09-30",
      }),
    ).toBe(3600);
  });
});

describe("lucro da loja", () => {
  it("desconta os custos fixos do lucro dos produtos", () => {
    expect(storeProfit(10_000, 3_600, 50_000)).toEqual({ result: 6_400, margin: 0.128 });
  });

  it("fica negativo quando os custos fixos passam do lucro dos produtos", () => {
    expect(storeProfit(2_000, 3_600, 50_000).result).toBe(-1_600);
  });

  it("não calcula sem lucro dos produtos", () => {
    expect(storeProfit(null, 3_600, 50_000)).toEqual({ result: null, margin: null });
  });
});

describe("lançamento de custo fixo", () => {
  const valid: Omit<FixedCost, "id"> = {
    description: "Contador",
    monthlyAmount: 450,
    validFrom: "2026-10-01",
    validTo: null,
  };

  it.each<[string, Partial<Omit<FixedCost, "id">>]>([
    ["sem descrição", { description: "  " }],
    ["valor zero", { monthlyAmount: 0 }],
    ["valor negativo", { monthlyAmount: -10 }],
    ["valor inválido", { monthlyAmount: Number.NaN }],
    ["sem data de início", { validFrom: "" }],
    ["fim antes do início", { validTo: "2026-09-30" }],
  ])("recusa %s", (_, change) => {
    expect(validateFixedCost({ ...valid, ...change })).not.toBeNull();
  });

  it("aceita um lançamento completo", () => {
    expect(validateFixedCost(valid)).toBeNull();
  });
});
