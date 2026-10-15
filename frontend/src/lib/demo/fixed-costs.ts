// Custos fixos da loja (issue #68, Bloco 61.6): aluguel, contador, sistemas, equipe.
// Saem do lucro da loja, nunca do lucro de cada produto. Especificação da regra do backend.

/** Custo mensal com vigência. Mudar o valor = encerrar o antigo e lançar outro (custo versionado). */
export interface FixedCost {
  id: string;
  description: string;
  monthlyAmount: number;
  /** Primeiro dia em que vale (AAAA-MM-DD). */
  validFrom: string;
  /** Último dia em que vale; null enquanto estiver em uso. */
  validTo: string | null;
}

/** Período com início e fim inclusivos (AAAA-MM-DD). */
export interface Period {
  from: string;
  to: string;
}

const DAY = 86_400_000;
const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const daysInMonth = (d: Date) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
const cents = (value: number) => Math.round(value * 100) / 100;

/**
 * Parte do custo mensal que cai no período: cada dia vale o valor mensal dividido pelos dias
 * daquele mês. Um mês inteiro custa exatamente o valor mensal.
 */
export function fixedCostInPeriod(cost: FixedCost, period: Period): number {
  const start = Math.max(toDate(cost.validFrom).getTime(), toDate(period.from).getTime());
  const end = Math.min(toDate(cost.validTo ?? period.to).getTime(), toDate(period.to).getTime());
  let total = 0;
  for (let t = start; t <= end; t += DAY) {
    total += cost.monthlyAmount / daysInMonth(new Date(t));
  }
  return cents(total);
}

export const totalFixedCosts = (costs: FixedCost[], period: Period) =>
  cents(costs.reduce((sum, c) => sum + fixedCostInPeriod(c, period), 0));

/**
 * Lucro da loja = lucro estimado dos produtos − custos fixos do período.
 * Sem lucro dos produtos (nenhum custo cadastrado), não há lucro da loja: nunca inventar número.
 */
export function storeProfit(productsProfit: number | null, fixedCosts: number, revenue: number) {
  if (productsProfit === null) return { result: null, margin: null };
  const result = cents(productsProfit - fixedCosts);
  return { result, margin: revenue ? result / revenue : null };
}

/** Valida um lançamento novo. Devolve a mensagem de erro ou null. */
export function validateFixedCost(cost: Omit<FixedCost, "id">): string | null {
  if (!cost.description.trim()) return "Informe a descrição do custo.";
  if (!Number.isFinite(cost.monthlyAmount) || cost.monthlyAmount <= 0)
    return "Informe um valor mensal maior que zero.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cost.validFrom)) return "Informe a data de início.";
  if (cost.validTo && cost.validTo < cost.validFrom)
    return "O fim da vigência não pode ser antes do início.";
  return null;
}
