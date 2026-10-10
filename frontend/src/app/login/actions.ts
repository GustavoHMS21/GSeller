"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { parseCredentials, safeNextPath } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

export async function authenticate(_prev: AuthState, form: FormData): Promise<AuthState> {
  const credentials = parseCredentials(form);
  if ("error" in credentials) return { error: credentials.error };

  const supabase = await createClient();
  const next = safeNextPath(String(form.get("next") ?? ""));

  if (form.get("intent") === "signup") {
    const origin = (await headers()).get("origin") ?? "";
    const { error } = await supabase.auth.signUp({
      ...credentials,
      options: { emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}` },
    });
    if (error?.code === "weak_password") return { error: "Escolha uma senha mais forte." };
    if (error?.code === "over_email_send_rate_limit") {
      return { error: "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo." };
    }
    // E-mail já cadastrado recebe a mesma resposta de um novo: não revela quem tem conta.
    if (error && error.code !== "user_already_exists") {
      return { error: "Não foi possível criar a conta agora." };
    }
    return { message: "Se o e-mail estiver disponível, enviamos um link de confirmação." };
  }

  const { error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    return error.code === "email_not_confirmed"
      ? { error: "Confirme seu e-mail pelo link que enviamos antes de entrar." }
      : { error: "E-mail ou senha incorretos." };
  }
  redirect(next);
}
