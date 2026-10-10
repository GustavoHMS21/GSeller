import { describe, expect, it } from "vitest";
import {
  formatBRL,
  formatBRLRounded,
  formatDateTime,
  formatInt,
  formatPct,
  formatPP,
  relativeChange,
} from "@/lib/format";

// Intl usa espaço não separável entre "R$" e o número; normalizamos para comparar.
const plain = (text: string) => text.replace(/\s/g, " ");

describe("formatação pt-BR", () => {
  it("formata moeda com centavos e separador de milhar", () => {
    expect(plain(formatBRL(1234.5))).toBe("R$ 1.234,50");
  });

  it("formata moeda arredondada sem centavos", () => {
    expect(plain(formatBRLRounded(41047.4))).toBe("R$ 41.047");
  });

  it("formata inteiros com separador de milhar", () => {
    expect(formatInt(1234567)).toBe("1.234.567");
  });

  it("formata razão como porcentagem com casas configuráveis", () => {
    expect(formatPct(0.224)).toBe("22,4%");
    expect(formatPct(0.5, 0)).toBe("50%");
  });

  it("formata pontos percentuais sempre em valor absoluto", () => {
    expect(formatPP(0.021)).toBe("2,1 p.p.");
    expect(formatPP(-0.021)).toBe("2,1 p.p.");
  });

  it("formata data e hora no fuso de São Paulo", () => {
    expect(formatDateTime("2026-10-08T14:32:00-03:00")).toBe("08/10/2026, 14:32");
  });
});

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
