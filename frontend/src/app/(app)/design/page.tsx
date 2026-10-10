import type { Metadata } from "next";
import { CONNECTION_STATUS, ConnectionStatusBadge } from "@/components/app/connection-status";
import { InsightCard } from "@/components/app/insight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { HealthBadge } from "@/components/ui/health-badge";
import { KpiCard } from "@/components/ui/kpi-card";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { insights } from "@/lib/demo/data";
import type { ConnectionStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Design System" };

const COLORS = [
  ["canvas", "bg-canvas"],
  ["surface", "bg-surface"],
  ["surface-muted", "bg-surface-muted"],
  ["fg", "bg-fg"],
  ["fg-muted", "bg-fg-muted"],
  ["line", "bg-line"],
  ["primary", "bg-primary"],
  ["success", "bg-success"],
  ["warning", "bg-warning"],
  ["danger", "bg-danger"],
  ["info", "bg-info"],
] as const;

const TYPE_SCALE = [
  ["12 · caption", "text-xs"],
  ["14 · body small", "text-sm"],
  ["16 · body", "text-base"],
  ["18 · strong body", "text-lg"],
  ["20 · section", "text-xl"],
  ["24 · page title", "text-2xl"],
  ["32 · dashboard highlight", "text-highlight"],
  ["40 · hero metric", "text-hero"],
] as const;

export default function DesignPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Design System v0.1</h1>
        <p className="text-sm text-fg-muted">
          Tokens e componentes do Bloco 16. Os nomes são semânticos: a cor comunica significado.
        </p>
      </div>

      <Card>
        <CardHeader title="Cores" description="Trocam automaticamente entre tema claro e escuro" />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {COLORS.map(([name, cls]) => (
            <li key={name} className="text-xs">
              <div className={`h-12 rounded-md border border-line ${cls}`} />
              <code className="mt-1 block">{name}</code>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader title="Tipografia" description="Geist · números sempre tabulares" />
        <ul className="space-y-2">
          {TYPE_SCALE.map(([label, cls]) => (
            <li key={label} className="flex items-baseline gap-4">
              <span className="w-44 shrink-0 text-xs text-fg-muted">{label}</span>
              <span className={`${cls} tabular-nums`}>R$ 41.047</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader title="Raio de borda" />
        <div className="flex flex-wrap gap-4 text-xs">
          {(["rounded-sm", "rounded-md", "rounded-lg", "rounded-xl"] as const).map((r) => (
            <div key={r} className="text-center">
              <div className={`size-16 border border-line bg-surface-muted ${r}`} />
              <code>{r}</code>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Botões" />
        <div className="flex flex-wrap gap-3">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Desabilitado</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Status" description="Sempre cor + ícone + texto" />
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <HealthBadge level="healthy" score={92} />
            <HealthBadge level="attention" score={70} />
            <HealthBadge level="critical" score={45} />
            <HealthBadge level="unknown" />
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CONNECTION_STATUS) as ConnectionStatus[]).map((s) => (
              <ConnectionStatusBadge key={s} status={s} />
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <MarketplaceBadge marketplace="mercadolivre" />
            <MarketplaceBadge marketplace="shopee" />
            <Badge tone="info">Informado por você</Badge>
            <Badge tone="warning">Estimado</Badge>
            <Badge>Dado do marketplace</Badge>
          </div>
          <div className="flex flex-wrap gap-4">
            <Delta value={0.124} />
            <Delta value={-0.08} />
            <Delta value={0.03} goodWhen="down" />
            <Delta value={-0.021} kind="pp" />
            <Delta value={0.0001} />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <KpiCard
          title="Margem estimada"
          value="22,4%"
          delta={0.021}
          deltaKind="pp"
          comparison="vs. período anterior"
          formula={<p>Resultado estimado ÷ receita elegível.</p>}
        />
        {insights[0] && <InsightCard insight={insights[0]} />}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <EmptyState
          title="Nenhum produto ainda"
          description="Conecte um marketplace para importar seus anúncios."
        />
        <ErrorState description="A sincronização falhou. Tentaremos de novo em alguns minutos." />
        <div className="space-y-2 rounded-lg border border-line p-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}
