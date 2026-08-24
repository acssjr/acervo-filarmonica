# Estabilizacao e Modernizacao Incremental do Acervo

## Contexto

O Acervo Digital deixou de ser um unico HTML e evoluiu para uma aplicacao React com um Cloudflare Worker modular, D1, R2 e PostHog. Essa evolucao preservou o produto e criou limites uteis entre frontend, rotas, middlewares, servicos de dominio e infraestrutura.

A migracao, porem, ficou incompleta. O backend monolitico antigo ainda existe e alguns scripts continuam apontando para ele, enquanto producao usa `worker/src/index.js`. O schema-base, as migrations e o schema manual dos testes tambem divergem. Essas fontes de verdade paralelas explicam regressos que nao aparecem na suite atual, como a URL de foto de perfil sem rota GET no Worker modular e o cliente OpenAPI que nao passa no typecheck.

## Objetivo

Estabilizar e modernizar o projeto por camadas, sem reescrita total e sem remover funcionalidades existentes, de forma que:

- o backend modular seja a unica implementacao executavel;
- autenticacao e autorizacao usem configuracao segura e estado atual do banco;
- um banco D1 vazio possa ser criado integralmente por migrations testadas;
- operacoes que combinam D1 e R2 falhem sem perder o arquivo anterior ou deixar estado parcial evitavel;
- rotas, OpenAPI, cliente frontend e CI descrevam o mesmo contrato;
- analytics auxiliar nao transforme operacoes principais bem-sucedidas em erro;
- dependencias possam ser atualizadas com verificacao de regressao;
- o frontend possa ser modernizado depois que seus contratos estiverem estaveis.

## Fora de Escopo da Primeira Entrega

- publicar automaticamente em producao;
- rotacionar secrets ou criar bindings na conta Cloudflare sem confirmacao imediata do usuario;
- alterar conteudo, regras de negocio ou remover recursos sem teste de caracterizacao;
- redesenhar visualmente o frontend antes da estabilizacao dos contratos;
- trocar React, Vite, Cloudflare Workers, D1 ou R2 por outra stack;
- reescrever todos os servicos de dominio apenas por uniformidade estetica.

## Abordagens Consideradas

### Reescrita completa

Permitiria uma arquitetura uniforme, mas exigiria redescobrir regras reais de repertorio, partes, presenca, avisos, favoritos, analytics e administracao. O risco de perder comportamento validado e alto, por isso a abordagem foi rejeitada.

### Correcoes pontuais

Resolveria os sintomas mais visiveis, mas manteria as tres fontes de verdade do banco, os dois backends e o contrato OpenAPI abandonado. O custo de cada mudanca futura continuaria aumentando, por isso tambem foi rejeitada.

### Estabilizacao incremental por contratos

E a abordagem escolhida. Cada camada recebe primeiro testes de caracterizacao e regressao; depois recebe a menor mudanca necessaria. O projeto continua entregavel ao fim de cada etapa.

## Arquitetura Alvo

```text
React + Vite
    |
    | cliente HTTP alinhado ao OpenAPI
    v
worker/src/index.js
    |
    +-- router e middlewares
    |     +-- CORS
    |     +-- autenticacao
    |     +-- autorizacao atual no D1
    |     +-- rate limit
    |
    +-- servicos de dominio
          +-- D1 via statements preparados e batch
          +-- R2 via chaves com namespace e compensacao
          +-- PostHog como tarefa auxiliar
```

`worker/index.js` deixa de ser executavel e passa, temporariamente, a servir apenas como referencia historica durante a comparacao de rotas. Depois que todos os contratos relevantes forem cobertos, ele sera removido ou movido para documentacao historica.

## Seguranca

### Secrets

`JWT_SECRET` nao permanecera em `wrangler.toml`. O repositorio passara a exigir o secret por binding no ambiente publicado e uma chave local em `.dev.vars`, arquivo ignorado pelo Git.

O codigo deve falhar de forma explicita ao iniciar uma operacao autenticada sem secret configurado. A rotacao do valor publicado sera uma etapa externa separada, com aviso de que as sessoes existentes serao encerradas.

### Rate limit

Producao devera possuir o binding `RATE_LIMIT`. A ausencia do binding nao pode ser silenciosa em producao. O modo local continuara utilizavel, mas exibira estado degradado de forma clara.

O middleware de tracking deve autenticar antes de calcular a chave de limite para que usuarios autenticados sejam limitados por identidade, com IP apenas como fallback.

### Autorizacao

O papel administrativo sera lido do usuario atual no D1. O claim do JWT podera ser mantido apenas como metadado, nunca como fonte adicional de permissao.

O bearer legado `username:pin` sera instrumentado e depreciado antes de ser removido. O frontend atual continuara usando JWT.

## Banco e Migrations

Havera uma unica cadeia ordenada de migrations compativel com `wrangler d1 migrations apply`.

Regras:

- numeracao unica e crescente;
- nenhuma coluna adicionada duas vezes;
- schema final contendo repertorios, configuracoes, ensaios, nome de exibicao e tracking;
- seed separado de estrutura;
- `db:init`, `db:migrate` e `db:reset` operando sobre a cadeia real;
- teste automatizado que cria D1 vazio, aplica todas as migrations e executa um login completo;
- testes do Worker usando o schema produzido pelas migrations, nao uma lista SQL paralela mantida manualmente.

Para preservar bancos existentes, migrations antigas ja publicadas nao serao reescritas de forma que o historico do D1 fique invalido. Sera criada uma migration de reconciliacao idempotente e um baseline documentado para instalacoes novas.

## Consistencia D1 e R2

D1 e R2 nao compartilham uma transacao. A consistencia sera obtida por uma maquina de estados simples:

1. validar metadados, tamanho, quantidade e assinatura do arquivo;
2. enviar o novo objeto para uma chave temporaria com namespace;
3. executar alteracoes relacionadas no D1 com `batch()` quando houver mais de um statement;
4. promover a nova referencia no banco;
5. remover o arquivo anterior como tarefa posterior a resposta;
6. remover o novo objeto temporario se o banco falhar.

Substituicao nunca apaga o objeto anterior antes de o novo objeto e a referencia de banco estarem confirmados.

Os namespaces minimos do bucket serao:

- `partituras/`;
- `partes/`;
- `perfil/`;
- `assets/`.

O administrador de assets so podera listar e excluir chaves sob `assets/`.

## Rotas e Contrato OpenAPI

Um teste de inventario comparara metodos e caminhos registrados no router com os caminhos documentados no OpenAPI. Rotas dinamicas serao normalizadas para a mesma sintaxe.

O contrato cobrira respostas de sucesso e erro usadas pelo cliente. A geracao de `frontend/src/api-types.ts` sera reproduzivel e o `typecheck` entrara na CI.

O cliente tipado sera corrigido antes de substituir o cliente JavaScript atual. A migracao de chamadas sera gradual, por dominio, para evitar uma troca ampla sem cobertura.

Regressoes confirmadas, como `GET /api/perfil/foto/:filename` e o fallback de instrumento no download de repertorio, receberao testes que falham antes da correcao.

## Validacao de Entrada

Sera criada uma camada pequena de validadores reutilizaveis, sem introduzir um framework grande nesta etapa.

Ela cobrira:

- IDs inteiros positivos sem aceitar sufixos;
- datas ISO validas;
- URLs HTTP/HTTPS e allowlist quando houver embed;
- strings obrigatorias, opcionais e deliberadamente limpaveis;
- tamanho, quantidade, extensao, MIME e assinatura PDF;
- nomes seguros para `Content-Disposition`;
- limites de paginacao e upload.

Erros de validacao retornarao `400`; conflitos conhecidos, `409`; ausencia, `404`; falhas inesperadas, `500` sem detalhes internos.

## Analytics e Trabalho Assincrono

Eventos PostHog serao best effort. A operacao principal deve produzir a resposta independentemente de falha no provedor de analytics.

Quando houver `executionCtx`, o envio sera registrado com `waitUntil()`. Sem contexto, a falha sera capturada e registrada sem alterar a resposta de negocio.

O tracking que pertence ao proprio produto, armazenado no D1, continuara fazendo parte da operacao quando for necessario para o contrato, mas recebera tratamento explicito quando tabelas ou dados estiverem indisponiveis.

## Dependencias e Desempenho

Dependencias serao atualizadas em grupos pequenos, priorizando:

1. vulnerabilidade critica transitiva de `protobufjs`;
2. cadeia de `posthog-js`;
3. `react-router-dom`;
4. ferramentas OpenAPI e demais dependencias auditadas.

Cada grupo devera passar por testes, lint, typecheck e build antes do proximo.

Depois da integridade:

- o download de repertorio deixara de executar uma consulta por partitura;
- operacoes de ordenacao e ativacao de repertorio usarao batch;
- chunks grandes serao carregados apenas nas telas que os utilizam;
- imports estaticos que anulam lazy loading serao removidos;
- o ambiente de desenvolvimento usara API local por padrao e exigira escolha explicita para producao.

## Modernizacao do Frontend

A modernizacao visual sera tratada como uma entrega posterior e tera especificacao visual propria. Ela devera preservar todas as telas, recursos e fluxos existentes.

Antes de redesenhar, sera feito um inventario de:

- navegacao desktop e mobile;
- login;
- home, busca, biblioteca e favoritos;
- repertorio e ensaios;
- perfil e notificacoes;
- telas administrativas;
- modais, PDF viewer, compartilhamento e downloads;
- estados de carregamento, vazio, erro e offline.

O novo visual sera aditivo e responsivo, sem reduzir a riqueza funcional do sistema atual.

## Estrategia de Testes

### Caracterizacao

Antes de alterar comportamento, registrar o comportamento atual que precisa ser preservado.

### Regressao

Cada defeito confirmado recebe um teste que falha pela causa correta antes da implementacao.

### Integracao

- Worker modular com D1 e R2 locais;
- migrations em banco vazio;
- fluxo login, upload, substituicao, download e exclusao;
- comparacao router/OpenAPI;
- cliente gerado e typecheck.

### Verificacao completa

- testes Worker;
- testes frontend;
- lint Worker e frontend;
- typecheck;
- build sem apontar implicitamente para producao;
- audit de dependencias;
- smoke test HTTP local;
- validacao manual responsiva das telas modificadas.

## Implantacao

O codigo sera preparado em branch isolada. Nenhum deploy, migration remota, alteracao de binding ou rotacao de secret sera executado automaticamente.

Antes da publicacao:

1. gerar backup/export do D1 remoto;
2. listar migrations pendentes;
3. configurar KV e secrets;
4. aplicar migrations de forma controlada;
5. publicar o Worker modular;
6. executar smoke tests autenticados e publicos;
7. publicar o frontend;
8. observar erros, login, downloads e uploads;
9. manter procedimento de rollback documentado.

## Criterios de Conclusao

- apenas um backend executavel e documentado;
- segredo ausente do repositorio e preparado para rotacao;
- rate limit configuravel e verificavel;
- autorizacao administrativa baseada no D1 atual;
- banco vazio criado por migrations e capaz de autenticar;
- nenhum upload substitui ou apaga dados sem compensacao;
- bucket separado logicamente por namespace;
- router, OpenAPI, cliente e CI alinhados;
- testes, lint, typecheck e build aprovados;
- dependencias criticas corrigidas ou justificadas por inaplicabilidade;
- deploy remoto ainda condicionado a confirmacao explicita.
