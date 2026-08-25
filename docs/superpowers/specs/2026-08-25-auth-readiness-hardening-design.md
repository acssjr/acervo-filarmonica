# Auth readiness hardening

## Objetivo

Impedir que falhas de infraestrutura sejam exibidas como usuário inexistente e tornar a publicação capaz de revelar configurações obrigatórias ausentes.

## Decisões aprovadas

- Usar um contador atômico no D1 para o login e o rate limiting nativo do Cloudflare Workers nas rotas de consulta e telemetria, sem contador manual em KV.
- Limitar login a 5 tentativas por conta e IP a cada 5 minutos, limpando a contagem após autenticação válida.
- Criar um limite separado para consulta de usuário: 30 consultas por minuto e por IP.
- Retornar `429` somente quando o limite estiver realmente esgotado.
- Retornar `503` quando o D1 ou o binding de rate limit necessário estiver ausente ou indisponível.
- No frontend, mostrar “Não encontrado” somente para `200` com `exists: false`.
- Mostrar mensagens próprias para excesso de tentativas e indisponibilidade técnica.
- Fazer `/api/health` validar D1 e a presença de R2, dos três limitadores e do JWT, sem expor valores.
- Normalizar CRLF/LF na verificação do esquema gerado.
- Não configurar nem alterar PostHog.

## Validação

Após a implementação serão executados testes do backend e frontend, lint, contratos, verificação do esquema, typecheck, build e chamadas de fumaça contra o Worker publicado.
