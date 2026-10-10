import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Delta } from "@/components/ui/delta";
import { HealthBadge } from "@/components/ui/health-badge";
import { KpiCard } from "@/components/ui/kpi-card";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";

describe("Delta", () => {
  it("mostra aumento em verde quando subir é bom", () => {
    render(<Delta value={0.124} />);
    const delta = screen.getByText("12,4%").closest("span");
    expect(delta).toHaveClass("text-success");
    expect(screen.getByText("aumento de")).toHaveClass("sr-only");
  });

  it("mostra aumento em vermelho quando subir é ruim", () => {
    render(<Delta value={0.03} goodWhen="down" />);
    expect(screen.getByText("3,0%").closest("span")).toHaveClass("text-danger");
  });

  it("usa pontos percentuais para variação de margem", () => {
    render(<Delta value={-0.021} kind="pp" />);
    expect(screen.getByText("2,1 p.p.").closest("span")).toHaveClass("text-danger");
    expect(screen.getByText("queda de")).toBeInTheDocument();
  });

  it("trata variações irrelevantes como estáveis", () => {
    render(<Delta value={0.0001} />);
    expect(screen.getByText("estável")).toBeInTheDocument();
  });

  it("avisa quando não há base de comparação", () => {
    render(<Delta value={null} />);
    expect(screen.getByText("sem base de comparação")).toBeInTheDocument();
  });
});

describe("status nunca depende só da cor (Bloco 16.4)", () => {
  it("HealthBadge mostra rótulo e score", () => {
    render(<HealthBadge level="critical" score={45} />);
    expect(screen.getByText("Crítico")).toBeInTheDocument();
    expect(screen.getByText("· 45")).toBeInTheDocument();
  });

  it("HealthBadge sem dados não mostra score", () => {
    render(<HealthBadge level="unknown" />);
    expect(screen.getByText("Sem dados")).toBeInTheDocument();
  });

  it("Badge esconde o ícone de leitores de tela", () => {
    render(
      <Badge tone="warning" icon="▲">
        Atenção
      </Badge>,
    );
    expect(screen.getByText("▲")).toHaveAttribute("aria-hidden", "true");
  });

  it("MarketplaceBadge mostra o nome do canal", () => {
    render(<MarketplaceBadge marketplace="shopee" />);
    expect(screen.getByText("Shopee")).toBeInTheDocument();
  });
});

describe("KpiCard", () => {
  it("mostra título, valor, comparação, nota e fórmula", () => {
    render(
      <KpiCard
        title="Margem estimada"
        value="22,4%"
        delta={0.021}
        deltaKind="pp"
        comparison="vs. período anterior"
        note="Cobre 95% da receita"
        formula={<p>Resultado ÷ receita</p>}
      />,
    );
    expect(screen.getByRole("heading", { name: "Margem estimada" })).toBeInTheDocument();
    expect(screen.getByText("22,4%")).toBeInTheDocument();
    expect(screen.getByText("vs. período anterior")).toBeInTheDocument();
    expect(screen.getByText("Cobre 95% da receita")).toBeInTheDocument();
    expect(screen.getByText("Como calculamos?")).toBeInTheDocument();
    expect(screen.getByText("Resultado ÷ receita")).toBeInTheDocument();
  });
});

describe("estados", () => {
  it("ErrorState é anunciado como alerta", () => {
    render(<ErrorState description="Falhou" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Falhou");
  });

  it("EmptyState mostra título, descrição e ação", () => {
    render(
      <EmptyState
        title="Nada aqui"
        description="Conecte"
        action={<button type="button">Ir</button>}
      />,
    );
    expect(screen.getByText("Nada aqui")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ir" })).toBeInTheDocument();
  });

  it("Skeleton é invisível para leitores de tela", () => {
    const { container } = render(<Skeleton className="h-4" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Button", () => {
  it("é do tipo button por padrão para não enviar formulários sem querer", () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole("button", { name: "Salvar" })).toHaveAttribute("type", "button");
  });

  it("aceita type submit e estado desabilitado", () => {
    render(
      <Button type="submit" disabled>
        Enviar
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Enviar" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeDisabled();
  });

  it("ButtonLink renderiza um link", () => {
    render(<ButtonLink href="/dashboard">Voltar</ButtonLink>);
    expect(screen.getByRole("link", { name: "Voltar" })).toHaveAttribute("href", "/dashboard");
  });
});
