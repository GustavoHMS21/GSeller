"""Dependências de autenticação e autorização das rotas.

Fluxo (Bloco 42.1):
token assinado → Principal → usuário local → vínculo com tenant → contexto RLS.
"""

import logging
import uuid
from collections.abc import AsyncIterator
from dataclasses import dataclass
from datetime import UTC, datetime
from functools import lru_cache
from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.db_context import bind_context
from app.auth.tokens import (
    InvalidTokenError,
    JwksKeyProvider,
    KeysUnavailableError,
    Principal,
    TokenVerifier,
)
from app.core.config import get_settings
from app.core.db import get_sessionmaker
from app.core.errors import ApiError, unauthorized
from app.models import Role, TenantUser, User
from app.services import billing, tenancy
from app.services.access import AccessStatus, evaluate_access

logger = logging.getLogger(__name__)

_bearer = HTTPBearer(auto_error=False)


@lru_cache
def _build_verifier(jwks_url: str, issuer: str, audience: str) -> TokenVerifier:
    return TokenVerifier(JwksKeyProvider(jwks_url), issuer=issuer, audience=audience)


def get_token_verifier() -> TokenVerifier:
    settings = get_settings()
    if not settings.auth_jwks_url or not settings.auth_issuer:
        raise ApiError(503, "auth_not_configured", "Autenticação não configurada no servidor.")
    return _build_verifier(settings.auth_jwks_url, settings.auth_issuer, settings.auth_audience)


async def get_principal(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    verifier: Annotated[TokenVerifier, Depends(get_token_verifier)],
) -> Principal:
    if credentials is None:
        raise unauthorized()
    try:
        return await verifier.verify(credentials.credentials)
    except InvalidTokenError as exc:
        logger.info("token rejected", extra={"reason": str(exc)})
        raise unauthorized("Token inválido ou expirado.") from exc
    except KeysUnavailableError as exc:
        logger.warning("identity provider keys unavailable")
        raise ApiError(
            503, "auth_unavailable", "Autenticação temporariamente indisponível."
        ) from exc


@dataclass
class RequestContext:
    session: AsyncSession
    user: User
    membership: TenantUser | None

    @property
    def tenant_id(self) -> uuid.UUID:
        if self.membership is None:
            raise ApiError(403, "onboarding_required", "Crie sua empresa para continuar.")
        return self.membership.tenant_id

    @property
    def role(self) -> Role | None:
        return Role(self.membership.role) if self.membership else None


async def get_context(
    principal: Annotated[Principal, Depends(get_principal)],
) -> AsyncIterator[RequestContext]:
    async with get_sessionmaker()() as session:
        user = await tenancy.provision_user(session, principal)
        membership = await tenancy.get_membership(session, user.id)
        if membership is not None:
            await bind_context(session, tenant_id=membership.tenant_id)
        # Transações não confirmadas são descartadas ao fechar a sessão.
        yield RequestContext(session=session, user=user, membership=membership)


async def require_account(
    ctx: Annotated[RequestContext, Depends(get_context)],
) -> RequestContext:
    if ctx.user.is_anonymous:
        raise ApiError(403, "account_required", "Crie sua conta para continuar.")
    return ctx


async def require_tenant(
    ctx: Annotated[RequestContext, Depends(require_account)],
) -> RequestContext:
    _ = ctx.tenant_id  # levanta onboarding_required se não houver empresa
    return ctx


async def require_active_access(
    ctx: Annotated[RequestContext, Depends(require_tenant)],
) -> RequestContext:
    """Bloqueia as rotas da empresa depois do trial (402). `GET /api/me` não passa por aqui."""
    tenant = await tenancy.get_tenant(ctx.session, ctx.tenant_id)
    paid = billing.has_active_subscription(await billing.get_subscription(ctx.session, tenant.id))
    if (
        evaluate_access(tenant.trial_ends_at, datetime.now(UTC), paid).status
        is AccessStatus.EXPIRED
    ):
        raise ApiError(402, "trial_expired", "Seu período de teste terminou.")
    return ctx


def _ensure_owner(ctx: RequestContext) -> RequestContext:
    if ctx.role is not Role.OWNER:
        raise ApiError(403, "forbidden", "Apenas o proprietário pode fazer esta alteração.")
    return ctx


async def require_owner(
    ctx: Annotated[RequestContext, Depends(require_active_access)],
) -> RequestContext:
    return _ensure_owner(ctx)


async def require_billing_owner(
    ctx: Annotated[RequestContext, Depends(require_tenant)],
) -> RequestContext:
    """Dono da empresa, mesmo com o trial vencido: pagar não pode ficar bloqueado."""
    return _ensure_owner(ctx)


Context = Annotated[RequestContext, Depends(get_context)]
AccountContext = Annotated[RequestContext, Depends(require_account)]
TenantContext = Annotated[RequestContext, Depends(require_active_access)]
OwnerContext = Annotated[RequestContext, Depends(require_owner)]
BillingOwnerContext = Annotated[RequestContext, Depends(require_billing_owner)]
