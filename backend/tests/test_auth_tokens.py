"""Validação de tokens: só tokens assinados pelo provedor, com claims corretas, são aceitos."""

import time

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import ec
from httpx import AsyncClient

from app.auth.tokens import InvalidTokenError, TokenVerifier
from tests.conftest import TokenFactory
from tests.support import SIGNING_KEY, TEST_KID


async def test_valid_token_returns_principal(verifier: TokenVerifier, make_token: TokenFactory):
    principal = await verifier.verify(make_token(sub="abc-123", email="a@example.com"))
    assert principal.subject == "abc-123"
    assert principal.email == "a@example.com"


@pytest.mark.parametrize(
    ("claims", "reason"),
    [
        ({"exp": int(time.time()) - 3600}, "expirado"),
        ({"aud": "outra-audiencia"}, "audiência errada"),
        ({"iss": "https://atacante.example.com/auth/v1"}, "emissor errado"),
        ({"role": "service_role"}, "role inesperada"),
        ({"is_anonymous": True}, "sessão anônima"),
    ],
)
async def test_rejects_invalid_claims(
    verifier: TokenVerifier, make_token: TokenFactory, claims: dict, reason: str
):
    with pytest.raises(InvalidTokenError):
        await verifier.verify(make_token(**claims))


async def test_rejects_missing_sub(verifier: TokenVerifier, make_token: TokenFactory):
    token = make_token()
    payload = jwt.decode(token, options={"verify_signature": False})
    del payload["sub"]
    forged = jwt.encode(payload, SIGNING_KEY, algorithm="ES256", headers={"kid": TEST_KID})
    with pytest.raises(InvalidTokenError):
        await verifier.verify(forged)


async def test_rejects_signature_from_another_key(
    verifier: TokenVerifier, make_token: TokenFactory
):
    attacker_key = ec.generate_private_key(ec.SECP256R1())
    with pytest.raises(InvalidTokenError):
        await verifier.verify(make_token(key=attacker_key))


async def test_rejects_unknown_kid(verifier: TokenVerifier, make_token: TokenFactory):
    with pytest.raises(InvalidTokenError):
        await verifier.verify(make_token(kid="kid-desconhecido"))


async def test_rejects_symmetric_algorithm(verifier: TokenVerifier):
    # Ataque de confusão de algoritmo: HS256 nunca é aceito.
    token = jwt.encode(
        {"sub": "x", "aud": "authenticated", "iss": "x", "exp": int(time.time()) + 60},
        "segredo-qualquer-com-tamanho-suficiente-32b",
        algorithm="HS256",
        headers={"kid": TEST_KID},
    )
    with pytest.raises(InvalidTokenError):
        await verifier.verify(token)


async def test_rejects_alg_none(verifier: TokenVerifier):
    token = jwt.encode({"sub": "x"}, key=None, algorithm="none", headers={"kid": TEST_KID})
    with pytest.raises(InvalidTokenError):
        await verifier.verify(token)


async def test_rejects_garbage(verifier: TokenVerifier):
    with pytest.raises(InvalidTokenError):
        await verifier.verify("isto.nao.e.um.jwt")


async def test_api_requires_bearer_token(client: AsyncClient):
    response = await client.get("/api/me")
    assert response.status_code == 401
    assert response.headers["WWW-Authenticate"] == "Bearer"
    assert response.json()["error"] == "unauthorized"


async def test_api_rejects_invalid_token(client: AsyncClient):
    response = await client.get("/api/me", headers={"Authorization": "Bearer abc.def.ghi"})
    assert response.status_code == 401


async def test_api_reports_missing_auth_configuration(settings, make_token: TokenFactory):
    from httpx import ASGITransport

    from app.main import create_app

    app = create_app(settings)  # sem override: settings de teste não têm JWKS configurado
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/me", headers={"Authorization": f"Bearer {make_token()}"})
    assert response.status_code == 503
    assert response.json()["error"] == "auth_not_configured"
