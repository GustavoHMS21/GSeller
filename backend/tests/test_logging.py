import json
import logging

from app.core.logging import REDACTED, JsonFormatter, redact, redact_text


def test_redacts_sensitive_keys_recursively() -> None:
    data = {
        "access_token": "APP_USR-123",
        "nested": {"refresh_token": "abc", "safe": "ok"},
        "items": [{"client_secret": "x"}],
    }
    result = redact(data)
    assert result["access_token"] == REDACTED
    assert result["nested"]["refresh_token"] == REDACTED
    assert result["nested"]["safe"] == "ok"
    assert result["items"][0]["client_secret"] == REDACTED


def test_redacts_bearer_and_marketplace_tokens_in_text() -> None:
    text = "Authorization: Bearer abc.def.ghi token APP_USR-1234567890-123456-abcdef"
    result = redact_text(text)
    assert "abc.def.ghi" not in result
    assert "APP_USR-1234567890" not in result


def test_redacts_query_string_params() -> None:
    url = "https://api.example.com/oauth/token?code=TG-abc&client_secret=xyz&grant_type=x"
    result = redact_text(url)
    assert "TG-abc" not in result
    assert "xyz" not in result
    assert "grant_type=x" in result


def test_redacts_credentials_in_connection_urls() -> None:
    result = redact_text("postgresql+asyncpg://app_runtime:runtime_dev@localhost:5440/db")
    assert "runtime_dev" not in result
    assert "app_runtime" in result


def test_json_formatter_masks_extra_fields() -> None:
    record = logging.makeLogRecord(
        {"msg": "token exchange", "levelname": "INFO", "name": "t", "access_token": "APP_USR-x"}
    )
    payload = json.loads(JsonFormatter().format(record))
    assert payload["extra"]["access_token"] == REDACTED
