# Identificação amigável no PostHog — plano de implementação

> **Para agentes de implementação:** SUB-SKILL OBRIGATÓRIA: use `superpowers:executing-plans` para executar este plano tarefa por tarefa. As etapas usam caixas de seleção (`- [ ]`) para acompanhamento.

**Objetivo:** Mostrar o nome de exibição do usuário no PostHog sem alterar o identificador estável nem enviar credenciais.

**Arquitetura:** Um helper puro monta as propriedades seguras da pessoa. `identifyPostHogUser` usa esse objeto apenas no `identify`; o registro de superpropriedades continua limitado a função e instrumento.

**Tecnologias:** React, posthog-js, Jest, ESLint e Vite.

---

### Tarefa 1: Montar propriedades seguras da pessoa

**Arquivos:**
- Modificar: `frontend/src/services/posthog.js`
- Modificar: `frontend/src/services/posthog.test.js`

- [x] **Etapa 1:** Adicionar teste para `buildPostHogPersonProperties`, verificando prioridade de `nome_exibicao`, normalização de espaços e ausência de `username`, `email` e `pin`.
- [x] **Etapa 2:** Executar `npm test -- --runInBand src/services/posthog.test.js` em `frontend` e confirmar que o novo teste falha porque o helper ainda não existe.
- [x] **Etapa 3:** Implementar o helper com `name`, `role` e `instrumento`, omitindo `name` quando nenhum nome válido existir.
- [x] **Etapa 4:** Usar o helper em `identifyPostHogUser`, mantendo apenas `role` e `instrumento` em `posthog.register`.
- [x] **Etapa 5:** Reexecutar o teste direcionado e confirmar aprovação.

### Tarefa 2: Alinhar documentação e validar

**Arquivos:**
- Modificar: `posthog-setup-report.md`

- [x] **Etapa 1:** Documentar que o nome de exibição é enviado como propriedade da pessoa, enquanto login, e-mail e PIN não são enviados.
- [x] **Etapa 2:** Executar `git diff --check`, testes completos, lint e build do frontend.
- [x] **Etapa 3:** Criar commit, enviar a branch e abrir o pull request.
