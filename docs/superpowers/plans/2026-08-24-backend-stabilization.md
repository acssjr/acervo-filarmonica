# Plano de implementação da estabilização do backend

> **Para agentes:** executar nesta branch. O usuário dispensou TDD; adicionar testes de regressão após cada lote e executar a suíte focada antes de continuar.

**Objetivo:** tornar o Worker modular o único backend confiável, proteger autenticação e configuração, reconciliar migrações D1, tornar operações R2/D1 recuperáveis, alinhar contrato da API e CI e remover riscos de dependências e desenvolvimento sem alterar o comportamento do produto.

**Arquitetura:** preservar React, Cloudflare Workers, D1 e R2. Consolidar configuração e contratos em torno de `worker/src/index.js`, com pequenos auxiliares de infraestrutura para armazenamento e tarefas assíncronas.

**Tecnologias:** JavaScript/TypeScript, React 18, Vite, Cloudflare Workers, D1, R2, Vitest, Jest, OpenAPI e ESLint.

---

## Tarefa 1: proteger configuração e autorização

**Arquivos principais:** `wrangler.toml`, autenticação, autorização, rate limiting, rotas de estatísticas e saúde.

- [ ] Remover qualquer JWT versionado e documentar `wrangler secret put JWT_SECRET`.
- [ ] Falhar de forma controlada quando o segredo estiver ausente.
- [ ] Tratar o campo `usuarios.admin` atual do D1 como fonte de autorização.
- [ ] Autenticar o tracking antes de calcular sua chave de limite.
- [ ] Tornar degradações de rate limiting visíveis sem expor bindings.
- [ ] Cobrir administradores rebaixados, secrets ausentes e chaves autenticadas.
- [ ] Executar testes focados e lint do Worker.

## Tarefa 2: estabelecer uma cadeia canônica de migrações D1

**Arquivos principais:** `database/migrations`, gerador de schema, scripts npm, setup dos testes e instalação.

- [ ] Inventariar o schema exigido pelos serviços.
- [ ] Criar baseline completo e arquivar o histórico SQL anterior.
- [ ] Corrigir o tipo histórico do instrumento em `logs_download`.
- [ ] Manter comandos locais e remotos explícitos.
- [ ] Fazer reset somente local e em ordem segura para chaves estrangeiras.
- [ ] Gerar o schema de testes a partir das migrações ativas.
- [ ] Validar a construção de um banco vazio e executar toda a suíte do Worker.

## Tarefa 3: convergir para o Worker modular

**Arquivos principais:** scripts de desenvolvimento, rotas de perfil e repertório e documentação de arquitetura.

- [ ] Apontar todos os scripts para o entrypoint definido no `wrangler.toml`.
- [ ] Remover incompatibilidades CommonJS/ESM dos scripts.
- [ ] Restaurar `GET /api/perfil/foto/:filename` no router modular.
- [ ] Corrigir o fallback de instrumento do repertório.
- [ ] Inventariar rotas conhecidas e marcar `worker/index.js` como legado.
- [ ] Executar testes de rotas, lint e suíte completa.

## Tarefa 4: tornar o armazenamento recuperável e isolado

**Arquivos principais:** infraestrutura de storage, serviços de partituras, perfil e assets.

- [ ] Centralizar namespaces de `partituras/`, `partes/`, `perfil/` e `assets/`.
- [ ] Remover uploads novos quando a mutação D1 correspondente falhar.
- [ ] Substituir arquivos na ordem: upload novo, atualização D1, exclusão antiga.
- [ ] Validar assinatura, MIME, tamanho e quantidade de PDFs.
- [ ] Restringir listagem e exclusão de assets ao namespace permitido.
- [ ] Preservar somente os fallbacks legados necessários para leitura.
- [ ] Cobrir falhas injetadas de D1 e R2.

## Tarefa 5: validar entradas e agrupar mutações

**Arquivos principais:** validadores, repertórios, presença, ensaios, configurações e downloads.

- [ ] Validar IDs positivos, datas ISO, URLs HTTP, paginação e cabeçalhos.
- [ ] Usar `batch()` para operações relacionadas de repertório.
- [ ] Preservar strings vazias permitidas em atualizações.
- [ ] Distinguir conflitos de unicidade de outras falhas do banco.
- [ ] Sanitizar nomes de download e validar dados nas fronteiras das rotas.
- [ ] Executar testes focados e completos.

## Tarefa 6: alinhar OpenAPI, tipos e CI

**Arquivos principais:** `worker/openapi.yaml`, tipos gerados, cliente tipado e workflow de CI.

- [ ] Documentar todas as rotas ativas e suas respostas relevantes.
- [ ] Corrigir imports e tipos do cliente OpenAPI.
- [ ] Conferir métodos e caminhos do router contra o contrato.
- [ ] Detectar drift de geração e executar typecheck na CI.
- [ ] Executar geração, contrato, lint, testes e build.

## Tarefa 7: desacoplar analytics e tornar o desenvolvimento seguro

- [ ] Enviar PostHog como tarefa best effort, usando `waitUntil()` quando disponível.
- [ ] Impedir que falhas de analytics alterem respostas de login e CRUD.
- [ ] Usar a API local por padrão no Vite e exigir escolha explícita para produção.
- [ ] Cobrir falhas do provedor e executar build local.

## Tarefa 8: atualizar dependências e carregamento

- [ ] Atualizar dependências vulneráveis em grupos compatíveis.
- [ ] Executar `npm audit` e registrar qualquer risco restante.
- [ ] Remover imports estáticos que anulam lazy loading.
- [ ] Manter módulos grandes fora do carregamento inicial quando possível.
- [ ] Executar typecheck, lint, testes e build do frontend.

## Tarefa 9: verificar e documentar publicação controlada

- [ ] Documentar setup local, secrets, migrações e rollback.
- [ ] Executar verificação completa, auditorias e `git diff --check`.
- [ ] Fazer smoke tests locais sem tocar em D1 ou R2 remotos.
- [ ] Inspecionar o diff para segredos e mudanças não relacionadas.
- [ ] Interromper antes de qualquer migração, secret ou deploy remoto.

## Tarefa 10: preparar a modernização visual do frontend

- [ ] Inventariar telas, estados e fluxos responsivos.
- [ ] Apresentar alternativas visuais antes de mudar a linguagem do produto.
- [ ] Criar plano separado que preserve todas as capacidades existentes.
