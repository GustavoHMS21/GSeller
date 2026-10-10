"""Assinaturas (Stripe) e eventos de webhook processados (Bloco 58, issue #35).

Revision ID: 35eb76e3bbe2
Revises: e9bee03490e2
Create Date: 2026-10-10

`subscriptions` segue o isolamento por tenant (RLS). `stripe_events` guarda só o id e o tipo
de cada evento já aplicado, sem dados de cliente; serve para idempotência do webhook.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "35eb76e3bbe2"
down_revision: str | Sequence[str] | None = "e9bee03490e2"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

RUNTIME_ROLE = "app_runtime"


def upgrade() -> None:
    op.create_table(
        "stripe_events",
        sa.Column("event_id", sa.String(length=64), nullable=False),
        sa.Column("type", sa.String(length=64), nullable=False),
        sa.Column(
            "processed_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.PrimaryKeyConstraint("event_id", name=op.f("pk_stripe_events")),
        schema="app",
    )
    op.create_table(
        "subscriptions",
        sa.Column("tenant_id", sa.Uuid(), nullable=False),
        sa.Column("stripe_customer_id", sa.String(length=64), nullable=False),
        sa.Column("stripe_subscription_id", sa.String(length=64), nullable=True),
        sa.Column("plan", sa.String(length=16), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=True),
        sa.Column("current_period_end", sa.DateTime(timezone=True), nullable=True),
        sa.Column("cancel_at_period_end", sa.Boolean(), nullable=False),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"], ["app.tenants.id"],
            name=op.f("fk_subscriptions_tenant_id_tenants"), ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("tenant_id", name=op.f("pk_subscriptions")),
        sa.UniqueConstraint("stripe_customer_id", name=op.f("uq_subscriptions_stripe_customer_id")),
        sa.UniqueConstraint(
            "stripe_subscription_id", name=op.f("uq_subscriptions_stripe_subscription_id")
        ),
        schema="app",
    )

    op.execute(f"GRANT SELECT, INSERT, UPDATE ON app.subscriptions TO {RUNTIME_ROLE}")
    op.execute(f"GRANT SELECT, INSERT ON app.stripe_events TO {RUNTIME_ROLE}")
    op.execute("ALTER TABLE app.subscriptions ENABLE ROW LEVEL SECURITY")
    op.execute(
        """
        CREATE POLICY tenant_isolation ON app.subscriptions
        USING (tenant_id = app.current_tenant_id())
        WITH CHECK (tenant_id = app.current_tenant_id())
        """
    )


def downgrade() -> None:
    op.drop_table("subscriptions", schema="app")
    op.drop_table("stripe_events", schema="app")
