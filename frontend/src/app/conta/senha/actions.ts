"use server";

import { redirect } from "next/navigation";
import { HOME_PATH, parsePassword } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export type PasswordState = { error?: string };

/** Define a senha da conta (depois da conversão do modo demonstração; também servirá à #32). */
export async function setPassword(_prev: PasswordState, form: FormData): Promise<PasswordState> {
  const parsed = parsePassword(form);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.password });
  if (error?.code === "weak_password") return { error: "Escolha uma senha mais forte." };
  if (error) return { error: "Não foi possível salvar a senha agora. Tente de novo." };
  redirect(HOME_PATH);
}
