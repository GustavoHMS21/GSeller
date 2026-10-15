import type { Metadata } from "next";
import Link from "next/link";
import { InsightCard } from "@/components/app/insight-card";
import { type SalesTab, SalesTabs } from "@/components/app/sales-tabs";
import { cx } from "@/lib/cx";
import { insights, storeSummary } from "@/lib/demo/data";
import { type HomeTask, homeTasks } from "@/lib/demo/home";
import { formatBRLRounded, formatInt, formatPct } from "@/lib/format";
import type { Marketplace } from "@/lib/types";

export const metadata: Metadata = { title: "Início" };

const TOP_INSIGHTS = 3;

const DOT: Record<HomeTask["tone"], string> = {
  neutral: "bg-fg-muted",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const QUICK_ACTIONS = [
  { href: "/conexoes", label: "Conectar Lojas" },
  { href: "/custos", label: "Cadastrar Custos" },
  { href: "/pedidos?filtro=atrasados", label: "Ver Pedidos Atrasados" },
  { href: "/atendimento?filtro=responder", label: "Responder SAC" },
];

/** Início no formato do UpSeller (Bloco 60.9): tarefas, lucro e vendas; plano e atalhos à direita. */
export default function HomePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0 space-y-6">
        <h1 className="sr-only">Início</h1>
        <Tasks />
        <ProfitAlerts />
        <Sales />
      </div>
      <aside className="space-y-6">
        <section className="rounded-lg border border-line bg-surface p-5">
          <h2 className="text-lg font-semibold">Protótipo de portfólio</h2>
          <p className="mt-2 text-sm text-fg-muted">
            Uma loja fictícia, com Mercado Livre e Shopee, para mostrar o lucro de cada venda e o
            que fazer.
          </p>
          <Link
            href="/sobre"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            Como o projeto foi feito →
          </Link>
        </section>
        <section className="rounded-lg border border-line bg-surface p-5">
          <h2 className="mb-3 text-lg font-semibold">Ações Rápidas</h2>
          <ul className="space-y-1">
            {QUICK_ACTIONS.map((action) => (
              <li key={action.href}>
                <Link href={action.href} className="block py-1.5 text-sm hover:text-primary">
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}

function Tasks() {
  return (
    <section className="rounded-lg border border-line bg-surface p-5" aria-labelledby="tarefas">
      <h2 id="tarefas" className="text-lg font-semibold">
        Tarefas
      </h2>
      {homeTasks().map((group) => (
        <div key={group.title} className="mt-5">
          <h3 className="text-sm text-fg-muted">{group.title}</h3>
          <ul className="mt-2 grid grid-cols-2 gap-y-4 sm:grid-cols-4">
            {group.tasks.map((task) => (
              <li key={task.label} className="border-line px-3 sm:border-l sm:first:border-l-0">
                <Link href={task.href} className="group block">
                  <span
                    className={cx(
                      "block text-2xl tabular-nums group-hover:text-primary",
                      task.count > 0 ? "font-semibold" : "text-fg-muted",
                    )}
                  >
                    {task.count}
                  </span>
                  <span className="flex items-start gap-1.5 text-sm text-fg-muted">
                    <span
                      aria-hidden="true"
                      className={cx("mt-1.5 size-1.5 shrink-0 rounded-full", DOT[task.tone])}
                    />
                    {task.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function ProfitAlerts() {
  return (
    <section className="rounded-lg border border-line bg-surface p-5" aria-labelledby="lucro">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 id="lucro" className="text-lg font-semibold">
          O que corrigir no lucro
        </h2>
        <Link href="/analises" className="text-sm text-primary hover:underline">
          Mais ({insights.length}) →
        </Link>
      </div>
      <div className="space-y-3">
        {insights.slice(0, TOP_INSIGHTS).map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </section>
  );
}

function Sales() {
  const channels: { key: string; label: string; m?: Marketplace }[] = [
    { key: "todas", label: "Todas as Lojas" },
    { key: "ml", label: "Mercado Livre", m: "mercadolivre" },
    { key: "shopee", label: "Shopee", m: "shopee" },
  ];
  const tabs: SalesTab[] = channels.map(({ key, label, m }) => {
    const s = storeSummary(m);
    const result = s.result.current;
    return {
      key,
      label,
      stats: [
        { label: "Valor de Vendas", value: formatBRLRounded(s.revenue.current.revenue) },
        { label: "Pedidos", value: formatInt(s.revenue.current.orders) },
        {
          label: "Lucro estimado",
          value: result.result === null ? "—" : formatBRLRounded(result.result),
        },
        {
          label: "Margem estimada",
          value: result.margin === null ? "—" : formatPct(result.margin),
        },
      ],
    };
  });
  return (
    <section className="rounded-lg border border-line bg-surface p-5" aria-labelledby="vendas">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 id="vendas" className="text-lg font-semibold">
          Vendas · últimos 30 dias
        </h2>
        <Link href="/analises" className="text-sm text-primary hover:underline">
          Mais →
        </Link>
      </div>
      <SalesTabs tabs={tabs} />
    </section>
  );
}
