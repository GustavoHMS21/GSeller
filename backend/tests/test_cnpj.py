"""CNPJ numérico e alfanumérico (Receita Federal, a partir de 31/07/2026)."""

import pytest

from app.services.cnpj import InvalidCnpjError, normalize_cnpj


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        ("11.222.333/0001-81", "11222333000181"),
        # Exemplo oficial do SERPRO para o CNPJ alfanumérico.
        ("12.ABC.345/01DE-35", "12ABC34501DE35"),
        ("12abc34501de35", "12ABC34501DE35"),
    ],
)
def test_accepts_valid_cnpj(raw: str, expected: str):
    assert normalize_cnpj(raw) == expected


@pytest.mark.parametrize(
    "raw",
    [
        "11222333000180",  # dígito verificador errado
        "12ABC34501DE36",
        "00000000000000",  # passa no módulo 11, mas não existe
        "1122233300018",  # curto
        "12ABC34501DE3A",  # letra no dígito verificador
    ],
)
def test_rejects_invalid_cnpj(raw: str):
    with pytest.raises(InvalidCnpjError):
        normalize_cnpj(raw)
