# Auth readiness hardening

## Objetivo

Impedir que falhas de infraestrutura sejam exibidas como usuário inexistente e tornar a publicação capaz de revelar configurações obrigatórias ausentes.

## Decisões aprovadas

- Manter o limite de login em 5 tentativas por 5 minutos.
- Criar um limite separado para consulta de usuário: 30 consultas por minuto e por IP.
- Retornar `429` somente quando o limite estiver realmente esgotado.
- Retornar `503` quando o KV de rate limit estiver ausente ou indisponível.
- No frontend, mostrar “Não encontrado” somente para `200` com `exists: false`.
- Mostrar mensagens próprias para excesso de tentativas e indisponibilidade técnica.
- Fazer `/api/health` validar D1 e a presença de R2, KV e JWT, sem expor valores.
- Normalizar CRLF/LF na verificação do esquema gerado.
- Não configurar nem alterar PostHog.

## Validação

Após a implementação serão executados testes do backend e frontend, lint, contratos, verificação do esquema, typecheck, build e chamadas de fumaça contra o Worker publicado.
