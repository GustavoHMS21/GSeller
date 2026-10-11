"""Registro dos e-mails do sistema já enviados (Bloco 59, issue #46)."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import SCHEMA, Base


class EmailDelivery(Base):
    """Quem recebeu qual aviso. Nunca guarda o endereço nem o conteúdo (minimização, Bloco 19).

    A unicidade por empresa, pessoa e tipo garante que o mesmo aviso não sai duas vezes.
    """

    __tablename__ = "email_deliveries"
    __table_args__ = (UniqueConstraint("tenant_id", "user_id", "kind"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey(f"{SCHEMA}.tenants.id", ondelete="CASCADE")
    )
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey(f"{SCHEMA}.users.id", ondelete="CASCADE"))
    kind: Mapped[str] = mapped_column(String(32))
    provider_message_id: Mapped[str | None] = mapped_column(String(64))
    sent_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
