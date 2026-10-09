import type { Metadata } from "next";
import Link from "next/link";
import { CONNECTION_STATUS, ConnectionStatusBadge } from "@/components/app/connection-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { connections, products } from "@/lib/demo/data";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Conexões" };

export default function ConnectionsPage() {
  const withCost = products.filter((p) => p.cost.unitCost !== null).length;

  // Passos do onboarding (Bloco 6, Tela 2) com o estado da loja de demonstração.
  const steps = [
    { label: "Nome da operação", done: true },
    { label: "Marketplaces utilizados", done: true },
    { label: "Conectar Mercado Livre", done: true },
    { label: "Conectar Shopee", done: true },
    { label: "Sincronizar produtos e pedidos", done: true },
    {
      label: `Cadastrar custos (${withCost} de ${products.length} produtos)`,
      done: withCost === products.length,
      href: "/custos",
    },
    { label: "Ver o primeiro diagnóstico", done: true, href: "/dashboard" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Conexões</h1>
        <p className="max-w-2xl text-sm text-fg-muted">
          Conectamos pela API oficial de cada marketplace, com <strong>acesso somente leitura</strong>.
          Nunca pedimos sua senha e não alteramos anúncios, preços ou campanhas.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {connections.map((c) => (
          <Card key={c.marketplace}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <MarketplaceBadge marketplace={c.marketplace} />
              <ConnectionStatusBadge status={c.status} />
            </div>
            <p className="mt-3 font-medium">{c.shopName}</p>
            <p className="text-sm text-fg-muted">{c.detail}</p>
            <p className="mt-2 text-sm text-fg-muted">
              Última sincronização: {c.lastSyncAt ? formatDateTime(c.lastSyncAt) : "nunca"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" disabled title="Disponível na versão com integração real">
                Sincronizar agora
              </Button>
              <Button variant="ghost" disabled title="Disponível na versão com integração real">
                Desconectar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Primeiros passos" description="Do cadastro ao primeiro diagnóstico" />
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={step.label} className="flex items-center gap-3 text-sm">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  step.done ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
                }`}
              >
                {step.done ? "✓" : i + 1}
              </span>
              {step.href && !step.done ? (
                <Link href={step.href} className="font-medium text-primary hover:underline">
                  {step.label}
                </Link>
              ) : (
                <span>{step.label}</span>
              )}
              <span className="sr-only">{step.done ? "concluído" : "pendente"}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <CardHeader
          title="O que cada estado significa"
          description="Como a conexão aparece quando algo muda"
        />
        <dl className="grid gap-3 sm:grid-cols-2">
          {Object.entries(CONNECTION_STATUS).map(([status, meta]) => (
            <div key={status} className="flex flex-col gap-1">
              <dt>
                <Badge tone={meta.tone} icon={meta.icon}>
                  {meta.label}
                </Badge>
              </dt>
              <dd className="text-sm text-fg-muted">{meta.help}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
