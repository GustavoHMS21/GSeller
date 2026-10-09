import asyncio
import os
import time
from collections.abc import Callable
from pathlib import Path

# Valores padrão para a suíte; o CI e o ambiente local podem sobrescrever via env.
os.environ.setdefault("APP_ENV", "development")
os.environ.setdefault(
    "DATABASE_URL", "postgresql+asyncpg://app_runtime:runtime_dev@127.0.0.1:5440/seller_test"
)
os.environ.setdefault(
    "MIGRATIONS_DATABASE_URL",
    "postgresql+asyncpg://app_migrator:migrator_dev@127.0.0.1:5440/seller_test",
)
os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")

import jwt
import pytest
from alembic import command
from alembic.config import Config
from cryptography.hazmat.primitives.asymmetric import ec
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from app.auth.deps import get_token_verifier
from app.auth.tokens import TokenVerifier
from app.core.config import Settings, get_settings
from app.core.db import get_engine
from app.main import create_app
from tests.support import (
    SIGNING_KEY,
    TEST_AUDIENCE,
    TEST_ISSUER,
    TEST_KID,
    StaticKeyProvider,
    public_jwk,
)

BACKEND_DIR = Path(__file__).resolve().parents[1]

TokenFactory = Callable[..., str]


@pytest.fixture
def verifier() -> TokenVerifier:
    keys = StaticKeyProvider([public_jwk(SIGNING_KEY, TEST_KID)])
    return TokenVerifier(keys, issuer=TEST_ISSUER, audience=TEST_AUDIENCE)


@pytest.fixture
def make_token() -> TokenFactory:
    def factory(
        sub: str = "00000000-0000-0000-0000-00000000000a",
        email: str | None = "seller-a@example.com",
        *,
        key: ec.EllipticCurvePrivateKey = SIGNING_KEY,
        kid: str = TEST_KID,
        **claims: object,
    ) -> str:
        now = int(time.time())
        payload: dict[str, object] = {
            "sub": sub,
            "email": email,
            "aud": TEST_AUDIENCE,
            "iss": TEST_ISSUER,
            "role": "authenticated",
            "iat": now,
            "exp": now + 3600,
        }
        payload.update(claims)
        return jwt.encode(payload, key, algorithm="ES256", headers={"kid": kid})

    return factory


# --------------------------------------------------------------------------
# Aplicação
# --------------------------------------------------------------------------
@pytest.fixture
def settings() -> Settings:
    return get_settings()


@pytest.fixture
def app(settings: Settings, verifier: TokenVerifier) -> FastAPI:
    application = create_app(settings)
    application.dependency_overrides[get_token_verifier] = lambda: verifier
    return application


@pytest.fixture
async def client(app: FastAPI):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture(autouse=True)
async def _dispose_engine():
    # Cada teste roda em seu próprio event loop; conexões do pool não podem atravessá-los.
    yield
    await get_engine().dispose()


# --------------------------------------------------------------------------
# Banco de dados
# --------------------------------------------------------------------------
def _database_available() -> bool:
    async def ping() -> None:
        engine = create_async_engine(os.environ["MIGRATIONS_DATABASE_URL"])
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
        finally:
            await engine.dispose()

    try:
        asyncio.run(ping())
    except Exception:
        return False
    return True


@pytest.fixture(scope="session")
def migrated_db() -> None:
    if not _database_available():
        if os.environ.get("CI"):
            pytest.fail("PostgreSQL indisponível no CI.")
        pytest.skip("PostgreSQL indisponível (rode `docker compose up -d`).")
    command.upgrade(Config(str(BACKEND_DIR / "alembic.ini")), "head")


@pytest.fixture
async def db(migrated_db: None) -> None:
    """Banco migrado e vazio no início de cada teste."""
    engine = create_async_engine(os.environ["MIGRATIONS_DATABASE_URL"])
    async with engine.begin() as conn:
        await conn.execute(
            text("TRUNCATE app.audit_logs, app.tenant_users, app.tenants, app.users CASCADE")
        )
    await engine.dispose()


@pytest.fixture
async def require_db(migrated_db: None) -> None:
    """Compatibilidade: testes que só precisam do banco disponível."""
