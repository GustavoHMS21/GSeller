import type { Metadata } from "next";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/states";
import { apiFetch, type Me } from "@/lib/api";
import { getSessionKind } from "@/lib/auth/session";
import { formatBRLRounded, formatInt } from "@/lib/format";
import { PLANS } from "@/lib/plans";

export const metadata: Metadata = { title: "Planos" };

export default function PlansPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <Suspense fallback={<Skeleton className="h-96" />}>
        <PlansContent />
      </Suspense>
    </main>
  );
}

async function PlansContent() {
  const session = await getSessionKind();
  let expired = false;
  if (session !== "none") {
    try {
      expired = (await apiFetch<Me>("/api/me")).access.status === "expired";
    } catch (err) {
      unstable_rethrow(err);
    }
  }
  const hasAccount = session === "account";

  return (
    <>
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-semibold">
          {expired ? "Seu período de teste terminou" : "Planos"}
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-fg-muted">
          {expired && hasAccount
            ? "Seus dados continuam guardados. Escolha um plano para voltar a usar o GSeller."
            : "Escolha o plano pelo volume de pedidos da sua operação. Você pode trocar quando quiser."}
          {!hasAccount && " Para assinar, crie sua conta."}
        </p>
      </header>

      <ul className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <li
            key={plan.id}
            className={`flex flex-col rounded-lg border bg-surface p-6 ${
              plan.recommended ? "border-primary" : "border-line"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              {plan.recommended && <Badge tone="info">Mais escolhido</Badge>}
            </div>
            <p className="mt-3">
              <span className="text-highlight font-semibold tabular-nums">
                {formatBRLRounded(plan.monthlyPrice)}
              </span>
              <span className="text-sm text-fg-muted"> /mês</span>
            </p>
            <ul className="mt-4 mb-6 space-y-1 text-sm">
              <li>Até {formatInt(plan.ordersPerMonth)} pedidos por mês</li>
              <li>{plan.channels}</li>
              <li>Resultado e margem por produto, alertas e comparação entre canais</li>
            </ul>
            <div className="mt-auto">
              {hasAccount ? (
                // Checkout do Stripe entra na issue #35.
                <Button disabled className="w-full">
                  Assinar {plan.name}
                </Button>
              ) : (
                <ButtonLink href="/login?modo=criar&next=/planos" className="w-full">
                  Criar conta para assinar
                </ButtonLink>
              )}
            </div>
          </li>
        ))}
      </ul>

      {hasAccount && (
        <p className="mt-6 text-center text-sm text-fg-muted">
          O pagamento online estará disponível em breve.
        </p>
      )}
      {!expired && (
        <p className="mt-6 text-center text-sm">
          <Link href="/dashboard" className="text-fg-muted hover:text-fg hover:underline">
            Voltar ao painel
          </Link>
        </p>
      )}
    </>
  );
}
