import { redirect, unstable_rethrow } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetch, type Me, ONBOARDING_PATH } from "@/lib/api";
import { signOut } from "@/lib/auth/sign-out";

/** Empresa e usuário da sessão. Sem empresa, leva ao onboarding (Bloco 6, Tela 2). */
export async function AccountBar() {
  let me: Me | null = null;
  try {
    me = await apiFetch<Me>("/api/me");
  } catch (err) {
    unstable_rethrow(err);
    // A API fora do ar não derruba o painel: o erro aparece aqui e no Sentry (#18).
  }
  if (me && !me.tenant) redirect(ONBOARDING_PATH);

  return (
    <div className="flex items-center gap-3">
      {me?.tenant ? (
        <span>
          <span className="font-medium">{me.tenant.name}</span>
          {me.user.email && <span className="text-fg-muted"> · {me.user.email}</span>}
        </span>
      ) : (
        <span role="status" className="text-warning">
          Não foi possível carregar sua empresa agora.
        </span>
      )}
      <form action={signOut}>
        <Button type="submit" variant="ghost" className="px-2 py-1">
          Sair
        </Button>
      </form>
    </div>
  );
}
