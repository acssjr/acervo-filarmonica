# Bombardino C/Bb Implementation Plan

> **Execução:** implementação direta seguida de testes de regressão, conforme solicitado pelo usuário (sem TDD).

**Goal:** impedir definitivamente substituições entre Bombardino C e Bb, informar partes ausentes e normalizar dados e uploads.

**Architecture:** manter o fluxo atual de download, adicionando uma camada de canonicalização/compatibilidade no domínio de repertórios e uma verificação de disponibilidade consumida pelo modal. A correção de dados será uma migração SQL condicionada e idempotente.

**Tech Stack:** Cloudflare Workers, D1, R2, React, Vitest, Jest, Wrangler.

---

### Task 1: Canonicalização e matching seguro no backend

**Files:**
- Modify: `worker/src/domain/repertorios/repertorioService.js`
- Test: `worker/tests/repertorioService.test.js` ou teste de rota equivalente

**Steps:**
1. Criar helpers para identificar família e tonalidade canônica de Bombardino.
2. Tratar `Bombardino`/`Euphonium` sem tonalidade como C.
3. Bloquear C versus Bb antes de fallbacks de família, voz, combinação e sinônimo.
4. Manter os fallbacks atuais para os demais instrumentos.
5. Cobrir C exato, genérico para C, Bb exato e ausência sem substituição.

### Task 2: Verificação de disponibilidade do repertório

**Files:**
- Modify: `worker/src/domain/repertorios/repertorioService.js`
- Modify: `worker/src/routes/repertorioRoutes.js`
- Modify: `worker/openapi.yaml`
- Regenerate: `frontend/src/api-types.ts`

**Steps:**
1. Reutilizar a seleção das partituras do repertório em um endpoint de verificação.
2. Validar a existência de cada objeto encontrado com `BUCKET.head`.
3. Retornar totais e listas `disponiveis`/`ausentes` com ID, ordem e título.
4. Fazer o download ignorar objetos ausentes sem mascarar o resultado da verificação.

### Task 3: Seletor e aviso no frontend

**Files:**
- Modify: `frontend/src/screens/RepertorioScreen.jsx`
- Modify: `frontend/src/services/api-client.ts`
- Modify: `frontend/src/services/api.js` se necessário
- Test: testes do modal/serviço correspondentes

**Steps:**
1. Consultar a disponibilidade ao selecionar instrumento/partituras ou antes do download.
2. Exibir quantidade disponível e nomes ausentes.
3. Exigir confirmação consciente quando o pacote for parcial.
4. Manter PDF, ZIP e impressão.

### Task 4: Lista de instrumentos e download individual

**Files:**
- Modify: `worker/src/domain/repertorios/repertorioService.js`
- Modify: `frontend/src/hooks/useSheetDownload.js`
- Modify: `frontend/src/hooks/useSheetDownload.test.js`
- Modify: `frontend/src/constants/instruments.js`

**Steps:**
1. Converter o genérico de Bombardino para C na lista de repertório.
2. Sempre apresentar C e Bb quando a família Bombardino estiver disponível.
3. Impedir que o matcher individual interprete Bombardino C/genérico como Bb.
4. Atualizar o fallback local de instrumentos para C e Bb explícitos.

### Task 5: Uploads canônicos

**Files:**
- Modify: `frontend/src/screens/admin/AdminPartituras.jsx`
- Modify: `frontend/src/utils/instrumentParser.js` se necessário
- Modify: `worker/src/domain/partituras/partituraService.js`

**Steps:**
1. Fazer todos os parsers sem tonalidade retornarem `Bombardino C`.
2. Canonicalizar novamente no backend antes de inserir partes.
3. Preservar `Bombardino Bb` quando Bb/Sib for explícito.

### Task 6: Correção condicionada dos dados auditados

**Files:**
- Create: `database/migrations/0003_fix_bombardino_tonalidades.sql`
- Regenerate: `worker/tests/schema.generated.ts`

**Steps:**
1. Renomear cinco registros genéricos para C.
2. Renomear seis registros genéricos para Bb.
3. Corrigir duas partes cadastradas como Bb cujo conteúdo é C.
4. Não apagar os registros 1450 e 1473 sem objeto no R2.
5. Gerar novamente o schema de testes.

### Task 7: Verificação final

**Files:**
- Verify only

**Steps:**
1. Executar testes do Worker e frontend.
2. Executar lint do Worker e frontend.
3. Gerar frontend e validar contratos OpenAPI.
4. Simular o repertório recente: C deve retornar quatro C e marcar cinco ausentes; Bb deve usar apenas Bb existente.
5. Revisar o diff e confirmar que `frontend/.env.local` e arquivos do usuário não foram incluídos.

