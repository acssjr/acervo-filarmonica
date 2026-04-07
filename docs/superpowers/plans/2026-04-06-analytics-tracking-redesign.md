# Plano de Implementação: Redesign de Analytics e Tracking

Data: 2026-04-06

## Objetivo

Implementar um dashboard admin claro, com tracking próprio em D1, separando visualização de PDF, download real, busca, atividade por pessoa, presença em ensaios e alterações administrativas.

## Escopo

Arquivos principais:

- `database/migrations/011_tracking_sessions_events.sql`
- `worker/tests/setup.ts`
- `worker/tests/trackingService.test.ts`
- `worker/tests/routes.test.ts`
- `worker/src/domain/analytics/eventSanitizer.js`
- `worker/src/domain/analytics/sessionService.js`
- `worker/src/domain/analytics/eventService.js`
- `worker/src/domain/analytics/analyticsService.js`
- `worker/src/routes/estatisticaRoutes.js`
- `worker/src/domain/auth/loginService.js`
- `worker/src/domain/partituras/downloadService.js`
- `worker/src/domain/partituras/partituraService.js`
- `frontend/src/services/api.js`
- `frontend/src/hooks/useSheetDownload.js`
- `frontend/src/components/modals/SheetDetailModal.jsx`
- `frontend/src/components/common/MobileSearchOverlay.jsx`
- `frontend/src/screens/SearchScreen.jsx`
- `frontend/src/screens/admin/AdminAnalytics.jsx`
- `frontend/src/utils/formatters.js`
- `frontend/src/__tests__/mocks/handlers.js`

## Etapas

- [x] Criar tabelas `tracking_sessions` e `tracking_events` com índices de consulta por data, usuário, sessão, tipo, partitura e parte.
- [x] Adicionar o mesmo schema ao setup de testes do worker.
- [x] Implementar sanitização de termos de busca, incluindo normalização e máscara para dados sensíveis.
- [x] Implementar ciclo de vida da sessão de tracking.
- [x] Iniciar sessão no login e retornar `tracking_session_id`.
- [x] Encerrar sessão explicitamente em `/api/tracking/session/end`.
- [x] Registrar eventos autenticados em `/api/tracking/events`.
- [x] Criar nova sessão quando o cliente não enviar sessão ou enviar sessão desconhecida, encerrada ou expirada.
- [x] Impedir reaproveitamento de sessão de outro usuário.
- [x] Persistir a sessão no frontend e enviar `X-Tracking-Session` nos eventos.
- [x] Evitar request de tracking sem token.
- [x] Adicionar handlers MSW para endpoints de tracking.
- [x] Classificar aliases de grade como eventos de grade.
- [x] Separar visualização de PDF e download real no backend.
- [x] Isolar captura PostHog para não derrubar download.
- [x] Enviar total bruto de resultados na busca mobile.
- [x] Resetar tracking de digitação quando a busca é limpa.
- [x] Proteger `AdminAnalytics` contra respostas antigas sobrescrevendo respostas recentes.
- [x] Remover `gridColumn: span 2` dos painéis comuns para evitar overflow em mobile.
- [x] Ajustar dependência do modal de detalhes para `selectedSheet.id`.
- [x] Adicionar rótulos para sessão iniciada e encerrada.
- [x] Ajustar métricas de analytics:
  - `buscas_sem_resultado` conta apenas `busca_realizada`.
  - Ensaios contam apenas datas com músico elegível.
  - Alterações exibem somente atividades administrativas auditáveis.
- [x] Preservar compositor no update de partitura quando o campo não é enviado.
- [x] Rejeitar título duplicado ao atualizar partitura.

## Regras de Implementação

- D1 é a fonte de verdade do dashboard.
- PostHog continua opcional e não bloqueante.
- Eventos de visualização não incrementam downloads nem `logs_download`.
- Eventos comuns de uso não entram na aba Alterações.
- O frontend não deve registrar tracking quando não há token.
- A UI admin deve continuar em PT-BR e seguir o padrão visual já existente do projeto.

## Verificação

Comandos esperados:

```bash
npm run test
cd frontend && npm run test -- --runInBand
npm run lint:worker
cd frontend && npm run lint
```

Testes específicos adicionados ou reforçados:

- Sessão de tracking criada no login.
- Evento autenticado com `session_id`.
- Encerramento de sessão.
- Sessão desconhecida gerando nova sessão.
- Busca sem resultado sem inflação por `busca_digitada`.
- Ensaios filtrando admin, inativo e família não elegível.
- Alterações filtrando apenas eventos auditáveis.
- `action=view` sem incremento de download.
- Update de partitura preservando compositor omitido.
- Update rejeitando título duplicado.
- Busca mobile enviando total bruto de resultados.
- Aliases de grade gerando eventos de grade.
