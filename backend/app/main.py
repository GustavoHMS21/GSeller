"""Ponto de entrada da API."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import health
from app.core.config import Settings, get_settings
from app.core.db import get_engine
from app.core.logging import configure_logging, request_id_ctx
from app.core.middleware import RequestContextMiddleware


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    yield
    await get_engine().dispose()


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    configure_logging(settings.log_level)

    # Documentação interativa apenas em development: não expor superfície da API em produção.
    docs_enabled = not settings.is_production_like
    app = FastAPI(
        title="Seller Intelligence API",
        version="0.1.0",
        lifespan=lifespan,
        docs_url="/docs" if docs_enabled else None,
        redoc_url=None,
        openapi_url="/openapi.json" if docs_enabled else None,
    )

    # O último middleware adicionado é o mais externo: CORS envolve tudo, inclusive
    # as respostas 500 geradas pelo RequestContextMiddleware.
    app.add_middleware(RequestContextMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["Authorization", "Content-Type", "Idempotency-Key", "X-Request-ID"],
        expose_headers=["X-Request-ID"],
        max_age=600,
    )

    @app.exception_handler(RequestValidationError)
    async def _validation_error(_: Request, exc: RequestValidationError) -> JSONResponse:
        # Devolve apenas onde e por que falhou, sem ecoar o valor enviado.
        details = [{"loc": err["loc"], "msg": err["msg"]} for err in exc.errors()]
        return JSONResponse(
            status_code=422,
            content={
                "error": "validation_error",
                "details": details,
                "request_id": request_id_ctx.get(),
            },
        )

    app.include_router(health.router)
    return app


app = create_app()
