# Seller Intelligence

Plataforma de Financial Intelligence para sellers de Mercado Livre e Shopee.

**Fonte única de verdade do produto e da arquitetura:** [`MASTER_PLAN_SAAS_MARKETPLACE_MVP.md`](MASTER_PLAN_SAAS_MARKETPLACE_MVP.md).
Toda decisão nova deve ser registrada lá (Bloco 46).

## Estrutura

```text
.
├── backend/            API FastAPI (Python 3.13, uv, SQLAlchemy async, Alembic)
├── frontend/           Next.js (App Router, TypeScript, Tailwind)
├── infra/postgres/     Script de roles e bancos (local e CI)
├── .github/            CI, Dependabot e template de PR
└── docker-compose.yml  PostgreSQL local
```

## Pré-requisitos

- Docker (com Compose)
- [uv](https://docs.astral.sh/uv/) — gerencia Python e dependências do backend
- Node.js 24 + npm

## Rodando localmente

```bash
# 1. Banco (porta 5440, apenas em 127.0.0.1)
docker compose up -d

# 2. Backend — http://localhost:8000  (docs em /docs)
cd backend
cp .env.example .env            # preencha ENCRYPTION_KEY (comando no arquivo)
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload

# 3. Frontend — http://localhost:3000
cd frontend
cp .env.example .env.local     # preencha a publishable key do Supabase
npm install
npm run dev
```

## Cobrança (Stripe) em desenvolvimento

Use sempre chaves de **teste** (`sk_test_...`).

```bash
# 1. backend/.env: STRIPE_SECRET_KEY=sk_test_...
# 2. Cria os planos e o portal no Stripe (idempotente)
cd backend
uv run python -m scripts.stripe_setup

# 3. Em outro terminal: encaminha os webhooks do Stripe para a API local.
#    Copie o "webhook signing secret" (whsec_...) para STRIPE_WEBHOOK_SECRET no backend/.env
stripe listen --forward-to localhost:8000/api/billing/webhook --events checkout.session.completed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted
```

O `--events` é obrigatório nas versões atuais do Stripe CLI. A lista acima é a mesma que a API trata (`HANDLED_EVENTS` em `backend/app/services/billing.py`).

No checkout de teste, use o cartão `4242 4242 4242 4242`, com qualquer data futura e qualquer CVC.

## Qualidade

```bash
# backend
uv run ruff check . && uv run ruff format --check .
uv run pytest -q                 # testes marcados como `db` exigem o Postgres local

# frontend
npm run check && npm test && npm run typecheck && npm run build
```

Hooks locais opcionais, recomendados:

```bash
uvx pre-commit install
```

Isso ativa duas etapas:

- **antes do commit:** varredura de segredos (gitleaks), Ruff no backend e Biome no frontend;
- **na mensagem do commit:** commitlint, que exige Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `ci:`, `refactor:`, `perf:`, `security:`, `build:`, `revert:`), com escopo opcional, por exemplo `feat(auth): tela de login`. As regras ficam em `commitlint.config.mjs`.

O primeiro commit depois da instalação demora alguns minutos, porque cada ferramenta é baixada uma vez. O CI valida as mesmas regras nos commits e no título de todo PR, mesmo para quem não instalou os hooks.

## Regras de segurança do repositório

- Nunca versionar `.env` — apenas os arquivos `.env.example`.
- Segredos existem somente no backend. O build do frontend falha se uma variável
  `NEXT_PUBLIC_*` tiver nome de segredo.
- A API conecta ao banco com a role `app_runtime` (sem DDL, sem BYPASSRLS).
  Migrations usam `app_migrator`. Os testes em `backend/tests/test_db_privileges.py`
  garantem essa separação.
- Logs são JSON e passam por mascaramento de tokens, segredos e credenciais.
