# Controle global dos tutoriais de primeiro uso

## Objetivo

Permitir que um administrador ative ou desative globalmente os dois tutoriais de primeiro uso do Acervo Digital: o tour dos músicos e o tutorial administrativo de partituras.

## Comportamento

- A opção ficará em **Admin > Configurações > Configurações do Sistema** com o nome **Tutoriais de primeiro uso**.
- Ligada, preserva o comportamento atual dos dois tutoriais.
- Desligada, impede que ambos sejam abertos para qualquer usuário ou dispositivo.
- A alteração afeta imediatamente a sessão atual e passa a valer para as demais sessões no próximo carregamento da aplicação.
- Reativar a opção não apaga o histórico local de conclusão. Usuários que já concluíram um tutorial não o verão novamente.
- Se a configuração não existir ou não puder ser consultada, o sistema assume os tutoriais ativos para preservar o comportamento existente.

## Persistência e API

A configuração usará a tabela `configuracoes`, que já armazena opções globais. A chave será `tutoriais_ativos`, com `true` como padrão quando não houver registro.

- `GET /api/config/tutoriais`: leitura pública do estado necessário ao frontend autenticado.
- `PUT /api/config/tutoriais`: atualização protegida pelo middleware de administrador.

Não haverá alteração de esquema nem migração obrigatória. O primeiro salvamento cria ou substitui a linha correspondente.

## Frontend

O `DataContext` carregará a configuração junto das demais opções globais e disponibilizará `tutoriaisAtivos` e `setTutoriaisAtivos`.

Os hooks dos dois tutoriais consultarão esse estado antes de agendar a abertura. Se a opção for desligada durante a sessão, qualquer tutorial pendente ou aberto será fechado e seus temporizadores serão cancelados.

O painel administrativo fará atualização otimista do botão. Se a API falhar, restaurará o valor anterior e exibirá uma mensagem de erro.

## Interface responsiva

O controle seguirá o padrão visual do botão de Modo Recesso. O texto explicativo ficará à esquerda e o botão à direita em telas amplas. Em telas estreitas, o conteúdo poderá quebrar sem reduzir a área de toque do botão, que manterá pelo menos 44 pixels de área interativa.

## Validação

- Testes de integração do Worker para leitura pública, valor padrão, atualização por administrador e bloqueio de usuário comum.
- Testes dos hooks para garantir que os tutoriais não abram quando desativados.
- Teste do painel para atualização, retorno em caso de erro e texto acessível do controle.
- Verificação visual em desktop e larguras móveis usando dados da API de produção, simulando apenas o novo endpoint até ele ser publicado.
