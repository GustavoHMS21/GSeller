"""Contratos de entrada e saída. `extra="forbid"` impede mass assignment (ex.: enviar tenant_id)."""

import uuid
from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, StringConstraints

from app.models import Role
from app.services.access import AccessStatus

TenantName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=120)]


class TenantCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: TenantName


class TenantUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: TenantName


class TenantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    name: str
    created_at: datetime


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    email: str | None
    is_anonymous: bool


class AccessOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    status: AccessStatus
    trial_ends_at: datetime
    days_left: int


class MeOut(BaseModel):
    user: UserOut
    tenant: TenantOut | None
    role: Role | None
    access: AccessOut
