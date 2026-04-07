# Redesign de Analytics e Tracking

Data: 2026-04-06

## Objetivo

Redesenhar a área de analytics do admin para responder perguntas práticas sobre o uso do acervo, sem misturar downloads, visualizações, buscas, presença em ensaios e alterações administrativas.

A navegação principal fica organizada em quatro abas:

- **Uso do acervo**: o que está sendo aberto, visualizado, baixado e buscado.
- **Pessoas**: quem usa o acervo e qual sequência de ações cada pessoa realizou.
- **Ensaios**: presença mensal, streaks e participação por naipe.
- **Alterações**: mudanças administrativas no acervo, partes e repertórios.

Textos visíveis para o usuário devem ficar em PT-BR com acentuação correta. Nomes técnicos de eventos podem permanecer em inglês quando forem chaves internas.

## Modelo de Tracking

O D1 é a fonte de verdade para o dashboard admin. PostHog pode continuar existindo como integração auxiliar, mas não deve ser dependência para métricas administrativas.

Tabelas adicionadas:

- `tracking_sessions`
  - `id`
  - `usuario_id`
  - `inicio_em`
  - `fim_em`
  - `fim_motivo`
  - `ultimo_evento_em`

- `tracking_events`
  - `id`
  - `session_id`
  - `usuario_id`
  - `tipo`
  - `origem`
  - `criado_em`
  - `partitura_id`
  - `parte_id`
  - `repertorio_id`
  - `termo_original`
  - `termo_normalizado`
  - `resultados_count`
  - `metadata_json`

Regras de sessão:

- Login válido inicia uma sessão de tracking e retorna `tracking_session_id`.
- Evento autenticado sem sessão inicia uma nova sessão.
- Sessão enviada pelo cliente só é reutilizada se pertencer ao usuário, estiver aberta e tiver atividade nos últimos 30 minutos.
- Sessão desconhecida, encerrada ou expirada gera uma nova sessão para o mesmo usuário.
- Logout explícito encerra a sessão informada.

## Eventos

Eventos iniciais rastreados:

- `partitura_aberta`
- `pdf_visualizado_grade`
- `pdf_visualizado_parte`
- `download_grade`
- `download_parte`
- `busca_digitada`
- `busca_realizada`
- `favorito_adicionado`
- `favorito_removido`
- `sessao_iniciada`
- `sessao_encerrada`

Regras importantes:

- Visualizar pelo ícone de olho não conta como download.
- Visualizações repetidas contam como eventos separados.
- Download real só é contado quando o usuário baixa o arquivo para o dispositivo.
- Buscas armazenam termo original e termo normalizado.
- Termos sensíveis, como PIN, e-mail, telefone e CPF, devem ser mascarados antes de aparecer no dashboard.
- A origem deve ser explícita quando disponível: `acervo`, `busca`, `favoritos`, `repertorio`, `carrinho_compartilhamento`, `detalhe_partitura` ou equivalente.

## Uso do Acervo

Esta aba responde: “o que está sendo usado?”

Métricas:

- Partituras abertas.
- PDFs visualizados.
- Downloads reais.
- Buscas sem resultado.
- Conversão de abertura para visualização.
- Conversão de abertura para download.

Regras:

- `buscas_sem_resultado` conta apenas `busca_realizada` com `resultados_count = 0`.
- `busca_digitada` serve para entender intenção, mas não deve inflar busca sem resultado.
- Rankings de partituras e partes usam eventos de tracking, não somente contadores legados.

## Pessoas

Esta aba responde: “quem usou e o que fez?”

Deve permitir selecionar uma pessoa e visualizar:

- Resumo de aberturas, visualizações, downloads e buscas.
- Timeline paginada por período.
- Eventos com rótulos humanos, sem expor chaves técnicas por padrão.

## Ensaios

Esta aba responde: “como está a presença em ensaios?”

Regras:

- O período padrão é o mês atual.
- Datas de ensaio só entram no denominador quando têm presença de músico elegível.
- Músico elegível: usuário ativo, não admin, com instrumento em `Madeiras`, `Metais` ou `Percussão`.
- Presenças de admin, usuário inativo ou família fora dos naipes elegíveis não devem criar ensaio para o cálculo.

## Alterações

Esta aba responde: “o que foi alterado no acervo?”

Deve listar somente eventos auditáveis de administração, como:

- `nova_partitura`
- `novo_repertorio`
- `add_repertorio`
- `update_partitura`
- `delete_partitura`
- `nova_parte`
- `update_parte`
- `delete_parte`

Eventos comuns de uso, como `download`, `visualizacao` e `login`, não devem aparecer como alterações administrativas.

## Critérios de Aceite

- Login retorna e persiste sessão de tracking.
- Eventos autenticados sempre gravam `session_id` válido.
- Visualização com `action=view` não incrementa downloads nem `logs_download`.
- Grade é classificada por aliases como `Grade`, `Maestro`, `Regente`, `Score`, `Full Score`, `Conductor` e `Partitura`.
- Busca mobile envia o total bruto de resultados, mesmo renderizando só os primeiros itens.
- Dashboard admin evita respostas antigas sobrescrevendo respostas recentes.
- Cards do dashboard não geram overflow em mobile.
- Testes automatizados cobrem tracking, analytics, download view e atualização de partitura.
