# Acervo Digital no OpenBot

O WhatsApp Orchestrator recebe os pedidos no chat privado autorizado e delega ao
agente Acervo Digital · Filarmônica. O agente devolve a prévia ao Orchestrator,
que pede aprovação no mesmo chat. Cada prévia selada tem um código e vale por
sete dias. O importador registra o ID da mensagem de aprovação e o resultado
de cada obra.

No chat do Acervo no OpenBot, responda `APROVO` à mensagem da prévia.
Quando houver só uma prévia pendente, também pode escrever `APROVO`
diretamente no chat. No WhatsApp privado, use `APROVO ACERVO` quando só
houver uma prévia. O código continua disponível para selecionar uma obra
específica. O importador valida o autor, o canal e a prévia correspondente.

Quando a prévia indicar o grupo **S. F. 25 de Março - Banda**, a aprovação
também inclui o aviso de publicação. Depois de confirmar o cadastro do lote,
o agente usa o card oficial da página de cada obra e anexa a imagem ao aviso
com o link limpo na legenda. O nome e os créditos ficam no card. Prévia
selada sem esse destino não gera aviso.
O registro `publicacao.json` guarda o estado de cada mensagem. Um novo
`publicar LOTE` só retenta automaticamente se a tentativa anterior parou
antes do envio. Se o WhatsApp não confirmar a entrega, confira o histórico.

O utilitário usa os normalizadores de pasta, metadados, instrumentos e
duplicatas do frontend. PDFs avulsos e ZIPs podem vir como documentos do
WhatsApp. Pastas podem ser compactadas antes do envio ou baixadas pelo agente
para sua pasta privada de entradas quando houver acesso autorizado à origem.
O importador agrupa os PDFs pela pasta que os contém.
Para obras com partes, ele usa somente instrumentos identificados no nome do
PDF, sem aceitar coincidências parciais. A prévia selada mostra cada nome de
arquivo ao lado do rótulo que será cadastrado. Exiba todas as linhas de
`relacao_para_exibir_antes_de_aprovar` com o código da prévia, sem editar ou
resumir as linhas. O importador confere se essa relação apareceu em uma
mensagem do Acervo no OpenBot ou do bot no WhatsApp privado antes de aprovar.
Se algum nome não identificar o instrumento, corrija o nome do arquivo e
prepare uma nova prévia.

## Comandos no VPS

Execute os comandos com `python3 importacao/acervo-openbot.py` no workspace
do agente.

- `recebidos` lista referências de documentos recentes do chat autorizado.
- `preparar-whatsapp ID [ID...]` importa referências de mensagens nativas.
- `preparar CAMINHO [CAMINHO...]` aceita um PDF, ZIP ou pasta da área de entradas.
- `--obra "Título - Compositor" preparar-whatsapp ID1 ID2` reúne PDFs
  avulsos em uma única obra. A opção também funciona com `preparar`.
- `ver LOTE` relê os dados em revisão.
- `localizar-previa CÓDIGO` consulta um lote selado e vigente pelo código
  exibido no OpenBot ou no WhatsApp privado.
- `localizar-previa` consulta a única prévia pendente ou lista as opções
  para pedir o código correto.
- `revisar LOTE` recebe JSON na entrada padrão. As chaves indicam números de
  obras e arquivos, começando em 1. Exemplo de entrada:
  `{"1":{"titulo":"Nome da obra","compositor":"Nome","categoria":"dobrados","tipo":"partes","instrumentos":{"1":"Trompete Bb 1"}}}`.
- `selar LOTE` confere as pendências, congela a prévia e retorna a frase
  `APROVO ACERVO CÓDIGO`. Para corrigir uma prévia selada, prepare outro lote.
- `publicar LOTE` exige uma aprovação no chat do Acervo no OpenBot ou no
  WhatsApp privado, confere o catálogo e os arquivos, envia e relê o cadastro pela API.
  Se uma tentativa terminar sem resposta conclusiva, confira no painel antes
  de preparar um reenvio.

A chave `ACERVO_IMPORT_KEY` dá acesso às operações de gestão de partituras e
partes na API. Contas e outras áreas usam as permissões anteriores. A chave
fica em `importacao/.import-key` no workspace do agente.

- `consultar-partes ID_OBRA` resolve os IDs antes de alterar.
- `substituir-parte ID_OBRA ID_PARTE CAMINHO_PDF` confirma o vínculo, usa o
  nome do PDF para validar o instrumento, substitui o arquivo e relê a parte.
- `substituir-obra ID_OBRA CAMINHO_PDF` troca o PDF de uma obra de arquivo único.
- `preparar-exclusao-obra ID_OBRA` e `preparar-exclusao-parte ID_OBRA ID_PARTE`
  geram o alvo literal e o código. Exiba os dois na mesma prévia e aguarde a
  mensagem do titular `CONFIRMO EXCLUSAO CÓDIGO`, no OpenBot ou no WhatsApp
  privado. Só então execute `confirmar-exclusao CÓDIGO`.
O arquivo privado `importacao/canal.json` registra a conexão, o remetente e a
conversa autorizados pelas chaves `conexao`, `remetente` e `conversa`.
O arquivo privado `importacao/aprovacao-openbot.json` identifica o membro
autorizado, o agente do Acervo e o início da aceitação de aprovações no painel.
O destino do aviso fica em `importacao/aviso.json`, com `jid` e `nome`.
Copie `scripts/acervo_openbot_notice.py` para o mesmo diretório do importador.

Para atualizar o runtime no VPS, empacote o analisador a partir do repositório
e copie o resultado para `importacao/acervo-openbot.mjs` ao lado do Python:

```sh
npm exec -- esbuild scripts/acervo-openbot.mjs --bundle --platform=node --format=esm --outfile=tmp/acervo-openbot.mjs
```

## Consultas e alterações do OpenBot

O comando administrativo usa uma credencial própria, definida no Worker como
secret ACERVO_OPENBOT_KEY e em um arquivo .openbot-key no mesmo diretório do
script no VPS. Configure ACERVO_OPENBOT_ADMIN_ID com o ID da conta administrativa
de integração que fará as consultas. A credencial de importação continua sendo
usada para os fluxos com arquivos. A integração administrativa cobre consultas
e alterações JSON dos módulos do Acervo. O painel continua tratando as
alterações de contas e credenciais e os demais formulários com anexos.

Use o Node do agente para executar acervo-openbot-admin.mjs. Exemplos:

```sh
node acervo-openbot-admin.mjs consultar /api/repertorios
printf '%s\n' '{"nome":"Concerto de Natal"}' | node acervo-openbot-admin.mjs propor /api/repertorios POST
printf '%s\n' '{"nome":"Concerto de Natal - Revisado"}' | node acervo-openbot-admin.mjs propor /api/repertorio/37 PUT
node acervo-openbot-admin.mjs estado ID_DA_SOLICITACAO
```

Informe ao solicitante o ID e a alteração proposta. O administrador decide
em **Admin > Aprovações do OpenBot**. As prévias expiram após 24 horas. Só
informe que a alteração foi aplicada quando o estado for concluida. Se o
estado ficar incerta ou executando após uma interrupção, confira o painel
antes de enviar uma nova proposta.
