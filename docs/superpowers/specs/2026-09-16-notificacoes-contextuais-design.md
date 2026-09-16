# Notificações contextuais e navegação exata

## Objetivo

Transformar a central de notificações em um histórico curto e compreensível das mudanças do acervo. Cada item deve explicar o que mudou e, quando houver um destino relacionado, abrir exatamente a partitura ou o repertório correspondente.

## Escopo

- Melhorar os textos das notificações já exibidas no painel.
- Associar novas atividades a uma entidade por tipo e ID.
- Navegar pela identidade persistida, sem depender da comparação de títulos.
- Manter compatibilidade com atividades antigas, que não possuem entidade associada.
- Corrigir os três apontamentos do CodeRabbit no PR 144.

Não faz parte deste ajuste criar novos tipos de notificação, alterar permissões, enviar notificações push ou reconstruir visualmente o painel.

## Modelo de dados

A tabela `atividades` receberá duas colunas opcionais:

- `entidade_tipo`: identifica o tipo do destino, inicialmente `partitura` ou `repertorio`.
- `entidade_id`: guarda o identificador numérico da entidade.

As colunas serão opcionais para preservar todas as atividades existentes. A migração também criará um índice composto para as consultas futuras por destino.

O serviço de atividades continuará aceitando chamadas antigas. Os novos campos serão passados em um objeto opcional, evitando alterações obrigatórias em registros que não possuem destino navegável.

## Registro das atividades

As operações relacionadas a partituras e partes passarão o ID da partitura. As operações relacionadas a repertórios passarão o ID do repertório quando o tipo da atividade for mostrado aos músicos.

O campo `detalhes` continuará sendo texto legível. Ele não será usado para esconder identificadores ou dados estruturados.

## Apresentação

Cada notificação terá uma descrição baseada no tipo:

- Nova partitura: `Nova partitura adicionada ao acervo por {pessoa}.`
- Nova parte: `Parte {instrumento} adicionada a esta partitura por {pessoa}.`
- Novo repertório: `Novo repertório disponibilizado por {pessoa}.`
- Repertório atualizado: `O repertório foi atualizado por {pessoa}.`

O título da entidade permanece em destaque. Quando o nome da pessoa não existir, a frase termina sem atribuição. O texto evita repetir rótulo, título e autor em linhas desconectadas.

## Navegação

Ao clicar em uma notificação:

1. O item é marcado como lido.
2. Se houver `entidade_tipo` e `entidade_id`, o destino é resolvido pelo ID.
3. Para partitura, o aplicativo usa os dados atuais do acervo para montar `/acervo/{categoria}/{id}` e abrir o modal correto.
4. Para repertório, o aplicativo abre `/repertorio`.
5. Em atividades antigas sem ID, o aplicativo tenta uma correspondência normalizada e única por título.
6. Se houver zero ou mais de uma correspondência antiga, abre a tela geral apropriada; nunca escolhe arbitrariamente a primeira peça.

Esse fallback elimina o comportamento aleatório em títulos duplicados e preserva o acesso às notificações já gravadas.

## Erros e compatibilidade

- A migração é aditiva e não remove dados.
- Falhas no registro de atividade continuam sem interromper uploads ou edições.
- Um destino removido leva o usuário à tela geral do acervo ou repertório.
- A interface não exibe JSON, IDs internos ou texto técnico.

## Correções do CodeRabbit

- Aumentar o contraste dos rótulos dos grupos do menu administrativo.
- Capturar o primeiro cartão visível e seu deslocamento antes de uma recarga silenciosa, restaurando a mesma âncora depois da atualização da lista.
- Normalizar títulos ausentes no utilitário de ordenação, mantendo a função imutável.

## Validação

- Testes do contexto confirmam a conversão dos novos metadados e os textos contextuais.
- Testes do painel confirmam navegação por ID, fallback único e ausência de escolha em títulos duplicados.
- Testes da tela administrativa confirmam a restauração da âncora após recarga silenciosa.
- Teste unitário cobre títulos nulos na ordenação.
- Lint, suíte completa e build de produção devem passar.
- Validação manual no desktop e no mobile confirma legibilidade, fechamento do painel e abertura do destino correto.

