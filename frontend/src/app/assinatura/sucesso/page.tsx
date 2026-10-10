import type { Metadata } from "next";
import { Suspense } from "react";
import { AwaitActivation } from "@/app/assinatura/sucesso/await-activation";
import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/states";
import { apiFetch, type Me } from "@/lib/api";
import { PLANS } from "@/lib/plans";

export const metadata: Metadata = { title: "Assinatura" };

export default function SubscriptionSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-6 text-center">
        <Suspense fallback={<Skeleton className="h-32" />}>
          <SubscriptionStatus />
        </Suspense>
      </div>
    </main>
  );
}

/** O Stripe devolve o usuário antes de o webhook chegar: aguardamos a confirmação. */
async function SubscriptionStatus() {
  const { access } = await apiFetch<Me>("/api/me");
  if (access.status !== "active") return <AwaitActivation />;
  const plan = PLANS.find((p) => p.id === access.plan);
  return (
    <>
      <h1 className="text-xl font-semibold">Assinatura ativa</h1>
      <p className="mt-2 mb-6 text-sm text-fg-muted">
        {plan ? `Plano ${plan.name} confirmado. ` : ""}Obrigado por assinar o GSeller.
      </p>
      <ButtonLink href="/dashboard" className="w-full">
        Ir para o painel
      </ButtonLink>
    </>
  );
}
