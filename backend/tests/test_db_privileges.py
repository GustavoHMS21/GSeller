"""Garante o modelo de menor privilégio do banco.

Se a role da API puder criar tabelas ou ignorar RLS, o isolamento entre
tenants planejado para o banco deixa de ter efeito. Estes testes impedem
que uma mudança de configuração quebre isso silenciosamente.
"""

import pytest
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError

from app.core.db import get_engine

pytestmark = pytest.mark.db


async def test_runtime_role_is_not_privileged(require_db: None) -> None:
    async with get_engine().connect() as conn:
        row = (
            await conn.execute(
                text(
                    "SELECT rolsuper, rolbypassrls, rolcreatedb, rolcreaterole "
                    "FROM pg_roles WHERE rolname = current_user"
                )
            )
        ).one()
    await get_engine().dispose()
    assert tuple(row) == (False, False, False, False)


async def test_runtime_role_cannot_run_ddl(require_db: None) -> None:
    async with get_engine().connect() as conn:
        with pytest.raises(DBAPIError, match="permission denied"):
            await conn.execute(text("CREATE TABLE should_not_exist (id int)"))
        await conn.rollback()
    await get_engine().dispose()
