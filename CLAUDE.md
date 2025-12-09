# Contexto do Projeto - Acervo Filarmonica

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

### Scripts disponíveis (raiz)

| Comando | Descrição |
|---------|-----------|
| `npm run api` | Inicia backend local (porta 8787) |
| `npm run db:init` | Cria tabelas + seed inicial |
| `npm run db:seed` | Apenas seed (se tabelas existem) |
| `npm run db:reset` | Limpa dados e reaplica seed |

### Scripts disponíveis (frontend)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Frontend apontando para LOCAL (8787) |
| `npm run dev:prod` | Frontend apontando para PRODUCAO (com warning) |

## Regras para Claude

1. **NUNCA modificar vite.config.js para apontar diretamente para produção**
2. **NUNCA rodar comandos wrangler sem --local em desenvolvimento**
3. Se precisar testar com produção, usar `npm run dev:prod` (temporário)
4. Lembrar que dados locais ficam em `.wrangler/state/`

## Arquitetura

```
Frontend (Vite)     →  Backend (Wrangler Dev)  →  D1 Local + R2 Local
localhost:5173          localhost:8787              .wrangler/state/
```

## URLs

- **Produção Frontend**: https://partituras25.com
- **Produção API**: https://api.partituras25.com
- **Local Frontend**: http://localhost:5173
- **Local API**: http://localhost:8787
