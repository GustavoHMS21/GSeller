import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { LOGIN_PATH, safeNextPath } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

/** Destino do link de confirmação de e-mail. Aceita o fluxo PKCE (code) e o token_hash. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;
  const supabase = await createClient();

  let ok = false;
  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  }

  const target = ok ? safeNextPath(params.get("next")) : `${LOGIN_PATH}?erro=confirmacao`;
  return NextResponse.redirect(new URL(target, request.url));
}
