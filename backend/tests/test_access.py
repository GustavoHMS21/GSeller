"""Fronteiras do trial: o bloqueio começa no instante exato do fim do 7º dia (Bloco 58)."""

from datetime import UTC, datetime, timedelta

import pytest

from app.services.access import AccessStatus, evaluate_access, trial_end_from_first_access

FIRST_ACCESS = datetime(2026, 10, 5, 13, 0, tzinfo=UTC)  # segunda-feira, 10h em São Paulo
ENDS = trial_end_from_first_access(FIRST_ACCESS)


def test_trial_lasts_exactly_seven_days():
    assert ENDS - FIRST_ACCESS == timedelta(days=7)


@pytest.mark.parametrize(
    ("now", "status", "days_left"),
    [
        (FIRST_ACCESS, AccessStatus.TRIAL, 7),
        (FIRST_ACCESS + timedelta(days=6, hours=1), AccessStatus.TRIAL, 1),
        (ENDS - timedelta(seconds=1), AccessStatus.TRIAL, 1),
        (ENDS, AccessStatus.EXPIRED, 0),
        (ENDS + timedelta(days=30), AccessStatus.EXPIRED, 0),
    ],
)
def test_access_by_moment(now, status, days_left):
    access = evaluate_access(ENDS, now)
    assert (access.status, access.days_left) == (status, days_left)


def test_active_subscription_overrides_expired_trial():
    access = evaluate_access(ENDS, ENDS + timedelta(days=30), has_active_subscription=True)
    assert access.status is AccessStatus.ACTIVE
