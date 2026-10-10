"""Rotas de identidade e empresa. O tenant nunca vem da URL ou do corpo: é derivado da sessão."""

from datetime import UTC, datetime

from fastapi import APIRouter, status

from app.auth.deps import AccountContext, Context, OwnerContext, TenantContext
from app.schemas.tenancy import (
    AccessOut,
    MeOut,
    TenantCreate,
    TenantOut,
    TenantUpdate,
    UserOut,
)
from app.services import billing, tenancy
from app.services.access import evaluate_access, trial_end_from_first_access

router = APIRouter(prefix="/api", tags=["tenancy"])


@router.get("/me")
async def me(ctx: Context) -> MeOut:
    tenant = (
        await tenancy.get_tenant(ctx.session, ctx.tenant_id) if ctx.membership is not None else None
    )
    # Sem empresa (ex.: modo demonstração), o prazo conta do primeiro acesso do usuário.
    trial_ends_at = (
        tenant.trial_ends_at if tenant else trial_end_from_first_access(ctx.user.created_at)
    )
    subscription = await billing.get_subscription(ctx.session, tenant.id) if tenant else None
    paid = billing.has_active_subscription(subscription)
    access = evaluate_access(trial_ends_at, datetime.now(UTC), paid)
    return MeOut(
        user=UserOut.model_validate(ctx.user),
        tenant=TenantOut.model_validate(tenant) if tenant else None,
        role=ctx.role,
        access=AccessOut(
            status=access.status,
            trial_ends_at=access.trial_ends_at,
            days_left=access.days_left,
            plan=subscription.plan if paid and subscription else None,
        ),
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
