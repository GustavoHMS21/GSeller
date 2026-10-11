"""Rotas de empresas (CNPJ) e lojas. Ver: qualquer membro; alterar: só o dono da conta."""

import uuid

from fastapi import APIRouter, status

from app.auth.deps import OwnerContext, TenantContext
from app.schemas.business import CompanyCreate, CompanyOut, StoreCreate, StoreOut
from app.services import business

router = APIRouter(prefix="/api", tags=["business"])


@router.get("/companies")
async def list_companies(ctx: TenantContext) -> list[CompanyOut]:
    rows = await business.list_companies(ctx.session, ctx.tenant_id)
    return [
        CompanyOut.model_validate(company).model_copy(
            update={"stores": [StoreOut.model_validate(s) for s in stores]}
        )
        for company, stores in rows
    ]


@router.post("/companies", status_code=status.HTTP_201_CREATED)
async def create_company(body: CompanyCreate, ctx: OwnerContext) -> CompanyOut:
    company = await business.create_company(
        ctx.session,
        ctx.user,
        ctx.tenant_id,
        cnpj=body.cnpj,
        legal_name=body.legal_name,
        tax_regime=body.tax_regime,
    )
    return CompanyOut.model_validate(company)


@router.delete("/companies/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id: uuid.UUID, ctx: OwnerContext) -> None:
    await business.delete_company(ctx.session, ctx.user, ctx.tenant_id, company_id)


@router.post("/stores", status_code=status.HTTP_201_CREATED)
async def create_store(body: StoreCreate, ctx: OwnerContext) -> StoreOut:
    store = await business.create_store(
        ctx.session,
        ctx.user,
        ctx.tenant_id,
        company_id=body.company_id,
        marketplace=body.marketplace,
        name=body.name,
    )
    return StoreOut.model_validate(store)


@router.delete("/stores/{store_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_store(store_id: uuid.UUID, ctx: OwnerContext) -> None:
    await business.delete_store(ctx.session, ctx.user, ctx.tenant_id, store_id)
