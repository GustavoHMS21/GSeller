"""Logging estruturado (JSON) com mascaramento de segredos.

Regra do projeto: token, secret, senha ou Authorization nunca chegam ao log,
mesmo quando alguém registra um dicionário ou uma URL inteira por engano.
"""

import json
import logging
import re
import sys
from contextvars import ContextVar
from datetime import UTC, datetime
from typing import Any

request_id_ctx: ContextVar[str | None] = ContextVar("request_id", default=None)

REDACTED = "[REDACTED]"

SENSITIVE_KEYS = frozenset(
    {
        "access_token",
        "refresh_token",
        "id_token",
        "token",
        "authorization",
        "client_secret",
        "partner_key",
        "password",
        "secret",
        "code",
        "cookie",
        "set-cookie",
        "encryption_key",
        "api_key",
    }
)

# Padrões que podem aparecer dentro de mensagens livres.
_PATTERNS: tuple[tuple[re.Pattern[str], str], ...] = (
    (re.compile(r"(?i)\bbearer\s+[A-Za-z0-9\-._~+/]+=*"), f"Bearer {REDACTED}"),
    # Formato de token do Mercado Livre.
    (re.compile(r"\b(?:APP_USR|TG)-[A-Za-z0-9\-]{10,}"), REDACTED),
    # JWT (header.payload.signature).
    (re.compile(r"\beyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+"), REDACTED),
    # Parâmetros sensíveis em query strings e corpos form-encoded.
    (
        re.compile(
            r"(?i)\b(access_token|refresh_token|client_secret|code|password|token)=[^&\s\"']+"
        ),
        rf"\1={REDACTED}",
    ),
    # Credenciais embutidas em URLs de conexão (postgresql://user:senha@host).
    (re.compile(r"(?i)(\b[a-z][a-z0-9+.\-]*://[^:/\s@]+:)[^@\s]+@"), rf"\1{REDACTED}@"),
)


def redact_text(text: str) -> str:
    for pattern, replacement in _PATTERNS:
        text = pattern.sub(replacement, text)
    return text


def redact(value: Any) -> Any:
    """Mascara recursivamente chaves sensíveis e padrões de credenciais."""
    if isinstance(value, dict):
        return {
            key: REDACTED if str(key).lower() in SENSITIVE_KEYS else redact(item)
            for key, item in value.items()
        }
    if isinstance(value, list | tuple | set):
        return type(value)(redact(item) for item in value)
    if isinstance(value, str):
        return redact_text(value)
    return value


_RESERVED_ATTRS = frozenset(vars(logging.makeLogRecord({})).keys()) | {"message", "asctime"}


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "ts": datetime.fromtimestamp(record.created, tz=UTC).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "msg": redact_text(record.getMessage()),
        }
        request_id = request_id_ctx.get()
        if request_id:
            payload["request_id"] = request_id

        extras = {k: v for k, v in record.__dict__.items() if k not in _RESERVED_ATTRS}
        if extras:
            payload["extra"] = redact(extras)

        if record.exc_info:
            payload["exc"] = redact_text(self.formatException(record.exc_info))
        return json.dumps(payload, ensure_ascii=False, default=str)


def configure_logging(level: str = "INFO") -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())

    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(level.upper())

    # Logs de acesso do uvicorn incluem a query string completa; o middleware da
    # aplicação registra as requisições de forma sanitizada no lugar deles.
    logging.getLogger("uvicorn.access").disabled = True
    for name in ("uvicorn", "uvicorn.error"):
        logging.getLogger(name).handlers.clear()
        logging.getLogger(name).propagate = True
