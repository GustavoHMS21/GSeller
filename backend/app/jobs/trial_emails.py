"""Job diário dos avisos de fim de trial: `uv run python -m app.jobs.trial_emails`.

Sai com código 2 quando o envio de e-mails não está configurado, para o agendador acusar.
"""

import asyncio
import logging
import sys
from datetime import UTC, datetime

from app.core.config import get_settings
from app.core.db import get_engine, get_sessionmaker
from app.core.logging import configure_logging
from app.integrations.resend_gateway import gateway_from_settings
from app.services.trial_emails import send_trial_emails

logger = logging.getLogger("app.jobs.trial_emails")


async def run() -> int:
    settings = get_settings()
    configure_logging(settings.log_level)
    gateway = gateway_from_settings(settings)
    if gateway is None:
        logger.error("email not configured: set RESEND_API_KEY and EMAIL_FROM")
        return 2
    try:
        async with get_sessionmaker()() as session:
            sent = await send_trial_emails(
                session, gateway, now=datetime.now(UTC), frontend_url=settings.frontend_url
            )
    finally:
        await get_engine().dispose()
    logger.info("trial emails done", extra={"sent": sent})
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(run()))
