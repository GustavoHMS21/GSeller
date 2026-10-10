"""Fim do trial por empresa (Bloco 58, issue #34).

Revision ID: e9bee03490e2
Revises: d167408cff39
Create Date: 2026-10-10

Empresas existentes herdam o prazo do primeiro acesso do dono (o mais antigo, se houver mais
de um). Sem dono identificável, conta da criação da empresa.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "e9bee03490e2"
down_revision: str | Sequence[str] | None = "d167408cff39"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "tenants",
        sa.Column("trial_ends_at", sa.DateTime(timezone=True), nullable=True),
        schema="app",
    )
    op.execute(
        """
        UPDATE app.tenants t
        SET trial_ends_at = COALESCE(
            (
                SELECT min(u.created_at)
                FROM app.tenant_users tu
                JOIN app.users u ON u.id = tu.user_id
                WHERE tu.tenant_id = t.id AND tu.role = 'OWNER'
            ),
            t.created_at
        ) + interval '7 days'
        """
    )
    op.alter_column("tenants", "trial_ends_at", nullable=False, schema="app")


def downgrade() -> None:
    op.drop_column("tenants", "trial_ends_at", schema="app")
