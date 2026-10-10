import { describe, expect, it } from "vitest";
import { insights as demoInsights, products as demoProducts } from "@/lib/demo/data";
import { buildProduct, type Fees, type ListingSeed, period } from "@/lib/demo/product";
import { generateInsights } from "@/lib/demo/rules";
import type { Product, ProductCost } from "@/lib/types";

const ML: Fees = { commissionRate: 0.14, fixedFeePerUnit: 0 };
const ML_LOW_TICKET: Fees = { commissionRate: 0.14, fixedFeePerUnit: 6.75 };
const ML_PREMIUM: Fees = { commissionRate: 0.19, fixedFeePerUnit: 0 };
const SHOPEE: Fees = { commissionRate: 0.2, fixedFeePerUnit: 4 };

const cost = (unitCost: number | null, taxRate = 0.06): ProductCost => ({
  unitCost,
  taxRate,
  additionalUnitCost: 0,
  validFrom: unitCost === null ? null : "2026-01-01",
});

function product(id: string, listings: ListingSeed[], productCost: ProductCost): Product {
  return buildProduct({
    id,
    name: `Produto ${id}`,
    sku: id.toUpperCase(),
    category: "Teste",
    cost: productCost,
    listings,
  });
}

const ruleIds = (items: Product[]) => generateInsights(items).map((i) => i.ruleId);

// ---------------------------------------------------------------------------
// Cenários
// ---------------------------------------------------------------------------
function conversionDrop({ priceUp = true, visitsCurrent = 5_100 } = {}) {
  return product(
    "fone",
    [
      {
        marketplace: "mercadolivre",
        externalId: "MLB1",
        previous: period(ML_PREMIUM, { units: 150, avgPrice: 130, visits: 5_000 }),
        current: period(ML_PREMIUM, {
          units: 100,
          avgPrice: priceUp ? 142 : 130,
          visits: visitsCurrent,
        }),
      },
    ],
    cost(50),
  );
}

function growthWithMarginLoss() {
  return product(
    "garrafa",
    [
      {
        marketplace: "mercadolivre",
        externalId: "MLB2",
        previous: period(ML, { units: 100, avgPrice: 100 }),
        current: period(ML, { units: 125, avgPrice: 100, sellerDiscount: 1_500 }),
      },
    ],
    cost(40),
  );
}

function adsPressure() {
  return product(
    "luminaria",
    [
      {
        marketplace: "mercadolivre",
        externalId: "MLB3",
        previous: period(ML, {
          units: 100,
          avgPrice: 100,
          adsSpend: 400,
          adsAttributedRevenue: 1_800,
        }),
        current: period(ML, {
          units: 105,
          avgPrice: 100,
          adsSpend: 1_200,
          adsAttributedRevenue: 1_900,
        }),
      },
    ],
    cost(40),
  );
}

function crossChannel({ shopeeUnits = 50, shopeeFees = SHOPEE, shopeePrice = 65 } = {}) {
  const ml = period(ML, { units: 50, avgPrice: 80 });
  const sp = period(shopeeFees, { units: shopeeUnits, avgPrice: shopeePrice });
  return product(
    "camiseta",
    [
      { marketplace: "mercadolivre", externalId: "MLB4", previous: ml, current: ml },
      { marketplace: "shopee", externalId: "SP4", previous: sp, current: sp },
    ],
    cost(26),
  );
}

function highVolumeLowMargin() {
  const p = period(ML_LOW_TICKET, { units: 500, avgPrice: 60 });
  return product(
    "kit",
    [{ marketplace: "mercadolivre", externalId: "MLB5", previous: p, current: p }],
    cost(40),
  );
}

function healthy(id: string, units: number) {
  const p = period(ML, { units, avgPrice: 100 });
  return product(
    id,
    [{ marketplace: "mercadolivre", externalId: id, previous: p, current: p }],
    cost(30),
  );
}

function withoutCost() {
  const p = period(ML, { units: 40, avgPrice: 70 });
  return product(
    "capa",
    [{ marketplace: "mercadolivre", externalId: "MLB6", previous: p, current: p }],
    cost(null),
  );
}

// ---------------------------------------------------------------------------
// Regras
// ---------------------------------------------------------------------------
describe("R001 — conversão caiu com tráfego estável", () => {
  it("dispara e cita o aumento de preço como sinal a investigar", () => {
    const [insight] = generateInsights([conversionDrop()]);
    expect(insight.ruleId).toBe("R001");
    expect(insight.severity).toBe("warning");
    expect(insight.title).toContain("Mercado Livre");
    expect(insight.evidence).toHaveLength(3);
    expect(insight.investigate[0]).toBe("competitividade de preço");
    expect(insight.limitation).toContain("não é causa comprovada");
    expect(insight.impact).toBeGreaterThan(0);
  });

  it("sem mudança de preço, não sugere preço como primeira hipótese", () => {
    const [insight] = generateInsights([conversionDrop({ priceUp: false })]);
    expect(insight.evidence).toHaveLength(2);
    expect(insight.investigate[0]).toBe("frete e prazo");
  });

  it("não dispara quando as visitas mudaram mais de 10%", () => {
    expect(ruleIds([conversionDrop({ visitsCurrent: 6_000 })])).not.toContain("R001");
  });
});

describe("R002 — receita cresceu, margem caiu", () => {
  it("dispara e aponta o desconto como maior pressão", () => {
    const [insight] = generateInsights([growthWithMarginLoss()]);
    expect(insight.ruleId).toBe("R002");
    expect(insight.evidence[2]).toContain("desconto financiado por você");
    expect(insight.investigate).toContain("profundidade e duração das promoções");
    expect(insight.impact).toBeCloseTo(0.12 * 12_500);
  });
});

describe("R004 — vende muito, contribui pouco", () => {
  it("dispara como crítico para o produto de alto volume e margem baixa", () => {
    const items = [highVolumeLowMargin(), healthy("a", 50), healthy("b", 60), healthy("c", 70)];
    const result = generateInsights(items);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ ruleId: "R004", severity: "critical", productId: "kit" });
  });

  it("não dispara para produto saudável de alto volume", () => {
    expect(ruleIds([healthy("a", 500), healthy("b", 50)])).toEqual([]);
  });
});

describe("R005 — Ads subiu sem retorno proporcional", () => {
  it("dispara e usa o gasto adicional como impacto", () => {
    const [insight] = generateInsights([adsPressure()]);
    expect(insight.ruleId).toBe("R005");
    expect(insight.impact).toBe(800);
    expect(insight.limitation).toContain("não é receita realizada");
  });
});

describe("R006 — sem custo cadastrado", () => {
  it("dispara sem impacto em R$ e sem calcular resultado", () => {
    const [insight] = generateInsights([withoutCost()]);
    expect(insight.ruleId).toBe("R006");
    expect(insight.impact).toBeNull();
  });
});

describe("R003 — mesmo produto rende diferente entre canais", () => {
  it("dispara quando a diferença de margem passa de 5 p.p.", () => {
    const [insight] = generateInsights([crossChannel()]);
    expect(insight.ruleId).toBe("R003");
    expect(insight.severity).toBe("info");
    expect(insight.title).toContain("Mercado Livre");
    expect(insight.impact).toBeCloseTo((38 - 18.1) * 50);
  });

  it("não dispara com diferença pequena", () => {
    expect(ruleIds([crossChannel({ shopeeFees: ML, shopeePrice: 78 })])).toEqual([]);
  });

  it("não dispara com volume insuficiente em um dos canais", () => {
    expect(ruleIds([crossChannel({ shopeeUnits: 20 })])).toEqual([]);
  });
});

describe("priorização da fila", () => {
  it("ordena por gravidade e, dentro dela, por impacto (sem impacto por último)", () => {
    const items = [crossChannel(), withoutCost(), growthWithMarginLoss(), highVolumeLowMargin()];
    expect(ruleIds(items)).toEqual(["R004", "R002", "R006", "R003"]);
  });
});

// ---------------------------------------------------------------------------
// Dados de demonstração: protegem os cenários usados nas entrevistas (Bloco 49.4)
// ---------------------------------------------------------------------------
describe("cenários do protótipo de discovery", () => {
  const rulesFor = (id: string) =>
    demoInsights
      .filter((i) => i.productId === id)
      .map((i) => i.ruleId)
      .sort();

  it.each([
    ["kit-cue-3", ["R003", "R004"]],
    ["gar-trm-1l", ["R002"]],
    ["fon-bt-x1", ["R001"]],
    ["lum-led-m", ["R005"]],
    ["cap-nb-15", ["R006"]],
    ["cam-ovs-pt", ["R003"]],
    ["org-gav-6", []],
    ["moc-exe-01", []],
  ])("%s dispara %j", (id, expected) => {
    expect(rulesFor(id)).toEqual(expected);
  });

  it("nenhum produto com alerta aparece como saudável", () => {
    const withAlert = new Set(
      demoInsights.filter((i) => i.severity !== "info").map((i) => i.productId),
    );
    for (const p of demoProducts.filter((p) => withAlert.has(p.id))) {
      expect(p.health.level, p.id).not.toBe("healthy");
    }
  });
});
