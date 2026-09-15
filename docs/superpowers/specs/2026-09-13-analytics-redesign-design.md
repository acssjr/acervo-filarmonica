# Projeto de Analytics orientado a decisões

## Status

Design aprovado em conversa; implementação ainda não iniciada.

## Objetivo

Redesenhar completamente a experiência de Analytics administrativa para responder, com dados compreensíveis e acionáveis:

1. Quem mais interage com o acervo.
2. Quais partituras estão recebendo mais interesse.
3. Quem é mais assíduo nos ensaios.

A tela também deve explicar mudanças relevantes, alertar sobre quedas de acesso ou presença e apresentar projeções honestas para períodos incompletos.

O histórico de alterações administrativas não fará parte desta experiência. Ele continuará em uma área própria de auditoria.

## Escopo aprovado

### Visão geral

Será a entrada do Analytics. Ela exibirá:

- período atual e comparação equivalente;
- valores principais, variações e projeções;
- ranking curto de músicos mais engajados;
- ranking curto de partituras mais acessadas;
- ranking curto de assiduidade;
- insights positivos, descobertas e alertas;
- amostra e qualidade dos dados quando isso afetar a interpretação.

A visão geral não substitui análises detalhadas. Cada bloco abre um aprofundamento preservando o período e os filtros ativos.

### Aprofundamento de engajamento

O público é formado por usuários ativos que não são administradores nem convidados.

O ranking será ordenado pelo total de ações úteis concluídas. As ações principais têm o mesmo peso:

- visualizar PDF da própria parte;
- visualizar PDF de outro instrumento;
- baixar PDF;
- adicionar ou remover favorito;
- concluir uma busca.

Explorar o repertório terá peso menor. Abrir somente a ficha da partitura não será considerado acesso relevante.

Cada linha mostrará o total e sua composição, por exemplo: `42 ações — 18 visualizações, 9 downloads, 8 buscas e 7 favoritos`.

Dias ativos, sessões e quantidade de instrumentos ou partes explorados serão indicadores contextuais, não pontos ocultos no ranking. A tela poderá destacar separadamente variedade de instrumentos explorados e retorno em dias diferentes.

### Aprofundamento de partituras

O ranking será baseado somente em visualizações e downloads de PDF. Visualizar e baixar terão o mesmo peso. Partes de outros instrumentos entram integralmente.

O detalhamento deverá permitir distinguir:

- obras mais populares por volume de visualizações e downloads;
- obras com maior variedade de instrumentos explorados;
- partes mais acessadas;
- tendência do período atual contra o período equivalente anterior.

### Aprofundamento de assiduidade

O ranking será ordenado pela porcentagem de presença dentro do período selecionado, sempre acompanhado de `presenças realizadas / ensaios realizados`.

Administradores e convidados ficam fora. A análise poderá apresentar músicos e naipes, mas não emitirá rótulos fortes quando não houver ensaio ou quando a amostra for pequena.

Sequências consecutivas são um indicador complementar, não o critério principal.

### Comparações e projeções

- O padrão será o mês atual comparado aos mesmos dias do mês anterior.
- Um mês incompleto nunca será comparado ao mês anterior inteiro.
- Períodos personalizados serão comparados ao intervalo imediatamente anterior de mesma duração.
- A projeção para o fechamento do mês será baseada no ritmo observado e identificada explicitamente como estimativa.
- Presença será comparada por percentual e quantidade de ensaios realizados, não por contagem bruta.
- Alertas exigem mudança relevante e amostra mínima; caso contrário, a UI explicará que ainda não há base suficiente.

## Definição de eventos

O backend deverá padronizar e validar os seguintes eventos analíticos:

- `pdf_visualizado_grade`;
- `pdf_visualizado_parte`;
- `download_grade`;
- `download_parte`;
- `favorito_adicionado`;
- `busca_realizada`;
- `repertorio_aberto`.

Todos os eventos devem carregar, quando aplicável, usuário, sessão, origem, timestamp, partitura, parte, instrumento e repertório. `repertorio_aberto` é uma nova capacidade necessária; a implementação atual não registra uma exploração de repertório de maneira confiável.

O cliente deve registrar apenas interações deliberadas e evitar eventos de montagem, atualização de página ou digitação parcial. Consultas analíticas devem tratar repetições acidentais da mesma ação dentro de uma sessão de forma consistente e documentada.

## API e fluxo de dados

O endpoint administrativo de Analytics será reorganizado para um modelo comum, preservando uma transição compatível com consumidores legados quando necessário.

O contrato lógico retornará:

```text
periodo
  atual: { inicio, fim, dias_decorridos, dias_totais }
  comparacao: { inicio, fim }
  projecao: { disponivel, valor, confianca }
resumo
  engajamento
  partituras
  assiduidade
insights
engajamento
partituras
assiduidade
```

A visão geral carregará o resumo e os insights. Rankings e séries detalhadas poderão ser carregados sob demanda quando o administrador abrir cada aprofundamento. Toda resposta deve informar a amostra usada e retornar estados vazios semanticamente corretos, por exemplo `nenhum ensaio realizado`, em vez de `0 de 0` ou `presença baixa`.

A navegação poderá refletir o aprofundamento na URL, como `?view=engajamento`, preservando o período selecionado e permitindo abrir diretamente uma análise específica.

## Arquitetura de componentes

O componente monolítico atual será dividido em unidades focadas:

- `AnalyticsShell`: período, comparação, projeção, navegação e carregamento;
- `AnalyticsOverview`: resumo, rankings curtos e insights;
- `EngagementAnalytics`: ranking completo, tendências e perfil do músico;
- `SheetAnalytics`: obras, partes, instrumentos e tendências;
- `AttendanceAnalytics`: ranking percentual, evolução e naipes;
- `InsightCard`: alerta, descoberta ou reconhecimento com evidência e período;
- componentes reutilizáveis de ranking, tendência, comparação, tooltip, loading e estado vazio.

Os componentes de dados não devem recalcular regras de negócio de forma independente. A API será responsável por métricas, comparações, projeções e classificação; a UI será responsável por hierarquia, explicação e interação.

## Experiência visual e responsiva

- A visão geral deve priorizar as três respostas aprovadas, nesta ordem: engajamento, partituras e assiduidade.
- Comparação e projeção devem ficar próximas do valor ao qual se referem.
- Insights terão linguagem direta e evidência numérica; alertas de queda usarão sinal visual de risco sem transformar ausência de dados em problema.
- Rankings devem mostrar composição, não somente um número final.
- A navegação mobile não pode cobrir cards, filtros ou conteúdo.
- Filtros de período devem permanecer acessíveis sem ocupar a maior parte da primeira viewport.
- Estados vazios devem explicar o motivo e, quando possível, sugerir a próxima ação.
- Auditoria administrativa não aparecerá como uma quarta aba no Analytics.

## Tratamento de erros e dados insuficientes

- Falha de uma seção não deve apagar dados já carregados de outras seções.
- O usuário deve ver qual parte falhou e poder tentar novamente.
- Ausência de eventos deve ser diferenciada de ausência de usuários.
- Projeções não serão exibidas quando não houver dias suficientes ou quando o intervalo ainda não tiver base mínima.
- Divisões por zero devem produzir estado explicativo, nunca percentual enganoso.
- Eventos inválidos ou sem vínculo com usuário não entram nos rankings de músicos.

## Testes e critérios de aceite

### Backend

- testes de filtros de público: ativos, não administradores e não convidados;
- testes de pesos iguais para visualização e download;
- teste de peso menor para exploração de repertório;
- testes de comparação mês incompleto contra os mesmos dias anteriores;
- testes de períodos personalizados com intervalo anterior equivalente;
- testes de projeção e bloqueio por amostra insuficiente;
- testes de presença sem ensaios e com poucos ensaios;
- testes de ranking de partituras por PDF e de variedade de instrumentos;
- testes do novo evento `repertorio_aberto`.

### Frontend

- visão geral renderiza resumo, comparação, projeção e insights;
- navegação para os três aprofundamentos preserva período e filtros;
- rankings exibem composição e estados vazios corretos;
- alertas de queda apresentam evidência e amostra;
- mobile não possui sobreposição da navegação sobre o conteúdo;
- carregamentos, falhas parciais e reintentos são cobertos;
- administradores e convidados nunca aparecem nos rankings de músicos.

### Aceite funcional

O trabalho será considerado concluído quando um administrador conseguir, sem interpretar números ambíguos:

1. identificar quem mais realizou ações úteis no acervo e entender quais ações compõem o ranking;
2. identificar as partituras e partes mais visualizadas ou baixadas;
3. identificar os músicos mais assíduos por percentual e ver a base de ensaios;
4. perceber quedas relevantes com comparação justa e projeção quando aplicável;
5. abrir o detalhamento de qualquer um dos três eixos sem perder contexto.

## Fora de escopo

- histórico de alterações administrativas dentro desta tela;
- score opaco com pesos arbitrários escondidos;
- ranking de administradores ou convidados;
- projeção de presença sem ensaios futuros ou base suficiente;
- redesign de outras áreas administrativas não necessário para a integração da navegação.
