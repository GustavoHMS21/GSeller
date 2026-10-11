// Situação do pedido de ponta a ponta (issue #50): o status e, quando há, o que precisa ser
// arrumado e como (Bloco 17). Serve também de especificação para o backend.

import type { Order, OrderStage, ReturnCondition, ReturnCost, Tone } from "@/lib/types";

const STAGE_LABEL: Record<OrderStage, string> = {
  paid: "Pago",
  invoiced: "Nota emitida",
  ready_to_ship: "Pronto para envio",
  shipped: "A caminho",
  delivered: "Entregue",
  claim_opened: "Em reclamação",
  return_shipped: "Devolução a caminho",
  returned: "Devolvido",
  refunded: "Reembolsado",
  cancelled: "Cancelado",
};

// Status atual com o vocabulário que o seller já usa no UpSeller (Bloco 60.9); a linha do
// tempo continua mostrando os eventos como aconteceram (STAGE_LABEL).
const STATUS_LABEL: Record<OrderStage, string> = {
  paid: "Para emitir",
  invoiced: "Para enviar",
  ready_to_ship: "Para enviar",
  shipped: "Enviado",
  delivered: "Entregue",
  claim_opened: "Em reclamação",
  return_shipped: "Devolução a caminho",
  returned: "Devolvido",
  refunded: "Reembolsado",
  cancelled: "Cancelado",
};

const STAGE_TONE: Record<OrderStage, Tone> = {
  paid: "neutral",
  invoiced: "neutral",
  ready_to_ship: "info",
  shipped: "info",
  delivered: "success",
  claim_opened: "danger",
  return_shipped: "warning",
  returned: "warning",
  refunded: "neutral",
  cancelled: "neutral",
};

const NOT_SHIPPED: OrderStage[] = ["paid", "invoiced", "ready_to_ship"];
const RETURN_STAGES: OrderStage[] = ["return_shipped", "returned", "refunded"];
const HAPPY_PATH: OrderStage[] = ["paid", "invoiced", "ready_to_ship", "shipped", "delivered"];

export type OrderProblem =
  | "claim"
  | "return_damaged"
  | "late_to_ship"
  | "ship_today"
  | "late_delivery"
  | "return_on_the_way";

export interface Attention {
  problem: OrderProblem;
  tone: Tone;
  title: string;
  action: string;
}

const BRT = "America/Sao_Paulo";
const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: BRT });
const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { timeZone: BRT, hour: "2-digit", minute: "2-digit" });
const dayTime = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    timeZone: BRT,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const currentStage = (order: Order): OrderStage => order.events[order.events.length - 1].stage;

export function orderStatus(order: Order): { label: string; tone: Tone } {
  const stage = currentStage(order);
  return { label: STATUS_LABEL[stage], tone: STAGE_TONE[stage] };
}

/** O que precisa ser arrumado agora, por ordem de urgência; null quando está tudo certo. */
export function orderAttention(order: Order, now: Date): Attention | null {
  const stage = currentStage(order);

  if (stage === "claim_opened") {
    return {
      problem: "claim",
      tone: "danger",
      title: "Reclamação aberta",
      action: order.claimReplyBy
        ? `Responda até ${dayTime(order.claimReplyBy)} para não perder a disputa.`
        : "Responda a reclamação para não perder a disputa.",
    };
  }

  if (stage === "returned" && order.returnInfo?.condition === "damaged") {
    return {
      problem: "return_damaged",
      tone: "danger",
      title: "Voltou avariado",
      action: "Conteste a devolução no marketplace, com fotos do produto.",
    };
  }

  if (NOT_SHIPPED.includes(stage) && order.shipBy) {
    const shipBy = new Date(order.shipBy);
    if (now > shipBy) {
      return {
        problem: "late_to_ship",
        tone: "danger",
        title: "Envio atrasado",
        action: "Poste hoje: o atraso pesa na sua reputação.",
      };
    }
    if (dayKey(now) === dayKey(shipBy)) {
      return {
        problem: "ship_today",
        tone: "warning",
        title: "Postar hoje",
        action: `Poste até ${time(order.shipBy)} para não atrasar.`,
      };
    }
  }

  if (stage === "shipped" && order.deliverBy && now > new Date(order.deliverBy)) {
    return {
      problem: "late_delivery",
      tone: "warning",
      title: "Entrega atrasada",
      action: "Avise o comprador pela mensagem do pedido.",
    };
  }

  if (stage === "return_shipped") {
    return {
      problem: "return_on_the_way",
      tone: "info",
      title: "Devolução a caminho",
      action: "Confira o estado do produto quando chegar.",
    };
  }

  return null;
}

export type OrderFilter =
  | "atrasados"
  | "emitir"
  | "enviar"
  | "enviados"
  | "entregues"
  | "reclamacao"
  | "devolvidos"
  | "cancelados";

/** Abas na ordem do fluxo do pedido, como no UpSeller; "Atrasados" é o atalho do que vence. */
export const ORDER_FILTERS: { value: OrderFilter; label: string }[] = [
  { value: "atrasados", label: "Atrasados" },
  { value: "emitir", label: "Para emitir" },
  { value: "enviar", label: "Para enviar" },
  { value: "enviados", label: "Enviados" },
  { value: "entregues", label: "Entregues" },
  { value: "reclamacao", label: "Reclamações" },
  { value: "devolvidos", label: "Devolvidos" },
  { value: "cancelados", label: "Cancelados" },
];

export function matchesFilter(order: Order, filter: OrderFilter, now: Date): boolean {
  const problem = orderAttention(order, now)?.problem;
  const stage = currentStage(order);
  switch (filter) {
    case "atrasados":
      return problem === "late_to_ship" || problem === "late_delivery";
    case "emitir":
      return stage === "paid";
    case "enviar":
      return stage === "invoiced" || stage === "ready_to_ship";
    case "enviados":
      return stage === "shipped";
    case "entregues":
      return stage === "delivered";
    case "cancelados":
      return stage === "cancelled";
    case "reclamacao":
      return problem === "claim";
    case "devolvidos":
      return order.events.some((e) => RETURN_STAGES.includes(e.stage));
  }
}

export interface TimelineStep {
  stage: OrderStage;
  label: string;
  at: string | null;
  done: boolean;
}

/** Etapas ocorridas e, num pedido sem desvio, as que ainda faltam até a entrega. */
export function orderTimeline(order: Order): TimelineStep[] {
  const done: TimelineStep[] = order.events.map((e) => ({
    stage: e.stage,
    label: STAGE_LABEL[e.stage],
    at: e.at,
    done: true,
  }));
  const onHappyPath = order.events.every((e) => HAPPY_PATH.includes(e.stage));
  if (!onHappyPath) return done;
  const pending = HAPPY_PATH.slice(HAPPY_PATH.indexOf(currentStage(order)) + 1).map((stage) => ({
    stage,
    label: STAGE_LABEL[stage],
    at: stage === "delivered" ? order.deliverBy : stage === "shipped" ? order.shipBy : null,
    done: false,
  }));
  return [...done, ...pending];
}

export const RETURN_CONDITION_LABEL: Record<ReturnCondition, string> = {
  on_the_way: "A caminho",
  good: "Voltou em bom estado",
  damaged: "Voltou avariado",
  not_returned: "Não voltou",
};

/**
 * Quanto uma devolução custa ao seller (issue #51). Premissas da demonstração, a confirmar
 * com os dados reais: a comissão é estornada pelo marketplace e o imposto é recuperado com a
 * nota de devolução. Perde-se o frete de ida, o de volta e, se o produto não puder ser
 * revendido, o custo dele. A caminho conta como produto que volta inteiro.
 */
export function returnCost(input: {
  condition: ReturnCondition;
  units: number;
  unitCost: number | null;
  outboundShipping: number;
  returnShipping: number;
}): ReturnCost {
  const productLost = input.condition === "damaged" || input.condition === "not_returned";
  const lostProduct = !productLost
    ? 0
    : input.unitCost === null
      ? null
      : input.unitCost * input.units;
  const returnShipping = input.condition === "not_returned" ? 0 : input.returnShipping;
  return {
    outboundShipping: input.outboundShipping,
    returnShipping,
    lostProduct,
    total: lostProduct === null ? null : input.outboundShipping + returnShipping + lostProduct,
  };
}
