"""Avisos de fim de trial por e-mail (Bloco 58, issue #36).

Rodado uma vez por dia pelo agendador do deploy (#22). Cada aviso sai no máximo uma vez por
pessoa e empresa: o registro em `app.email_deliveries` é gravado na mesma transação do envio
(o índice único bloqueia uma segunda execução simultânea), e a chave de idempotência do
Resend cobre uma queda entre o envio e o commit.
"""

import logging
from datetime import datetime, timedelta
from enum import StrEnum

from sqlalchemy import text, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.engine import Row
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.db_context import bind_context
from app.integrations.resend_gateway import EmailDeliveryError, EmailGateway, EmailMessage
from app.models import EmailDelivery
from app.services import email_templates
from app.services.billing import ACTIVE_STATUSES

logger = logging.getLogger(__name__)

# "6º dia": a primeira execução diária com menos de 48 h de trial restantes.
ENDING_WINDOW = timedelta(days=2)
# Trials encerrados há mais tempo não recebem aviso (ex.: na primeira execução do job).
ENDED_WINDOW = timedelta(days=7)


class TrialEmail(StrEnum):
    ENDING = "trial_ending"
    ENDED = "trial_ended"


_RECIPIENTS = text(
    "SELECT tenant_id, user_id, email, trial_ends_at, subscription_status "
    "FROM app.trial_email_recipients(:kind, :since, :until)"
)


async def send_trial_emails(
    session: AsyncSession, gateway: EmailGateway, *, now: datetime, frontend_url: str
) -> dict[str, int]:
    """Envia os avisos devidos e devolve quantos saíram de cada tipo."""
    windows = (
        (TrialEmail.ENDED, now - ENDED_WINDOW, now),
        (TrialEmail.ENDING, now, now + ENDING_WINDOW),
    )
    sent = dict.fromkeys(TrialEmail, 0)
    for kind, since, until in windows:
        params = {"kind": kind.value, "since": since, "until": until}
        recipients = (await session.execute(_RECIPIENTS, params)).all()
        await session.commit()
        for recipient in recipients:
            if recipient.subscription_status in ACTIVE_STATUSES:
                continue
            message = (
                email_templates.trial_ending(recipient.email, recipient.trial_ends_at, frontend_url)
                if kind is TrialEmail.ENDING
                else email_templates.trial_ended(recipient.email, frontend_url)
            )
            if await _deliver(session, gateway, kind, recipient, message):
                sent[kind] += 1
    return {kind.value: count for kind, count in sent.items()}


async def _deliver(
    session: AsyncSession,
    gateway: EmailGateway,
    kind: TrialEmail,
    recipient: Row,
    message: EmailMessage,
) -> bool:
    await bind_context(session, tenant_id=recipient.tenant_id, user_id=recipient.user_id)
    claimed = await session.scalar(
        insert(EmailDelivery)
        .values(tenant_id=recipient.tenant_id, user_id=recipient.user_id, kind=kind.value)
        .on_conflict_do_nothing(index_elements=["tenant_id", "user_id", "kind"])
        .returning(EmailDelivery.id)
    )
    if claimed is None:  # outra execução já enviou
        await session.rollback()
        return False

    try:
        message_id = await gateway.send(
            message, idempotency_key=f"{kind.value}/{recipient.tenant_id}/{recipient.user_id}"
        )
    except EmailDeliveryError as exc:
        # Sem registro: a próxima execução tenta de novo.
        await session.rollback()
        logger.warning(
            "email not sent",
            extra={"kind": kind.value, "tenant_id": str(recipient.tenant_id), "error": str(exc)},
        )
        return False

    await session.execute(
        update(EmailDelivery)
        .where(EmailDelivery.id == claimed)
        .values(provider_message_id=message_id)
    )
    await session.commit()
    return True
