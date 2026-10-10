// Chamadas do servidor Next.js para a API (Bloco 52). O navegador nunca fala direto com a API.

import { redirect } from "next/navigation";
import { LOGIN_PATH } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export const ONBOARDING_PATH = "/onboarding";

export type Role = "OWNER" | "MEMBER";
export type Tenant = { id: string; name: string; created_at: string };
export type Me = {
  user: { id: string; email: string | null; is_anonymous: boolean };
  tenant: Tenant | null;
  role: Role | null;
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

/** O que fazer com uma resposta de erro da API. */
export function classifyApiFailure(
  status: number,
  code: unknown,
): "login" | "account" | "onboarding" | "error" {
  if (status === 401) return "login";
  if (status === 403 && code === "account_required") return "account";
  if (status === 403 && code === "onboarding_required") return "onboarding";
  return "error";
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const supabase = await createClient();
  // getSession só lê o cookie; serve aqui porque a API valida a assinatura do token de novo.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect(LOGIN_PATH);

  const response = await fetch(`${apiUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...init.headers,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });
  if (response.ok) return (await response.json()) as T;

  const body = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
  const outcome = classifyApiFailure(response.status, body.error);
  if (outcome === "login") redirect(LOGIN_PATH);
  if (outcome === "account") redirect(`${LOGIN_PATH}?modo=criar`);
  if (outcome === "onboarding") redirect(ONBOARDING_PATH);
  throw new ApiError(response.status, body.error ?? "http_error", body.message ?? "Falha na API.");
}

function apiUrl(): string {
  const url = process.env.API_URL;
  if (!url) throw new Error("Variável de ambiente ausente: API_URL");
  return url;
}
