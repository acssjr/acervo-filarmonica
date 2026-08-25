# Checklist de publicação

Este roteiro separa validação local de alterações remotas. Execute cada etapa conscientemente; migrações, segredos e deploys modificam a produção.

## 1. Validar o código local

```powershell
npm ci
npm ci --prefix frontend
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

Confirme também que não há segredo, `.env` ou arquivo de dados no diff.

## 2. Validar recursos do Cloudflare

```powershell
npx wrangler whoami
```

No painel ou no `wrangler.toml`, confirme:

- D1 `DB` aponta para `acervo-db` correto.
- R2 `BUCKET` aponta para `acervo-pdfs` correto.
- A migration do contador de login foi aplicada e os bindings nativos `LOGIN_RATE_LIMITER`, `CHECK_USER_RATE_LIMITER` e `TRACKING_RATE_LIMITER` estão ligados ao Worker.
- `JWT_SECRET` existe como secret do Worker.
- `POSTHOG_API_KEY` existe somente se analytics estiver habilitado.

Não copie valores de segredos para o terminal, logs ou checklist.

## 3. Aplicar migrações remotas

Faça backup ou exportação do D1 conforme a política operacional e revise as migrações pendentes em `database/migrations`. Só então execute:

```powershell
npm run db:migrate:remote
```

Interrompa a publicação se uma migração falhar. Não execute o seed local na produção.

## 4. Publicar a API

```powershell
npm run deploy
```

Valide imediatamente:

```powershell
curl.exe https://acervo-filarmonica-api.acssjr.workers.dev/api/health
```

Depois faça smoke tests de login, listagem, download e uma operação administrativa reversível.

## 5. Publicar o frontend

Confirme que o build foi gerado para produção e então execute o fluxo de publicação adotado pelo projeto:

```powershell
npm run build --prefix frontend
npm run deploy:pages
```

Valide a URL pública em desktop e mobile, incluindo login, navegação, busca e download.

## 6. Observar e reverter

- Acompanhe logs com `npx wrangler tail acervo-filarmonica-api`.
- Verifique erros, latência, respostas 429 e eventos de analytics.
- Se houver regressão, reverta o Worker para uma versão conhecida e só depois investigue.
- Migrações de banco exigem estratégia própria de correção; não presuma que reverter o código reverte os dados.

Registre commit, horário, responsável, migrações aplicadas e resultado dos smoke tests.
