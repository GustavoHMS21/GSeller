"""Cria no Stripe os planos e o portal do cliente (Bloco 58, issue #35). Idempotente.

Uso (com STRIPE_SECRET_KEY no backend/.env):
    uv run python -m scripts.stripe_setup

Os preços são identificados por `lookup_key`; rodar de novo não duplica nada. Um preço do
Stripe não muda de valor: quando o valor daqui muda, o script cria outro preço no mesmo produto,
transfere a `lookup_key` e desativa o antigo. Quem já assina continua no valor antigo.
"""

import stripe

from app.core.config import get_settings
from app.integrations.stripe_gateway import PLAN_LOOKUP_KEYS

PLANS = {
    "start": ("GSeller Start", 9700, "Até 2.000 pedidos por mês, 5 lojas, 3 CNPJs"),
    "pro": ("GSeller Pro", 19700, "Até 6.000 pedidos por mês, 15 lojas, 8 CNPJs"),
    "scale": ("GSeller Scale", 49700, "Até 20.000 pedidos por mês, 50 lojas, 15 CNPJs"),
}


def main() -> None:
    key = get_settings().stripe_secret_key
    if key is None:
        raise SystemExit("STRIPE_SECRET_KEY ausente no backend/.env")
    client = stripe.StripeClient(key.get_secret_value())
    mode = "TESTE" if key.get_secret_value().startswith(("sk_test_", "rk_test_")) else "PRODUÇÃO"
    print(f"Stripe em modo {mode}")

    existing = {
        price.lookup_key: price
        for price in client.v1.prices.list(
            params={"lookup_keys": list(PLAN_LOOKUP_KEYS.values()), "active": True, "limit": 10}
        ).data
    }

    portal_products = []
    for plan, (name, amount, description) in PLANS.items():
        lookup_key = PLAN_LOOKUP_KEYS[plan]
        price = existing.get(lookup_key)
        if price is None:
            product = client.v1.products.create(
                params={"name": name, "description": description, "metadata": {"plan": plan}}
            )
            price = client.v1.prices.create(
                params={
                    "product": product.id,
                    "currency": "brl",
                    "unit_amount": amount,
                    "recurring": {"interval": "month"},
                    "lookup_key": lookup_key,
                    "metadata": {"plan": plan},
                }
            )
            print(f"criado   {lookup_key}: R$ {amount / 100:.2f}/mês ({price.id})")
        elif price.unit_amount != amount:
            old = price
            product = old.product if isinstance(old.product, str) else old.product.id
            price = client.v1.prices.create(
                params={
                    "product": product,
                    "currency": "brl",
                    "unit_amount": amount,
                    "recurring": {"interval": "month"},
                    "lookup_key": lookup_key,
                    "transfer_lookup_key": True,
                    "metadata": {"plan": plan},
                }
            )
            client.v1.prices.update(old.id, params={"active": False})
            print(
                f"alterado {lookup_key}: R$ {old.unit_amount / 100:.2f} -> "
                f"R$ {amount / 100:.2f}/mês ({price.id}; antigo {old.id} desativado)"
            )
        else:
            print(f"já existe {lookup_key}: R$ {price.unit_amount / 100:.2f}/mês ({price.id})")
        product_id = price.product if isinstance(price.product, str) else price.product.id
        portal_products.append({"product": product_id, "prices": [price.id]})

    configurations = client.v1.billing_portal.configurations.list(params={"limit": 10}).data
    default = next((config for config in configurations if config.is_default), None)
    if default is not None:
        # Mantém a troca de plano do portal apontando para os preços atuais.
        client.v1.billing_portal.configurations.update(
            default.id,
            params={"features": {"subscription_update": {"products": portal_products}}},
        )
        print("portal do cliente: preços da troca de plano atualizados")
        return
    client.v1.billing_portal.configurations.create(
        params={
            "business_profile": {"headline": "Gerencie sua assinatura do GSeller"},
            "features": {
                "invoice_history": {"enabled": True},
                "payment_method_update": {"enabled": True},
                "subscription_cancel": {"enabled": True, "mode": "at_period_end"},
                "subscription_update": {
                    "enabled": True,
                    "default_allowed_updates": ["price"],
                    "proration_behavior": "create_prorations",
                    "products": portal_products,
                },
            },
        }
    )
    print("portal do cliente: configuração padrão criada")


if __name__ == "__main__":
    main()
