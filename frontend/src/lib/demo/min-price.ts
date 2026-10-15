// Preço mínimo sem prejuízo (Bloco 61.7): o preço em que o lucro da unidade chega a zero.
// Usa os mesmos componentes do lucro do anúncio (economics.ts). Comissão e imposto acompanham
// o preço; os demais custos entram pelo valor médio por unidade no período.

import type { Economics } from "@/lib/types";

/** Componentes que mudam junto com o preço (percentual sobre a receita). */
const PRICE_LINKED = new Set(["commission", "tax"]);

export interface MinimumPrice {
  /** Preço em que o lucro da unidade é zero. */
  price: number;
  /** Quanto o preço médio atual está acima (positivo) ou abaixo (negativo) do mínimo. */
  headroom: number;
}

/**
 * Null sem custo do produto (nunca inventar), sem vendas no período ou quando comissão e
 * imposto somam 100% ou mais da receita (nenhum preço cobre).
 *
 * shortcut: tarifa fixa e frete entram pela média do período; a tarifa fixa do ML muda por
 * faixa de preço. Evoluir com a tabela de tarifas na integração (#10).
 */
export function minimumPrice(e: Economics): MinimumPrice | null {
  if (e.result === null || e.units === 0 || e.revenue === 0) return null;
  let rate = 0;
  let perUnit = 0;
  for (const c of e.components) {
    if (PRICE_LINKED.has(c.key)) rate += c.amount / e.revenue;
    else perUnit += c.amount / e.units;
  }
  if (rate >= 1) return null;
  const price = perUnit / (1 - rate);
  return { price, headroom: (e.avgPrice - price) / price };
}
