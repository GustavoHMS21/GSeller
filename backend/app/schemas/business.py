"""Contratos de empresas e lojas. `extra="forbid"` impede enviar tenant_id ou outros campos."""

import uuid
from typing import Annotated

from pydantic import BaseModel, ConfigDict, StringConstraints

from app.models import Marketplace, TaxRegime

LegalName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=150)]
StoreName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=80)]


class CompanyCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    # Validado e normalizado no serviço, para responder com um erro próprio (invalid_cnpj).
    cnpj: Annotated[str, StringConstraints(max_length=20)]
    legal_name: LegalName
    tax_regime: TaxRegime


class StoreCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    company_id: uuid.UUID
    marketplace: Marketplace
    name: StoreName


class StoreOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    company_id: uuid.UUID
    marketplace: Marketplace
    name: str


class CompanyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    cnpj: str
    legal_name: str
    tax_regime: TaxRegime
    stores: list[StoreOut] = []
