# Áudio oficial nas partituras

## Objetivo

Permitir que uma pessoa ouça a gravação oficial de uma música, produzida com instrumentos virtuais, no modal que já abre ao selecionar a partitura. Cada partitura pode ter um arquivo de áudio e um link opcional para o YouTube. O site não incorpora nem extrai áudio de vídeos do YouTube. Não há suporte a MIDI.

## Experiência aprovada

- No `SheetDetailModal`, um botão **Ouvir partitura** aparece somente quando existe arquivo de áudio. O botão expande um player no próprio modal; não muda de tela.
- O player oferece play/pausa, barra de progresso com busca, retorno e avanço de dez segundos, tempo decorrido/duração e velocidade. O primeiro toque reproduz um trecho de até 30 segundos; **Ouvir completo** continua o mesmo arquivo sem baixar ou manter uma prévia separada. Se o arquivo tiver menos de 30 segundos, o trecho termina com o arquivo.
- Se houver URL do YouTube, **Ver no YouTube** aparece como link externo separado. Quando houver apenas o link, não aparece botão de áudio. Quando não houver nenhum dos dois, o modal mantém o fluxo atual sem seção de mídia.
- A subaba **Áudios das músicas** fica dentro do Acervo e mostra partituras com arquivo ou link. Sua lista serve para encontrar uma música e abrir o mesmo modal. A reprodução acontece no modal; não há player duplicado na lista.
- O player pausa e libera o áudio ao fechar o modal, trocar de partitura ou sair da sessão. Não há reprodução automática ao abrir um modal. O botão do usuário inicia a reprodução.
- O layout reutiliza cores, tipografia, espaçamentos e o comportamento responsivo do modal atual. Em celular, os controles têm alvos de toque adequados e a área do modal continua rolável.

## Cadastro e dados

- A edição administrativa de uma partitura permite carregar, substituir ou remover um áudio oficial, além de cadastrar/remover o link do YouTube. A partitura precisa existir antes do upload de áudio; o cadastro inicial da partitura não muda.
- Uma migração D1 acrescenta a `partituras` metadados do áudio (`audio_key`, `audio_mime`, `audio_name`, `audio_size`) e `youtube_url`, todos opcionais. A listagem e o detalhe retornam somente `has_audio`, `audio_name`, `audio_mime` e `youtube_url` para a interface; `audio_key` não é enviado ao cliente.
- Os arquivos ficam no bucket R2 existente, sob um prefixo próprio. São aceitos MP3, WAV, M4A, OGG e WebM de áudio, mediante validação de extensão, MIME e assinatura quando aplicável. O painel recomenda MP3 para menor consumo de dados. O cliente informa quando o navegador não reproduz o formato do arquivo; o servidor não converte formatos. MIDI e arquivos de vídeo são rejeitados.
- O link é validado no servidor para `youtube.com` ou `youtu.be` por HTTPS. URLs arbitrárias e domínios semelhantes são recusados.
- Na substituição, o novo objeto é armazenado antes de atualizar o registro; uma falha no banco remove o objeto novo. O antigo é removido após atualização bem-sucedida. Remover a partitura também agenda remoção de seu áudio.

## Entrega do áudio e controle de acesso

- Uma rota autenticada fornece ao cliente uma URL temporária assinada para o áudio da partitura. A URL não contém o token de login. A rota de streaming verifica assinatura, expiração e existência da partitura ativa antes de ler o R2.
- O streaming aceita requisições HTTP `Range` e responde `206` com `Content-Range`, `Content-Length`, `Accept-Ranges` e `Content-Type` corretos. Requisições sem `Range` recebem `200`; faixas inválidas recebem `416`.
- O elemento HTML `<audio>` usa `preload="metadata"` e essa URL. Assim, o navegador faz buffering e busca por partes e os controles continuam naturais em desktop e mobile. Uma URL expirada ou erro de rede produz estado de erro e ação para tentar novamente.

## Limites e verificação

- O upload aceita até 80 MiB por arquivo. O limite é mostrado no painel e arquivos maiores são recusados antes de gravar no R2. A implantação deve confirmar que o limite de corpo de requisição da conta Cloudflare comporta 80 MiB.
- Testes de serviço cobrem autorização, validação de URL e arquivo, substituição/remoção, assinatura temporária e respostas de range. Testes de interface cobrem estados com arquivo, somente YouTube e nenhum dos dois, pausa ao fechar e limite da prévia.
- A interface será verificada nos tamanhos desktop e mobile contra o modal existente e a subaba do Acervo.
