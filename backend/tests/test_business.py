"""Empresas (CNPJ) e lojas (issue #49): isolamento entre contas e regras de exclusão."""

import uuid

import pytest
from httpx import AsyncClient
from sqlalchemy.exc import IntegrityError

from tests.conftest import TokenFactory
from tests.test_rls import as_runtime, close, count
from tests.test_tenancy_api import USER_A, USER_B, admin_sql, auth, create_tenant

pytestmark = pytest.mark.db

CNPJ = "11.222.333/0001-81"


async def create_company(client: AsyncClient, token: str, cnpj: str = CNPJ) -> dict:
    response = await client.post(
        "/api/companies",
        json={"cnpj": cnpj, "legal_name": "Loja A Ltda", "tax_regime": "simples_nacional"},
        headers=auth(token),
    )
    assert response.status_code == 201, response.text
    return response.json()


async def create_store(client: AsyncClient, token: str, company_id: str) -> dict:
    response = await client.post(
        "/api/stores",
        json={"company_id": company_id, "marketplace": "mercadolivre", "name": "ML principal"},
        headers=auth(token),
    )
    assert response.status_code == 201, response.text
    return response.json()


async def test_companies_with_stores(db, client: AsyncClient, make_token: TokenFactory):
    token = make_token(sub=USER_A)
    await create_tenant(client, token)
    first = await create_company(client, token)
    second = await create_company(client, token, "12.ABC.345/01DE-35")
    store = await create_store(client, token, first["id"])

    listed = (await client.get("/api/companies", headers=auth(token))).json()
    assert [c["cnpj"] for c in listed] == ["11222333000181", "12ABC34501DE35"]
    assert [s["id"] for s in listed[0]["stores"]] == [store["id"]]
    assert listed[1]["stores"] == []

    duplicate = await client.post(
        "/api/companies",
        json={"cnpj": "11222333000181", "legal_name": "Outra", "tax_regime": "mei"},
        headers=auth(token),
    )
    assert duplicate.json()["error"] == "cnpj_already_registered"
    invalid = await client.post(
        "/api/companies",
        json={"cnpj": "11222333000180", "legal_name": "Outra", "tax_regime": "mei"},
        headers=auth(token),
    )
    assert invalid.json()["error"] == "invalid_cnpj"

    blocked = await client.delete(f"/api/companies/{first['id']}", headers=auth(token))
    assert blocked.json()["error"] == "company_has_stores"
    assert (
        await client.delete(f"/api/stores/{store['id']}", headers=auth(token))
    ).status_code == 204
    gone = await client.delete(f"/api/companies/{first['id']}", headers=auth(token))
    assert gone.status_code == 204
    assert second["id"] in [
        c["id"] for c in (await client.get("/api/companies", headers=auth(token))).json()
    ]


async def test_other_account_cannot_see_or_use_companies(
    db, client: AsyncClient, make_token: TokenFactory
):
    token_a = make_token(sub=USER_A)
    tenant_a = await create_tenant(client, token_a)
    company_a = await create_company(client, token_a)
    store_a = await create_store(client, token_a, company_a["id"])

    token_b = make_token(sub=USER_B, email="b@example.com")
    await create_tenant(client, token_b, "Loja B")
    # Mesmo CNPJ em outra conta é permitido: a unicidade é por conta.
    await create_company(client, token_b)

    listed = (await client.get("/api/companies", headers=auth(token_b))).json()
    assert company_a["id"] not in [c["id"] for c in listed]
    for response in (
        await client.post(
            "/api/stores",
            json={"company_id": company_a["id"], "marketplace": "shopee", "name": "Invasão"},
            headers=auth(token_b),
        ),
        await client.delete(f"/api/companies/{company_a['id']}", headers=auth(token_b)),
        await client.delete(f"/api/stores/{store_a['id']}", headers=auth(token_b)),
    ):
        assert response.status_code == 404

    engine, conn = await as_runtime(tenant_a["id"])
    try:
        assert await count(conn, "companies") == 1
        assert await count(conn, "stores") == 1
    finally:
        await close(engine, conn)


async def test_store_cannot_point_to_company_of_another_account(
    db, client: AsyncClient, make_token: TokenFactory
):
    """Terceira camada: mesmo fora da API, o banco recusa a loja ligada a CNPJ de outra conta."""
    token_a = make_token(sub=USER_A)
    await create_tenant(client, token_a)
    company_a = await create_company(client, token_a)
    tenant_b = await create_tenant(client, make_token(sub=USER_B, email="b@example.com"), "Loja B")

    with pytest.raises(IntegrityError):
        await admin_sql(
            "INSERT INTO app.stores (id, tenant_id, company_id, marketplace, name) "
            "VALUES (:id, :t, :c, 'shopee', 'x')",
            id=uuid.uuid4(),
            t=uuid.UUID(tenant_b["id"]),
            c=uuid.UUID(company_a["id"]),
        )


async def test_member_cannot_change_companies(db, client: AsyncClient, make_token: TokenFactory):
    tenant = await create_tenant(client, make_token(sub=USER_A))
    token_b = make_token(sub=USER_B, email="b@example.com")
    me_b = (await client.get("/api/me", headers=auth(token_b))).json()
    await admin_sql(
        "INSERT INTO app.tenant_users (tenant_id, user_id, role) VALUES (:t, :u, 'MEMBER')",
        t=uuid.UUID(tenant["id"]),
        u=uuid.UUID(me_b["user"]["id"]),
    )
    assert (await client.get("/api/companies", headers=auth(token_b))).status_code == 200
    denied = await client.post(
        "/api/companies",
        json={"cnpj": CNPJ, "legal_name": "Loja A Ltda", "tax_regime": "mei"},
        headers=auth(token_b),
    )
    assert denied.status_code == 403
