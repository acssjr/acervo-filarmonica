# Compartilhamento de Partitura Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar envio de link com preview social dinâmico e preservar o envio de cópia do PDF no botão Enviar.

**Architecture:** O frontend concentra a composição da mensagem e a chamada das APIs nativas em uma unidade testável, enquanto um modal pequeno escolhe entre cópia e link. Uma Pages Function serve o mesmo SPA com metadados sociais específicos e gera uma imagem PNG 1200×630 por partitura usando a API oficial `ImageResponse`, sem tornar os downloads públicos.

**Tech Stack:** React 18, React Router 7, Jest, Cloudflare Pages Functions, `@cloudflare/pages-plugin-vercel-og`, Wrangler 4.

---

## Estrutura de arquivos

- `frontend/src/utils/sheetShare.js`: URL canônica, mensagem e compartilhamento/fallback.
- `frontend/src/components/modals/sheet/ShareOptions.jsx`: seletor acessível entre cópia e link.
- `frontend/src/components/modals/SheetDetailModal.jsx`: integra o seletor ao botão existente.
- `frontend/src/hooks/useLoginForm.js`: preserva o destino protegido após login.
- `frontend/functions/acervo/[[path]].js`: entrega HTML com metadados e PNG social dinâmico.
- `frontend/functions/_shared/sheetSocial.js`: valida rota, normaliza dados e injeta metadados.
- `frontend/functions/assets/plus-jakarta-sans-700.bin`: fonte local para a imagem social.
- `frontend/wrangler.jsonc`: isola o deploy do site da configuração do Worker e do D1.
- `frontend/public/assets/images/ui/social-share-fallback.png`: fallback institucional 1200×630.
- `.github/workflows/ci.yml`: compila Functions no CI e publica o diretório correto.

### Task 1: Compartilhamento por link no frontend

**Files:**
- Create: `frontend/src/utils/sheetShare.js`
- Create: `frontend/src/utils/sheetShare.test.js`
- Create: `frontend/src/components/modals/sheet/ShareOptions.jsx`
- Modify: `frontend/src/components/modals/sheet/index.js`
- Modify: `frontend/src/components/modals/SheetDetailModal.jsx`
- Modify: `frontend/src/contexts/DataContext.jsx`
- Test: `frontend/src/components/modals/SheetDetailModal.test.jsx`

- [ ] **Step 1: Implementar os utilitários de URL e mensagem**

Criar funções puras `buildSheetShareUrl`, `buildSheetShareText` e `shareSheetLink`. A URL usa `window.location.origin`, `encodeURIComponent` nos segmentos e `?v=` com `atualizado_em` quando disponível. `shareSheetLink` dispara a cópia sem aguardar antes de chamar `navigator.share({ title, text, url })`; no fallback copia a mensagem completa com a URL.

- [ ] **Step 2: Criar o seletor de ações**

Renderizar duas ações rotuladas, `Enviar cópia` e `Compartilhar link`, com fechamento por overlay, botão, Escape e foco inicial. A opção de cópia informa indisponibilidade quando o navegador não aceita arquivos.

- [ ] **Step 3: Integrar ao modal da partitura**

Exibir `Enviar` em todos os navegadores, abrir o seletor e encaminhar a ação escolhida. Usar categoria legível em mensagem e manter `handleShareInstrument` para a cópia.

- [ ] **Step 4: Adicionar testes de regressão**

Cobrir URL codificada, parâmetro de versão, mensagem, Web Share, clipboard, cancelamento e as duas opções visíveis no modal.

### Task 2: Retorno à peça após autenticação

**Files:**
- Create: `frontend/src/utils/navigation.js`
- Create: `frontend/src/utils/navigation.test.js`
- Modify: `frontend/src/hooks/useLoginForm.js`

- [ ] **Step 1: Implementar validação do destino interno**

Aceitar somente `pathname` iniciado por `/`, rejeitar `//`, `/login` e valores externos. Preservar `search` e `hash`.

- [ ] **Step 2: Aplicar o destino após login**

Ler `location.state.from`, calcular o destino seguro e substituir o redirecionamento fixo para `/`.

- [ ] **Step 3: Testar os destinos aceitos e rejeitados**

Cobrir rota individual com query, raiz, URL externa, protocolo relativo e loop para login.

### Task 3: Preview social automático no Cloudflare Pages

**Files:**
- Create: `frontend/functions/_shared/sheetSocial.js`
- Create: `frontend/functions/acervo/[[path]].js`
- Create: `frontend/functions/assets/plus-jakarta-sans-700.bin`
- Create: `frontend/public/assets/images/ui/social-share-fallback.png`
- Create: `worker/tests/sheetSocial.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Adicionar a dependência oficial e a fonte local**

Instalar `@cloudflare/pages-plugin-vercel-og` e `react` no pacote raiz. Versionar Plus Jakarta Sans 700 em formato binário importável e criar fallback institucional PNG 1200×630.

- [ ] **Step 2: Implementar metadados sociais**

Validar `/acervo/:categoria/:id`, consultar `https://acervo-filarmonica-api.acssjr.workers.dev/api/partituras/:id`, montar título, descrição, canonical, Open Graph e Twitter Card, escapar todos os valores e injetar no `index.html` obtido de `env.ASSETS`.

- [ ] **Step 3: Implementar a imagem automática**

Atender `/acervo/:categoria/:id/social-image.png` com `ImageResponse` 1200×630. Usar vinho, dourado, brasão, Plus Jakarta Sans, gênero, título e o nome do compositor em uma faixa glassmorphism. Não buscar nem gerar foto do compositor.

- [ ] **Step 4: Garantir fallback e cache**

Se a peça não existir, delegar a rota normal ao SPA. Se a imagem falhar, redirecionar para o PNG institucional. Definir cache público curto e `stale-while-revalidate`.

- [ ] **Step 5: Testar helpers e segurança da injeção**

Cobrir análise da rota, escape de HTML, dados ausentes, título longo e presença de todas as tags obrigatórias.

### Task 4: Build e deploy das Pages Functions

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json`

- [ ] **Step 1: Adicionar compilação local das Functions**

Criar script `pages:functions:build` com `wrangler pages functions build functions --project-directory .` e executá-lo no job de lint depois de `npm ci`.

- [ ] **Step 2: Publicar Functions junto aos assets**

Executar o deploy com `--cwd frontend`, onde Wrangler detecta `frontend/functions/` e usa `frontend/wrangler.jsonc`, sem carregar os bindings do Worker da API.

- [ ] **Step 3: Validar o artefato de deploy**

Confirmar que a compilação produz `_worker.js` e `_routes.json` contendo apenas `/acervo/*`, evitando invocações para assets estáticos.

### Task 5: Verificação final

**Files:**
- Modify: `docs/superpowers/plans/2026-08-27-compartilhamento-partitura.md`

- [ ] **Step 1: Executar validações direcionadas**

Executar os testes novos do frontend e do preview social, lint dos arquivos alterados e compilação das Pages Functions.

- [ ] **Step 2: Executar validações completas**

Executar `npm test`, `npm run lint:worker`, `npm run db:schema:test`, e no frontend `npm test -- --runInBand`, `npm run lint`, `npm run typecheck` e `npm run build`.

- [ ] **Step 3: Inspecionar o resultado de Senhora Sant’Anna**

Gerar a resposta local para a peça 96, validar metadados, tipo `image/png`, dimensões 1200×630, presença do nome “Tertuliano Santos” e ausência de qualquer foto de compositor.

- [ ] **Step 4: Revisar diff e estado do repositório**

Executar `git diff --check`, confirmar ausência de migration, preservar `frontend/.env.local` e `tmp/`, e registrar os commits da implementação.
