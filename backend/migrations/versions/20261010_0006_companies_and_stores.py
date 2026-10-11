"""Empresas (CNPJ) e lojas dentro da conta (Bloco 60, issue #49).

Revision ID: ac6d80f0ea18
Revises: 9ed43200a880
Create Date: 2026-10-10

As duas tabelas seguem o isolamento por tenant (RLS). A FK composta (tenant_id, company_id)
garante no banco que uma loja só pertence a uma empresa da mesma conta.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "ac6d80f0ea18"
down_revision: str | Sequence[str] | None = "9ed43200a880"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

RUNTIME_ROLE = "app_runtime"


def upgrade() -> None:
    op.create_table(
        "companies",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("tenant_id", sa.Uuid(), nullable=False),
        sa.Column("cnpj", sa.String(length=14), nullable=False),
        sa.Column("legal_name", sa.String(length=150), nullable=False),
        sa.Column("tax_regime", sa.String(length=32), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.CheckConstraint(
            "tax_regime IN ('mei', 'simples_nacional', 'lucro_presumido', 'lucro_real')",
            name=op.f("ck_companies_tax_regime_valid"),
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"], ["app.tenants.id"],
            name=op.f("fk_companies_tenant_id_tenants"), ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_companies")),
        sa.UniqueConstraint("tenant_id", "cnpj", name=op.f("uq_companies_tenant_id_cnpj")),
        sa.UniqueConstraint("tenant_id", "id", name=op.f("uq_companies_tenant_id_id")),
        schema="app",
    )
    op.create_table(
        "stores",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("tenant_id", sa.Uuid(), nullable=False),
        sa.Column("company_id", sa.Uuid(), nullable=False),
        sa.Column("marketplace", sa.String(length=32), nullable=False),
        sa.Column("name", sa.String(length=80), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.CheckConstraint(
            "marketplace IN ('mercadolivre', 'shopee')", name=op.f("ck_stores_marketplace_valid")
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id", "company_id"], ["app.companies.tenant_id", "app.companies.id"],
            name="fk_stores_company_same_tenant",
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"], ["app.tenants.id"],
            name=op.f("fk_stores_tenant_id_tenants"), ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_stores")),
        schema="app",
    )

    for table in ("companies", "stores"):
        op.execute(f"GRANT SELECT, INSERT, UPDATE, DELETE ON app.{table} TO {RUNTIME_ROLE}")
        op.execute(f"ALTER TABLE app.{table} ENABLE ROW LEVEL SECURITY")
        op.execute(
            f"""
            CREATE POLICY tenant_isolation ON app.{table}
            USING (tenant_id = app.current_tenant_id())
            WITH CHECK (tenant_id = app.current_tenant_id())
            """
        )


def downgrade() -> None:
    op.drop_table("stores", schema="app")
    op.drop_table("companies", schema="app")
