"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { parseCredentials, parseEmail, SET_PASSWORD_PATH, safeNextPath } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

export async function authenticate(_prev: AuthState, form: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const next = safeNextPath(String(form.get("next") ?? ""));
  const origin = (await headers()).get("origin") ?? "";

  if (form.get("intent") === "signup") {
    const { data } = await supabase.auth.getClaims();
    return data?.claims?.is_anonymous
      ? convertAnonymous(supabase, form, origin)
      : signUp(supabase, form, origin, next);
  }

  const credentials = parseCredentials(form);
  if ("error" in credentials) return { error: credentials.error };
  const { error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    return error.code === "email_not_confirmed"
      ? { error: "Confirme seu e-mail pelo link que enviamos antes de entrar." }
      : { error: "E-mail ou senha incorretos." };
  }
  redirect(next);
}

type Supabase = Awaited<ReturnType<typeof createClient>>;

/**
 * Modo demonstração → conta: o mesmo usuário recebe um e-mail (o trial não reinicia, issue #33).
 * O Supabase só permite definir a senha depois que o e-mail é confirmado.
 */
async function convertAnonymous(
  supabase: Supabase,
  form: FormData,
  origin: string,
): Promise<AuthState> {
  const parsed = parseEmail(form);
  if ("error" in parsed) return { error: parsed.error };
  const { error } = await supabase.auth.updateUser(
    { email: parsed.email },
    { emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(SET_PASSWORD_PATH)}` },
  );
  if (error?.code === "email_exists") {
    return { error: "Não foi possível usar este e-mail. Se você já tem conta, entre por ela." };
  }
  if (error) return rateLimitOrGeneric(error.code);
  return { message: "Enviamos um link para o seu e-mail. Ao confirmar, você define sua senha." };
}

async function signUp(
  supabase: Supabase,
  form: FormData,
  origin: string,
  next: string,
): Promise<AuthState> {
  const credentials = parseCredentials(form);
  if ("error" in credentials) return { error: credentials.error };
  const { error } = await supabase.auth.signUp({
    ...credentials,
    options: { emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}` },
  });
  if (error?.code === "weak_password") return { error: "Escolha uma senha mais forte." };
  // E-mail já cadastrado recebe a mesma resposta de um novo: não revela quem tem conta.
  if (error && error.code !== "user_already_exists") return rateLimitOrGeneric(error.code);
  return { message: "Se o e-mail estiver disponível, enviamos um link de confirmação." };
}

function rateLimitOrGeneric(code: string | undefined): AuthState {
  return code === "over_email_send_rate_limit"
    ? { error: "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo." }
    : { error: "Não foi possível criar a conta agora." };
}
