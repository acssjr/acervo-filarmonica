# Identificação amigável de usuários no PostHog

## Objetivo

Exibir o nome de uso do músico ou administrador nos perfis e gravações do PostHog sem alterar a identidade técnica estável nem enviar credenciais.

## Decisão

- manter `user_<id>` como `distinct_id`;
- enviar `name` somente como propriedade da pessoa durante `identify`;
- escolher `nome_exibicao`, depois `name` e por fim `nome` como fonte do nome;
- continuar enviando `role` e `instrumento` como propriedades da pessoa;
- não enviar `username`, e-mail ou PIN;
- não registrar o nome como superpropriedade dos eventos.

## Fluxo

Depois da autenticação, `AuthContext` chama `identifyPostHogUser`. O serviço monta propriedades seguras, identifica o mesmo `user_<id>` e inicia a gravação. Atualizações do nome de exibição passam novamente pelo mesmo fluxo porque alteram o objeto `user` do contexto.

## Validação

Um teste unitário verificará a prioridade do nome de exibição, a normalização de espaços e a ausência de login, e-mail e PIN nas propriedades enviadas. Lint, testes completos e build validarão a integração.
