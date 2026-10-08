// Dados de DEMONSTRAÇÃO de uma loja fictícia, usados no protótipo de discovery.
// Nenhum dado real de seller ou comprador. Cada produto foi desenhado para exercitar
// uma regra do Bloco 10, para testar se o seller entende o diagnóstico.

import { computeEconomics, sumEconomics, type PeriodInput } from "@/lib/demo/economics";
import { computeHealth } from "@/lib/demo/health";
import { generateInsights } from "@/lib/demo/rules";
import type { Connection, Listing, Marketplace, Product, ProductCost, Variant } from "@/lib/types";

export const DEMO = {
  storeName: "Loja Exemplo",
  periodLabel: "Últimos 30 dias (08/09 a 07/10/2026)",
  comparisonLabel: "vs. 30 dias anteriores",
  lastSyncAt: "2026-10-08T14:32:00-03:00",
};

const ML = { commissionRate: 0.14, fixedFeePerUnit: 0 };
const ML_LOW_TICKET = { commissionRate: 0.14, fixedFeePerUnit: 6.75 };
const ML_PREMIUM = { commissionRate: 0.19, fixedFeePerUnit: 0 };
const SHOPEE = { commissionRate: 0.2, fixedFeePerUnit: 4 };

type Fees = { commissionRate: number; fixedFeePerUnit: number };

function period(fees: Fees, values: Partial<PeriodInput> & Pick<PeriodInput, "units" | "avgPrice">): PeriodInput {
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

interface ListingSeed {
  marketplace: Marketplace;
  externalId: string;
  current: PeriodInput;
  previous: PeriodInput;
}

interface ProductSeed {
  id: string;
  name: string;
  sku: string;
  category: string;
  cost: ProductCost;
  listings: ListingSeed[];
  variants?: Variant[];
}

const SEEDS: ProductSeed[] = [
  {
    id: "cam-ovs-pt",
    name: "Camiseta Oversized Preta",
    sku: "CAM-OVS-PT",
    category: "Moda",
    cost: { unitCost: 26, taxRate: 0.06, additionalUnitCost: 1.5, validFrom: "2026-08-01" },
    variants: [
      { name: "P / Preta", sku: "CAM-OVS-PT-P", unitsCurrent: 96 },
      { name: "M / Preta", sku: "CAM-OVS-PT-M", unitsCurrent: 162 },
      { name: "G / Preta", sku: "CAM-OVS-PT-G", unitsCurrent: 122 },
    ],
    listings: [
      {
        marketplace: "mercadolivre",
        externalId: "MLB3810001",
        current: period(ML, { units: 212, orders: 205, avgPrice: 79.9, sellerShipping: 2120, adsSpend: 620, adsAttributedRevenue: 2600, visits: 7100, refunds: 160 }),
        previous: period(ML, { units: 196, orders: 190, avgPrice: 79.9, sellerShipping: 1960, adsSpend: 580, adsAttributedRevenue: 2450, visits: 6800, refunds: 150 }),
      },
      {
        marketplace: "shopee",
        externalId: "22870015",
        current: period(SHOPEE, { units: 168, orders: 160, avgPrice: 64.9, adsSpend: 290, adsAttributedRevenue: 900, visits: 9400, refunds: 120 }),
        previous: period(SHOPEE, { units: 150, orders: 144, avgPrice: 64.9, adsSpend: 270, adsAttributedRevenue: 850, visits: 8900, refunds: 100 }),
      },
    ],
  },
  {
    id: "gar-trm-1l",
    name: "Garrafa Térmica Inox 1L",
    sku: "GAR-TRM-1L",
    category: "Casa",
    cost: { unitCost: 38, taxRate: 0.06, additionalUnitCost: 2, validFrom: "2026-07-15" },
    listings: [
      {
        marketplace: "mercadolivre",
        externalId: "MLB3810002",
        current: period(ML, { units: 385, orders: 380, avgPrice: 114.9, sellerDiscount: 3900, sellerShipping: 4620, adsSpend: 1200, adsAttributedRevenue: 5000, visits: 13600, refunds: 460 }),
        previous: period(ML, { units: 300, orders: 296, avgPrice: 119.9, sellerDiscount: 900, sellerShipping: 3600, adsSpend: 900, adsAttributedRevenue: 4200, visits: 11000, refunds: 360 }),
      },
    ],
  },
  {
    id: "fon-bt-x1",
    name: "Fone Bluetooth X1",
    sku: "FON-BT-X1",
    category: "Eletrônicos",
    cost: { unitCost: 52, taxRate: 0.06, additionalUnitCost: 1, validFrom: "2026-06-01" },
    listings: [
      {
        marketplace: "mercadolivre",
        externalId: "MLB3810003",
        current: period(ML_PREMIUM, { units: 112, orders: 110, avgPrice: 141.9, sellerShipping: 1568, adsSpend: 720, adsAttributedRevenue: 2300, visits: 5150, refunds: 140 }),
        previous: period(ML_PREMIUM, { units: 158, orders: 156, avgPrice: 129.9, sellerShipping: 2212, adsSpend: 700, adsAttributedRevenue: 3100, visits: 5200, refunds: 260 }),
      },
    ],
  },
  {
    id: "kit-cue-3",
    name: "Kit 3 Cuecas Algodão",
    sku: "KIT-CUE-3",
    category: "Moda",
    cost: { unitCost: 31, taxRate: 0.06, additionalUnitCost: 1.2, validFrom: "2026-05-10" },
    listings: [
      {
        marketplace: "mercadolivre",
        externalId: "MLB3810004",
        current: period(ML_LOW_TICKET, { units: 640, orders: 630, avgPrice: 59.9, adsSpend: 1400, adsAttributedRevenue: 6100, visits: 21000, refunds: 380 }),
        previous: period(ML_LOW_TICKET, { units: 610, orders: 600, avgPrice: 59.9, adsSpend: 1350, adsAttributedRevenue: 5900, visits: 20500, refunds: 360 }),
      },
      {
        marketplace: "shopee",
        externalId: "22870018",
        current: period(SHOPEE, { units: 520, orders: 515, avgPrice: 54.9, adsSpend: 600, adsAttributedRevenue: 2100, visits: 24000, refunds: 260 }),
        previous: period(SHOPEE, { units: 500, orders: 495, avgPrice: 54.9, adsSpend: 580, adsAttributedRevenue: 2000, visits: 23500, refunds: 240 }),
      },
    ],
  },
  {
    id: "org-gav-6",
    name: "Organizador de Gaveta 6 Divisórias",
    sku: "ORG-GAV-6",
    category: "Casa",
    cost: { unitCost: 9, taxRate: 0.06, additionalUnitCost: 0.8, validFrom: "2026-04-01" },
    listings: [
      {
        marketplace: "mercadolivre",
        externalId: "MLB3810005",
        current: period(ML_LOW_TICKET, { units: 290, orders: 285, avgPrice: 49.9, adsSpend: 150, adsAttributedRevenue: 900, visits: 8200, refunds: 40 }),
        previous: period(ML_LOW_TICKET, { units: 260, orders: 255, avgPrice: 49.9, adsSpend: 140, adsAttributedRevenue: 850, visits: 7700, refunds: 50 }),
      },
    ],
  },
  {
    id: "lum-led-m",
    name: "Luminária LED de Mesa",
    sku: "LUM-LED-M",
    category: "Casa",
    cost: { unitCost: 41, taxRate: 0.06, additionalUnitCost: 1.5, validFrom: "2026-06-20" },
    listings: [
      {
        marketplace: "mercadolivre",
        externalId: "MLB3810006",
        current: period(ML, { units: 158, orders: 156, avgPrice: 99.9, sellerShipping: 2054, adsSpend: 1150, adsAttributedRevenue: 2000, visits: 6900, refunds: 100 }),
        previous: period(ML, { units: 150, orders: 148, avgPrice: 99.9, sellerShipping: 1950, adsSpend: 400, adsAttributedRevenue: 1800, visits: 6000, refunds: 100 }),
      },
    ],
  },
  {
    id: "cap-nb-15",
    name: "Capa para Notebook 15,6\"",
    sku: "CAP-NB-15",
    category: "Acessórios",
    cost: { unitCost: null, taxRate: 0.06, additionalUnitCost: 0, validFrom: null },
    listings: [
      {
        marketplace: "mercadolivre",
        externalId: "MLB3810007",
        current: period(ML_LOW_TICKET, { units: 140, orders: 138, avgPrice: 69.9, visits: 4100, refunds: 70 }),
        previous: period(ML_LOW_TICKET, { units: 128, orders: 126, avgPrice: 69.9, visits: 3900, refunds: 60 }),
      },
    ],
  },
  {
    id: "moc-exe-01",
    name: "Mochila Executiva Antifurto",
    sku: "MOC-EXE-01",
    category: "Acessórios",
    cost: { unitCost: 78, taxRate: 0.06, additionalUnitCost: 2, validFrom: "2026-03-01" },
    listings: [
      {
        marketplace: "mercadolivre",
        externalId: "MLB3810008",
        current: period(ML, { units: 74, orders: 73, avgPrice: 189.9, sellerShipping: 1332, adsSpend: 500, adsAttributedRevenue: 2400, visits: 4100, refunds: 190 }),
        previous: period(ML, { units: 96, orders: 95, avgPrice: 189.9, sellerShipping: 1728, adsSpend: 500, adsAttributedRevenue: 2600, visits: 4300, refunds: 380 }),
      },
      {
        marketplace: "shopee",
        externalId: "22870021",
        current: period(SHOPEE, { units: 52, orders: 52, avgPrice: 184.9, adsSpend: 150, adsAttributedRevenue: 700, visits: 3300 }),
        previous: period(SHOPEE, { units: 40, orders: 40, avgPrice: 184.9, adsSpend: 150, adsAttributedRevenue: 650, visits: 3000 }),
      },
    ],
  },
];

function buildProduct(seed: ProductSeed): Product {
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

export const products: Product[] = SEEDS.map(buildProduct);

export const insights = generateInsights(products);

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export const connections: Connection[] = [
  {
    marketplace: "mercadolivre",
    shopName: DEMO.storeName,
    status: "connected",
    lastSyncAt: DEMO.lastSyncAt,
    detail: "Acesso somente leitura. Produtos, pedidos, tarifas e Ads sincronizados.",
  },
  {
    marketplace: "shopee",
    shopName: DEMO.storeName,
    status: "connected",
    lastSyncAt: "2026-10-08T14:10:00-03:00",
    detail: "Acesso somente leitura. Produtos, pedidos e tarifas sincronizados.",
  },
];

/** Visão consolidada da loja. O resultado considera apenas produtos com custo cadastrado. */
export function storeSummary(marketplace?: Marketplace) {
  const pick = (p: Product) =>
    p.listings.filter((l) => !marketplace || l.marketplace === marketplace);
  const current = products.flatMap((p) => pick(p).map((l) => l.period.current));
  const previous = products.flatMap((p) => pick(p).map((l) => l.period.previous));

  const withCost = (list: typeof current) => list.filter((e) => e.result !== null);
  const all = { current: sumEconomics(current), previous: sumEconomics(previous) };
  const costed = { current: sumEconomics(withCost(current)), previous: sumEconomics(withCost(previous)) };

  return {
    revenue: all,
    result: costed,
    coverage: all.current.revenue ? costed.current.revenue / all.current.revenue : 0,
    productsWithoutCost: products.filter((p) => p.cost.unitCost === null && pick(p).length > 0).length,
  };
}
