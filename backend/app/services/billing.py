"""Assinatura da empresa (Bloco 58, issue #35).

O webhook é a fonte de verdade: a cada evento relevante, o estado atual da assinatura é
buscado na API do Stripe. Isso torna o processamento indiferente a eventos repetidos ou
fora de ordem.
"""

import logging
import uuid

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.db_context import bind_context
from app.core.errors import ApiError
from app.integrations.stripe_gateway import BillingGateway, WebhookEvent
from app.models import StripeEvent, Subscription, Tenant, User
from app.services.audit import record_audit

logger = logging.getLogger(__name__)

# past_due: o Stripe ainda está tentando cobrar; o acesso continua durante as novas tentativas.
ACTIVE_STATUSES = frozenset({"active", "trialing", "past_due"})

HANDLED_EVENTS = frozenset(
    {
        "checkout.session.completed",
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
    }
)


def has_active_subscription(subscription: Subscription | None) -> bool:
    return subscription is not None and subscription.status in ACTIVE_STATUSES


async def get_subscription(session: AsyncSession, tenant_id: uuid.UUID) -> Subscription | None:
    return await session.scalar(select(Subscription).where(Subscription.tenant_id == tenant_id))


async def start_checkout(
    session: AsyncSession,
    gateway: BillingGateway,
    *,
    user: User,
    tenant_id: uuid.UUID,
    plan: str,
    frontend_url: str,
) -> str:
    # Trava a empresa: dois cliques simultâneos não criam dois clientes no Stripe.
    await session.execute(select(Tenant.id).where(Tenant.id == tenant_id).with_for_update())
    subscription = await get_subscription(session, tenant_id)
    if has_active_subscription(subscription):
        raise ApiError(409, "already_subscribed", "A empresa já tem uma assinatura ativa.")

    if subscription is None:
        customer_id = await gateway.create_customer(email=user.email, tenant_id=str(tenant_id))
        subscription = Subscription(tenant_id=tenant_id, stripe_customer_id=customer_id)
        session.add(subscription)
        record_audit(
            session,
            action="billing.customer_created",
            resource_type="subscription",
            resource_id=tenant_id,
            actor_user_id=user.id,
            tenant_id=tenant_id,
        )
        await session.commit()

    return await gateway.create_checkout(
        customer_id=subscription.stripe_customer_id,
        plan=plan,
        tenant_id=str(tenant_id),
        success_url=f"{frontend_url}/assinatura/sucesso",
        cancel_url=f"{frontend_url}/planos",
    )


async def open_portal(
    session: AsyncSession, gateway: BillingGateway, *, tenant_id: uuid.UUID, frontend_url: str
) -> str:
    subscription = await get_subscription(session, tenant_id)
    if subscription is None:
        raise ApiError(404, "no_subscription", "A empresa ainda não tem assinatura.")
    return await gateway.create_portal(
        customer_id=subscription.stripe_customer_id, return_url=f"{frontend_url}/planos"
    )


async def apply_webhook(session: AsyncSession, gateway: BillingGateway, event: WebhookEvent) -> str:
    """Aplica um evento já verificado. Retorna: applied, duplicate, ignored ou rejected."""
    if event.type not in HANDLED_EVENTS:
        return "ignored"
    if await session.get(StripeEvent, event.id) is not None:
        return "duplicate"

    subscription_id = (
        event.data.get("subscription")
        if event.type == "checkout.session.completed"
        else event.data.get("id")
    )
    if not subscription_id:
        return "ignored"

    state = await gateway.retrieve_subscription(subscription_id)
    try:
        tenant_id = uuid.UUID(state.tenant_id or "")
    except ValueError:
        logger.warning("subscription without tenant", extra={"subscription": state.id})
        return "rejected"

    await bind_context(session, tenant_id=tenant_id)
    subscription = await get_subscription(session, tenant_id)
    # Defesa extra: o cliente do Stripe precisa ser o mesmo que a empresa registrou.
    if subscription is None or subscription.stripe_customer_id != state.customer_id:
        logger.warning("subscription customer mismatch", extra={"subscription": state.id})
        return "rejected"

    subscription.stripe_subscription_id = state.id
    subscription.status = state.status
    subscription.plan = state.plan
    subscription.current_period_end = state.current_period_end
    subscription.cancel_at_period_end = state.cancel_at_period_end
    record_audit(
        session,
        action="billing.subscription_synced",
        resource_type="subscription",
        resource_id=tenant_id,
        actor_user_id=None,
        tenant_id=tenant_id,
        metadata={"status": state.status, "plan": state.plan, "event": event.type},
    )
    session.add(StripeEvent(event_id=event.id, type=event.type))
    try:
        await session.commit()
    except IntegrityError:
        # O mesmo evento chegou em paralelo e já foi gravado pela outra requisição.
        await session.rollback()
        return "duplicate"
    return "applied"
