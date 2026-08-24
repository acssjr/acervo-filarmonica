# Arquitetura do Acervo Digital

## Entrada única

O backend executável é `worker/src/index.js`, selecionado por `wrangler.toml`. Os scripts locais e de deploy usam essa mesma configuração.

`worker/index.js` é o monólito histórico anterior à modularização. Ele não deve receber correções nem ser iniciado. Será removido depois que o inventário de rotas e o OpenAPI confirmarem a paridade necessária.

## Fluxo de uma requisição

1. O React chama uma rota `/api`.
2. `worker/src/routes/router.js` encontra método e caminho.
3. Middlewares aplicam CORS, autenticação, autorização e limites.
4. O serviço de domínio executa a regra de negócio.
5. D1 armazena metadados e R2 armazena arquivos.
6. A resposta retorna JSON ou o arquivo solicitado.

## Fontes de verdade

- Backend: `worker/src/`.
- Banco: `database/migrations/`.
- Contrato HTTP: `worker/openapi.yaml`.
- Schema dos testes: gerado das migrations por `npm run db:schema:generate`.
