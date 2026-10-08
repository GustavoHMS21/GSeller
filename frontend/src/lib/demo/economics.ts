// Cálculo de resultado estimado usado APENAS pelo protótipo.
// O cálculo oficial será a Financial Truth Engine no backend (Bloco 9), com golden tests.
// Esta versão existe para que os números exibidos nas entrevistas sejam coerentes entre si.

import type { CostComponent, Economics, Marketplace, ProductCost } from "@/lib/types";

export interface PeriodInput {
  units: number;
  orders: number;
  avgPrice: number;
  sellerDiscount: number;
  commissionRate: number;
  fixedFeePerUnit: number;
  sellerShipping: number;
  adsSpend: number;
  adsAttributedRevenue: number;
  visits: number | null;
  refunds: number;
}

const SOURCE: Record<Marketplace, string> = {
  mercadolivre: "API Mercado Livre",
  shopee: "API Shopee",
};

export function computeEconomics(
  marketplace: Marketplace,
  input: PeriodInput,
  cost: ProductCost,
): Economics {
  const revenue = input.units * input.avgPrice;
  const api = SOURCE[marketplace];

  const components: CostComponent[] = [
    {
      key: "discount",
      label: "Desconto financiado por você",
      amount: input.sellerDiscount,
      origin: "marketplace",
      source: `${api} · promoções`,
    },
    {
      key: "commission",
      label: "Comissão do marketplace",
      amount: revenue * input.commissionRate,
      origin: "marketplace",
      source: `${api} · tarifa de venda`,
    },
    {
      key: "fixed_fee",
      label: "Tarifa fixa por unidade",
      amount: input.units * input.fixedFeePerUnit,
      origin: "marketplace",
      source: `${api} · tarifa de venda`,
    },
    {
      key: "shipping",
      label: "Frete assumido por você",
      amount: input.sellerShipping,
      origin: "marketplace",
      source: `${api} · envios`,
    },
    {
      key: "ads",
      label: "Publicidade (Ads)",
      amount: input.adsSpend,
      origin: "marketplace",
      source: `${api} · Ads`,
    },
    {
      key: "refunds",
      label: "Devoluções e reembolsos",
      amount: input.refunds,
      origin: "marketplace",
      source: `${api} · pós-venda`,
    },
  ];

  if (cost.unitCost !== null) {
    components.push({
      key: "product_cost",
      label: "Custo do produto",
      amount: input.units * cost.unitCost,
      origin: "seller",
      source: "Informado por você",
    });
  }
  if (cost.additionalUnitCost > 0) {
    components.push({
      key: "additional_cost",
      label: "Custo adicional (embalagem etc.)",
      amount: input.units * cost.additionalUnitCost,
      origin: "seller",
      source: "Informado por você",
    });
  }
  components.push({
    key: "tax",
    label: "Imposto estimado",
    amount: revenue * cost.taxRate,
    origin: "estimated",
    source: `Configuração: ${(cost.taxRate * 100).toLocaleString("pt-BR")}% sobre a receita`,
  });

  const totalCosts = components.reduce((sum, c) => sum + c.amount, 0);
  const result = cost.unitCost === null ? null : revenue - totalCosts;

  return {
    revenue,
    orders: input.orders,
    units: input.units,
    components,
    result,
    margin: result === null || revenue === 0 ? null : result / revenue,
    adsAttributedRevenue: input.adsAttributedRevenue,
    adsSpend: input.adsSpend,
    visits: input.visits,
    conversion: input.visits ? input.orders / input.visits : null,
    avgPrice: input.avgPrice,
  };
}

/** Soma economics de vários canais. Resultado só existe se todos os canais tiverem custo. */
export function sumEconomics(items: Economics[]): Economics {
  const revenue = items.reduce((s, e) => s + e.revenue, 0);
  const units = items.reduce((s, e) => s + e.units, 0);
  const orders = items.reduce((s, e) => s + e.orders, 0);
  const hasResult = items.length > 0 && items.every((e) => e.result !== null);
  const result = hasResult ? items.reduce((s, e) => s + (e.result ?? 0), 0) : null;
  const allVisits = items.every((e) => e.visits !== null);
  const visits = allVisits ? items.reduce((s, e) => s + (e.visits ?? 0), 0) : null;

  const byKey = new Map<string, CostComponent>();
  for (const component of items.flatMap((e) => e.components)) {
    const existing = byKey.get(component.key);
    if (existing) {
      existing.amount += component.amount;
      if (existing.source !== component.source) existing.source = "Vários canais";
    } else {
      byKey.set(component.key, { ...component });
    }
  }

  return {
    revenue,
    orders,
    units,
    components: [...byKey.values()],
    result,
    margin: result === null || revenue === 0 ? null : result / revenue,
    adsAttributedRevenue: items.reduce((s, e) => s + e.adsAttributedRevenue, 0),
    adsSpend: items.reduce((s, e) => s + e.adsSpend, 0),
    visits,
    conversion: visits ? orders / visits : null,
    avgPrice: units ? revenue / units : 0,
  };
}
