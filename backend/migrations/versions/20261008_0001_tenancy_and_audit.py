"""Tenancy, usuários, vínculos e auditoria com Row Level Security.

Revision ID: 6e357172f141
Revises:
Create Date: 2026-10-08

Isolamento em duas camadas (Bloco 18.4 / Bloco 42):
1. a API sempre filtra por tenant derivado da sessão;
2. o banco aplica RLS com base no contexto definido por transação
   (app.tenant_id, app.user_id, app.auth_subject).

A role de runtime (app_runtime) recebe apenas os privilégios necessários
por tabela; audit_logs é somente inserção e leitura.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "6e357172f141"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

RUNTIME_ROLE = "app_runtime"


def upgrade() -> None:
    op.create_table(
        "tenants",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_tenants")),
        schema="app",
    )
    op.create_table(
        "users",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("auth_subject", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_users")),
        sa.UniqueConstraint("auth_subject", name=op.f("uq_users_auth_subject")),
        schema="app",
    )
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("tenant_id", sa.Uuid(), nullable=True),
        sa.Column("actor_user_id", sa.Uuid(), nullable=True),
        sa.Column("action", sa.String(length=64), nullable=False),
        sa.Column("resource_type", sa.String(length=64), nullable=False),
        sa.Column("resource_id", sa.String(length=128), nullable=True),
        sa.Column("metadata", postgresql.JSONB(astext_type=sa.Text()), server_default="{}", nullable=False),
        sa.Column("request_id", sa.String(length=64), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(
            ["actor_user_id"], ["app.users.id"],
            name=op.f("fk_audit_logs_actor_user_id_users"), ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["tenant_id"], ["app.tenants.id"],
            name=op.f("fk_audit_logs_tenant_id_tenants"), ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_audit_logs")),
        schema="app",
    )
    op.create_index(
        "ix_audit_logs_tenant_id_created_at", "audit_logs", ["tenant_id", "created_at"],
        unique=False, schema="app",
    )
    op.create_table(
        "tenant_users",
        sa.Column("tenant_id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("role", sa.String(length=16), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("role IN ('OWNER', 'MEMBER')", name=op.f("ck_tenant_users_role_valid")),
        sa.ForeignKeyConstraint(
            ["tenant_id"], ["app.tenants.id"],
            name=op.f("fk_tenant_users_tenant_id_tenants"), ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"], ["app.users.id"],
            name=op.f("fk_tenant_users_user_id_users"), ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("tenant_id", "user_id", name=op.f("pk_tenant_users")),
        schema="app",
    )
    op.create_index("ix_tenant_users_user_id", "tenant_users", ["user_id"], unique=False, schema="app")

    # --- Privilégios mínimos -------------------------------------------------
    op.execute("REVOKE ALL ON SCHEMA app FROM PUBLIC")
    op.execute(f"GRANT USAGE ON SCHEMA app TO {RUNTIME_ROLE}")
    op.execute(f"GRANT SELECT, INSERT, UPDATE, DELETE ON app.tenants, app.users, app.tenant_users TO {RUNTIME_ROLE}")
    op.execute(f"GRANT SELECT, INSERT ON app.audit_logs TO {RUNTIME_ROLE}")

    # --- Contexto da requisição ---------------------------------------------
    # Valores definidos pela API com set_config(..., true): valem só na transação.
    for name, setting, cast in (
        ("current_tenant_id", "app.tenant_id", "uuid"),
        ("current_user_id", "app.user_id", "uuid"),
        ("current_auth_subject", "app.auth_subject", "text"),
    ):
        op.execute(
            f"""
            CREATE FUNCTION app.{name}() RETURNS {cast}
            LANGUAGE sql STABLE
            AS $$ SELECT nullif(current_setting('{setting}', true), '')::{cast} $$
            """
        )
        op.execute(f"REVOKE ALL ON FUNCTION app.{name}() FROM PUBLIC")
        op.execute(f"GRANT EXECUTE ON FUNCTION app.{name}() TO {RUNTIME_ROLE}")

    # --- Row Level Security ---------------------------------------------------
    for table in ("tenants", "users", "tenant_users", "audit_logs"):
        op.execute(f"ALTER TABLE app.{table} ENABLE ROW LEVEL SECURITY")

    op.execute(
        """
        CREATE POLICY tenant_isolation ON app.tenants
        USING (id = app.current_tenant_id())
        WITH CHECK (id = app.current_tenant_id())
        """
    )
    op.execute(
        """
        CREATE POLICY self_access ON app.users
        USING (auth_subject = app.current_auth_subject() OR id = app.current_user_id())
        WITH CHECK (auth_subject = app.current_auth_subject())
        """
    )
    op.execute(
        """
        CREATE POLICY tenant_or_self ON app.tenant_users
        USING (tenant_id = app.current_tenant_id() OR user_id = app.current_user_id())
        WITH CHECK (tenant_id = app.current_tenant_id())
        """
    )
    op.execute(
        """
        CREATE POLICY tenant_or_self ON app.audit_logs
        USING (
            tenant_id = app.current_tenant_id()
            OR (tenant_id IS NULL AND actor_user_id = app.current_user_id())
        )
        WITH CHECK (
            tenant_id = app.current_tenant_id()
            OR (tenant_id IS NULL AND actor_user_id = app.current_user_id())
        )
        """
    )


def downgrade() -> None:
    # Tabelas (e suas políticas) antes das funções que as políticas usam.
    op.drop_index("ix_tenant_users_user_id", table_name="tenant_users", schema="app")
    op.drop_table("tenant_users", schema="app")
    op.drop_index("ix_audit_logs_tenant_id_created_at", table_name="audit_logs", schema="app")
    op.drop_table("audit_logs", schema="app")
    op.drop_table("users", schema="app")
    op.drop_table("tenants", schema="app")
    for name in ("current_tenant_id", "current_user_id", "current_auth_subject"):
        op.execute(f"DROP FUNCTION IF EXISTS app.{name}()")
