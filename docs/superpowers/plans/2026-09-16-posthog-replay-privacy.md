# PostHog Replay Privacy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar textos e buscas nas gravações de sessão sem expor nenhum PIN.

**Architecture:** A configuração central do PostHog deixa de mascarar globalmente texto e inputs, mas mantém o mascaramento nativo de campos `password`. Todos os componentes que recebem PIN também usam `data-private`, cobrindo inclusive os campos administrativos que hoje são de texto.

**Tech Stack:** React, Vite, posthog-js, Jest, ESLint.

---

### Task 1: Ajustar a política central de gravação

**Files:**
- Modify: `frontend/src/services/posthog.js`
- Create: `frontend/src/services/posthog.test.js`

- [x] **Step 1:** Extrair a configuração para `createPostHogConfig`, definir `mask_all_text: false`, `maskAllInputs: false`, `maskInputOptions: { password: true }` e remover `maskTextSelector: '*'`.
- [x] **Step 2:** Adicionar teste que verifica a política de replay e a permanência de `blockSelector`.
- [x] **Step 3:** Executar `npm test -- --runInBand src/services/posthog.test.js` dentro de `frontend`; esperado: todos os testes do arquivo passam.

### Task 2: Proteger explicitamente todos os PINs

**Files:**
- Modify: `frontend/src/components/login/PinInput.jsx`
- Modify: `frontend/src/components/modals/ChangePinModal.jsx`
- Modify: `frontend/src/screens/LoginScreen.jsx`
- Modify: `frontend/src/screens/admin/modals/ResetPinModal.jsx`
- Modify: `frontend/src/screens/admin/modals/UsuarioFormModal.jsx`

- [x] **Step 1:** Adicionar `data-private="true"` a cada input que recebe PIN e remover o bloqueio amplo do cartão de login.
- [x] **Step 2:** Verificar por busca que todos os inputs de PIN usam `type="password"` ou `data-private="true"`.

### Task 3: Validar e publicar no PR

**Files:**
- Modify: `docs/superpowers/plans/2026-09-16-posthog-replay-privacy.md`

- [x] **Step 1:** Executar lint e testes do frontend.
- [x] **Step 2:** Executar o build com o token local do projeto PostHog.
- [ ] **Step 3:** Marcar as tarefas concluídas, revisar `git diff --check`, criar commit e enviar a branch `codex/posthog-clean-install`.
- [ ] **Step 4:** Confirmar os checks do PR #142.
