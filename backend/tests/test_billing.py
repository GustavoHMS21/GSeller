"""Cobrança (issue #35): checkout, webhook e efeito da assinatura no bloqueio do trial.

As chamadas de rede ao Stripe usam um gateway falso; a verificação de assinatura do webhook
é a real da biblioteca oficial.
"""

import hashlib
import hmac
import json
import time
import uuid
from datetime import UTC, datetime

import pytest
from fastapi import FastAPI
from httpx import AsyncClient

from app.api.billing import get_billing_gateway
from app.integrations.stripe_gateway import StripeGateway, SubscriptionState
from tests.conftest import TokenFactory
from tests.test_tenancy_api import USER_A, USER_B, admin_sql, auth, create_tenant

pytestmark = pytest.mark.db

WEBHOOK_SECRET = "whsec_test_secret"


class FakeGateway:
    """Simula o Stripe em memória; a assinatura do webhook é verificada de verdade."""

    def __init__(self) -> None:
        self.customers: list[str] = []
        self.subscriptions: dict[str, SubscriptionState] = {}
        self._real = StripeGateway("sk_test_offline", WEBHOOK_SECRET)

    async def create_customer(self, *, email: str | None, tenant_id: str) -> str:
        self.customers.append(tenant_id)
        return f"cus_{len(self.customers)}"

    async def create_checkout(self, *, customer_id, plan, tenant_id, success_url, cancel_url):
        return f"https://checkout.stripe.test/{customer_id}/{plan}"

    async def create_portal(self, *, customer_id: str, return_url: str) -> str:
        return f"https://billing.stripe.test/{customer_id}"

    async def retrieve_subscription(self, subscription_id: str) -> SubscriptionState:
        return self.subscriptions[subscription_id]

    def parse_webhook(self, payload: bytes, signature: str | None):
        return self._real.parse_webhook(payload, signature)


@pytest.fixture
def gateway(app: FastAPI) -> FakeGateway:
    fake = FakeGateway()
    app.dependency_overrides[get_billing_gateway] = lambda: fake
    return fake


def signed(event: dict) -> tuple[bytes, dict[str, str]]:
    payload = json.dumps(event).encode()
    timestamp = int(time.time())
    digest = hmac.new(
        WEBHOOK_SECRET.encode(), f"{timestamp}.".encode() + payload, hashlib.sha256
    ).hexdigest()
    return payload, {"stripe-signature": f"t={timestamp},v1={digest}"}


def subscription_event(event_id: str, subscription_id: str) -> dict:
    return {
        "id": event_id,
        "object": "event",
        "type": "customer.subscription.updated",
        "data": {"object": {"id": subscription_id, "object": "subscription"}},
    }


async def subscribe(
    client: AsyncClient, gateway: FakeGateway, token: str, *, status: str = "active"
) -> str:
    """Checkout + webhook: o caminho completo de uma assinatura."""
    tenant = await create_tenant(client, token)
    response = await client.post("/api/billing/checkout", json={"plan": "pro"}, headers=auth(token))
    assert response.status_code == 200
    gateway.subscriptions["sub_1"] = SubscriptionState(
        id="sub_1",
        customer_id="cus_1",
        tenant_id=tenant["id"],
        status=status,
        plan="pro",
        current_period_end=datetime(2026, 11, 10, tzinfo=UTC),
        cancel_at_period_end=False,
    )
    payload, headers = signed(subscription_event("evt_1", "sub_1"))
    result = await client.post("/api/billing/webhook", content=payload, headers=headers)
    assert result.json() == {"result": "applied"}
    return tenant["id"]


async def expire_trial() -> None:
    await admin_sql("UPDATE app.tenants SET trial_ends_at = now() - interval '1 second'")


async def test_checkout_creates_customer_once(db, client, gateway, make_token: TokenFactory):
    token = make_token(sub=USER_A)
    await create_tenant(client, token)
    first = await client.post("/api/billing/checkout", json={"plan": "pro"}, headers=auth(token))
    second = await client.post("/api/billing/checkout", json={"plan": "start"}, headers=auth(token))
    assert first.json()["url"].endswith("/cus_1/pro")
    assert second.json()["url"].endswith("/cus_1/start")
    assert len(gateway.customers) == 1


async def test_checkout_works_after_trial_expired(db, client, gateway, make_token: TokenFactory):
    token = make_token(sub=USER_A)
    await create_tenant(client, token)
    await expire_trial()
    response = await client.post("/api/billing/checkout", json={"plan": "pro"}, headers=auth(token))
    assert response.status_code == 200


async def test_checkout_requires_owner_with_account(db, client, gateway, make_token: TokenFactory):
    anonymous = make_token(sub=USER_B, email="", is_anonymous=True)
    denied = await client.post(
        "/api/billing/checkout", json={"plan": "pro"}, headers=auth(anonymous)
    )
    assert denied.json()["error"] == "account_required"

    owner = make_token(sub=USER_A)
    tenant = await create_tenant(client, owner)
    member = make_token(sub=str(uuid.uuid4()), email="membro@example.com")
    me = (await client.get("/api/me", headers=auth(member))).json()
    await admin_sql(
        "INSERT INTO app.tenant_users (tenant_id, user_id, role) VALUES (:t, :u, 'MEMBER')",
        t=uuid.UUID(tenant["id"]),
        u=uuid.UUID(me["user"]["id"]),
    )
    forbidden = await client.post(
        "/api/billing/checkout", json={"plan": "pro"}, headers=auth(member)
    )
    assert forbidden.json()["error"] == "forbidden"


async def test_webhook_rejects_invalid_signature(db, client, gateway):
    payload, headers = signed(subscription_event("evt_x", "sub_x"))
    headers["stripe-signature"] = headers["stripe-signature"].replace("v1=", "v1=00")
    response = await client.post("/api/billing/webhook", content=payload, headers=headers)
    assert response.status_code == 400
    assert response.json()["error"] == "invalid_signature"


async def test_active_subscription_lifts_trial_block(db, client, gateway, make_token: TokenFactory):
    token = make_token(sub=USER_A)
    await subscribe(client, gateway, token)
    await expire_trial()

    assert (await client.get("/api/tenant", headers=auth(token))).status_code == 200
    access = (await client.get("/api/me", headers=auth(token))).json()["access"]
    assert access["status"] == "active"
    assert access["plan"] == "pro"


@pytest.mark.parametrize(("status", "allowed"), [("past_due", True), ("canceled", False)])
async def test_subscription_status_controls_access(
    db, client, gateway, make_token: TokenFactory, status: str, allowed: bool
):
    token = make_token(sub=USER_A)
    await subscribe(client, gateway, token, status=status)
    await expire_trial()
    response = await client.get("/api/tenant", headers=auth(token))
    assert (response.status_code == 200) is allowed


async def test_duplicate_webhook_is_applied_once(db, client, gateway, make_token: TokenFactory):
    token = make_token(sub=USER_A)
    await subscribe(client, gateway, token)
    payload, headers = signed(subscription_event("evt_1", "sub_1"))
    repeated = await client.post("/api/billing/webhook", content=payload, headers=headers)
    assert repeated.json() == {"result": "duplicate"}
    rows = await admin_sql(
        "SELECT count(*) FROM app.audit_logs WHERE action = 'billing.subscription_synced'"
    )
    assert rows[0][0] == 1


async def test_webhook_rejects_customer_of_another_company(
    db, client, gateway, make_token: TokenFactory
):
    token = make_token(sub=USER_A)
    tenant_id = await subscribe(client, gateway, token, status="canceled")
    gateway.subscriptions["sub_2"] = SubscriptionState(
        id="sub_2",
        customer_id="cus_de_outra_empresa",
        tenant_id=tenant_id,
        status="active",
        plan="scale",
        current_period_end=None,
        cancel_at_period_end=False,
    )
    payload, headers = signed(subscription_event("evt_2", "sub_2"))
    result = await client.post("/api/billing/webhook", content=payload, headers=headers)
    assert result.json() == {"result": "rejected"}
    await expire_trial()
    assert (await client.get("/api/tenant", headers=auth(token))).status_code == 402
