# PostHog — configuração do Acervo Digital

## Objetivo

O PostHog complementa o painel interno do Acervo. O D1 continua sendo a fonte de verdade para os relatórios administrativos; o PostHog é usado para compreender navegação, dificuldades de uso, cliques, desempenho e sessões.

## O que está habilitado

- pageviews e saída de página em navegação SPA;
- captura automática de cliques, incluindo rage clicks;
- Web Vitals e exceções do navegador;
- gravação de 100% das sessões autenticadas;
- eventos de negócio confirmados pelo backend;
- eventos de uso já validados pelo tracking interno.

O SDK do navegador é carregado em um chunk separado durante tempo ocioso. Sem configuração, a aplicação funciona normalmente e não envia telemetria.

## Privacidade

- a gravação começa somente depois da autenticação;
- o cartão de login é marcado com `data-private` e nunca entra em replay ou autocapture;
- campos comuns, incluindo buscas, permanecem visíveis para permitir a análise da experiência;
- textos normais da interface permanecem visíveis nos replays;
- campos `password` são mascarados e elementos com `data-private` ou `.ph-no-capture` são bloqueados;
- corpos e cabeçalhos de rede não são gravados;
- query strings e fragmentos são removidos das URLs;
- textos copiados não são capturados;
- PIN, login, e-mail e termos digitados não são enviados como propriedades;
- a identificação usa `user_<id>` como ID estável e envia somente nome de exibição, função e instrumento para facilitar a identificação do perfil;
- o logout encerra o replay e redefine também o identificador do dispositivo.

## Eventos importantes

| Evento | Origem | Decisão apoiada |
|---|---|---|
| `user_logged_in` | backend | uso e retorno dos músicos |
| `login_failed` | frontend | dificuldade de acesso sem registrar credenciais |
| `partitura_aberta` | frontend | interesse real por obras |
| `visualizacao_grade` / `visualizacao_parte` | frontend | consumo no visualizador |
| `download_grade` / `download_parte` | frontend | conclusão do fluxo individual |
| `partitura_downloaded` / `parte_downloaded` | backend | confirmação do arquivo entregue |
| `busca_realizada` | frontend | volume e qualidade dos resultados, sem termo pesquisado |
| `favorito_added` / `favorito_removed` | backend | adoção de favoritos |
| `repertorio_downloaded` | backend | sucesso do download coletivo e partes ausentes |
| `partitura_uploaded_with_parts` | backend | eficiência do upload de pasta |
| `partitura_created` | backend | cadastro individual |

## Funis recomendados

1. Login → busca ou abertura de partitura → visualização → download.
2. Repertório aberto → instrumento escolhido → download concluído.
3. Administração → upload de pasta → obra criada com partes.
4. Sessão com `login_failed` → `user_logged_in`, para medir recuperação do acesso.

Segmente por função, instrumento, navegador, sistema operacional e faixa de viewport. Use replay para investigar rage clicks, exceções, lentidão e abandono; não como substituto dos eventos de negócio.

## Configuração de produção

O build do Pages lê:

- secret do GitHub Actions `VITE_PUBLIC_POSTHOG_KEY`;
- `VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com`.

O Worker lê:

- secret do Cloudflare Worker `POSTHOG_API_KEY`;
- `POSTHOG_HOST` declarado em `wrangler.toml`.

Para desenvolvimento local, a captura fica desligada mesmo que exista uma chave. Para habilitá-la deliberadamente, use `VITE_PUBLIC_POSTHOG_DEBUG=true`.

## Checklist depois do deploy

- confirmar `$pageview` e `$autocapture` no Live Events;
- entrar com um usuário de teste e confirmar `user_logged_in` com o mesmo `distinct_id` do frontend;
- confirmar que o replay começa somente após o login;
- verificar que buscas e textos normais aparecem, enquanto PINs, campos `password` e elementos privados permanecem protegidos;
- confirmar que não há query string, PIN, login ou e-mail nas propriedades dos eventos e que somente o nome de exibição aparece no perfil da pessoa;
- abrir e baixar uma partitura e confirmar somente uma ocorrência de cada evento esperado;
- sair da conta e verificar que a sessão seguinte recebe um novo identificador de dispositivo.
