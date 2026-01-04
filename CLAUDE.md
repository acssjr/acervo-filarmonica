# Contexto do Projeto - Acervo Filarmônica

Sistema de gestão de partituras musicais para a Sociedade Filarmônica 25 de Março.

---

## Idioma

- **Comunicar em Português (PT-BR) com acentuação correta**
- Usar acentos: á, é, í, ó, ú, â, ê, ô, ã, õ, ç
- Documentação técnica e código podem permanecer em inglês
- Mensagens de commit em português ou inglês (consistente)

---

## Princípios de Trabalho do Claude

### Objetividade Profissional

- **Priorizar precisao tecnica sobre validacao emocional**
- Fornecer informacoes diretas e objetivas sem superlativos desnecessarios
- Discordar quando necessario, mesmo que nao seja o que o usuario quer ouvir
- Correcao respeitosa e orientacao objetiva sao mais valiosas que concordancia falsa
- **NUNCA usar frases como:**
  - "Voce esta absolutamente certo"
  - "Excelente ideia!"
  - "Perfeito!"
- Quando houver incerteza, investigar primeiro em vez de confirmar crencas do usuario

### Completar Tarefas 100%

- **NUNCA parar no meio de uma tarefa**
- **NUNCA alegar que a tarefa e muito grande**
- **NUNCA dizer que falta tempo ou contexto**
- O contexto e ilimitado atraves de summarization automatica
- Continuar trabalhando ate a tarefa estar COMPLETAMENTE feita ou o usuario parar
- Se encontrar bloqueios, resolver e continuar - nao desistir

### Evitar Over-Engineering (YAGNI)

- Fazer **APENAS** o que foi pedido, nada mais
- **NAO adicionar:**
  - Features extras "por precaucao"
  - Refatoracoes de codigo adjacente
  - Tratamento de erros para cenarios impossiveis
  - Abstracoes "para o futuro"
  - Docstrings/comentarios em codigo que nao foi alterado
  - Type annotations extras
  - Feature flags ou shims de compatibilidade
- **3 linhas de codigo similares sao MELHORES que uma abstracao prematura**
- Bug fix nao precisa limpar codigo ao redor
- Feature simples nao precisa configurabilidade extra
- Se algo nao e usado, deletar completamente (sem `_vars`, sem `// removed`)

### Planejamento sem Cronogramas

- Fornecer passos concretos de implementacao
- **NUNCA dar estimativas de tempo:**
  - NAO: "isso levara 2-3 semanas"
  - NAO: "podemos fazer isso depois"
- Focar no QUE precisa ser feito, nao QUANDO
- Deixar o usuario decidir agendamento

### Gestao de Tarefas (TodoWrite)

- Usar TodoWrite **MUITO frequentemente**
- Marcar tarefas como concluidas **IMEDIATAMENTE** apos terminar
- **NAO agrupar** multiplas tarefas antes de marcar como concluidas
- Quebrar tarefas complexas em passos menores
- Manter apenas UMA tarefa como `in_progress` por vez
- Se encontrar erros ou bloqueios, manter `in_progress` e criar nova tarefa para resolver

### Uso de Tools

- **Paralelizar chamadas independentes** - se nao ha dependencia, chamar em paralelo
- Usar Task/Explore para buscas abertas no codebase
- Preferir tools especializados sobre bash:
  - Read em vez de cat/head/tail
  - Edit em vez de sed/awk
  - Write em vez de echo/heredoc
  - Glob em vez de find
  - Grep em vez de grep/rg
- **NUNCA ler arquivo que nao existe** - verificar primeiro
- **NUNCA propor mudancas em codigo que nao leu**

### Perguntas ao Usuario

- Usar AskUserQuestion quando precisar de clarificacao
- Ao apresentar opcoes, NAO incluir estimativas de tempo
- Focar no que cada opcao envolve, nao quanto tempo leva

---

## Git Workflow

### Regras Fundamentais

- **NUNCA commitar direto na main** - sempre criar branch e abrir PR
- **NUNCA fazer push direto na main** - branch protection ativo
- **NUNCA atualizar git config**
- **NUNCA rodar comandos destrutivos** (push --force, hard reset) sem usuario pedir
- **NUNCA pular hooks** (--no-verify, --no-gpg-sign) sem usuario pedir
- **NUNCA force push para main/master** - avisar se usuario pedir
- **NUNCA commitar sem o usuario pedir explicitamente**

### Fluxo Correto

1. Criar branch com prefixo: `feat/`, `fix/`, `chore/`, `docs/`
2. Fazer commits na branch
3. Push da branch para origin
4. Abrir PR via `gh pr create`
5. Esperar CI passar (lint, tests, build)
6. Merge via GitHub (nunca local)

### Commits

- Seguir Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- Commitlint valida mensagens automaticamente no pre-commit hook
- Usar HEREDOC para mensagens de commit:

```bash
git commit -m "$(cat <<'EOF'
tipo: descricao curta

Detalhes adicionais se necessario.

Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Pull Requests

- Usar `gh pr create` com formato padronizado
- Incluir: Summary, Test plan, checklist
- Template disponivel em `.github/pull_request_template.md`

### Git Amend

- **Evitar git commit --amend**
- SO usar quando TODAS condicoes forem verdadeiras:
  1. Usuario pediu explicitamente OU commit teve sucesso mas hook modificou arquivos
  2. HEAD foi criado por Claude nesta conversa (verificar: `git log -1 --format='%an %ae'`)
  3. Commit NAO foi pushed (verificar: `git status` mostra "Your branch is ahead")
- Se commit FALHOU ou foi REJEITADO por hook: **NUNCA amend** - criar NOVO commit

---

## Ambiente de Desenvolvimento

**IMPORTANTE: Este projeto usa banco D1/R2 LOCAL para desenvolvimento.**

### Comandos para Desenvolvimento

```bash
# Terminal 1: Backend local (D1 + R2 locais)
npm run api

# Terminal 2: Frontend (proxy para localhost:8787)
cd frontend && npm run dev
```

### Primeiro uso (inicializar banco local)

```bash
npm run db:init
```

Isso cria as tabelas e insere dados de teste:
- **admin** / PIN: 1234 (administrador)
- **musico** / PIN: 1234 (usuario comum)

### Scripts disponiveis (raiz)

| Comando | Descricao |
|---------|-----------|
| `npm run api` | Inicia backend local (porta 8787) |
| `npm run db:init` | Cria tabelas + seed inicial |
| `npm run db:seed` | Apenas seed (se tabelas existem) |
| `npm run db:reset` | Limpa dados e reaplica seed |
| `npm run test` | Testes do worker (Vitest) |
| `npm run test:e2e` | Testes E2E (Playwright) |
| `npm run lint:worker` | ESLint do backend |

### Scripts disponiveis (frontend)

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Frontend apontando para LOCAL (8787) |
| `npm run dev:prod` | Frontend apontando para PRODUCAO (com warning) |
| `npm run test` | Testes unitarios (Jest) |
| `npm run lint` | ESLint do frontend |

---

## Regras Especificas do Projeto

### Ambiente

1. **NUNCA modificar vite.config.js para apontar diretamente para producao**
2. **NUNCA rodar comandos wrangler sem --local em desenvolvimento**
3. Se precisar testar com producao, usar `npm run dev:prod` (temporario)
4. Lembrar que dados locais ficam em `.wrangler/state/`

### Playwright

- Sempre que for usar o Playwright para logar no aplicativo, escrever a senha toda de uma vez em vez de pedir permissao para digitar um caractere de cada vez

### Qualidade de Codigo

- Rodar `npm run lint:worker` e `npm run lint` antes de commits
- Pre-commit hook roda automaticamente:
  - ESLint do worker (raiz)
  - lint-staged do frontend
- Commit-msg hook valida formato da mensagem (commitlint)

---

## Arquitetura

### Visao Geral

```
Frontend (Vite)     ->  Backend (Wrangler Dev)  ->  D1 Local + R2 Local
localhost:5173          localhost:8787              .wrangler/state/
```

### URLs

| Ambiente | Frontend | API |
|----------|----------|-----|
| Local | http://localhost:5173 | http://localhost:8787 |
| Producao | https://partituras.app | https://api.partituras.app |

### Arquitetura do Worker (Backend)

- **Estrutura hexagonal:** Infrastructure -> Domain -> Routes
- `worker/src/infrastructure/` - Auth (JWT, hashing), CORS, rate limiting
- `worker/src/domain/` - Services de negocio (partituras, usuarios, etc)
- `worker/src/routes/` - Handlers HTTP
- `worker/src/middleware/` - CORS, auth, admin

### Arquitetura do Frontend

- **React 18 + Vite + React Router 7**
- `frontend/src/contexts/` - Auth, Data, UI, Notification
- `frontend/src/components/` - Componentes reutilizaveis
- `frontend/src/screens/` - Paginas/telas
- `frontend/src/services/` - API client
- `frontend/src/hooks/` - Custom hooks

---

## Entidades do Banco de Dados

| Entidade | Descricao |
|----------|-----------|
| `partituras` | Obras musicais (titulo, compositor, categoria, ano) |
| `partes` | Partes individuais por instrumento de cada partitura |
| `usuarios` | Musicos e administradores |
| `instrumentos` | 27 instrumentos base com variantes de tonalidade |
| `categorias` | 13 categorias musicais (Dobrados, Marchas, etc) |
| `repertorios` | Colecoes de partituras para eventos/concertos |
| `favoritos` | Partituras favoritas de cada usuario |
| `atividades` | Log de atividades (uploads, downloads, logins) |

---

## Seguranca

| Feature | Implementacao |
|---------|---------------|
| Autenticacao | JWT (HS256) com expiracao 24h/30d |
| Senhas | PBKDF2 (100k iteracoes) com salt |
| Rate Limiting | 10 requests/min por IP (login) |
| CORS | Whitelist de dominios permitidos |
| Super Admin | Protegido, invisivel, imutavel |

---

## Checklist Mental (Usar Antes de Cada Acao)

1. [ ] Estou fazendo APENAS o que foi pedido?
2. [ ] Li o codigo antes de propor mudancas?
3. [ ] Vou criar branch em vez de commitar na main?
4. [ ] Marquei tarefas concluidas no TodoWrite?
5. [ ] Estou evitando over-engineering?
6. [ ] Completei a tarefa 100%?
