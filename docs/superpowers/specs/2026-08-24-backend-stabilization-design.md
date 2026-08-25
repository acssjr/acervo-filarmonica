# Estabilização e modernização incremental do Acervo

## Contexto

O Acervo Digital deixou de ser um único HTML e evoluiu para uma aplicação React com Cloudflare Worker modular, D1, R2 e PostHog. Essa evolução preservou o produto e criou limites úteis entre frontend, rotas, middlewares, serviços de domínio e infraestrutura.

A migração, porém, ficou incompleta. O backend monolítico antigo ainda existe como referência histórica, enquanto produção usa `worker/src/index.js`. O schema-base, as migrações e o schema manual dos testes também divergiam. Essas fontes paralelas explicavam regressões que não apareciam na suíte, como a foto de perfil sem rota GET no Worker modular e o cliente OpenAPI fora do typecheck.

## Objetivo

Estabilizar o projeto por camadas, sem reescrita total e sem remover funcionalidades, de modo que:

- o backend modular seja a única implementação executável;
- autenticação e autorização usem configuração segura e o estado atual do banco;
- um D1 vazio possa ser criado integralmente por migrações testadas;
- operações D1/R2 falhem sem perder o arquivo anterior nem deixar estado parcial evitável;
- rotas, OpenAPI, cliente frontend e CI descrevam o mesmo contrato;
- analytics auxiliar nunca transforme uma operação principal bem-sucedida em erro;
- dependências sejam atualizadas com verificação de regressão;
- o frontend possa ser modernizado depois da estabilização dos contratos.

## Fora do escopo da primeira entrega

- publicar automaticamente em produção;
- rotacionar secrets ou criar bindings sem confirmação imediata do usuário;
- alterar regras de negócio ou remover recursos sem caracterização;
- redesenhar o frontend antes da estabilização dos contratos;
- trocar React, Vite, Workers, D1 ou R2 por outra stack;
- refatorar serviços apenas por uniformidade estética.

## Abordagem escolhida

Uma reescrita completa exigiria redescobrir regras reais de repertório, partes, presença, avisos, favoritos, analytics e administração. Correções pontuais manteriam fontes de verdade paralelas. A abordagem escolhida é a estabilização incremental por contratos: preservar o comportamento, caracterizar riscos e aplicar a menor mudança necessária em cada camada.

## Arquitetura-alvo

```text
React + Vite
    |
    | cliente HTTP alinhado ao OpenAPI
    v
worker/src/index.js
    |
    +-- router e middlewares
    |     +-- CORS
    |     +-- autenticação
    |     +-- autorização atual no D1
    |     +-- rate limiting
    |
    +-- serviços de domínio
          +-- D1 por statements preparados e batch
          +-- R2 por chaves com namespace e compensação
          +-- PostHog como tarefa auxiliar
```

`worker/index.js` deixa de ser executável e permanece apenas como referência histórica até que a comparação de contratos seja concluída.

## Segurança

### Secrets

`JWT_SECRET` não permanece em `wrangler.toml`. O ambiente publicado exige secret por binding; o desenvolvimento usa um valor exclusivamente local. Operações autenticadas falham de forma explícita sem configuração. A rotação é uma ação externa separada, pois encerra sessões existentes.

### Rate limiting

Produção exige o binding `RATE_LIMIT`. A ausência ou indisponibilidade do binding bloqueia operações protegidas. Fora de produção, o sistema pode operar em modo degradado com aviso claro.

O tracking autentica antes de calcular a chave, usando a identidade do usuário quando disponível e IP como fallback.

### Autorização

O papel administrativo é lido do usuário atual no D1. Claims do JWT são metadados e não concedem permissão isoladamente. O bearer legado `username:pin` deve ser depreciado de forma observável antes de ser removido.

## Banco e migrações

Há uma única cadeia ordenada compatível com `wrangler d1 migrations apply`:

- numeração única e crescente;
- nenhuma coluna adicionada duas vezes;
- schema final completo para repertórios, configurações, ensaios, nomes e tracking;
- seed separado da estrutura;
- scripts locais e remotos explícitos;
- setup dos testes gerado a partir das migrações ativas;
- teste automatizado de bootstrap em D1 vazio.

Migrações já publicadas não são reescritas de forma incompatível. Novos ajustes entram como migrações adicionais e idempotentes quando possível.

## Consistência entre D1 e R2

D1 e R2 não compartilham transação. A consistência segue esta ordem:

1. validar metadados, tamanho, quantidade e assinatura;
2. enviar o novo objeto para chave segura com namespace;
3. executar alterações relacionadas no D1 com `batch()`;
4. confirmar a nova referência no banco;
5. remover o objeto anterior após a confirmação;
6. remover o objeto novo se o banco falhar.

Uma substituição nunca apaga o arquivo anterior antes da confirmação do novo objeto e da referência D1.

Namespaces mínimos:

- `partituras/`;
- `partes/`;
- `perfil/`;
- `assets/`.

Listagem e exclusão administrativas de assets ficam restritas a `assets/`. Compatibilidade de leitura legada é limitada a prefixos públicos explicitamente permitidos.

## Rotas e contrato OpenAPI

Um verificador compara métodos e caminhos registrados no router com o OpenAPI. Rotas dinâmicas são normalizadas para a mesma sintaxe. O contrato cobre respostas relevantes, gera `frontend/src/api-types.ts` de forma reproduzível e participa do typecheck da CI.

O cliente tipado pode substituir o cliente JavaScript gradualmente, por domínio, evitando uma migração ampla sem cobertura.

## Validação de entrada

A camada de validação cobre:

- IDs inteiros positivos;
- datas ISO válidas;
- URLs HTTP/HTTPS;
- strings obrigatórias, opcionais e deliberadamente limpáveis;
- tamanho individual e agregado, quantidade, extensão, MIME e assinatura de PDF;
- nomes seguros para `Content-Disposition`;
- limites de paginação e upload.

Erros de validação retornam `400`; conflitos conhecidos, `409`; ausência, `404`; falhas inesperadas, `500` sem detalhes internos.

## Analytics e trabalho assíncrono

Eventos PostHog são best effort. Quando existe `ExecutionContext`, o envio é registrado com `waitUntil()`. Sem contexto, falhas são capturadas sem alterar a resposta de negócio. O cliente sempre tenta encerrar e liberar seu buffer, inclusive quando identificação ou captura falham.

Tracking pertencente ao próprio produto e armazenado no D1 continua fazendo parte do contrato quando necessário, com tratamento explícito para indisponibilidade.

## Dependências e desempenho

Dependências são atualizadas em grupos pequenos e verificadas com testes, lint, typecheck, build e auditoria. Imports estáticos que anulam lazy loading são removidos, e módulos pesados ficam fora do carregamento inicial quando não são necessários.

O ambiente de desenvolvimento usa API local por padrão e exige escolha explícita para apontar à produção.

## Modernização do frontend

A modernização visual é uma entrega posterior com especificação própria. Ela preserva telas, conteúdo e fluxos existentes. Antes do redesign, o inventário inclui navegação, login, home, busca, biblioteca, favoritos, repertórios, ensaios, perfil, notificações, administração, modais, visualização de PDF, compartilhamento, downloads e estados de carregamento, vazio, erro e offline.

## Estratégia de testes

- caracterização do comportamento que precisa ser preservado;
- regressões para defeitos confirmados;
- integração do Worker modular com D1 e R2 locais;
- bootstrap de migrações em banco vazio;
- comparação router/OpenAPI e typecheck do cliente gerado;
- suítes completas de Worker e frontend;
- lint, build, auditorias e smoke test HTTP local.

## Implantação

O código é preparado em branch isolada. Nenhum deploy, migração remota, alteração de binding ou rotação de secret ocorre automaticamente.

Antes de publicar:

1. criar backup ou exportação do D1 remoto;
2. revisar migrações pendentes;
3. configurar KV e secrets;
4. aplicar migrações de forma controlada;
5. publicar o Worker modular;
6. executar smoke tests públicos e autenticados;
7. publicar o frontend;
8. observar erros, login, downloads e uploads;
9. manter rollback documentado.

## Critérios de conclusão

- um único backend executável e documentado;
- secrets fora do repositório;
- rate limiting verificável e seguro em produção;
- autorização administrativa baseada no D1 atual;
- banco vazio criado por migrações e capaz de autenticar;
- uploads recuperáveis e namespaces isolados;
- router, OpenAPI, cliente e CI alinhados;
- testes, lint, typecheck, build e auditorias aprovados;
- deploy remoto condicionado à confirmação explícita.
