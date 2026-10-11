"use server";

import { refresh } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";

export type FormState = { error?: string; values?: Record<string, string> };

// Mensagens da API que já são escritas para o seller; o resto vira uma mensagem genérica.
const SHOWN_CODES = new Set(["invalid_cnpj", "cnpj_already_registered", "not_found"]);

async function send(path: string, init: RequestInit): Promise<string | null> {
  try {
    await apiFetch(path, init);
  } catch (err) {
    unstable_rethrow(err);
    if (err instanceof ApiError && SHOWN_CODES.has(err.code)) return err.message;
    if (err instanceof ApiError && err.code === "validation_error") return "Confira os campos.";
    return "Não foi possível salvar agora. Tente de novo.";
  }
  refresh();
  return null;
}

const field = (form: FormData, name: string) => String(form.get(name) ?? "").trim();

export async function createCompany(_prev: FormState, form: FormData): Promise<FormState> {
  const values = {
    cnpj: field(form, "cnpj"),
    legal_name: field(form, "legal_name"),
    tax_regime: field(form, "tax_regime"),
  };
  const error = await send("/api/companies", { method: "POST", body: JSON.stringify(values) });
  return error ? { error, values } : {};
}

export async function createStore(_prev: FormState, form: FormData): Promise<FormState> {
  const values = {
    company_id: field(form, "company_id"),
    marketplace: field(form, "marketplace"),
    name: field(form, "name"),
  };
  const error = await send("/api/stores", { method: "POST", body: JSON.stringify(values) });
  return error ? { error, values } : {};
}

export async function deleteCompany(id: string): Promise<void> {
  await apiFetch(`/api/companies/${encodeURIComponent(id)}`, { method: "DELETE" });
  refresh();
}

export async function deleteStore(id: string): Promise<void> {
  await apiFetch(`/api/stores/${encodeURIComponent(id)}`, { method: "DELETE" });
  refresh();
}
