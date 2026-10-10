// Planos de assinatura (Bloco 58). Preços decididos em 2026-10-10; limites são proposta da #35,
// ainda a confirmar pelo mantenedor. Fonte única para a tela de planos.

export type Plan = {
  id: "start" | "pro" | "scale";
  name: string;
  monthlyPrice: number;
  ordersPerMonth: number;
  channels: string;
  recommended?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "start",
    name: "Start",
    monthlyPrice: 97,
    ordersPerMonth: 500,
    channels: "1 conta do Mercado Livre",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 197,
    ordersPerMonth: 2000,
    channels: "Mercado Livre e Shopee, até 2 contas",
    recommended: true,
  },
  { id: "scale", name: "Scale", monthlyPrice: 297, ordersPerMonth: 5000, channels: "Até 5 contas" },
];
