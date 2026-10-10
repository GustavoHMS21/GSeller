"""Fluxo de identidade e empresa pela API, incluindo isolamento entre tenants (Bloco 18.4)."""

import os
import uuid

import pytest
from httpx import AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from tests.conftest import TokenFactory

pytestmark = pytest.mark.db

USER_A = "00000000-0000-0000-0000-00000000000a"
USER_B = "00000000-0000-0000-0000-00000000000b"


def auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


async def admin_sql(sql: str, **params: object) -> list:
    """Executa SQL como a role de migração (fora das regras da API), para montar cenários."""
    engine = create_async_engine(os.environ["MIGRATIONS_DATABASE_URL"])
    try:
        async with engine.begin() as conn:
            result = await conn.execute(text(sql), params)
            return list(result) if result.returns_rows else []
    finally:
        await engine.dispose()


async def create_tenant(client: AsyncClient, token: str, name: str = "Loja A") -> dict:
    response = await client.post("/api/tenants", json={"name": name}, headers=auth(token))
    assert response.status_code == 201, response.text
    return response.json()


async def test_me_provisions_user_once(db, client: AsyncClient, make_token: TokenFactory):
    token = make_token(sub=USER_A)
    first = await client.get("/api/me", headers=auth(token))
    second = await client.get("/api/me", headers=auth(token))

    assert first.status_code == 200
    assert first.json()["user"]["id"] == second.json()["user"]["id"]
    assert first.json()["tenant"] is None
    assert first.json()["role"] is None

    rows = await admin_sql("SELECT count(*) FROM app.audit_logs WHERE action = 'user.provisioned'")
    assert rows[0][0] == 1


async def test_create_tenant_makes_user_owner(db, client: AsyncClient, make_token: TokenFactory):
    token = make_token(sub=USER_A)
    tenant = await create_tenant(client, token, "  Loja Exemplo  ")
    assert tenant["name"] == "Loja Exemplo"

    me = (await client.get("/api/me", headers=auth(token))).json()
    assert me["tenant"]["id"] == tenant["id"]
    assert me["role"] == "OWNER"

    rows = await admin_sql(
        "SELECT count(*) FROM app.audit_logs WHERE action = 'tenant.created' AND tenant_id = :t",
        t=uuid.UUID(tenant["id"]),
    )
    assert rows[0][0] == 1


async def test_second_tenant_is_rejected(db, client: AsyncClient, make_token: TokenFactory):
    token = make_token(sub=USER_A)
    await create_tenant(client, token)
    response = await client.post("/api/tenants", json={"name": "Outra"}, headers=auth(token))
    assert response.status_code == 409
    assert response.json()["error"] == "tenant_already_exists"


async def test_mass_assignment_is_rejected(db, client: AsyncClient, make_token: TokenFactory):
    response = await client.post(
        "/api/tenants",
        json={"name": "Loja", "id": str(uuid.uuid4()), "tenant_id": str(uuid.uuid4())},
        headers=auth(make_token(sub=USER_A)),
    )
    assert response.status_code == 422


async def test_tenant_routes_require_onboarding(db, client: AsyncClient, make_token: TokenFactory):
    response = await client.get("/api/tenant", headers=auth(make_token(sub=USER_A)))
    assert response.status_code == 403
    assert response.json()["error"] == "onboarding_required"


async def test_user_b_cannot_see_tenant_a(db, client: AsyncClient, make_token: TokenFactory):
    await create_tenant(client, make_token(sub=USER_A), "Loja A")
    token_b = make_token(sub=USER_B, email="seller-b@example.com")

    me_b = (await client.get("/api/me", headers=auth(token_b))).json()
    assert me_b["tenant"] is None
    assert (await client.get("/api/tenant", headers=auth(token_b))).status_code == 403

    tenant_b = await create_tenant(client, token_b, "Loja B")
    current_b = (await client.get("/api/tenant", headers=auth(token_b))).json()
    assert current_b["id"] == tenant_b["id"]
    assert current_b["name"] == "Loja B"


async def test_member_cannot_rename_tenant(db, client: AsyncClient, make_token: TokenFactory):
    token_a = make_token(sub=USER_A)
    tenant = await create_tenant(client, token_a, "Loja A")
    token_b = make_token(sub=USER_B, email="seller-b@example.com")
    me_b = (await client.get("/api/me", headers=auth(token_b))).json()

    await admin_sql(
        "INSERT INTO app.tenant_users (tenant_id, user_id, role) VALUES (:t, :u, 'MEMBER')",
        t=uuid.UUID(tenant["id"]),
        u=uuid.UUID(me_b["user"]["id"]),
    )

    assert (await client.get("/api/tenant", headers=auth(token_b))).json()["id"] == tenant["id"]
    denied = await client.patch("/api/tenant", json={"name": "Hack"}, headers=auth(token_b))
    assert denied.status_code == 403
    assert denied.json()["error"] == "forbidden"

    renamed = await client.patch("/api/tenant", json={"name": "Loja A2"}, headers=auth(token_a))
    assert renamed.status_code == 200
    assert renamed.json()["name"] == "Loja A2"

    rows = await admin_sql(
        "SELECT metadata->>'from', metadata->>'to' FROM app.audit_logs "
        "WHERE action = 'tenant.renamed'"
    )
    assert tuple(rows[0]) == ("Loja A", "Loja A2")
