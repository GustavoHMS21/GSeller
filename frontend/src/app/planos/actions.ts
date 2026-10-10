"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { ApiError, apiFetch, PLANS_PATH } from "@/lib/api";
import { PLANS, type Plan } from "@/lib/plans";

type RedirectOut = { url: string };

/** Abre o checkout hospedado do Stripe: o cartão nunca passa pelo nosso site. */
export async function startCheckout(plan: Plan["id"]): Promise<void> {
  if (!PLANS.some((p) => p.id === plan)) redirect(PLANS_PATH);
  let url: string = PLANS_PATH;
  try {
    ({ url } = await apiFetch<RedirectOut>("/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    }));
  } catch (err) {
    unstable_rethrow(err);
    // Já assinante (outra aba, duplo clique): a tela de planos mostra "Gerenciar assinatura".
    if (!(err instanceof ApiError && err.code === "already_subscribed")) throw err;
  }
  redirect(url);
}

/** Portal do Stripe: trocar de plano, atualizar o cartão e cancelar. */
export async function openPortal(): Promise<void> {
  const { url } = await apiFetch<RedirectOut>("/api/billing/portal", { method: "POST" });
  redirect(url);
}
