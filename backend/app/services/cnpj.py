"""Validação de CNPJ, numérico e alfanumérico (Receita Federal, a partir de 31/07/2026).

Os 12 primeiros caracteres podem ser letras ou números; os 2 últimos são dígitos
verificadores (módulo 11). Cada caractere vale o código ASCII menos 48: "0" a "9" valem
0 a 9 e "A" vale 17. Para CNPJ só com números, o resultado é o cálculo tradicional.
"""

import re

_FORMAT = re.compile(r"^[0-9A-Z]{12}[0-9]{2}$")
_SEPARATORS = re.compile(r"[.\-/\s]")


class InvalidCnpjError(ValueError):
    pass


def _check_digit(chars: str) -> int:
    weights = [2, 3, 4, 5, 6, 7, 8, 9] * 2
    total = sum((ord(c) - 48) * w for c, w in zip(reversed(chars), weights, strict=False))
    remainder = total % 11
    return 0 if remainder < 2 else 11 - remainder


def normalize_cnpj(value: str) -> str:
    """Remove pontuação, valida e devolve os 14 caracteres em maiúsculas."""
    cnpj = _SEPARATORS.sub("", value).upper()
    if not _FORMAT.match(cnpj) or len(set(cnpj)) == 1:
        raise InvalidCnpjError("CNPJ inválido.")
    first = _check_digit(cnpj[:12])
    second = _check_digit(cnpj[:12] + str(first))
    if cnpj[12:] != f"{first}{second}":
        raise InvalidCnpjError("CNPJ inválido.")
    return cnpj
