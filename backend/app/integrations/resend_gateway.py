"""Envio de e-mails atrás de uma interface pequena (SOLID: D e I, Bloco 53.4).

A regra de negócio depende de `EmailGateway`; os testes usam uma implementação falsa, sem
rede. O Resend é chamado pela API REST com `httpx`, já presente no projeto: o SDK oficial é
síncrono e não acrescentaria nada aqui.
"""

from dataclasses import dataclass
from typing import Protocol

import httpx

from app.core.config import Settings

RESEND_EMAILS_URL = "https://api.resend.com/emails"


class EmailDeliveryError(Exception):
    """O provedor recusou o envio ou não respondeu."""


@dataclass(frozen=True)
class EmailMessage:
    to: str
    subject: str
    html: str
    text: str
    # Vira tag no Resend: separa entregas, aberturas e bounces por tipo de e-mail.
    category: str


class EmailGateway(Protocol):
    async def send(self, message: EmailMessage, *, idempotency_key: str) -> str:
        """Envia e devolve o id do e-mail no provedor."""
        ...


class ResendGateway:
    def __init__(
        self,
        api_key: str,
        sender: str,
        reply_to: str | None = None,
        *,
        transport: httpx.AsyncBaseTransport | None = None,
    ) -> None:
        self._api_key = api_key
        self._sender = sender
        self._reply_to = reply_to
        self._transport = transport

    async def send(self, message: EmailMessage, *, idempotency_key: str) -> str:
        payload: dict[str, object] = {
            "from": self._sender,
            "to": [message.to],
            "subject": message.subject,
            "html": message.html,
            "text": message.text,
            "tags": [{"name": "category", "value": message.category}],
        }
        if self._reply_to:
            payload["reply_to"] = self._reply_to
        # O Resend descarta envios repetidos com a mesma chave por 24 h.
        headers = {"Authorization": f"Bearer {self._api_key}", "Idempotency-Key": idempotency_key}
        try:
            async with httpx.AsyncClient(transport=self._transport, timeout=10) as client:
                response = await client.post(RESEND_EMAILS_URL, json=payload, headers=headers)
        except httpx.HTTPError as exc:
            raise EmailDeliveryError(type(exc).__name__) from exc
        if response.is_error:
            # O corpo do erro traz só o tipo (ex.: validation_error), sem dados do destinatário.
            name = response.json().get("name") if _is_json(response) else None
            raise EmailDeliveryError(f"resend {response.status_code} {name or ''}".strip())
        return response.json()["id"]


def gateway_from_settings(settings: Settings) -> ResendGateway | None:
    """None quando o envio não está configurado (sem chave ou sem remetente)."""
    if settings.resend_api_key is None or not settings.email_from:
        return None
    return ResendGateway(
        settings.resend_api_key.get_secret_value(), settings.email_from, settings.email_reply_to
    )


def _is_json(response: httpx.Response) -> bool:
    return response.headers.get("content-type", "").startswith("application/json")
