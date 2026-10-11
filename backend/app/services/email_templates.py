"""Textos dos e-mails do sistema: curtos, com o que aconteceu e o que fazer (Bloco 17).

Cada e-mail sai em HTML e em texto puro (clientes que não exibem HTML e filtros de spam).
"""

from datetime import datetime, timedelta, timezone
from html import escape

from app.integrations.resend_gateway import EmailMessage

# Horário de Brasília. Sem horário de verão desde 2019, o deslocamento é fixo, o que também
# dispensa a base de fusos horários (ausente no Windows).
BRASILIA = timezone(timedelta(hours=-3), "BRT")


def trial_ending(to: str, trial_ends_at: datetime, frontend_url: str) -> EmailMessage:
    ends = trial_ends_at.astimezone(BRASILIA)
    return _message(
        to=to,
        category="trial_ending",
        subject=f"Seu teste do GSeller termina em {ends:%d/%m}",
        lines=[
            f"Seu teste gratuito termina em {ends:%d/%m} às {ends:%H:%M}.",
            "Escolha um plano para continuar vendo lucro, margem e alertas dos seus produtos. "
            "Seus dados ficam guardados.",
        ],
        cta=("Ver planos", f"{frontend_url}/planos"),
    )


def trial_ended(to: str, frontend_url: str) -> EmailMessage:
    return _message(
        to=to,
        category="trial_ended",
        subject="Seu teste do GSeller terminou",
        lines=[
            "Seu teste gratuito terminou e o painel está bloqueado.",
            "Seus dados continuam guardados. Escolha um plano para voltar a usar.",
        ],
        cta=("Escolher plano", f"{frontend_url}/planos"),
    )


def _message(
    *, to: str, category: str, subject: str, lines: list[str], cta: tuple[str, str]
) -> EmailMessage:
    label, url = cta
    paragraphs = "".join(f'<p style="margin:0 0 16px">{escape(line)}</p>' for line in lines)
    html = (
        '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#1f2933;'
        'max-width:480px;margin:0 auto;padding:24px">'
        '<p style="margin:0 0 24px;font-weight:bold">GSeller</p>'
        f"{paragraphs}"
        f'<p style="margin:24px 0"><a href="{escape(url)}" style="background:#2563eb;color:#fff;'
        f'padding:12px 20px;border-radius:6px;text-decoration:none">{escape(label)}</a></p>'
        "</div>"
    )
    text = "\n\n".join([*lines, f"{label}: {url}"])
    return EmailMessage(to=to, subject=subject, html=html, text=text, category=category)
