"""Apoio aos testes: identidade de teste com chave própria e tokens no formato do Supabase Auth."""

import json

from cryptography.hazmat.primitives.asymmetric import ec
from jwt import PyJWK
from jwt.algorithms import ECAlgorithm

from app.auth.tokens import InvalidTokenError

TEST_ISSUER = "https://test-project.supabase.co/auth/v1"
TEST_AUDIENCE = "authenticated"
TEST_KID = "test-key"
SIGNING_KEY = ec.generate_private_key(ec.SECP256R1())


def public_jwk(private_key: ec.EllipticCurvePrivateKey, kid: str) -> dict[str, str]:
    data = json.loads(ECAlgorithm.to_jwk(private_key.public_key()))
    data.update(kid=kid, alg="ES256", use="sig")
    return data


class StaticKeyProvider:
    def __init__(self, jwks: list[dict[str, str]]) -> None:
        self._keys = {item["kid"]: PyJWK(item) for item in jwks}

    async def get_key(self, kid: str) -> PyJWK:
        if kid not in self._keys:
            raise InvalidTokenError("unknown signing key")
        return self._keys[kid]
