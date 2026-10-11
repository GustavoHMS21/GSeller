"""Envia um e-mail de teste pelo Resend para conferir chave, remetente e domínio.

Uso: uv run python -m scripts.email_check voce@exemplo.com
"""

import asyncio
import sys
import uuid

from app.core.config import get_settings
from app.integrations.resend_gateway import EmailMessage, gateway_from_settings


async def main(to: str) -> int:
    gateway = gateway_from_settings(get_settings())
    if gateway is None:
        print("Configure RESEND_API_KEY e EMAIL_FROM em backend/.env.")
        return 2
    message = EmailMessage(
        to=to,
        subject="Teste de envio do GSeller",
        html="<p>O envio de e-mails do GSeller está funcionando.</p>",
        text="O envio de e-mails do GSeller está funcionando.",
        category="test",
    )
    message_id = await gateway.send(message, idempotency_key=f"test/{uuid.uuid4()}")
    print(f"Enviado. Id no Resend: {message_id}")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    sys.exit(asyncio.run(main(sys.argv[1])))
