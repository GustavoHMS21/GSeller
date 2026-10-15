import { type NextRequest, NextResponse } from "next/server";
import { portfolioRedirect } from "@/lib/auth/guards";

/**
 * Protótipo de portfólio (Bloco 60.10): o app roda só com dados fictícios, sem Supabase.
 * Telas que dependem de conta, backend ou cobrança levam ao Início.
 */
export function proxy(request: NextRequest) {
  const target = portfolioRedirect(request.nextUrl.pathname);
  return target ? NextResponse.redirect(new URL(target, request.url)) : NextResponse.next();
}

export const config = {
  // Tudo, exceto arquivos estáticos e imagens.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
