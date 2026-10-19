// Série de vendas da DEMONSTRAÇÃO para o gráfico do Início e de Análises (Bloco 60.9).
// Os totais dos 30 dias distribuídos por dia (e o dia de hoje por hora), com a soma exata
// dos números do resto do painel: gráfico e indicadores nunca discordam.

import { storeSummary } from "@/lib/demo/data";
import type { Marketplace, SalesPoint } from "@/lib/types";

const DAYS = 30;
const FIRST_DAY = Date.UTC(2026, 8, 8); // 08/09/2026, início do período da demonstração
// Domingo mais fraco, segunda e terça mais fortes: padrão comum de marketplace.
const WEEKDAY = [0.78, 1.12, 1.08, 1.02, 1.0, 0.98, 0.86];
// Hoje até a última sincronização (14h32): perfil por hora de 0h a 14h e, até aqui, pouco
// menos da metade das vendas de um dia médio.
const HOURLY = [0.3, 0.2, 0.1, 0.1, 0.1, 0.2, 0.5, 0.9, 1.3, 1.6, 1.8, 1.9, 2.0, 1.9, 1.8];
const SHARE_SO_FAR = 0.45;

/** Ruído determinístico: o mesmo gráfico em toda renderização e em todo teste. */
const noise = (i: number) => 1 + 0.12 * Math.sin(i * 12.9898 + 4.1414);

/** Reparte um total inteiro pelos pesos, sem perder unidade (maior resto). */
function splitInt(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (total * w) / sum);
  const parts = raw.map(Math.floor);
  const order = raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0]);
  const missing = total - parts.reduce((a, b) => a + b, 0);
  for (let k = 0; k < missing; k++) parts[order[k][1]] += 1;
  return parts;
}

function dayWeights(): number[] {
  return Array.from({ length: DAYS }, (_, i) => {
    const weekday = new Date(FIRST_DAY + i * 86_400_000).getUTCDay();
    const trend = 0.9 + (0.2 * i) / (DAYS - 1);
    return WEEKDAY[weekday] * trend * noise(i);
  });
}

export function last30Days(marketplace?: Marketplace): SalesPoint[] {
  const { revenue, orders } = storeSummary(marketplace).revenue.current;
  const weights = dayWeights();
  const sum = weights.reduce((a, b) => a + b, 0);
  const ordersByDay = splitInt(orders, weights);
  return weights.map((w, i) => {
    const date = new Date(FIRST_DAY + i * 86_400_000);
    const label = `${String(date.getUTCDate()).padStart(2, "0")}/${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    return { label, revenue: (revenue * w) / sum, orders: ordersByDay[i] };
  });
}

/** Hoje, hora a hora, a partir da média diária do período. */
export function today(marketplace?: Marketplace): SalesPoint[] {
  const days = last30Days(marketplace);
  const revenueSoFar = (days.reduce((a, d) => a + d.revenue, 0) / DAYS) * SHARE_SO_FAR;
  const ordersSoFar = Math.round((days.reduce((a, d) => a + d.orders, 0) / DAYS) * SHARE_SO_FAR);
  const ordersByHour = splitInt(ordersSoFar, HOURLY);
  const hourSum = HOURLY.reduce((a, b) => a + b, 0);
  return HOURLY.map((w, h) => ({
    label: `${h}h`,
    revenue: (revenueSoFar * w) / hourSum,
    orders: ordersByHour[h],
  }));
}
