"""Avisos de fim de trial (issue #36): uma vez cada, só para quem ainda não assinou.

O envio usa um gateway falso; banco, RLS e a função de destinatários são os reais.
"""

from datetime import UTC, datetime, timedelta

import pytest
from httpx import AsyncClient

from app.core.db import get_sessionmaker
from app.integrations.resend_gateway import EmailDeliveryError, EmailMessage
from app.services.trial_emails import send_trial_emails
from tests.conftest import TokenFactory
from tests.test_rls import as_runtime, close, count
from tests.test_tenancy_api import USER_A, USER_B, admin_sql, create_tenant

pytestmark = pytest.mark.db


class FakeEmailGateway:
    def __init__(self, failures: int = 0) -> None:
        self.sent: list[tuple[EmailMessage, str]] = []
        self._failures = failures

    async def send(self, message: EmailMessage, *, idempotency_key: str) -> str:
        if self._failures:
            self._failures -= 1
            raise EmailDeliveryError("resend 500")
        self.sent.append((message, idempotency_key))
        return f"email_{len(self.sent)}"


async def run_job(gateway: FakeEmailGateway) -> dict[str, int]:
    async with get_sessionmaker()() as session:
        return await send_trial_emails(
            session, gateway, now=datetime.now(UTC), frontend_url="https://app.test"
        )


async def set_trial_end(tenant_id: str, delta: timedelta) -> None:
    await admin_sql(
        "UPDATE app.tenants SET trial_ends_at = now() + :d WHERE id = :t",
        d=delta,
        t=tenant_id,
    )


async def test_each_notice_is_sent_once(db, client: AsyncClient, make_token: TokenFactory):
    tenant = await create_tenant(client, make_token(sub=USER_A))
    gateway = FakeEmailGateway()

    await set_trial_end(tenant["id"], timedelta(days=1))
    assert await run_job(gateway) == {"trial_ending": 1, "trial_ended": 0}
    assert await run_job(gateway) == {"trial_ending": 0, "trial_ended": 0}

    await set_trial_end(tenant["id"], timedelta(hours=-1))
    assert await run_job(gateway) == {"trial_ending": 0, "trial_ended": 1}
    assert await run_job(gateway) == {"trial_ending": 0, "trial_ended": 0}

    assert [m.category for m, _ in gateway.sent] == ["trial_ending", "trial_ended"]
    assert gateway.sent[0][0].to == "seller-a@example.com"
    assert "https://app.test/planos" in gateway.sent[1][0].text
    rows = await admin_sql("SELECT provider_message_id FROM app.email_deliveries ORDER BY sent_at")
    assert [r[0] for r in rows] == ["email_1", "email_2"]


async def test_skips_subscribed_and_out_of_window(
    db, client: AsyncClient, make_token: TokenFactory
):
    subscribed = await create_tenant(client, make_token(sub=USER_A))
    await set_trial_end(subscribed["id"], timedelta(days=1))
    await admin_sql(
        "INSERT INTO app.subscriptions (tenant_id, stripe_customer_id, status, "
        "cancel_at_period_end) VALUES (:t, 'cus_1', 'active', false)",
        t=subscribed["id"],
    )
    far = await create_tenant(client, make_token(sub=USER_B, email="b@example.com"), "Loja B")
    await set_trial_end(far["id"], timedelta(days=5))
    old = await create_tenant(client, make_token(sub=USER_A[:-1] + "c", email="c@example.com"))
    await set_trial_end(old["id"], timedelta(days=-8))

    gateway = FakeEmailGateway()
    assert await run_job(gateway) == {"trial_ending": 0, "trial_ended": 0}


async def test_failed_send_is_retried_next_run(db, client: AsyncClient, make_token: TokenFactory):
    tenant = await create_tenant(client, make_token(sub=USER_A))
    await set_trial_end(tenant["id"], timedelta(days=1))
    gateway = FakeEmailGateway(failures=1)

    assert await run_job(gateway) == {"trial_ending": 0, "trial_ended": 0}
    assert await run_job(gateway) == {"trial_ending": 1, "trial_ended": 0}
    assert len(gateway.sent) == 1


async def test_deliveries_are_isolated_by_tenant(db, client: AsyncClient, make_token: TokenFactory):
    tenant_a = await create_tenant(client, make_token(sub=USER_A))
    tenant_b = await create_tenant(client, make_token(sub=USER_B, email="b@example.com"), "Loja B")
    for tenant in (tenant_a, tenant_b):
        await set_trial_end(tenant["id"], timedelta(days=1))
    await run_job(FakeEmailGateway())

    engine, conn = await as_runtime(tenant_a["id"])
    try:
        assert await count(conn, "email_deliveries") == 1
    finally:
        await close(engine, conn)
