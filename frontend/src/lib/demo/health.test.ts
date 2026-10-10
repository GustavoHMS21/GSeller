import { describe, expect, it } from "vitest";
import { computeHealth, HEALTH_VERSION, healthLevel } from "@/lib/demo/health";
import type { Economics } from "@/lib/types";

function econ(overrides: Partial<Economics> = {}): Economics {
  return {
    revenue: 10_000,
    orders: 100,
    units: 100,
    components: [],
    result: 3_000,
    margin: 0.3,
    adsAttributedRevenue: 0,
    adsSpend: 0,
    visits: 5_000,
    conversion: 0.02,
    avgPrice: 100,
    ...overrides,
  };
}

const score = (current: Partial<Economics>, previous: Partial<Economics> = {}) =>
  computeHealth({ current: econ(current), previous: econ(previous) });

describe("healthLevel", () => {
  it.each([
    [100, "healthy"],
    [80, "healthy"],
    [79, "attention"],
    [60, "attention"],
    [59, "critical"],
    [0, "critical"],
    [null, "unknown"],
  ] as const)("score %s → %s", (value, level) => {
    expect(healthLevel(value)).toBe(level);
  });
});

describe("computeHealth", () => {
  it("é 100 e saudável quando todos os critérios estão bons", () => {
    const h = score({});
    expect(h.score).toBe(100);
    expect(h.level).toBe("healthy");
    expect(h.components).toEqual([]);
    expect(h.version).toBe(HEALTH_VERSION);
  });

  it("fica sem dados quando falta o custo do produto", () => {
    const h = score({ margin: null, result: null });
    expect(h.score).toBeNull();
    expect(h.level).toBe("unknown");
  });

  it.each([
    [0.04, 40],
    [0.08, 55],
    [0.12, 85],
  ])("margem %s resulta em score %s", (margin, expected) => {
    expect(score({ margin }, { margin }).score).toBe(expected);
  });

  it.each([
    [0.06, -25],
    [0.03, -10],
  ])("queda de margem de %s desconta %s", (drop, points) => {
    expect(score({ margin: 0.3 }, { margin: 0.3 + drop }).score).toBe(100 + points);
  });

  it.each([
    [8_000, 85],
    [9_000, 95],
  ])("receita de %s contra 10.000 resulta em %s", (revenue, expected) => {
    expect(score({ revenue }).score).toBe(expected);
  });

  it("desconta queda de conversão acima de 20%", () => {
    expect(score({ conversion: 0.015 }, { conversion: 0.02 }).score).toBe(85);
  });

  it("ignora conversão quando não há visitas", () => {
    expect(score({ conversion: null }, { conversion: 0.02 }).score).toBe(100);
  });

  it("desconta Ads crescendo como % da receita", () => {
    expect(score({ adsSpend: 500 }, { adsSpend: 100 }).score).toBe(85);
  });

  it("nunca fica abaixo de zero e explica cada desconto", () => {
    const h = score(
      { margin: 0.02, revenue: 5_000, conversion: 0.01, adsSpend: 1_000 },
      { margin: 0.3, conversion: 0.02, adsSpend: 0 },
    );
    expect(h.score).toBe(0);
    expect(h.level).toBe("critical");
    expect(h.components.map((c) => c.points)).toEqual([-60, -25, -15, -15, -15]);
  });
});
