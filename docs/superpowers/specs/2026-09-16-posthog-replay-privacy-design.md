# Visibilidade e privacidade nas gravações do PostHog

## Objetivo

Permitir que as gravações de sessão mostrem textos da interface e valores digitados em campos comuns, especialmente as buscas, sem registrar nenhum PIN.

## Comportamento aprovado

- Textos normais da interface ficam visíveis na gravação.
- Valores de campos comuns, incluindo buscas, ficam visíveis na gravação.
- Todos os campos de PIN permanecem mascarados no login, na alteração de PIN e nas telas administrativas.
- Campos `input[type="password"]` continuam protegidos pelo mascaramento nativo do gravador.
- Campos de PIN que não sejam do tipo `password` recebem marcação explícita de privacidade.
- Elementos já marcados com `data-private` ou `.ph-no-capture` continuam bloqueados.
- Corpos e cabeçalhos de rede continuam sem gravação.
- A sanitização de eventos continua removendo propriedades como `pin`, tokens, autenticação, e-mail e usuário.

## Implementação

1. Desativar o mascaramento global de texto (`mask_all_text`).
2. Desativar o mascaramento global de inputs (`maskAllInputs`).
3. Remover o seletor global de mascaramento de texto (`maskTextSelector: '*'`).
4. Marcar explicitamente os campos de PIN administrativos que hoje usam `type="text"`.
5. Preservar as demais barreiras de privacidade existentes.

## Validação

- Confirmar por teste que o PostHog inicia com textos e inputs comuns liberados.
- Confirmar que cada fluxo de PIN possui proteção explícita ou usa `type="password"`.
- Executar lint, testes relevantes e build do frontend.

## Fora do escopo

- Alterar eventos personalizados ou propriedades coletadas.
- Gravar conteúdo de requisições e respostas.
- Alterar amostragem, identificação de usuários ou retenção no PostHog.
