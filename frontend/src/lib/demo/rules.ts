// Regras determinísticas do protótipo (Bloco 10). Servem também de especificação
// para o Analytics Engine do backend. Cada insight responde às 6 perguntas do Bloco 17:
// o que aconteceu, período, dado, comparação, o que investigar e limitação.

import { formatBRL, formatInt, formatPct, formatPP, relativeChange } from "@/lib/format";
import type { Economics, Insight, Marketplace, Product, Severity } from "@/lib/types";

export const MIN_MARGIN = 0.1;
const PERIOD = "últimos 30 dias vs. 30 dias anteriores";

export const MARKETPLACE_LABEL: Record<Marketplace, string> = {
  mercadolivre: "Mercado Livre",
  shopee: "Shopee",
};

const signedPct = (ratio: number) => `${ratio >= 0 ? "+" : "−"}${formatPct(Math.abs(ratio))}`;

const unitResult = (e: Economics) => (e.result !== null && e.units ? e.result / e.units : null);

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
    const priceRose = priceChange > 0.03;
    const evidence = [
      `Conversão: ${formatPct(prev.conversion)} → ${formatPct(cur.conversion)} (${signedPct(conversionChange)}).`,
      `Visitas praticamente estáveis (${signedPct(visitsChange)}).`,
    ];
    if (Math.abs(priceChange) > 0.03) {
      evidence.push(
        `Preço médio ${priceRose ? "subiu" : "caiu"} ${formatPct(Math.abs(priceChange))} (${formatBRL(prev.avgPrice)} → ${formatBRL(cur.avgPrice)}).`,
      );
    }

    const lostOrders = (prev.conversion - cur.conversion) * cur.visits;
    const prevUnit = unitResult(prev);
    return [
      {
        id: `R001-${product.id}-${listing.marketplace}`,
        ruleId: "R001",
        productId: product.id,
        productName: product.name,
        severity: "warning" as Severity,
        title: `Conversão caiu ${formatPct(Math.abs(conversionChange), 0)} no ${MARKETPLACE_LABEL[listing.marketplace]}`,
        evidence,
        investigate: priceRose
          ? ["competitividade de preço", "frete e prazo", "avaliações", "qualidade do anúncio"]
          : ["frete e prazo", "avaliações", "qualidade do anúncio", "concorrência"],
        limitation: priceRose
          ? "O aumento de preço é um dos sinais associados à queda e deve ser investigado — não é causa comprovada."
          : "Os dados mostram a queda de conversão, não a causa.",
        impact: prevUnit !== null ? lostOrders * prevUnit : null,
        impactLabel: "resultado estimado não realizado se a conversão anterior se mantivesse",
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

  // Componente que mais ganhou peso sobre a receita: principal sinal da perda de margem.
  const share = (e: Economics, key: string) =>
    (e.components.find((c) => c.key === key)?.amount ?? 0) / e.revenue;
  const driver = cur.components
    .map((c) => ({ c, delta: share(cur, c.key) - share(prev, c.key) }))
    .sort((a, b) => b.delta - a.delta)[0];

  const investigateByDriver: Record<string, string[]> = {
    discount: ["profundidade e duração das promoções", "preço mínimo viável", "efeito da promoção no volume"],
    ads: ["eficiência das campanhas", "lances e orçamento", "anúncios com baixo retorno"],
    shipping: ["tabela de frete", "faixa de preço vs. frete grátis"],
  };

  return [
    {
      id: `R002-${product.id}`,
      ruleId: "R002",
      productId: product.id,
      productName: product.name,
      severity: "warning",
      title: "Vendas cresceram, mas o ganho por venda caiu",
      evidence: [
        `Receita: ${formatBRL(prev.revenue)} → ${formatBRL(cur.revenue)} (${signedPct(revenueChange)}).`,
        `Margem estimada: ${formatPct(prev.margin)} → ${formatPct(cur.margin)} (−${formatPP(marginDrop)}).`,
        `Maior pressão: ${driver.c.label.toLowerCase()} passou de ${formatPct(share(prev, driver.c.key))} para ${formatPct(share(cur, driver.c.key))} da receita.`,
      ],
      investigate: investigateByDriver[driver.c.key] ?? ["composição de custos do período"],
      limitation: `Comparação ${PERIOD}. Sazonalidade e mix de variações podem influenciar.`,
      impact: marginDrop * cur.revenue,
      impactLabel: "de resultado a menos do que com a margem do período anterior",
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
      id: `R004-${product.id}`,
      ruleId: "R004",
      productId: product.id,
      productName: product.name,
      severity: "critical",
      title: "Vende muito, mas quase não contribui",
      evidence: [
        `${formatInt(cur.units)} unidades no período — entre os 25% mais vendidos do catálogo.`,
        `Margem estimada de ${formatPct(cur.margin)}, abaixo do mínimo configurado de ${formatPct(MIN_MARGIN, 0)}.`,
        `Resultado estimado de ${formatBRL(cur.result)} para ${formatBRL(cur.revenue)} de receita.`,
      ],
      investigate: [
        "preço vs. custo atualizado",
        "comissão e tarifa fixa por canal",
        "se o produto tem papel estratégico (atrair clientes)",
      ],
      limitation: `Margem mínima de ${formatPct(MIN_MARGIN, 0)} é uma configuração sua. O produto pode ter papel estratégico.`,
      impact: (MIN_MARGIN - cur.margin) * cur.revenue,
      impactLabel: `para atingir a margem mínima de ${formatPct(MIN_MARGIN, 0)}`,
    },
  ];
}

/** R005 — Ads subiu sem retorno proporcional e a margem piorou. */
function adsPressure(product: Product): Insight[] {
  const { current: cur, previous: prev } = product.totals;
  if (cur.margin === null || prev.margin === null || prev.adsSpend === 0) return [];
  const spendChange = relativeChange(cur.adsSpend, prev.adsSpend) ?? 0;
  const attributedChange = relativeChange(cur.adsAttributedRevenue, prev.adsAttributedRevenue) ?? 0;
  if (!(spendChange > 0.3 && attributedChange < spendChange / 2 && prev.margin - cur.margin > 0.02)) {
    return [];
  }
  return [
    {
      id: `R005-${product.id}`,
      ruleId: "R005",
      productId: product.id,
      productName: product.name,
      severity: "warning",
      title: "Gasto com Ads subiu sem retorno proporcional",
      evidence: [
        `Gasto com Ads: ${formatBRL(prev.adsSpend)} → ${formatBRL(cur.adsSpend)} (${signedPct(spendChange)}).`,
        `Receita atribuída a Ads: ${formatBRL(prev.adsAttributedRevenue)} → ${formatBRL(cur.adsAttributedRevenue)} (${signedPct(attributedChange)}).`,
        `Margem estimada: ${formatPct(prev.margin)} → ${formatPct(cur.margin)}.`,
      ],
      investigate: ["campanhas e lances", "anúncios com baixo retorno", "orçamento diário"],
      limitation:
        "Receita atribuída a Ads segue a janela de atribuição do marketplace e não é receita realizada.",
      impact: cur.adsSpend - prev.adsSpend,
      impactLabel: "de gasto adicional em Ads no período",
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
  const line = (l: typeof best) =>
    `${MARKETPLACE_LABEL[l.marketplace]}: ${formatBRL(unitResult(l.period.current) ?? 0)} por unidade (margem ${formatPct(l.period.current.margin ?? 0)}, ${formatInt(l.period.current.units)} unidades).`;

  return [
    {
      id: `R003-${product.id}`,
      ruleId: "R003",
      productId: product.id,
      productName: product.name,
      severity: "info",
      title: `Resultado por unidade é maior no ${MARKETPLACE_LABEL[best.marketplace]}`,
      evidence: [line(best), line(worst)],
      investigate: ["preço por canal", "comissão e tarifa fixa", "esforço de Ads por canal"],
      limitation:
        "Comparação não considera elasticidade: mudar preço ou foco de canal pode alterar o volume.",
      impact: (bestUnit - worstUnit) * worst.period.current.units,
      impactLabel: `de diferença nas unidades vendidas no ${MARKETPLACE_LABEL[worst.marketplace]}`,
    },
  ];
}

/** R006 — qualidade de dados: sem custo, sem resultado. */
function missingCost(product: Product): Insight[] {
  if (product.cost.unitCost !== null) return [];
  return [
    {
      id: `R006-${product.id}`,
      ruleId: "R006",
      productId: product.id,
      productName: product.name,
      severity: "warning",
      title: "Sem custo cadastrado: resultado não calculado",
      evidence: [
        `${formatInt(product.totals.current.units)} unidades e ${formatBRL(product.totals.current.revenue)} de receita no período sem custo associado.`,
      ],
      investigate: ["cadastrar o custo unitário na tela de Custos"],
      limitation: "Sem custo, não exibimos resultado nem margem para não mostrar lucro fictício.",
      impact: null,
      impactLabel: null,
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
