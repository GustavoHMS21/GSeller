"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { ApiError, apiFetch, type Tenant } from "@/lib/api";
import { HOME_PATH } from "@/lib/auth/guards";

export type OnboardingState = { error?: string };

export async function createTenant(
  _prev: OnboardingState,
  form: FormData,
): Promise<OnboardingState> {
  const name = String(form.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 120) {
    return { error: "O nome precisa ter entre 2 e 120 caracteres." };
  }
  try {
    await apiFetch<Tenant>("/api/tenants", { method: "POST", body: JSON.stringify({ name }) });
  } catch (err) {
    unstable_rethrow(err);
    // Empresa já criada (outra aba, duplo clique): segue para o painel.
    if (!(err instanceof ApiError && err.code === "tenant_already_exists")) {
      return { error: "Não foi possível criar a empresa agora. Tente de novo." };
    }
  }
  redirect(HOME_PATH);
}
