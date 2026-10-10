Closes #

<!-- Obrigatório: número da issue (Bloco 53). Use "Refs #" se o PR não fecha a issue. -->

## O que muda

<!-- Descreva a mudança e o bloco do Master Plan relacionado. -->

## Por que

<!-- Qual dor, requisito ou risco esta mudança resolve? -->

## Definition of Done (Bloco 33)

- [ ] Requisito definido no Master Plan
- [ ] SOLID respeitado e contratos de arquitetura verdes (Blocos 53.4 e 56)
- [ ] Estados de skeleton, entrada, saída e progresso com reduced motion (Bloco 54), quando houver UI
- [ ] Autorização e isolamento por tenant verificados
- [ ] Lógica de risco tem teste que falha quando ela quebra; nenhum teste trivial (Bloco 57)
- [ ] Erros capturados e operações relevantes instrumentadas (Bloco 55)
- [ ] Logs adequados, sem token, segredo ou PII
- [ ] LGPD avaliada (novos dados pessoais? finalidade? retenção?)
- [ ] Nenhum segredo exposto (`.env`, `NEXT_PUBLIC_*`)
- [ ] Master Plan / CHANGELOG atualizados se houve decisão nova

## O que não foi feito ou verificado / riscos (Bloco 57.7)

<!-- Uma ou duas linhas. -->

## Impacto financeiro

- [ ] Esta mudança **não** altera cálculos financeiros
- [ ] Esta mudança altera cálculos financeiros e os golden tests foram revisados
