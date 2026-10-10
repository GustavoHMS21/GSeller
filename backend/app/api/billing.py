"""Rotas de cobrança. Checkout e portal funcionam mesmo com o trial vencido: é para pagar."""

from functools import lru_cache
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, ConfigDict

from app.auth.deps import BillingOwnerContext
from app.core.config import get_settings
from app.core.db import get_sessionmaker
from app.core.errors import ApiError
from app.integrations.stripe_gateway import BillingGateway, InvalidWebhookError, StripeGateway
from app.services import billing

router = APIRouter(prefix="/api/billing", tags=["billing"])


@lru_cache
def _stripe_gateway(secret_key: str, webhook_secret: str | None) -> StripeGateway:
    return StripeGateway(secret_key, webhook_secret)


def get_billing_gateway() -> BillingGateway:
    settings = get_settings()
    if not settings.stripe_secret_key:
        raise ApiError(503, "billing_not_configured", "Cobrança não configurada no servidor.")
    webhook = settings.stripe_webhook_secret
    return _stripe_gateway(
        settings.stripe_secret_key.get_secret_value(),
        webhook.get_secret_value() if webhook else None,
    )


Gateway = Annotated[BillingGateway, Depends(get_billing_gateway)]


class CheckoutIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    plan: Literal["start", "pro", "scale"]


class RedirectOut(BaseModel):
    url: str


@router.post("/checkout")
async def checkout(body: CheckoutIn, ctx: BillingOwnerContext, gateway: Gateway) -> RedirectOut:
    url = await billing.start_checkout(
        ctx.session,
        gateway,
        user=ctx.user,
        tenant_id=ctx.tenant_id,
        plan=body.plan,
        frontend_url=get_settings().frontend_url,
    )
    return RedirectOut(url=url)


@router.post("/portal")
async def portal(ctx: BillingOwnerContext, gateway: Gateway) -> RedirectOut:
    url = await billing.open_portal(
        ctx.session, gateway, tenant_id=ctx.tenant_id, frontend_url=get_settings().frontend_url
    )
    return RedirectOut(url=url)


@router.post("/webhook")
async def webhook(request: Request, gateway: Gateway) -> dict[str, str]:
    """Chamado pelo Stripe. Sem login: a autenticidade vem da assinatura do evento."""
    try:
        event = gateway.parse_webhook(await request.body(), request.headers.get("stripe-signature"))
    except InvalidWebhookError as exc:
        raise ApiError(400, "invalid_signature", "Assinatura do webhook inválida.") from exc
    async with get_sessionmaker()() as session:
        result = await billing.apply_webhook(session, gateway, event)
    return {"result": result}
