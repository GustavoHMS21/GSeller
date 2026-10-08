import os

# Valores padrão para a suíte; o CI e o ambiente local podem sobrescrever via env.
os.environ.setdefault("APP_ENV", "development")
os.environ.setdefault(
    "DATABASE_URL", "postgresql+asyncpg://app_runtime:runtime_dev@localhost:5440/seller_test"
)
os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")

import pytest
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text

from app.core.config import Settings, get_settings
from app.core.db import get_engine
from app.main import create_app


@pytest.fixture
def settings() -> Settings:
    return get_settings()


@pytest.fixture
def app(settings: Settings) -> FastAPI:
    return create_app(settings)


@pytest.fixture
async def client(app: FastAPI):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def require_db() -> None:
    try:
        async with get_engine().connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception:
        if os.environ.get("CI"):
            raise
        pytest.skip("PostgreSQL indisponível (rode `docker compose up -d`).")
    finally:
        await get_engine().dispose()
