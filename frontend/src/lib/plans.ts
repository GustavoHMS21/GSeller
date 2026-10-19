// Planos de assinatura (Blocos 58 e 60.10). Três planos, cada um igual ou melhor em volume que o
// plano pago equivalente do UpSeller e mais barato. Fonte única para a tela de planos.

export type Plan = {
  id: "start" | "pro" | "scale";
  name: string;
  tagline: string;
  monthlyPrice: number;
  ordersPerMonth: number;
  /** Contas de marketplace conectadas. */
  stores: number;
  /** Empresas (CNPJ) na mesma conta. */
  companies: number;
  recommended?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "start",
    name: "Start",
    tagline: "Para quem está começando a vender",
    monthlyPrice: 97,
    ordersPerMonth: 2000,
    stores: 5,
    companies: 3,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Para crescer em mais de um marketplace",
    monthlyPrice: 197,
    ordersPerMonth: 6000,
    stores: 15,
    companies: 8,
    recommended: true,
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "Para operações com volume",
    monthlyPrice: 497,
    ordersPerMonth: 20000,
    stores: 50,
    companies: 15,
  },
];

/** Incluído em todos os planos: o que muda entre eles é o volume. */
export const INCLUDED_FEATURES = [
  "Lucro e margem por pedido e por produto",
  "Alertas do que corrigir no lucro",
  "Pedidos de ponta a ponta e devoluções com custo",
  "SAC do Mercado Livre com prazos",
  "Vários CNPJs na mesma conta",
];
