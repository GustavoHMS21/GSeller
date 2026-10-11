// Central de atendimento (issue #52): o que responder primeiro, quanto tempo falta e o que o
// marketplace bloqueia. Serve também de especificação para o backend.

import type { Conversation, ConversationKind, Tone } from "@/lib/types";

export const KIND_LABEL: Record<ConversationKind, string> = {
  question: "Pergunta",
  post_sale: "Pós-venda",
  claim: "Reclamação",
};

const HOUR = 3_600_000;
/**
 * Metas internas de resposta. Pergunta sem resposta rápida vira venda perdida; pós-venda
 * pesa na reputação. Reclamação usa o prazo do marketplace.
 */
const TARGET_MS: Record<Exclude<ConversationKind, "claim">, number> = {
  question: 1 * HOUR,
  post_sale: 24 * HOUR,
};

const lastMessage = (c: Conversation) => c.messages[c.messages.length - 1];

/** Aguardando o seller: a última mensagem é do comprador. */
export const needsReply = (c: Conversation) => lastMessage(c).from === "buyer";

function dueAt(c: Conversation): number {
  if (c.kind === "claim" && c.replyBy) return Date.parse(c.replyBy);
  // Reclamação sem prazo informado segue a meta do pós-venda.
  const target = c.kind === "question" ? TARGET_MS.question : TARGET_MS.post_sale;
  return Date.parse(lastMessage(c).at) + target;
}

function duration(ms: number): string {
  const minutes = Math.max(1, Math.round(ms / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} h`;
  return `${Math.round(hours / 24)} dias`;
}

export interface Due {
  overdue: boolean;
  label: string;
  tone: Tone;
}

/** Quanto falta para responder; null quando não há o que responder. */
export function replyDue(c: Conversation, now: Date): Due | null {
  if (!needsReply(c)) return null;
  const remaining = dueAt(c) - now.getTime();
  if (remaining < 0) {
    return { overdue: true, label: `Atrasada há ${duration(-remaining)}`, tone: "danger" };
  }
  const urgent = remaining <= 2 * HOUR;
  return {
    overdue: false,
    label: `Responda em ${duration(remaining)}`,
    tone: urgent ? "warning" : "neutral",
  };
}

/** Para responder primeiro (pelo prazo mais próximo); respondidas depois, mais recentes antes. */
export function sortConversations(items: Conversation[]): Conversation[] {
  return [...items].sort((a, b) => {
    const pendingA = needsReply(a);
    const pendingB = needsReply(b);
    if (pendingA !== pendingB) return pendingA ? -1 : 1;
    if (pendingA) return dueAt(a) - dueAt(b);
    return Date.parse(lastMessage(b).at) - Date.parse(lastMessage(a).at);
  });
}

export type SupportFilter = "responder" | "perguntas" | "pos-venda" | "reclamacoes";

export const SUPPORT_FILTERS: { value: SupportFilter; label: string }[] = [
  { value: "responder", label: "Para responder" },
  { value: "perguntas", label: "Perguntas" },
  { value: "pos-venda", label: "Pós-venda" },
  { value: "reclamacoes", label: "Reclamações" },
];

export function matchesSupportFilter(c: Conversation, filter: SupportFilter): boolean {
  switch (filter) {
    case "responder":
      return needsReply(c);
    case "perguntas":
      return c.kind === "question";
    case "pos-venda":
      return c.kind === "post_sale";
    case "reclamacoes":
      return c.kind === "claim";
  }
}

const CONTACT_PATTERNS: [RegExp, string][] = [
  [/\b\(?\d{2}\)?[\s.-]?9?\d{4}[\s.-]?\d{4}\b/, "telefone"],
  [/[\w.+-]+@[\w-]+\.[\w.]+/, "e-mail"],
  [/\b(?:https?:\/\/|www\.)\S+/i, "link"],
  [/\b(?:whats\s?app|zap|wpp|telegram|instagram|insta)\b/i, "rede social ou WhatsApp"],
];

/**
 * O marketplace bloqueia mensagens que levam o comprador para fora (Bloco 60.3). Avisa antes
 * de enviar, para a resposta não ser barrada nem pesar na reputação.
 */
export function findContactLeak(text: string): string | null {
  const found = CONTACT_PATTERNS.find(([pattern]) => pattern.test(text));
  return found ? `Tire o ${found[1]}: o marketplace bloqueia contato fora da plataforma.` : null;
}

/** Respostas prontas: entram no campo e podem ser editadas antes de enviar. */
export const QUICK_REPLIES: { label: string; text: string }[] = [
  {
    label: "Prazo de envio",
    text: "Olá! Postamos em até 1 dia útil após a compra, e o rastreio aparece no seu pedido.",
  },
  {
    label: "Garantia",
    text: "Olá! O produto tem garantia de 90 dias. Se tiver qualquer problema, fale com a gente por aqui.",
  },
  {
    label: "Medidas",
    text: "Olá! As medidas estão na descrição do anúncio. Se ficar alguma dúvida, é só perguntar.",
  },
  {
    label: "Agradecimento",
    text: "Obrigado pela compra! Qualquer dúvida, fale com a gente por aqui.",
  },
];
