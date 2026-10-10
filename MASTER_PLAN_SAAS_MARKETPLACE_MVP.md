# MASTER PLAN — SaaS de Inteligência para Sellers
## Mercado Livre + Shopee | MVP em 14 dias

> **Status:** Documento mestre vivo  
> **Versão:** 0.11 — commitlint (issue #13)  
> **Agentes de IA de qualquer modelo:** antes de qualquer tarefa, leia o **Bloco 53** (regras obrigatórias de trabalho).  
> **Objetivo:** colocar um MVP funcional nas mãos de usuários reais em até 14 dias.  
> **Princípio central:** não construir “mais um ERP” nem competir com os dashboards nativos dos marketplaces. Construir uma camada de **Financial Intelligence + visão multicanal + priorização de ações**, transformando dados operacionais em decisões econômicas confiáveis.

---

# 0. COMO USAR ESTE DOCUMENTO

Este arquivo é a referência principal do projeto. Toda nova ideia deve ser classificada antes de virar desenvolvimento:

1. É necessária para o MVP de 14 dias?
2. Resolve diretamente uma dor validada?
3. É necessária para segurança, LGPD ou integridade financeira?
4. Temos dados confiáveis para entregar essa funcionalidade?
5. Conseguimos testar com usuário real dentro do prazo?

Se a resposta for **não**, a funcionalidade vai para o backlog pós-MVP.

## Regra de ouro

> **Dados → Diagnóstico → Prioridade → Ação.**

O produto não deve existir apenas para mostrar números. Ele deve ajudar o micro e pequeno seller a entender:

- o que está acontecendo;
- onde ele está ganhando dinheiro;
- onde está perdendo;
- qual produto precisa de atenção;
- qual marketplace está funcionando melhor;
- qual ação deve investigar primeiro.

---

# BLOCO 1 — VISÃO DO PRODUTO

## 1.1 Problema central

Micro e pequenos vendedores de marketplaces frequentemente operam com informações espalhadas entre:

- painel do Mercado Livre;
- painel da Shopee;
- central de publicidade;
- planilhas;
- sistema de estoque;
- calculadoras;
- informações de custo;
- vídeos e conteúdos sobre SEO;
- ferramentas de IA;
- conhecimento informal.

O problema não é apenas “falta de dados”.

O problema é:

> **existem dados demais, em lugares diferentes, e pouca capacidade de transformá-los em uma decisão simples.**

### Pergunta que nosso produto deve responder

> **“O que eu preciso olhar ou corrigir hoje para vender melhor e proteger minha margem?”**

---

## 1.2 Posicionamento inicial

### Não somos

- ERP completo;
- emissor fiscal;
- sistema contábil;
- ferramenta de gestão empresarial genérica;
- agência de marketing;
- “IA que descobriu o algoritmo do marketplace”;
- robô que altera anúncios automaticamente;
- substituto do Mercado Livre ou Shopee.

### Somos

> **Uma plataforma de Financial Intelligence para sellers de marketplaces.**

Proposta simples:

> **Conecte sua operação, descubra onde cada produto realmente contribui para o resultado e saiba o que merece atenção primeiro.**

Possível evolução de posicionamento:

> **Seu analista de marketplace.**

---

## 1.3 North Star do produto

O usuário deve conseguir abrir o sistema e, em poucos segundos, responder:

1. Quanto vendi?
2. Quanto aproximadamente sobrou?
3. Qual marketplace está melhor?
4. Qual produto está melhor?
5. Qual produto está pior?
6. O que precisa da minha atenção?
7. Por quê?

---

# BLOCO 2 — ICP E HIPÓTESES

## 2.1 ICP inicial — seller pequeno profissionalizado

Não mirar “qualquer microempreendedor”. O ICP inicial deve ter **dor, volume de dados e consequência financeira suficiente para pagar**.

Focar em seller que, idealmente:

- vende em Mercado Livre e já considera ou utiliza outro marketplace;
- possui aproximadamente **20 a 500 SKUs**;
- processa algo na ordem de **100 a 2.000 pedidos/mês**;
- já possui histórico de vendas;
- investe em Ads ou toma decisões frequentes de preço/promoção;
- conhece ao menos parte do custo dos produtos;
- usa planilha, ERP e/ou múltiplos painéis para fechar a visão do negócio;
- não possui analista de dados dedicado;
- o owner/gestor ainda participa diretamente das decisões.

### ICP prioritário para o piloto

Seller que:

- tenha Mercado Livre ativo;
- possua pelo menos 20 produtos ou variações relevantes;
- consiga informar custo unitário de parte do catálogo;
- já tenha vivenciado dúvida sobre margem, Ads, preço ou rentabilidade;
- aceite conectar a conta via API oficial em modo **read-only / menor privilégio**;
- esteja disposto a testar e discutir preço real da solução.

### Anti-ICP inicial

Evitar priorizar no primeiro ciclo:

- seller com pouquíssimos pedidos e baixa recorrência;
- empresa com time próprio de BI/FP&A e stack analítica madura;
- operação que exige fiscal/contábil completo para considerar qualquer ferramenta útil;
- cliente que só valoriza automação de publicação/alteração de anúncios.

---

## 2.2 Hipóteses a validar

### H1 — Fragmentação
O seller perde tempo alternando entre plataformas e planilhas.

### H2 — Margem
O seller conhece faturamento melhor do que conhece sua margem real.

### H3 — Priorização
O seller sabe que alguns produtos estão ruins, mas não sabe onde investigar primeiro.

### H4 — Comparação
O seller tem dificuldade para comparar o mesmo SKU no Mercado Livre e na Shopee.

### H5 — Marketing
O seller consome conteúdo sobre título, SEO, Ads e “algoritmo”, mas tem dificuldade de relacionar esse conhecimento aos próprios dados.

### H6 — Disposição a pagar
O seller pagaria por uma ferramenta que reduza perda de margem, revele diferença econômica entre canais e economize tempo de análise. A validação exige **preço concreto**, não apenas “eu usaria”.

### H7 — Financial Truth
O seller valoriza mais uma visão confiável de contribuição/margem do que mais um dashboard de métricas nativas.

### H8 — Cross-channel
Cruzar economics entre marketplaces gera valor que os painéis isolados não entregam de forma suficiente.

### H9 — Prioridade de ação
O seller prefere uma fila curta de problemas econômicos priorizados a dezenas de gráficos sem recomendação de investigação.

---

# BLOCO 3 — PROPOSTA DE VALOR

## 3.1 Job to be Done

> Quando eu estiver administrando meus produtos em diferentes marketplaces, quero saber rapidamente quais produtos estão performando bem ou mal e qual é o impacto financeiro, para conseguir decidir onde devo agir primeiro.

## 3.2 Diferencial pretendido

Não competir inicialmente por quantidade de recursos.

Competir por:

- simplicidade;
- clareza;
- comparação;
- diagnóstico;
- contexto financeiro;
- priorização;
- confiança.

### Não mostrar apenas

> “Produto A vendeu R$ 15.000.”

### Mostrar

> “Produto A vendeu R$ 15.000, mas sua margem estimada caiu de 22% para 13%. O principal sinal observado foi o aumento do gasto com publicidade.”

---

# BLOCO 4 — ESCOPO DO MVP

## 4.1 O que entra no MVP

### Conta e organização

- [ ] Cadastro/login.
- [ ] Uma organização/empresa por usuário inicialmente.
- [ ] Tenant ID desde a primeira versão.
- [ ] Onboarding simples.

### Integrações

- [ ] Conectar Mercado Livre em **modo read-only / menor privilégio possível**.
- [ ] Shopee fica **P1 e fora do caminho crítico dos 14 dias**; entra no piloto apenas se acesso/permissões estiverem prontos sem comprometer o núcleo.
- [ ] Sincronização inicial.
- [ ] Sincronização incremental.
- [ ] Status da integração.
- [ ] Reconectar conta quando necessário.

### Produtos

- [ ] Importar anúncios/produtos.
- [ ] Criar conceito de **Produto Mestre**.
- [ ] Prever **Produto → Variante → Listing → Variante do marketplace** no schema.
- [ ] Vincular anúncio/variação do Mercado Livre.
- [ ] Vincular Shopee quando P1 estiver disponível.
- [ ] Permitir correção manual do vínculo.
- [ ] Armazenar SKU quando disponível.

### Vendas

- [ ] Importar pedidos.
- [ ] Venda operacional/pedido pago, separada de receita atribuída a Ads.
- [ ] Status de cancelamento, devolução e reembolso quando disponível.
- [ ] Receita bruta.
- [ ] Quantidade vendida.
- [ ] Ticket médio.
- [ ] Receita por marketplace.
- [ ] Receita por produto.
- [ ] Comparação de períodos.

### Custos e margem

- [ ] Custo unitário informado pelo seller.
- [ ] Comissão/taxas disponíveis na origem.
- [ ] Frete quando disponível.
- [ ] Descontos relevantes quando identificáveis.
- [ ] Ads quando a API/permissão permitir.
- [ ] Imposto como configuração opcional/estimada.
- [ ] Margem de contribuição estimada.
- [ ] Resultado estimado por produto/variação.
- [ ] Ajustes por cancelamentos, devoluções e reembolsos quando disponíveis.
- [ ] **Data lineage**: origem de cada componente financeiro e data da última atualização.
- [ ] Transparência da fórmula.

### Dashboard

- [ ] Faturamento.
- [ ] Resultado estimado.
- [ ] Margem estimada.
- [ ] Pedidos.
- [ ] Ticket médio.
- [ ] Visão Mercado Livre no piloto; comparação Mercado Livre x Shopee somente quando a integração Shopee estiver confiável.
- [ ] Top produtos.
- [ ] Piores produtos.
- [ ] Produtos que precisam de atenção.

### Insights

- [ ] Regras determinísticas iniciais.
- [ ] Health Score simples.
- [ ] Alertas.
- [ ] Explicação do motivo do alerta.
- [ ] Próxima ação sugerida como **investigação**, não como verdade absoluta.

---

## 4.2 O que NÃO entra nas primeiras duas semanas

- [ ] NF-e.
- [ ] Contabilidade.
- [ ] Conciliação financeira completa.
- [ ] Compras e fornecedores.
- [ ] WMS.
- [ ] Gestão logística completa.
- [ ] CRM.
- [ ] Atendimento.
- [ ] Chatbot.
- [ ] Agentes autônomos.
- [ ] Alteração automática de anúncios.
- [ ] Alteração automática de preço.
- [ ] Criação automática de campanhas.
- [ ] Gestão completa de estoque.
- [ ] Forecast avançado.
- [ ] Recomendação gerada exclusivamente por LLM.
- [ ] BI customizado.
- [ ] Aplicativo mobile nativo.
- [ ] Integração com dezenas de marketplaces.
- [ ] n8n.

### Regra

Qualquer item dessa lista só entra antes do lançamento se bloquear diretamente:

- segurança;
- LGPD;
- conexão das plataformas;
- cálculo correto;
- experiência principal.

---

# BLOCO 5 — FLUXO PRINCIPAL DO USUÁRIO

```text
Cadastro
   ↓
Criar empresa
   ↓
Conectar marketplace
   ↓
Autorizar acesso
   ↓
Sincronizar produtos
   ↓
Sincronizar pedidos
   ↓
Relacionar produtos equivalentes
   ↓
Informar custos
   ↓
Calcular indicadores
   ↓
Dashboard
   ↓
Produtos que precisam de atenção
   ↓
Abrir produto
   ↓
Entender o motivo
   ↓
Tomar uma decisão
```

---

# BLOCO 6 — TELAS DO MVP

## Tela 1 — Login / Cadastro

Objetivo:

- entrada simples;
- recuperação de conta;
- nenhuma informação técnica desnecessária.

## Tela 2 — Onboarding

Passos:

1. Nome da operação.
2. Marketplaces utilizados.
3. Conectar Mercado Livre.
4. Conectar Shopee.
5. Sincronizar.
6. Cadastrar/importar custos.
7. Acessar dashboard.

### Estado da integração

Cada conexão deve ter:

- Conectado;
- Sincronizando;
- Requer atenção;
- Token expirado/revogado;
- Erro;
- Desconectado.

## Tela 3 — Dashboard

### Header

- período;
- última sincronização;
- status das integrações.

### KPIs

- Receita;
- Resultado estimado;
- Margem estimada;
- Pedidos;
- Ticket médio.

### Comparação de marketplace

- Mercado Livre;
- Shopee.

### Produtos

- Top receita;
- Top margem;
- Maior queda;
- Maior crescimento;
- Produtos críticos.

### “Precisa da sua atenção”

Card principal do produto.

Exemplo:

> 🔴 Produto X  
> Conversão caiu 28% nos últimos 14 dias.  
> Visitas permaneceram praticamente estáveis.  
> O preço aumentou 9% no mesmo período.  
> **Investigue competitividade de preço e oferta.**

## Tela 4 — Produtos

Tabela:

| Produto | SKU | ML | Shopee | Receita | Margem | Pedidos | Saúde |
|---|---|---:|---:|---:|---:|---:|---|

Filtros:

- marketplace;
- período;
- saúde;
- margem;
- crescimento/queda;
- categoria.

## Tela 5 — Detalhe do Produto

### Produto Mestre

- nome;
- SKU;
- custo;
- estoque opcional;
- anúncios relacionados.

### Por marketplace

- preço;
- receita;
- unidades;
- visitas quando disponível;
- CTR quando aplicável;
- conversão;
- Ads;
- margem.

### Comparação

> “Este produto performa melhor em X.”

Sempre mostrar:

- dado utilizado;
- período;
- fórmula;
- nível de confiança quando houver inferência.

## Tela 6 — Custos

Essencial para evitar “lucro fictício”.

Campos:

- SKU;
- custo unitário;
- imposto estimado;
- custo adicional opcional;
- vigência do custo.

### Importante

O custo deve ser versionado por período.

Nunca sobrescrever silenciosamente custo histórico.

---

# BLOCO 7 — MODELO DE DADOS

## 7.1 Conceito principal

### Produto não é anúncio — e produto também não é necessariamente SKU final.

O schema deve nascer preparado para variações e kits, mesmo que o MVP não implemente toda a complexidade de bundles.

```text
Produto Mestre
CAMISETA OVERSIZED
       │
       ├── Variante P / PRETA
       │      ├── Mercado Livre listing/variation
       │      └── Shopee item/model
       │
       ├── Variante M / PRETA
       │      ├── Mercado Livre listing/variation
       │      └── Shopee item/model
       │
       └── Variante G / PRETA
```

### Regra

A unidade econômica deve ser o nível mais baixo em que custo, preço, quantidade ou margem possam divergir.

## 7.2 Entidades principais

### tenants

```text
id
name
created_at
updated_at
```

### users

```text
id
email
name
created_at
```

### tenant_users

```text
tenant_id
user_id
role
created_at
```

### marketplace_connections

```text
id
tenant_id
provider
external_shop_id
status
access_token_encrypted
refresh_token_encrypted
token_expires_at
scopes
last_sync_at
created_at
updated_at
```

> Tokens nunca são retornados para o frontend.

### master_products

```text
id
tenant_id
internal_sku
name
status
created_at
updated_at
```

### master_product_variants

```text
id
tenant_id
master_product_id
internal_sku
name
attributes_json
status
created_at
updated_at
```

### marketplace_listings

```text
id
tenant_id
master_product_id
connection_id
provider
external_listing_id
title
status
currency
raw_metadata_json
created_at
updated_at
```

### marketplace_listing_variants

```text
id
tenant_id
marketplace_listing_id
master_product_variant_id
external_variant_id
external_sku
price
attributes_json
status
created_at
updated_at
```

### orders

```text
id
tenant_id
connection_id
provider
external_order_id
status
created_at_marketplace
gross_amount
discount_amount
shipping_amount
fee_amount
currency
synced_at
```

### order_items

```text
id
tenant_id
order_id
marketplace_listing_id
marketplace_listing_variant_id
master_product_id
master_product_variant_id
quantity
unit_price
gross_amount
fee_amount
discount_amount
shipping_amount
```

### product_cost_history

```text
id
tenant_id
master_product_id
master_product_variant_id
unit_cost
tax_percent
additional_unit_cost
valid_from
valid_to
created_at
```

### financial_adjustments

Representa eventos financeiros posteriores ao pedido.

```text
id
tenant_id
order_id
order_item_id
provider
external_adjustment_id
type              # refund | return | cancellation | fee_adjustment | shipping_adjustment | other
amount
currency
effective_at
raw_json
created_at
```

### Regra de modelagem

Nunca sobrescrever silenciosamente o passado financeiro. Eventos posteriores devem ser registrados como ajustes ou versões, preservando trilha de auditoria.

### ad_metrics_daily

```text
id
tenant_id
connection_id
marketplace_listing_id
date
impressions
clicks
ctr
cpc
cost
conversion_rate
ad_revenue
roas
raw_json
```

### product_metrics_daily

```text
id
tenant_id
master_product_id
provider
date
revenue
orders
units
visits
conversion_rate
estimated_margin
estimated_result
```

### insights

```text
id
tenant_id
master_product_id
type
severity
rule_id
title
description
evidence_json
recommended_investigation
status
generated_at
```

### audit_logs

```text
id
tenant_id
actor_user_id
action
resource_type
resource_id
metadata
security_metadata
created_at
```

---

# BLOCO 8 — NORMALIZAÇÃO

Cada marketplace possui terminologia e estruturas diferentes.

Criar uma camada interna comum.

### Nunca acoplar o dashboard diretamente ao JSON do marketplace.

```text
Mercado Livre API ──┐
                    ├─> Connector
Shopee API ─────────┘
                         ↓
                    Normalizer
                         ↓
                 Internal Domain Model
                         ↓
                     Database
                         ↓
                Analytics / Dashboard
```

### Benefício

Se amanhã adicionarmos Amazon:

```text
Amazon Connector
      ↓
Mesmo modelo interno
```

Sem reconstruir todo o produto.

---

# BLOCO 9 — FINANCIAL TRUTH ENGINE

A Financial Engine é o núcleo do produto. O objetivo não é produzir “lucro contábil”, e sim uma visão econômica rastreável e honesta do que aconteceu com cada produto/variação.

## 9.1 Quatro conceitos que nunca podem ser misturados

### 1. Venda operacional

Pedido realizado/pago conforme a definição do marketplace.

### 2. Receita atribuída

Receita que uma plataforma atribui a Ads/campanha. Pode seguir janela e definição própria da plataforma e **não é automaticamente receita realizada**.

### 3. Resultado estimado

```text
Receita elegível do pedido
- desconto financiado pelo seller
- comissão/taxa do marketplace
- tarifa aplicável
- frete assumido pelo seller
- gasto de Ads atribuível conforme regra documentada
- custo do produto/variante
- imposto estimado configurado
- outros custos variáveis
± ajustes conhecidos
= resultado de contribuição estimado
```

### 4. Resultado conciliado

Estado futuro, somente quando tivermos dados suficientes para reconciliar pagamentos, ajustes, devoluções e eventos financeiros posteriores com confiança.

No MVP, não prometer conciliação completa.

## 9.2 Cancelamento, devolução e reembolso

O motor deve ser orientado a eventos. Um pedido pode mudar economicamente depois da venda.

```text
Pedido
  ↓
Pagamento
  ↓
Taxas / frete / descontos
  ↓
Possível cancelamento
  ↓
Possível devolução
  ↓
Possível reembolso
  ↓
Ajustes posteriores
```

Regras:

- não tratar métrica publicitária como receita realizada;
- não apagar o valor original do pedido;
- registrar ajustes posteriores;
- recalcular o resultado de forma idempotente;
- exibir a data da última atualização financeira.

## 9.3 Data lineage obrigatório

Para cada componente relevante, guardar ou conseguir explicar:

- origem do dado;
- endpoint/fonte;
- timestamp de captura;
- status do pedido;
- regra/fórmula aplicada;
- se o valor é real, informado pelo usuário ou estimado.

A interface deve permitir “Como calculamos?”.

## 9.4 Linguagem do produto

Usar:

- **Resultado estimado**;
- **Margem estimada**;
- **Custos considerados**;
- **Receita atribuída a Ads** quando for o caso.

Evitar:

- lucro líquido contábil;
- lucro fiscal;
- resultado contábil definitivo;
- ROI genérico sem definição.

## 9.5 ROI ≠ ROAS ≠ margem

### ROAS

```text
Receita atribuída à publicidade / gasto publicitário
```

### Margem

```text
Resultado estimado / Receita elegível
```

### ROI

Depende da definição de investimento. No MVP, não exibir “ROI” sem definição explícita.

## 9.6 Golden tests financeiros

Manter cenários conhecidos com:

- pedido normal;
- desconto;
- frete;
- Ads;
- cancelamento;
- devolução parcial;
- reembolso total;
- mudança de custo por vigência;
- múltiplas variações do mesmo produto.

Qualquer mudança que altere resultado esperado deve falhar no CI até ser revisada.

---

# BLOCO 10 — ANALYTICS ENGINE

## 10.1 Princípio

Antes de usar LLM:

> **Criar regras explicáveis.**

## 10.2 Exemplos de regras

### R001 — Conversão caiu

```text
SE
conversão_14d < conversão_14d_anterior * 0.80
E
visitas mantiveram variação entre -10% e +10%

ENTÃO
severity = warning
diagnóstico = "Queda relevante de conversão com tráfego relativamente estável."
investigar = [
  "preço",
  "frete",
  "prazo",
  "avaliações",
  "qualidade do anúncio",
  "concorrência"
]
```

### R002 — Cresceu faturamento, perdeu margem

```text
SE
receita cresceu > 15%
E
margem caiu > 5 pontos percentuais

ENTÃO
"Suas vendas cresceram, mas o ganho por venda caiu."
```

### R003 — Marketplace A performa melhor

```text
SE
mesmo Produto Mestre existe em ML e Shopee
E
volume mínimo de dados foi atingido

ENTÃO
comparar:
- receita
- unidades
- conversão
- margem
- investimento publicitário
```

Não concluir automaticamente que uma plataforma é “melhor” usando apenas faturamento.

### R006 — Sem custo cadastrado (qualidade de dados)

```text
SE
produto teve vendas no período
E
não possui custo vigente

ENTÃO
severity = warning
não exibir resultado nem margem do produto
orientar cadastro do custo
```

Adicionada na v0.5: sem custo, qualquer "lucro" exibido seria fictício.

### R004 — Produto vende, mas quase não contribui

```text
SE
unidades > percentil operacional
E
margem < limite_minimo_configurado

ENTÃO
severity = critical
```

### R005 — Ads pressionando resultado

```text
SE
gasto_ads aumentou significativamente
E
receita atribuída não acompanhou
E
margem deteriorou

ENTÃO
alertar sobre eficiência de Ads
```

---

# BLOCO 11 — HEALTH SCORE

Escala:

```text
80–100  🟢 Saudável
60–79   🟡 Atenção
0–59    🔴 Crítico
```

### Componentes iniciais

- tendência de receita;
- margem;
- conversão quando disponível;
- eficiência de Ads;
- estabilidade operacional.

### Importante

O Health Score deve ser:

- reproduzível;
- explicável;
- versionado;
- acompanhado da fórmula.

Nunca criar um “score mágico de IA”.

---

# BLOCO 12 — CAMADA DE IA

## MVP

**Não é requisito.**

O sistema deve funcionar bem sem IA generativa.

## Futuro

A IA pode transformar dados estruturados em comunicação natural.

Exemplo:

> “Seu faturamento aumentou 18% nesta semana, porém o resultado estimado cresceu apenas 3%. O principal produto associado à queda de margem foi o SKU X.”

### IA nunca deve

- inventar métrica;
- alterar cálculo;
- acessar token;
- modificar anúncio sem autorização;
- tomar ação financeira sozinha.

### Arquitetura futura

```text
Dados calculados
     ↓
Regras
     ↓
Evidence Package
     ↓
LLM
     ↓
Explicação
```

O LLM explica.

O banco e o analytics engine calculam.

---

# BLOCO 13 — ARQUITETURA TÉCNICA DO MVP

## 13.1 Stack sugerida

### Frontend

- Next.js;
- TypeScript;
- Tailwind CSS;
- shadcn/ui ou biblioteca headless equivalente;
- Recharts apenas se necessário.

### Backend

- Python;
- FastAPI;
- Pydantic;
- SQLAlchemy ou SQLModel;
- Alembic.

### Banco

- PostgreSQL;
- Supabase pode hospedar PostgreSQL/Auth, desde que as regras de segurança sejam respeitadas.

### Autenticação

Opção MVP:

- Supabase Auth;
- ou implementação consolidada equivalente.

### Deploy

- Frontend: Vercel;
- Backend: serviço isolado compatível com FastAPI;
- Banco: PostgreSQL gerenciado.

### NÃO usar

- n8n;
- secrets no frontend;
- banco diretamente exposto sem política;
- service role no navegador;
- arquivos `.env` commitados.

## 13.2 Arquitetura

```text
                  Browser
                     │
                 HTTPS only
                     │
                     ▼
               Next.js Front
                     │
                     │ authenticated request
                     ▼
                FastAPI API
                     │
        ┌────────────┼─────────────┐
        │            │             │
        ▼            ▼             ▼
   PostgreSQL    ML Connector  Shopee Connector
        │            │             │
        │            └─────┬───────┘
        │                  ▼
        │           Normalization Layer
        │                  │
        └───────────┬──────┘
                    ▼
            Financial Engine
                    │
                    ▼
             Analytics Engine
                    │
                    ▼
              Insight Engine
```

---

# BLOCO 14 — INTEGRAÇÕES

## 14.1 Mercado Livre

Usar API oficial.

### MVP precisa investigar/implementar

- OAuth 2.0;
- usuário/seller;
- anúncios;
- pedidos;
- itens do pedido;
- taxas/custos disponíveis;
- visitas quando aplicável;
- métricas de Ads se a conta tiver acesso;
- notificações/webhooks.

### OAuth

O usuário deve autorizar nosso aplicativo no Mercado Livre.

Nós nunca solicitamos a senha do seller.

Fluxo:

```text
Nosso sistema
    ↓
Redireciona para Mercado Livre
    ↓
Seller autoriza
    ↓
Callback do backend
    ↓
Authorization Code
    ↓
Backend troca por tokens
    ↓
Tokens são criptografados
```

### Requisito de segurança e menor privilégio

- solicitar apenas os escopos indispensáveis;
- **não solicitar permissão de escrita no MVP** se o produto não altera anúncios, preços ou campanhas;
- access token somente no backend;
- refresh token somente no backend;
- tokens criptografados em repouso;
- nunca registrar token completo em log.

## 14.2 Shopee

Usar exclusivamente Shopee Open Platform/documentação oficial.

### MVP

Validar formalmente:

- criação do aplicativo;
- aprovação;
- permissões;
- autenticação;
- pedidos;
- produtos;
- performance disponível;
- webhooks/push;
- limites;
- requisitos específicos do Brasil.

### Risco

O acesso a determinados grupos de APIs pode depender de:

- categoria do aplicativo;
- aprovação;
- permissões;
- políticas da Shopee.

### Plano de contingência

Se a aprovação da Shopee impedir integração dentro dos 14 dias:

> **não bloquear o MVP.**

Executar piloto com Mercado Livre real + dataset controlado/demonstração da Shopee até o acesso ser liberado.

Nunca usar scraping ou contorno de mecanismos de proteção como substituto da API oficial.

### Regra de caminho crítico

Shopee é P1. A ausência de aprovação/permissão **não pode adiar o piloto Mercado Livre-first**.

### Propriedade da aplicação

Antes de produção pública, registrar as aplicações e credenciais sob a entidade proprietária do SaaS, evitando dependência permanente de conta pessoal de desenvolvedor.

---

# BLOCO 15 — SINCRONIZAÇÃO

## 15.1 Primeiro sync

```text
Conexão criada
    ↓
Buscar perfil da loja
    ↓
Buscar anúncios
    ↓
Salvar listings
    ↓
Buscar pedidos do período suportado
    ↓
Salvar orders
    ↓
Normalizar
    ↓
Calcular métricas
    ↓
Gerar insights
```

## 15.2 Sync incremental

Preferência:

1. notificações/webhooks;
2. job de reconciliação periódica;
3. polling apenas quando necessário.

### Por quê

Webhooks reduzem:

- requisições desnecessárias;
- latência;
- risco de rate limit.

## 15.3 Idempotência

Todas as ingestões devem aceitar eventos repetidos.

Chave sugerida:

```text
tenant_id + provider + external_resource_id
```

Nunca duplicar pedido por receber o mesmo evento duas vezes.

---

# BLOCO 16 — DESIGN SYSTEM

## 16.1 Personalidade visual

Direção:

> **Clareza financeira + simplicidade operacional + confiança.**

Evitar aparência:

- gamer;
- “IA neon”;
- excesso de gradientes;
- dashboards com dezenas de widgets;
- visual de ERP antigo;
- muitas cores simultâneas.

Referência conceitual:

- SaaS B2B moderno;
- fintech;
- dados fáceis de ler;
- alta densidade apenas onde necessária.

## 16.2 Princípios

1. **Uma tela, uma pergunta principal.**
2. **Cor comunica significado.**
3. **Dinheiro sempre possui contexto.**
4. **Gráfico nunca substitui número essencial.**
5. **Alertas precisam explicar causa/evidência.**
6. **Estados vazios devem ensinar.**
7. **Mobile deve permitir consulta, mesmo que operação completa seja desktop-first.**
8. **Acessibilidade é requisito.**

## 16.3 Tokens

### Spacing

```text
4px
8px
12px
16px
24px
32px
48px
64px
```

### Border radius

```text
sm  = 6px
md  = 10px
lg  = 14px
xl  = 20px
```

### Tipografia

Sugestão:

- Inter;
- Geist;
- ou fonte equivalente altamente legível.

Escala:

```text
12 — caption
14 — body small
16 — body
18 — strong body
20 — section
24 — page title
32 — dashboard highlight
40 — hero metric
```

## 16.4 Cores sem travar identidade de marca

Criar semantic tokens:

```text
--color-bg
--color-surface
--color-surface-muted
--color-text
--color-text-muted
--color-border

--color-primary
--color-primary-hover

--color-success
--color-warning
--color-danger
--color-info
```

### Uso

- 🟢 Success = saudável / melhora.
- 🟡 Warning = atenção.
- 🔴 Danger = problema real.
- Primary = ação/interação.

### Regra

Nunca depender somente da cor.

Sempre combinar:

- cor;
- ícone;
- texto/status.

## 16.5 Componentes obrigatórios

- Button;
- Input;
- Select;
- DateRangePicker;
- Checkbox;
- Dialog;
- Sheet;
- Tooltip;
- Toast;
- Skeleton;
- EmptyState;
- ErrorState;
- KPI Card;
- Marketplace Badge;
- Health Badge;
- Product Status;
- Insight Card;
- Data Table;
- Chart Container;
- Filter Bar;
- Connection Card;
- Sync Status;
- Confirmation Dialog.

## 16.6 KPI Card

Estrutura:

```text
Título
Valor principal
Variação
Período comparado
Tooltip da fórmula
```

Exemplo:

```text
Margem estimada
22,4%
▲ 2,1 p.p.
vs. período anterior
ⓘ Como calculamos
```

## 16.7 Gráficos

Para MVP:

- linha para evolução temporal;
- barras para comparação;
- barras horizontais para ranking.

Evitar inicialmente:

- pizza excessiva;
- gauge;
- 3D;
- radar;
- visualizações decorativas.

## 16.8 Acessibilidade

Meta:

- contraste compatível com WCAG AA sempre que viável;
- navegação por teclado;
- focus states;
- labels;
- aria attributes;
- tabela acessível;
- informação não dependente apenas de cor.

---

# BLOCO 17 — UX DE CONFIANÇA

Cada insight deve responder:

1. O que aconteceu?
2. Em qual período?
3. Com qual dado?
4. Qual foi a comparação?
5. O que recomendamos investigar?
6. Qual é a limitação da análise?

Exemplo:

> **Conversão caiu 24%.**  
> Comparação dos últimos 14 dias com os 14 dias anteriores.  
> Visitas permaneceram estáveis (+2%).  
> O preço aumentou 7%.  
> **Recomendação:** investigar competitividade de preço antes de alterar o anúncio.

Não dizer:

> “A causa é o preço.”

Dizer:

> “O aumento de preço é um dos sinais associados à queda e deve ser investigado.”

---

# BLOCO 18 — SEGURANÇA BY DESIGN

## 18.1 Regra zero

> **Nenhuma credencial de marketplace, banco ou infraestrutura pode ser exposta no browser.**

## 18.2 Segredos

Guardar fora do código:

```text
ML_CLIENT_ID
ML_CLIENT_SECRET
SHOPEE_PARTNER_ID
SHOPEE_PARTNER_KEY
DATABASE_URL
JWT_SECRET
ENCRYPTION_KEY
```

### Proibido

```text
NEXT_PUBLIC_ML_CLIENT_SECRET
```

ou qualquer equivalente.

## 18.3 Tokens de marketplace

- criptografia em repouso;
- descriptografar apenas em memória no backend quando necessário;
- acesso restrito;
- nunca aparecer em API response;
- nunca aparecer em logs;
- rotação/revogação suportada.

## 18.4 Multi-tenancy

Todas as tabelas de negócio devem conter `tenant_id`.

Toda consulta deve verificar:

```text
authenticated_user
       ↓
tenant_membership
       ↓
requested_resource.tenant_id
```

### Teste crítico

Usuário A nunca pode consultar:

```text
/api/products/{id_do_usuario_B}
```

Esse cenário deve possuir teste automatizado.

## 18.5 RBAC

MVP:

```text
OWNER
MEMBER
```

### Contas administrativas internas

- MFA obrigatório para administradores/operadores com acesso privilegiado;
- acesso administrativo separado do fluxo comum do seller;
- menor privilégio;
- ações sensíveis auditadas;
- evitar credenciais compartilhadas;
- procedimento de revogação de acesso quando alguém deixa a operação.

Futuro:

```text
ADMIN
ANALYST
VIEWER
```

Permissões deny-by-default.

## 18.6 API

Obrigatório:

- HTTPS;
- autenticação;
- autorização;
- validação Pydantic;
- rate limiting onde necessário;
- tamanho máximo de payload;
- CORS restritivo;
- não retornar stack trace;
- timeouts;
- retry com backoff para APIs externas;
- idempotência;
- paginação.

## 18.7 Webhooks

Endpoint:

```text
POST /webhooks/{provider}
```

Requisitos:

- validar origem/assinatura conforme mecanismo oficial;
- não confiar no payload sem validação;
- persistir identificador do evento;
- idempotência;
- responder rápido;
- processar de maneira segura;
- não aceitar ação administrativa via webhook.

## 18.8 Banco

- backups;
- migrations versionadas;
- menor privilégio;
- conexão TLS;
- RLS se usarmos Supabase onde aplicável;
- service role somente no backend;
- não expor tabelas administrativas diretamente.

## 18.9 Logs

Logar:

- login;
- falha de login relevante;
- conexão de marketplace;
- desconexão;
- sync;
- erro de sync;
- alteração de custo;
- alteração de permissão;
- exportação;
- exclusão.

Não logar:

- senha;
- token;
- secret;
- dados pessoais desnecessários;
- payload integral de pedido sem justificativa.

## 18.10 OWASP

Checklist mínimo:

- [ ] Broken Access Control.
- [ ] Authentication failures.
- [ ] Injection.
- [ ] Security misconfiguration.
- [ ] Cryptographic failures.
- [ ] Vulnerable dependencies.
- [ ] Logging/monitoring failures.
- [ ] SSRF.
- [ ] API object-level authorization.
- [ ] API resource consumption.
- [ ] Excessive data exposure.
- [ ] Unsafe consumption of external APIs.

---

# BLOCO 19 — LGPD BY DESIGN

> Este bloco é requisito de engenharia e produto. Não substitui revisão jurídica profissional.

## 19.1 Princípios

Aplicar desde o MVP:

- finalidade;
- adequação;
- necessidade;
- transparência;
- segurança;
- prevenção;
- responsabilização;
- livre acesso quando aplicável;
- qualidade dos dados.

## 19.2 Minimização

Pergunta obrigatória para cada campo:

> “Precisamos realmente armazenar este dado?”

### Exemplo

Para analytics de produto, provavelmente não precisamos guardar indefinidamente:

- nome completo do comprador;
- endereço completo;
- telefone;
- mensagem particular.

Se o dado não é necessário:

> não coletar, não persistir ou anonimizar/descartar.

## 19.3 Mapa de dados

Criar documento:

```text
dado
origem
finalidade
base legal
onde é armazenado
quem acessa
retenção
forma de exclusão
```

## 19.4 Papéis

Precisamos mapear por atividade de tratamento:

- controlador;
- operador;
- suboperador.

Para dados pessoais acessados por integrações de marketplace, documentar o papel definido nos termos contratuais vigentes da respectiva plataforma e refletir isso no Data Map/DPA. Para cadastros, billing, segurança e analytics próprios do SaaS, a classificação pode ser diferente.

Não presumir um único papel para todo o produto.

## 19.5 Consentimento não é resposta para tudo

Toda atividade de tratamento precisa ter:

- finalidade;
- base legal adequada;
- registro.

Não usar “consentimento” genericamente sem avaliação.

## 19.6 Direitos do titular

Ter processo para:

- confirmação;
- acesso;
- correção;
- eliminação quando aplicável;
- informação;
- oposição quando aplicável;
- revogação quando a base for consentimento.

No MVP, pelo menos definir um canal dedicado de privacidade.

## 19.7 Exclusão da conta

```text
Pedido de exclusão
      ↓
Verificar obrigação de retenção
      ↓
Revogar conexões
      ↓
Excluir ou anonimizar dados elegíveis
      ↓
Registrar operação
      ↓
Confirmar conclusão
```

## 19.8 Retenção

Não utilizar:

```text
reter tudo para sempre
```

Criar políticas.

Exemplo inicial a validar juridicamente:

- logs de segurança: período definido;
- dados analíticos agregados: conforme contrato/finalidade;
- tokens: enquanto integração estiver ativa;
- tokens revogados: remover;
- dados de buyer não necessários: descartar rapidamente;
- backups: retenção limitada e documentada.

## 19.9 Incidente

Criar `INCIDENT_RESPONSE.md`.

```text
Detectar
 ↓
Conter
 ↓
Classificar
 ↓
Preservar evidência
 ↓
Avaliar impacto
 ↓
Corrigir
 ↓
Avaliar obrigações de comunicação
 ↓
Registrar
 ↓
Post-mortem
```

---

# BLOCO 20 — PRIVACIDADE NO DESIGN DO DASHBOARD

Evitar exibir dados de compradores quando a finalidade é análise do negócio.

Preferir:

```text
Pedido #1234
Produto X
Quantidade 2
Valor R$...
```

em vez de:

```text
Nome
CPF
telefone
endereço
```

Se não é necessário para a decisão:

> não mostrar.

---

# BLOCO 21 — AMBIENTES

## Development

- dados mock;
- contas de teste;
- nenhum segredo de produção.

## Staging

- configuração semelhante à produção;
- dados de teste;
- integração sandbox/teste quando disponível.

## Production

- credenciais próprias;
- logs próprios;
- banco isolado;
- backups;
- secrets gerenciados.

---

# BLOCO 22 — ESTRUTURA DO REPOSITÓRIO

```text
seller-intelligence/
│
├── README.md
├── MASTER_PLAN.md
├── .gitignore
├── .env.example
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_CONTRACTS.md
│   ├── DATA_MODEL.md
│   ├── DESIGN_SYSTEM.md
│   ├── SECURITY.md
│   ├── LGPD.md
│   ├── INCIDENT_RESPONSE.md
│   ├── ADR/
│   └── discovery/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── app/
│   ├── lib/
│   └── tests/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── integrations/
│   │   │   ├── mercadolivre/
│   │   │   └── shopee/
│   │   ├── analytics/
│   │   ├── finance/
│   │   └── security/
│   ├── migrations/
│   └── tests/
│
└── scripts/
    ├── seed_demo_data.py
    └── sync_test_data.py
```

---

# BLOCO 23 — CONVENÇÕES DE ENGENHARIA

## Branches

> Atualizado na v0.7: toda branch nasce de uma issue. Regras completas no **Bloco 53**.

```text
main
feature/<nº-issue>-<slug>    ex.: feature/12-login-supabase
fix/<nº-issue>-<slug>
chore/<nº-issue>-<slug>
docs/<nº-issue>-<slug>
test/<nº-issue>-<slug>
security/<nº-issue>-<slug>
```

Usar PR/testes antes de merge em `main`.

## Commits

Conventional Commits, validados pelo commitlint no CI (commits e título de todo PR) e no hook local `commit-msg` (`commitlint.config.mjs`). A caixa do assunto é livre, porque assuntos em português citam nomes próprios. Cabeçalho com no máximo 100 caracteres:

```text
feat:
fix:
security:
refactor:
perf:
docs:
test:
chore:
ci:
```

## ADR

Decisões relevantes devem ser registradas.

```text
docs/ADR/001-master-product-model.md
```

Estrutura:

```text
Contexto
Decisão
Alternativas
Consequências
```

---

# BLOCO 24 — TESTES

## Unitários

Prioridade:

- cálculos financeiros;
- regras de analytics;
- normalizadores;
- permissões.

## Integração

- OAuth;
- connector;
- banco;
- sync;
- webhook.

## Segurança

- acesso cross-tenant;
- endpoints sem token;
- tenant inválido;
- webhook duplicado;
- payload malformado;
- objeto de outro usuário.

## E2E

Fluxo crítico:

```text
cadastro
→ conectar marketplace
→ sincronizar
→ cadastrar custo
→ abrir dashboard
→ abrir produto
→ enxergar margem
```

---

# BLOCO 25 — OBSERVABILIDADE

MVP precisa saber:

- API está online?
- última sincronização por conexão;
- quantos registros foram processados;
- quantos falharam;
- tempo de sync;
- endpoint externo que falhou;
- regra que gerou insight.

### Métricas internas

```text
sync_success_total
sync_failure_total
sync_duration
api_external_error
insights_generated
connections_active
```

Nunca incluir token nos labels/logs.

---

# BLOCO 26 — PLANO DE 14 DIAS — MERCADO LIVRE-FIRST

## DIA 1 — Discovery, ICP e Financial Truth

- [ ] entrevistar/confirmar ao menos 3 sellers ou contatos qualificados;
- [ ] validar dor de margem e comparação;
- [ ] testar faixa de preço concreta;
- [ ] congelar ICP e anti-ICP;
- [ ] fechar definições de venda operacional, receita atribuída e resultado estimado;
- [ ] criar threat model inicial;
- [ ] criar Data Map LGPD.

## DIA 2 — Design System + protótipo

- [ ] tokens;
- [ ] componentes;
- [ ] onboarding;
- [ ] dashboard focado em economics;
- [ ] products/variants;
- [ ] detalhe com “Como calculamos?”;
- [ ] fila “Precisa da sua atenção”;
- [ ] loading/error/empty.

### Done

Fluxo navegável com dados fake e sem dashboard decorativo.

## DIA 3 — Fundação backend

- [ ] FastAPI;
- [ ] PostgreSQL;
- [ ] migrations;
- [ ] auth;
- [ ] tenants;
- [ ] tenant_users;
- [ ] auditoria;
- [ ] idempotência;
- [ ] tratamento de erro.

### Teste crítico

Cross-tenant bloqueado.

## DIA 4 — Mercado Livre OAuth read-only

- [ ] registrar app;
- [ ] menor privilégio;
- [ ] authorization URL;
- [ ] callback;
- [ ] token exchange;
- [ ] refresh;
- [ ] criptografia;
- [ ] disconnect.

## DIA 5 — Produtos e variações Mercado Livre

- [ ] seller;
- [ ] listings;
- [ ] variations/SKUs;
- [ ] normalização;
- [ ] master product/variant;
- [ ] sync status.

## DIA 6 — Pedidos e eventos financeiros

- [ ] pedidos;
- [ ] itens;
- [ ] status;
- [ ] cancelamentos;
- [ ] devoluções/reembolsos quando expostos;
- [ ] paginação;
- [ ] idempotência;
- [ ] reconcile.

## DIA 7 — Custos + ajustes

- [ ] histórico de custo por variante;
- [ ] taxas;
- [ ] frete;
- [ ] descontos;
- [ ] financial_adjustments;
- [ ] data lineage.

### Marco

Primeiro seller deve conseguir:

> conectar → importar → informar custo → enxergar cálculo rastreável.

## DIA 8 — Financial Truth Engine

- [ ] resultado estimado;
- [ ] margem;
- [ ] tratamento de ajustes;
- [ ] separação Ads x venda realizada;
- [ ] golden tests;
- [ ] tooltips/fórmulas.

## DIA 9 — Dashboard econômico

- [ ] receita elegível;
- [ ] resultado estimado;
- [ ] margem;
- [ ] produtos/variantes que mais contribuem;
- [ ] produtos com maior deterioração;
- [ ] comparação de períodos.

## DIA 10 — Analytics e priorização

- [ ] regras determinísticas;
- [ ] impacto em R$ quando possível;
- [ ] Health Score somente se explicável;
- [ ] evidence package;
- [ ] fila de prioridade.

## DIA 11 — FEATURE FREEZE

Nenhuma feature nova. Shopee **não** entra neste dia como obrigação.

Somente:

- correção P0/P1;
- revisão de Financial Truth;
- validação de acesso Shopee em paralelo, se disponível;
- preparação do piloto.

## DIA 12 — Security + LGPD + operação

- [ ] secrets;
- [ ] RLS/tenant isolation;
- [ ] MFA admin;
- [ ] RBAC;
- [ ] logs;
- [ ] minimização de PII;
- [ ] exclusão/retenção;
- [ ] backup;
- [ ] incident response;
- [ ] dependency scan;
- [ ] CORS/headers/rate limits;
- [ ] tela/admin mínima de sync failures e reauth.

## DIA 13 — Testes internos e regressão

- [ ] E2E;
- [ ] cross-tenant;
- [ ] idempotência;
- [ ] golden tests financeiros;
- [ ] reconnect;
- [ ] loading/empty/error;
- [ ] acessibilidade básica;
- [ ] corrigir P0/P1.

## DIA 14 — PILOTO

Convidar **5–10 sellers**.

Objetivo:

- observar uso real;
- medir time-to-value;
- testar disposição a pagar com preço concreto;
- identificar decisões tomadas;
- decidir GO/PIVOT/NO-GO.

---

# BLOCO 27 — TESTE COM USUÁRIO

## 27.1 Perguntas de discovery

1. Como você acompanha suas vendas hoje?
2. Quantas plataformas você usa?
3. Como sabe se determinado produto dá lucro?
4. Como registra custo?
5. Qual número você olha primeiro de manhã?
6. Como decide qual produto precisa de atenção?
7. Já descobriu tarde demais que um produto estava com margem ruim?
8. Como decide aumentar/reduzir Ads?
9. Como compara Shopee e Mercado Livre?
10. Quanto tempo gasta por semana analisando isso?
11. Qual planilha você mantém?
12. O que é mais chato nela?
13. Qual decisão você gostaria que um sistema ajudasse a tomar?
14. Por qual informação você pagaria para ter pronta?
15. Você permitiria conectar sua conta via API oficial? O que precisaria para confiar?
16. Qual ferramenta você usa hoje para ver lucro/margem (ERP, Bling, UpSeller, Gestor Seller, planilha)? O que ela não responde?
17. O que faria você trocar ou pagar por uma segunda ferramenta além do ERP?

## 27.2 Teste de protótipo

Dar uma tarefa:

> “Descubra qual dos seus produtos precisa de atenção.”

Não ensinar onde clicar.

Observar:

- onde olha;
- onde trava;
- o que espera;
- qual informação pergunta.

---

# BLOCO 28 — MÉTRICAS DO PILOTO

## Activation

```text
% conectou marketplace
% completou sync
% cadastrou ao menos um custo
% abriu detalhe de produto
```

## Time to Value

```text
tempo entre conectar conta e obter primeiro insight útil
```

Meta futura:

> menor que 10 minutos, descontado tempo de sincronização externa.

## Insight usefulness

Após insight:

```text
Útil
Não útil
Já sabia
Incorreto
```

## Core

- sellers ativos;
- conexões ativas;
- produtos/variantes com custo;
- insights vistos;
- insights marcados úteis;
- decisões reais tomadas com apoio do produto.

## Willingness to Pay

Não aceitar “eu usaria” como validação. Registrar:

- preço apresentado;
- resposta do seller;
- objeção principal;
- aceitaria teste pago?;
- aceitaria cadastrar pagamento para continuidade?;
- faixa máxima percebida;
- qual resultado justificaria a mensalidade.

Meta de aprendizado: testar pelo menos uma faixa real de preço com cada tester qualificado.

---

# BLOCO 29 — GO / NO-GO APÓS 14 DIAS

## GO

Continuar se houver sinais como:

- 5+ testers reais;
- maioria completa onboarding;
- usuários entendem dashboard sem explicação extensa;
- pelo menos 3 usuários relatam decisão real suportada pelo produto;
- margem/resultado é percebido como útil;
- ao menos alguns usuários pedem para continuar usando;
- existe uma dor repetida clara;
- pelo menos 2 testers demonstram disposição concreta de pagar em uma faixa de preço testada;
- idealmente obter 1 compromisso de piloto pago ou cobrança futura em até 30 dias.

## PIVOTAR

Se usuários querem a ideia, mas:

- principal dor é outra;
- margem não é suficiente;
- integração não é percebida como valor;
- outra função aparece repetidamente nas entrevistas.

## NO-GO TEMPORÁRIO

Se:

- APIs impedem tecnicamente o produto;
- qualidade dos dados não permite cálculo responsável;
- custo de integração é incompatível;
- risco legal/segurança é maior que nossa capacidade atual.

---

# BLOCO 30 — CONSULTORIA COMO MOTOR DE PRODUCT DISCOVERY

No começo:

```text
SaaS + contato humano
```

Quando o sistema gerar:

> “Produto X está crítico.”

Conversamos com o cliente.

Descobrimos:

- o diagnóstico ajudou?
- faltou algum dado?
- qual foi a causa real?
- qual ação ele tomou?
- funcionou?

Fluxo:

```text
Dado
 ↓
Insight
 ↓
Seller
 ↓
Consultoria
 ↓
Causa real
 ↓
Aprendizado
 ↓
Regra melhor
 ↓
Produto melhor
```

A consultoria não é apenas receita.

É **feedback supervisionado do negócio**.

---

# BLOCO 31 — BACKLOG PÓS-MVP

## V2 — Performance

- visitas;
- impressões;
- CTR;
- conversão;
- qualidade do anúncio;
- Ads;
- ROAS;
- benchmarks internos do próprio seller;
- alertas melhores.

## V3 — Recomendação

```text
Problema
 ↓
Evidence
 ↓
Diagnóstico
 ↓
Checklist de ação
```

## V4 — Marketing Intelligence

Por produto:

- título;
- SEO;
- atributos;
- descrição;
- imagem;
- preço;
- Ads;
- campanhas;
- concorrência quando permitido;
- calendário promocional.

## V5 — AI Advisor

Usuário pergunta:

> “Por que minhas vendas caíram?”

Sistema consulta:

- dados;
- período;
- regras;
- evidências.

E responde citando números do próprio negócio.

## V6 — Autopilot opcional

Somente depois de confiança suficiente.

```text
Sistema recomenda
      ↓
Usuário revisa
      ↓
Usuário aprova
      ↓
Sistema executa
```

Aprovação humana por padrão.

## V7 — Afiliados (fora do escopo atual)

Decidido em 2026-10-10: **o produto foca somente em quem vende** no Mercado Livre e na Shopee. Afiliados viram um produto separado ou um módulo futuro.

Insumos da análise de 2026-10-10, para quando o tema voltar:

- A Shopee tem **Affiliate Open API oficial**: conversões, comissões validadas, ofertas e links curtos com sub-ID por canal.
- O Mercado Livre **não tem API pública de relatórios de afiliado**. Caminho viável: importar o relatório do painel + links de redirecionamento próprios. Nunca scraping (princípio 4 e Bloco 14.2).
- Automação de postagem em grupos já é um mercado concorrido (R$ 49,90–149,90/mês). O diferencial estaria na análise ("o que postar amanhã"), não no disparo.
- Comissão de afiliado (pendente → validada → cancelada) reaproveita o modelo de eventos financeiros do Bloco 9.

---

# BLOCO 32 — RISCOS

## R01 — Virar ERP

**Mitigação:** toda feature nova precisa provar relação com diagnóstico ou decisão.

## R02 — Dados financeiros incorretos

**Mitigação:**

- fórmula visível;
- dados considerados;
- testes;
- “estimado”;
- histórico de custos.

## R03 — API externa mudar

**Mitigação:** connector isolado.

## R04 — Shopee aprovação

**Mitigação:** Mercado Livre-first sem abandonar arquitetura multi-marketplace.

## R05 — Vazamento cross-tenant

**Severidade:** crítica.

**Mitigação:**

- tenant_id;
- RLS;
- autorização backend;
- testes automatizados.

## R06 — Vazamento de tokens

**Severidade:** crítica.

**Mitigação:**

- criptografia;
- secrets manager;
- backend only;
- logs sanitizados.

## R07 — “IA inventou recomendação”

**Mitigação:** LLM não calcula.

## R08 — Dashboard bonito sem valor

**Mitigação:** cada componente deve responder uma pergunta do seller.

## R09 — Competição com dashboards nativos

**Mitigação:** não competir por “mais métricas”. Focar em Financial Intelligence, visão multicanal, impacto em R$ e priorização.

## R10 — Financial Engine incorreta

**Severidade:** crítica.

**Mitigação:** separar venda, receita atribuída, resultado estimado e futuro resultado conciliado; tratar cancelamentos/devoluções/reembolsos; golden tests e data lineage.

## R11 — ICP pequeno demais para pagar

**Mitigação:** mirar seller pequeno profissionalizado com volume suficiente e testar preço concreto durante o piloto.

## R12 — Consultoria não escala

**Mitigação:** toda atividade manual recorrente deve gerar aprendizado, regra, onboarding ou automação de produto; medir horas de suporte por tenant.

## R13 — Dependência de marketplace

**Mitigação:** connectors isolados, contract tests, versionamento, fallbacks operacionais e nenhum acoplamento do frontend ao JSON externo.

## R14 — Commoditização do "lucro por pedido"

**Contexto:** ERPs (Bling, UpSeller) e vários SaaS já entregam margem por pedido (Bloco 47.3).

**Mitigação:** comunicar e medir valor pela fila de prioridade, impacto em R$, lineage e comparação cross-channel — não pelo cálculo de margem em si.

## R15 — Canal de aquisição / CAC

**Mitigação:** testar no piloto ao menos um canal (mentor/agência parceira ou comunidade de sellers) e registrar custo por tester ativado.

---

# BLOCO 33 — DEFINITION OF DONE

Uma feature só está pronta quando:

- [ ] requisito definido;
- [ ] UI completa;
- [ ] loading;
- [ ] empty;
- [ ] error;
- [ ] autorização;
- [ ] tenant isolation;
- [ ] testes;
- [ ] logs adequados;
- [ ] documentação;
- [ ] LGPD avaliada;
- [ ] nenhum secret exposto;
- [ ] mobile razoável quando aplicável;
- [ ] issue vinculada e PR com `Closes #N` (Bloco 53);
- [ ] princípios SOLID respeitados (Bloco 53.4);
- [ ] estados de motion: skeleton, entrada, saída e progresso, com `prefers-reduced-motion` (Bloco 54);
- [ ] erros capturados e operações relevantes instrumentadas (Bloco 55);
- [ ] todos os quality gates verdes no CI (Bloco 56);
- [ ] lógica de risco com teste que falha quando ela quebra, e nenhum teste trivial (Bloco 57);
- [ ] entrega termina dizendo o que não foi feito ou verificado e os riscos (Bloco 57.7).

---

# BLOCO 34 — PRIORIDADES P0 / P1 / P2

## P0 — obrigatório

- discovery + disposição a pagar;
- auth;
- tenant isolation;
- Mercado Livre read-only;
- produtos + variantes;
- pedidos + eventos/ajustes;
- custos versionados;
- Financial Truth Engine;
- data lineage;
- dashboard econômico;
- segurança;
- LGPD mínimo;
- teste com usuários.

## P1 — desejável

- Shopee;
- comparação cross-channel;
- insights;
- health score;
- webhooks completos.

## P2 — pós-teste

- Ads avançado;
- IA;
- marketing;
- automações.

---

# BLOCO 35 — PRIMEIRAS ISSUES DO GITHUB

## Epic 01 — Foundation

```text
SET-001 Criar monorepo
SET-002 Configurar frontend
SET-003 Configurar backend
SET-004 Configurar PostgreSQL
SET-005 Configurar migrations
```

## Epic 02 — Security

```text
SEC-001 Tenant model
SEC-002 RBAC
SEC-003 Secret handling
SEC-004 Token encryption
SEC-005 Audit log
SEC-006 Cross-tenant tests
```

## Epic 03 — Mercado Livre

```text
ML-001 OAuth
ML-002 Token refresh
ML-003 Seller info
ML-004 Listings sync
ML-005 Orders sync
ML-006 Webhooks
```

## Epic 04 — Products

```text
PRD-001 Master Product
PRD-002 Marketplace listing
PRD-003 SKU matching
PRD-004 Manual mapping
PRD-005 Cost history
```

## Epic 05 — Finance

```text
FIN-001 Financial schema
FIN-002 Fee normalization
FIN-003 Margin engine
FIN-004 Result estimation
FIN-005 Financial tests
```

## Epic 06 — Analytics

```text
ANA-001 Daily metrics
ANA-002 Period comparison
ANA-003 Rule engine
ANA-004 Health Score
ANA-005 Insight cards
```

## Epic 07 — UX

```text
UX-001 Design tokens
UX-002 Dashboard
UX-003 Products
UX-004 Product detail
UX-005 Costs
UX-006 Connections
```

---

# BLOCO 36 — DOCUMENTO ÚNICO / SINGLE SOURCE OF TRUTH

O projeto terá **um único documento mestre autoritativo**:

```text
MASTER_PLAN_SAAS_MARKETPLACE_MVP.md
```

Toda nova decisão deve ser incorporada neste arquivo, incluindo:

- produto e discovery;
- escopo e backlog;
- arquitetura;
- APIs e contratos;
- modelo de dados;
- Design System;
- segurança;
- LGPD;
- incident response;
- testes;
- decisões de stack;
- resultados de validação;
- mudanças de roadmap;
- features aceitas, rejeitadas ou adiadas;
- componentes classificados como STABLE/FROZEN;
- riscos e mitigação;
- aprendizados dos usuários.

### Regra de governança

> Se uma decisão não estiver registrada neste arquivo, ela ainda não é uma decisão oficial do projeto.

Arquivos auxiliares de código, migration, testes ou configuração podem existir no repositório, mas **não substituem o documento mestre como fonte de verdade do produto e da arquitetura**.

Quando uma seção crescer, ela continua neste arquivo e recebe um novo bloco ou subseção. Não fragmentar a documentação principal em vários `.md` durante o MVP.

Exceções permitidas (v0.7), porque não são documentação e sim pontos de entrada exigidos por ferramentas:

- `AGENTS.md` na raiz: apenas aponta para este documento, para que agentes de qualquer ferramenta o encontrem;
- `.github/ISSUE_TEMPLATE/*` e `.github/pull_request_template.md`: formulários do fluxo do Bloco 53.

---

# BLOCO 37 — CHECKLIST DE LANÇAMENTO DO PILOTO

## Produto

- [ ] onboarding funciona;
- [ ] ML conecta em menor privilégio/read-only;
- [ ] sync funciona;
- [ ] custos são editáveis;
- [ ] venda operacional não é confundida com receita atribuída;
- [ ] cancelamentos/devoluções/reembolsos conhecidos são tratados;
- [ ] cálculo validado por golden tests;
- [ ] data lineage disponível;
- [ ] dashboard legível;
- [ ] produto detalhado funciona;
- [ ] alertas não são enganosos.

## Segurança

- [ ] `.env` não commitado;
- [ ] tokens criptografados;
- [ ] nenhum secret no frontend;
- [ ] cross-tenant testado;
- [ ] CORS;
- [ ] HTTPS;
- [ ] logs sanitizados;
- [ ] dependencies verificadas;
- [ ] backup;
- [ ] MFA para acesso administrativo privilegiado.

## LGPD

- [ ] mapa de dados;
- [ ] finalidade registrada;
- [ ] minimização;
- [ ] política inicial;
- [ ] canal de privacidade;
- [ ] fluxo de exclusão;
- [ ] retenção definida;
- [ ] contratos/suboperadores mapeados.

## Operação

- [ ] conta de demonstração;
- [ ] fluxo de suporte;
- [ ] formulário de feedback;
- [ ] bugs P0 = zero;
- [ ] lista de testers;
- [ ] roteiro de entrevista;
- [ ] visão administrativa mínima de sync failure/reauth;
- [ ] faixa de preço do piloto definida.

---

# BLOCO 38 — O QUE SERÁ CONSIDERADO SUCESSO

Em duas semanas não precisamos provar que construímos uma empresa gigante.

Precisamos provar três coisas:

### 1. O dado consegue chegar.

```text
Marketplace → nosso sistema
```

### 2. Conseguimos transformar o dado em uma leitura confiável.

```text
dados → indicador → diagnóstico
```

### 3. O seller considera isso útil o suficiente para voltar.

```text
insight → decisão → retorno
```

### 4. Existe valor econômico suficiente para pagar.

```text
problema → impacto em R$ → decisão → disposição concreta a pagar
```

Se provarmos os quatro:

> construímos a base correta para continuar.

---

# BLOCO 39 — ORDEM OFICIAL DE CONSTRUÇÃO

```text
1. Discovery
        ↓
2. Escopo
        ↓
3. Threat Model + LGPD
        ↓
4. Design System
        ↓
5. Auth / Tenant
        ↓
6. Mercado Livre OAuth
        ↓
7. Produtos
        ↓
8. Pedidos
        ↓
9. Produto Mestre + Variantes
        ↓
10. Custos + Ajustes
        ↓
11. Financial Truth Engine
        ↓
12. Dashboard econômico
        ↓
13. Analytics
        ↓
14. Hardening
        ↓
15. Shopee (P1, sem bloquear piloto)
        ↓
16. Testers
        ↓
17. Feedback
        ↓
18. Próximo ciclo
```

---

# BLOCO 40 — PRINCÍPIOS INEGOCIÁVEIS

1. **Não construir tecnologia sem dor validada.**
2. **Não vender “IA” como solução universal.**
3. **Não chamar estimativa de lucro contábil.**
4. **Não dizer que entendemos o algoritmo secreto dos marketplaces.**
5. **Não guardar dado que não precisamos.**
6. **Não expor token no frontend.**
7. **Não permitir acesso entre tenants.**
8. **Não criar uma recomendação que não conseguimos explicar.**
9. **Não adicionar feature apenas porque concorrentes possuem.**
10. **Não deixar LGPD e segurança para a versão 2.**
11. **Não usar LLM para fazer cálculo determinístico.**
12. **Não automatizar ação sensível sem consentimento e controle.**
13. **Não tentar matar todas as dores nas primeiras duas semanas.**
14. **Não competir com Mercado Livre/Shopee apenas por quantidade de métricas.**
15. **Não misturar venda operacional, receita atribuída e resultado estimado.**
16. **Não pedir permissão de escrita se o MVP só precisa ler.**
17. **Não considerar interesse verbal como validação de preço.**

---

# BLOCO 41 — REFERÊNCIAS TÉCNICAS OFICIAIS

## Mercado Livre

Autenticação/autorização:  
https://developers.mercadolivre.com.br/autenticacao-e-autorizacao

Gestão de OAuth e tokens:  
https://developers.mercadolivre.com.br/pt_br/publicacao-de-produtos/gestao-de-identidades-e-acessos-oauth-e-tokens

Pedidos:  
https://developers.mercadolivre.com.br/pt_br/pedidos-e-opinioes

Notificações:  
https://developers.mercadolivre.com.br/pt_br/produto-consulta-de-usuarios/produto-receba-notificacoes

Product Ads:  
https://developers.mercadolivre.com.br/pt_br/product-ads-para-catalogo-e-user-products-leitura

## Shopee

Open Platform:  
https://open.shopee.com/

API Reference:  
https://open.shopee.com/documents/v2/api-reference

Order API:  
https://open.shopee.com/documents/v2/v2.order.get_order_detail?module=94&type=1

Shop Performance:  
https://open.shopee.com/documents/v2/v2.account_health.get_shop_performance?module=103&type=1

## LGPD / ANPD

Materiais oficiais:  
https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes

Guia de segurança para agentes de pequeno porte:  
https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-sobre-seguranca-da-informacao-para-agentes-de-tratamento-de-pequeno-porte

Resolução CD/ANPD nº 2/2022:  
https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022

## Segurança

OWASP:  
https://owasp.org/

---


# BLOCO 42 — HARDENING DE MULTI-TENANCY, CONCORRÊNCIA E IDEMPOTÊNCIA

Este bloco complementa a segurança já definida e é **P0** para o SaaS.

## 42.1 Regra de confiança zero para tenant

O frontend nunca é a fonte de verdade para `tenant_id`.

Fluxo correto:

```text
JWT / Session
    ↓
Authenticated User
    ↓
Tenant Membership
    ↓
Tenant autorizado
    ↓
Resource scoped query
```

Evitar APIs como:

```text
GET /api/orders?tenant_id=empresa_123
```

Preferir:

```text
GET /api/orders
```

O backend deriva o tenant do contexto autenticado.

---

## 42.2 Queries sempre tenant-scoped

Nunca:

```sql
SELECT *
FROM products
WHERE id = :product_id;
```

Sempre algo equivalente a:

```sql
SELECT *
FROM products
WHERE id = :product_id
  AND tenant_id = :authenticated_tenant_id;
```

Índices mínimos recomendados:

```sql
CREATE INDEX idx_orders_tenant_created_at
ON orders (tenant_id, created_at_marketplace);
```

```sql
CREATE INDEX idx_product_metrics_tenant_product_date
ON product_metrics_daily (tenant_id, master_product_id, date);
```

---

## 42.3 Constraints de idempotência

Pedidos:

```text
UNIQUE(tenant_id, provider, external_order_id)
```

Listings:

```text
UNIQUE(tenant_id, provider, external_listing_id)
```

Eventos/webhooks, quando houver identificador externo confiável:

```text
UNIQUE(provider, external_event_id)
```

Caso o provider não forneça um ID adequado, gerar uma chave determinística segura a partir dos campos imutáveis relevantes.

---

## 42.4 Idempotency-Key em operações críticas

Para endpoints que iniciam operações potencialmente duplicáveis:

```http
POST /api/sync
Idempotency-Key: <uuid>
```

Fluxo:

```text
Request
  ↓
Idempotency-Key existe?
  ├─ SIM → retornar resultado/estado existente
  └─ NÃO → registrar chave → executar → persistir resultado
```

Aplicável inicialmente a:

- início de sincronização;
- importação manual;
- operações financeiras internas futuras;
- comandos que possam ser reenviados por timeout/retry.

---

## 42.5 Distributed Lock por integração

Impedir dois workers de sincronizar simultaneamente a mesma conta.

Chave conceitual:

```text
sync:{tenant_id}:{provider}:{connection_id}
```

Fluxo:

```text
Sync solicitado
    ↓
Tenta adquirir lock
    ├─ lock ocupado → não iniciar duplicado / colocar em fila
    └─ lock livre   → adquirir → executar → liberar
```

Lock deve possuir TTL para evitar bloqueio permanente após crash.

---

## 42.6 Queue e limite de concorrência

Jobs pesados não devem disputar recursos diretamente via request HTTP.

```text
API
 ↓
Job Queue
 ↓
Worker Pool
 ↓
Marketplace API / Database
```

MVP:

- máximo de syncs concorrentes por tenant;
- máximo por conexão;
- máximo global por provider;
- backpressure quando a fila estiver cheia;
- retry com exponential backoff + jitter;
- dead-letter/retry state para jobs que falharem repetidamente.

---

## 42.7 Proteção contra Noisy Neighbor

Um tenant não pode degradar a experiência dos demais.

Controles:

```text
Rate Limit global
      ↓
Rate Limit por tenant
      ↓
Rate Limit por endpoint
      ↓
Quota de jobs
      ↓
Concurrency limit
      ↓
Connection pool / DB protection
```

Exemplo conceitual inicial, a calibrar com testes:

```text
Tenant API: 120 req/min
Endpoint pesado: 10 req/min
Sync concorrente: 2 por tenant
Sync por conexão: 1
```

Os números finais devem ser definidos por carga real; não hardcodar prematuramente sem observabilidade.

---

## 42.8 Connection Pool

O backend deve usar pool limitado de conexões ao PostgreSQL.

Objetivos:

- impedir tempestade de conexões;
- proteger banco sob picos;
- limitar workers de acordo com capacidade real;
- possuir timeout para aquisição de conexão;
- monitorar pool exhaustion.

---

## 42.9 Controle de recursos externos

Cada marketplace possui limites próprios.

Connector deve centralizar:

- throttling;
- retry;
- backoff;
- tratamento de `429`;
- timeout;
- circuit breaker futuro se necessário;
- métricas de erro por provider.

Nenhuma tela deve chamar API do marketplace diretamente.

---

## 42.10 Testes obrigatórios de concorrência e isolamento

Criar testes para:

```text
test_cross_tenant_product_access_denied
test_cross_tenant_order_access_denied
test_duplicate_order_does_not_duplicate
test_duplicate_webhook_is_idempotent
test_duplicate_sync_request_returns_existing_job
test_same_connection_cannot_sync_twice_concurrently
test_tenant_rate_limit_isolated
test_failed_lock_expires_safely
```

Esses testes passam a fazer parte da regressão automática.

---

# BLOCO 43 — GOVERNANÇA DE FEATURES E STABLE CORE

## 43.1 Objetivo

Evitar:

- feature creep;
- código sem utilidade validada;
- reescrita desnecessária;
- refatoração estética durante o MVP;
- repetição manual de testes já automatizados;
- quebra de módulos seguros e validados.

Regra operacional:

> **Construir → testar → validar → estabilizar → proteger → seguir.**

---

## 43.2 Filtro contra feature inútil

Toda nova feature deve responder:

1. Qual dor específica do seller resolve?
2. Essa dor foi observada ou validada?
3. É necessária para o MVP?
4. Melhora segurança, LGPD ou confiabilidade?
5. Move uma métrica relevante?
6. Precisa existir antes dos testers?

Sem justificativa clara:

```text
BACKLOG
```

Não entra no sprint atual.

---

## 43.3 Estados de maturidade

### EXPERIMENTAL

Em construção. Pode mudar.

### VALIDATING

Funciona tecnicamente, mas ainda está em validação.

### STABLE

Atende ao requisito, está testado, documentado e não possui problema crítico conhecido.

### FROZEN

Componente central e consolidado. Alteração somente com justificativa objetiva.

Possíveis componentes futuros FROZEN:

```text
Auth
Tenant Isolation
Token Encryption
OAuth
Order Normalization
Financial Calculation
```

---

## 43.4 Stable Core

```text
Authentication
      ↓
Tenant Isolation
      ↓
OAuth
      ↓
Token Vault
      ↓
Marketplace Connectors
      ↓
Normalization
      ↓
Financial Engine
      ↓
Analytics Engine
```

Quando um módulo entra no Stable Core, não deve ser refeito apenas por preferência técnica ou estética.

Reabrir somente por:

- bug;
- vulnerabilidade;
- mudança de API externa;
- requisito validado;
- problema de performance mensurado;
- dívida técnica que bloqueie evolução real.

---

## 43.5 Código validado não significa código sem regressão

Um módulo STABLE não precisa de repetição manual constante.

Ele continua sendo verificado automaticamente:

```text
Nova mudança
    ↓
CI
    ↓
Unit Tests
    ↓
Integration Tests
    ↓
Security Tests
    ↓
Regression Tests
    ↓
Merge permitido
```

Se um teste crítico falhar, o merge deve ser bloqueado.

---

## 43.6 Golden Tests para cálculos críticos

Exemplo conhecido:

```text
Venda: R$ 100
Custo do produto: R$ 40
Taxas: R$ 15
Frete seller: R$ 8
Ads: R$ 7

Resultado esperado: R$ 30
```

Esse caso vira fixture/teste de referência.

Mudança futura que retornar valor diferente precisa explicar conscientemente a alteração da regra de negócio.

---

## 43.7 Contract Tests

Criar contract tests para connectors e normalizadores.

Objetivo:

- identificar mudanças nas APIs externas;
- impedir quebra silenciosa de campos;
- garantir compatibilidade do domínio interno.

---

## 43.8 Registro de componentes estáveis

Dentro deste mesmo documento mestre, manter a tabela abaixo atualizada:

| Componente | Status | Versão | Última validação | Pode alterar? |
|---|---|---|---|---|
| Auth | VALIDATING | 0.1 | 2026-10-08 (backend) | Sim |
| Tenant Isolation | VALIDATING | 0.1 | 2026-10-08 | Sim |
| OAuth Mercado Livre | EXPERIMENTAL | 0.1 | — | Sim |
| Financial Engine | EXPERIMENTAL | 0.1 | — | Sim |
| Analytics Engine | EXPERIMENTAL | 0.1 | — | Sim |
| Infra base (repo, CI, banco local, logging) | VALIDATING | 0.1 | 2026-10-08 | Sim |
| Design System | EXPERIMENTAL | 0.1 | 2026-10-08 | Sim |
| Health Score | EXPERIMENTAL | hs-0.1 | 2026-10-08 | Sim |
| Protótipo de discovery (dados demo) | VALIDATING | 0.1 | 2026-10-08 | Sim |

Não criar um `STABLE_COMPONENTS.md` separado. A governança permanece neste arquivo.

---

## 43.9 Reabertura de componente STABLE/FROZEN

Registrar no changelog ou decisão correspondente:

```text
Motivo
Impacto
Risco
Testes afetados
Plano de rollback
```

Sem motivo claro, não alterar.

---

## 43.10 Feature Budget

### P0

Bloqueia lançamento ou protege segurança/correção.

### P1

Importante, entra somente depois dos P0.

### P2

Backlog próximo ciclo.

### P3

Ideia futura.

Regra:

> Nenhuma feature P2/P3 deve atrasar o piloto.

---

## 43.11 Feature Freeze

Cronograma oficial do MVP:

```text
Dias 1–10  → construção
Dia 11     → Feature Freeze
Dias 12–13 → hardening, regressão, segurança, bugs e UX
Dia 14     → piloto
```

Após Feature Freeze, somente entram:

- correção P0/P1;
- segurança;
- LGPD;
- cálculo incorreto;
- quebra de integração;
- problema impeditivo de UX.

---

# BLOCO 44 — PRAZO E MARCOS DO MVP

## 44.1 Meta oficial

> **14 dias para colocar um MVP pequeno, seguro e utilizável nas mãos de 5–10 sellers reais.**

Não significa produto final.

---

## 44.2 Estratégia Mercado Livre-first

O prazo de 14 dias depende de não deixar a aprovação/permissão da Shopee bloquear o núcleo.

MVP mínimo aceitável:

- Mercado Livre conectado;
- produtos;
- pedidos;
- custos;
- Produto Mestre;
- engine financeira;
- dashboard;
- insights básicos;
- segurança/LGPD P0;
- usuários reais testando.

Shopee entra no mesmo piloto se o acesso necessário estiver liberado e estável.

---

## 44.3 Marcos

| Período | Resultado esperado |
|---|---|
| Dias 1–2 | Discovery, Design System, arquitetura, LGPD e threat model |
| Dias 3–4 | Auth, banco, multi-tenancy e segurança |
| Dias 4–6 | Mercado Livre OAuth, produtos e pedidos |
| Dias 7–8 | Produto Mestre, custos e engine financeira |
| Dias 9–10 | Dashboard, comparação e métricas |
| Dia 11 | Insights + Health Score + Feature Freeze |
| Dias 12–13 | Hardening, regressão, bugs e UX |
| Dia 14 | 5–10 sellers no piloto |

---

## 44.4 Horizonte pós-MVP

Estimativa de planejamento, sujeita ao feedback real:

```text
14 dias
└── MVP piloto

Semanas 3–4
├── feedback dos sellers
├── correções
├── Shopee, se pendente
├── UX
└── métricas adicionais

30–45 dias
├── beta comercial
├── onboarding maduro
├── billing
├── analytics melhor
└── primeiros usuários pagantes

60–90 dias
├── Marketing Intelligence
├── Ads
├── SEO
├── recomendações avançadas
└── AI Advisor
```

Priorizar aprendizado real sobre calendário fixo.

---

# BLOCO 45 — GUARDRAIL ECONÔMICO E TESE DE DIFERENCIAÇÃO

## 45.1 Tese atual

O produto não vence por ser um dashboard mais bonito. A tese é:

> **Financial Intelligence + visão multicanal + impacto em R$ + priorização de ação para sellers pequenos profissionalizados.**

Os marketplaces podem melhorar seus próprios dashboards. Nosso valor precisa continuar existindo mesmo assim.

## 45.2 Pergunta defensável

O sistema deve responder algo que um painel isolado não responde bem:

> “Considerando custos, taxas, frete, Ads e ajustes, onde este produto realmente contribui mais para o meu negócio e o que merece minha atenção primeiro?”

## 45.3 Custo inicial

Objetivo: manter o piloto com infraestrutura simples e gerenciada.

Guardrail inicial:

- evitar Kubernetes, data warehouse, GPU, vector DB e observabilidade enterprise;
- usar serviços gerenciados pequenos;
- não pagar por ferramenta que substitua validação de produto;
- registrar custo mensal de infraestrutura e custo variável por tenant.

### Budget operacional de validação

Meta: manter infraestrutura do piloto **na ordem de dezenas a pouco mais de uma centena de dólares/mês**, enquanto o volume for baixo. Qualquer salto relevante de custo deve ter causa medida e decisão registrada.

## 45.4 Unit economics que devemos medir cedo

Mesmo antes de billing completo:

```text
MRR potencial por tenant
- custo infra marginal
- custo API/serviços
- custo médio de suporte/onboarding
= contribuição aproximada por tenant
```

Principal alerta:

> Se cada cliente exigir horas recorrentes de consultoria para extrair valor, ainda não temos SaaS escalável.

## 45.5 Regra de produto

Toda atividade manual repetida em 3 ou mais clientes deve ser avaliada para virar:

- onboarding;
- regra;
- feature;
- automação segura;
- documentação;
- ou ser removida da oferta.

---

# BLOCO 46 — REGRA PERMANENTE DE ATUALIZAÇÃO DO MASTER PLAN

A partir desta versão:

> **Toda informação nova do projeto deve ser incorporada neste mesmo arquivo.**

Inclui novas:

- ideias;
- decisões;
- regras;
- features;
- APIs;
- riscos;
- aprendizados;
- testes;
- controles de segurança;
- requisitos LGPD;
- mudanças de design;
- mudanças de prazo;
- mudanças de stack;
- resultados de entrevistas;
- itens rejeitados.

### Processo

```text
Nova informação
      ↓
Classificar domínio/bloco
      ↓
Verificar conflito com decisão anterior
      ↓
Atualizar bloco existente OU criar novo bloco
      ↓
Atualizar CHANGELOG
      ↓
Arquivo mestre permanece como fonte única
```

Não substituir uma decisão antiga silenciosamente. Quando houver mudança relevante, registrar o motivo no changelog.

---

# BLOCO 47 — ANÁLISE DE MERCADO (OUTUBRO/2026)

> Pesquisa de mesa (fontes públicas). **Não substitui entrevistas com sellers** — é insumo para o Dia 1 de discovery.

## 47.1 Tamanho do mercado

| Dado | Valor | Observação |
|---|---|---|
| PMEs/empreendedores vendendo ativamente no Mercado Livre Brasil (2025) | ~627 mil | 40% MEI; para 60% o ML é o principal canal |
| Vendedores brasileiros cadastrados na Shopee | ~3,3 milhões | cadastrados ≠ ativos; 9 em 10 vendas vêm de CNPJ |
| Comissão típica Mercado Livre | ~14% a 20% | varia por categoria e tipo de anúncio |
| Comissão combinada Shopee (2026) | pode passar de 27% | fim do teto de R$ 100 na comissão; taxa fixa por item subiu para até R$ 7 |

### Hipótese de ICP endereçável (a validar)

Se 5–10% dos sellers ativos do ML estiverem na faixa de 100–2.000 pedidos/mês (ICP do Bloco 2), o mercado inicial seria da ordem de **30–60 mil sellers**. Ilustração: 1% de 40 mil = 400 clientes × R$ 150 = **~R$ 60 mil de MRR**. Esse percentual é premissa, não dado medido.

## 47.2 A dor existe?

**Sim, com evidência indireta forte:**

- dezenas de ferramentas surgiram para "lucro real por pedido" — o mercado já paga por isso;
- 2026 trouxe aumento de taxas (Shopee principalmente), o que força recálculo de margem por SKU;
- pesquisas de fornecedores do setor apontam que a maioria dos lojistas tem dificuldade de precificar ou vende com margem abaixo do esperado (fonte com viés comercial).

**Evidência direta ainda inexistente:** nenhuma entrevista com seller foi feita. O Dia 1 continua sendo o maior risco do plano.

## 47.3 Concorrência — achado mais importante

O mercado é **mais concorrido do que o Bloco 32/R09 assumia**. A competição não é só o painel nativo do marketplace:

| Categoria | Exemplos | Preço público observado |
|---|---|---|
| SaaS de lucro por pedido/SKU | Gestor Seller, OQS (Oquesobra), SellerHub Analytics, Emori, Jodda.ia, Claryfin | R$ 29,90 a R$ 697/mês, por faixa de pedidos |
| ERPs com relatório de lucro embutido | Bling (Dashboard Margem por Pedido), UpSeller (300 mil+ sellers) | incluído no ERP |
| Suítes operacionais | Mercado Turbo (140+ funcionalidades) | assinatura |
| Planilha automatizada | Jaguar Sheet (sincroniza ML → Google Sheets) | assinatura |
| Inteligência de mercado (concorrência, não margem própria) | Nubimetrics, Real Trends | assinatura |

### Conclusão

> **"Ver o lucro real por pedido" virou commodity.** Não sustenta um SaaS novo sozinho.

O espaço defensável que ainda parece pouco ocupado é exatamente a tese do Bloco 45, desde que levada a sério:

1. **Priorização com impacto em R$** — "o que olhar hoje e quanto isso custa", não "veja seu lucro" (H9);
2. **Confiança/lineage** — "Como calculamos?" com fonte de cada centavo (H7);
3. **Produto Mestre cross-channel** — o mesmo produto comparado entre ML e Shopee com economics completos (H8);
4. **Diagnóstico explicado** — regras com evidência (Blocos 10 e 17).

## 47.4 Dá para escalar?

Tecnicamente sim (connectors isolados, infra barata). O gargalo provável **não é tecnologia, é distribuição**:

- CAC: o seller pequeno é alcançado por mentores, consultorias, influenciadores e comunidades de marketplace;
- o Bloco 30 (consultoria como discovery) pode virar também canal: parceria com mentores/agências que atendem vários sellers;
- preço precisa caber na régua já existente (entrada ~R$ 100, intermediário ~R$ 200–300).

## 47.5 Ajustes decorrentes

- Novo risco **R14 — Commoditização do lucro por pedido.** Mitigação: comunicar e medir valor pela fila de prioridade e pelo impacto em R$, não pelo cálculo de margem.
- Novo risco **R15 — Canal de aquisição.** Mitigação: testar no piloto ao menos um canal (mentor/agência parceira ou comunidade) e registrar custo por tester ativado.
- R09 reforçado: concorrência inclui ERPs e SaaS especializados, não apenas os marketplaces.
- Faixas de preço para o teste de WTP no piloto: **R$ 97 / R$ 197 / R$ 297**.
- Perguntas 16 e 17 adicionadas ao roteiro de discovery (Bloco 27.1).

### Fontes

- Mercado & Consumo — Mercado Livre movimenta R$ 731 bi na economia brasileira em 2025
- Blog da Shopee — 3 milhões de vendedores brasileiros; perfil dos vendedores
- Economic News Brasil / Money Times — reajuste de taxas da Shopee em 2026
- ecomcalctools.com — taxas Mercado Livre 2026
- Sites oficiais: gestorseller.com.br, oquesobra.com.br, sellerhubanalytics.com.br, emori.com.br, joddaia.com.br, jaguarsheet.com, upseller.com, ajuda.bling.com.br, trustmrr.com (Claryfin)
- Mercado Livre Developers — `listing_prices` (sale_fee_details) e Billing Reports

---

# BLOCO 48 — INFRA (EXECUTADO EM 2026-10-08)

Primeiro bloco técnico. Escolhido por ser de **baixo arrependimento**: serve a qualquer resultado do discovery e pode rodar em paralelo ao Bloco A.

## 48.1 Estrutura do repositório (decisão)

```text
.
├── MASTER_PLAN_SAAS_MARKETPLACE_MVP.md
├── README.md
├── docker-compose.yml
├── infra/postgres/init/01-roles-and-databases.sql
├── .github/ (ci.yml, dependabot.yml, pull_request_template.md)
├── .pre-commit-config.yaml
├── backend/
│   ├── app/{api,core,models}/
│   ├── migrations/
│   ├── tests/
│   ├── Dockerfile
│   └── pyproject.toml + uv.lock
└── frontend/ (Next.js App Router, src/)
```

Conflito resolvido: o Bloco 22 previa vários arquivos em `docs/`, mas o Bloco 36 proíbe fragmentar a documentação no MVP. **Prevalece o Bloco 36** — `docs/` não foi criado.

## 48.2 Ferramentas e versões

| Item | Escolha | Motivo |
|---|---|---|
| Python | 3.13, gerenciado por `uv` | lockfile reproduzível, instalação rápida, mesmo fluxo local e CI |
| Driver Postgres | `asyncpg` | `psycopg` async não funciona com o event loop padrão do Windows (ambiente de dev atual) |
| Banco | PostgreSQL 17 | porta local **5440** (5432/5433 já usadas por outros projetos na máquina) |
| Frontend | Next.js 16.4 + React 19 + Tailwind 4 | versão com mudanças incompatíveis; consultar `node_modules/next/dist/docs/` antes de usar APIs |
| Node | 24 + npm | já instalado; sem ferramenta extra |

## 48.3 Banco — menor privilégio desde o primeiro dia

- `app_migrator`: dono do schema, usado **somente** por migrations.
- `app_runtime`: usado pela API; só DML; `NOSUPERUSER NOBYPASSRLS`.
- Motivo: dono de tabela e superusuário ignoram RLS. Sem separar roles, o RLS do Bloco 18.8 não teria efeito.
- Testes `test_runtime_role_is_not_privileged` e `test_runtime_role_cannot_run_ddl` protegem isso no CI.
- Ao migrar para banco gerenciado (ex.: Supabase), a API **não** pode usar `postgres` nem service role — criar a mesma role de runtime.

## 48.4 Backend — fundação

- Configuração por env com **fail-fast**: fora de development, a API não sobe sem `ENCRYPTION_KEY`, `AUTH_JWKS_URL`, `AUTH_ISSUER`, e recusa CORS `*` ou origem HTTP.
- Segredos tipados como `SecretStr` (não aparecem em repr/log).
- Logs JSON com mascaramento de `access_token`, `refresh_token`, `client_secret`, `Bearer`, tokens `APP_USR-`/`TG-`, JWT e senha em URL de conexão.
- Log de acesso registra só o path — a query string do callback OAuth contém `code`.
- `X-Request-ID` em toda resposta; erro 500 devolve apenas `request_id`, sem stack trace.
- Headers de segurança na API; `/docs` e `/openapi.json` desligados fora de development.
- Pool de conexões limitado + `statement_timeout` (Bloco 42.8).
- `/health` (liveness) e `/health/ready` (readiness com banco).
- Dockerfile multi-stage, usuário sem privilégio.

## 48.5 Frontend — fundação

- Build **falha** se existir variável `NEXT_PUBLIC_*` com nome de segredo (SECRET, TOKEN, PASSWORD, PARTNER_KEY, SERVICE_ROLE, DATABASE, ENCRYPTION).
- Headers de segurança e `poweredByHeader: false`.
- Pendente para o bloco de UX: CSP com nonce.

## 48.6 CI (GitHub Actions)

```text
backend : ruff → roles/bancos → alembic upgrade → alembic check → pytest → pip-audit
frontend: npm ci → lint → typecheck → build → npm audit
secrets : gitleaks no histórico completo
```

Dependabot semanal (uv, npm) e mensal (actions, docker). Template de PR com a Definition of Done do Bloco 33.

**Ação manual no GitHub:** proteger `main` exigindo os 3 jobs verdes e PR antes do merge.

## 48.7 Propostas pendentes de decisão

| Tema | Proposta | Motivo |
|---|---|---|
| Fila e locks (Bloco 42) | **Postgres-first**: advisory locks para "1 sync por conexão" + fila com `SKIP LOCKED` (ex.: Procrastinate). Sem Redis no MVP | um serviço a menos; lock é liberado sozinho se o worker cair |
| Banco + Auth gerenciados | Supabase na região São Paulo | Postgres + Auth no mesmo lugar; dados no Brasil ajudam no Data Map LGPD |
| Hospedagem da API | Fly.io (região `gru`) ou Railway | container simples, perto do banco |
| Frontend | Vercel | já previsto no Bloco 13 |

## 48.8 Dependências externas com prazo longo — iniciar já

- [ ] Criar app no Mercado Livre Developers (escopos mínimos: leitura + `offline_access` para refresh token). Confirmar se o redirect URI exige HTTPS — se sim, usar túnel local ou staging.
- [ ] Pedir acesso à Shopee Open Platform **no Dia 1** — a aprovação é o item mais lento do plano.
- [ ] Registrar domínio e e-mail de privacidade (Bloco 19.6).
- [ ] Apps e credenciais em nome da entidade do SaaS, não de conta pessoal (Bloco 14.2).

---

# BLOCO 49 — KIT DE DISCOVERY (EXECUTAR ANTES DA INTEGRAÇÃO)

## 49.1 Objetivo

Em **1 semana**, conversar com **5 a 8 sellers do ICP** e responder:

| Hipótese | Pergunta que a entrevista precisa responder |
|---|---|
| H2 Margem | Ele sabe a margem **por produto** sem abrir planilha? |
| H7 Financial Truth | Ele confia no número de lucro que usa hoje? Por quê? |
| H9 Prioridade | A fila "Precisa da sua atenção" faz sentido sem explicação? |
| H8 Cross-channel | Comparar o mesmo produto entre canais é uma dor real? |
| H6 Disposição a pagar | Ele aceita um preço concreto ou um piloto pago? |
| R14 Concorrência | O que ele usa hoje (ERP, SaaS, planilha) e o que isso não responde? |

## 49.2 Recrutamento

**Filtro (todas obrigatórias):**

- vende no Mercado Livre há mais de 6 meses;
- entre 100 e 2.000 pedidos/mês;
- entre 20 e 500 SKUs;
- investe em Ads **ou** faz promoções com frequência;
- é dono ou decide sobre preço/Ads.

**Desqualifica:** menos de 100 pedidos/mês; tem analista/BI dedicado.

**Onde encontrar:** grupos de sellers (WhatsApp, Telegram, Facebook), mentores e agências de marketplace (serve também como teste de canal, R15), LinkedIn e indicação de quem já foi entrevistado.

**Contrapartida sugerida:** diagnóstico gratuito da margem de 5 produtos do entrevistado, feito à mão (Bloco 30). Gera confiança e ensina quais dados o seller realmente tem.

## 49.3 Roteiro (45 minutos)

| Tempo | Etapa | Como |
|---|---|---|
| 0–5 | Abertura | Pedir consentimento para gravar. Avisar que não precisamos de dados de compradores. |
| 5–20 | Contexto | Perguntas 1–17 do Bloco 27.1, priorizando 3, 6, 7, 10, 16 e 17. Pedir para **mostrar** a planilha ou ferramenta. Perguntar sobre a **última vez** que algo aconteceu, nunca "você usaria". |
| 20–35 | Protótipo | Avisar que é uma loja fictícia. Três tarefas, sem ajudar (ver 49.4). |
| 35–42 | Preço | Mostrar **um** preço por entrevistado, em rodízio: R$ 97 / R$ 197 / R$ 297. Ver 49.5. |
| 42–45 | Confiança e fechamento | Pergunta 15 (conectar via API). Pedir indicação de outro seller. |

## 49.4 Tarefas do protótipo

1. **"Descubra qual produto precisa de atenção primeiro."** Sucesso: chega ao Kit 3 Cuecas ou à Garrafa Térmica e explica o motivo.
2. **"Quanto sobrou da Garrafa Térmica no período e para onde foi o dinheiro?"** Sucesso: encontra a decomposição e cita o desconto como principal pressão.
3. **"A Camiseta rende mais no Mercado Livre ou na Shopee?"** Sucesso: usa resultado por unidade ou margem, não apenas receita.

Registrar em cada tarefa: concluiu? em quanto tempo? onde travou? o que perguntou?

Cenários embutidos nos dados de demonstração:

| Produto | Regra exercitada | O que o seller deveria perceber |
|---|---|---|
| Kit 3 Cuecas | R004 (crítico) | Vende muito e quase não contribui |
| Garrafa Térmica | R002 | Cresceu em receita, perdeu margem por desconto |
| Fone Bluetooth X1 | R001 | Conversão caiu com visitas estáveis e preço maior |
| Luminária LED | R005 | Ads subiu sem retorno proporcional |
| Capa Notebook | R006 | Sem custo não há resultado |
| Camiseta / Kit | R003 | Mesmo produto rende diferente entre canais |
| Organizador / Mochila | — | Produtos saudáveis (controle) |

## 49.5 Teste de preço

Perguntas, nesta ordem, registrando a resposta **literal**:

1. "Por R$ X por mês, você assinaria isso hoje para a sua loja?"
2. Se não: "O que precisaria ter para valer R$ X?"
3. Se sim: "Você toparia um piloto pago de 30 dias assim que a integração estiver pronta?"
4. "Qual resultado no seu negócio justificaria essa mensalidade?"

"Eu usaria" **não** conta como validação (princípio 17).

## 49.6 Registro (um por entrevista)

```text
Seller: A, B, C… (nunca nome real neste documento)
Perfil: pedidos/mês · SKUs · canais · ferramenta atual · gasto mensal com ferramentas
Dores citadas espontaneamente (antes do protótipo):
H1…H9: + / − / 0, com uma citação curta cada
Tarefas 1–3: concluiu? tempo · onde travou
Preço apresentado · reação · principal objeção · aceita piloto pago? · faixa máxima
Pediu para continuar usando? Indicou alguém?
```

Gravações e notas brutas ficam **fora do repositório**, em pasta privada, e são apagadas em 90 dias. Neste documento entra apenas o resumo anonimizado (ver Data Map, Bloco 50).

## 49.7 Critérios de leitura definidos antes das entrevistas

Definidos agora para evitar ler os resultados com viés depois.

**Sinal forte para continuar:**

- 3 de 5 ou mais não sabem a margem por produto sem planilha (H2);
- 3 de 5 ou mais concluem a tarefa 1 em menos de 2 minutos e chamam a fila de útil (H9);
- 2 ou mais aceitam piloto pago em alguma faixa testada (H6).

**Sinal de pivô ou parada:**

- a maioria diz que o ERP/ferramenta atual já responde as tarefas 1–3;
- ninguém aceita pagar R$ 97 ou mais;
- a dor mais repetida é outra (registrar qual).

## 49.8 Como mostrar o protótipo

- **Local:** `cd frontend && npm run dev` → http://localhost:3000
- **Remoto (recomendado para entrevistas por vídeo):** publicar o frontend na Vercel. É seguro porque o protótipo é estático, não tem segredos e usa apenas dados fictícios.

---

# BLOCO 50 — THREAT MODEL INICIAL E DATA MAP LGPD

## 50.1 Ativos

| Ativo | Por que importa |
|---|---|
| Tokens OAuth de marketplace | Dão acesso à loja do seller. Ativo mais crítico. |
| Dados financeiros dos sellers | Sigilo comercial: custos, margens, volumes. |
| Dados pessoais de compradores | Risco LGPD. Minimizar ao máximo (50.4). |
| Chaves (`ENCRYPTION_KEY`, client secrets) | Permitem abrir todos os tokens. |
| Contas administrativas | Acesso transversal a todos os tenants. |

## 50.2 Fronteiras de confiança

```text
Navegador ──► Frontend (Vercel) ──► API ──► PostgreSQL
                                     │
                                     ├──► APIs Mercado Livre / Shopee  (saída)
                                     └──◄ Webhooks dos marketplaces     (entrada)
Admin ──► API (fluxo separado, MFA)
GitHub ──► CI ──► Deploy           (cadeia de suprimentos)
```

## 50.3 STRIDE

✅ = já implementado · 🔜 = bloco em que entra

| Categoria | Ameaça | Mitigação | Status |
|---|---|---|---|
| Spoofing | CSRF no callback do OAuth (ligar a conta de outra pessoa) | `state` aleatório vinculado à sessão + PKCE + redirect URI exato | 🔜 OAuth ML |
| Spoofing | Webhook forjado | Validar origem conforme o marketplace. Tratar o webhook só como aviso e **buscar o recurso na API autenticada**, nunca confiar no payload | 🔜 Sync |
| Spoofing | Sequestro de sessão | Cookie `httpOnly` + `Secure` + `SameSite`, JWT curto, validação de issuer/audience | 🔜 Auth |
| Tampering | Alterar custo histórico e "maquiar" margem | Custo versionado + `audit_logs` | 🔜 Custos |
| Tampering | Mass assignment (enviar `tenant_id` ou campos extras) | Schemas Pydantic explícitos; `tenant_id` sempre derivado da sessão | 🔜 Auth |
| Repudiation | "Não fui eu que mudei o custo/permissão" | `audit_logs` com ator, ação, recurso e request_id | 🔜 Auth |
| Info disclosure | Vazamento entre tenants (R05) | Tenant da sessão, queries escopadas, RLS, testes automatizados | 🔜 Auth |
| Info disclosure | Token ou segredo em log | Mascaramento nos logs; log de acesso sem query string | ✅ |
| Info disclosure | Segredo no bundle do navegador | Build falha com `NEXT_PUBLIC_*` de nome sensível | ✅ |
| Info disclosure | Stack trace para o cliente | Erro 500 devolve só `request_id`; `/docs` desligado fora de dev | ✅ |
| Info disclosure | Excesso de dados nas respostas | Schemas de resposta explícitos; nada de devolver modelo do banco direto | 🔜 API |
| DoS | Tempestade de syncs / vizinho barulhento | Rate limit por tenant, fila, lock por conexão (Bloco 42) | 🔜 Sync |
| DoS | Consulta pesada derrubando o banco | Pool limitado + `statement_timeout` | ✅ |
| DoS | 429 dos marketplaces | Backoff com jitter centralizado no connector | 🔜 Sync |
| Elevation | API conseguir ignorar RLS ou alterar schema | Role `app_runtime` sem DDL/BYPASSRLS, protegida por teste | ✅ |
| Elevation | MEMBER virar OWNER | RBAC deny-by-default, testes de permissão | 🔜 Auth |
| Elevation | Dependência comprometida | Lockfiles, Dependabot, `pip-audit`, `npm audit`, gitleaks | ✅ |

## 50.4 Regra de minimização no normalizador

O connector usa uma **allowlist de campos**: só o que está mapeado no modelo interno é persistido. Consequências:

- **Não persistir** nome, CPF/CNPJ, telefone, e-mail ou endereço de comprador. Não chamar endpoints de dados de faturamento do comprador.
- **Pedidos nunca são guardados como JSON bruto.**
- As colunas `raw_metadata_json` (listings) e `raw_json` (ads, ajustes) do Bloco 7 só podem receber payload **filtrado**, sem campos de comprador. Revisar no bloco de modelo de dados.
- O ID do comprador não é necessário no MVP. Se uma análise de recompra entrar no futuro, guardar apenas um hash com sal por tenant.

## 50.5 Data Map (versão inicial — bases legais a validar com jurídico)

| Dado | Origem | Finalidade | Base legal proposta | Onde fica | Quem acessa | Retenção proposta | Exclusão |
|---|---|---|---|---|---|---|---|
| Nome e e-mail do usuário | Cadastro | Autenticação, comunicação do serviço | Execução de contrato | Auth + banco | Usuário; admin com MFA | Enquanto a conta existir | Exclusão da conta |
| Identificação da loja (ID do seller, apelido) | API do marketplace | Vincular a conexão | Execução de contrato | Banco | Backend | Enquanto a conexão existir | Desconexão / exclusão |
| Tokens OAuth | Marketplace | Ler dados em nome do seller | Execução de contrato | Banco, criptografado | Somente backend | Enquanto a integração estiver ativa | Apagar ao desconectar ou revogar |
| Pedidos (IDs, itens, valores, status, datas) | API do marketplace | Cálculo financeiro | Execução de contrato | Banco | Usuários do tenant | Proposta: 24 meses (comparação anual) | Exclusão da conta |
| Custos informados | Seller | Cálculo financeiro | Execução de contrato | Banco | Usuários do tenant | Enquanto a conta existir | Exclusão da conta |
| Dados pessoais do comprador | API do marketplace | **Nenhuma no MVP** | — | **Não coletar** | — | — | — |
| CEP/UF de entrega | API do marketplace | Futuro: análise regional de frete | — | Não persistir no MVP (futuro: só UF) | — | — | — |
| Logs de acesso (IP, ação, data) | Sistema | Segurança e auditoria | Cumprimento de obrigação legal (Marco Civil, art. 15) e legítimo interesse | Logs | Admin | Mínimo 6 meses; máximo a definir | Rotação automática |
| Gravações de entrevistas | Entrevistado | Pesquisa de produto | Consentimento | Pasta privada, fora do repositório | Equipe do projeto | 90 dias; depois só resumo anônimo | Apagar arquivo |
| Dados de cobrança do SaaS (futuro) | Gateway de pagamento | Cobrança | Execução de contrato / obrigação legal | Gateway (suboperador) | Financeiro | Prazo fiscal | Conforme gateway |

## 50.6 Papéis (a confirmar com jurídico e com os termos de cada marketplace)

- **Dados das contas do SaaS** (usuários, logs, cobrança): somos **controladores**.
- **Dados que vêm do marketplace em nome do seller:** o seller é o controlador da própria operação; nós atuamos como **operador**, processando sob instrução dele para gerar as análises. Os termos de desenvolvedor de cada marketplace podem impor obrigações próprias — mapear no DPA.
- **Suboperadores previstos:** hospedagem do banco, hospedagem da API, Vercel, provedor de autenticação, gateway de pagamento (futuro).

---

# BLOCO 51 — DESIGN SYSTEM v0.1 E PROTÓTIPO (EXECUTADO EM 2026-10-08)

## 51.1 Tokens

Os tokens semânticos do Bloco 16.4 foram renomeados para gerar utilitários legíveis no Tailwind 4:

| Bloco 16.4 | Implementado | Exemplo de uso |
|---|---|---|
| `--color-bg` | `canvas` | `bg-canvas` |
| `--color-surface` | `surface` | `bg-surface` |
| `--color-surface-muted` | `surface-muted` | `bg-surface-muted` |
| `--color-text` | `fg` | `text-fg` |
| `--color-text-muted` | `fg-muted` | `text-fg-muted` |
| `--color-border` | `line` | `border-line` |
| `--color-primary` / `-hover` | `primary` / `primary-hover` | `bg-primary` |
| `--color-success/warning/danger/info` | iguais + variação `-soft` para fundos | `bg-danger-soft text-danger` |

- Valores em `frontend/src/app/globals.css`, com tema claro e escuro automáticos (`prefers-color-scheme`).
- Raios conforme o Bloco 16.3 (6/10/14/20 px). Escala de texto com `text-highlight` (32px) e `text-hero` (40px).
- Fonte: Geist. Números sempre com `tabular-nums`.

## 51.2 Componentes entregues

`Button`, `ButtonLink`, `Badge`, `HealthBadge`, `MarketplaceBadge`, `ConnectionStatusBadge`, `Card`, `KpiCard`, `Delta`, `Formula` ("Como calculamos?"), `EmptyState`, `ErrorState`, `Skeleton`, `InsightCard`, `EconomicsBreakdown`, `ProductsTable` (com filtros), `CostsEditor` (com vigência).

**Decisão:** componentes de exibição feitos à mão, sem biblioteca. Componentes interativos complexos (Dialog, Select acessível, DateRangePicker, Tooltip, Toast) entram com shadcn/ui (Radix) quando a primeira tela real precisar deles.

Vitrine: rota `/design`.

## 51.3 Protótipo

Rotas: `/dashboard`, `/produtos`, `/produtos/[id]`, `/custos`, `/conexoes` (inclui o onboarding), `/design`. Tem estados de loading, erro e vazio.

- Os dados vêm de `frontend/src/lib/demo/`. O cálculo ali é **só do protótipo** — o oficial será a Financial Truth Engine no backend.
- `frontend/src/lib/types.ts` é a **proposta de contrato** entre API e frontend (economics, lineage, insights, health).
- `frontend/src/lib/demo/rules.ts` serve de especificação executável das regras R001–R006 para o Analytics Engine.

## 51.4 Health Score hs-0.1 (calibrado nos dados de demonstração)

Começa em 100 e desconta pontos:

| Critério | Pontos |
|---|---|
| Margem estimada abaixo de 5% / 10% / 15% | −60 / −45 / −15 |
| Margem caiu mais de 5 p.p. / mais de 2 p.p. | −25 / −10 |
| Receita caiu mais de 15% / mais de 5% | −15 / −5 |
| Conversão caiu mais de 20% | −15 |
| Ads cresceu mais de 2 p.p. como % da receita | −15 |

Sem custo cadastrado, o score fica "Sem dados".

A calibração garante que **nenhum produto com alerta apareça como "Saudável"** e que margem abaixo de 10% caia na faixa "Crítico".

## 51.5 Limitações conhecidas

- Tela de login (Tela 1) fica para o bloco de Auth, porque depende da escolha do provedor.
- Um ID de produto inexistente mostra a página "não encontrado", mas com HTTP 200: o Next.js já enviou o cabeçalho quando o streaming começa. Aceitável no protótipo; na versão real o 404 virá da API.
- Filtros da lista de produtos não ficam na URL.
- CSP com nonce ainda pendente (Bloco 48.5).

---

# BLOCO 52 — AUTH + TENANT ISOLATION (BACKEND, EXECUTADO EM 2026-10-08)

## 52.1 Decisões

| Tema | Decisão | Motivo |
|---|---|---|
| Provedor de identidade | **Supabase Auth** (decidido em 2026-10-08) | Login pronto (e-mail, magic link, OAuth), MFA disponível, região São Paulo |
| Validação do token | Local, via **JWKS** do Supabase (`/auth/v1/.well-known/jwks.json`), em cache | Sem chamada externa por requisição; o backend não precisa de nenhuma chave secreta do Supabase |
| Algoritmos aceitos | Somente **ES256 e RS256** | Bloqueia confusão de algoritmo (HS256 com chave pública) e `alg: none` |
| Identidade local | Tabela `app.users` com `auth_subject` = `sub` do token | Desacopla do provedor; trocar de provedor não muda o domínio |
| Tenant | Derivado do vínculo `tenant_users`, **nunca** recebido do frontend | Bloco 42.1 |
| Empresas por usuário | Uma no MVP (Bloco 4.1); o modelo já suporta várias | Convites ficam para depois |
| Schema das tabelas | `app` (não `public`) | O Supabase expõe `public` pela Data API; `app` só é acessível pela nossa API |
| Banco de dados no dev | Postgres local continua; Supabase Postgres entra no bloco de deploy | O teste roda offline e o CI não depende de serviço externo |

## 52.2 Isolamento em duas camadas

```text
Camada 1 — aplicação
  token → usuário → vínculo → tenant_id do contexto
  toda consulta filtra por tenant_id (Bloco 42.2)

Camada 2 — banco (RLS)
  a cada transação a API define app.tenant_id / app.user_id / app.auth_subject
  com set_config(..., true) — o valor morre com a transação
  políticas comparam cada linha com esses valores
```

Mesmo que uma consulta da aplicação esqueça o filtro, o banco devolve apenas as linhas do tenant da requisição. Sem contexto, **nenhuma linha** aparece.

| Tabela | Política | Privilégios da `app_runtime` |
|---|---|---|
| `tenants` | só o tenant do contexto | SELECT, INSERT, UPDATE, DELETE |
| `users` | só o próprio usuário | SELECT, INSERT, UPDATE, DELETE |
| `tenant_users` | vínculos do tenant ou do próprio usuário | SELECT, INSERT, UPDATE, DELETE |
| `audit_logs` | eventos do tenant ou do próprio usuário | **somente SELECT e INSERT** (append-only) |

## 52.3 API

| Rota | Quem pode | O que faz |
|---|---|---|
| `GET /api/me` | qualquer usuário autenticado | Cria o usuário local no primeiro acesso; devolve usuário, empresa e papel |
| `POST /api/tenants` | autenticado sem empresa | Cria a empresa e torna o usuário OWNER (409 se já tiver) |
| `GET /api/tenant` | membro | Dados da empresa atual (403 `onboarding_required` se não tiver) |
| `PATCH /api/tenant` | OWNER | Renomeia a empresa; registra auditoria com valor anterior e novo |

Erros seguem um formato único: `{"error": código, "message": texto, "request_id": id}`. Corpos com campos extras são rejeitados (proteção contra mass assignment).

## 52.4 Testes (49 no total, ~3 s)

- **Tokens:** válido; expirado; audiência, emissor ou role errados; sessão anônima; sem `sub`; assinado por outra chave; `kid` desconhecido; HS256; `alg: none`; lixo.
- **API:** provisionamento idempotente; criação de empresa; segunda empresa recusada; mass assignment recusado; onboarding exigido; usuário B não enxerga a empresa de A; MEMBER não renomeia; auditoria gravada.
- **RLS direto no banco:** consulta sem filtro só vê o próprio tenant; sem contexto nada aparece; escrever em outro tenant falha; atualizar linha de outro tenant afeta 0 linhas; `audit_logs` não aceita UPDATE/DELETE; a API não cria objetos no schema.
- **Migrations:** ida e volta (downgrade/upgrade) validada.

## 52.5 Pendências deste bloco

- **Parte 2 (frontend):** tela de login (Tela 1) com Supabase e onboarding "Criar empresa" ligado à API. Depende do projeto Supabase criado.
- **Deploy:** no Supabase Postgres, criar as roles `app_migrator` e `app_runtime` (a API nunca usa `postgres` nem a secret key). Com o pooler em modo *transaction*, desativar prepared statements do asyncpg ou usar o modo *session*.
- **MFA** para contas administrativas (Bloco 18.5) quando existir painel administrativo.
- **Exclusão de conta** (Bloco 19.7) exigirá a secret key do Supabase, somente no backend.

## 52.6 Aprendizado registrado

No Windows, `localhost` tenta IPv6 primeiro; como o Postgres do Docker escuta só em `127.0.0.1`, cada conexão esperava cerca de 2 s. Usar `127.0.0.1` nas URLs locais derrubou a suíte de 90 s para 3 s.

---

# BLOCO 53 — REGRAS DE TRABALHO PARA PESSOAS E AGENTES (OBRIGATÓRIO)

> **Este bloco vale para qualquer pessoa e para qualquer agente de IA, de qualquer modelo ou ferramenta.** O arquivo `AGENTS.md` na raiz aponta para cá. Antes de qualquer tarefa, leia este bloco e os Blocos 40 (princípios), 54, 55 e 56.

## 53.1 Fluxo obrigatório: Issue → Branch → PR → CI → Merge → Deploy

```text
1. Issue        toda tarefa nasce de uma issue no GitHub (Correção, Melhoria ou Nova função)
      ↓
2. Branch       <tipo>/<nº-issue>-<slug>, criada a partir de main atualizada
      ↓
3. Commits      Conventional Commits, pequenos e coerentes
      ↓
4. Pull Request título em Conventional Commits + "Closes #<nº>" na descrição
      ↓
5. CI verde     todos os gates do Bloco 56
      ↓
6. Merge        em main
      ↓
7. Deploy       main é o que vai para produção; PRs geram ambiente de preview
                (quando o pipeline de deploy existir)
```

## 53.2 Issues

| Tipo | Label | Quando usar |
|---|---|---|
| Correção | `bug` | Algo funciona diferente do especificado |
| Melhoria | `enhancement` | Evolução de algo que já existe (qualidade, performance, UX, ferramental) |
| Nova função | `feature` | Capacidade nova para o usuário ou para o sistema |

Labels complementares: área (`backend`, `frontend`, `infra`, `documentation`) e prioridade (`P0`, `P1`, `P2`, Bloco 43.10).

Toda issue tem: **contexto**, **escopo**, **critérios de aceite** verificáveis, **fora de escopo** e o **bloco do Master Plan** relacionado. Use os formulários em `.github/ISSUE_TEMPLATE/`.

## 53.3 Pull Requests

- **Um PR por issue.** Exceção: issues triviais e diretamente relacionadas, todas citadas.
- A descrição **sempre** contém `Closes #<nº>` (ou `Refs #<nº>` quando não fecha a issue).
- O título segue Conventional Commits, por exemplo `feat(auth): tela de login com Supabase`.
- Preencha o template: o que muda, por que, Definition of Done (Bloco 33) e impacto financeiro.
- Nada entra em `main` sem CI verde.

## 53.4 SOLID aplicado a este projeto

| Princípio | Regra prática aqui | Exemplo existente |
|---|---|---|
| **S** — Responsabilidade única | Rotas finas (HTTP ↔ schema); regra de negócio em `services/`; persistência nos modelos/repositórios; cálculo financeiro em funções puras | `api/tenancy.py` só traduz HTTP; a regra está em `services/tenancy.py` |
| **O** — Aberto/fechado | Novo marketplace = **novo connector** que implementa o mesmo contrato; nada muda no domínio nem no dashboard (Bloco 8). Nova regra de insight = nova função registrada, sem editar as outras | Regras R001–R006 independentes em `lib/demo/rules.ts` |
| **L** — Substituição de Liskov | Toda implementação de um contrato passa pela **mesma suíte de contract tests** e pode substituir outra sem quebrar o chamador | `StaticKeyProvider` (testes) substitui `JwksKeyProvider` (produção) |
| **I** — Segregação de interfaces | Protocolos pequenos e específicos (`KeyProvider`, `OrderSource`, `ListingSource`) em vez de um "MarketplaceClient" gigante | `KeyProvider` tem um único método |
| **D** — Inversão de dependência | Camadas de alto nível dependem de abstrações injetadas (`Depends` no FastAPI, props/hooks no frontend), nunca instanciam infraestrutura | `TokenVerifier` recebe um `KeyProvider`; testes trocam via `dependency_overrides` |

Os contratos de arquitetura do Bloco 56 verificam automaticamente as fronteiras entre camadas.

## 53.5 Outras regras de código

- Tipagem estrita: TypeScript `strict`; Python com type hints em tudo que é público.
- Cálculos financeiros são funções puras, determinísticas e cobertas por golden tests (Bloco 9.6).
- `tenant_id` sempre derivado da sessão (Bloco 42.1). Nenhum segredo no frontend (Bloco 18).
- Comentários, commits, PRs e issues em **tom neutro e profissional**. **Não mencionar ferramentas de IA, assistentes ou modelos** em código, commits, PRs ou issues.
- Toda decisão nova vai para este documento, com entrada no CHANGELOG (Bloco 46).

## 53.6 Quem executa o quê

- **Git e merges:** o mantenedor executa `git add`, `commit`, `push` e merge. Agentes **não** fazem commit, push nem merge. Eles preparam o código e entregam a **sequência exata de comandos**, numerada, com pontos de parada para conferir o CI.
- **Issues e consultas:** agentes podem criar e editar issues e consultar status (PRs, CI) via `gh`/API quando o mantenedor pedir ou o fluxo exigir.
- **Antes de entregar,** o agente roda localmente os gates do Bloco 56 que se aplicam e relata o resultado com fidelidade, inclusive falhas.

## 53.7 Checklist do agente ao finalizar uma tarefa

- [ ] Issue existe e está referenciada.
- [ ] Escada do código mínimo e política de testes do Bloco 57 aplicadas.
- [ ] Gates locais rodados (lint, tipos, testes, contratos de arquitetura) e resultados reportados.
- [ ] Interfaces novas seguem o Bloco 54 (motion e estados de carregamento).
- [ ] Erros e operações relevantes instrumentados (Bloco 55).
- [ ] Master Plan e CHANGELOG atualizados, se houve decisão.
- [ ] Nada sensível no diff (`.env`, tokens, dados pessoais).
- [ ] Comandos de branch, commit, push e `gh pr create` (com `Closes #N`) entregues ao mantenedor.

---

# BLOCO 54 — PADRÃO DE MOTION E ESTADOS DE CARREGAMENTO

> Base: skill **design-motion-principles** (github.com/kylezantos/design-motion-principles, MIT). Para **dashboard SaaS** ela define **Emil Kowalski como lente principal** (contenção e velocidade), **Jakub Krehel como secundária** (acabamento sutil) e **Jhey Tompkins só em estados vazios**. As regras abaixo são essa síntese aplicada ao projeto, escritas para que qualquer agente as siga mesmo sem a skill instalada.

## 54.1 Regra de ouro

> "A melhor animação é a que não é notada."

Motion existe para **comunicar estado**: algo carregando, entrando, saindo, progredindo ou respondendo a uma ação. Nunca para enfeitar.

## 54.2 Cobertura obrigatória: todo elemento tem estados definidos

| Situação | Tratamento obrigatório |
|---|---|
| Dado assíncrono (KPI, tabela, gráfico, card) | **Skeleton com a mesma geometria do conteúdo final** (sem layout shift), carregado sob demanda via `Suspense`/streaming. Blocos pesados (gráficos) com `import()` dinâmico |
| Skeleton → conteúdo | Crossfade curto da região (opacidade, 180 ms). Exibir o skeleton só após ~150 ms de espera, para não piscar em respostas rápidas |
| Overlays (modal, sheet, popover, dropdown, toast, tooltip) | Entrada **e** saída animadas; origem no gatilho (`transform-origin`) |
| Itens que entram/saem de listas por ação do usuário | Entrada e saída animadas do item afetado (não da lista inteira) |
| Ação que leva mais de 300 ms | Estado *pending* no próprio botão (rótulo + indicador) e desabilitado contra duplo clique |
| Processo longo com etapas conhecidas (sync, importação) | **Barra de progresso determinada** (easing `linear`), com etapa atual em texto |
| Processo de duração desconhecida | Indicador indeterminado discreto + texto do que está acontecendo |
| Troca de estado de ícone (copiar → copiado, carregando → pronto) | Crossfade com opacidade + escala 0,9 → 1 |
| Hover e foco | Transição de cor/sombra de 120–150 ms |
| Clique em botão primário | `scale(0.97)` no `:active` |

**Conteúdo estático** (títulos, parágrafos, navegação, rótulos) aparece **instantaneamente**. O estado dele é "presente", sem animação de montagem: a skill classifica animar texto estático no mount como antipadrão, porque atrasa a leitura.

## 54.3 Tokens de motion

```css
--motion-duration-instant: 0ms;     /* ações por teclado, alta frequência */
--motion-duration-fast:    120ms;   /* hover, press, troca de ícone */
--motion-duration-base:    180ms;   /* popover, dropdown, toast, crossfade */
--motion-duration-slow:    260ms;   /* modal, sheet, troca de região inteira */
--motion-ease-out:    cubic-bezier(0.23, 1, 0.32, 1);    /* entrada */
--motion-ease-in:     cubic-bezier(0.55, 0, 1, 0.45);    /* saída */
--motion-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);   /* mudança de estado visível */
--motion-ease-linear: linear;                             /* progresso, loops */
```

- **Entrada:** opacidade 0 → 1 + `translateY(4–8px)` → 0, com `ease-out`.
- **Saída:** mais sutil e mais curta (cerca de 70% da duração, `translateY(-4px)`, `ease-in`).
- **Teto:** 300 ms para qualquer animação de interface.
- **Springs:** somente com `bounce: 0`.

## 54.4 Proibido (antipadrões da skill)

- Indicadores pulsando (`animate-pulse` em pontos, badges ou status).
- Blur na entrada de vários componentes da mesma tela (≥ 3). Blur só em modal ou destaque único.
- `hover:scale` em grades de cards ou em todos os botões.
- Stagger em listas utilitárias (tabelas, filtros, resultados). No máximo um momento intencional por tela.
- Fade-in idêntico em 4 ou mais componentes da mesma tela.
- Bounce em ações utilitárias (dropdown, toggle, modal).
- Animar a partir de `scale(0)` (usar ≥ 0,9).
- Animar ações iniciadas por teclado.
- Easing padrão do CSS (`ease`, `ease-in-out`) no lugar dos tokens.
- Animar `width`, `height`, `top`/`left`. Animar apenas `transform`, `opacity` e `clip-path`.

## 54.5 Acessibilidade (inegociável)

- `prefers-reduced-motion: reduce` desliga animações e preserva o estado final (já implementado em `globals.css`).
- Motion funcional precisa ter alternativa sem movimento (texto, ícone, mudança de cor).
- Loops (indeterminados) param quando o processo termina e respeitam o reduced motion.

## 54.6 Implementação e auditoria

- **CSS nativo por padrão** (Bloco 57.2: plataforma antes de dependência). Transitions são interrompíveis; entrada e saída usam `@starting-style` e `transition-behavior: allow-discrete`; overlays usam `<dialog>` e a Popover API do navegador.
- A biblioteca Motion (`motion/react`) só entra se um caso concreto não puder ser resolvido com CSS (por exemplo, layout compartilhado entre componentes), com a justificativa no PR.
- Componentes base do Design System recebem os estados prontos: `Skeleton`, `Fade`/`Presence`, `ProgressBar`, `Button` com `pending`, `Toast`.
- Todo PR com interface passa por **auditoria de motion** usando os itens 54.2 e 54.4 como checklist. Com a skill disponível, rodar o modo *Audit*.

---

# BLOCO 55 — OBSERVABILIDADE

## 55.1 Arquitetura

```text
Backend (FastAPI)  ─┐                      ┌─► Datadog   ─┐
Frontend (Next.js) ─┼─ OpenTelemetry (OTLP)┼─► New Relic ─┼─ escolher UM por ambiente
Workers (sync)     ─┘                      └─► outro OTLP ─┘

Backend + Frontend ── Sentry ── erros, stack traces sanitizados, releases
```

| Ferramenta | Papel | Decisão |
|---|---|---|
| **OpenTelemetry** | Padrão de instrumentação neutro: traces, métricas e logs | **Obrigatório.** Toda instrumentação usa OTel, nunca SDK proprietário |
| **Sentry** | Rastreamento de erros (backend e frontend) e performance do frontend | **Obrigatório** desde o piloto (plano gratuito atende) |
| **Datadog** | Backend de observabilidade (recebe OTLP) | Suportado por configuração |
| **New Relic** | Backend de observabilidade (recebe OTLP) | Suportado por configuração |

**Frontend no MVP (v0.10):** o Sentry já cobre erros e performance do navegador. OpenTelemetry no frontend só entra quando houver uma pergunta que o Sentry não responda (Bloco 57.2). No backend, OTel continua obrigatório.

**Por que não ligar Datadog e New Relic juntos:** os dois cobram por volume e fazem a mesma função. Com OTel, trocar de um para o outro é mudar duas variáveis de ambiente (`OTEL_EXPORTER_OTLP_ENDPOINT` e o header de chave). O guardrail de custo do Bloco 45.3 manda escolher **um** por ambiente.

## 55.2 O que instrumentar

- **Traces:** requisições HTTP, queries SQL (SQLAlchemy), chamadas externas (httpx para Mercado Livre e Shopee), jobs de sync.
- **Métricas** (Bloco 25): `sync_success_total`, `sync_failure_total`, `sync_duration`, `api_external_error`, `insights_generated`, `connections_active`, latência e erros por rota.
- **Correlação:** `request_id` e `trace_id` em todos os logs JSON.
- **Atributos de span:** `tenant_id` como atributo de baixa sensibilidade, para investigar *noisy neighbor*. Nunca e-mail, nome ou token.

## 55.3 Privacidade e segurança (LGPD)

- Sentry com `send_default_pii=False` e `before_send` aplicando o mesmo mascaramento dos logs (`app.core.logging.redact`).
- Nenhum token, segredo, dado de comprador ou corpo de requisição em spans, breadcrumbs ou eventos.
- Sentry, Datadog e New Relic são **suboperadores**: entram no Data Map (Bloco 50.5).

## 55.4 Amostragem e ambientes

- **Erros:** 100%. **Traces em produção:** 10–20%, ajustável por env. Development: exportação desligada por padrão.
- `release` = SHA do commit, `environment` = `APP_ENV`.

---

# BLOCO 56 — QUALIDADE DE CÓDIGO E TESTES (QUALITY GATES)

## 56.1 Ferramentas

| Categoria | Frontend (TypeScript) | Backend (Python) | Quando roda |
|---|---|---|---|
| Lint + formatação | **Biome** (substitui ESLint e Prettier) | Ruff | CI em todo PR + pre-commit |
| Tipos | `tsc --noEmit` (strict) | type hints (checagem estática em issue futura) | CI |
| Contratos de arquitetura | **dependency-cruiser** | **import-linter** | CI |
| Código e dependências mortas | **Knip** | — | CI |
| Mensagens de commit | **commitlint** (Conventional Commits) | idem | CI (commits do PR + título) e hook local |
| Testes unitários | **Vitest** + Testing Library | pytest | CI |
| Integração | Vitest | pytest + Postgres real (já existe) | CI |
| End-to-end | **Playwright**: só os fluxos críticos do Bloco 24 + verificação de acessibilidade (axe) | — | CI |
| Cobertura | **Codecov**: relatório informativo, sem bloquear por porcentagem (Bloco 57.5) | **Codecov** | CI |
| Testes de mutação | **Stryker** (StrykerJS) | **mutmut** | Agendado (semanal) e manual — lentos demais para cada PR |
| Segurança | npm audit, gitleaks | pip-audit, gitleaks | CI (já existe) |

"Arch-contract" foi implementado como contratos de dependência entre camadas: **dependency-cruiser** no TypeScript e **import-linter** no Python, as ferramentas maduras de cada ecossistema.

## 56.2 Contratos de arquitetura (iniciais)

**Backend:**

```text
api        → pode usar: services, schemas, auth, core
services   → pode usar: models, auth.db_context, core     (nunca api)
models     → pode usar: core                              (nunca services/api)
core       → não depende de api, services, auth, models
integrations/<marketplace> → nunca importa outro marketplace
```

**Frontend:**

```text
components/ui   → não importa components/app, app/, lib/demo
components/app  → não importa app/
lib/            → não importa components/ nem app/
lib/demo        → nunca importado por código de produção fora do protótipo
sem dependências circulares
```

## 56.3 Metas

> Revisado na v0.10 (Bloco 57.5): cobertura deixa de ser meta global. Metas de porcentagem incentivam testes que não protegem nada.

| Métrica | Meta | Bloqueia merge? |
|---|---|---|
| Lógica de risco nova ou alterada com teste que falha quando ela quebra | 100% | Sim, na revisão |
| Cobertura de linhas nos módulos de risco (cálculo, health score, regras; depois finanças e auth do backend) | ≥ 90% | Sim |
| Mutation score nos módulos de risco | ≥ 80% | Sim, quando a #20 estiver implementada |
| Cobertura de patch e do projeto | Apenas relatório | Não |
| Fluxo E2E crítico | 100% verde | Sim |

## 56.4 Estado de implementação

| Ferramenta | Issue | Estado |
|---|---|---|
| Biome | #11 | ✅ Implementado (v0.8) |
| Vitest | #12 | ✅ Implementado (v0.9) |
| commitlint | #13 | ✅ Implementado (v0.11) |
| Codecov | #14 | Pendente |
| dependency-cruiser / import-linter | #15 | Pendente |
| Playwright | #17 | Pendente |
| Stryker / mutmut | #20 | Pendente |
| Knip | #21 | Pendente (prioridade elevada para P1 na v0.10) |

### Vitest: como está organizado

- Dois projetos em `frontend/vitest.config.mts`: **unit** (lógica em `src/lib`, ambiente Node) e **components** (componentes em `src/components`, ambiente jsdom). Separar derrubou a suíte de 55 s para menos de 1 s na parte de lógica.
- Testes ficam ao lado do código (`*.test.ts` / `*.test.tsx`).
- Cobertura v8 com meta mínima apenas nos módulos de risco (`economics`, `health`, `rules`): linhas, funções e statements 90%, ramos 85%. O build falha se cair. Os outros arquivos aparecem no relatório sem meta.
- `rules.test.ts` protege os cenários do protótipo de discovery (Bloco 49.4): se um ajuste nos dados de demonstração quebrar um cenário usado nas entrevistas, o teste falha.
- Componentes assíncronos de servidor não rodam no Vitest; são cobertos pelos testes E2E (#17).

### Biome: o que substitui o ESLint

- **Configuração:** `frontend/biome.json`, com preset `recommended` + domínios `react`, `next`, `project`, `test` e `playwright`. Acessibilidade (`a11y`) em nível de erro; imports e variáveis não usados, `console.log` e non-null assertion proibidos.
- **Comandos:** `npm run check` (CI usa `biome ci`) e `npm run check:fix`.
- **Pre-commit:** hook local que roda o Biome dentro de `frontend/`.
- **Diferença em relação ao ESLint:** algumas regras específicas do `eslint-config-next` não têm equivalente exato. O domínio `next` cobre as principais (imagens, `<head>`, scripts) e o build do Next.js continua validando o resto.
- **Exceção documentada:** `!important` no bloco de reduced motion de `globals.css`, com comentário de justificativa.

## 56.5 Pré-requisitos do mantenedor

| Ferramenta | O que é preciso |
|---|---|
| Codecov | Conectar o repositório e salvar `CODECOV_TOKEN` nos secrets do GitHub |
| Sentry | Projeto criado; `SENTRY_DSN` como secret |
| Datadog ou New Relic | Somente quando houver deploy; chave como secret |

---

# BLOCO 57 — CÓDIGO MÍNIMO E TESTES POR RISCO (ANÁLISE PONYTAIL)

> Base: **Ponytail** (github.com/DietrichGebert/ponytail, licença MIT), regras para agentes de código que escrevem apenas o necessário sem cortar validação, segurança ou acessibilidade. O benchmark publicado pelo projeto (39 tarefas, 5 execuções cada) mediu cerca de metade do código e dos tokens de saída, com mais lógica de risco testada (98% contra 68%) e testes que pegam mais bugs injetados (66% contra 46%). Este bloco adapta essas regras ao projeto e vale para pessoas e agentes de qualquer modelo.
>
> **Objetivo declarado (2026-10-10):** gastar o mínimo de tempo e de tokens com testes e código que não protegem nada.

## 57.1 A regra

> Escrever só o que a tarefa precisa. Nunca cortar: validação nas fronteiras de confiança, tratamento de erro que evita perda de dados, segurança, acessibilidade, nem nada que foi pedido.

O código fica pequeno porque é o necessário, não porque foi espremido. Uma linha que precisa ser decifrada não é curta.

## 57.2 Escada antes de escrever código

Primeiro entender o problema e ler o código que a mudança toca (chamadores, testes, fixtures, configuração). Depois parar no **primeiro degrau que resolve por completo**:

1. **Precisa existir?** Funcionalidade, opção ou flexibilidade que ninguém pediu fica de fora, citada em uma linha.
2. **Já existe no projeto?** Um helper, componente, serviço ou padrão. Use do jeito que o código ao redor usa.
3. **A biblioteca padrão ou a plataforma resolvem?** Por exemplo `Intl`, `<dialog>`, `<input type="date">`, `@starting-style`, `<details>`.
4. **Uma dependência já instalada resolve?** Nunca adicionar dependência para poucas linhas.
5. **Cabe em uma linha legível?**
6. **Só então** o mínimo de código que funciona.

Sem abstração, wrapper, opção, configuração ou código "para depois" que ninguém pediu. Apagar vale mais que adicionar. A estrutura existente (camadas, interfaces, convenções, SOLID do Bloco 53.4) é mantida.

## 57.3 Quando escrever teste

**Obrigatório, com um bom teste por comportamento:**

| Tipo de lógica | Exemplo no projeto |
|---|---|
| Ramificação ou laço com regra de negócio | Regras R001–R006, Health Score, ordenação da fila |
| Dinheiro | Cálculo de resultado, comissões, custos versionados, ajustes |
| Segurança, autenticação e tenant | Validação de token, RLS, RBAC, mascaramento de logs |
| Parser ou conversão de dados externos | Normalizadores dos marketplaces, CORS por lista |
| Escrita de dados | Criação de tenant, vigência de custo, idempotência |
| Correção de bug | Um teste que reproduz o bug e falha sem a correção |

**Não escrever:**

- teste que só confere que a prop passada aparece na tela;
- teste do framework, do navegador ou da biblioteca padrão (Intl, atributos HTML, roteador);
- snapshot de componente visual;
- teste que repete outro em outra camada sem cobrir um caminho novo;
- teste escrito só para subir a porcentagem de cobertura.

Atributos de acessibilidade são obrigatórios no código, mas verificados pelo E2E com axe (#17), não por teste unitário de atributo.

## 57.4 Como é um bom teste

- **Falha para um bug plausível:** comparação invertida, `if` removido, erro de fronteira (off-by-one), sinal trocado. Se nenhuma dessas mutações faz o teste falhar, ele não protege nada.
- **Fronteiras com tabela** (`it.each` / `pytest.mark.parametrize`) em vez de testes copiados.
- **O nome descreve o comportamento** ("não calcula resultado sem custo"), não a implementação.
- **Valores conferidos à mão** em cálculos (golden case), nunca o valor copiado da própria saída do código.

## 57.5 Cobertura e mutação

- **Cobertura é relatório, não meta.** A única meta de porcentagem fica nos módulos de risco (Bloco 56.3).
- **A qualidade dos testes é medida por mutação** (#20): o mutation score diz quantos bugs injetados os testes pegam.
- **Codecov** mostra a cobertura no PR para informar a revisão, sem bloquear merge por porcentagem.

## 57.6 Economia de tokens ao executar testes (agentes)

- **Durante o trabalho,** rodar só o que a mudança afeta:
  - frontend: `npx vitest related <arquivos>` ou `npx vitest run <arquivo>`;
  - backend: `uv run pytest tests/<arquivo>.py -k <nome>`.
- **Antes de entregar,** a suíte completa **uma vez**.
- **Ler só as falhas:** `vitest --reporter=dot` e `pytest -q`. Não colar saídas inteiras na conversa.
- **Não gerar testes em lote** nem reescrever testes que já passam sem motivo.

## 57.7 Fechamento de toda entrega

Toda resposta de entrega termina com uma ou duas linhas: **o que não foi feito ou verificado e qual risco o mantenedor precisa saber.**

## 57.8 Atalhos conscientes

Um atalho com limite conhecido recebe um comentário no código, no formato:

```text
shortcut: <o limite>, <quando evoluir>
```

Exemplo: `# shortcut: lock em memória por processo, trocar por advisory lock do Postgres ao ter 2+ workers`.

## 57.9 Revisão de código

Ordem de importância: **correto → seguro → aguenta a carga esperada → testado → rápido → enxuto.**

Cada apontamento precisa de um **caso concreto** ("esta entrada leva a este resultado errado"). Sem caso, não é apontamento.

## 57.10 Aplicação inicial (2026-10-10, issue #28)

A suíte passou de **140 para 121 testes** (frontend 91 → 75; backend 49 → 46). Removidos os que não protegiam lógica de risco; os testes de `Delta` viraram uma tabela que agora cobre também o caso "queda é boa":

| Removido | Motivo |
|---|---|
| Frontend: `ButtonLink`, `type submit`/`disabled`, `KpiCard` (renderiza props), `EmptyState`, `MarketplaceBadge`, `HealthBadge` sem score | Conferem que a prop aparece na tela |
| Frontend: `ErrorState` com `role=alert`, `Skeleton` e ícone do `Badge` com `aria-hidden` | Atributo estático; acessibilidade passa a ser verificada pelo axe no E2E (#17) |
| Frontend: `formatBRL`, `formatBRLRounded`, `formatInt`, `formatPct` | Testavam o `Intl` do JavaScript |
| Frontend: `getProduct` | Busca trivial em lista |
| Frontend: "omite custo adicional quando é zero" | Ramo só de exibição, sem efeito no resultado |
| Frontend: estado vazio da tabela e cancelar edição de custo | Renderização condicional sem regra |
| Frontend: `Delta` em pontos percentuais | Repetia o teste de `formatPP` |
| Backend: liveness, request id gerado, DDL no schema `public` | Trivial ou já coberto por outro teste (rejeição de request id inseguro; DDL no schema `app`) |

**Mantidos integralmente:** todos os testes de segurança (tokens, RLS, mascaramento, CORS, headers), de dinheiro (golden case, ajustes, Ads fora do resultado), de regras R001–R006, da fila e dos cenários do protótipo.

**Ajustes de escopo decorrentes:**
- **#14 (Codecov):** só relatório.
- **#16 (motion):** CSS nativo antes da biblioteca Motion.
- **#17 (Playwright):** só fluxos críticos + axe.
- **#19 (OpenTelemetry):** só backend no MVP.
- **#21 (Knip):** P2 → P1, porque apagar código morto é a forma mais barata de reduzir manutenção.

# PRÓXIMO PASSO

O próximo bloco de trabalho não deve ser código de integração.

Deve ser:

> **BLOCO A — Product Discovery + desenho das 5 telas principais + Design System v0.1 + Threat Model/LGPD Data Map.**

Depois:

> **BLOCO B — Fundação técnica e Mercado Livre OAuth.**

Essa sequência evita começarmos pela API e descobrirmos depois que construímos o produto errado.

> **Atualização v0.4:** a parte de infraestrutura do Bloco B (Bloco 48) foi adiantada em paralelo porque não depende do resultado do discovery. Código de integração e domínio continua **depois** do Bloco A.

> **Atualização v0.5:** o material do Bloco A está pronto (Blocos 49–51). Falta a parte que só o time pode fazer: **as entrevistas**. Enquanto elas acontecem, o bloco técnico seguinte é **Auth + Tenant isolation**, que é necessário em qualquer cenário.

---

# CHANGELOG

## v0.11

- commitlint valida Conventional Commits nos commits e no título de todo PR, num job próprio do CI (issue #13);
- o título do PR chega ao script por variável de ambiente, para que texto livre nunca seja executado no runner;
- hook local `commit-msg` no pre-commit usando o Node do sistema; os outros hooks rodam só antes do commit (`default_stages`);
- sem `package.json` na raiz: as ferramentas são baixadas com versão fixada via `npx` (Bloco 57.2);
- todo o histórico do repositório validado contra as regras.

## v0.10

- adicionado Bloco 57 — código mínimo e testes por risco, a partir da análise do Ponytail (issue #28);
- cobertura deixa de ser meta global; a meta de porcentagem fica só nos módulos de risco e a qualidade dos testes passa a ser medida por mutação (Bloco 56.3);
- suíte de 140 para 121 testes, com o motivo de cada remoção registrado (Bloco 57.10); nenhum teste de segurança, dinheiro ou regra removido;
- motion com CSS nativo antes da biblioteca Motion (Bloco 54.6); OpenTelemetry no frontend adiado (Bloco 55.1);
- Definition of Done e checklist do agente atualizados (Blocos 33 e 53.7).

## v0.9

- Vitest + Testing Library no frontend, com projetos separados para lógica e componentes e meta de cobertura em `src/lib` (issue #12);
- 91 testes: formatação, cálculo de resultado (golden case), health score, regras R001–R006 com cenários positivos e negativos, priorização da fila, cenários do protótipo e componentes;
- corrigido bug de acessibilidade encontrado pelos testes: o nome dos botões do editor de custos era anunciado como "Alterarde ..."; agora usa `aria-label` explícito;
- montagem de produto extraída para `lib/demo/product.ts` (responsabilidade única);
- `@types/node` alinhado ao Node 24 usado no projeto e no CI.

## v0.8

- Biome substitui ESLint no frontend (lint, formatação e imports), no CI e no pre-commit (issue #11);
- corrigidos os apontamentos do Biome: componente de erro sombreando o `Error` global, chaves por índice em listas e `role="search"` trocado pelo elemento `<search>`;
- adicionada a tabela de estado de implementação dos quality gates (Bloco 56.4).

## v0.7

- decidido: foco exclusivo em quem vende no Mercado Livre e na Shopee; afiliados viram produto separado ou módulo futuro (Bloco 31, V7);
- adicionado Bloco 53 — regras de trabalho para pessoas e agentes: fluxo Issue → Branch → PR (`Closes #N`) → CI → Merge → Deploy, tipos de issue, SOLID aplicado, quem executa o quê;
- adicionado Bloco 54 — padrão de motion e estados de carregamento, baseado na skill design-motion-principles (lente principal: contenção para SaaS);
- adicionado Bloco 55 — observabilidade: OpenTelemetry obrigatório, Sentry obrigatório, Datadog ou New Relic como backend OTLP (um por ambiente);
- adicionado Bloco 56 — quality gates: Biome, dependency-cruiser, import-linter, Knip, commitlint, Vitest, Playwright, Codecov, Stryker e mutmut;
- Blocos 23, 33 e 36 atualizados (branch por issue, Definition of Done ampliada, exceções de arquivos de entrada).

## v0.6

- decidido: Supabase Auth como provedor de identidade (Bloco 52);
- adicionado Bloco 52 — validação de token via JWKS (ES256/RS256), usuários/tenants/vínculos/auditoria no schema `app`, RLS em duas camadas, rotas `/api/me`, `/api/tenants`, `/api/tenant`;
- audit_logs passa a ser append-only no nível de privilégio do banco;
- formato único de erro da API;
- URLs locais do banco trocadas para `127.0.0.1`.

## v0.5

- adicionado Bloco 49 — kit de discovery: recrutamento, roteiro de 45 min, tarefas no protótipo, teste de preço, registro e critérios de leitura definidos antes das entrevistas;
- adicionado Bloco 50 — threat model STRIDE, regra de minimização por allowlist no normalizador e Data Map LGPD inicial;
- adicionado Bloco 51 — Design System v0.1 (tokens, 17 componentes, vitrine `/design`) e protótipo navegável com dados de demonstração;
- adicionada regra R006 (sem custo cadastrado) ao Bloco 10;
- Health Score hs-0.1 definido e calibrado;
- decidido: componentes de exibição sem biblioteca; shadcn/ui (Radix) só para componentes interativos complexos;
- registrado risco: colunas `raw_*_json` do Bloco 7 só podem receber payload filtrado.

## v0.4

- adicionado Bloco 47 — análise de mercado: tamanho, evidências de dor, mapa de concorrentes e preços;
- registrado que "lucro por pedido" é commodity; diferenciação passa a depender de priorização em R$, lineage e cross-channel;
- adicionados riscos R14 (commoditização) e R15 (canal de aquisição); faixas de WTP R$ 97/197/297;
- adicionadas perguntas 16 e 17 ao roteiro de discovery;
- adicionado Bloco 48 — infraestrutura executada: monorepo, Postgres com roles separadas, fundação do backend, frontend com trava de segredos, CI;
- decidido: `docs/` não será criado (Bloco 36 prevalece sobre o Bloco 22);
- decidido: driver `asyncpg`; Python 3.13 via uv; Postgres local na porta 5440;
- propostas abertas: fila/locks Postgres-first, Supabase São Paulo, Fly.io/Railway.

## v0.3

- reposicionado o produto para Financial Intelligence + visão multicanal + priorização;
- ICP estreitado para seller pequeno profissionalizado;
- Mercado Livre definido como caminho crítico do MVP e Shopee movida para P1;
- Mercado Livre MVP definido como read-only/menor privilégio;
- Financial Engine substituída por Financial Truth Engine;
- separados venda operacional, receita atribuída, resultado estimado e futuro resultado conciliado;
- adicionados cancelamentos, devoluções, reembolsos, ajustes e data lineage;
- schema ampliado para master product + variants + listing variants;
- adicionado MFA para acesso administrativo privilegiado;
- adicionado critério de willingness-to-pay com preço concreto;
- plano de 14 dias revisado com Feature Freeze no dia 11;
- adicionado guardrail econômico de infraestrutura e unit economics;
- adicionados riscos de competição nativa, erro financeiro, ICP sem poder de compra e consultoria não escalável.

## v0.2

- consolidado o princípio de documento único / Single Source of Truth;
- adicionada regra permanente para incorporar toda nova decisão no mesmo MD;
- fortalecido multi-tenancy com tenant derivado da sessão, queries scoped e índices compostos;
- adicionadas constraints explícitas de idempotência;
- adicionado suporte conceitual a `Idempotency-Key`;
- adicionados distributed locks para sincronização;
- adicionadas filas, limites de concorrência e proteção contra noisy neighbor;
- adicionados rate limits por tenant/endpoint e controle de connection pool;
- adicionados testes específicos de concorrência, duplicidade e isolamento;
- adicionada governança de features EXPERIMENTAL/VALIDATING/STABLE/FROZEN;
- adicionado Stable Core e regras para evitar reescrita desnecessária;
- adicionados Golden Tests e Contract Tests;
- definido Feature Freeze no dia 11;
- formalizado prazo de 14 dias para piloto e horizonte de 30–45/60–90 dias.

## v0.1

- visão inicial;
- posicionamento;
- MVP;
- arquitetura;
- modelo de dados;
- engine financeira;
- analytics;
- Design System;
- segurança;
- LGPD;
- plano de 14 dias;
- validação;
- backlog.
