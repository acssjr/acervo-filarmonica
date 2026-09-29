# Áudio oficial nas partituras Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reproduzir o áudio oficial de uma partitura no modal existente, oferecer link externo para YouTube e listar músicas com mídia em uma subaba do Acervo.

**Architecture:** Os metadados ficam em D1 e o arquivo privado em R2. Uma rota autenticada gera acesso temporário para um endpoint com HTTP Range. O modal possui uma instância de áudio e a subaba apenas abre esse modal.

**Tech Stack:** Cloudflare Worker, D1, R2, React 18, Vite, Vitest, Playwright.

---

## Mapa de arquivos

- `database/migrations/0006_partitura_audio.sql`: colunas e índice de disponibilidade de mídia.
- `worker/src/domain/partituras/audioService.js`: validação, upload, remoção, assinatura e streaming.
- `worker/src/routes/partituraRoutes.js`: rotas administrativas e de reprodução.
- `worker/src/domain/partituras/partituraService.js`: listagem segura e remoção do objeto ao apagar a partitura.
- `frontend/src/services/api.js`: chamadas administrativas e pedido de acesso temporário.
- `frontend/src/contexts/DataContext.jsx`: metadados no modelo de partitura da UI.
- `frontend/src/components/modals/SheetAudioPlayer.jsx`: controles e ciclo de vida do áudio.
- `frontend/src/components/modals/SheetDetailModal.jsx`: botão, player e link externo.
- `frontend/src/screens/LibraryScreen.jsx`: subaba que lista músicas com mídia e abre o modal.
- `frontend/src/screens/admin/AdminPartituras.jsx`: upload, substituição, remoção e URL.

### Task 1: Esquema e API de metadados

- [ ] Criar migração com `ALTER TABLE partituras ADD COLUMN audio_key TEXT`, `audio_mime TEXT`, `audio_name TEXT`, `audio_size INTEGER` e `youtube_url TEXT`; adicionar índice parcial para registros com mídia.
- [ ] Ajustar as consultas públicas para projeção explícita, com `CASE WHEN p.audio_key IS NOT NULL THEN 1 ELSE 0 END AS has_audio`, sem retornar `audio_key`.
- [ ] Incluir `hasAudio`, `audioName`, `audioMime` e `youtubeUrl` no mapeamento do `DataContext`.
- [ ] Executar `npm run db:schema:test` e testes da API; corrigir o esquema de teste gerado se o projeto exigir.
- [ ] Commitar `feat: add partitura media metadata`.

### Task 2: Gestão e streaming do arquivo

- [ ] Escrever testes de serviço para formatos aceitos, rejeição de MIDI/vídeo, URL YouTube, limite de 80 MiB, autorização, substituição e remoção.
- [ ] Implementar `audioService.js` com `uploadAudio`, `removeAudio`, `updateYoutubeUrl`, `getAudioAccess` e `streamAudio`; usar chave em `audios/` e compensar falha D1 apagando o objeto recém-enviado.
- [ ] Assinar `partituraId:audioKey:expiry` com HMAC SHA-256 e `JWT_SECRET`; a rota autenticada retorna URL válida por duas horas, sem token de login. O streaming valida a assinatura e usa `BUCKET.get(key, { range })`.
- [ ] Tratar `GET`/`HEAD`, `Range` válido e inválido, respostas `200`/`206`/`416`, e cabeçalhos de cache privado, tipo, tamanho e faixas.
- [ ] Registrar rotas e incluir o objeto de áudio na limpeza de exclusão da partitura.
- [ ] Rodar testes focados e `npm run lint:worker`; commitar `feat: manage and stream sheet audio`.

### Task 3: Painel administrativo

- [ ] Acrescentar métodos de API para upload multipart, remoção e gravação da URL.
- [ ] Na edição da partitura, mostrar arquivo atual, seletor `accept` para áudio, limite de 80 MiB, botões de substituir/remover e campo YouTube, com estados de envio e erro.
- [ ] Atualizar lista local após cada operação bem-sucedida para refletir `has_audio` e `youtube_url`.
- [ ] Testar manualmente arquivo aceito, formato inválido e URL inválida; commitar `feat: edit sheet media in admin`.

### Task 4: Player dentro do modal

- [ ] Criar componente com `audio` e `preload="metadata"`, botão de abrir, play/pausa, ±10 s, busca, duração e velocidade; parar em 30 s no modo trecho e continuar ao escolher reprodução completa.
- [ ] Renderizar o componente só com arquivo e o link YouTube só com URL; limpar áudio ao fechar/trocar de partitura. Nenhuma reprodução automática ao abrir.
- [ ] Testar os três estados (arquivo, só link, nenhum), limite do trecho, pausa e erro de rede.
- [ ] Verificar teclado, leitor de tela e controles de toque; commitar `feat: play official audio in sheet modal`.

### Task 5: Subaba do Acervo e verificação

- [ ] Criar alternância `Partituras` / `Áudios das músicas` dentro da tela do Acervo; na segunda visão, filtrar itens com `hasAudio || youtubeUrl` e abrir `setSelectedSheet(sheet)` ao clicar.
- [ ] Preservar navegação de categorias e permitir voltar à lista de partituras; testar estados vazios e busca se a tela já tiver busca aplicável.
- [ ] Rodar testes, build do frontend, checagem de rotas, inspeção visual em desktop e mobile.
- [ ] Revisar `git diff --check`, estado final e commits; informar o que foi verificado e qualquer limitação de implantação (migração e arquivo real de teste).
