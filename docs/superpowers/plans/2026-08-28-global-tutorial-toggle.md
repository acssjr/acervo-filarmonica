# Plano de implementação do controle global dos tutoriais

> **Para agentes de implementação:** SUB-SKILL OBRIGATÓRIO: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa por tarefa. As etapas usam a sintaxe de caixas de seleção (`- [ ]`) para acompanhamento.

**Objetivo:** Adicionar ao painel administrativo um controle global que ativa ou desativa os dois tutoriais de primeiro uso.

**Arquitetura:** Reutilizar a tabela `configuracoes` com uma rota pública de leitura e uma rota administrativa de escrita. Carregar o valor no `DataContext`, consumir o mesmo estado nos dois hooks de tutorial e expor uma chave responsiva em `AdminConfig`.

**Tecnologias:** Cloudflare Workers, D1, React 18, Vitest, Jest, OpenAPI.

---

### Tarefa 1: API e contrato da configuração global

**Arquivos:**
- Modificar: `worker/src/routes/configRoutes.js`
- Modificar: `worker/openapi.yaml`
- Modificar: `frontend/src/api-types.ts` por geração automática
- Testar: `worker/tests/routes.test.ts`

- [ ] Adicionar `GET /api/config/tutoriais`, retornando `{ ativo: true }` quando a chave não existir ou a leitura falhar.
- [ ] Adicionar `PUT /api/config/tutoriais`, protegido por `adminMiddleware`, persistindo `tutoriais_ativos` como texto `true` ou `false`.
- [ ] Documentar as duas operações no OpenAPI com corpo booleano obrigatório e gerar novamente os tipos do frontend.
- [ ] Cobrir leitura pública, valor padrão, persistência, ausência de token e usuário comum em `routes.test.ts`.
- [ ] Executar `npm test -- worker/tests/routes.test.ts`, `npm run api:contract:check` e `npm run api:types:check`.

### Tarefa 2: Estado global e cliente da API

**Arquivos:**
- Modificar: `frontend/src/services/api.js`
- Modificar: `frontend/src/contexts/DataContext.jsx`

- [ ] Criar `getTutoriaisAtivos()` com fallback `{ ativo: true }` e `setTutoriaisAtivos(ativo)` usando `PUT`.
- [ ] Inicializar `tutoriaisAtivos` como `true` no `DataContext`.
- [ ] Carregar a nova configuração no `Promise.allSettled` já usado para opções globais.
- [ ] Expor `tutoriaisAtivos` e `setTutoriaisAtivos` no valor do contexto.

### Tarefa 3: Impedir e interromper os dois tutoriais

**Arquivos:**
- Modificar: `frontend/src/components/onboarding/useUserWalkthrough.js`
- Modificar: `frontend/src/components/onboarding/TutorialOverlay.jsx`
- Modificar: `frontend/src/screens/admin/AdminPartituras.jsx`

- [ ] Consultar `tutoriaisAtivos` dentro de `useUserWalkthrough`; quando falso, cancelar o temporizador, retirar o estado pendente e fechar o tour.
- [ ] Fazer `useTutorial` receber `tutoriaisAtivos`; aplicar o mesmo cancelamento e fechamento.
- [ ] Obter o valor do `DataContext` em `AdminPartituras` e repassá-lo ao hook administrativo.
- [ ] Preservar as chaves locais de conclusão sem removê-las quando o controle global mudar.

### Tarefa 4: Controle administrativo responsivo e verificação

**Arquivos:**
- Modificar: `frontend/src/screens/admin/AdminConfig.jsx`
- Testar: `frontend/src/screens/admin/AdminConfig.test.jsx`

- [ ] Adicionar o handler otimista que chama `API.setTutoriaisAtivos`, confirma por toast e restaura o estado anterior se houver erro.
- [ ] Adicionar na seção “Configurações do Sistema” a linha “Tutoriais de primeiro uso”, com descrição dos dois tours, `role="switch"`, `aria-checked` e área de toque mínima de 44 pixels.
- [ ] Cobrir a atualização bem-sucedida e o rollback em teste de componente.
- [ ] Executar `npm test`, `npm run lint:worker`, os testes do frontend e o build.
- [ ] Validar visualmente `/admin/config` em desktop e em larguras móveis, interceptando apenas `/api/config/tutoriais` enquanto o backend novo ainda não estiver publicado.

### Tarefa 5: Entrega

**Arquivos:**
- Revisar: todos os arquivos modificados

- [ ] Executar `git diff --check` e revisar o diff completo.
- [ ] Commitar a implementação, publicar a branch e criar o pull request.
- [ ] Acompanhar todos os checks do GitHub até a conclusão.
