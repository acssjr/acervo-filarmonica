# Plano de implementação da privacidade no Session Replay do PostHog

> **Para agentes de implementação:** SUB-SKILL OBRIGATÓRIA: use `superpowers:subagent-driven-development` (recomendada) ou `superpowers:executing-plans` para implementar este plano tarefa por tarefa. As etapas usam a sintaxe de caixas de seleção (`- [ ]`) para acompanhamento.

**Objetivo:** Mostrar textos e buscas nas gravações de sessão sem expor nenhum PIN.

**Arquitetura:** A configuração central do PostHog deixa de mascarar globalmente texto e inputs, mas mantém o mascaramento nativo de campos `password`. Todos os componentes que recebem PIN também usam `data-private`, cobrindo inclusive os campos administrativos que hoje são de texto.

**Tecnologias:** React, Vite, posthog-js, Jest, ESLint.

---

### Tarefa 1: Ajustar a política central de gravação

**Arquivos:**
- Modificar: `frontend/src/services/posthog.js`
- Criar: `frontend/src/services/posthog.test.js`

- [x] **Etapa 1:** Extrair a configuração para `createPostHogConfig`, definir `mask_all_text: false`, `maskAllInputs: false`, `maskInputOptions: { password: true }` e remover `maskTextSelector: '*'`.
- [x] **Etapa 2:** Adicionar teste que verifica a política de replay e a permanência de `blockSelector`.
- [x] **Etapa 3:** Executar `npm test -- --runInBand src/services/posthog.test.js` dentro de `frontend`; esperado: todos os testes do arquivo passam.

### Tarefa 2: Proteger explicitamente todos os PINs

**Arquivos:**
- Modificar: `frontend/src/components/login/PinInput.jsx`
- Modificar: `frontend/src/components/modals/ChangePinModal.jsx`
- Modificar: `frontend/src/screens/LoginScreen.jsx`
- Modificar: `frontend/src/screens/admin/modals/ResetPinModal.jsx`
- Modificar: `frontend/src/screens/admin/modals/UsuarioFormModal.jsx`

- [x] **Etapa 1:** Adicionar `data-private="true"` a cada input que recebe PIN e remover o bloqueio amplo do cartão de login.
- [x] **Etapa 2:** Verificar por busca que todos os inputs de PIN usam `type="password"` ou `data-private="true"`.

### Tarefa 3: Validar e publicar no PR

**Arquivos:**
- Modificar: `docs/superpowers/plans/2026-09-16-posthog-replay-privacy.md`

- [x] **Etapa 1:** Executar lint e testes do frontend.
- [x] **Etapa 2:** Executar o build com o token local do projeto PostHog.
- [ ] **Etapa 3:** Marcar as tarefas concluídas, revisar `git diff --check`, criar commit e enviar a branch `codex/posthog-clean-install`.
- [ ] **Etapa 4:** Confirmar os checks do PR #142.
