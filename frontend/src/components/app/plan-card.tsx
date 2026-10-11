import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getMe, type Me, PLANS_PATH } from "@/lib/api";
import { getSessionKind } from "@/lib/auth/session";
import { formatDateTime, formatInt } from "@/lib/format";
import { PLANS } from "@/lib/plans";

/** Card do plano na lateral do Início, como no UpSeller: plano, situação e prazo. */
export async function PlanCard() {
  const session = await getSessionKind();
  let me: Me | null = null;
  if (session !== "none") {
    try {
      me = await getMe();
    } catch (err) {
      unstable_rethrow(err);
    }
  }
  const plan = PLANS.find((p) => p.id === me?.access.plan);

  if (session !== "account" || !me) {
    return (
      <Shell title="Modo demonstração" badge={<Badge tone="info">Teste</Badge>}>
        <p>7 dias grátis ao criar a conta, sem cartão.</p>
        <ButtonLink href="/login?modo=criar" className="mt-3 w-full">
          Criar conta
        </ButtonLink>
      </Shell>
    );
  }

  if (plan) {
    return (
      <Shell
        title={`Plano ${plan.name}`}
        badge={<Badge tone="success">Ativo</Badge>}
        link={{ href: PLANS_PATH, label: "Detalhes" }}
      >
        <p className="text-fg-muted">Pedidos por mês</p>
        <p>Até {formatInt(plan.ordersPerMonth)}</p>
      </Shell>
    );
  }

  return (
    <Shell
      title="Teste grátis"
      badge={<Badge tone="success">Ativo</Badge>}
      link={{ href: PLANS_PATH, label: "Planos" }}
    >
      <p className="text-fg-muted">Termina em</p>
      <p>{formatDateTime(me.access.trial_ends_at)}</p>
      <p className="mt-2 text-fg-muted">Restante</p>
      <p>{me.access.days_left === 1 ? "Último dia" : `${me.access.days_left} dias`}</p>
    </Shell>
  );
}

function Shell({
  title,
  badge,
  link,
  children,
}: {
  title: string;
  badge: React.ReactNode;
  link?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-surface p-5 text-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          {title} {badge}
        </h2>
        {link && (
          <Link href={link.href} className="text-primary hover:underline">
            {link.label} ›
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
