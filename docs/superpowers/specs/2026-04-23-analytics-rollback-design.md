# Analytics Rollback Design

## Contexto

O redesign recente da area de analytics do admin introduziu uma navegacao por abas e novos blocos de tracking que pioraram a utilidade da tela:

- metricas relevantes passaram a retornar `0` ou numeros inconsistentes;
- filtros de pessoas e secoes nao funcionam corretamente;
- a secao de presenca por naipe ficou confusa e pouco util;
- o fluxo deixou de responder as perguntas administrativas que a versao anterior ja cobria.

O unico ganho validado pelo usuario foi o detalhamento das alteracoes administrativas nos registros de atividade.

## Objetivo

Restaurar o analytics para a aparencia e estrutura anteriores ao redesign, mantendo:

- o filtro de periodo funcionando;
- a lista de atividade recente no lugar onde ficava antes;
- a paginacao de "carregar mais" na atividade recente;
- a expansao inline dos itens de atividade para mostrar detalhes administrativos uteis.

## Fora de Escopo

- manter as abas novas `Uso do acervo`, `Pessoas`, `Ensaios` e `Alteracoes`;
- manter os filtros especificos por pessoa e por admin do redesign;
- manter a secao "Presenca por naipe";
- corrigir ou refinar o tracking novo para sustentar o redesign atual.

## Abordagem Escolhida

Sera feito um rollback seletivo para a base anterior ao redesign do analytics.

Isso inclui:

1. restaurar a UI antiga do dashboard admin de analytics;
2. restaurar o contrato antigo principal do endpoint de analytics;
3. preservar apenas a melhoria util do redesign: atividades administrativas com detalhes mais ricos;
4. fazer o periodo `inicio` e `fim` funcionar no fluxo antigo.

Essa abordagem reduz risco porque volta para uma tela ja validada pelo uso real e reaproveita apenas a parte do redesign que provou valor.

## Arquitetura

### Frontend

O componente [frontend/src/screens/admin/AdminAnalytics.jsx](frontend/src/screens/admin/AdminAnalytics.jsx) voltara a estrutura anterior ao redesign:

- header antigo;
- KPIs antigos;
- secoes antigas do dashboard;
- feed de `Atividade Recente` no lugar original.

Adaptacoes necessarias:

- adicionar controles de periodo ao fluxo antigo;
- carregar os dados com `inicio` e `fim`;
- manter o botao de carregar mais atividades;
- permitir expansao inline em cada item quando houver `detalhes`.

O feed de atividade nao volta para o renderer totalmente antigo: ele preserva a renderizacao enriquecida dos detalhes administrativos quando o item trouxer esse conteudo.

### Backend

O endpoint [worker/src/domain/analytics/analyticsService.js](worker/src/domain/analytics/analyticsService.js) volta a responder prioritariamente com o shape antigo consumido pela tela anterior.

O payload antigo continua incluindo os campos usados no dashboard original, como:

- `resumo`;
- `downloads_timeline`;
- `top_partituras`;
- `instrumentos_dist`;
- `presencas_familia`;
- `musicos_mais_ativos`;
- `ultimo_acesso`;
- `tendencia_presenca`;
- `top_search_terms`;
- `failed_search_terms`;
- `atividade_recente`;
- `total_atividades`.

O unico comportamento herdado do redesign que sera mantido como parte do contrato e:

- filtro de periodo via `inicio` e `fim`;
- paginacao via `atividades_limit` e `atividades_offset`;
- enriquecimento dos itens de `atividade_recente` para alteracoes administrativas com `tipo`, `titulo`, `detalhes`, `criado_em` e `usuario_nome`.

## Regras de Dados

### Periodo

- o frontend envia `inicio` e `fim` ao carregar o dashboard;
- o backend aplica esse periodo aos dados exibidos no dashboard antigo;
- o mesmo periodo tambem se aplica a consulta de `atividade_recente`.

### Atividade Recente

A lista de `atividade_recente` deve priorizar valor administrativo real.

Regras:

- alteracoes administrativas continuam aparecendo com detalhes ricos;
- itens com detalhes relevantes podem ser expandidos na UI;
- itens sem detalhes uteis permanecem compactos;
- a paginacao deve continuar funcional sem duplicar itens carregados anteriormente.

## Estrategia de Implementacao

### Passo 1: restaurar a base visual antiga

- comparar a versao atual de `AdminAnalytics.jsx` com a versao anterior ao redesign;
- reintroduzir a estrutura antiga da tela;
- remover dependencia da navegacao por abas e dos filtros especificos do redesign.

### Passo 2: restaurar o fluxo antigo do endpoint

- usar a forma antiga do payload como fonte principal da tela;
- manter `inicio` e `fim` no endpoint;
- manter paginacao de atividade;
- preservar o enriquecimento dos itens de auditoria administrativa.

### Passo 3: preservar o ganho util nas atividades

- manter os detalhes administrativos no backend;
- renderizar expansao inline no feed antigo;
- garantir fallback seguro para itens sem detalhes.

### Passo 4: validar regressos

Validar:

- analytics carrega na estrutura antiga;
- filtro de periodo altera os dados retornados;
- atividade recente expande detalhes administrativos;
- carregar mais funciona sem duplicidade;
- endpoint responde sem depender das secoes novas do redesign.

## Testes

### Automatizados

- ajustar testes do endpoint de analytics para o fluxo antigo com periodo;
- garantir cobertura para paginacao de `atividade_recente`;
- garantir cobertura para manutencao dos detalhes administrativos nas atividades.

### Manuais

- abrir analytics no admin e confirmar retorno visual antigo;
- testar troca de periodo;
- expandir itens administrativos com detalhes;
- carregar mais atividades e confirmar concatenacao sem duplicacao.

## Riscos

### Mistura de contratos antigo e novo

Risco: frontend antigo consumir acidentalmente dados do redesign.

Mitigacao: usar o shape antigo como contrato principal e limitar a reutilizacao do redesign apenas a serializacao das atividades recentes.

### Regressao em paginacao

Risco: duplicidade ao carregar mais.

Mitigacao: manter deduplicacao por `id` ou chave composta estavel no merge local.

### Periodo inconsistente

Risco: parte do dashboard usar periodo e parte continuar em janela fixa.

Mitigacao: revisar cada consulta usada pela tela antiga e aplicar o mesmo intervalo `inicio` e `fim`.

## Resultado Esperado

O analytics volta a ser uma tela simples e confiavel, com aparencia anterior ao redesign, filtro de periodo funcional e atividade recente mais util por preservar os detalhes das alteracoes administrativas.
