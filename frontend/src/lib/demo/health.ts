// Health Score hs-0.1 (Bloco 11): reproduzível, explicável e versionado.
// Começa em 100 e cada regra desconta pontos com motivo visível. Sem "score mágico".

import { relativeChange } from "@/lib/format";
import type { Health, HealthComponent, HealthLevel, ListingPeriod } from "@/lib/types";

export const HEALTH_VERSION = "hs-0.1";

export const HEALTH_RULES = [
  "Margem estimada abaixo de 5%: −60 · abaixo de 10%: −45 · abaixo de 15%: −15",
  "Margem caiu mais de 5 p.p.: −25 · mais de 2 p.p.: −10",
  "Receita caiu mais de 15%: −15 · mais de 5%: −5",
  "Conversão caiu mais de 20%: −15",
  "Gasto com Ads cresceu mais de 2 p.p. como % da receita: −15",
] as const;

export function healthLevel(score: number | null): HealthLevel {
  if (score === null) return "unknown";
  if (score >= 80) return "healthy";
  if (score >= 60) return "attention";
  return "critical";
}

export function computeHealth({ current, previous }: ListingPeriod): Health {
  if (current.margin === null) {
    return {
      score: null,
      level: "unknown",
      version: HEALTH_VERSION,
      components: [{ label: "Custo do produto não informado", points: 0 }],
    };
  }

  const components: HealthComponent[] = [];
  const margin = current.margin;
  if (margin < 0.05) components.push({ label: "Margem estimada abaixo de 5%", points: -60 });
  else if (margin < 0.1) components.push({ label: "Margem estimada abaixo de 10%", points: -45 });
  else if (margin < 0.15) components.push({ label: "Margem estimada abaixo de 15%", points: -15 });

  if (previous.margin !== null) {
    const drop = previous.margin - margin;
    if (drop > 0.05) components.push({ label: "Margem caiu mais de 5 p.p.", points: -25 });
    else if (drop > 0.02) components.push({ label: "Margem caiu mais de 2 p.p.", points: -10 });
  }

  const revenueChange = relativeChange(current.revenue, previous.revenue);
  if (revenueChange !== null) {
    if (revenueChange < -0.15) components.push({ label: "Receita caiu mais de 15%", points: -15 });
    else if (revenueChange < -0.05) components.push({ label: "Receita caiu mais de 5%", points: -5 });
  }

  if (current.conversion !== null && previous.conversion !== null) {
    const conversionChange = relativeChange(current.conversion, previous.conversion);
    if (conversionChange !== null && conversionChange < -0.2) {
      components.push({ label: "Conversão caiu mais de 20%", points: -15 });
    }
  }

  const adsShare = (e: { adsSpend: number; revenue: number }) =>
    e.revenue ? e.adsSpend / e.revenue : 0;
  if (adsShare(current) - adsShare(previous) > 0.02) {
    components.push({ label: "Ads cresceu como % da receita", points: -15 });
  }

  const score = Math.max(0, 100 + components.reduce((s, c) => s + c.points, 0));
  return { score, level: healthLevel(score), version: HEALTH_VERSION, components };
}
