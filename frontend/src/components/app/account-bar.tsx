import Link from "next/link";
import { redirect, unstable_rethrow } from "next/navigation";
import { DemoSession } from "@/components/app/demo-session";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { apiFetch, type Me, ONBOARDING_PATH, PLANS_PATH } from "@/lib/api";
import { getSessionKind } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/sign-out";

/** Quem está usando: modo demonstração (sem conta) ou empresa e usuário (Bloco 6, Tela 2). */
export async function AccountBar() {
  const session = await getSessionKind();
  if (session === "none") {
    return (
      <>
        <DemoActions />
        <DemoSession />
      </>
    );
  }

  let me: Me | null = null;
  try {
    // Também registra o primeiro acesso, que marca o início do trial (issue #34).
    me = await apiFetch<Me>("/api/me");
  } catch (err) {
    unstable_rethrow(err);
    // A API fora do ar não derruba o painel: o erro aparece aqui e no Sentry (#18).
  }
  // Bloqueio do 8º dia (Bloco 58). A API também recusa os dados da empresa com 402.
  if (me?.access.status === "expired") redirect(PLANS_PATH);
  const trial =
    me?.access.status === "trial" ? <TrialBadge daysLeft={me.access.days_left} /> : null;
  if (session === "anonymous") return <DemoActions trial={trial} />;
  if (me && !me.tenant) redirect(ONBOARDING_PATH);

  return (
    <div className="flex items-center gap-3">
      {trial}
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

function TrialBadge({ daysLeft }: { daysLeft: number }) {
  const label = daysLeft === 1 ? "Último dia de teste" : `${daysLeft} dias de teste`;
  return (
    <Link href={PLANS_PATH}>
      <Badge tone={daysLeft <= 2 ? "warning" : "neutral"} icon="◷">
        {label}
      </Badge>
    </Link>
  );
}

function DemoActions({ trial }: { trial?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge tone="info" icon="●">
        Modo demonstração
      </Badge>
      {trial}
      <ButtonLink href="/login?modo=criar" className="px-3 py-1.5">
        Criar conta
      </ButtonLink>
      <Link href="/login" className="text-primary hover:underline">
        Entrar
      </Link>
    </div>
  );
}

/** Faixa no topo: explica o que é demonstração e o que a conta libera. */
export async function DemoNotice() {
  const session = await getSessionKind();
  if (session === "account") {
    return (
      <>
        Você está vendo <strong>dados de demonstração</strong> até conectar o Mercado Livre.{" "}
        <Link href="/conexoes" className="font-medium underline">
          Ver conexões
        </Link>
      </>
    );
  }
  return (
    <>
      Você está no <strong>modo demonstração</strong>, com dados de uma loja fictícia. Para salvar
      seus dados e conectar o Mercado Livre, é preciso uma conta.{" "}
      <Link href="/login?modo=criar" className="font-medium underline">
        Criar conta
      </Link>
    </>
  );
}
