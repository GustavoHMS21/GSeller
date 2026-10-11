"""Empresas (CNPJ) e lojas da conta (Bloco 60, issue #49).

Toda consulta filtra pelo tenant da sessão (Bloco 42.2); o RLS e a FK composta das lojas
são a segunda e a terceira camada.
"""

import uuid

from sqlalchemy import exists, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import ApiError
from app.models import Company, Store, User
from app.services.audit import record_audit
from app.services.cnpj import InvalidCnpjError, normalize_cnpj


def _not_found() -> ApiError:
    return ApiError(404, "not_found", "Empresa ou loja não encontrada.")


async def list_companies(
    session: AsyncSession, tenant_id: uuid.UUID
) -> list[tuple[Company, list[Store]]]:
    companies = (
        await session.scalars(
            select(Company).where(Company.tenant_id == tenant_id).order_by(Company.created_at)
        )
    ).all()
    stores = (
        await session.scalars(
            select(Store).where(Store.tenant_id == tenant_id).order_by(Store.created_at)
        )
    ).all()
    return [(c, [s for s in stores if s.company_id == c.id]) for c in companies]


async def create_company(
    session: AsyncSession,
    user: User,
    tenant_id: uuid.UUID,
    *,
    cnpj: str,
    legal_name: str,
    tax_regime: str,
) -> Company:
    try:
        cnpj = normalize_cnpj(cnpj)
    except InvalidCnpjError as exc:
        raise ApiError(422, "invalid_cnpj", "CNPJ inválido. Confira os números.") from exc

    company = Company(tenant_id=tenant_id, cnpj=cnpj, legal_name=legal_name, tax_regime=tax_regime)
    session.add(company)
    try:
        await session.flush()
    except IntegrityError as exc:
        await session.rollback()
        raise ApiError(409, "cnpj_already_registered", "Este CNPJ já está na sua conta.") from exc
    record_audit(
        session,
        action="company.created",
        resource_type="company",
        resource_id=company.id,
        actor_user_id=user.id,
        tenant_id=tenant_id,
    )
    await session.commit()
    return company


async def delete_company(
    session: AsyncSession, user: User, tenant_id: uuid.UUID, company_id: uuid.UUID
) -> None:
    company = await session.scalar(
        select(Company).where(Company.id == company_id, Company.tenant_id == tenant_id)
    )
    if company is None:
        raise _not_found()
    if await session.scalar(select(exists().where(Store.company_id == company_id))):
        raise ApiError(409, "company_has_stores", "Remova ou mova as lojas desta empresa antes.")
    await session.delete(company)
    record_audit(
        session,
        action="company.deleted",
        resource_type="company",
        resource_id=company_id,
        actor_user_id=user.id,
        tenant_id=tenant_id,
    )
    await session.commit()


async def create_store(
    session: AsyncSession,
    user: User,
    tenant_id: uuid.UUID,
    *,
    company_id: uuid.UUID,
    marketplace: str,
    name: str,
) -> Store:
    # shortcut: sem limite de lojas por plano até a revisão de preços (#57) definir os valores.
    company = await session.scalar(
        select(Company.id).where(Company.id == company_id, Company.tenant_id == tenant_id)
    )
    if company is None:
        raise _not_found()
    store = Store(tenant_id=tenant_id, company_id=company_id, marketplace=marketplace, name=name)
    session.add(store)
    await session.flush()
    record_audit(
        session,
        action="store.created",
        resource_type="store",
        resource_id=store.id,
        actor_user_id=user.id,
        tenant_id=tenant_id,
        metadata={"marketplace": marketplace},
    )
    await session.commit()
    return store


async def delete_store(
    session: AsyncSession, user: User, tenant_id: uuid.UUID, store_id: uuid.UUID
) -> None:
    store = await session.scalar(
        select(Store).where(Store.id == store_id, Store.tenant_id == tenant_id)
    )
    if store is None:
        raise _not_found()
    await session.delete(store)
    record_audit(
        session,
        action="store.deleted",
        resource_type="store",
        resource_id=store_id,
        actor_user_id=user.id,
        tenant_id=tenant_id,
    )
    await session.commit()
