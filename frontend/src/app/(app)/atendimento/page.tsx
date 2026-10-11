import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ModuleLayout, ModuleSidebar } from "@/components/app/module-sidebar";
import { Badge } from "@/components/ui/badge";
import { EmptyState, Skeleton } from "@/components/ui/states";
import { DEMO_NOW } from "@/lib/demo/order-data";
import {
  KIND_LABEL,
  matchesSupportFilter,
  replyDue,
  SUPPORT_FILTERS,
  sortConversations,
} from "@/lib/demo/support";
import { conversations } from "@/lib/demo/support-data";

export const metadata: Metadata = { title: "SAC" };

export default function SupportPage({ searchParams }: PageProps<"/atendimento">) {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <ConversationList searchParams={searchParams} />
    </Suspense>
  );
}

async function ConversationList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { filtro } = await searchParams;
  const active = SUPPORT_FILTERS.find((f) => f.value === filtro);
  const items = sortConversations(
    conversations.filter((c) => !active || matchesSupportFilter(c, active.value)),
  );

  const href = (value?: string) => (value ? `/atendimento?filtro=${value}` : "/atendimento");

  return (
    <ModuleLayout
      sidebar={
        <ModuleSidebar
          title="SAC"
          activeHref={href(active?.value)}
          sections={[
            { items: [{ href: "/atendimento", label: "Todas", count: conversations.length }] },
            {
              title: "Mercado Livre",
              items: SUPPORT_FILTERS.map((f) => ({
                href: href(f.value),
                label: f.label,
                count: conversations.filter((c) => matchesSupportFilter(c, f.value)).length,
              })),
            },
          ]}
        />
      }
    >
      <h1 className="text-2xl font-semibold">{active ? active.label : "SAC"}</h1>
      {items.length === 0 ? (
        <EmptyState title="Nada para responder" description="Tudo em dia neste filtro." />
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
          {items.map((c) => {
            const due = replyDue(c, DEMO_NOW);
            const last = c.messages[c.messages.length - 1];
            return (
              <li key={c.id}>
                <Link
                  href={`/atendimento/${c.id}`}
                  className="flex flex-wrap items-start gap-x-4 gap-y-1 px-4 py-3 hover:bg-surface-muted"
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm">
                      <Badge tone={c.kind === "claim" ? "danger" : "neutral"}>
                        {KIND_LABEL[c.kind]}
                      </Badge>
                      <span className="font-medium">{c.productName}</span>
                    </p>
                    <p className="mt-1 truncate text-sm text-fg-muted">
                      {last.from === "seller" && "Você: "}
                      {last.text}
                    </p>
                  </div>
                  {due ? (
                    <Badge tone={due.tone} icon={due.overdue ? "!" : "◷"}>
                      {due.label}
                    </Badge>
                  ) : (
                    <Badge tone="success" icon="✓">
                      Respondida
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </ModuleLayout>
  );
}
