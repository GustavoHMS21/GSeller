"""Assinatura por empresa, espelho do estado no Stripe (Bloco 58, issue #35)."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import SCHEMA, Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    tenant_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey(f"{SCHEMA}.tenants.id", ondelete="CASCADE"), primary_key=True
    )
    stripe_customer_id: Mapped[str] = mapped_column(String(64), unique=True)
    stripe_subscription_id: Mapped[str | None] = mapped_column(String(64), unique=True)
    plan: Mapped[str | None] = mapped_column(String(16))
    # Status do Stripe: active, trialing, past_due, canceled, unpaid, incomplete...
    status: Mapped[str | None] = mapped_column(String(32))
    current_period_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    cancel_at_period_end: Mapped[bool] = mapped_column(default=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class StripeEvent(Base):
    """Eventos de webhook já processados: o mesmo evento nunca é aplicado duas vezes."""

    __tablename__ = "stripe_events"

    event_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    type: Mapped[str] = mapped_column(String(64))
    processed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
