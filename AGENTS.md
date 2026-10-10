# Instruções para agentes

Este repositório tem **um único documento de referência**:
[`MASTER_PLAN_SAAS_MARKETPLACE_MVP.md`](MASTER_PLAN_SAAS_MARKETPLACE_MVP.md).

Antes de qualquer tarefa, leia nele:

1. **Bloco 53** — regras obrigatórias de trabalho (Issue → Branch → PR com `Closes #N`, SOLID, quem executa o quê).
2. **Bloco 40** — princípios inegociáveis.
3. **Bloco 54** — motion e estados de carregamento (toda interface).
4. **Bloco 55** — observabilidade.
5. **Bloco 56** — quality gates.
6. **Bloco 33** — Definition of Done.

Resumo do que nunca fazer:

- fazer commit, push ou merge (o mantenedor executa; entregue os comandos);
- mencionar ferramentas de IA, assistentes ou modelos em código, commits, PRs ou issues;
- expor segredos no frontend ou registrar tokens em logs;
- receber `tenant_id` do cliente em vez de derivá-lo da sessão;
- tomar uma decisão nova sem registrá-la no Master Plan e no CHANGELOG.
