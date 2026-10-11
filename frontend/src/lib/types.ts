// Modelo de dados exibido pelo frontend.
// Hoje é preenchido pelos dados de demonstração (src/lib/demo); depois será o
// contrato das respostas da API. O frontend nunca lê o JSON bruto dos marketplaces (Bloco 8).

export type Marketplace = "mercadolivre" | "shopee";

/** De onde veio cada valor financeiro (data lineage, Bloco 9.3). */
type ValueOrigin = "marketplace" | "seller" | "estimated";

export type Severity = "critical" | "warning" | "info";

/** Tom visual de um status; o componente Badge decide as cores. */
export type Tone = "neutral" | "success" | "warning" | "danger" | "info";

export type HealthLevel = "healthy" | "attention" | "critical" | "unknown";

export interface CostComponent {
  key: string;
  label: string;
  /** Valor positivo que é subtraído da receita. */
  amount: number;
  origin: ValueOrigin;
  source: string;
}

export interface Economics {
  /** Receita elegível: pedidos pagos e não cancelados, antes de custos. */
  revenue: number;
  orders: number;
  units: number;
  components: CostComponent[];
  /** Null quando falta custo do produto: nunca exibir lucro fictício. */
  result: number | null;
  margin: number | null;
  /** Informativo: receita que a plataforma atribui a Ads (não entra no resultado). */
  adsAttributedRevenue: number;
  adsSpend: number;
  visits: number | null;
  conversion: number | null;
  avgPrice: number;
}

export interface ListingPeriod {
  current: Economics;
  previous: Economics;
}

export interface Listing {
  marketplace: Marketplace;
  externalId: string;
  title: string;
  period: ListingPeriod;
}

export interface Variant {
  name: string;
  sku: string;
  unitsCurrent: number;
}

export interface ProductCost {
  unitCost: number | null;
  taxRate: number;
  additionalUnitCost: number;
  validFrom: string | null;
}

export interface HealthComponent {
  label: string;
  points: number;
}

export interface Health {
  score: number | null;
  level: HealthLevel;
  version: string;
  components: HealthComponent[];
}

export interface Insight {
  id: string;
  ruleId: string;
  productId: string;
  productName: string;
  severity: Severity;
  /** O problema, em poucas palavras. */
  title: string;
  /** O número que comprova o problema, em uma linha. */
  detail: string;
  /** O que fazer, em uma frase. */
  action: string;
  /** Impacto estimado em R$ no período (30 dias), usado para priorizar a fila. */
  impact: number | null;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  cost: ProductCost;
  listings: Listing[];
  variants: Variant[];
  totals: ListingPeriod;
  health: Health;
}

/** Etapas do pedido, de ponta a ponta (issue #50). Os status dos marketplaces são mapeados para elas. */
export type OrderStage =
  | "paid"
  | "invoiced"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "claim_opened"
  | "return_shipped"
  | "returned"
  | "refunded"
  | "cancelled";

export interface Order {
  /** Número do pedido no marketplace. */
  id: string;
  marketplace: Marketplace;
  storeName: string;
  productId: string;
  productName: string;
  units: number;
  total: number;
  /** Null quando falta o custo do produto. */
  profit: number | null;
  /** Prazo de postagem definido pelo marketplace. */
  shipBy: string | null;
  /** Previsão de entrega informada ao comprador. */
  deliverBy: string | null;
  /** Prazo para responder a reclamação. */
  claimReplyBy: string | null;
  /** Etapas já ocorridas, em ordem. A primeira é sempre o pagamento. */
  events: { stage: OrderStage; at: string }[];
  /** Só em pedidos devolvidos ou reembolsados (issue #51). */
  returnInfo: { condition: ReturnCondition; cost: ReturnCost } | null;
}

/** Estado do produto devolvido. "not_returned": reembolso sem o produto voltar. */
export type ReturnCondition = "on_the_way" | "good" | "damaged" | "not_returned";

export interface ReturnCost {
  /** Frete de ida pago pelo seller, perdido na devolução. */
  outboundShipping: number;
  /** Frete de volta cobrado do seller. */
  returnShipping: number;
  /** Custo do produto que não volta a ser vendido; null sem custo cadastrado. */
  lostProduct: number | null;
  /** Null quando falta o custo do produto perdido. */
  total: number | null;
}

export type ConnectionStatus =
  | "connected"
  | "syncing"
  | "attention"
  | "expired"
  | "error"
  | "disconnected";

export interface Connection {
  marketplace: Marketplace;
  shopName: string;
  status: ConnectionStatus;
  lastSyncAt: string | null;
  detail: string;
}
