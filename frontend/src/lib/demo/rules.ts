// Regras determinísticas do protótipo (Bloco 10). Servem também de especificação
// para o Analytics Engine do backend. Cada alerta diz o problema, o número que o comprova
// e uma ação direta (Bloco 17, revisado na v0.16).

import { formatBRL, formatInt, formatPct, relativeChange } from "@/lib/format";
import type { Economics, Insight, Marketplace, Product, Severity } from "@/lib/types";

export const MIN_MARGIN = 0.1;

export const MARKETPLACE_LABEL: Record<Marketplace, string> = {
  mercadolivre: "Mercado Livre",
  shopee: "Shopee",
};

const IN_MARKETPLACE: Record<Marketplace, string> = {
  mercadolivre: "no Mercado Livre",
  shopee: "na Shopee",
};

const signedPct = (ratio: number) => `${ratio >= 0 ? "+" : "−"}${formatPct(Math.abs(ratio), 0)}`;

const unitResult = (e: Economics) => (e.result !== null && e.units ? e.result / e.units : null);

type Base = Pick<Insight, "productId" | "productName">;
const base = (product: Product): Base => ({ productId: product.id, productName: product.name });

/** R001 — conversão caiu com tráfego estável. */
function conversionDrop(product: Product): Insight[] {
  return product.listings.flatMap((listing) => {
    const { current: cur, previous: prev } = listing.period;
    if (cur.conversion === null || prev.conversion === null || !cur.visits || !prev.visits) {
      return [];
    }
    const visitsChange = relativeChange(cur.visits, prev.visits) ?? 0;
    const conversionChange = relativeChange(cur.conversion, prev.conversion) ?? 0;
    if (!(cur.conversion < prev.conversion * 0.8 && Math.abs(visitsChange) <= 0.1)) return [];

    const priceChange = relativeChange(cur.avgPrice, prev.avgPrice) ?? 0;
    const lostOrders = (prev.conversion - cur.conversion) * cur.visits;
    const prevUnit = unitResult(prev);
    return [
      {
        ...base(product),
        id: `R001-${product.id}-${listing.marketplace}`,
        ruleId: "R001",
        severity: "warning" as Severity,
        title: `Conversão caiu ${formatPct(Math.abs(conversionChange), 0)} ${IN_MARKETPLACE[listing.marketplace]}`,
        detail: `${formatPct(prev.conversion)} → ${formatPct(cur.conversion)}, com as mesmas visitas`,
        action:
          priceChange > 0.03
            ? `Reveja o preço: subiu ${formatPct(priceChange, 0)} no período.`
            : "Reveja frete, prazo de entrega e avaliações do anúncio.",
        impact: prevUnit !== null ? lostOrders * prevUnit : null,
      },
    ];
  });
}

/** R002 — receita cresceu, margem caiu. */
function growthWithMarginLoss(product: Product): Insight[] {
  const { current: cur, previous: prev } = product.totals;
  if (cur.margin === null || prev.margin === null) return [];
  const revenueChange = relativeChange(cur.revenue, prev.revenue) ?? 0;
  const marginDrop = prev.margin - cur.margin;
  if (!(revenueChange > 0.15 && marginDrop > 0.05)) return [];

  // O custo que mais ganhou peso sobre a receita é o que precisa ser corrigido.
  const share = (e: Economics, key: string) =>
    (e.components.find((c) => c.key === key)?.amount ?? 0) / e.revenue;
  const driver = cur.components
    .map((c) => ({ c, delta: share(cur, c.key) - share(prev, c.key) }))
    .sort((a, b) => b.delta - a.delta)[0];
  const driverShare = formatPct(share(cur, driver.c.key));

  const actionByDriver: Record<string, string> = {
    discount: `Reduza os descontos: já são ${driverShare} da receita.`,
    ads: `Reduza o Ads: já é ${driverShare} da receita.`,
    shipping: `Reveja o frete grátis: já é ${driverShare} da receita.`,
  };

  return [
    {
      ...base(product),
      id: `R002-${product.id}`,
      ruleId: "R002",
      severity: "warning",
      title: "Vendeu mais e lucrou menos",
      detail: `Margem ${formatPct(prev.margin)} → ${formatPct(cur.margin)}`,
      action:
        actionByDriver[driver.c.key] ??
        `Reveja ${driver.c.label.toLowerCase()}: subiu para ${driverShare} da receita.`,
      impact: marginDrop * cur.revenue,
    },
  ];
}

/** R004 — vende muito, contribui pouco. */
function highVolumeLowMargin(product: Product, unitsP75: number): Insight[] {
  const cur = product.totals.current;
  if (cur.margin === null || cur.result === null) return [];
  if (!(cur.units >= unitsP75 && cur.margin < MIN_MARGIN)) return [];
  return [
    {
      ...base(product),
      id: `R004-${product.id}`,
      ruleId: "R004",
      severity: "critical",
      title: "Vende muito e quase não lucra",
      detail: `Margem de ${formatPct(cur.margin)} em ${formatInt(cur.units)} unidades`,
      action: `Aumente o preço ou reduza o custo para passar de ${formatPct(MIN_MARGIN, 0)} de margem.`,
      impact: (MIN_MARGIN - cur.margin) * cur.revenue,
    },
  ];
}

/** R005 — Ads subiu sem retorno proporcional e a margem piorou. */
function adsPressure(product: Product): Insight[] {
  const { current: cur, previous: prev } = product.totals;
  if (cur.margin === null || prev.margin === null || prev.adsSpend === 0) return [];
  const spendChange = relativeChange(cur.adsSpend, prev.adsSpend) ?? 0;
  const attributedChange = relativeChange(cur.adsAttributedRevenue, prev.adsAttributedRevenue) ?? 0;
  if (
    !(spendChange > 0.3 && attributedChange < spendChange / 2 && prev.margin - cur.margin > 0.02)
  ) {
    return [];
  }
  return [
    {
      ...base(product),
      id: `R005-${product.id}`,
      ruleId: "R005",
      severity: "warning",
      title: "Ads subiu sem trazer vendas",
      detail: `Gasto ${signedPct(spendChange)}, vendas por Ads ${signedPct(attributedChange)}`,
      action: "Pause ou reduza as campanhas deste produto com baixo retorno.",
      impact: cur.adsSpend - prev.adsSpend,
    },
  ];
}

/** R003 — mesmo produto rende diferente entre canais. */
function crossChannel(product: Product): Insight[] {
  const eligible = product.listings.filter(
    (l) => l.period.current.units >= 30 && l.period.current.margin !== null,
  );
  if (eligible.length < 2) return [];
  const sorted = [...eligible].sort(
    (a, b) => (unitResult(b.period.current) ?? 0) - (unitResult(a.period.current) ?? 0),
  );
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const gap = (best.period.current.margin ?? 0) - (worst.period.current.margin ?? 0);
  if (gap <= 0.05) return [];

  const bestUnit = unitResult(best.period.current) ?? 0;
  const worstUnit = unitResult(worst.period.current) ?? 0;
  return [
    {
      ...base(product),
      id: `R003-${product.id}`,
      ruleId: "R003",
      severity: "info",
      title: `Rende mais ${IN_MARKETPLACE[best.marketplace]}`,
      detail: `${formatBRL(bestUnit)} vs. ${formatBRL(worstUnit)} de lucro por unidade`,
      action: `Suba o preço ${IN_MARKETPLACE[worst.marketplace]} ou priorize o canal que rende mais.`,
      impact: (bestUnit - worstUnit) * worst.period.current.units,
    },
  ];
}

/** R006 — sem custo, sem resultado. */
function missingCost(product: Product): Insight[] {
  if (product.cost.unitCost !== null) return [];
  return [
    {
      ...base(product),
      id: `R006-${product.id}`,
      ruleId: "R006",
      severity: "warning",
      title: "Custo não cadastrado",
      detail: `${formatBRL(product.totals.current.revenue)} vendidos sem lucro calculado`,
      action: "Cadastre o custo em Custos para ver o lucro.",
      impact: null,
    },
  ];
}

const SEVERITY_RANK: Record<Severity, number> = { critical: 0, warning: 1, info: 2 };

function percentile(values: number[], p: number): number {
  if (values.length === 0) return Infinity;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
}

export function generateInsights(products: Product[]): Insight[] {
  const unitsP75 = percentile(
    products.filter((p) => p.totals.current.margin !== null).map((p) => p.totals.current.units),
    0.75,
  );
  return products
    .flatMap((p) => [
      ...highVolumeLowMargin(p, unitsP75),
      ...growthWithMarginLoss(p),
      ...conversionDrop(p),
      ...adsPressure(p),
      ...missingCost(p),
      ...crossChannel(p),
    ])
    .sort(
      (a, b) =>
        SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] ||
        (b.impact ?? Number.MIN_SAFE_INTEGER) - (a.impact ?? Number.MIN_SAFE_INTEGER),
    );
}
