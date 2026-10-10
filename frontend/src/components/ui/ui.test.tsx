import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";
import { Delta } from "@/components/ui/delta";
import { HealthBadge } from "@/components/ui/health-badge";

// Só lógica com risco de enganar a leitura financeira (Bloco 57.3).

describe("Delta: a cor comunica se a variação é boa ou ruim", () => {
  it.each([
    { value: 0.124, goodWhen: "up", text: "12,4%", tone: "text-success" },
    { value: -0.08, goodWhen: "up", text: "8,0%", tone: "text-danger" },
    { value: 0.03, goodWhen: "down", text: "3,0%", tone: "text-danger" },
    { value: -0.03, goodWhen: "down", text: "3,0%", tone: "text-success" },
    { value: 0.0001, goodWhen: "up", text: "0,0%", tone: "text-fg-muted" },
  ] as const)("$value com goodWhen=$goodWhen → $tone", ({ value, goodWhen, text, tone }) => {
    render(<Delta value={value} goodWhen={goodWhen} />);
    expect(screen.getByText(text).closest("span")).toHaveClass(tone);
  });

  it("avisa quando não há base de comparação", () => {
    render(<Delta value={null} />);
    expect(screen.getByText("sem base de comparação")).toBeInTheDocument();
  });
});

it("HealthBadge traduz o nível em texto, não só em cor (Bloco 16.4)", () => {
  render(<HealthBadge level="critical" score={45} />);
  expect(screen.getByText("Crítico")).toBeInTheDocument();
  expect(screen.getByText("· 45")).toBeInTheDocument();
});

it("Button é type=button por padrão para não enviar formulários sem querer", () => {
  render(<Button>Salvar</Button>);
  expect(screen.getByRole("button", { name: "Salvar" })).toHaveAttribute("type", "button");
});
