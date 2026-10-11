"""Gateway do Resend (sem rede, com transporte simulado) e textos dos e-mails."""

import json
from datetime import UTC, datetime

import httpx
import pytest

from app.integrations.resend_gateway import (
    RESEND_EMAILS_URL,
    EmailDeliveryError,
    EmailMessage,
    ResendGateway,
)
from app.services import email_templates

MESSAGE = EmailMessage(to="a@example.com", subject="s", html="<p>h</p>", text="t", category="c")


def gateway_returning(response: httpx.Response, seen: list[httpx.Request]) -> ResendGateway:
    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        return response

    return ResendGateway(
        "re_test_key",
        "GSeller <avisos@exemplo.com>",
        "suporte@exemplo.com",
        transport=httpx.MockTransport(handler),
    )


async def test_sends_with_idempotency_key_and_category_tag():
    seen: list[httpx.Request] = []
    gateway = gateway_returning(httpx.Response(200, json={"id": "email_123"}), seen)

    assert await gateway.send(MESSAGE, idempotency_key="trial_ending/t/u") == "email_123"

    request = seen[0]
    assert str(request.url) == RESEND_EMAILS_URL
    assert request.headers["Authorization"] == "Bearer re_test_key"
    assert request.headers["Idempotency-Key"] == "trial_ending/t/u"
    body = json.loads(request.content)
    assert body["to"] == ["a@example.com"]
    assert body["reply_to"] == "suporte@exemplo.com"
    assert body["tags"] == [{"name": "category", "value": "c"}]


async def test_provider_error_raises_without_leaking_payload():
    seen: list[httpx.Request] = []
    error = httpx.Response(422, json={"name": "validation_error", "message": "a@example.com"})
    gateway = gateway_returning(error, seen)

    with pytest.raises(EmailDeliveryError, match=r"^resend 422 validation_error$"):
        await gateway.send(MESSAGE, idempotency_key="k")


def test_trial_ending_shows_brasilia_time():
    message = email_templates.trial_ending(
        "a@example.com", datetime(2026, 10, 12, 13, 0, tzinfo=UTC), "https://app.test"
    )
    assert message.subject == "Seu teste do GSeller termina em 12/10"
    assert "12/10 às 10:00" in message.text
    assert 'href="https://app.test/planos"' in message.html
