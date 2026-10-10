import { cache } from "react";
import type { SessionKind } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

/** Tipo de sessão da requisição, com assinatura verificada (getClaims). Uma vez por requisição. */
export const getSessionKind = cache(async (): Promise<SessionKind> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) return "none";
  return data.claims.is_anonymous ? "anonymous" : "account";
});
