# Analytics Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the administrative Analytics experience around engagement, sheet interest, and rehearsal attendance with fair comparisons, projections, useful insights, and focused drill-down views.

**Architecture:** Keep the existing authenticated admin route as the entry point, but replace the monolithic analytics data/rendering flow with a shared period/comparison contract, focused backend metric modules, and a frontend shell plus three detail views. Move administrative activity history into a separate audit screen and endpoint. Preserve the old dashboard contract only for a controlled transition where existing consumers still require it.

**Tech Stack:** React 18, React Router 7, Recharts, existing API service and `openapi-fetch` client, Cloudflare Workers, D1 SQLite, Vitest with `@cloudflare/vitest-plugin`, Testing Library, existing CSS variables and icon system.

**Spec:** `docs/superpowers/specs/2026-09-13-analytics-redesign-design.md`

## Global Constraints

- The public is formed by active users who are not administrators or guests.
- Visualizing and downloading PDFs have exactly the same weight.
- Exploring the repertoire has lower weight; opening only a sheet detail is not a relevant access.
- The default is the current month compared to the same days of the previous month.
- Custom periods compare with the immediately preceding interval of equal duration.
- Projections are estimates and are hidden when there is not enough data.
- Administrative history does not appear as a fourth Analytics tab.
- The mobile navigation cannot cover cards, filters, or content.
- API owns metrics, comparisons, projections, and classification; UI owns hierarchy, explanation, and interaction.
- Administrators and guests never appear in musician engagement or attendance rankings.

---

## File map and ownership

Create the following focused modules before deleting or shrinking the current monolith:

- `worker/src/domain/analytics/periodUtils.js`: parse current/comparison intervals and projection metadata.
- `worker/src/domain/analytics/engagementAnalytics.js`: eligible population, action totals, musician ranking, and engagement drill-down queries.
- `worker/src/domain/analytics/sheetAnalytics.js`: sheet/part rankings, instrument variety, and sheet trends.
- `worker/src/domain/analytics/attendanceAnalytics.js`: attendance percentages, rehearsal sample sizes, naipe summaries, and decline detection.
- `worker/src/domain/analytics/insightService.js`: deterministic insight rules with evidence and confidence/sample metadata.
- `worker/src/domain/auditoria/auditService.js`: administrative activity query extracted from the current analytics service.
- `worker/tests/analyticsPeriods.test.ts`: period and projection rules.
- `worker/tests/analyticsMetrics.test.ts`: metric and ranking rules against D1 fixtures.
- `worker/tests/auditService.test.ts`: audit filtering and pagination.
- `frontend/src/screens/admin/analytics/AnalyticsShell.jsx`: shared filters, URL view state, loading, and error boundaries.
- `frontend/src/screens/admin/analytics/AnalyticsOverview.jsx`: landing view with summary, rankings, and insights.
- `frontend/src/screens/admin/analytics/EngagementAnalytics.jsx`: musician detail view.
- `frontend/src/screens/admin/analytics/SheetAnalytics.jsx`: sheet detail view.
- `frontend/src/screens/admin/analytics/AttendanceAnalytics.jsx`: attendance detail view.
- `frontend/src/screens/admin/analytics/components/AnalyticsPeriodBar.jsx`: period controls, comparison label, and projection legend.
- `frontend/src/screens/admin/analytics/components/AnalyticsRanking.jsx`: reusable ranked list with composition and empty states.
- `frontend/src/screens/admin/analytics/components/AnalyticsTrend.jsx`: reusable Recharts trend visualization.
- `frontend/src/screens/admin/analytics/components/InsightCard.jsx`: alert/discovery/recognition presentation.
- `frontend/src/screens/admin/analytics/analyticsFormatters.js`: labels, numbers, dates, and explanatory copy.
- `frontend/src/screens/admin/auditoria/AdminAudit.jsx`: separated administrative history screen.
- `frontend/src/screens/admin/auditoria/AdminAudit.test.jsx`: audit screen states and filters.
- `frontend/src/screens/admin/analytics/AnalyticsOverview.test.jsx`: overview and navigation behavior.
- `frontend/src/screens/admin/analytics/EngagementAnalytics.test.jsx`: ranking and composition rendering.
- `frontend/src/screens/admin/analytics/AttendanceAnalytics.test.jsx`: sample-size and empty-state rendering.

Modify the existing files below:

- `worker/src/domain/analytics/eventService.js`: allow and validate `repertorio_aberto`.
- `worker/src/domain/analytics/analyticsService.js`: become a compatibility façade delegating to focused modules.
- `worker/src/routes/estatisticaRoutes.js`: expose the new analytics and audit handlers.
- `worker/openapi.yaml`: document response/query contracts.
- `worker/tests/routes.test.ts`: route-level analytics, audit, comparison, and projection coverage.
- `frontend/src/services/api.js`: add overview/detail/audit methods and preserve silent event tracking.
- `frontend/src/services/api-client.ts`: add typed methods for the generated contract.
- `frontend/src/screens/RepertorioScreen.jsx`: emit a deliberate `repertorio_aberto` event once per selected repertoire view.
- `frontend/src/screens/admin/AdminAnalytics.jsx`: replace the 1,335-line monolith with the shell/imported views.
- `frontend/src/screens/admin/AdminApp.jsx`: add the separate audit navigation entry and route state.
- `frontend/src/api-types.ts`: regenerate from the OpenAPI document and verify no unrelated drift.

---

### Task 1: Add deterministic period, comparison, and projection primitives

**Files:**
- Create: `worker/src/domain/analytics/periodUtils.js`
- Create: `worker/tests/analyticsPeriods.test.ts`
- Modify: `worker/src/domain/analytics/analyticsService.js:1-40`

**Interfaces:**
- Produces `parseAnalyticsPeriod(url, now = new Date())` returning `{ atual: { inicio, fim, diasDecorridos, diasTotais, incompleto }, comparacao: { inicio, fim }, projecao: { disponivel, fator, confianca } }`.
- Produces `projectValue(value, period)` returning `{ disponivel, valor, fator, confianca }`.
- Consumes `inicio` and `fim` query parameters used by the current dashboard endpoint.

- [ ] **Step 1: Write failing period tests**

```ts
it('compara o mês atual somente aos mesmos dias do mês anterior', () => {
  const period = parseAnalyticsPeriod(
    new URL('https://test.local/api/admin/analytics/dashboard?inicio=2026-09-01&fim=2026-09-14'),
    new Date('2026-09-14T12:00:00Z')
  );

  expect(period.comparacao).toEqual({ inicio: '2026-08-01', fim: '2026-08-14' });
  expect(period.atual.incompleto).toBe(true);
});

it('usa um intervalo imediatamente anterior de mesma duração para datas personalizadas', () => {
  const period = parseAnalyticsPeriod(
    new URL('https://test.local/api/admin/analytics/dashboard?inicio=2026-09-10&fim=2026-09-20'),
    new Date('2026-09-20T12:00:00Z')
  );

  expect(period.comparacao).toEqual({ inicio: '2026-08-31', fim: '2026-09-10' });
});

it('não projeta sem dias observados suficientes', () => {
  expect(projectValue(0, { diasDecorridos: 0, diasTotais: 30 }).disponivel).toBe(false);
});
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npx vitest run worker/tests/analyticsPeriods.test.ts`

Expected: FAIL because the period module and exported functions do not exist.

- [ ] **Step 3: Implement UTC-safe interval parsing**

Implement `parseAnalyticsPeriod` using ISO date-only values, an exclusive end date, current-month defaults, equal-length previous intervals, and a minimum observed-day threshold before projection. Keep the existing API’s `fim` semantics exclusive.

- [ ] **Step 4: Run the focused tests and verify success**

Run: `npx vitest run worker/tests/analyticsPeriods.test.ts`

Expected: PASS.

- [ ] **Step 5: Make the legacy service consume the primitive**

Replace the local `getPeriod` logic in `analyticsService.js` with `parseAnalyticsPeriod` while still exposing the old `periodo.inicio` and `periodo.fim` keys in the compatibility response.

- [ ] **Step 6: Commit**

```bash
git add worker/src/domain/analytics/periodUtils.js worker/tests/analyticsPeriods.test.ts worker/src/domain/analytics/analyticsService.js
git commit -m "feat: centralizar periodos e projecoes do analytics"
```

### Task 2: Register repertoire exploration as a deliberate analytics event

**Files:**
- Modify: `worker/src/domain/analytics/eventService.js:4-17,125-159`
- Modify: `worker/tests/trackingService.test.ts`
- Modify: `frontend/src/screens/RepertorioScreen.jsx:828-903`
- Modify: `frontend/src/services/api.js:503-530`

**Interfaces:**
- `buildTrackingEventPayload({ tipo: 'repertorio_aberto', origem: 'repertorio', repertorio_id })` returns a valid payload.
- `RepertorioScreen` emits one event when the initial repertoire is selected and one when the user deliberately switches to another repertoire; it does not emit on unrelated re-renders.

- [ ] **Step 1: Add the failing server validation test**

```ts
it('aceita a abertura deliberada de um repertório', () => {
  expect(buildTrackingEventPayload({
    tipo: 'repertorio_aberto',
    origem: 'repertorio',
    repertorio_id: 7
  })).toMatchObject({ tipo: 'repertorio_aberto', repertorio_id: 7 });
});
```

- [ ] **Step 2: Run the tracking test and verify failure**

Run: `npx vitest run worker/tests/trackingService.test.ts`

Expected: FAIL with `Tipo de evento invalido`.

- [ ] **Step 3: Add the event type and client instrumentation**

Add `repertorio_aberto` to the allow-list. In `RepertorioScreen`, keep a `trackedRepertoireIdsRef` and call `API.trackEvent` after the selected repertoire is known, with `origem: 'repertorio'` and the selected `repertorio_id`. Do not send a tracking call from the loading state or for every render.

- [ ] **Step 4: Verify server and frontend tests**

Run: `npx vitest run worker/tests/trackingService.test.ts frontend/src/screens/RepertorioScreen.test.js`

Expected: PASS, with one event for initial selection and one for a deliberate switch.

- [ ] **Step 5: Commit**

```bash
git add worker/src/domain/analytics/eventService.js worker/tests/trackingService.test.ts frontend/src/screens/RepertorioScreen.jsx frontend/src/services/api.js
git commit -m "feat: rastrear exploracao do repertorio"
```

### Task 3: Build focused backend engagement and sheet metrics

**Files:**
- Create: `worker/src/domain/analytics/engagementAnalytics.js`
- Create: `worker/src/domain/analytics/sheetAnalytics.js`
- Create: `worker/tests/analyticsMetrics.test.ts`
- Modify: `worker/src/domain/analytics/analyticsService.js`

**Interfaces:**
- `getEngagementAnalytics(env, period)` returns `{ resumo, ranking, tendencia, amostras }`.
- `getSheetAnalytics(env, period)` returns `{ resumo, ranking, partes, tendencia, amostras }`.
- Both functions accept `{ inicio, fim, comparacao }` from `parseAnalyticsPeriod`.

- [ ] **Step 1: Seed a fixture matrix and write failing ranking tests**

Insert active musician, inactive musician, admin, guest, two sheets, parts, tracking events, and downloads into the D1 test database. Assert that:

```ts
expect(data.engagement.ranking[0]).toMatchObject({ nome: 'Músico Ativo', total_acoes: 4 });
expect(data.engagement.ranking.some((item) => item.nome === 'Admin Teste')).toBe(false);
expect(data.engagement.ranking.some((item) => item.nome === 'Convidado Teste')).toBe(false);
expect(data.sheets.ranking[0]).toMatchObject({ titulo: 'Partitura Mais Vista', acessos_pdf: 3 });
```

- [ ] **Step 2: Run the route/metric tests and verify failure**

Run: `npx vitest run worker/tests/analyticsMetrics.test.ts`

Expected: FAIL because focused metric functions and response shape do not exist.

- [ ] **Step 3: Implement engagement queries**

Union `tracking_events` and `logs_download` only for the approved action types. Count PDF visualization and download as one action each. Count `repertorio_aberto` as `0.5` engagement points per event through a named `REPERTOIRE_ACTION_WEIGHT` constant, expose both raw counts and the resulting transparent total, and show the weighting explanation in the UI. Filter `u.ativo = 1`, `u.admin = 0`, and `COALESCE(u.convidado, 0) = 0` before aggregation. Return active days and distinct sessions as context.

- [ ] **Step 4: Implement sheet queries**

Aggregate `pdf_visualizado_grade`, `pdf_visualizado_parte`, `download_grade`, and `download_parte` by `partitura_id`. Return equal-weight `acessos_pdf`, part rankings, distinct instruments, and the previous-period delta. Exclude administrative previews because existing download services already avoid tracking admin previews.

- [ ] **Step 5: Run the tests and verify success**

Run: `npx vitest run worker/tests/analyticsMetrics.test.ts`

Expected: PASS, including zero-result arrays and correct public filtering.

- [ ] **Step 6: Commit**

```bash
git add worker/src/domain/analytics/engagementAnalytics.js worker/src/domain/analytics/sheetAnalytics.js worker/tests/analyticsMetrics.test.ts worker/src/domain/analytics/analyticsService.js
git commit -m "feat: calcular engajamento e interesse por partituras"
```

### Task 4: Build focused attendance and insight services

**Files:**
- Create: `worker/src/domain/analytics/attendanceAnalytics.js`
- Create: `worker/src/domain/analytics/insightService.js`
- Modify: `worker/tests/analyticsMetrics.test.ts`
- Modify: `worker/src/domain/analytics/analyticsService.js`

**Interfaces:**
- `getAttendanceAnalytics(env, period)` returns `{ resumo, ranking, naipes, tendencia, amostra }`.
- `buildAnalyticsInsights({ atual, comparacao, amostras })` returns an ordered array of `{ id, tipo, titulo, descricao, severidade, evidencias, confianca }`.

- [ ] **Step 1: Add failing attendance and insight tests**

Cover no rehearsals, one rehearsal, enough rehearsals, percentage ordering, equal-percentage tie-break by presence count, and decline alerts:

```ts
expect(data.attendance.resumo.ensaios_realizados).toBe(3);
expect(data.attendance.ranking[0]).toMatchObject({ nome: 'Músico Assíduo', taxa: 100, presencas: 3 });
expect(data.insights).toEqual(expect.arrayContaining([
  expect.objectContaining({ tipo: 'alerta', id: 'queda_presenca' })
]));
```

- [ ] **Step 2: Run the tests and verify failure**

Run: `npx vitest run worker/tests/analyticsMetrics.test.ts`

Expected: FAIL because attendance and insight modules do not exist.

- [ ] **Step 3: Implement attendance aggregation**

Use the valid rehearsal families already defined by the application. Build denominator from distinct rehearsals in the period and numerator from registered presences. Filter active, non-admin, non-guest users. Return `taxa`, `presencas`, and `ensaios` for every eligible musician; when the denominator is zero, return an explicit `sem_ensaios` state and no low-presence classification.

- [ ] **Step 4: Implement deterministic insight rules**

Compare equivalent periods. Emit positive discoveries for meaningful increases, recognition for top engagement/attendance, and alerts for relevant decreases only when thresholds and sample minimums are satisfied. Every insight must carry the values and period used to derive it; never emit a warning based solely on missing data.

- [ ] **Step 5: Run the tests and verify success**

Run: `npx vitest run worker/tests/analyticsMetrics.test.ts`

Expected: PASS for ranking, no-ensayo state, sample gating, and alert evidence.

- [ ] **Step 6: Commit**

```bash
git add worker/src/domain/analytics/attendanceAnalytics.js worker/src/domain/analytics/insightService.js worker/tests/analyticsMetrics.test.ts worker/src/domain/analytics/analyticsService.js
git commit -m "feat: adicionar assiduidade e insights contextuais"
```

### Task 5: Expose the new analytics contract and separate audit API

**Files:**
- Create: `worker/src/domain/auditoria/auditService.js`
- Create: `worker/tests/auditService.test.ts`
- Modify: `worker/src/routes/estatisticaRoutes.js`
- Modify: `worker/src/domain/analytics/analyticsService.js`
- Modify: `worker/openapi.yaml`
- Modify: `worker/tests/routes.test.ts`
- Regenerate: `frontend/src/api-types.ts`

**Interfaces:**
- `getAnalyticsOverview(request, env)` returns the shared `periodo`, `resumo`, `insights`, and short rankings.
- `getAnalyticsDetail(request, env)` accepts `view=engajamento|partituras|assiduidade` and returns the corresponding detail object.
- `getAuditActivities(request, env)` accepts the existing admin filter/pagination parameters and returns `{ usuarios, atividades, total }`.

- [ ] **Step 1: Write failing route contract tests**

Add route tests asserting `GET /api/admin/analytics/overview`, `GET /api/admin/analytics/detail?view=engajamento`, and `GET /api/admin/auditoria` return `periodo`, `resumo`, `insights`, and the requested detail keys. Assert an invalid view returns status 400 and an admin activity filter remains scoped to audit events.

- [ ] **Step 2: Run focused route tests and verify failure**

Run: `npx vitest run worker/tests/routes.test.ts worker/tests/auditService.test.ts`

Expected: FAIL because the new handlers and OpenAPI paths do not exist.

- [ ] **Step 3: Extract audit queries**

Move the current `getAlteracoes` query logic into `auditService.js`, retaining the current allowed audit activity list, admin selector, limit, offset, and total count. Keep `analyticsService.js` free of audit-specific SQL after this step.

- [ ] **Step 4: Compose overview and detail handlers**

Compose the focused services with `parseAnalyticsPeriod`, preserve the legacy dashboard handler as a thin adapter for any remaining consumers, and return explicit empty-state metadata instead of misleading zero classifications.

- [ ] **Step 5: Update routes and OpenAPI**

Register the overview/detail/audit handlers behind `adminMiddleware`. Document query parameters, response fields, projection confidence, insight shape, and error responses in `worker/openapi.yaml`.

- [ ] **Step 6: Regenerate and check frontend API types**

Run: `npm run generate:api --prefix frontend`

Then run: `npm run api:types:check`

Expected: generated types match the OpenAPI contract with no unrelated diff.

- [ ] **Step 7: Run backend route tests and commit**

Run: `npx vitest run worker/tests/routes.test.ts worker/tests/auditService.test.ts`

Expected: PASS.

```bash
git add worker/src/domain/auditoria/auditService.js worker/tests/auditService.test.ts worker/src/routes/estatisticaRoutes.js worker/src/domain/analytics/analyticsService.js worker/openapi.yaml worker/tests/routes.test.ts frontend/src/api-types.ts
git commit -m "feat: expor contrato analitico e separar auditoria"
```

### Task 6: Add typed API clients and analytics presentation primitives

**Files:**
- Modify: `frontend/src/services/api.js:478-530`
- Modify: `frontend/src/services/api-client.ts`
- Create: `frontend/src/screens/admin/analytics/analyticsFormatters.js`
- Create: `frontend/src/screens/admin/analytics/components/AnalyticsPeriodBar.jsx`
- Create: `frontend/src/screens/admin/analytics/components/AnalyticsRanking.jsx`
- Create: `frontend/src/screens/admin/analytics/components/AnalyticsTrend.jsx`
- Create: `frontend/src/screens/admin/analytics/components/InsightCard.jsx`
- Create: `frontend/src/screens/admin/analytics/components/AnalyticsRanking.test.jsx`

**Interfaces:**
- `API.getAnalyticsOverview(queryString)` calls `/api/admin/analytics/overview`.
- `API.getAnalyticsDetail(view, queryString)` calls `/api/admin/analytics/detail?view=...`.
- `API.getAuditActivities(queryString)` calls `/api/admin/auditoria`.
- `AnalyticsPeriodBar` accepts `{ period, onChange, loading }` and emits `{ inicio, fim }`.
- `AnalyticsRanking` accepts `{ items, renderItem, emptyState, limit }` and never invents values for empty data.
- `InsightCard` accepts `{ tipo, titulo, descricao, evidencias, severidade }`.

- [ ] **Step 1: Write formatter and ranking tests**

Assert `formatComparison(-0.06)` renders `-6 p.p.`, `formatProjection` marks estimates, and an empty ranking renders explanatory text instead of `0 de 0`.

- [ ] **Step 2: Run frontend tests and verify failure**

Run: `npm test --prefix frontend -- --runInBand src/screens/admin/analytics/components/AnalyticsRanking.test.jsx`

Expected: FAIL because the new components do not exist.

- [ ] **Step 3: Implement API methods**

Use the existing request/error conventions in `api.js`; keep tracking calls silent. Add typed methods in `api-client.ts` using generated `api-types.ts` operations rather than duplicating response types.

- [ ] **Step 4: Implement presentation primitives**

Build accessible buttons and headings with existing theme variables, use Recharts only for meaningful trends, attach comparison/projection labels to their values, and keep cards safe for narrow viewports.

- [ ] **Step 5: Run tests and commit**

Run: `npm test --prefix frontend -- --runInBand src/screens/admin/analytics/components/AnalyticsRanking.test.jsx`

Expected: PASS.

```bash
git add frontend/src/services/api.js frontend/src/services/api-client.ts frontend/src/screens/admin/analytics
git commit -m "feat: adicionar primitivas e clientes do analytics"
```

### Task 7: Replace the Analytics monolith with the overview and detail views

**Files:**
- Create: `frontend/src/screens/admin/analytics/AnalyticsShell.jsx`
- Create: `frontend/src/screens/admin/analytics/AnalyticsOverview.jsx`
- Create: `frontend/src/screens/admin/analytics/EngagementAnalytics.jsx`
- Create: `frontend/src/screens/admin/analytics/SheetAnalytics.jsx`
- Create: `frontend/src/screens/admin/analytics/AttendanceAnalytics.jsx`
- Create: `frontend/src/screens/admin/analytics/AnalyticsOverview.test.jsx`
- Create: `frontend/src/screens/admin/analytics/EngagementAnalytics.test.jsx`
- Create: `frontend/src/screens/admin/analytics/AttendanceAnalytics.test.jsx`
- Modify: `frontend/src/screens/admin/AdminAnalytics.jsx`

**Interfaces:**
- `AnalyticsShell` owns `view`, `inicio`, `fim`, request cancellation/request IDs, and the common period state.
- `AnalyticsOverview` receives `{ data, onOpenView }`.
- Each detail view receives `{ data, period, onBack }`.

- [ ] **Step 1: Write failing component tests**

Cover these user-visible assertions:

```jsx
expect(screen.getByText('Quem mais interagiu')).toBeInTheDocument();
expect(screen.getByText('18 ações — 9 visualizações, 5 downloads')).toBeInTheDocument();
expect(screen.getByText('Nenhum ensaio realizado no período')).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: 'Ver engajamento completo' }));
expect(await screen.findByRole('heading', { name: 'Engajamento dos músicos' })).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused component tests and verify failure**

Run: `npm test --prefix frontend -- --runInBand src/screens/admin/analytics/AnalyticsOverview.test.jsx src/screens/admin/analytics/EngagementAnalytics.test.jsx src/screens/admin/analytics/AttendanceAnalytics.test.jsx`

Expected: FAIL because the new shell and views do not exist.

- [ ] **Step 3: Implement the shell and URL view state**

Use React Router location/search params for `view`, `inicio`, and `fim`. Loading a detail view must retain the selected period. A failed detail request must leave the overview data intact and expose a local retry.

- [ ] **Step 4: Implement the overview**

Render the three approved answers in order: engagement, sheets, attendance. Show current value, fair comparison, projection when available, evidence/sample size, and insight cards. Remove the old `Alterações` tab from this screen.

- [ ] **Step 5: Implement engagement, sheet, and attendance details**

Use `AnalyticsRanking`, `AnalyticsTrend`, and `InsightCard`. Show raw action composition, equal PDF visualization/download counts, instrument variety, attendance numerator/denominator, and explicit insufficient-data states.

- [ ] **Step 6: Replace the legacy component export**

Make `AdminAnalytics.jsx` a small compatibility export that renders `AnalyticsShell`; remove duplicated inline styles/helpers only after the new tests pass.

- [ ] **Step 7: Run frontend tests and commit**

Run: `npm test --prefix frontend -- --runInBand src/screens/admin/analytics`

Expected: PASS.

```bash
git add frontend/src/screens/admin/AdminAnalytics.jsx frontend/src/screens/admin/analytics
git commit -m "feat: reconstruir a experiencia de analytics"
```

### Task 8: Move administrative history into its own screen

**Files:**
- Create: `frontend/src/screens/admin/auditoria/AdminAudit.jsx`
- Create: `frontend/src/screens/admin/auditoria/AdminAudit.test.jsx`
- Modify: `frontend/src/screens/admin/AdminApp.jsx`
- Modify: `frontend/src/services/api.js`

**Interfaces:**
- `AdminAudit` loads `API.getAuditActivities` with date and admin filters and renders paginated activity history.
- Admin navigation exposes an `Auditoria` item separate from `Analytics`.

- [ ] **Step 1: Write failing screen tests**

Assert that the audit heading, admin filter, empty state, activity row, and “carregar mais” pagination are rendered from mocked API responses.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test --prefix frontend -- --runInBand src/screens/admin/auditoria/AdminAudit.test.jsx`

Expected: FAIL because the screen and navigation item do not exist.

- [ ] **Step 3: Implement the audit screen**

Reuse the current activity formatting utilities but keep audit filters and pagination local to the screen. Do not import analytics metric services or rankings.

- [ ] **Step 4: Register the screen in AdminApp**

Add the `auditoria` menu item and render branch, preserving direct `/admin/auditoria` navigation.

- [ ] **Step 5: Run the test and commit**

Run: `npm test --prefix frontend -- --runInBand src/screens/admin/auditoria/AdminAudit.test.jsx`

Expected: PASS.

```bash
git add frontend/src/screens/admin/AdminApp.jsx frontend/src/screens/admin/auditoria frontend/src/services/api.js
git commit -m "feat: separar tela de auditoria administrativa"
```

### Task 9: Verify integration, responsive behavior, and contract health

**Files:**
- Modify: `worker/tests/routes.test.ts`
- Modify: `frontend/src/screens/admin/analytics/AnalyticsOverview.test.jsx`
- Modify: `docs/TESTING-STRATEGY.md`

- [ ] **Step 1: Run the complete backend suite**

Run: `npx vitest run worker`

Expected: PASS with no regression in authentication, tracking, repertoire, or route tests.

- [ ] **Step 2: Run the complete frontend suite**

Run: `npm test --prefix frontend -- --runInBand`

Expected: PASS.

- [ ] **Step 3: Verify lint and generated contracts**

Run: `npm run lint:worker && npm run api:contract:check && npm run api:types:check`

Expected: all commands exit 0 with no generated-file drift.

- [ ] **Step 4: Run the local app and exercise the acceptance flow**

Run: `npm run dev`, open `/admin/analytics`, and verify with the local `admin/1234` account:

1. default current-month comparison is visible;
2. overview links open all three detail views;
3. period changes are preserved across views;
4. no admin or guest appears in musician rankings;
5. no-ensayo state does not say “presença baixa”;
6. mobile viewport keeps bottom navigation below content;
7. `/admin/auditoria` contains the former activity history.

- [ ] **Step 5: Commit final integration fixes**

```bash
git add worker frontend docs/TESTING-STRATEGY.md
git commit -m "test: validar fluxo completo do analytics"
```

## Self-review checklist

- [x] Every approved metric has a backend task, frontend task, and test coverage.
- [x] Current-month comparison, equal-length custom comparison, projection gating, and sample-size messaging are explicit.
- [x] Administrators and guests are excluded in both engagement and attendance tasks.
- [x] PDF visualization and download equality is represented in both query and UI tasks.
- [x] Repertoire exploration is instrumented before it is used in ranking.
- [x] Audit extraction is a separate task and route, not a hidden Analytics tab.
- [x] Mobile overlap, partial failures, empty states, and generated API types have verification steps.
- [x] No `TODO`, `TBD`, or unspecified implementation step remains.
