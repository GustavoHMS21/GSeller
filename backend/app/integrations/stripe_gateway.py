"""Acesso ao Stripe atrás de uma interface pequena (SOLID: D e I, Bloco 53.4).

A regra de negócio depende de `BillingGateway`; os testes usam uma implementação falsa,
sem rede. A verificação de assinatura do webhook é sempre a da biblioteca oficial.
"""

from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any, Protocol

import stripe

PLAN_LOOKUP_KEYS = {
    "start": "gseller_start_mensal",
    "pro": "gseller_pro_mensal",
    "scale": "gseller_scale_mensal",
}
_PLAN_BY_LOOKUP_KEY = {value: key for key, value in PLAN_LOOKUP_KEYS.items()}


class InvalidWebhookError(Exception):
    """Assinatura ausente, inválida ou expirada."""


@dataclass(frozen=True)
class WebhookEvent:
    id: str
    type: str
    data: dict[str, Any]


@dataclass(frozen=True)
class SubscriptionState:
    id: str
    customer_id: str
    tenant_id: str | None
    status: str
    plan: str | None
    current_period_end: datetime | None
    cancel_at_period_end: bool


class BillingGateway(Protocol):
    async def create_customer(self, *, email: str | None, tenant_id: str) -> str: ...

    async def create_checkout(
        self, *, customer_id: str, plan: str, tenant_id: str, success_url: str, cancel_url: str
    ) -> str: ...

    async def create_portal(self, *, customer_id: str, return_url: str) -> str: ...

    async def retrieve_subscription(self, subscription_id: str) -> SubscriptionState: ...

    def parse_webhook(self, payload: bytes, signature: str | None) -> WebhookEvent: ...


class StripeGateway:
    def __init__(self, secret_key: str, webhook_secret: str | None) -> None:
        self._client = stripe.StripeClient(secret_key, http_client=stripe.HTTPXClient())
        self._webhook_secret = webhook_secret

    async def create_customer(self, *, email: str | None, tenant_id: str) -> str:
        params: dict[str, Any] = {"metadata": {"tenant_id": tenant_id}}
        if email:
            params["email"] = email
        customer = await self._client.v1.customers.create_async(params=params)  # type: ignore[arg-type]
        return customer.id

    async def create_checkout(
        self, *, customer_id: str, plan: str, tenant_id: str, success_url: str, cancel_url: str
    ) -> str:
        prices = await self._client.v1.prices.list_async(
            params={"lookup_keys": [PLAN_LOOKUP_KEYS[plan]], "active": True, "limit": 1}
        )
        if not prices.data:
            raise LookupError(f"Preço não configurado no Stripe para o plano {plan}")
        session = await self._client.v1.checkout.sessions.create_async(
            params={
                "mode": "subscription",
                "customer": customer_id,
                "client_reference_id": tenant_id,
                "line_items": [{"price": prices.data[0].id, "quantity": 1}],
                # O tenant viaja na assinatura: é por ele que o webhook encontra a empresa.
                "subscription_data": {"metadata": {"tenant_id": tenant_id}},
                "success_url": success_url,
                "cancel_url": cancel_url,
                "locale": "pt-BR",
                "allow_promotion_codes": True,
            }
        )
        if not session.url:
            raise RuntimeError("Stripe não devolveu a URL do checkout")
        return session.url

    async def create_portal(self, *, customer_id: str, return_url: str) -> str:
        portal = await self._client.v1.billing_portal.sessions.create_async(
            params={"customer": customer_id, "return_url": return_url, "locale": "pt-BR"}
        )
        return portal.url

    async def retrieve_subscription(self, subscription_id: str) -> SubscriptionState:
        # A partir da v16 os objetos do SDK não aceitam .get(); trabalhamos com dict puro.
        sub = (await self._client.v1.subscriptions.retrieve_async(subscription_id)).to_dict()
        item = sub["items"]["data"][0] if sub["items"]["data"] else None
        period_end = item.get("current_period_end") if item else None
        lookup_key = item["price"].get("lookup_key") if item else None
        customer = sub["customer"]
        return SubscriptionState(
            id=sub["id"],
            customer_id=customer if isinstance(customer, str) else customer["id"],
            tenant_id=(sub.get("metadata") or {}).get("tenant_id"),
            status=sub["status"],
            plan=_PLAN_BY_LOOKUP_KEY.get(lookup_key or ""),
            current_period_end=datetime.fromtimestamp(period_end, UTC) if period_end else None,
            cancel_at_period_end=bool(sub.get("cancel_at_period_end")),
        )

    def parse_webhook(self, payload: bytes, signature: str | None) -> WebhookEvent:
        if not self._webhook_secret or not signature:
            raise InvalidWebhookError("missing signature or secret")
        try:
            event = self._client.construct_event(payload, signature, self._webhook_secret)
        except (ValueError, stripe.SignatureVerificationError) as exc:
            raise InvalidWebhookError(str(exc)) from exc
        return WebhookEvent(id=event.id, type=event.type, data=event.data.object.to_dict())
