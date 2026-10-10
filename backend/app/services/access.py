"""Acesso ao produto: trial de 7 dias a partir do primeiro acesso (Bloco 58, issue #34)."""

import math
from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import StrEnum

TRIAL_DURATION = timedelta(days=7)
_DAY = timedelta(days=1)


class AccessStatus(StrEnum):
    TRIAL = "trial"
    ACTIVE = "active"
    EXPIRED = "expired"


@dataclass(frozen=True)
class Access:
    status: AccessStatus
    trial_ends_at: datetime
    days_left: int


def evaluate_access(
    trial_ends_at: datetime, now: datetime, has_active_subscription: bool = False
) -> Access:
    """Bloqueia no instante em que o trial termina; dias restantes arredondados para cima."""
    if has_active_subscription:
        return Access(AccessStatus.ACTIVE, trial_ends_at, 0)
    remaining = trial_ends_at - now
    if remaining <= timedelta(0):
        return Access(AccessStatus.EXPIRED, trial_ends_at, 0)
    return Access(AccessStatus.TRIAL, trial_ends_at, math.ceil(remaining / _DAY))


def trial_end_from_first_access(first_access_at: datetime) -> datetime:
    return first_access_at + TRIAL_DURATION
