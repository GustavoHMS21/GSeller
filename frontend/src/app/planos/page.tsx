import type { Metadata } from "next";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import { openPortal, startCheckout } from "@/app/planos/actions";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/states";
import { SubmitButton } from "@/components/ui/submit-button";
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
  let access: Me["access"] | null = null;
  if (session !== "none") {
    try {
      access = (await apiFetch<Me>("/api/me")).access;
    } catch (err) {
      unstable_rethrow(err);
    }
  }
  const hasAccount = session === "account";
  const expired = access?.status === "expired";
  const currentPlan = access?.status === "active" ? access.plan : null;

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
        {currentPlan && (
          <form action={openPortal} className="mx-auto mt-4 max-w-xs">
            <SubmitButton variant="secondary" pendingLabel="Abrindo…">
              Gerenciar assinatura
            </SubmitButton>
          </form>
        )}
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
              {plan.id === currentPlan ? (
                <Badge tone="success" icon="●">
                  Seu plano
                </Badge>
              ) : (
                plan.recommended && <Badge tone="info">Mais escolhido</Badge>
              )}
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
              {!hasAccount ? (
                <ButtonLink href="/login?modo=criar&next=/planos" className="w-full">
                  Criar conta para assinar
                </ButtonLink>
              ) : currentPlan ? null : (
                <form action={startCheckout.bind(null, plan.id)}>
                  <SubmitButton pendingLabel="Abrindo pagamento…">Assinar {plan.name}</SubmitButton>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-xs text-fg-muted">
        Pagamento processado pelo Stripe, com cartão ou Pix. Cancele quando quiser pelo portal da
        assinatura.
      </p>
      {!expired && (
        <p className="mt-4 text-center text-sm">
          <Link href="/dashboard" className="text-fg-muted hover:text-fg hover:underline">
            Voltar ao painel
          </Link>
        </p>
      )}
    </>
  );
}
