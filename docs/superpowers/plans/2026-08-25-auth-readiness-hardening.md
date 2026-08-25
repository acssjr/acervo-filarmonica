# Auth Readiness Hardening Implementation Plan

> **For agentic workers:** Execute inline in the current branch. The user explicitly requested implementation without TDD; tests are added and run after the code changes.

**Goal:** Corrigir o rate limit da consulta de usuário, as mensagens de erro do login, o health check e a comparação de esquema no Windows.

**Architecture:** Um contador atômico no D1 preservará a janela de 5 tentativas de login por 5 minutos; três bindings nativos do Cloudflare Workers conterão abuso geral e aplicarão limites independentes à consulta de usuário e ao tracking. A rota de consulta traduzirá falha de configuração em `503`; o frontend distinguirá respostas por status e descartará respostas obsoletas; o health check fará uma verificação de prontidão sem expor segredos.

**Tech Stack:** Cloudflare Workers, KV, D1, React, Jest, Vitest e Node.js.

---

### Task 1: Separar os limites de login e consulta de usuário

**Files:**
- Modify: `worker/src/config/constants.js`
- Modify: `worker/src/infrastructure/ratelimit/rateLimiter.js`
- Modify: `worker/src/domain/auth/loginService.js`
- Test: `worker/tests/security.test.ts`

- [ ] Adicionar constantes de 30 consultas por 60 segundos.
- [ ] Configurar o contador atômico de login e bindings nativos independentes para contenção geral, consulta de usuário e tracking.
- [ ] Usar o limite próprio em `checkUser` e responder `503` para erro de configuração.
- [ ] Cobrir limites padrão, personalizado e falha de configuração.

### Task 2: Corrigir o estado visual da consulta de usuário

**Files:**
- Modify: `frontend/src/hooks/useLoginForm.js`
- Modify: `frontend/src/screens/LoginScreen.jsx`
- Test: `frontend/src/screens/LoginScreen.test.jsx`

- [ ] Criar estado separado para falha de verificação.
- [ ] Tratar `429`, `503` e falha de rede sem ativar `userNotFound`.
- [ ] Exibir a mensagem técnica abaixo do campo e manter o PIN disponível.
- [ ] Cobrir usuário ausente, limite excedido e indisponibilidade.

### Task 3: Transformar health em readiness check

**Files:**
- Modify: `worker/src/routes/healthRoutes.js`
- Test: `worker/tests/routes.test.ts`

- [ ] Verificar `SELECT 1` no D1.
- [ ] Verificar a presença de `BUCKET`, `DB`, da tabela de login, dos três bindings nativos e de `JWT_SECRET`.
- [ ] Retornar `200/status ok` quando pronto e `503/status unavailable` quando incompleto.
- [ ] Não retornar identificadores nem valores de segredos.

### Task 4: Normalizar o esquema no Windows

**Files:**
- Modify: `scripts/generate-test-schema.cjs`

- [ ] Normalizar CRLF para LF antes da comparação em `--check`.
- [ ] Confirmar 3 migrações e 64 statements sem reescrever o arquivo gerado.

### Task 5: Verificação final

- [ ] Executar lint, contratos, schema check e 146+ testes do Worker.
- [ ] Executar lint, 314+ testes, typecheck e build do frontend.
- [ ] Publicar Worker e frontend somente após todas as verificações locais.
- [ ] Confirmar health `200`, check-user existente `200` e token inválido `401` em produção.
