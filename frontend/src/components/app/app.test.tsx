import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CostsEditor } from "@/components/app/costs-editor";
import { EconomicsBreakdown } from "@/components/app/economics-breakdown";
import { InsightCard } from "@/components/app/insight-card";
import { ProductsTable } from "@/components/app/products-table";
import { getProduct, insights, products } from "@/lib/demo/data";
import type { Insight } from "@/lib/types";

const INSIGHT: Insight = {
  id: "R004-kit",
  ruleId: "R004",
  productId: "kit-cue-3",
  productName: "Kit 3 Cuecas Algodão",
  severity: "critical",
  title: "Vende muito, mas quase não contribui",
  evidence: ["1.160 unidades no período."],
  investigate: ["preço vs. custo", "comissão por canal"],
  limitation: "Margem mínima configurável.",
  impact: 1286.4,
  impactLabel: "para atingir a margem mínima de 10%",
};

describe("InsightCard", () => {
  it("mostra gravidade, impacto, evidência, investigação e limitação (Bloco 17)", () => {
    render(<InsightCard insight={INSIGHT} />);
    expect(screen.getByText("Crítico")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Kit 3 Cuecas Algodão" })).toHaveAttribute(
      "href",
      "/produtos/kit-cue-3",
    );
    expect(screen.getByText(/1\.286/)).toBeInTheDocument();
    expect(screen.getByText("1.160 unidades no período.")).toBeInTheDocument();
    expect(screen.getByText("preço vs. custo · comissão por canal")).toBeInTheDocument();
    expect(screen.getByText(/Limitação: Margem mínima configurável\./)).toBeInTheDocument();
  });

  it("omite o produto na página do próprio produto e o impacto quando não há", () => {
    render(<InsightCard insight={{ ...INSIGHT, impact: null }} showProduct={false} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText(/≈/)).not.toBeInTheDocument();
  });
});

describe("EconomicsBreakdown", () => {
  it("mostra cada componente com a origem do dado e o resultado", () => {
    const product = getProduct("gar-trm-1l");
    if (!product) throw new Error("produto de demonstração ausente");
    render(<EconomicsBreakdown economics={product.totals.current} />);
    expect(screen.getByText("Receita elegível")).toBeInTheDocument();
    expect(screen.getByText("Custo do produto")).toBeInTheDocument();
    expect(screen.getAllByText("Informado por você").length).toBeGreaterThan(0);
    expect(screen.getByText("Estimado")).toBeInTheDocument();
    expect(screen.getByText(/margem 22,2%/)).toBeInTheDocument();
  });

  it("não inventa resultado quando falta custo", () => {
    const product = getProduct("cap-nb-15");
    if (!product) throw new Error("produto de demonstração ausente");
    render(<EconomicsBreakdown economics={product.totals.current} />);
    const footer = screen.getByText("Resultado estimado").closest("tr");
    expect(footer).toHaveTextContent("—");
  });
});

describe("ProductsTable", () => {
  const rows = () => screen.getAllByRole("row").slice(1);

  it("lista todos os produtos com os piores primeiro", () => {
    render(<ProductsTable products={products} />);
    expect(
      screen.getByText(`${products.length} de ${products.length} produtos`),
    ).toBeInTheDocument();
    // Sem dados (sem custo) e crítico aparecem antes dos saudáveis.
    expect(within(rows()[0]).getByText('Capa para Notebook 15,6"')).toBeInTheDocument();
    expect(within(rows()[1]).getByText("Kit 3 Cuecas Algodão")).toBeInTheDocument();
  });

  it("filtra por busca, marketplace e saúde", async () => {
    const user = userEvent.setup();
    render(<ProductsTable products={products} />);

    await user.type(screen.getByLabelText("Buscar"), "kit");
    expect(rows()).toHaveLength(1);
    await user.clear(screen.getByLabelText("Buscar"));

    await user.selectOptions(screen.getByLabelText("Marketplace"), "shopee");
    expect(rows()).toHaveLength(3);

    await user.selectOptions(screen.getByLabelText("Saúde"), "critical");
    expect(rows()).toHaveLength(1);
    expect(screen.getByText("1 de 8 produtos")).toBeInTheDocument();
  });

  it("ordena por receita", async () => {
    const user = userEvent.setup();
    render(<ProductsTable products={products} />);
    await user.selectOptions(screen.getByLabelText("Ordenar por"), "revenue");
    expect(within(rows()[0]).getByText("Kit 3 Cuecas Algodão")).toBeInTheDocument();
  });
});

describe("CostsEditor", () => {
  const rows = products.map(({ id, name, sku, cost }) => ({ id, name, sku, cost }));

  it("cria nova vigência ao informar custo e preserva o histórico", async () => {
    const user = userEvent.setup();
    render(<CostsEditor rows={rows} />);

    await user.click(
      screen.getByRole("button", { name: 'Informar custo de Capa para Notebook 15,6"' }),
    );
    const unitCost = screen.getByLabelText("Custo unitário (R$)");
    await user.clear(unitCost);
    await user.type(unitCost, "32,50");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(screen.queryByText("Sem custo")).not.toBeInTheDocument();
    const history = screen.getByRole("heading", { name: "Histórico de alterações" }).parentElement;
    expect(history).toHaveTextContent("Capa para Notebook");
    expect(history).toHaveTextContent("não informado");
    expect(history).toHaveTextContent("32,50");
  });
});

describe("integração com os dados de demonstração", () => {
  it("todo insight aponta para um produto existente", () => {
    for (const insight of insights) {
      expect(getProduct(insight.productId), insight.id).toBeDefined();
    }
  });
});
