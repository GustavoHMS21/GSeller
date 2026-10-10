import pytest
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient


async def test_security_headers_present(client: AsyncClient) -> None:
    response = await client.get("/health")
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-Frame-Options"] == "DENY"
    assert response.headers["Cache-Control"] == "no-store"


async def test_request_id_propagated_when_safe(client: AsyncClient) -> None:
    response = await client.get("/health", headers={"X-Request-ID": "abc12345-def"})
    assert response.headers["X-Request-ID"] == "abc12345-def"


async def test_request_id_rejected_when_unsafe(client: AsyncClient) -> None:
    malicious = "x\r\nInjected: header"
    response = await client.get("/health", headers={"X-Request-ID": "abc 12345 <script>"})
    assert response.headers["X-Request-ID"] != malicious
    assert " " not in response.headers["X-Request-ID"]


async def test_unhandled_error_does_not_leak_details(app: FastAPI) -> None:
    @app.get("/boom")
    async def boom() -> None:
        raise RuntimeError("segredo interno APP_USR-1234567890-abcdef")

    transport = ASGITransport(app=app, raise_app_exceptions=False)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/boom")

    assert response.status_code == 500
    body = response.json()
    assert body["error"] == "internal_error"
    assert body["request_id"]
    assert "segredo" not in response.text
    assert "Traceback" not in response.text


async def test_docs_disabled_outside_development(settings) -> None:
    from app.core.config import Environment
    from app.main import create_app

    prod_like = settings.model_copy(update={"app_env": Environment.STAGING})
    app = create_app(prod_like)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        assert (await ac.get("/docs")).status_code == 404
        assert (await ac.get("/openapi.json")).status_code == 404


@pytest.mark.db
async def test_readiness_with_database(client: AsyncClient, require_db: None) -> None:
    response = await client.get("/health/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "up"}
