"""Marca usuários em sessão anônima (modo demonstração, issue #33).

Revision ID: d167408cff39
Revises: 6e357172f141
Create Date: 2026-10-10
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "d167408cff39"
down_revision: str | Sequence[str] | None = "6e357172f141"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("is_anonymous", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        schema="app",
    )


def downgrade() -> None:
    op.drop_column("users", "is_anonymous", schema="app")
