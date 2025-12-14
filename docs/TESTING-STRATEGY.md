# Estratégia de Testes para Arquiteturas Serverless Modernas

> Guia técnico baseado em pesquisa aprofundada sobre React + Cloudflare Workers (D1/R2)

## 1. Resumo Executivo

O problema de **"testes passam no CI, mas falhas emergem em produção"** é sintomático de uma dissonância estrutural nas estratégias de teste convencionais para arquiteturas serverless.

### Por que isso acontece?

A lógica de aplicação em Cloudflare Workers atua como **"código de cola" (glue code)**, orquestrando chamadas entre serviços geridos (D1, R2, APIs externas). Quando mockamos esses serviços, restam apenas transformações triviais de dados para testar.

**Testes tautológicos:** "Dado que o mock do banco retorna X, garanta que a função retorne X" - isso valida suposições, não a realidade.

---

## 2. Da Pirâmide ao Troféu de Testes

### 2.1 A Falácia da Pirâmide Tradicional

A Pirâmide de Testes (Mike Cohn) assume que:
- Operações de I/O são lentas e custosas
- Lógica de domínio é complexa e isolável

**No Cloudflare Workers, a lógica de domínio É a interação com I/O.**

Um Worker típico:
1. Recebe requisição
2. Valida token JWT (KV)
3. Executa query SQL (D1)
4. Manipula stream de dados (R2)
5. Retorna resposta

Se isolarmos tudo via mocks, testamos quase nada.

### 2.2 O Modelo "Testing Trophy"

Para React + Workers, a distribuição ótima é:

```
       ┌─────────┐
       │   E2E   │  ← Topo estreito (Playwright em Preview real)
       └────┬────┘
      ┌─────┴─────┐
      │INTEGRAÇÃO │  ← CORPO PRINCIPAL (Vitest + workerd)
      └─────┬─────┘
       ┌────┴────┐
       │UNITÁRIOS│  ← Camada fina (utilitários puros)
       └────┬────┘
    ┌───────┴───────┐
    │ANÁLISE ESTÁTICA│ ← Base sólida (TypeScript + ESLint)
    └───────────────┘
```

| Camada | % Esforço | O que testar |
|--------|-----------|--------------|
| Análise Estática | Base | TypeScript/ESLint, tipos compartilhados |
| Unitários | Fina | Utilitários puros, validadores, parsers |
| **Integração** | **MAIOR** | Vitest + `@cloudflare/vitest-pool-workers` |
| E2E | Topo | Playwright em ambiente Preview real |

### 2.3 Importância do Runtime: workerd vs Node.js

**Causa raiz de bugs que "passam nos mocks":** discrepância de runtime.

- Jest/MSW rodam sobre **Node.js**
- Workers rodam sobre **workerd** (V8 isolates, Web APIs)

**Exemplo de falha silenciosa:**
```javascript
// Funciona em Jest (Node.js)
Buffer.from('test')

// FALHA em Workers sem nodejs_compat
// ReferenceError: Buffer is not defined
```

Testes de integração em workerd capturam isso imediatamente.

---

## 3. A Ilusão dos Mocks

### 3.1 O "Vale da Estranheza"

**Mocks envelhecem mal.** Quando o schema do D1 muda, mocks no MSW frequentemente permanecem desatualizados.

Além disso, mocks replicam a **"lógica feliz"**:
- Raramente simulam rate limiting (erro 1015)
- Ignoram consistência eventual do R2
- Não reproduzem erros de constraint FK no D1

### 3.2 Mocking de Alta Fidelidade com MSW

O MSW deve ser **derivado de contratos**, não escrito manualmente.

**Estratégia recomendada:**

1. **Validação Estrita de Schema:**
   - Usar `openapi-msw` para validar requisições contra `openapi.yaml`
   - Se payload viola contrato → mock retorna 400 (não sucesso falso)

2. **Geração Automática de Handlers:**
   - Usar `msw-auto-mock` para gerar handlers da spec OpenAPI
   - Se backend atualiza spec → mocks atualizam automaticamente

### 3.3 Quando Usar Backend Real?

| Contexto | Estratégia |
|----------|------------|
| Desenvolvimento de UI | MSW derivado de OpenAPI |
| Testes de Integração (Backend) | `wrangler dev` local (workerd + D1 local) |
| CI/CD | Preview com D1 real para E2E críticos |

---

## 4. Contract Testing: Pact vs OpenAPI

### 4.1 Pact (Consumer-Driven)

- Frontend define expectativas → gera "pacto"
- Backend deve honrar o pacto

**Desvantagens para nossa stack:**
- Complexidade operacional (Pact Broker)
- Overhead supera benefícios em monorepo
- TypeScript já pode compartilhar tipos

### 4.2 OpenAPI (Schema-Driven) - RECOMENDADO

**Fluxo de Trabalho de Ouro:**

```
1. Backend define openapi.yaml (ou gera via Hono/Zod)
          ↓
2. Frontend gera cliente tipado (openapi-fetch)
          ↓
3. Se contrato muda → BUILD QUEBRA IMEDIATAMENTE
          ↓
4. Worker valida requisições contra schema em runtime
```

**Tabela Comparativa:**

| Característica | Pact | OpenAPI |
|----------------|------|---------|
| Origem da Verdade | Consumidor | Provedor |
| Complexidade Setup | Alta | Média |
| Feedback Loop | Lento (CI) | **Imediato** (compilação) |
| Ideal Para | Equipes distintas | **Full-stack/Monorepo** |

---

## 5. E2E com Backend Real no CI/CD

### 5.1 O Desafio

Múltiplos PRs rodando contra mesmo D1 de staging → condições de corrida, flaky tests.

### 5.2 Estratégias de Isolamento

**Opção A: Banco por PR**
```yaml
# GitHub Actions
- wrangler d1 create d1-pr-${{ github.event.number }}
- wrangler d1 migrations apply --remote
- # ... testes ...
- wrangler d1 delete
```
*Limitação: Latência de propagação DNS*

**Opção B: Isolamento Lógico (RECOMENDADO)**
1. Cada teste gera `test_run_id` único
2. Playwright injeta no header: `x-test-run-id`
3. Scripts de seed/reset antes dos testes
4. Cleanup automático após execução

### 5.3 Pipeline de CI Recomendado

```yaml
jobs:
  build-lint:
    # Validação estática (TypeScript, ESLint)

  unit-integration:
    # Vitest com @cloudflare/vitest-pool-workers
    # Usa miniflare/workerd local

  deploy-preview:
    # wrangler deploy --env preview

  e2e:
    needs: deploy-preview
    # Playwright contra URL de preview
    # Headers: CF-Access-Client-Id, CF-Access-Client-Secret
```

**Dica para autenticação em testes:**
Implementar rotas de "backdoor" no Worker (apenas em preview) que geram tokens programaticamente, evitando testar formulários OAuth.

---

## 6. Validação de URLs e Métodos

### 6.1 O Problema do Roteamento

Bug comum: frontend chama `/api/v1/user`, backend espera `/api/user`.

Testes unitários que invocam controllers isolados **não validam roteamento**.

### 6.2 Testando com Vitest Pool Workers

```typescript
import { SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';

describe('Worker Routing', () => {
  it('deve rejeitar método incorreto', async () => {
    const response = await SELF.fetch('https://example.com/api/resource', {
      method: 'DELETE', // Método não suportado
    });
    expect(response.status).toBe(405);
  });

  it('deve rotear corretamente para criação', async () => {
    const response = await SELF.fetch('https://example.com/api/resource', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }),
    });
    expect(response.status).toBe(201);
  });
});
```

---

## 7. Trade-offs Quantificados

| Estratégia | Velocidade | Confiabilidade | Custo | Contexto Ideal |
|------------|------------|----------------|-------|----------------|
| Mocks (MSW) | Alta (ms) | **Baixa** (drift) | Zero | Dev local de UI |
| Emulação Local | Alta (s) | **Alta** | Zero | Integração backend |
| Preview (D1 Real) | Baixa (min) | **Máxima** | Médio | E2E críticos |
| Pact | Média | Alta | Alto | Não recomendado |

**Recomendação:**
> Emulação local (wrangler dev / vitest-pool-workers) para **90% dos testes**.
> E2E com infra real apenas para branch main e PRs críticos.

---

## 8. Roteiro de Implementação

### Fase 1: Imediato - Unificação de Tipos

```bash
npm install openapi-fetch openapi-typescript
```

1. Criar/gerar `openapi.yaml` do Worker
2. Gerar tipos: `npx openapi-typescript openapi.yaml -o src/api-types.ts`
3. Usar `openapi-fetch` no frontend

**Resultado:** Build quebra se contrato divergir.

### Fase 2: Curto Prazo - Validação de Mocks

```bash
npm install openapi-msw
```

1. Configurar MSW para validar contra `openapi.yaml`
2. Mocks inválidos = testes falham

### Fase 3: Médio Prazo - Vitest Pool Workers

```bash
npm install -D vitest @cloudflare/vitest-pool-workers
```

1. Migrar testes de backend de Jest → Vitest
2. Testes rodam em workerd real
3. Interação com D1 local (não mocks)

### Fase 4: Pipeline Híbrido

1. Unit/Integration em cada push
2. Deploy preview em cada PR
3. E2E (Playwright) contra preview
4. E2E completo apenas em main

---

## 9. Aplicação ao Acervo Filarmonica

### Problema Identificado

Bug: `replacePartePartitura` chamava `/api/partituras/:id/partes/:parteId`
Backend esperava: `/api/partes/:id/substituir`

**Por que os testes não pegaram:**
1. Mock no MSW respondia ao endpoint **correto**
2. Nenhum teste verificava se o frontend **chamava** a URL correta
3. Testes E2E com backend real estavam **desabilitados** no CI

### Solução com OpenAPI

Se tivéssemos OpenAPI + cliente gerado:

```typescript
// Cliente gerado automaticamente
api.partes.substituir({ parteId: 99, body: formData })
// ↑ URL embutida corretamente: PUT /api/partes/99/substituir
```

Impossível chamar URL errada - ela nem existiria no cliente.

---

## Referências

1. [Improved Cloudflare Workers testing via Vitest and workerd](https://blog.cloudflare.com/workers-vitest-integration/)
2. [Test APIs - Workers - Cloudflare Docs](https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/)
3. [openapi-fetch](https://openapi-ts.dev/openapi-fetch/)
4. [openapi-msw - NPM](https://www.npmjs.com/package/openapi-msw)
5. [Pact vs OpenAPI - Speakeasy](https://www.speakeasy.com/blog/pact-vs-openapi)
6. [Best Practices - Playwright](https://playwright.dev/docs/best-practices)
7. [Local development - D1 - Cloudflare Docs](https://developers.cloudflare.com/d1/best-practices/local-development/)
