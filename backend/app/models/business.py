"""Empresas (CNPJ) e lojas dentro da conta (Bloco 60, issue #49).

Conta (`tenants`: assinatura e usuários) → Empresas (CNPJ, regime tributário) → Lojas
(uma conta de marketplace). A conexão com o marketplace (#10) pertence à loja.
"""

import uuid
from datetime import datetime
from enum import StrEnum

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    ForeignKeyConstraint,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import SCHEMA, Base


class TaxRegime(StrEnum):
    MEI = "mei"
    SIMPLES_NACIONAL = "simples_nacional"
    LUCRO_PRESUMIDO = "lucro_presumido"
    LUCRO_REAL = "lucro_real"


class Marketplace(StrEnum):
    MERCADOLIVRE = "mercadolivre"
    SHOPEE = "shopee"


def _in(column: str, values: type[StrEnum]) -> str:
    return f"{column} IN ({', '.join(repr(v.value) for v in values)})"


class Company(Base):
    __tablename__ = "companies"
    __table_args__ = (
        UniqueConstraint("tenant_id", "cnpj"),
        # Alvo da FK composta das lojas: a loja só aponta para empresa da mesma conta.
        # A FK das lojas usa NO ACTION (padrão), checado no fim do comando: apagar a conta
        # apaga empresas e lojas juntas; apagar só uma empresa com lojas é recusado.
        UniqueConstraint("tenant_id", "id"),
        CheckConstraint(_in("tax_regime", TaxRegime), name="tax_regime_valid"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey(f"{SCHEMA}.tenants.id", ondelete="CASCADE")
    )
    cnpj: Mapped[str] = mapped_column(String(14))
    legal_name: Mapped[str] = mapped_column(String(150))
    tax_regime: Mapped[str] = mapped_column(String(32))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Store(Base):
    __tablename__ = "stores"
    __table_args__ = (
        ForeignKeyConstraint(
            ["tenant_id", "company_id"],
            [f"{SCHEMA}.companies.tenant_id", f"{SCHEMA}.companies.id"],
            name="fk_stores_company_same_tenant",
        ),
        CheckConstraint(_in("marketplace", Marketplace), name="marketplace_valid"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey(f"{SCHEMA}.tenants.id", ondelete="CASCADE")
    )
    company_id: Mapped[uuid.UUID]
    marketplace: Mapped[str] = mapped_column(String(32))
    name: Mapped[str] = mapped_column(String(80))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
