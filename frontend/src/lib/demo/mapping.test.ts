import { describe, expect, it } from "vitest";
import { products as demoProducts, listingMappings, MANUAL_LINKS } from "@/lib/demo/data";
import { listingKey, type MappingStatus, mapListing, type SyncedListing } from "@/lib/demo/mapping";
import { buildProduct } from "@/lib/demo/product";

const camiseta = buildProduct({
  id: "camiseta",
  name: "Camiseta",
  sku: "CAM-01",
  category: "Teste",
  cost: { unitCost: 20, taxRate: 0.06, additionalUnitCost: 0, validFrom: "2026-01-01" },
  listings: [],
  variants: [{ name: "P", sku: "CAM-01-P", unitsCurrent: 0 }],
});
const semCusto = buildProduct({
  id: "sem-custo",
  name: "Sem custo",
  sku: "SC-01",
  category: "Teste",
  cost: { unitCost: null, taxRate: 0.06, additionalUnitCost: 0, validFrom: null },
  listings: [],
});

const listing = (sku: string | null): SyncedListing => ({
  marketplace: "shopee",
  externalId: "1",
  title: "Anúncio",
  sku,
  revenue: 100,
  orders: 1,
});

describe("vínculo do anúncio ao produto", () => {
  it.each<[string, string | null, Record<string, string>, MappingStatus, string | null]>([
    ["SKU igual ao do produto", "CAM-01", {}, "sku", "camiseta"],
    ["caixa e espaços nas pontas", "  cam-01 ", {}, "sku", "camiseta"],
    ["SKU de uma variante", "CAM-01-P", {}, "sku", "camiseta"],
    ["SKU que não existe", "CAM-02", {}, "unknown_sku", null],
    ["anúncio sem SKU", null, {}, "no_sku", null],
    ["SKU em branco", "  ", {}, "no_sku", null],
    ["produto sem custo", "SC-01", {}, "no_cost", "sem-custo"],
    [
      "vínculo manual vale mais que o SKU",
      "SC-01",
      { "shopee:1": "camiseta" },
      "manual",
      "camiseta",
    ],
    ["vínculo manual sem SKU", null, { "shopee:1": "camiseta" }, "manual", "camiseta"],
    [
      "vínculo manual a produto sem custo",
      null,
      { "shopee:1": "sem-custo" },
      "no_cost",
      "sem-custo",
    ],
  ])("%s", (_, sku, links, status, productId) => {
    const m = mapListing(listing(sku), [camiseta, semCusto], links);
    expect(m.status).toBe(status);
    expect(m.product?.id ?? null).toBe(productId);
    expect(m.action === null).toBe(status === "sku" || status === "manual");
  });

  it("o anúncio de outro marketplace não usa o vínculo manual", () => {
    const ml = { ...listing("CAM-02"), marketplace: "mercadolivre" as const };
    expect(mapListing(ml, [camiseta], { "shopee:1": "camiseta" }).status).toBe("unknown_sku");
  });
});

describe("demonstração", () => {
  it("todo anúncio de um produto resolve para esse produto", () => {
    const owner = new Map(
      demoProducts.flatMap((p) => p.listings.map((l) => [listingKey(l), p.id] as const)),
    );
    for (const m of listingMappings) {
      expect(m.product?.id, listingKey(m.listing)).toBe(owner.get(listingKey(m.listing)));
    }
  });

  it("todo vínculo manual aponta para um produto que existe", () => {
    for (const id of Object.values(MANUAL_LINKS)) {
      expect(
        demoProducts.some((p) => p.id === id),
        id,
      ).toBe(true);
    }
  });
});
