"""Validação dos tokens de acesso emitidos pelo provedor de identidade (Supabase Auth).

A API confia apenas no token assinado: o usuário é identificado pelo `sub` e o
tenant é derivado no banco, nunca recebido do frontend (Bloco 42.1).

As chaves públicas vêm do endpoint JWKS do provedor e ficam em cache, então a
validação acontece localmente, sem chamada externa por requisição. Somente
algoritmos assimétricos são aceitos: isso elimina ataques de confusão de chave
(token HS256 assinado com a chave pública) e o algoritmo "none".
"""

import asyncio
import time
from dataclasses import dataclass
from typing import Any, Protocol

import httpx
import jwt
from jwt import PyJWK

ALLOWED_ALGORITHMS = frozenset({"ES256", "RS256"})


class InvalidTokenError(Exception):
    """Token ausente, malformado, expirado ou com assinatura/claims inválidos."""


class KeysUnavailableError(Exception):
    """Não foi possível obter as chaves públicas do provedor."""


@dataclass(frozen=True)
class Principal:
    subject: str
    email: str | None
    is_anonymous: bool = False


class KeyProvider(Protocol):
    async def get_key(self, kid: str) -> PyJWK: ...


class JwksKeyProvider:
    """Busca e mantém em cache o JWKS do provedor.

    Um `kid` desconhecido força nova busca (rotação de chaves), limitada por
    `min_refresh_seconds` para que tokens forjados não gerem tempestade de requisições.
    """

    def __init__(
        self,
        url: str,
        ttl_seconds: float = 600,
        min_refresh_seconds: float = 30,
        timeout_seconds: float = 5,
    ) -> None:
        self._url = url
        self._ttl = ttl_seconds
        self._min_refresh = min_refresh_seconds
        self._timeout = timeout_seconds
        self._keys: dict[str, PyJWK] = {}
        self._fetched_at = float("-inf")
        self._lock = asyncio.Lock()

    async def get_key(self, kid: str) -> PyJWK:
        if self._needs_refresh(kid):
            async with self._lock:
                if self._needs_refresh(kid):
                    await self._refresh()
        key = self._keys.get(kid)
        if key is None:
            raise InvalidTokenError("unknown signing key")
        return key

    def _needs_refresh(self, kid: str) -> bool:
        age = time.monotonic() - self._fetched_at
        return age > self._ttl or (kid not in self._keys and age > self._min_refresh)

    async def _refresh(self) -> None:
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.get(self._url)
                response.raise_for_status()
                payload: dict[str, Any] = response.json()
        except (httpx.HTTPError, ValueError) as exc:
            raise KeysUnavailableError("could not fetch JWKS") from exc

        keys: dict[str, PyJWK] = {}
        for data in payload.get("keys", []):
            kid = data.get("kid")
            if not kid or data.get("use", "sig") != "sig":
                continue
            try:
                keys[kid] = PyJWK(data)
            except jwt.PyJWTError:
                continue
        self._keys = keys
        self._fetched_at = time.monotonic()


class TokenVerifier:
    def __init__(
        self,
        keys: KeyProvider,
        issuer: str,
        audience: str,
        leeway_seconds: int = 30,
    ) -> None:
        self._keys = keys
        self._issuer = issuer
        self._audience = audience
        self._leeway = leeway_seconds

    async def verify(self, token: str) -> Principal:
        try:
            header = jwt.get_unverified_header(token)
        except jwt.PyJWTError as exc:
            raise InvalidTokenError("malformed token") from exc

        algorithm = header.get("alg")
        kid = header.get("kid")
        if algorithm not in ALLOWED_ALGORITHMS or not isinstance(kid, str):
            raise InvalidTokenError("unsupported token header")

        key = await self._keys.get_key(kid)
        if key.algorithm_name != algorithm:
            raise InvalidTokenError("algorithm does not match signing key")

        try:
            claims = jwt.decode(
                token,
                key=key.key,
                algorithms=[algorithm],
                audience=self._audience,
                issuer=self._issuer,
                leeway=self._leeway,
                options={"require": ["exp", "iat", "sub", "iss", "aud"]},
            )
        except jwt.PyJWTError as exc:
            raise InvalidTokenError(type(exc).__name__) from exc

        if claims.get("role", "authenticated") != "authenticated":
            raise InvalidTokenError("unexpected role")
        # Sessões anônimas são aceitas aqui; o que elas podem fazer é decidido nas rotas.
        email = claims.get("email")
        return Principal(
            subject=str(claims["sub"]),
            email=email if isinstance(email, str) and email else None,
            is_anonymous=claims.get("is_anonymous") is True,
        )
