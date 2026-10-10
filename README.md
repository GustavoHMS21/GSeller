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
