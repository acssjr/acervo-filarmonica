# Instalação e desenvolvimento local

## Requisitos

- Node.js 20.19 ou superior
- npm
- Conta Cloudflare apenas para publicar

## Preparar o projeto

```powershell
git clone https://github.com/acssjr/acervo-filarmonica.git
cd acervo-filarmonica
npm ci
npm ci --prefix frontend
```

## Inicializar o ambiente local

```powershell
npm run db:init
```

Esse comando aplica as migrações canônicas de `database/migrations` no D1 local e insere somente os dados de `database/seed-local.sql`. O seed contém os usuários `admin` e `musico`, ambos com PIN `1234`, e nunca deve ser aplicado em produção.

Em dois terminais:

```powershell
npm run api:local
```

```powershell
npm run dev --prefix frontend
```

- Frontend: http://localhost:5173
- API: http://localhost:8787
- Saúde da API: http://localhost:8787/api/health

O frontend local usa a API local por padrão. `npm run dev:prod --prefix frontend` é uma opção explícita para apontar a interface local à API de produção.

O script local define um segredo JWT conhecido e `ENVIRONMENT=development` apenas no processo do Wrangler local. Esses valores nunca são usados no deploy.

## Verificar antes de publicar

```powershell
npm test
npm run lint:worker
npm run db:schema:test
npm run api:contract:check
npm run api:types:check
npm audit

npm run typecheck --prefix frontend
npm run lint --prefix frontend
npm test --prefix frontend -- --runInBand
npm run build --prefix frontend
npm audit --prefix frontend
```

## Publicação

A publicação altera recursos externos e não faz parte da instalação local. Antes de executar qualquer comando remoto, siga [docs/DEPLOYMENT-CHECKLIST.md](docs/DEPLOYMENT-CHECKLIST.md).

Não execute `npm run setup`, `npm run db:migrate:remote`, `npm run deploy` ou `npm run deploy:pages` apenas para desenvolver localmente.

## Problemas comuns

### Porta 8787 ou 5173 ocupada

Encerre o processo anterior ou informe outra porta ao Wrangler/Vite.

### Banco local inconsistente

```powershell
npm run db:reset
```

Esse reset afeta apenas o D1 local.

### Autenticação do Cloudflare

Ela só é necessária para operações remotas:

```powershell
npx wrangler login
npx wrangler whoami
```

Para suporte, abra uma issue em https://github.com/acssjr/acervo-filarmonica/issues.
