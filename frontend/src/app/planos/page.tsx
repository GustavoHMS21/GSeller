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
import { INCLUDED_FEATURES, PLANS, type Plan } from "@/lib/plans";

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
                plan.recommended && <Badge tone="info">Recomendado</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-fg-muted">{plan.tagline}</p>
            <p className="mt-3">
              <span className="text-highlight font-semibold tabular-nums">
                {formatBRLRounded(plan.monthlyPrice)}
              </span>
              <span className="text-sm text-fg-muted"> /mês</span>
            </p>
            <ul className="mt-4 mb-6 space-y-1.5 text-sm">
              {planLimits(plan).map(([label, value]) => (
                <li key={label} className="flex gap-2">
                  <span aria-hidden="true" className="text-success">
                    ✓
                  </span>
                  {value} {label.toLowerCase()}
                </li>
              ))}
              <li className="flex gap-2">
                <span aria-hidden="true" className="text-success">
                  ✓
                </span>
                Lucro por pedido, alertas, pedidos, devoluções e SAC
              </li>
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

      <ComparePlans />

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

function planLimits(plan: Plan): [string, string][] {
  return [
    ["Pedidos por mês", formatInt(plan.ordersPerMonth)],
    ["Lojas de marketplace", formatInt(plan.stores)],
    ["Empresas (CNPJ)", formatInt(plan.companies)],
  ];
}

/** Comparação lado a lado: os limites mudam, os recursos são os mesmos em todos os planos. */
function ComparePlans() {
  return (
    <section aria-labelledby="comparar" className="mt-10">
      <h2 id="comparar" className="mb-3 text-lg font-semibold">
        Comparar planos
      </h2>
      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full text-sm">
          <caption className="sr-only">Limites e recursos de cada plano</caption>
          <thead>
            <tr className="border-b border-line bg-surface-muted text-left">
              <th scope="col" className="px-4 py-3 font-medium">
                <span className="sr-only">Item</span>
              </th>
              {PLANS.map((plan) => (
                <th key={plan.id} scope="col" className="px-4 py-3 text-center font-semibold">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <th scope="row" className="px-4 py-2.5 text-left font-normal">
                Preço por mês
              </th>
              {PLANS.map((plan) => (
                <td key={plan.id} className="px-4 py-2.5 text-center font-semibold tabular-nums">
                  {formatBRLRounded(plan.monthlyPrice)}
                </td>
              ))}
            </tr>
            {planLimits(PLANS[0]).map(([label], row) => (
              <tr key={label} className="border-b border-line">
                <th scope="row" className="px-4 py-2.5 text-left font-normal">
                  {label}
                </th>
                {PLANS.map((plan) => (
                  <td key={plan.id} className="px-4 py-2.5 text-center tabular-nums">
                    {planLimits(plan)[row][1]}
                  </td>
                ))}
              </tr>
            ))}
            {INCLUDED_FEATURES.map((feature) => (
              <tr key={feature} className="border-b border-line last:border-0">
                <th scope="row" className="px-4 py-2.5 text-left font-normal">
                  {feature}
                </th>
                {PLANS.map((plan) => (
                  <td key={plan.id} className="px-4 py-2.5 text-center text-success">
                    <span aria-hidden="true">✓</span>
                    <span className="sr-only">Incluído</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
