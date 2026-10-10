"""Rotas de identidade e empresa. O tenant nunca vem da URL ou do corpo: é derivado da sessão."""

from fastapi import APIRouter, status

from app.auth.deps import AccountContext, Context, OwnerContext, TenantContext
from app.schemas.tenancy import MeOut, TenantCreate, TenantOut, TenantUpdate, UserOut
from app.services import tenancy

router = APIRouter(prefix="/api", tags=["tenancy"])


@router.get("/me")
async def me(ctx: Context) -> MeOut:
    tenant = (
        await tenancy.get_tenant(ctx.session, ctx.tenant_id) if ctx.membership is not None else None
    )
    return MeOut(
        user=UserOut.model_validate(ctx.user),
        tenant=TenantOut.model_validate(tenant) if tenant else None,
        role=ctx.role,
    )


@router.post("/tenants", status_code=status.HTTP_201_CREATED)
async def create_tenant(body: TenantCreate, ctx: AccountContext) -> TenantOut:
    tenant = await tenancy.create_tenant(ctx.session, ctx.user, body.name)
    return TenantOut.model_validate(tenant)


@router.get("/tenant")
async def get_current_tenant(ctx: TenantContext) -> TenantOut:
    return TenantOut.model_validate(await tenancy.get_tenant(ctx.session, ctx.tenant_id))


@router.patch("/tenant")
async def rename_current_tenant(body: TenantUpdate, ctx: OwnerContext) -> TenantOut:
    tenant = await tenancy.rename_tenant(ctx.session, ctx.user, ctx.tenant_id, body.name)
    return TenantOut.model_validate(tenant)
