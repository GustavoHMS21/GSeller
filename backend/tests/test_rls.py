"""Row Level Security: o banco isola tenants mesmo se uma query da aplicação esquecer o filtro.

Estes testes falam direto com o banco usando a role da API (app_runtime), sem
passar pelas regras da aplicação — simulam um bug ou uma injeção de SQL.
"""

import os
import uuid

import pytest
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError
from sqlalchemy.ext.asyncio import AsyncConnection, create_async_engine

pytestmark = pytest.mark.db


async def seed_two_tenants() -> tuple[uuid.UUID, uuid.UUID]:
    tenant_a, tenant_b = uuid.uuid4(), uuid.uuid4()
    engine = create_async_engine(os.environ["MIGRATIONS_DATABASE_URL"])
    async with engine.begin() as conn:
        for tenant, name in ((tenant_a, "Loja A"), (tenant_b, "Loja B")):
            user = uuid.uuid4()
            await conn.execute(
                text(
                    "INSERT INTO app.tenants (id, name, trial_ends_at) VALUES (:id, :name, now())"
                ),
                {"id": tenant, "name": name},
            )
            await conn.execute(
                text("INSERT INTO app.users (id, auth_subject) VALUES (:id, :sub)"),
                {"id": user, "sub": str(user)},
            )
            await conn.execute(
                text("INSERT INTO app.tenant_users VALUES (:t, :u, 'OWNER', now())"),
                {"t": tenant, "u": user},
            )
            await conn.execute(
                text(
                    "INSERT INTO app.audit_logs (id, tenant_id, action, resource_type) "
                    "VALUES (:id, :t, 'seed', 'tenant')"
                ),
                {"id": uuid.uuid4(), "t": tenant},
            )
    await engine.dispose()
    return tenant_a, tenant_b


async def as_runtime(tenant_id: uuid.UUID | None):
    engine = create_async_engine(os.environ["DATABASE_URL"])
    conn = await engine.connect()
    await conn.begin()
    if tenant_id is not None:
        await conn.execute(
            text("SELECT set_config('app.tenant_id', :t, true)"), {"t": str(tenant_id)}
        )
    return engine, conn


async def close(engine, conn: AsyncConnection) -> None:
    await conn.rollback()
    await conn.close()
    await engine.dispose()


async def count(conn: AsyncConnection, table: str) -> int:
    return (await conn.execute(text(f"SELECT count(*) FROM app.{table}"))).scalar_one()  # noqa: S608


async def test_query_without_filter_sees_only_own_tenant(db):
    tenant_a, _ = await seed_two_tenants()
    engine, conn = await as_runtime(tenant_a)
    try:
        ids = (await conn.execute(text("SELECT id FROM app.tenants"))).scalars().all()
        assert ids == [tenant_a]
        assert await count(conn, "tenant_users") == 1
        assert await count(conn, "audit_logs") == 1
    finally:
        await close(engine, conn)


async def test_without_context_nothing_is_visible(db):
    await seed_two_tenants()
    engine, conn = await as_runtime(None)
    try:
        for table in ("tenants", "users", "tenant_users", "audit_logs"):
            assert await count(conn, table) == 0, table
    finally:
        await close(engine, conn)


async def test_cannot_write_into_another_tenant(db):
    tenant_a, tenant_b = await seed_two_tenants()
    engine, conn = await as_runtime(tenant_a)
    try:
        with pytest.raises(DBAPIError, match="row-level security"):
            await conn.execute(
                text(
                    "INSERT INTO app.tenants (id, name, trial_ends_at) "
                    "VALUES (:id, 'Intrusa', now())"
                ),
                {"id": tenant_b},
            )
    finally:
        await close(engine, conn)


async def test_cannot_update_other_tenant_rows(db):
    tenant_a, tenant_b = await seed_two_tenants()
    engine, conn = await as_runtime(tenant_a)
    try:
        result = await conn.execute(
            text("UPDATE app.tenants SET name = 'Hack' WHERE id = :id"), {"id": tenant_b}
        )
        assert result.rowcount == 0
    finally:
        await close(engine, conn)


@pytest.mark.parametrize(
    "statement", ["UPDATE app.audit_logs SET action = 'x'", "DELETE FROM app.audit_logs"]
)
async def test_audit_log_is_append_only(db, statement: str):
    tenant_a, _ = await seed_two_tenants()
    engine, conn = await as_runtime(tenant_a)
    try:
        with pytest.raises(DBAPIError, match="permission denied"):
            await conn.execute(text(statement))
    finally:
        await close(engine, conn)


async def test_runtime_cannot_create_objects_in_app_schema(db):
    engine, conn = await as_runtime(None)
    try:
        with pytest.raises(DBAPIError, match="permission denied"):
            await conn.execute(text("CREATE TABLE app.should_not_exist (id int)"))
    finally:
        await close(engine, conn)
