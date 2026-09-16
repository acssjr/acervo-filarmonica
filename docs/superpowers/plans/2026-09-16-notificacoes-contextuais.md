# Notificações Contextuais Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Exibir notificações autoexplicativas e abrir exatamente a entidade alterada, além de resolver os três comentários do CodeRabbit no PR 144.

**Architecture:** Atividades recebem metadados opcionais de destino em duas colunas aditivas. O frontend converte a atividade em um modelo de notificação legível e resolve a rota por ID; registros antigos usam correspondência única por título e nunca selecionam um duplicado arbitrariamente. A tela administrativa preserva uma âncora DOM durante recargas silenciosas.

**Tech Stack:** Cloudflare Workers, D1/SQLite, React 18, React Router, Jest, Vitest.

---

### Task 1: Corrigir os apontamentos locais do CodeRabbit

**Files:**
- Modify: `frontend/src/screens/admin/admin-shell.css`
- Modify: `frontend/src/screens/admin/adminPartiturasUtils.js`
- Modify: `frontend/src/screens/admin/adminPartiturasUtils.test.js`
- Modify: `frontend/src/screens/admin/AdminPartituras.jsx`

- [ ] **Step 1: Cobrir ordenação defensiva e âncora visual com testes**

Adicionar ao utilitário funções puras para capturar e calcular a restauração da âncora. Cobrir título nulo e o deslocamento do mesmo cartão após reordenação.

```js
expect(sortPartiturasByTitle([{ titulo: null }, { titulo: 'Banda' }]))
  .toEqual([{ titulo: null }, { titulo: 'Banda' }]);
expect(getScrollAdjustment({ previousTop: 120, nextTop: 170 })).toBe(50);
```

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `npm test -- --runInBand src/screens/admin/adminPartiturasUtils.test.js`
Expected: FAIL porque a ordenação nula e o helper de âncora ainda não existem.

- [ ] **Step 3: Implementar as correções mínimas**

Normalizar títulos com `(titulo ?? '')`, elevar a opacidade do rótulo do menu e usar um `ref` pendente para restaurar a posição do primeiro cartão visível após `setPartituras`.

```js
const anchor = silent ? captureVisiblePartituraAnchor(listRef.current) : null;
pendingAnchorRef.current = anchor;
setPartituras(parts || []);
```

- [ ] **Step 4: Reexecutar os testes focados**

Run: `npm test -- --runInBand src/screens/admin/adminPartiturasUtils.test.js`
Expected: PASS.

### Task 2: Persistir destinos de atividades

**Files:**
- Create: `database/migrations/0005_activity_targets.sql`
- Modify: `worker/tests/databaseBootstrap.test.ts`
- Modify: `worker/tests/schema.generated.ts`
- Modify: `worker/tests/atividadeService.test.ts`
- Modify: `worker/src/domain/atividades/atividadeService.js`

- [ ] **Step 1: Escrever os testes do novo contrato**

O bootstrap deve encontrar `entidade_tipo` e `entidade_id`. O serviço deve vincular os seis valores quando receber destino e usar `null` quando ele não existir.

```ts
await registrarAtividade(env, 'nova_parte', 'Peça', 'Trompete', 1, {
  tipo: 'partitura', id: 42
});
expect(bind).toHaveBeenCalledWith('nova_parte', 'Peça', 'Trompete', 1, 'partitura', 42);
```

- [ ] **Step 2: Executar os testes e confirmar a falha**

Run: `npm test -- worker/tests/atividadeService.test.ts worker/tests/databaseBootstrap.test.ts`
Expected: FAIL por ausência das colunas e do novo bind.

- [ ] **Step 3: Criar a migração aditiva e ampliar o serviço**

```sql
ALTER TABLE atividades ADD COLUMN entidade_tipo TEXT;
ALTER TABLE atividades ADD COLUMN entidade_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_atividades_entidade
  ON atividades(entidade_tipo, entidade_id);
```

O argumento opcional será `destino = null`, validando ID positivo antes do insert.

- [ ] **Step 4: Regenerar o schema de testes e validar**

Run: `npm run db:schema:generate && npm test -- worker/tests/atividadeService.test.ts worker/tests/databaseBootstrap.test.ts`
Expected: PASS.

### Task 3: Registrar IDs nas operações relevantes

**Files:**
- Modify: `worker/src/domain/partituras/partituraService.js`
- Modify: `worker/src/domain/partituras/parteService.js`
- Modify: `worker/src/domain/repertorios/repertorioService.js`

- [ ] **Step 1: Passar o destino nas criações**

```js
await registrarAtividade(env, 'nova_partitura', titulo, compositor, admin.id, {
  tipo: 'partitura', id: partituraId
});
```

Aplicar o mesmo contrato a upload de pasta, nova parte, novo repertório e atualização de repertório.

- [ ] **Step 2: Executar os testes do Worker**

Run: `npm test`
Expected: PASS.

### Task 4: Criar o modelo e a navegação das notificações

**Files:**
- Create: `frontend/src/utils/notificationNavigation.js`
- Create: `frontend/src/utils/notificationNavigation.test.js`
- Modify: `frontend/src/contexts/NotificationContext.jsx`
- Modify: `frontend/src/contexts/NotificationContext.test.js`
- Modify: `frontend/src/components/modals/NotificationsPanel.jsx`
- Modify: `frontend/src/components/modals/NotificationsPanel.test.jsx`

- [ ] **Step 1: Testar descrições e destinos**

Cobrir navegação por ID, título antigo único, título duplicado e destino inexistente.

```js
expect(resolveNotificationDestination({ entityType: 'partitura', entityId: 42 }, sheets))
  .toBe('/acervo/marchas/42');
expect(resolveNotificationDestination(legacyDuplicate, duplicateSheets)).toBe('/acervo');
```

- [ ] **Step 2: Executar os testes e confirmar a falha**

Run: `npm test -- --runInBand src/utils/notificationNavigation.test.js src/contexts/NotificationContext.test.js src/components/modals/NotificationsPanel.test.jsx`
Expected: FAIL até os helpers e campos serem implementados.

- [ ] **Step 3: Implementar conversão e resolução**

O contexto expõe `details`, `entityType`, `entityId` e `description`. O painel renderiza a descrição e usa o resolvedor puro antes de chamar `navigate`.

```js
const destination = resolveNotificationDestination(notification, sheets);
if (destination) navigate(destination);
```

O mapa manterá `repertorio_atualizado` e aceitará o tipo real `update_repertorio`.

- [ ] **Step 4: Executar os testes focados**

Run: `npm test -- --runInBand src/utils/notificationNavigation.test.js src/contexts/NotificationContext.test.js src/components/modals/NotificationsPanel.test.jsx`
Expected: PASS.

### Task 5: Validar, publicar e responder à revisão

**Files:**
- Modify: descrição do PR 144 no GitHub

- [ ] **Step 1: Executar validação integral**

Run: `npm test`
Expected: todos os testes do Worker aprovados.

Run: `npm test -- --runInBand && npm run lint && npm run build` em `frontend/`
Expected: todos os testes, lint e build aprovados.

Run: `npm run db:schema:test && npm run lint:worker && git diff --check`
Expected: schema, lint do Worker e diff aprovados.

- [ ] **Step 2: Validar visualmente**

No desktop e viewport móvel, abrir a central, conferir a descrição contextual e clicar em uma notificação com ID. Confirmar que o painel fecha e a peça correta abre.

- [ ] **Step 3: Commit e push**

```bash
git add database/migrations/0005_activity_targets.sql worker/tests/schema.generated.ts worker/tests/databaseBootstrap.test.ts worker/tests/atividadeService.test.ts worker/src/domain/atividades/atividadeService.js worker/src/domain/partituras/partituraService.js worker/src/domain/partituras/parteService.js worker/src/domain/repertorios/repertorioService.js frontend/src/screens/admin/admin-shell.css frontend/src/screens/admin/AdminPartituras.jsx frontend/src/screens/admin/adminPartiturasUtils.js frontend/src/screens/admin/adminPartiturasUtils.test.js frontend/src/utils/notificationNavigation.js frontend/src/utils/notificationNavigation.test.js frontend/src/contexts/NotificationContext.jsx frontend/src/contexts/NotificationContext.test.js frontend/src/components/modals/NotificationsPanel.jsx frontend/src/components/modals/NotificationsPanel.test.jsx docs/superpowers/plans/2026-09-16-notificacoes-contextuais.md
git commit -m "fix: make notifications contextual and deterministic"
git push
```

- [ ] **Step 4: Responder cada thread do CodeRabbit**

Responder no comentário inline informando a correção aplicada e a validação correspondente. Atualizar a descrição do PR com Tipo de mudança, Checklist, Como testar e Issues relacionadas.
