# Plano de implementação: Bombardino C/Bb

> **Execução:** implementação direta seguida de testes de regressão,
> conforme solicitado pelo usuário (sem TDD).

**Objetivo:** impedir definitivamente substituições entre Bombardino C e Bb,
informar partes ausentes e normalizar dados e uploads.

**Arquitetura:** manter o fluxo atual de download, adicionando uma camada de
canonicalização e compatibilidade no domínio de repertórios e uma verificação
de disponibilidade consumida pelo modal. A correção de dados será uma migração
SQL condicionada e idempotente.

**Tecnologias:** Cloudflare Workers, D1, R2, React, Vitest, Jest, Wrangler.

---

## Tarefa 1: Canonicalização e correspondência segura no backend

**Arquivos:**

- Alterar: `worker/src/domain/repertorios/repertorioService.js`
- Testar: `worker/tests/repertorioService.test.js` ou teste de rota equivalente

**Etapas:**

1. Criar helpers para identificar família e tonalidade canônica de Bombardino.
2. Tratar `Bombardino`/`Euphonium` sem tonalidade como C.
3. Bloquear C versus Bb antes das alternativas de família, voz, combinação e
   sinônimo.
4. Manter as alternativas atuais para os demais instrumentos.
5. Cobrir C exato, genérico para C, Bb exato e ausência sem substituição.

## Tarefa 2: Verificação de disponibilidade do repertório

**Arquivos:**

- Alterar: `worker/src/domain/repertorios/repertorioService.js`
- Alterar: `worker/src/routes/repertorioRoutes.js`
- Alterar: `worker/openapi.yaml`
- Gerar novamente: `frontend/src/api-types.ts`

**Etapas:**

1. Reutilizar a seleção das partituras do repertório em um endpoint de verificação.
2. Validar a existência de cada objeto encontrado com `BUCKET.head`.
3. Retornar totais e listas `disponiveis`/`ausentes` com ID, ordem e título.
4. Fazer o download ignorar objetos ausentes sem mascarar o resultado da
   verificação.

## Tarefa 3: Seletor e aviso no frontend

**Arquivos:**

- Alterar: `frontend/src/screens/RepertorioScreen.jsx`
- Alterar: `frontend/src/services/api-client.ts`
- Alterar: `frontend/src/services/api.js` se necessário
- Testar: testes do modal e do serviço correspondentes

**Etapas:**

1. Consultar a disponibilidade ao selecionar instrumento ou partituras, ou
   antes do download.
2. Exibir quantidade disponível e nomes ausentes.
3. Exigir confirmação consciente quando o pacote for parcial.
4. Manter PDF, ZIP e impressão.

## Tarefa 4: Lista de instrumentos e download individual

**Arquivos:**

- Alterar: `worker/src/domain/repertorios/repertorioService.js`
- Alterar: `frontend/src/hooks/useSheetDownload.js`
- Alterar: `frontend/src/hooks/useSheetDownload.test.js`
- Alterar: `frontend/src/constants/instruments.js`

**Etapas:**

1. Converter o genérico de Bombardino para C na lista de repertório.
2. Sempre apresentar C e Bb quando a família Bombardino estiver disponível.
3. Impedir que a correspondência individual interprete Bombardino C ou
   genérico como Bb.
4. Atualizar a alternativa local de instrumentos para C e Bb explícitos.

## Tarefa 5: Uploads canônicos

**Arquivos:**

- Alterar: `frontend/src/screens/admin/AdminPartituras.jsx`
- Alterar: `frontend/src/utils/instrumentParser.js` se necessário
- Alterar: `worker/src/domain/partituras/partituraService.js`

**Etapas:**

1. Fazer todos os parsers sem tonalidade retornarem `Bombardino C`.
2. Canonicalizar novamente no backend antes de inserir partes.
3. Preservar `Bombardino Bb` quando Bb/Sib for explícito.

## Tarefa 6: Correção condicionada dos dados auditados

**Arquivos:**

- Criar: `database/migrations/0003_fix_bombardino_tonalidades.sql`
- Gerar novamente: `worker/tests/schema.generated.ts`

**Etapas:**

1. Renomear cinco registros genéricos para C.
2. Renomear seis registros genéricos para Bb.
3. Corrigir duas partes cadastradas como Bb cujo conteúdo é C.
4. Não apagar os registros 1450 e 1473 sem objeto no R2.
5. Gerar novamente o schema de testes.

## Tarefa 7: Verificação final

**Arquivos:**

- Apenas verificar

**Etapas:**

1. Executar testes do Worker e frontend.
2. Executar lint do Worker e frontend.
3. Gerar frontend e validar contratos OpenAPI.
4. Simular o repertório recente: C deve retornar quatro C e marcar cinco
   ausentes; Bb deve usar apenas Bb existente.
5. Revisar o diff e confirmar que `frontend/.env.local` e arquivos do usuário
   não foram incluídos.
