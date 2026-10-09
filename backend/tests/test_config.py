import pytest
from pydantic import ValidationError

from app.core.config import Settings

# _env_file=None: os testes não podem depender do .env local de quem os executa.
BASE = {"_env_file": None, "database_url": "postgresql+asyncpg://u:p@localhost/db"}


def test_cors_wildcard_rejected() -> None:
    with pytest.raises(ValidationError, match="CORS_ORIGINS"):
        Settings(**BASE, cors_origins="*")


def test_cors_origins_parsed_from_comma_list() -> None:
    s = Settings(**BASE, cors_origins="http://localhost:3000, https://app.example.com")
    assert s.cors_origins == ["http://localhost:3000", "https://app.example.com"]


def test_production_requires_secrets() -> None:
    with pytest.raises(ValidationError, match="ENCRYPTION_KEY"):
        Settings(**BASE, app_env="production", cors_origins="https://app.example.com")


def test_production_rejects_plain_http_origin() -> None:
    with pytest.raises(ValidationError, match="HTTPS"):
        Settings(
            **BASE,
            app_env="production",
            cors_origins="http://app.example.com",
            encryption_key="k",
            auth_jwks_url="https://auth.example.com/jwks",
            auth_issuer="https://auth.example.com",
        )


def test_secrets_hidden_in_repr() -> None:
    s = Settings(**BASE, ml_client_secret="super-secret-value")
    assert "super-secret-value" not in repr(s)
    assert "super-secret-value" not in str(s.model_dump())
