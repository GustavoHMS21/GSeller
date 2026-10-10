import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { authRedirect } from "@/lib/auth/guards";
import { supabaseKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Renova a sessão do Supabase a cada navegação e protege as rotas que exigem conta.
 * A identidade vem de getClaims(), que valida a assinatura do token. Nunca de getSession(),
 * que só lê o cookie. As rotas da API verificam o token de novo (Bloco 52).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl(), supabaseKey(), {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // Respostas que gravam cookies de sessão não podem ficar em cache compartilhado.
        for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const session = !data?.claims?.sub ? "none" : data.claims.is_anonymous ? "anonymous" : "account";
  const target = authRedirect(request.nextUrl.pathname, request.nextUrl.search, session);
  if (!target) return response;

  const redirect = NextResponse.redirect(new URL(target, request.url));
  // O redirecionamento precisa levar os cookies renovados, senão a sessão se perde.
  for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}

export const config = {
  // Tudo, exceto arquivos estáticos e imagens.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
