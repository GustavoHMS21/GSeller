import { describe, expect, it } from "vitest";
import { formatDateTime, formatPP, relativeChange } from "@/lib/format";

// Formatação de moeda e números é do Intl e não é testada aqui (Bloco 57.3).

describe("relativeChange", () => {
  it("calcula a variação relativa entre períodos", () => {
    expect(relativeChange(110, 100)).toBeCloseTo(0.1);
    expect(relativeChange(80, 100)).toBeCloseTo(-0.2);
  });

  it("usa o módulo da base quando o período anterior é negativo", () => {
    expect(relativeChange(-50, -100)).toBeCloseTo(0.5);
  });

  it("retorna null sem base de comparação", () => {
    expect(relativeChange(5, 0)).toBeNull();
  });
});

it("formata pontos percentuais sempre em valor absoluto", () => {
  expect(formatPP(0.021)).toBe("2,1 p.p.");
  expect(formatPP(-0.021)).toBe("2,1 p.p.");
});

it("mostra data e hora no fuso de São Paulo, não no fuso do servidor", () => {
  expect(formatDateTime("2026-10-08T14:32:00-03:00")).toBe("08/10/2026, 14:32");
});
