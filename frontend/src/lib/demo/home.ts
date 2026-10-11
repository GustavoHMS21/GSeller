// Tarefas do Início (Bloco 60.9): o que está pendente, com a mesma lógica das listas, agrupado
// por módulo como no painel do UpSeller.

import { products } from "@/lib/demo/data";
import { DEMO_NOW, orders } from "@/lib/demo/order-data";
import { matchesFilter, type OrderFilter, orderAttention } from "@/lib/demo/orders";
import { needsReply } from "@/lib/demo/support";
import { conversations } from "@/lib/demo/support-data";
import type { ConversationKind, Tone } from "@/lib/types";

export interface HomeTask {
  label: string;
  count: number;
  href: string;
  /** Cor do ponto ao lado do rótulo. */
  tone: Tone;
}

export interface HomeTaskGroup {
  title: string;
  tasks: HomeTask[];
}

const ordersIn = (filter: OrderFilter) =>
  orders.filter((o) => matchesFilter(o, filter, DEMO_NOW)).length;

const pendingReplies = (kind: ConversationKind) =>
  conversations.filter((c) => c.kind === kind && needsReply(c)).length;

const withProblem = (...problems: string[]) =>
  orders.filter((o) => problems.includes(orderAttention(o, DEMO_NOW)?.problem ?? "")).length;

export function homeTasks(): HomeTaskGroup[] {
  return [
    {
      title: "Pedidos",
      tasks: [
        {
          label: "Para Emitir",
          count: ordersIn("emitir"),
          href: "/pedidos?filtro=emitir",
          tone: "success",
        },
        {
          label: "Para Enviar",
          count: ordersIn("enviar"),
          href: "/pedidos?filtro=enviar",
          tone: "success",
        },
        {
          label: "Postar hoje",
          count: withProblem("ship_today"),
          href: "/pedidos?filtro=enviar",
          tone: "warning",
        },
        {
          label: "Atrasados",
          count: ordersIn("atrasados"),
          href: "/pedidos?filtro=atrasados",
          tone: "danger",
        },
      ],
    },
    {
      title: "SAC",
      tasks: [
        {
          label: "Perguntas pendentes do Mercado Livre",
          count: pendingReplies("question"),
          href: "/atendimento?filtro=perguntas",
          tone: "success",
        },
        {
          label: "Mensagens sem resposta do Mercado Livre",
          count: pendingReplies("post_sale"),
          href: "/atendimento?filtro=pos-venda",
          tone: "success",
        },
        {
          label: "Reclamações pendentes do Mercado Livre",
          count: pendingReplies("claim"),
          href: "/atendimento?filtro=reclamacoes",
          tone: "warning",
        },
        {
          label: "Devoluções a tratar",
          count: withProblem("return_damaged", "return_on_the_way"),
          href: "/pedidos?filtro=devolvidos",
          tone: "warning",
        },
      ],
    },
    {
      title: "Produtos",
      tasks: [
        {
          label: "Sem custo cadastrado",
          count: products.filter((p) => p.cost.unitCost === null).length,
          href: "/custos",
          tone: "danger",
        },
      ],
    },
  ];
}
