# Guia Tecnico: Git, GitHub, CI/CD e Qualidade Automatizada

> **Propósito**: Este documento serve como referência técnica para orientar sistemas inteligentes (IA) e desenvolvedores na priorização de tarefas de engenharia de software, desde o controle de versão até o deploy automatizado.

---

## Sumário

1. [Princípios Fundamentais](#1-princípios-fundamentais)
2. [Estratégias de Ramificação (Branching)](#2-estratégias-de-ramificação-branching)
3. [Governança de Repositório](#3-governança-de-repositório)
4. [Pirâmide de Testes](#4-pirâmide-de-testes)
5. [Pipeline CI/CD com GitHub Actions](#5-pipeline-cicd-com-github-actions)
6. [DevSecOps: Segurança Integrada](#6-devsecops-segurança-integrada)
7. [Estratégias de Deployment](#7-estratégias-de-deployment)
8. [Feature Flags](#8-feature-flags)
9. [Roteiro de Implementação para IA](#9-roteiro-de-implementação-para-ia)
10. [Métricas DORA](#10-métricas-dora)
11. [Workflow de Desenvolvimento Local](#11-workflow-de-desenvolvimento-local) ⭐ **IMPORTANTE**
12. [Referências](#12-referências)

---

## 1. Princípios Fundamentais

### O Que Este Guia Resolve

A demanda por ciclos de entrega mais curtos colide frequentemente com a necessidade imperativa de estabilidade sistêmica. A escolha das ferramentas de controle de versão, a estratégia de ramificação e a arquitetura do pipeline de CI/CD não são apenas detalhes operacionais, mas **determinantes fundamentais da velocidade e segurança** da engenharia.

### O "Santo Graal" da Automação

O objetivo final é o **deploy automático condicionado ao sucesso dos testes e da compilação (build)**:

```
COMMIT → CI (Testes) → BUILD → DEPLOY (se tudo passou)
         ↓ Falha
         BLOQUEIO
```

### Princípio "Shift-Left"

Executar validações o mais cedo possível no ciclo de desenvolvimento:

| Momento | Validação | Ferramenta |
|---------|-----------|------------|
| Digitação | Linting/Formatação | ESLint, Prettier (IDE) |
| Pré-commit | Formatação + Lint | Husky + lint-staged |
| Push | Testes unitários | Jest/Vitest (CI) |
| Pull Request | Testes E2E + Review | Playwright + GitHub |
| Merge | Build + Deploy | GitHub Actions |

---

## 2. Estratégias de Ramificação (Branching)

### 2.1 A Dicotomia GitFlow vs. Trunk-Based Development

#### GitFlow (Modelo Clássico)

```
main     ─────────────●───────────────●─────────────→
                     /               /
release  ──────────●───────────────●────────────────→
                  /               /
develop  ●───●───●───●───●───●───●───●───●──────────→
          \     / \     /
feature    ●───●   ●───●
          (dias/semanas)
```

**Características:**
- Branches de longa duração (`develop`, `release`, `hotfix`)
- Isolamento prolongado de features
- Múltiplos branches de release simultâneos

**Problemas Identificados:**
- Sobrecarga cognitiva e operacional
- Alta probabilidade de conflitos de merge ("Merge Hell")
- Feedback de integração retardado
- Desencoraja refatoração contínua

#### Trunk-Based Development (Recomendado)

```
main ─────●─────●─────●─────●─────●─────●─────●───────→
           \   /     \   /     \   /
            ●─●       ●─●       ●─●
         (feature)  (feature)  (feature)
         < 1-2 dias < 1-2 dias < 1-2 dias
```

**Características:**
- Commits pequenos e frequentes no trunk (main)
- Branches de vida extremamente curta (máximo 1-2 dias)
- Repositório principal sempre em estado implantável ("Green Build")
- **Pré-requisito funcional para CI/CD eficaz**

### 2.2 Tabela Comparativa de Impacto Operacional

| Dimensão | GitFlow | Trunk-Based | GitHub Flow |
|----------|---------|-------------|-------------|
| **Frequência de Integração** | Baixa (Dias/Semanas) | Alta (Múltiplas/dia) | Moderada a Alta |
| **Complexidade de Merge** | Alta (Conflitos frequentes) | Mínima (Resolução contínua) | Baixa |
| **Latência de Feedback** | Lenta (Integração tardia) | Imediata (CI constante) | Rápida |
| **Gestão de Versões** | Complexa (Múltiplos branches) | Simplificada (Tags automáticas) | Simples |
| **Dependência de Testes** | Moderada (Testes manuais comuns) | **Crítica** (Exige automação robusta) | Alta |
| **Adequação para Web Apps** | Baixa (Software "empacotado") | **Ideal** (Continuous Delivery) | Alta |

### 2.3 Decisão: Qual Usar?

**Para aplicativos web com deploy contínuo (como o Acervo Filarmônica):**

✅ **Trunk-Based Development** — Elimina branches de longa duração, permite fluxo linear do commit para produção, barrado apenas por falha nos testes.

❌ **GitFlow** — Apenas se houver múltiplas versões em produção simultâneas ou releases programadas (mensal/trimestral).

---

## 3. Governança de Repositório

### 3.1 Branch Protection Rules (Primeira Linha de Defesa)

Com Trunk-Based Development, a proteção do branch `main` é **prioridade de segurança número um**.

#### Configuração Obrigatória no GitHub

1. **Settings → Branches → Add rule** para `main`
2. Ativar:
   - ✅ **Require a pull request before merging**
   - ✅ **Require approvals** (mínimo 1 revisor)
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging** (modo "Strict")
   - ✅ Selecionar checks: `lint`, `unit-tests`, `e2e-tests`, `build`

#### Por Que o Modo "Strict"?

Previne "quebra semântica": código que passa nos testes isoladamente, mas causa regressões quando combinado com alterações recentes de outros desenvolvedores.

### 3.2 CODEOWNERS (Governança Especializada)

Para projetos maiores, defina responsáveis por áreas específicas:

```
# .github/CODEOWNERS

# Time de DevOps aprova infraestrutura
/wrangler.toml                    @devops-team
/.github/workflows/               @devops-team

# Time de segurança aprova autenticação
/frontend/src/contexts/Auth*.jsx  @security-team

# Desenvolvedor principal aprova tudo
*                                 @lead-developer
```

### 3.3 Conventional Commits e Versionamento Semântico

#### Formato das Mensagens

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[footer opcional]
```

#### Tipos Padrão

| Tipo | Impacto SemVer | Descrição |
|------|----------------|-----------|
| `fix:` | PATCH (0.0.X) | Correção de bug |
| `feat:` | MINOR (0.X.0) | Nova funcionalidade |
| `BREAKING CHANGE:` | MAJOR (X.0.0) | Mudança incompatível |
| `chore:` | Nenhum | Manutenção, refatoração |
| `docs:` | Nenhum | Documentação |
| `test:` | Nenhum | Testes |

#### Automação com Semantic Release

Ferramentas como **semantic-release** usam o histórico de commits para:
- Calcular automaticamente a próxima versão
- Gerar changelogs
- Criar releases no GitHub

---

## 4. Pirâmide de Testes

### 4.1 Estrutura Hierárquica

```
                    ▲
                   /E\          E2E Tests (5-10%)
                  /2E \         Playwright, Cypress
                 /Tests\        Fluxos críticos do usuário
                /───────\       Lentos, caros, frágeis
               /         \
              / Integração\     Integration Tests (20-25%)
             /   Tests     \    React Testing Library
            /───────────────\   Componentes + contexto + API
           /                 \  Velocidade média
          /   Unit Tests      \ Unit Tests (60-70%)
         /─────────────────────\Jest, Vitest
        /                       \Funções isoladas, hooks
       /                         \Rápidos, baratos, estáveis
      ▼─────────────────────────────▼
```

### 4.2 Cobertura e Ferramentas por Camada

| Camada | Volume | Tempo | Foco | Ferramentas |
|--------|--------|-------|------|-------------|
| **Unitários** | 60-70% | Milissegundos | Lógica de negócio isolada, funções, hooks | Jest, Vitest |
| **Integração** | 20-25% | Segundos | Componentes + contexto, API mockada | React Testing Library, MSW |
| **E2E** | 5-10% | Minutos | Fluxos críticos (login, checkout) | Playwright, Cypress |

### 4.3 O Que Testar em Cada Nível

#### Testes Unitários
- Funções utilitárias puras (`formatDate`, `validateEmail`)
- Lógica de validação
- Transformação de dados
- Hooks customizados isolados

#### Testes de Integração
- Componentes com estado
- Formulários com validação
- Fluxos dentro de um componente
- Chamadas de API mockadas (MSW)

#### Testes E2E
- Login/Logout completo
- Fluxos de cadastro
- Navegação crítica
- Cenários de erro do usuário

### 4.4 Testes Intermitentes (Flaky Tests)

**Problema:** Testes que passam ou falham aleatoriamente destroem a confiança na automação.

**Causas comuns:**
- Dependência de ordem de execução
- Dados compartilhados entre testes
- Dependências de tempo (datas dinâmicas)
- Condições de corrida em rede

**Mitigações:**
1. **Isolamento:** Cada teste limpa seu estado
2. **Retry automático:** `nick-fields/retry` no GitHub Actions
3. **Quarentena:** Mover flaky tests para suíte separada que não bloqueia deploy

---

## 5. Pipeline CI/CD com GitHub Actions

### 5.1 Anatomia de um Workflow Seguro

```yaml
# .github/workflows/pipeline.yml
name: Production Pipeline

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

# Cancela runs anteriores se houver novo push
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # ═══════════════════════════════════════════════════════
  # ESTÁGIO 1: Verificações Rápidas (Fail Fast)
  # ═══════════════════════════════════════════════════════
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'  # Otimização crítica
      - name: Install Dependencies
        run: npm ci
      - name: Install Frontend Dependencies
        run: npm ci
        working-directory: frontend
      - name: Linting
        run: npm run lint
        working-directory: frontend
      - name: Security Audit (SCA)
        run: npm audit --audit-level=high
        working-directory: frontend

  # ═══════════════════════════════════════════════════════
  # ESTÁGIO 2: Testes Unitários
  # ═══════════════════════════════════════════════════════
  unit-tests:
    needs: quality-gate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'
      - run: npm ci
      - run: npm ci
        working-directory: frontend
      - name: Run Unit Tests
        run: npm test -- --coverage
        working-directory: frontend

  # ═══════════════════════════════════════════════════════
  # ESTÁGIO 3: Testes E2E
  # ═══════════════════════════════════════════════════════
  e2e-tests:
    needs: unit-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'
      - run: npm ci
      - run: npm ci
        working-directory: frontend
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run E2E Tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

  # ═══════════════════════════════════════════════════════
  # ESTÁGIO 4: Build (Imutabilidade de Artefatos)
  # ═══════════════════════════════════════════════════════
  build:
    needs: [unit-tests, e2e-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'npm'
      - run: npm ci
        working-directory: frontend
      - name: Build Application
        run: npm run build
        working-directory: frontend
      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist-files
          path: frontend/dist/
          retention-days: 5

  # ═══════════════════════════════════════════════════════
  # ESTÁGIO 5: Deploy Condicional
  # ═══════════════════════════════════════════════════════
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment:
      name: production
      url: https://acervo-filarmonica.pages.dev
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Download Artifact
        uses: actions/download-artifact@v4
        with:
          name: dist-files
          path: frontend/dist
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: acervo-filarmonica
          directory: frontend/dist
```

### 5.2 Fluxo de Execução Visual

```
┌─────────────────────────────────────────────────────────────┐
│                     PUSH / PULL REQUEST                     │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  1. QUALITY-GATE (Lint + Audit)                             │
│     ⏱️ ~30 segundos                                         │
│     ❌ Falha? → Pipeline PARA                               │
└────────────────────────────┬────────────────────────────────┘
                             │ ✅
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  2. UNIT-TESTS (Jest + Cobertura)                           │
│     ⏱️ ~1-2 minutos                                         │
│     ❌ Falha? → Pipeline PARA                               │
└────────────────────────────┬────────────────────────────────┘
                             │ ✅
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  3. E2E-TESTS (Playwright)                                  │
│     ⏱️ ~3-5 minutos                                         │
│     ❌ Falha? → Pipeline PARA + Salva relatório             │
└────────────────────────────┬────────────────────────────────┘
                             │ ✅
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  4. BUILD (Gera artefatos imutáveis)                        │
│     ⏱️ ~1 minuto                                            │
│     📦 Upload dist/ como artifact                           │
└────────────────────────────┬────────────────────────────────┘
                             │ ✅ + branch == main + push
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  5. DEPLOY (Cloudflare Pages)                               │
│     🔒 Environment: production                              │
│     📥 Download artifact (mesmo binário do build)           │
│     ⏱️ ~1 minuto                                            │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Mecanismos de Controle Críticos

| Mecanismo | Função | Por Que é Importante |
|-----------|--------|----------------------|
| `needs:` | Dependência sequencial | Deploy NUNCA inicia se testes falharem |
| `if:` | Condicional | PRs rodam CI mas não CD |
| `concurrency:` | Cancelamento automático | Economiza recursos, evita race conditions |
| `cache:` | Cache de dependências | Reduz tempo de 5min para 30s |
| `upload/download-artifact` | Imutabilidade | Mesmo binário do build vai para produção |

### 5.4 Por Que Imutabilidade de Artefatos?

O job `build` faz upload do diretório `dist/`, e o job `deploy` faz download **desse mesmo artefato**. Isso garante que **exatamente** o mesmo código binário/transpilado gerado no processo de build vai para produção — eliminando discrepâncias onde o código seria recompilado no servidor de deploy.

---

## 6. DevSecOps: Segurança Integrada

### 6.1 Ferramentas de Escaneamento para GitHub Actions

| Categoria | Ferramenta | Função | Vantagem |
|-----------|------------|--------|----------|
| **SCA** (Software Composition) | Trivy | Vulnerabilidades em bibliotecas (npm) | Versátil (Filesystem + Container) |
| **SAST** (Static Analysis) | CodeQL, Semgrep | Padrões inseguros (SQL Injection, XSS) | CodeQL é nativo do GitHub |
| **Secret Scanning** | GitLeaks | Impedir commit de credenciais | Baixa taxa de falsos positivos |
| **Container Security** | Grype, Trivy | Scan de imagens Docker | Geração de SBOM |

### 6.2 Exemplo: Job de Segurança

```yaml
security-scan:
  needs: quality-gate
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        severity: 'CRITICAL,HIGH'
        exit-code: '1'  # Falha se encontrar vulnerabilidades críticas
```

---

## 7. Estratégias de Deployment

### 7.1 Environments e Deployment Protection Rules

#### Configurar no GitHub

1. **Settings → Environments → New environment**: `production`
2. Ativar:
   - ✅ **Required reviewers** (aprovação manual)
   - ✅ **Wait timer** (opcional: delay antes do deploy)

#### Efeito no Workflow

Quando o job referencia `environment: production`, o GitHub **pausa** a execução e notifica os revisores. Somente após aprovação o deploy executa.

### 7.2 Fluxo Híbrido (Recomendado)

```
┌───────────────────────────────────────────────────────────────┐
│  STAGING (Automático)                                         │
│  - Deploy automático após merge em main                       │
│  - Sem aprovação humana                                       │
│  - URL: staging.acervo-filarmonica.pages.dev                  │
└───────────────────────────────────────────────────────────────┘
                             │
                             │ Validação em staging
                             ▼
┌───────────────────────────────────────────────────────────────┐
│  PRODUCTION (Gate Manual)                                     │
│  - Requer aprovação de revisor                                │
│  - Pausa e aguarda no GitHub                                  │
│  - URL: acervo-filarmonica.pages.dev                          │
└───────────────────────────────────────────────────────────────┘
```

### 7.3 Estratégias de Deploy Seguro

| Estratégia | Descrição | Quando Usar |
|------------|-----------|-------------|
| **Rolling** | Substitui instâncias gradualmente | Padrão simples |
| **Blue-Green** | Duas versões ativas, troca instantânea | Rollback imediato necessário |
| **Canary** | Nova versão para 5% dos usuários, depois expande | Detectar problemas cedo |

---

## 8. Feature Flags

### 8.1 Dissociação entre Deploy e Release

Feature flags permitem:
- **Deployment**: Mover código para o servidor (técnico)
- **Release**: Disponibilizar funcionalidade para o usuário (negócio)

Isso permite que código seja integrado, testado e implantado continuamente, mantendo o branch `main` sempre verde, enquanto funcionalidades são liberadas gradualmente.

### 8.2 Implementação Simples

```javascript
// src/config/featureFlags.js
export const FEATURE_FLAGS = {
  NEW_SEARCH_UI: import.meta.env.VITE_FF_NEW_SEARCH === 'true',
  DARK_MODE: import.meta.env.VITE_FF_DARK_MODE === 'true',
  ADMIN_ANALYTICS: import.meta.env.VITE_FF_ADMIN_ANALYTICS === 'true',
};

// Uso no componente
import { FEATURE_FLAGS } from '@/config/featureFlags';

function SearchComponent() {
  if (FEATURE_FLAGS.NEW_SEARCH_UI) {
    return <NewSearchUI />;
  }
  return <LegacySearchUI />;
}
```

### 8.3 Boas Práticas

| Prática | Descrição |
|---------|-----------|
| **Nomeie claramente** | `NEW_CHECKOUT_FLOW` não `FF_123` |
| **Documente** | Data de criação, responsável, data de remoção planejada |
| **Remova após deploy** | Feature flags são temporárias, não permanentes |
| **Teste ambos estados** | Com e sem a flag ativada |
| **Use por ambiente** | Dev/Staging/Production com valores diferentes |

---

## 9. Roteiro de Implementação para IA

### Algoritmo de Decisão Estratégica

A automação construída sobre um fluxo de Git desorganizado apenas **automatiza o caos**. A implementação deve seguir dependência estrita:

### Fase 1: Fundação e Higiene (Pré-requisito)

**Objetivo:** Código fonte como fonte única de verdade confiável.

**Ações:**
1. ✅ Migrar para **Trunk-Based Development**
2. ✅ Eliminar branches de longa duração (`develop`, `release`)
3. ✅ Configurar **Branch Protection Rules** em `main`
4. ✅ Instalar **Husky + lint-staged** para pre-commit hooks

**Racional:** Sem isso, qualquer automação posterior falhará ou será inconsistente.

### Fase 2: Ciclo de Feedback Rápido (CI Básico)

**Objetivo:** Validar integridade básica do código a cada alteração.

**Ações:**
1. ✅ Criar workflow CI com `lint` e `unit-tests`
2. ✅ Configurar cache de dependências (`npm ci` + `cache: 'npm'`)
3. ✅ Bloquear PRs se workflow falhar (status checks obrigatórios)

**Racional:** Captura 70% dos erros com baixo custo. Cria cultura de "build verde".

### Fase 3: Garantia de Qualidade Profunda (Testes Robustos)

**Objetivo:** Sistema funciona integrado antes de pensar em deploy.

**Ações:**
1. ✅ Configurar **Playwright** para testes E2E
2. ✅ Escrever E2E para fluxos críticos (Login, Navegação)
3. ✅ Upload de artefatos de teste em caso de falha
4. ✅ Adicionar job de E2E ao CI

**Racional:** Testes unitários não garantem que a aplicação sobe. E2E valida o sistema completo.

### Fase 4: Automação de Entrega (CD)

**Objetivo:** Automatizar transporte do código para infraestrutura.

**Ações:**
1. ✅ Configurar **Environments** no GitHub (`staging`, `production`)
2. ✅ Adicionar **Deployment Protection Rules** para produção
3. ✅ Criar job de deploy condicional (`needs: build` + `if: branch == main`)
4. ⬜ Configurar autenticação OIDC com provedor de nuvem (mais seguro que secrets)

**Racional:** Código é confiável (Fase 3), agora pode ser entregue automaticamente.

### Fase 5: Refinamento e DevSecOps

**Objetivo:** Melhorar segurança e reduzir intervenção humana.

**Ações:**
1. ⬜ Integrar scanners de segurança (Trivy, CodeQL)
2. ⬜ Implementar **Semantic Release** para versionamento automático
3. ⬜ Gerar changelogs automaticamente

**Racional:** Otimizações finais que transformam pipeline funcional em pipeline de classe mundial.

### Checklist Visual

```
[✅] Fase 1: Fundação
    [✅] Trunk-Based Development
    [✅] Branch Protection Rules
    [✅] Pre-commit hooks

[✅] Fase 2: CI Básico
    [✅] Lint automático
    [✅] Testes unitários
    [✅] Cache de dependências

[✅] Fase 3: Qualidade Profunda
    [✅] Testes E2E (Playwright)
    [✅] Artefatos de falha

[✅] Fase 4: CD
    [✅] Environment production
    [⬜] Deployment Protection Rules
    [✅] Deploy condicional

[⬜] Fase 5: DevSecOps
    [⬜] Security scanning
    [⬜] Semantic Release
```

---

## 10. Métricas DORA

O [State of DevOps Report](https://cloud.google.com/devops/state-of-devops) identifica 4 métricas-chave que diferenciam equipes de alta performance:

### As 4 Métricas

| Métrica | Elite | High | Medium | Low |
|---------|-------|------|--------|-----|
| **Deployment Frequency** | On-demand (múltiplas/dia) | Semanal | Mensal | < 1/mês |
| **Lead Time for Changes** | < 1 hora | 1 dia - 1 semana | 1-6 meses | > 6 meses |
| **Change Failure Rate** | 0-15% | 16-30% | 16-30% | > 30% |
| **Time to Restore** | < 1 hora | < 1 dia | 1 dia - 1 semana | > 6 meses |

### Estatística Importante

> Organizações com práticas CI/CD maduras fazem deploy **208 vezes mais frequentemente** e têm lead times **106 vezes mais rápidos** que seus pares.

---

## 11. Workflow de Desenvolvimento Local

### 11.1 Ordem Obrigatória de Operações

**NUNCA pule etapas. NUNCA faça deploy manual.**

```
┌─────────────────────────────────────────────────────────────┐
│  1. DESENVOLVER                                             │
│     - Criar branch: git checkout -b feat/nome-feature       │
│     - Fazer mudanças no código                              │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  2. TESTAR LOCALMENTE                                       │
│     - Frontend: npm run dev (localhost:5173)                │
│     - Verificar visualmente as mudanças                     │
│     - Testar fluxos afetados                                │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  3. RODAR TESTES AUTOMATIZADOS                              │
│     - npm test (testes unitários)                           │
│     - npm run lint (verificar código)                       │
│     - npm run build (verificar build)                       │
│     - npx playwright test (E2E mocked)                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  4. COMMIT + PUSH                                           │
│     - git add .                                             │
│     - git commit -m "tipo(escopo): descrição"               │
│     - git push origin feat/nome-feature                     │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  5. CRIAR PR                                                │
│     - gh pr create --title "..." --body "..."               │
│     - Aguardar CI passar                                    │
│     - Revisar mudanças                                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  6. MERGE → DEPLOY AUTOMÁTICO                               │
│     - Merge no GitHub                                       │
│     - CI/CD faz deploy automaticamente                      │
│     - Frontend → Cloudflare Pages                           │
│     - Worker → Cloudflare Workers                           │
└─────────────────────────────────────────────────────────────┘
```

### 11.2 Testando Localmente

#### Frontend (sempre possível)
```bash
cd frontend
npm run dev
# Acesse http://localhost:5173
# Frontend aponta para API de produção por padrão
```

#### Worker/Backend (limitações)
```bash
# Worker local NÃO conecta ao banco de produção
# Use apenas para testar lógica que não depende do banco
npx wrangler dev --local
```

**Importante:** Mudanças no worker que envolvem banco de dados (D1) só podem ser testadas após deploy via CI/CD.

### 11.3 O Que Pode Ser Testado Localmente

| Tipo de Mudança | Testável Local? | Como Testar |
|-----------------|-----------------|-------------|
| UI/Componentes React | ✅ Sim | `npm run dev` |
| Estilos CSS | ✅ Sim | `npm run dev` |
| Lógica frontend (hooks, utils) | ✅ Sim | `npm test` |
| Chamadas de API (existentes) | ✅ Sim | Frontend → API produção |
| Novos endpoints no worker | ⚠️ Parcial | Lógica sim, banco não |
| Queries SQL (D1) | ❌ Não | Só via deploy |
| Storage (R2) | ❌ Não | Só via deploy |

### 11.4 Regras de Ouro

1. **NUNCA execute `wrangler deploy` manualmente** - O CI/CD faz isso
2. **SEMPRE teste localmente antes de commit** - Mesmo que parcialmente
3. **SEMPRE rode os testes automatizados** - `npm test && npm run lint && npm run build`
4. **NUNCA faça merge sem CI verde** - Branch protection existe por isso
5. **CONFIE no processo** - Mudancas simples de SQL podem ir direto (apos testes)

### 11.5 Regras para IA (Claude)

> **IMPORTANTE:** Estas regras sao obrigatorias para a IA durante o desenvolvimento.

1. **"Testar localmente" = USUARIO testar visualmente no browser**
   - Testes automatizados (`npm test`) NAO substituem teste visual do usuario
   - SEMPRE aguardar confirmacao do usuario antes de prosseguir para commit/PR

2. **Ordem obrigatoria antes de commit:**
   ```
   1. Fazer as mudancas
   2. Rodar testes automatizados (npm test, lint, build)
   3. AGUARDAR usuario testar visualmente no localhost
   4. Usuario confirma que testou e aprovou
   5. So entao fazer commit + push + PR
   ```

3. **NUNCA pular a etapa de teste visual do usuario**
   - Mesmo que testes automatizados passem
   - Mesmo que o build funcione
   - O usuario PRECISA ver a mudanca funcionando

### 11.6 Checklist Pre-Commit

```
[ ] Testes automatizados passaram? (npm test, lint, build)
[ ] USUARIO testou visualmente no localhost?
[ ] USUARIO aprovou as mudancas?
[ ] Mensagem de commit segue Conventional Commits?
```

---

## 12. Referências

### Estratégias de Branching
- [Trunk-Based Development | Atlassian](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development)
- [Trunk-Based Development vs. Git Flow | Toptal](https://www.toptal.com/software/trunk-based-development-git-flow)
- [Git Branching Strategies | AWS](https://docs.aws.amazon.com/prescriptive-guidance/latest/choosing-git-branch-approach/git-branching-strategies.html)
- [Trunk-based development vs Gitflow | Graphite](https://graphite.com/guides/trunk-vs-gitflow)

### Governança e Proteção
- [About protected branches | GitHub Docs](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [About code owners | GitHub Docs](https://docs.github.com/articles/about-code-owners)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Semantic Release | GitHub](https://github.com/semantic-release/semantic-release)

### Testes
- [Unit, Integration, and E2E Testing for Fullstack Apps in 2025 | Talent500](https://talent500.com/blog/fullstack-app-testing-unit-integration-e2e-2025/)
- [End-To-End Testing Guide 2025 | Leapwork](https://www.leapwork.com/blog/end-to-end-testing)
- [Testing Pyramid for Frontend | Meticulous](https://www.meticulous.ai/blog/testing-pyramid-for-frontend)
- [Master Flaky Test Management | Aqua Cloud](https://aqua-cloud.io/flaky-tests/)

### CI/CD e GitHub Actions
- [CI/CD Best Practices | Graphite](https://graphite.com/guides/in-depth-guide-ci-cd-best-practices)
- [Using conditions to control job execution | GitHub Docs](https://docs.github.com/actions/using-jobs/using-conditions-to-control-job-execution)
- [Control the concurrency of workflows | GitHub Docs](https://docs.github.com/actions/writing-workflows/choosing-what-your-workflow-does/control-the-concurrency-of-workflows-and-jobs)
- [GitHub Actions Matrix Strategy | Codefresh](https://codefresh.io/learn/github-actions/github-actions-matrix/)

### Segurança
- [Open-Source Container Security Tools | Wiz](https://www.wiz.io/academy/open-source-container-security-tools)
- [Best DevSecOps Tools 2025 | Upwind](https://www.upwind.io/glossary/13-best-devsecops-tools-2025s-best-open-source-options-sorted-by-use-case)

### Deployment
- [Deployments and environments | GitHub Docs](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
- [GitHub Actions Deployment Strategies | Medium](https://medium.com/@amareswer/github-actions-deployment-strategies-with-environments-9646985394cf)

### Feature Flags
- [Feature Toggles | Martin Fowler](https://martinfowler.com/articles/feature-toggles.html)
- [Feature Flag Best Practices | Graphite](https://graphite.com/guides/feature-flag-best-practices-continuous-deployment)
- [Feature Flags for Continuous Deployment | CircleCI](https://circleci.com/blog/feature-flags-continuous-deployment/)

### Pre-commit Hooks
- [Prevent Bad Commits with Husky | Better Stack](https://betterstack.com/community/guides/scaling-nodejs/husky-and-lint-staged/)

---

*Documento gerado em: Dezembro 2025*
*Versão: 2.0*
*Projeto: Acervo Filarmônica*
