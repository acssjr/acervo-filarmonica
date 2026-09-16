# Redesign operacional do painel administrativo e da gestão de partituras

## Status

Direção de UX aprovada em conversa. Esta especificação consolida o comportamento esperado antes da implementação.

## Objetivo

Reduzir o tempo e a incerteza para executar as tarefas administrativas mais frequentes, priorizando:

1. gerenciar partituras e suas partes;
2. organizar repertórios;
3. registrar presença;
4. consultar Analytics como atividade terciária.

O redesign deve preservar todas as capacidades existentes, a identidade vinho e dourado, os temas claro, escuro e sistema, e o uso em desktop e celular.

## Problemas confirmados

### Dashboard

- Quatro cartões grandes de estatísticas dominam a primeira viewport e comunicam que números são mais importantes que tarefas.
- As tarefas mais usadas estão diluídas entre o menu lateral e uma seção de ações rápidas menos proeminente.
- Partituras, Repertório e Presença não aparecem como os caminhos principais do trabalho administrativo.
- Analytics recebe peso semelhante ao das tarefas operacionais, embora seja uma consulta terciária.
- Os cartões escuros e coloridos permanecem visualmente dominantes no tema claro.

### Partituras

- Busca e filtros têm contraste e hierarquia insuficientes, especialmente no tema claro.
- Não há uma seção explícita que ensine o administrador a buscar e filtrar antes de rolar a lista.
- Os cartões não deixam claro que a ação principal é expandir e gerenciar partes.
- O botão azul chamado apenas de `Editar` pode ser confundido com o gerenciamento das partes.
- A região visualmente clicável e a região que realmente expande o cartão não coincidem.
- O controle de expansão não usa semântica de botão, foco de teclado nem `aria-expanded`.
- Atualizações após upload ou manutenção podem desmontar a lista, reduzir temporariamente sua altura e perder a posição de rolagem.
- A lista renderiza dezenas de cartões e ícones de uma só vez, aumentando o custo em celulares modestos.

## Princípios do redesign

- **Ação antes de informação:** caminhos operacionais aparecem antes das métricas.
- **Reconhecimento antes de memorização:** ações críticas usam texto, não apenas cor ou ícone.
- **Uma ação principal por bloco:** cada área deixa evidente o próximo passo mais provável.
- **Continuidade:** atualizar dados não pode apagar filtros, expansão ou posição de trabalho.
- **Divulgação progressiva:** operações raras ou destrutivas ficam em um menu secundário.
- **Tema real:** claro e escuro devem ter contraste e peso visual equivalentes, sem apenas inverter o fundo.
- **Mobile operacional:** a tela móvel será reorganizada, não simplesmente comprimida.

## Dashboard proposto

### Ordem das informações

1. saudação e contexto do próximo ensaio ou apresentação;
2. central de trabalho com Partituras, Repertório e Presença;
3. resumo compacto do acervo;
4. acesso terciário a Analytics;
5. atividade recente e conteúdos informativos já existentes.

### Central de trabalho

#### Partituras

Será a ação de maior destaque e terá:

- título `Partituras`;
- descrição curta: `Busque, envie e corrija as partes do acervo`;
- ação principal `Gerenciar partituras`;
- ação secundária `Enviar pasta`.

#### Repertório

Terá:

- título `Repertório`;
- descrição curta sobre organizar as músicas de apresentações e ensaios;
- ação `Abrir repertório`;
- contexto do repertório ativo quando essa informação estiver disponível sem nova dependência de backend.

#### Presença

Terá:

- título `Presença`;
- descrição curta sobre registrar ou consultar o ensaio;
- ação `Marcar presença`.

### Resumo do acervo

Músicos ativos, partituras, downloads e categorias continuarão disponíveis, mas em cartões ou indicadores compactos, sem gradientes escuros dominantes e sem animações longas de contagem.

Os indicadores poderão continuar navegáveis, desde que exibam foco visível, nome acessível e uma indicação clara do destino. Analytics será apresentado como link ou ação terciária próxima ao resumo, não como um dos blocos operacionais principais.

### Responsividade do dashboard

- Desktop: Partituras ocupa maior largura; Repertório e Presença dividem a área secundária.
- Mobile: Partituras, Repertório e Presença ficam empilhados nessa ordem.
- As quatro métricas usam uma grade compacta 2 por 2 no mobile.
- Todas as áreas acionáveis terão alvo mínimo de 44 por 44 pixels.
- Animações respeitarão `prefers-reduced-motion` e não serão necessárias para compreender a tela.

## Tela de Partituras proposta

### Cabeçalho e inclusão

O título permanece acompanhado das ações `Upload de pasta` e `Importar lote`.

No mobile, essas ações podem quebrar em duas linhas ou usar uma ação principal e uma ação secundária, sem provocar rolagem horizontal.

### Área de busca e filtros

Busca e filtros ficarão dentro de uma superfície visual própria, identificada como `Encontre uma partitura`.

Comportamentos:

- campo de busca com rótulo acessível e placeholder `Buscar por título, compositor ou arranjador`;
- filtro de categoria identificado por texto;
- filtros `Destaques` e `No repertório` com estados inativo e ativo inequívocos;
- ação `Limpar filtros` exibida apenas quando houver busca ou filtro ativo;
- contagem de resultados em linguagem natural, com singular e plural corretos;
- controles permanecem acessíveis durante a rolagem por meio de uma barra sticky abaixo do cabeçalho administrativo, desde que não reduzam excessivamente a área útil no mobile;
- busca e filtros serão refletidos nos parâmetros da URL para preservar contexto ao navegar e voltar;
- o estado não deve depender apenas de cor.

No tema claro, texto comum deve atingir contraste mínimo WCAG AA. O dourado institucional continuará como destaque, mas não será usado sozinho para texto pequeno sobre fundo branco quando não atingir contraste.

### Cartão de partitura

A ação principal do cartão será `Gerenciar partes`.

Estrutura no desktop:

```text
[seta] [ícone] Título
               Compositor · Categoria · downloads
               23 partes

[Gerenciar 23 partes] [Repertório] [Mais]
```

Estrutura no mobile:

- título e metadados em uma primeira linha legível;
- botão `Ver 23 partes` ou `Ocultar partes` em largura adequada ao toque;
- ações secundárias agrupadas abaixo ou no menu `Mais`;
- nenhuma ação crítica dependerá apenas de tooltip.

Semântica:

- o gatilho de expansão será um `button` real;
- usará `aria-expanded` e associação com o painel de partes;
- responderá a Enter e Espaço nativamente;
- terá foco visível;
- o ícone de seta acompanhará o estado sem ser o único sinal.

### Hierarquia das ações por partitura

- Primária: `Gerenciar partes`.
- Secundária: adicionar ou remover do repertório.
- Terciárias no menu `Mais`: destacar, editar informações e excluir.

O antigo botão azul será renomeado para `Editar informações`, deixando claro que altera título, compositor, arranjador, categoria e ano, e não as partes individuais.

Excluir continuará exigindo confirmação explícita. Ações de repertório e destaque continuarão apresentando retorno imediato e reversão em caso de falha.

### Área expandida

Quando aberta, a área começará com:

- título `Partes da partitura`;
- quantidade de partes;
- ação `Adicionar parte`;
- grade ou lista das partes existentes.

Substituir, renomear ou excluir uma parte não poderá fechar o cartão nem deslocar o usuário para o topo.

## Preservação de contexto

### Carregamento inicial e atualização em segundo plano

O estado de carregamento que substitui a lista inteira será usado somente no primeiro carregamento sem dados anteriores.

Após upload, importação, edição, substituição, inclusão ou exclusão:

- a lista existente permanece montada;
- os dados são atualizados em segundo plano;
- busca, filtros e cartão expandido permanecem inalterados;
- a posição visual é preservada por ID da partitura ou por âncora de rolagem, não apenas por um valor global de `scrollY`;
- haverá apenas um contêiner responsável pela rolagem da área de conteúdo.

### Upload de pasta

A resposta atual da API já fornece o ID da partitura criada. O modal deverá repassar esse resultado ao componente pai.

Após sucesso:

- fechar o modal;
- manter a posição atual;
- atualizar a coleção sem tela de carregamento integral;
- mostrar confirmação com ação opcional `Ver partitura`;
- somente deslocar a tela se o administrador escolher essa ação.

Se a nova partitura não for exibida por causa dos filtros ativos, a confirmação deve explicar o motivo e oferecer `Limpar filtros`.

### Operações em partes

Após substituir, adicionar, renomear ou excluir uma parte:

- o cartão permanece expandido;
- a grade de partes é atualizada sem desmontar a lista inteira;
- o foco retorna a um elemento lógico próximo da ação realizada;
- a quantidade de partes é atualizada localmente;
- mensagens de sucesso identificam a operação concluída.

Se uma edição mudar o título e mover a partitura para outro grupo alfabético, a aplicação preservará a referência pelo ID e informará o novo grupo quando necessário.

## Desempenho

- Evitar remontar a lista por mudanças de filtro que possam ser tratadas por estado.
- Ordenar uma cópia dos dados, sem mutar diretamente o array mantido no estado React.
- Aplicar `content-visibility: auto` e `contain-intrinsic-size` aos grupos alfabéticos ou adotar virtualização equivalente se a validação indicar necessidade.
- Evitar animações de entrada repetidas em dezenas de cartões.
- Manter componentes e callbacks estáveis onde isso reduzir renderizações mensuráveis.
- Preservar busca instantânea para o volume atual do acervo.

## Acessibilidade e contraste

- Texto normal com contraste mínimo de 4,5 para 1.
- Controles e indicadores essenciais com contraste mínimo de 3 para 1.
- Foco visível em todos os botões, filtros, menus e cartões acionáveis.
- Botões somente com ícone terão nome acessível; ações principais usarão texto visível.
- Menus e filtros terão `aria-expanded`, `aria-controls` e estados selecionados quando aplicável.
- Nenhuma ação ou estado será comunicado somente por vermelho, azul, roxo ou dourado.
- Tema claro e escuro serão validados separadamente.

## Estados e erros

- Falha na atualização em segundo plano mantém os dados anteriores visíveis e oferece nova tentativa.
- Busca sem resultado explica quais filtros estão ativos e oferece limpá-los.
- Upload concluído nunca será confundido com partitura ausente quando um filtro a estiver ocultando.
- Loading de partes afeta apenas a área expandida correspondente.
- A exclusão de uma partitura remove apenas o item afetado após confirmação e sucesso.

## Arquitetura prevista

O arquivo monolítico de partituras será dividido progressivamente, sem reescrever regras de negócio estáveis:

- `AdminActionCenter`: caminhos principais do dashboard;
- `AdminStatsSummary`: métricas compactas;
- `PartiturasToolbar`: busca, filtros, contagem e limpeza;
- `PartituraRow`: resumo, gatilho semântico e ações;
- `PartituraPartsPanel`: partes expandidas e suas operações;
- hook de estado de URL para busca e filtros;
- hook ou utilitário de atualização preservando âncora e expansão.

A divisão poderá ser ajustada durante a implementação para evitar abstrações sem reutilização, mas as responsabilidades acima devem permanecer separadas.

## Testes e critérios de aceite

### Dashboard

- Partituras, Repertório e Presença aparecem antes das estatísticas.
- Partituras possui acesso direto ao gerenciamento e ao upload de pasta.
- Analytics é terciário, mas continua facilmente acessível.
- Desktop e mobile não possuem overflow horizontal em 320, 375, 768, 1024 e 1440 pixels.
- Temas claro, escuro e sistema mantêm hierarquia e contraste.

### Busca e filtros

- Busca encontra título, compositor e arranjador com a normalização já existente.
- Filtros ativos são visualmente e semanticamente identificáveis.
- `Limpar filtros` restaura a lista completa.
- URL, botão voltar e retorno à tela preservam busca e filtros.
- Estados vazio, singular e plural são corretos.

### Cartões e partes

- Todo cartão apresenta ação textual para gerenciar partes.
- Expansão funciona por mouse, toque, Enter e Espaço.
- `aria-expanded` acompanha o estado real.
- `Editar informações` não é confundido com edição de partes.
- Ações destrutivas continuam confirmadas.

### Continuidade

- Fazer upload estando no meio da lista não leva ao topo.
- Substituir, adicionar, renomear ou excluir parte mantém o cartão e a posição.
- Filtros continuam ativos após qualquer atualização.
- `Ver partitura` localiza a nova partitura somente quando solicitado.
- Falha de atualização não apaga a lista já carregada.

### Desempenho

- A tela não monta novamente todos os cartões após uma alteração localizada.
- Grupos fora da viewport não exigem pintura imediata em navegadores compatíveis.
- Fluxos principais permanecem responsivos em emulação de CPU reduzida e em aparelho Android de entrada quando disponível.

### Verificação final

- testes unitários e comportamentais dos novos componentes;
- testes específicos de preservação de estado e rolagem;
- build de produção;
- inspeção visual em tema claro e escuro;
- smoke test local com API de produção sem realizar exclusões ou uploads de teste não autorizados.

## Fora de escopo

- alterar regras de negócio de repertório, presença, categorias ou Analytics;
- modificar banco de dados ou criar migração;
- redesenhar todas as telas administrativas nesta entrega;
- substituir a navegação lateral e inferior do painel;
- introduzir novos indicadores estatísticos;
- reescrever o backend de partituras quando o contrato atual já atender ao comportamento.

## Refinamento aprovado após validação visual

- O menu lateral será agrupado por intenção: Visão geral, Trabalho diário, Gestão e Sistema. Partituras, Repertório e Presença aparecem primeiro no fluxo operacional; Analytics permanece acessível, mas em posição terciária.
- O centro do dashboard passa a se chamar `Acessos rápidos` e cada cartão inclui um comando textual inequívoco: abrir Partituras, abrir Repertório ou registrar Presença.
- A estatística de partituras mais baixadas será reduzida às três primeiras posições em uma faixa compacta.
- No tema claro, cartões e ícones de categoria ganham superfícies próprias, bordas sutis e contraste suficiente para separar peças consecutivas sem pesar visualmente.
- O controle de expansão passa a dizer `Ver e editar N partes`, acompanhado de seta e tratamento visual de botão; toda a área informativa continua acionável.
