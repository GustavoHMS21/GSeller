"""Base declarativa de todos os modelos.

Todas as tabelas da aplicação ficam no schema `app`, que não é exposto pela
Data API do Supabase: o acesso aos dados acontece somente através desta API.

A convenção de nomes torna constraints e índices determinísticos, o que mantém
as migrations geradas pelo Alembic estáveis entre máquinas.
"""

from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase

SCHEMA = "app"

NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_N_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=NAMING_CONVENTION, schema=SCHEMA)
    # Lê valores gerados pelo banco (created_at etc.) no próprio INSERT/UPDATE via RETURNING,
    # evitando carregamento tardio, que não é permitido em sessões assíncronas.
    __mapper_args__ = {"eager_defaults": True}  # noqa: RUF012
