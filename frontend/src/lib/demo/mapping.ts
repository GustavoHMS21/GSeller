// Mapeamento SKU ↔ anúncio (issue #67, Bloco 61.5). Sem o vínculo a um produto com custo,
// o anúncio vende e o lucro dele não é calculado. Especificação da regra do backend.

import type { Marketplace, Product, Tone } from "@/lib/types";

/** Anúncio como chega da sincronização, com as vendas dos últimos 30 dias. */
export interface SyncedListing {
  marketplace: Marketplace;
  externalId: string;
  title: string;
  /** SKU preenchido pelo seller no anúncio. */
  sku: string | null;
  revenue: number;
  orders: number;
}

export type MappingStatus = "sku" | "manual" | "no_cost" | "unknown_sku" | "no_sku";

export interface ListingMapping {
  listing: SyncedListing;
  status: MappingStatus;
  product: Product | null;
  /** O que fazer; null quando o lucro já é calculado. */
  action: string | null;
}

export const STATUS_LABEL: Record<MappingStatus, { label: string; tone: Tone }> = {
  sku: { label: "Vinculado pelo SKU", tone: "success" },
  manual: { label: "Vinculado à mão", tone: "success" },
  no_cost: { label: "Produto sem custo", tone: "warning" },
  unknown_sku: { label: "SKU sem produto", tone: "danger" },
  no_sku: { label: "Sem SKU", tone: "danger" },
};

export const listingKey = (l: Pick<SyncedListing, "marketplace" | "externalId">) =>
  `${l.marketplace}:${l.externalId}`;

const normalize = (sku: string) => sku.trim().toUpperCase();

/**
 * Vínculo manual vale mais que o SKU. Depois, o SKU do anúncio é comparado com o do produto
 * e o das variantes, sem diferença de caixa nem espaços nas pontas.
 */
export function mapListing(
  listing: SyncedListing,
  products: Product[],
  manualLinks: Record<string, string>,
): ListingMapping {
  const manualId = manualLinks[listingKey(listing)];
  const sku = listing.sku?.trim() ? normalize(listing.sku) : null;
  const product = manualId
    ? (products.find((p) => p.id === manualId) ?? null)
    : sku
      ? (products.find(
          (p) => normalize(p.sku) === sku || p.variants.some((v) => normalize(v.sku) === sku),
        ) ?? null)
      : null;

  if (!product) {
    return sku
      ? {
          listing,
          product,
          status: "unknown_sku",
          action: `Cadastre um produto com o SKU ${sku} ou vincule o anúncio a um produto.`,
        }
      : {
          listing,
          product,
          status: "no_sku",
          action: "Vincule o anúncio a um produto ou preencha o SKU no marketplace.",
        };
  }
  if (product.cost.unitCost === null) {
    return { listing, product, status: "no_cost", action: "Cadastre o custo do produto." };
  }
  return { listing, product, status: manualId ? "manual" : "sku", action: null };
}

export const hasProblem = (m: ListingMapping) => m.action !== null;

export const MAPPING_FILTERS = [
  { value: "problemas", label: "Com problema" },
  { value: "vinculados", label: "Vinculados" },
] as const;

export type MappingFilter = (typeof MAPPING_FILTERS)[number]["value"];

export function matchesMappingFilter(m: ListingMapping, filter: MappingFilter): boolean {
  return filter === "problemas" ? hasProblem(m) : !hasProblem(m);
}
