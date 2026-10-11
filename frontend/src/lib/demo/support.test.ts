import { describe, expect, it } from "vitest";
import { DEMO_NOW, orders } from "@/lib/demo/order-data";
import {
  findContactLeak,
  matchesSupportFilter,
  QUICK_REPLIES,
  replyDue,
  sortConversations,
} from "@/lib/demo/support";
import { conversations } from "@/lib/demo/support-data";
import type { Conversation, ConversationKind } from "@/lib/types";

const NOW = new Date("2026-10-08T14:32:00-03:00");

function conv(
  kind: ConversationKind,
  messages: ["buyer" | "seller", string][],
  replyBy: string | null = null,
): Conversation {
  return {
    id: `${kind}-${messages.length}-${messages[0][1]}`,
    kind,
    marketplace: "mercadolivre",
    storeName: "Loja",
    productId: "p",
    productName: "Produto",
    orderId: null,
    replyBy,
    messages: messages.map(([from, at]) => ({ from, text: "texto", at })),
  };
}

describe("replyDue", () => {
  it("pergunta tem 1 hora: perto do fim fica em alerta", () => {
    const due = replyDue(conv("question", [["buyer", "2026-10-08T14:05:00-03:00"]]), NOW);
    expect(due).toEqual({ overdue: false, label: "Responda em 33 min", tone: "warning" });
  });

  it("pergunta sem resposta depois de 1 hora está atrasada", () => {
    const due = replyDue(conv("question", [["buyer", "2026-10-08T11:30:00-03:00"]]), NOW);
    expect(due).toMatchObject({ overdue: true, label: "Atrasada há 2 h", tone: "danger" });
  });

  it("pós-venda tem 24 horas a partir da última mensagem do comprador", () => {
    const due = replyDue(conv("post_sale", [["buyer", "2026-10-08T09:00:00-03:00"]]), NOW);
    expect(due).toMatchObject({ overdue: false, label: "Responda em 18 h", tone: "neutral" });
  });

  it("reclamação usa o prazo do marketplace", () => {
    const due = replyDue(
      conv("claim", [["buyer", "2026-10-01T09:00:00-03:00"]], "2026-10-08T20:00:00-03:00"),
      NOW,
    );
    expect(due?.label).toBe("Responda em 5 h");
  });

  it("respondida não tem prazo", () => {
    const c = conv("question", [
      ["buyer", "2026-10-08T10:00:00-03:00"],
      ["seller", "2026-10-08T10:05:00-03:00"],
    ]);
    expect(replyDue(c, NOW)).toBeNull();
  });
});

describe("sortConversations", () => {
  it("pendentes pelo prazo mais próximo; respondidas por último", () => {
    const answered = conv("question", [
      ["buyer", "2026-10-08T13:00:00-03:00"],
      ["seller", "2026-10-08T13:10:00-03:00"],
    ]);
    const postSale = conv("post_sale", [["buyer", "2026-10-08T09:00:00-03:00"]]);
    const lateQuestion = conv("question", [["buyer", "2026-10-08T11:30:00-03:00"]]);
    const claim = conv(
      "claim",
      [["buyer", "2026-10-07T09:00:00-03:00"]],
      "2026-10-08T20:00:00-03:00",
    );
    expect(sortConversations([answered, postSale, claim, lateQuestion])).toEqual([
      lateQuestion,
      claim,
      postSale,
      answered,
    ]);
  });
});

describe("findContactLeak", () => {
  it.each([
    ["Me chama no (11) 98765-4321", "telefone"],
    ["Manda para loja@exemplo.com", "e-mail"],
    ["Veja em www.minhaloja.com.br", "link"],
    ["Fala comigo no WhatsApp", "rede social ou WhatsApp"],
    ["chama no zap", "rede social ou WhatsApp"],
  ])("%s → bloqueia (%s)", (text, kind) => {
    expect(findContactLeak(text)).toContain(kind);
  });

  it.each([
    "Seu pedido 2000012345678901 foi postado hoje.",
    "Custa R$ 189,90 e cabe notebook de 15,6 polegadas.",
  ])("não confunde pedido e preço com contato: %s", (text) => {
    expect(findContactLeak(text)).toBeNull();
  });

  it("as respostas prontas passam na própria trava", () => {
    for (const reply of QUICK_REPLIES) expect(findContactLeak(reply.text), reply.label).toBeNull();
  });
});

describe("conversas de demonstração", () => {
  it("cada filtro tem ao menos uma conversa", () => {
    for (const filter of ["responder", "perguntas", "pos-venda", "reclamacoes"] as const) {
      expect(conversations.some((c) => matchesSupportFilter(c, filter))).toBe(true);
    }
  });

  it("toda conversa ligada a pedido aponta para um pedido que existe", () => {
    for (const c of conversations.filter((c) => c.orderId)) {
      expect(
        orders.some((o) => o.id === c.orderId),
        c.id,
      ).toBe(true);
    }
  });

  it("há pendência atrasada e em alerta, para a entrevista mostrar a urgência", () => {
    const dues = conversations.map((c) => replyDue(c, DEMO_NOW));
    expect(dues.some((d) => d?.overdue)).toBe(true);
    expect(dues.some((d) => d?.tone === "warning")).toBe(true);
  });
});
