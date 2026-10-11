"""Modelos do domínio. Importe aqui cada novo modelo para que o Alembic o detecte."""

from app.models.audit import AuditLog
from app.models.base import Base
from app.models.billing import StripeEvent, Subscription
from app.models.business import Company, Marketplace, Store, TaxRegime
from app.models.email import EmailDelivery
from app.models.tenancy import Role, Tenant, TenantUser, User

__all__ = [
    "AuditLog",
    "Base",
    "Company",
    "EmailDelivery",
    "Marketplace",
    "Role",
    "Store",
    "StripeEvent",
    "Subscription",
    "TaxRegime",
    "Tenant",
    "TenantUser",
    "User",
]
