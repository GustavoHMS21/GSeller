"""Ambiente do Alembic.

Usa MIGRATIONS_DATABASE_URL (role dona do schema). A role de runtime da API
não tem permissão de DDL, por isso as migrations nunca rodam com ela.
"""

import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool, text
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import get_settings

# Importar o pacote registra todos os modelos no metadata.
from app.models import Base
from app.models.base import SCHEMA

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name, disable_existing_loggers=False)

target_metadata = Base.metadata


def _include_name(name: str | None, type_: str, _parent: object) -> bool:
    # Compara apenas o schema da aplicação; schemas do provedor (auth, storage...) ficam de fora.
    if type_ == "schema":
        return name == SCHEMA
    return True


CONFIGURE_OPTS = {
    "target_metadata": target_metadata,
    "compare_type": True,
    "include_schemas": True,
    "include_name": _include_name,
    "version_table_schema": SCHEMA,
}


def _database_url() -> str:
    settings = get_settings()
    url = settings.migrations_database_url or settings.database_url
    return url.get_secret_value()


def run_migrations_offline() -> None:
    context.configure(
        url=_database_url(),
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        **CONFIGURE_OPTS,
    )
    with context.begin_transaction():
        context.run_migrations()


def _run_sync(connection: Connection) -> None:
    # A tabela de versão do Alembic vive no schema da aplicação, que precisa existir antes.
    connection.execute(text(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA}"))
    connection.commit()
    context.configure(connection=connection, **CONFIGURE_OPTS)
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    engine = create_async_engine(_database_url(), poolclass=pool.NullPool)
    async with engine.connect() as connection:
        await connection.run_sync(_run_sync)
    await engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
