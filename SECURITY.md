# Política de segurança

## Controles implementados

- JWT assinado com segredo obrigatório; produção falha de forma segura se `JWT_SECRET` não estiver configurado.
- Autorização administrativa validada contra o usuário ativo no D1, sem confiar apenas nas claims do token.
- Rate limiting obrigatório em produção: contador atômico no D1 para falhas por conta e IP, contenção ampla por IP com `LOGIN_RATE_LIMITER` e bindings nativos separados para consulta de usuário e telemetria.
- Uploads administrativos validados por tipo, tamanho e estrutura do arquivo.
- Objetos no R2 usam namespaces e mutações coordenadas com o D1 para reduzir arquivos órfãos e estados parciais.
- Respostas de download usam nomes de arquivo sanitizados.
- Analytics é assíncrono e não altera o resultado da requisição principal.

## Segredos e configuração de produção

Nunca grave segredos em `wrangler.toml`, arquivos `.env`, logs ou commits. Configure-os com o Wrangler:

```powershell
npx wrangler secret put JWT_SECRET
npx wrangler secret put POSTHOG_API_KEY
```

Use um `JWT_SECRET` aleatório, longo e exclusivo. Rotacionar esse segredo encerra todas as sessões existentes, portanto a operação deve ser planejada.

O valor conhecido presente no script `api:local` assina somente sessões do emulador local e não é um segredo de produção.

Os três bindings nativos são declarados no `wrangler.toml`; o contador preciso de login usa a tabela criada pela migration `0004_login_rate_limits.sql`. A ausência de qualquer dependência bloqueia a operação protegida em produção por decisão de segurança.

## Dependências

Os projetos raiz e frontend usam lockfiles e devem ser instalados com `npm ci` em CI. Execute antes de cada publicação:

```powershell
npm audit
npm audit --prefix frontend
```

`browser-image-compression` é usado somente no navegador, no fluxo autenticado de upload administrativo. Por ter baixa frequência de manutenção, deve continuar sob revisão periódica e pode ser substituído se surgir alternativa compatível e mantida.

## Comunicação de vulnerabilidades

Não publique detalhes sensíveis em uma issue aberta. Use o formulário privado de [novo aviso de segurança do GitHub](https://github.com/acssjr/acervo-filarmonica/security/advisories/new).

Inclua impacto, forma de reprodução e versão afetada. O prazo esperado para a primeira resposta dos mantenedores é de até sete dias corridos.
