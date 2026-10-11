import Link from "next/link";
import { redirect, unstable_rethrow } from "next/navigation";
import { DemoSession } from "@/components/app/demo-session";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getMe, type Me, ONBOARDING_PATH, PLANS_PATH } from "@/lib/api";
import { getSessionKind } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/sign-out";
import { PLANS } from "@/lib/plans";

const MENU_PANEL =
  "absolute top-full right-0 z-50 mt-1 w-64 rounded-md border border-line bg-surface p-2 text-sm text-fg shadow-lg";
const MENU_ITEM = "block rounded px-3 py-2 hover:bg-surface-muted";

/** Engrenagem: configurações da conta, como no UpSeller (Bloco 60.9). */
export function SettingsMenu() {
  return (
    <details className="relative">
      <summary
        aria-label="Configurações"
        className="flex cursor-pointer list-none items-center rounded p-2 text-nav-fg-muted hover:text-nav-fg"
      >
        <GearIcon />
      </summary>
      <div className={MENU_PANEL}>
        <Link href="/conexoes" className={MENU_ITEM}>
          Integrações de Loja
        </Link>
        <Link href="/empresas" className={MENU_ITEM}>
          Empresas e lojas
        </Link>
      </div>
    </details>
  );
}

/** Quem está usando: modo demonstração (sem conta) ou a conta, com plano e saída. */
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
    me = await getMe();
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

  const plan = PLANS.find((p) => p.id === me?.access.plan);
  const name = me?.tenant?.name ?? "Minha conta";
  return (
    <div className="flex items-center gap-2">
      {trial}
      <details className="relative">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded px-2 py-1.5 text-sm text-nav-fg hover:bg-nav-hover">
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-fg"
          >
            {name.slice(0, 1).toUpperCase()}
          </span>
          <span className="max-w-40 truncate">{name}</span>
          <span aria-hidden="true">▾</span>
        </summary>
        <div className={MENU_PANEL}>
          <div className="mb-2 flex items-center justify-between gap-2 rounded bg-surface-muted p-3">
            <span className="font-semibold">
              {plan ? `Plano ${plan.name}` : me ? "Teste grátis" : "Conta"}
            </span>
            <ButtonLink href={PLANS_PATH} className="px-2.5 py-1 text-xs">
              {plan ? "Planos" : "Assinar"}
            </ButtonLink>
          </div>
          {me?.user.email && <p className="truncate px-3 pb-2 text-fg-muted">{me.user.email}</p>}
          {!me && (
            <p role="status" className="px-3 pb-2 text-warning">
              Não foi possível carregar sua conta agora.
            </p>
          )}
          <Link href="/conta/senha" className={MENU_ITEM}>
            Alterar senha
          </Link>
          <Link href="/empresas" className={MENU_ITEM}>
            Empresas e lojas
          </Link>
          <form action={signOut} className="mt-1 border-t border-line pt-1">
            <button type="submit" className={`${MENU_ITEM} w-full text-left`}>
              Sair
            </button>
          </form>
        </div>
      </details>
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
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Badge tone="info" icon="●">
        Modo demonstração
      </Badge>
      {trial}
      <ButtonLink href="/login?modo=criar" className="px-3 py-1.5">
        Criar conta
      </ButtonLink>
      <Link href="/login" className="text-nav-fg hover:underline">
        Entrar
      </Link>
    </div>
  );
}

function GearIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
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
          Conectar loja
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
