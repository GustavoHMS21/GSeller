// Montagem de um produto a partir das entradas brutas por canal e período.
// Usado pelos dados de demonstração e pelos testes das regras.

import { computeEconomics, type PeriodInput, sumEconomics } from "@/lib/demo/economics";
import { computeHealth } from "@/lib/demo/health";
import type { Listing, Marketplace, Product, ProductCost, Variant } from "@/lib/types";

export type Fees = { commissionRate: number; fixedFeePerUnit: number };

export interface ListingSeed {
  marketplace: Marketplace;
  externalId: string;
  current: PeriodInput;
  previous: PeriodInput;
}

export interface ProductSeed {
  id: string;
  name: string;
  sku: string;
  category: string;
  cost: ProductCost;
  listings: ListingSeed[];
  variants?: Variant[];
}

/** Entradas de um período com valores neutros para tudo que não for informado. */
export function period(
  fees: Fees,
  values: Partial<PeriodInput> & Pick<PeriodInput, "units" | "avgPrice">,
): PeriodInput {
  return {
    orders: values.units,
    sellerDiscount: 0,
    sellerShipping: 0,
    adsSpend: 0,
    adsAttributedRevenue: 0,
    visits: null,
    refunds: 0,
    ...fees,
    ...values,
  };
}

export function buildProduct(seed: ProductSeed): Product {
  const listings: Listing[] = seed.listings.map((l) => ({
    marketplace: l.marketplace,
    externalId: l.externalId,
    title: seed.name,
    period: {
      current: computeEconomics(l.marketplace, l.current, seed.cost),
      previous: computeEconomics(l.marketplace, l.previous, seed.cost),
    },
  }));
  const totals = {
    current: sumEconomics(listings.map((l) => l.period.current)),
    previous: sumEconomics(listings.map((l) => l.period.previous)),
  };
  return {
    id: seed.id,
    name: seed.name,
    sku: seed.sku,
    category: seed.category,
    cost: seed.cost,
    listings,
    variants: seed.variants ?? [],
    totals,
    health: computeHealth(totals),
  };
}
