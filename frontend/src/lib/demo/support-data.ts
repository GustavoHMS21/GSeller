// Conversas de DEMONSTRAÇÃO (issue #52), só do Mercado Livre: a Shopee não libera chat para
// aplicativos no Brasil (Bloco 60.3). Nenhum nome ou contato de comprador.

import { connections, getProduct } from "@/lib/demo/data";
import type { Conversation, ConversationKind } from "@/lib/types";

interface ConversationSeed {
  id: string;
  kind: ConversationKind;
  productId: string;
  orderId?: string;
  replyBy?: string;
  messages: ["buyer" | "seller", string, string][];
}

const SEEDS: ConversationSeed[] = [
  {
    id: "q-1001",
    kind: "question",
    productId: "moc-exe-01",
    messages: [["buyer", "Cabe notebook de 15,6 polegadas?", "2026-10-08T14:05:00-03:00"]],
  },
  {
    id: "q-1002",
    kind: "question",
    productId: "gar-trm-1l",
    messages: [["buyer", "Mantém gelado por quantas horas?", "2026-10-08T11:50:00-03:00"]],
  },
  {
    id: "q-1003",
    kind: "question",
    productId: "org-gav-6",
    messages: [["buyer", "Serve em gaveta de 40 cm de largura?", "2026-10-08T08:10:00-03:00"]],
  },
  {
    id: "q-1004",
    kind: "question",
    productId: "fon-bt-x1",
    messages: [
      ["buyer", "Funciona com iPhone?", "2026-10-07T19:20:00-03:00"],
      [
        "seller",
        "Olá! Funciona com qualquer celular com Bluetooth, inclusive iPhone.",
        "2026-10-07T19:31:00-03:00",
      ],
    ],
  },
  {
    id: "c-2001",
    kind: "claim",
    productId: "fon-bt-x1",
    orderId: "2000012345678911",
    replyBy: "2026-10-08T20:00:00-03:00",
    messages: [["buyer", "O produto não chegou e quero o reembolso.", "2026-10-07T10:15:00-03:00"]],
  },
  {
    id: "c-2002",
    kind: "claim",
    productId: "lum-led-m",
    orderId: "2000012345678905",
    replyBy: "2026-10-09T16:00:00-03:00",
    messages: [["buyer", "A luminária chegou com a base quebrada.", "2026-10-07T16:00:00-03:00"]],
  },
  {
    id: "m-3001",
    kind: "post_sale",
    productId: "fon-bt-x1",
    orderId: "2000012345678903",
    messages: [
      ["buyer", "Meu pedido ainda não chegou, a previsão era dia 06.", "2026-10-08T09:00:00-03:00"],
    ],
  },
  {
    id: "m-3002",
    kind: "post_sale",
    productId: "moc-exe-01",
    orderId: "2000012345678909",
    messages: [
      ["buyer", "Chegou certinho, obrigado!", "2026-10-06T18:00:00-03:00"],
      [
        "seller",
        "Obrigado pela compra! Qualquer dúvida, fale com a gente por aqui.",
        "2026-10-06T18:40:00-03:00",
      ],
    ],
  },
];

const storeName = connections.find((c) => c.marketplace === "mercadolivre")?.shopName ?? "";

function buildConversation(seed: ConversationSeed): Conversation {
  const product = getProduct(seed.productId);
  if (!product) throw new Error(`Conversa de demonstração inválida: ${seed.id}`);
  return {
    id: seed.id,
    kind: seed.kind,
    marketplace: "mercadolivre",
    storeName,
    productId: product.id,
    productName: product.name,
    orderId: seed.orderId ?? null,
    replyBy: seed.replyBy ?? null,
    messages: seed.messages.map(([from, text, at]) => ({ from, text, at })),
  };
}

export const conversations: Conversation[] = SEEDS.map(buildConversation);

export function getConversation(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}

export function conversationForOrder(orderId: string): Conversation | undefined {
  return conversations.find((c) => c.orderId === orderId);
}
