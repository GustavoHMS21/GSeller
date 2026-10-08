"""Configuração da aplicação carregada exclusivamente de variáveis de ambiente.

Segredos usam SecretStr para não aparecerem em repr(), logs ou tracebacks.
Em staging/production a aplicação se recusa a subir com configuração insegura.
"""

from enum import StrEnum
from functools import lru_cache
from typing import Annotated

from pydantic import SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Environment(StrEnum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    app_env: Environment = Environment.DEVELOPMENT
    log_level: str = "INFO"

    database_url: SecretStr
    migrations_database_url: SecretStr | None = None
    db_pool_size: int = 5
    db_max_overflow: int = 5
    db_pool_timeout_seconds: int = 10
    db_statement_timeout_ms: int = 15_000

    cors_origins: Annotated[list[str], NoDecode] = []

    encryption_key: SecretStr | None = None

    auth_jwks_url: str | None = None
    auth_issuer: str | None = None
    auth_audience: str = "authenticated"

    ml_client_id: str | None = None
    ml_client_secret: SecretStr | None = None
    ml_redirect_uri: str | None = None

    shopee_partner_id: str | None = None
    shopee_partner_key: SecretStr | None = None

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def is_production_like(self) -> bool:
        return self.app_env in (Environment.STAGING, Environment.PRODUCTION)

    @model_validator(mode="after")
    def _enforce_safe_defaults(self) -> "Settings":
        if "*" in self.cors_origins:
            raise ValueError("CORS_ORIGINS não pode conter '*'.")

        if self.is_production_like:
            missing = [
                name
                for name, value in (
                    ("ENCRYPTION_KEY", self.encryption_key),
                    ("AUTH_JWKS_URL", self.auth_jwks_url),
                    ("AUTH_ISSUER", self.auth_issuer),
                )
                if not value
            ]
            if missing:
                raise ValueError(f"Variáveis obrigatórias ausentes: {', '.join(missing)}")
            if any(origin.startswith("http://") for origin in self.cors_origins):
                raise ValueError("Fora de development, CORS_ORIGINS deve usar apenas HTTPS.")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
