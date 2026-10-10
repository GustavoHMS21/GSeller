"""Regras de usuários e tenants.

MVP: uma empresa (tenant) por usuário (Bloco 4.1). O modelo de dados já
suporta vários vínculos para permitir convites no futuro.
"""

import uuid

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.db_context import bind_context
from app.auth.tokens import Principal
from app.core.errors import ApiError
from app.models import Role, Tenant, TenantUser, User
from app.services.access import trial_end_from_first_access
from app.services.audit import record_audit


async def provision_user(session: AsyncSession, principal: Principal) -> User:
    """Garante o registro local do usuário autenticado. Idempotente e seguro sob concorrência."""
    await bind_context(session, auth_subject=principal.subject)
    user = await session.scalar(select(User).where(User.auth_subject == principal.subject))

    if user is None:
        user = User(
            id=uuid.uuid4(),
            auth_subject=principal.subject,
            email=principal.email,
            is_anonymous=principal.is_anonymous,
        )
        await bind_context(session, user_id=user.id)
        session.add(user)
        await session.flush()  # o usuário precisa existir antes do evento que o referencia
        record_audit(
            session,
            action="user.provisioned",
            resource_type="user",
            resource_id=user.id,
            actor_user_id=user.id,
            tenant_id=None,
        )
        try:
            await session.commit()
        except IntegrityError:
            # Outra requisição do mesmo usuário criou o registro primeiro.
            await session.rollback()
            user = await session.scalar(select(User).where(User.auth_subject == principal.subject))
            if user is None:
                raise
    elif user.is_anonymous and not principal.is_anonymous:
        # Conversão: mesmo usuário (mesmo prazo de trial), agora com conta (issue #33).
        await bind_context(session, user_id=user.id)
        user.is_anonymous = False
        user.email = principal.email
        record_audit(
            session,
            action="user.converted",
            resource_type="user",
            resource_id=user.id,
            actor_user_id=user.id,
            tenant_id=None,
        )
        await session.commit()
    elif principal.email and user.email != principal.email:
        user.email = principal.email
        await session.commit()

    await bind_context(session, user_id=user.id)
    return user


async def get_membership(session: AsyncSession, user_id: uuid.UUID) -> TenantUser | None:
    memberships = (
        await session.scalars(select(TenantUser).where(TenantUser.user_id == user_id))
    ).all()
    if len(memberships) > 1:
        raise ApiError(
            409,
            "multiple_tenants_unsupported",
            "Mais de uma empresa por usuário ainda não é suportado.",
        )
    return memberships[0] if memberships else None


async def create_tenant(session: AsyncSession, user: User, name: str) -> Tenant:
    # Trava o usuário para que duas requisições simultâneas não criem duas empresas.
    await session.execute(select(User.id).where(User.id == user.id).with_for_update())
    if await get_membership(session, user.id) is not None:
        raise ApiError(409, "tenant_already_exists", "Este usuário já possui uma empresa.")

    tenant = Tenant(
        id=uuid.uuid4(),
        name=name,
        trial_ends_at=trial_end_from_first_access(user.created_at),
    )
    await bind_context(session, tenant_id=tenant.id)
    session.add(tenant)
    await session.flush()
    session.add(TenantUser(tenant_id=tenant.id, user_id=user.id, role=Role.OWNER))
    record_audit(
        session,
        action="tenant.created",
        resource_type="tenant",
        resource_id=tenant.id,
        actor_user_id=user.id,
        tenant_id=tenant.id,
    )
    await session.commit()
    return tenant


async def rename_tenant(
    session: AsyncSession, user: User, tenant_id: uuid.UUID, name: str
) -> Tenant:
    tenant = await get_tenant(session, tenant_id)
    previous = tenant.name
    tenant.name = name
    record_audit(
        session,
        action="tenant.renamed",
        resource_type="tenant",
        resource_id=tenant.id,
        actor_user_id=user.id,
        tenant_id=tenant.id,
        metadata={"from": previous, "to": name},
    )
    await session.commit()
    return tenant


async def get_tenant(session: AsyncSession, tenant_id: uuid.UUID) -> Tenant:
    # Filtro explícito por tenant (Bloco 42.2); o RLS é a segunda camada.
    tenant = await session.scalar(select(Tenant).where(Tenant.id == tenant_id))
    if tenant is None:
        raise ApiError(404, "not_found", "Empresa não encontrada.")
    return tenant
