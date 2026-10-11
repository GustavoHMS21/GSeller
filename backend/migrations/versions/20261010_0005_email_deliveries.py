"""Registro de e-mails enviados e destinatários dos avisos de fim de trial (issues #46 e #36).

Revision ID: 9ed43200a880
Revises: 35eb76e3bbe2
Create Date: 2026-10-10

`email_deliveries` segue o isolamento por tenant (RLS) e não guarda endereço nem conteúdo.

O job diário precisa encontrar empresas de todos os tenants, o que o RLS impede (de propósito)
para a role da API. Em vez de dar a ele uma role com BYPASSRLS, uma função SECURITY DEFINER
devolve só o necessário para o aviso: donos com conta e e-mail, de empresas cujo trial termina
na janela pedida e que ainda não receberam aquele aviso. O envio e o registro continuam
passando pelo RLS, com o contexto da empresa definido por transação.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "9ed43200a880"
down_revision: str | Sequence[str] | None = "35eb76e3bbe2"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

RUNTIME_ROLE = "app_runtime"
RECIPIENTS_FN = "app.trial_email_recipients(text, timestamptz, timestamptz)"


def upgrade() -> None:
    op.create_table(
        "email_deliveries",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("tenant_id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("kind", sa.String(length=32), nullable=False),
        sa.Column("provider_message_id", sa.String(length=64), nullable=True),
        sa.Column(
            "sent_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"], ["app.tenants.id"],
            name=op.f("fk_email_deliveries_tenant_id_tenants"), ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"], ["app.users.id"],
            name=op.f("fk_email_deliveries_user_id_users"), ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_email_deliveries")),
        sa.UniqueConstraint(
            "tenant_id", "user_id", "kind", name=op.f("uq_email_deliveries_tenant_id_user_id_kind")
        ),
        schema="app",
    )

    op.execute(f"GRANT SELECT, INSERT, UPDATE ON app.email_deliveries TO {RUNTIME_ROLE}")
    op.execute("ALTER TABLE app.email_deliveries ENABLE ROW LEVEL SECURITY")
    op.execute(
        """
        CREATE POLICY tenant_isolation ON app.email_deliveries
        USING (tenant_id = app.current_tenant_id())
        WITH CHECK (tenant_id = app.current_tenant_id())
        """
    )

    # search_path fixo: uma função SECURITY DEFINER não pode resolver nomes pelo caminho
    # de quem a chama. LIMIT limita o que uma chamada pode devolver.
    op.execute(
        """
        CREATE FUNCTION app.trial_email_recipients(
            p_kind text, p_since timestamptz, p_until timestamptz
        )
        RETURNS TABLE (
            tenant_id uuid,
            user_id uuid,
            email text,
            trial_ends_at timestamptz,
            subscription_status text
        )
        LANGUAGE sql STABLE SECURITY DEFINER
        SET search_path = pg_catalog, pg_temp
        AS $$
            SELECT t.id, u.id, u.email::text, t.trial_ends_at, s.status::text
            FROM app.tenants t
            JOIN app.tenant_users tu ON tu.tenant_id = t.id AND tu.role = 'OWNER'
            JOIN app.users u ON u.id = tu.user_id
            LEFT JOIN app.subscriptions s ON s.tenant_id = t.id
            WHERE t.trial_ends_at > p_since
              AND t.trial_ends_at <= p_until
              AND NOT u.is_anonymous
              AND u.email IS NOT NULL
              AND NOT EXISTS (
                  SELECT 1 FROM app.email_deliveries d
                  WHERE d.tenant_id = t.id AND d.user_id = u.id AND d.kind = p_kind
              )
            ORDER BY t.trial_ends_at
            LIMIT 500
        $$
        """
    )
    op.execute(f"REVOKE ALL ON FUNCTION {RECIPIENTS_FN} FROM PUBLIC")
    op.execute(f"GRANT EXECUTE ON FUNCTION {RECIPIENTS_FN} TO {RUNTIME_ROLE}")


def downgrade() -> None:
    op.execute(f"DROP FUNCTION IF EXISTS {RECIPIENTS_FN}")
    op.drop_table("email_deliveries", schema="app")
