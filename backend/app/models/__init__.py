"""Modelos do domínio. Importe aqui cada novo modelo para que o Alembic o detecte."""

from app.models.audit import AuditLog
from app.models.base import Base
from app.models.tenancy import Role, Tenant, TenantUser, User

__all__ = ["AuditLog", "Base", "Role", "Tenant", "TenantUser", "User"]
