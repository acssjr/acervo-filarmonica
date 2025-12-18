# Contexto do Projeto - Acervo Filarmonica

Sistema de gestao de partituras musicais para a Sociedade Filarmonica 25 de Marco.

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

## Regras para Claude

### Ambiente
1. **NUNCA modificar vite.config.js para apontar diretamente para producao**
2. **NUNCA rodar comandos wrangler sem --local em desenvolvimento**
3. Se precisar testar com producao, usar `npm run dev:prod` (temporario)
4. Lembrar que dados locais ficam em `.wrangler/state/`

### Playwright
- Sempre que for usar o playwright para logar no aplicativo, escrever a senha toda de uma vez em vez de pedir permissao para digitar um caractere de cada vez

### Qualidade de Codigo
- Seguir Conventional Commits: `feat:`, `fix:`, `chore:`, etc.
- Rodar `npm run lint:worker` e `npm run lint` antes de commits
- Commitlint valida mensagens automaticamente no hook

### Arquitetura do Worker
- Estrutura hexagonal: Infrastructure -> Domain -> Routes
- Services em `worker/src/domain/`
- Rotas em `worker/src/routes/`
- Middleware em `worker/src/middleware/`

### Arquitetura do Frontend
- React 18 + Vite + React Router 7
- Contexts: Auth, Data, UI, Notification
- Componentes em `frontend/src/components/`
- Screens em `frontend/src/screens/`

## Arquitetura

```
Frontend (Vite)     ->  Backend (Wrangler Dev)  ->  D1 Local + R2 Local
localhost:5173          localhost:8787              .wrangler/state/
```

## URLs

- **Producao Frontend**: https://partituras25.com
- **Producao API**: https://api.partituras25.com
- **Local Frontend**: http://localhost:5173
- **Local API**: http://localhost:8787

## Entidades Principais

| Entidade | Descricao |
|----------|-----------|
| `partituras` | Obras musicais (titulo, compositor, categoria) |
| `partes` | Partes individuais por instrumento |
| `usuarios` | Musicos e admins |
| `instrumentos` | 27 instrumentos com variantes |
| `categorias` | 13 categorias musicais |
| `repertorios` | Colecoes de partituras para eventos |
| `favoritos` | Partituras favoritas dos usuarios |

## Referencia

Ver `docs/claude-code-reference.md` para guia de boas praticas do Claude Code.
