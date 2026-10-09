"""Registro de eventos de auditoria (Bloco 18.9)."""

import uuid
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import redact, request_id_ctx
from app.models import AuditLog


def record_audit(
    session: AsyncSession,
    *,
    action: str,
    resource_type: str,
    resource_id: object | None,
    actor_user_id: uuid.UUID | None,
    tenant_id: uuid.UUID | None,
    metadata: dict[str, Any] | None = None,
) -> None:
    """Adiciona o evento à transação corrente; é persistido junto com a operação auditada."""
    session.add(
        AuditLog(
            id=uuid.uuid4(),
            tenant_id=tenant_id,
            actor_user_id=actor_user_id,
            action=action,
            resource_type=resource_type,
            resource_id=None if resource_id is None else str(resource_id),
            event_metadata=redact(metadata or {}),
            request_id=request_id_ctx.get(),
        )
    )
