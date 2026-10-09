"""Contexto de segurança da transação, lido pelas políticas de RLS do banco.

Os valores ficam em `session.info` e são aplicados com set_config(..., true),
ou seja, valem somente dentro da transação corrente. O listener reaplica o
contexto sempre que uma nova transação começa (por exemplo, depois de um
commit), então uma conexão devolvida ao pool nunca carrega o tenant anterior.
"""

from typing import Any

from sqlalchemy import event, text
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session, SessionTransaction

_SETTINGS = {
    "auth_subject": "app.auth_subject",
    "user_id": "app.user_id",
    "tenant_id": "app.tenant_id",
}
_FLAG = "rls_context"
_SET = text("SELECT set_config(:name, :value, true)")


def _apply(connection: Connection, info: dict[str, Any]) -> None:
    for key, setting in _SETTINGS.items():
        value = info.get(key)
        connection.execute(_SET, {"name": setting, "value": "" if value is None else str(value)})


@event.listens_for(Session, "after_begin")
def _on_begin(session: Session, _transaction: SessionTransaction, connection: Connection) -> None:
    if session.info.get(_FLAG):
        _apply(connection, session.info)


async def bind_context(session: AsyncSession, **values: object) -> None:
    """Atualiza o contexto (auth_subject, user_id, tenant_id) da sessão."""
    unknown = set(values) - set(_SETTINGS)
    if unknown:
        raise ValueError(f"Chaves de contexto desconhecidas: {unknown}")
    session.info.update(values)
    session.info[_FLAG] = True
    if session.in_transaction():
        connection = await session.connection()
        await connection.run_sync(lambda sync_conn: _apply(sync_conn, session.info))
