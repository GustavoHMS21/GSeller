import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReplyForm } from "@/app/(app)/atendimento/reply-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MarketplaceBadge } from "@/components/ui/marketplace-badge";
import { Skeleton } from "@/components/ui/states";
import { cx } from "@/lib/cx";
import { DEMO_NOW } from "@/lib/demo/order-data";
import { KIND_LABEL, needsReply, replyDue } from "@/lib/demo/support";
import { conversations, getConversation } from "@/lib/demo/support-data";
import { formatDateTime } from "@/lib/format";

export function generateStaticParams() {
  return conversations.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/atendimento/[id]">) {
  const { id } = await params;
  const c = getConversation(id);
  return { title: c ? `${KIND_LABEL[c.kind]} · ${c.productName}` : "Atendimento" };
}

export default function ConversationPage({ params }: PageProps<"/atendimento/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <ConversationDetail params={params} />
    </Suspense>
  );
}

async function ConversationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getConversation(id);
  if (!c) notFound();
  const due = replyDue(c, DEMO_NOW);

  return (
    <div className="max-w-3xl space-y-6">
      <nav aria-label="Trilha" className="text-sm text-fg-muted">
        <Link href="/atendimento" className="hover:text-fg hover:underline">
          Atendimento
        </Link>{" "}
        / <span aria-current="page">{KIND_LABEL[c.kind]}</span>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{c.productName}</h1>
          <p className="flex flex-wrap items-center gap-x-2 text-sm text-fg-muted">
            {KIND_LABEL[c.kind]} · <MarketplaceBadge marketplace={c.marketplace} />· {c.storeName}
            {c.orderId && (
              <>
                {" · "}
                <Link href={`/pedidos/${c.orderId}`} className="text-primary hover:underline">
                  Pedido #{c.orderId}
                </Link>
              </>
            )}
          </p>
        </div>
        {due && (
          <Badge tone={due.tone} icon={due.overdue ? "!" : "◷"}>
            {due.label}
          </Badge>
        )}
      </header>

      <Card>
        <ol className="space-y-3">
          {c.messages.map((m) => (
            <li
              key={m.at}
              className={cx(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                m.from === "buyer" ? "bg-surface-muted" : "ml-auto bg-info-soft",
              )}
            >
              <p className="text-xs text-fg-muted">
                {m.from === "buyer" ? "Comprador" : "Você"} · {formatDateTime(m.at)}
              </p>
              <p className="mt-0.5">{m.text}</p>
            </li>
          ))}
        </ol>
      </Card>

      {needsReply(c) && (
        <Card>
          <ReplyForm />
        </Card>
      )}
    </div>
  );
}
