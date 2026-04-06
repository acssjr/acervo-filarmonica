# Analytics Tracking Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clear admin analytics system that tracks real archive usage, separates PDF views from downloads, supports person/session drill-downs, and moves rehearsal attendance into a monthly, understandable Ensaios tab.

**Architecture:** Use D1 as the source of truth for first-party tracking, with new session/event tables and small indexed rows. The Worker exposes focused tracking and dashboard endpoints; the React frontend records events from real user interactions and renders analytics by admin question: Uso do acervo, Pessoas, Ensaios, Alterações.

**Tech Stack:** Cloudflare Workers, D1 SQL migrations, React/Vite frontend, existing `API` service, existing admin screen patterns, Vitest for Worker integration tests, Jest/ESLint for frontend checks.

---

## Scope And File Map

**Create:**
- `database/migrations/011_tracking_sessions_events.sql`: D1 schema for tracking sessions/events and indexes.
- `worker/src/domain/analytics/eventSanitizer.js`: normalize/mask search terms and small tracking payload helpers.
- `worker/src/domain/analytics/sessionService.js`: session lifecycle and expiration logic.
- `worker/src/domain/analytics/eventService.js`: event insert helpers and query helpers.
- `worker/tests/trackingService.test.ts`: unit tests for sanitizer/session/event helpers.

**Modify:**
- `worker/src/domain/analytics/analyticsService.js`: dashboard queries for Uso do acervo, Pessoas, Ensaios, Alterações.
- `worker/src/domain/analytics/trackingService.js`: adapt existing search tracking if it overlaps.
- `worker/src/routes/estatisticaRoutes.js` or `worker/src/routes/atividadeRoutes.js`: add tracking routes following existing organization.
- `worker/src/domain/auth/loginService.js`: start/end sessions on login/logout where supported.
- `worker/src/domain/partituras/downloadService.js`: separate view and download events.
- `worker/src/domain/favoritos/favoritoService.js`: emit favorite events.
- `frontend/src/services/api.js`: add tracking client calls.
- `frontend/src/hooks/useSheetDownload.js`: send real download/view context.
- `frontend/src/components/modals/SheetDetailModal.jsx`: emit partitura opened and PDF view events.
- `frontend/src/screens/SearchScreen.jsx` and shared search components/hooks: emit search typing/performed events.
- `frontend/src/screens/admin/AdminAnalytics.jsx`: reorganize UI into Uso do acervo, Pessoas, Ensaios, Alterações.
- `frontend/src/utils/formatters.js`: human event labels and visible accent fixes.

**Do not modify unless required by tests:**
- `frontend-next/*`: current screenshots/dev server use `frontend`, not `frontend-next`.
- PostHog code paths: keep them non-blocking and do not depend on them.

---

## Task 1: Add Tracking Schema

**Files:**
- Create: `database/migrations/011_tracking_sessions_events.sql`
- Modify: `worker/tests/setup.ts`
- Test: `worker/tests/routes.test.ts`

- [ ] **Step 1: Create the migration**

Create `database/migrations/011_tracking_sessions_events.sql`:

```sql
CREATE TABLE IF NOT EXISTS tracking_sessions (
  id TEXT PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  inicio_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  fim_em DATETIME,
  fim_motivo TEXT,
  ultimo_evento_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_tracking_sessions_usuario_inicio
  ON tracking_sessions(usuario_id, inicio_em DESC);

CREATE INDEX IF NOT EXISTS idx_tracking_sessions_ultimo_evento
  ON tracking_sessions(ultimo_evento_em DESC);

CREATE TABLE IF NOT EXISTS tracking_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  usuario_id INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  origem TEXT,
  partitura_id INTEGER,
  parte_id INTEGER,
  repertorio_id INTEGER,
  termo_original TEXT,
  termo_normalizado TEXT,
  resultados_count INTEGER,
  metadata_json TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES tracking_sessions(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (partitura_id) REFERENCES partituras(id),
  FOREIGN KEY (parte_id) REFERENCES partes(id),
  FOREIGN KEY (repertorio_id) REFERENCES repertorios(id)
);

CREATE INDEX IF NOT EXISTS idx_tracking_events_criado
  ON tracking_events(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_usuario_criado
  ON tracking_events(usuario_id, criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_session
  ON tracking_events(session_id, criado_em ASC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_tipo_criado
  ON tracking_events(tipo, criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_partitura_criado
  ON tracking_events(partitura_id, criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_parte_criado
  ON tracking_events(parte_id, criado_em DESC);
```

- [ ] **Step 2: Add test setup schema**

Add matching table/index statements to `worker/tests/setup.ts` inside `STATEMENTS`. Use the same columns as the migration so Worker route tests can run against the in-memory D1 database.

- [ ] **Step 3: Run tests**

Run:

```bash
npm test -- worker/tests/routes.test.ts
```

Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add database/migrations/011_tracking_sessions_events.sql worker/tests/setup.ts
git commit -m "feat: add tracking schema"
```

---

## Task 2: Implement Sanitizer, Event, And Session Helpers

**Files:**
- Create: `worker/src/domain/analytics/eventSanitizer.js`
- Create: `worker/src/domain/analytics/eventService.js`
- Create: `worker/src/domain/analytics/sessionService.js`
- Test: `worker/tests/trackingService.test.ts`

- [ ] **Step 1: Write failing tests**

Create `worker/tests/trackingService.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { maskSensitiveSearchTerm, normalizeSearchTerm } from '../src/domain/analytics/eventSanitizer.js';
import { buildTrackingEventPayload } from '../src/domain/analytics/eventService.js';
import { SESSION_IDLE_MINUTES, createSessionId, getSessionExpiryDate } from '../src/domain/analytics/sessionService.js';

describe('tracking search sanitizer', () => {
  it('normaliza termo mantendo base de agrupamento sem acento e caixa', () => {
    expect(normalizeSearchTerm('  Verde X Branco  ')).toBe('verde x branco');
    expect(normalizeSearchTerm('Coração')).toBe('coracao');
  });

  it('mascara email, telefone, cpf e pin numerico curto', () => {
    expect(maskSensitiveSearchTerm('pessoa@example.com')).toBe('[termo ocultado]');
    expect(maskSensitiveSearchTerm('(84) 99999-9999')).toBe('[termo ocultado]');
    expect(maskSensitiveSearchTerm('123.456.789-10')).toBe('[termo ocultado]');
    expect(maskSensitiveSearchTerm('1234')).toBe('[termo ocultado]');
  });

  it('mantem termo musical normal', () => {
    expect(maskSensitiveSearchTerm('Verde X Branco')).toBe('Verde X Branco');
  });
});

describe('buildTrackingEventPayload', () => {
  it('normaliza e mascara busca sensivel', () => {
    const payload = buildTrackingEventPayload({
      tipo: 'busca_realizada',
      termo_original: '1234',
      resultados_count: 0,
    });

    expect(payload.termo_original).toBe('[termo ocultado]');
    expect(payload.termo_normalizado).toBe('[termo ocultado]');
    expect(payload.resultados_count).toBe(0);
  });

  it('mantem metadata pequena e serializada', () => {
    const payload = buildTrackingEventPayload({
      tipo: 'download_parte',
      metadata: { instrumento: 'Trompete Bb 1' },
    });

    expect(payload.metadata_json).toBe(JSON.stringify({ instrumento: 'Trompete Bb 1' }));
  });
});

describe('tracking session helpers', () => {
  it('usa timeout de 30 minutos', () => {
    expect(SESSION_IDLE_MINUTES).toBe(30);
  });

  it('gera ids de sessao com prefixo legivel', () => {
    expect(createSessionId(7)).toMatch(/^sess_7_/);
  });

  it('calcula expiracao por inatividade', () => {
    const base = new Date('2026-04-06T12:00:00.000Z');
    expect(getSessionExpiryDate(base).toISOString()).toBe('2026-04-06T12:30:00.000Z');
  });
});
```

Run:

```bash
npm test -- worker/tests/trackingService.test.ts
```

Expected: fail because the new files do not exist.

- [ ] **Step 2: Implement sanitizer**

Create `worker/src/domain/analytics/eventSanitizer.js`:

```js
export function normalizeSearchTerm(term) {
  if (!term || typeof term !== 'string') return '';
  return term.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
}

export function isSensitiveSearchTerm(term) {
  if (!term || typeof term !== 'string') return false;
  const value = term.trim();
  if (!value) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    || /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(value)
    || /^(\+?55\s?)?(\(?\d{2}\)?\s?)?9?\d{4}-?\d{4}$/.test(value)
    || /^\d{4,6}$/.test(value);
}

export function maskSensitiveSearchTerm(term) {
  return isSensitiveSearchTerm(term) ? '[termo ocultado]' : term;
}
```

- [ ] **Step 3: Implement session service**

Create `worker/src/domain/analytics/sessionService.js`:

```js
export const SESSION_IDLE_MINUTES = 30;

export function createSessionId(userId) {
  const random = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  return `sess_${userId}_${random}`;
}

export function getSessionExpiryDate(baseDate = new Date()) {
  return new Date(baseDate.getTime() + SESSION_IDLE_MINUTES * 60 * 1000);
}

export async function startTrackingSession(env, user) {
  const sessionId = createSessionId(user.id);
  await env.DB.prepare(`
    INSERT INTO tracking_sessions (id, usuario_id, inicio_em, ultimo_evento_em)
    VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(sessionId, user.id).run();
  return sessionId;
}

export async function touchTrackingSession(env, sessionId) {
  if (!sessionId) return;
  await env.DB.prepare(`
    UPDATE tracking_sessions SET ultimo_evento_em = CURRENT_TIMESTAMP
    WHERE id = ? AND fim_em IS NULL
  `).bind(sessionId).run();
}

export async function endTrackingSession(env, sessionId, reason = 'logout') {
  if (!sessionId) return;
  await env.DB.prepare(`
    UPDATE tracking_sessions SET fim_em = CURRENT_TIMESTAMP, fim_motivo = ?
    WHERE id = ? AND fim_em IS NULL
  `).bind(reason, sessionId).run();
}
```

- [ ] **Step 4: Implement event service**

Create `worker/src/domain/analytics/eventService.js`:

```js
import { errorResponse, jsonResponse } from '../../infrastructure/index.js';
import { maskSensitiveSearchTerm, normalizeSearchTerm } from './eventSanitizer.js';
import { touchTrackingSession } from './sessionService.js';

const ALLOWED_EVENT_TYPES = new Set([
  'partitura_aberta',
  'pdf_visualizado_grade',
  'pdf_visualizado_parte',
  'download_grade',
  'download_parte',
  'busca_digitada',
  'busca_realizada',
  'favorito_adicionado',
  'favorito_removido',
  'sessao_iniciada',
  'sessao_encerrada',
]);

export function buildTrackingEventPayload(input) {
  if (!ALLOWED_EVENT_TYPES.has(input?.tipo)) throw new Error('Tipo de evento invalido');

  const rawTerm = typeof input.termo_original === 'string' ? input.termo_original : null;
  const maskedTerm = rawTerm ? maskSensitiveSearchTerm(rawTerm) : null;
  const normalized = maskedTerm
    ? (maskedTerm === '[termo ocultado]' ? maskedTerm : normalizeSearchTerm(maskedTerm))
    : null;

  return {
    tipo: input.tipo,
    origem: input.origem || null,
    partitura_id: input.partitura_id || null,
    parte_id: input.parte_id || null,
    repertorio_id: input.repertorio_id || null,
    termo_original: maskedTerm,
    termo_normalizado: normalized,
    resultados_count: Number.isFinite(input.resultados_count) ? input.resultados_count : null,
    metadata_json: input.metadata ? JSON.stringify(input.metadata).slice(0, 2000) : null,
  };
}

export async function registrarTrackingEvent(env, user, sessionId, input) {
  const payload = buildTrackingEventPayload(input);
  await env.DB.prepare(`
    INSERT INTO tracking_events (
      session_id, usuario_id, tipo, origem, partitura_id, parte_id, repertorio_id,
      termo_original, termo_normalizado, resultados_count, metadata_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    sessionId || null,
    user.id,
    payload.tipo,
    payload.origem,
    payload.partitura_id,
    payload.parte_id,
    payload.repertorio_id,
    payload.termo_original,
    payload.termo_normalizado,
    payload.resultados_count,
    payload.metadata_json
  ).run();

  await touchTrackingSession(env, sessionId);
}

export async function handleTrackingEvent(request, env, user) {
  try {
    const body = await request.json();
    const sessionId = request.headers.get('X-Tracking-Session') || body.session_id || null;
    await registrarTrackingEvent(env, user, sessionId, body);
    return jsonResponse({ success: true }, 200, request);
  } catch (error) {
    return errorResponse(error.message || 'Erro ao registrar evento', 400, request);
  }
}
```

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm test -- worker/tests/trackingService.test.ts
```

Expected: pass.

Commit:

```bash
git add worker/src/domain/analytics/eventSanitizer.js worker/src/domain/analytics/eventService.js worker/src/domain/analytics/sessionService.js worker/tests/trackingService.test.ts
git commit -m "feat: add tracking event helpers"
```

---

## Task 3: Add Tracking Route

**Files:**
- Modify: `worker/src/routes/estatisticaRoutes.js` or `worker/src/routes/atividadeRoutes.js`
- Modify: `worker/src/domain/analytics/eventService.js`
- Test: `worker/tests/routes.test.ts`

- [ ] **Step 1: Write failing route tests**

Append to `worker/tests/routes.test.ts`:

```ts
describe('Tracking events', () => {
  let userToken: string;

  beforeAll(async () => {
    userToken = await createTestToken(2, false);
  });

  it('rejeita evento sem autenticacao', async () => {
    const response = await SELF.fetch('https://test.local/api/tracking/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'partitura_aberta' }),
    });

    expect(response.status).toBe(401);
  });

  it('registra evento autenticado', async () => {
    const response = await SELF.fetch('https://test.local/api/tracking/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        tipo: 'partitura_aberta',
        origem: 'acervo',
        partitura_id: 1,
      }),
    });

    expect(response.status).toBe(200);
    const body = await response.json() as { success: boolean };
    expect(body.success).toBe(true);
  });
});
```

Run:

```bash
npm test -- worker/tests/routes.test.ts
```

Expected: fail with 404 before route registration.

- [ ] **Step 2: Register the route**

In the chosen route file, import:

```js
import { handleTrackingEvent } from '../domain/analytics/eventService.js';
import { authMiddleware } from '../middleware/index.js';
```

Register:

```js
router.post('/api/tracking/events', async (request, env, params, context) => {
  return handleTrackingEvent(request, env, context.user);
}, [authMiddleware]);
```

- [ ] **Step 3: Run tests and commit**

Run:

```bash
npm test -- worker/tests/routes.test.ts
npm run lint:worker
```

Expected: pass.

Commit:

```bash
git add worker/src/domain/analytics/eventService.js worker/src/routes worker/tests/routes.test.ts
git commit -m "feat: add tracking event endpoint"
```

---

## Task 4: Track PDF Views Separately From Downloads

**Files:**
- Modify: `frontend/src/services/api.js`
- Modify: `frontend/src/components/modals/SheetDetailModal.jsx`
- Modify: `frontend/src/hooks/useSheetDownload.js`
- Modify: `worker/src/domain/partituras/downloadService.js`
- Test: frontend lint and Worker route tests.

- [ ] **Step 1: Add frontend tracking client**

In `frontend/src/services/api.js`, near `trackSearch`, add:

```js
async trackEvent(event) {
  try {
    return await this.request('/api/tracking/events', {
      method: 'POST',
      body: JSON.stringify(event)
    });
  } catch {
    return null;
  }
},
```

Tracking must not block user actions.

- [ ] **Step 2: Track partitura opened**

In `frontend/src/components/modals/SheetDetailModal.jsx`, import `API` if needed and add:

```jsx
useEffect(() => {
  if (!selectedSheet?.id) return;
  API.trackEvent({
    tipo: 'partitura_aberta',
    origem: 'detalhe_partitura',
    partitura_id: selectedSheet.id,
  });
}, [selectedSheet?.id]);
```

This event means the modal/detail page opened successfully, not just a raw card click.

- [ ] **Step 3: Track PDF view from the eye action**

In the explicit eye/PDF-renderer action, call:

```js
API.trackEvent({
  tipo: parte?.id ? 'pdf_visualizado_parte' : 'pdf_visualizado_grade',
  origem: 'detalhe_partitura',
  partitura_id: selectedSheet.id,
  parte_id: parte?.id || null,
  metadata: parte?.instrumento ? { instrumento: parte.instrumento } : null,
});
```

Do not call this for a download button.

- [ ] **Step 4: Track real downloads**

In `frontend/src/hooks/useSheetDownload.js`, after the real download path starts, call:

```js
API.trackEvent({
  tipo: parteId ? 'download_parte' : 'download_grade',
  origem: downloadOrigin || 'detalhe_partitura',
  partitura_id: selectedSheet.id,
  parte_id: parteId || null,
  metadata: instrumento ? { instrumento } : null,
});
```

If the hook does not currently know `downloadOrigin`, add an optional argument defaulting to `detalhe_partitura`.

- [ ] **Step 5: Keep backend counters correct**

In `worker/src/domain/partituras/downloadService.js`, keep current counters for real download routes. Ensure any `action=view` path does not increment download counters and does not register the same event as `download`.

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm run lint --prefix frontend
npm test -- worker/tests/routes.test.ts
```

Expected: pass.

Commit:

```bash
git add frontend/src/services/api.js frontend/src/components/modals/SheetDetailModal.jsx frontend/src/hooks/useSheetDownload.js worker/src/domain/partituras/downloadService.js
git commit -m "feat: track pdf views separately from downloads"
```

---

## Task 5: Track Search Journey

**Files:**
- Modify: `frontend/src/screens/SearchScreen.jsx`
- Modify: shared search components/hooks if `rg` shows the search state lives elsewhere.
- Modify: `frontend/src/services/api.js`
- Test: frontend lint.

- [ ] **Step 1: Locate search owner**

Run:

```bash
rg -n "trackSearch|setSearch|busca|SearchScreen|SearchBar" frontend/src
```

Expected: identify the component/hook that owns the search term and result count.

- [ ] **Step 2: Track typed sequence**

In the search state owner, add a debounced effect:

```jsx
useEffect(() => {
  if (!searchTerm?.trim()) return;

  const timer = window.setTimeout(() => {
    API.trackEvent({
      tipo: 'busca_digitada',
      origem: 'busca',
      termo_original: searchTerm,
      resultados_count: results?.length ?? null,
    });
  }, 350);

  return () => window.clearTimeout(timer);
}, [searchTerm, results?.length]);
```

- [ ] **Step 3: Track stable/performed search**

Where the existing code calls `API.trackSearch(termo, resultadosCount)`, keep it for compatibility and add:

```js
API.trackEvent({
  tipo: 'busca_realizada',
  origem: 'busca',
  termo_original: termo,
  resultados_count: resultadosCount,
});
```

- [ ] **Step 4: Verify and commit**

Run:

```bash
npm run lint --prefix frontend
```

Expected: pass.

Commit:

```bash
git add frontend/src/screens/SearchScreen.jsx frontend/src/services/api.js
git commit -m "feat: track archive search journey"
```

---

## Task 6: Build Dashboard API Sections

**Files:**
- Modify: `worker/src/domain/analytics/analyticsService.js`
- Test: `worker/tests/routes.test.ts`

- [ ] **Step 1: Write failing dashboard shape test**

Append to `worker/tests/routes.test.ts`:

```ts
describe('Admin analytics dashboard shape', () => {
  let adminToken: string;

  beforeAll(async () => {
    adminToken = await createTestToken(1, true);
  });

  it('retorna secoes para uso do acervo, pessoas, ensaios e alteracoes', async () => {
    const response = await SELF.fetch('https://test.local/api/admin/analytics/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json() as Record<string, unknown>;
    expect(data).toHaveProperty('uso_acervo');
    expect(data).toHaveProperty('pessoas');
    expect(data).toHaveProperty('ensaios');
    expect(data).toHaveProperty('alteracoes');
  });
});
```

Expected: fail until the response includes the new sections.

- [ ] **Step 2: Add period parsing**

In `worker/src/domain/analytics/analyticsService.js`, add:

```js
function getPeriod(url) {
  const now = new Date();
  const startDefault = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const endDefault = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const start = url.searchParams.get('inicio') || startDefault.toISOString().slice(0, 10);
  const end = url.searchParams.get('fim') || endDefault.toISOString().slice(0, 10);
  return { start, end };
}
```

Use `criado_em >= ? AND criado_em < ?` on tracking event queries.

- [ ] **Step 3: Add `uso_acervo` queries**

Return this shape:

```js
const usoAcervo = {
  resumo: {
    partituras_abertas,
    pdfs_visualizados,
    downloads_reais,
    buscas_sem_resultado,
    conversao_visualizacao,
    conversao_download,
  },
  funil,
  top_partituras,
  top_partes,
  insights,
};
```

Count `pdf_visualizado_grade` and `pdf_visualizado_parte` as PDF views. Count `download_grade` and `download_parte` as real downloads.

- [ ] **Step 4: Add `pessoas` queries**

Return this shape:

```js
const pessoas = {
  usuarios,
  resumo_usuario: selectedUserId ? selectedSummary : null,
  timeline: selectedUserId ? selectedTimeline : [],
  total_timeline,
};
```

Use query params:

```text
usuario_id
timeline_limit
timeline_offset
```

Always filter by period.

- [ ] **Step 5: Add `ensaios` queries**

Return this shape:

```js
const ensaios = {
  mes,
  resumo,
  streaks,
  assiduidade_musicos,
  presenca_naipes,
};
```

Rules:

- `usuarios.admin = 0`
- only Madeiras, Metais, Percussão
- denominator uses only distinct `presencas.data_ensaio` inside the selected month
- no rehearsals returns `empty_state: 'Nenhum ensaio registrado neste mês'`
- streak counts physical presence only; any absence breaks it

- [ ] **Step 6: Add `alteracoes` compatibility**

Use the current `atividades` table until all admin mutations are migrated to `tracking_events`:

```js
const alteracoes = {
  usuarios,
  atividades,
  total,
};
```

Include `tipo`, `titulo`, `detalhes`, `usuario_nome`, and `criado_em`.

- [ ] **Step 7: Preserve legacy keys temporarily**

Keep `atividade_recente`, `instrumentos_dist`, and `presencas_familia` for one deploy cycle so older/newer frontend and backend versions do not break each other during rollout.

- [ ] **Step 8: Verify and commit**

Run:

```bash
npm test -- worker/tests/routes.test.ts
npm run lint:worker
```

Expected: pass.

Commit:

```bash
git add worker/src/domain/analytics/analyticsService.js worker/tests/routes.test.ts
git commit -m "feat: add analytics dashboard sections"
```

---

## Task 7: Rebuild Admin Analytics UI Around Questions

**Files:**
- Modify: `frontend/src/screens/admin/AdminAnalytics.jsx`
- Modify: `frontend/src/utils/formatters.js`
- Test: frontend lint.

- [ ] **Step 1: Rename tab model**

In `AdminAnalytics.jsx`, use:

```js
const [activeTab, setActiveTab] = useState('acervo');

const tabs = [
  { id: 'acervo', icon: Music, label: 'Uso do acervo' },
  { id: 'pessoas', icon: Users, label: 'Pessoas' },
  { id: 'ensaios', icon: UserCheck, label: 'Ensaios' },
  { id: 'alteracoes', icon: Activity, label: 'Alterações' },
];
```

- [ ] **Step 2: Add period controls**

Default to current month:

```js
const now = new Date();
const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
const monthEnd = nextMonth.toISOString().slice(0, 10);
const [periodStart, setPeriodStart] = useState(monthStart);
const [periodEnd, setPeriodEnd] = useState(monthEnd);
```

Render date inputs styled like existing dark form fields with `borderRadius: '8px'`, `var(--border)`, and `var(--bg-primary)`.

- [ ] **Step 3: Build Uso do acervo tab**

Render cards from `data.uso_acervo.resumo`:

```jsx
<KpiCard icon={Music} label="Partituras abertas" value={data.uso_acervo?.resumo?.partituras_abertas || 0} color={COLORS.gold} isMobile={isMobile} />
<KpiCard icon={Eye} label="PDFs visualizados" value={data.uso_acervo?.resumo?.pdfs_visualizados || 0} color={COLORS.blue} isMobile={isMobile} />
<KpiCard icon={Download} label="Downloads reais" value={data.uso_acervo?.resumo?.downloads_reais || 0} color={COLORS.green} isMobile={isMobile} />
```

Use simple horizontal bars for:

```text
Abriu partitura -> Visualizou PDF -> Baixou arquivo
```

Do not use donut charts for this funnel.

- [ ] **Step 4: Build Pessoas tab**

Render person filter:

```jsx
<select value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}>
  <option value="">Selecione uma pessoa</option>
  {data.pessoas?.usuarios?.map((user) => (
    <option key={user.id} value={user.id}>{user.nome}</option>
  ))}
</select>
```

When selected, show summary first and a paginated session timeline second.

- [ ] **Step 5: Build Ensaios tab**

Render:

```text
Presença média do mês
Maior streak ativo
Músicos com presença perfeita
Ensaios registrados
```

For family attendance:

```jsx
<details>
  <summary>{familia}: {registradas} presenças registradas de {esperadas} esperadas</summary>
  <p>{musicos} músicos ativos × {ensaios} ensaios registrados = {esperadas} presenças esperadas</p>
</details>
```

Never render “Outros”. If the API returns an unexpected family, show:

```text
Dados de naipe inconsistentes encontrados. Verifique o cadastro de instrumentos.
```

- [ ] **Step 6: Build Alterações tab**

Move the current recent activity feed here and keep filters by person/admin and period. Human labels:

```text
Partitura atualizada
Parte adicionada
Parte atualizada
Parte removida
Adicionado ao repertório
```

- [ ] **Step 7: Fix visible accents touched by this screen**

Replace visible strings:

```text
Musicos -> Músicos
presenca -> presença
mes -> mês
Alteracoes -> Alterações
Conversao -> Conversão
Atualizacao -> Atualização
```

Do not rename variables or comments only for accents.

- [ ] **Step 8: Verify and commit**

Run:

```bash
npm run lint --prefix frontend
```

Expected: pass.

Commit:

```bash
git add frontend/src/screens/admin/AdminAnalytics.jsx frontend/src/utils/formatters.js
git commit -m "feat: redesign admin analytics tabs"
```

---

## Task 8: Expand Admin Audit Detail

**Files:**
- Modify: `worker/src/domain/partituras/partituraService.js`
- Modify: `worker/src/domain/partituras/parteService.js`
- Modify: `worker/src/routes/partituraRoutes.js`
- Modify: `frontend/src/utils/formatters.js`
- Test: `worker/tests/routes.test.ts`, Worker lint, frontend lint.

- [ ] **Step 1: Add update diff assertion**

In `worker/tests/routes.test.ts`, after the existing successful `PUT /api/partituras/:id` update test, assert:

```ts
const atividade = await env.DB.prepare(`
  SELECT tipo, titulo, detalhes, usuario_id
  FROM atividades
  WHERE tipo = 'update_partitura' AND titulo = 'Partitura Renomeada'
  ORDER BY id DESC
  LIMIT 1
`).first() as { tipo: string; detalhes: string; usuario_id: number } | null;

expect(atividade).not.toBeNull();
expect(atividade?.detalhes).toContain('Titulo:');
expect(atividade?.detalhes).toContain('Compositor:');
expect(atividade?.usuario_id).toBe(1);
```

- [ ] **Step 2: Implement partitura diff helper**

In `worker/src/domain/partituras/partituraService.js`, add:

```js
const normalizeTextValue = (value) => {
  if (value === undefined || value === null || value === '') return null;
  return String(value).trim();
};

const normalizeNumberValue = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

function addChange(changes, label, before, after) {
  if (String(before ?? '') === String(after ?? '')) return;
  changes.push(`${label}: "${before || 'vazio'}" -> "${after || 'vazio'}"`);
}
```

Use it in `updatePartitura` after loading the existing row and before writing the update.

- [ ] **Step 3: Track part changes**

Change signatures in `worker/src/domain/partituras/parteService.js`:

```js
substituirParte(parteId, request, env, admin)
renomearParte(parteId, request, env, admin)
deleteParte(parteId, request, env, admin)
```

Fetch `partitura_titulo` by joining `partes` to `partituras`, then register:

```js
await registrarAtividade(env, 'update_parte', parte.partitura_titulo, `Instrumento renomeado: "${parte.instrumento}" -> "${instrumento.trim()}"`, admin?.id ?? null);
await registrarAtividade(env, 'delete_parte', parte.partitura_titulo, `Parte removida: ${parte.instrumento}`, admin?.id ?? null);
```

- [ ] **Step 4: Pass admin context from routes**

In `worker/src/routes/partituraRoutes.js`:

```js
return substituirParte(id, req, env, context.user);
return renomearParte(id, req, env, context.user);
return deleteParte(id, req, env, context.user);
```

- [ ] **Step 5: Fix formatter labels**

In `frontend/src/utils/formatters.js`, add:

```js
update_partitura: { action: 'Partitura atualizada', color: '#5B8DEF' },
delete_partitura: { action: 'Partitura removida', color: '#E74C3C' },
nova_parte: { action: 'Parte adicionada', color: '#43B97F' },
update_parte: { action: 'Parte atualizada', color: '#5B8DEF' },
delete_parte: { action: 'Parte removida', color: '#E74C3C' },
```

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm test -- worker/tests/routes.test.ts
npm run lint:worker
npm run lint --prefix frontend
```

Expected: pass.

Commit:

```bash
git add worker/src/domain/partituras/partituraService.js worker/src/domain/partituras/parteService.js worker/src/routes/partituraRoutes.js frontend/src/utils/formatters.js worker/tests/routes.test.ts
git commit -m "feat: detail admin audit events"
```

---

## Task 9: Full Verification And Rollout Safety

**Files:**
- Modify only files needed to fix verification failures.

- [ ] **Step 1: Run full Worker tests**

Run:

```bash
npm test
```

Expected: pass. If Miniflare logs Windows temp cleanup warnings after a successful run, note them but do not treat them as failures.

- [ ] **Step 2: Run frontend lint**

Run:

```bash
npm run lint --prefix frontend
```

Expected: pass.

- [ ] **Step 3: Build frontend**

Run:

```bash
npm run build --prefix frontend
```

Expected: Vite build succeeds.

- [ ] **Step 4: Manual smoke test locally**

Run:

```bash
npm run dev --prefix frontend
```

Check:

- Analytics tabs render.
- Uso do acervo empty states are understandable.
- Pessoas filter does not load all timelines at once.
- Ensaios does not show “Outros”.
- Alterações does not show `update_partitura`.
- PDF view and real download create different events.

- [ ] **Step 5: Manual smoke test against production API only after backend deploy**

Run:

```bash
npm run dev:prod --prefix frontend
```

Check:

- Existing production data does not break the new UI.
- Legacy data shows useful fallbacks.
- New tracking events appear after actions.

- [ ] **Step 6: Handle verification failures**

If a verification command fails, stop executing the rollout task and write down the failing command plus the exact error. Create a new focused fix task before editing files, because the files to change depend on the failure.

If no fixes are required, do not create an empty commit.

---

## Self-Review

- Spec coverage:
  - D1 as source of truth: Tasks 1-3 and 6.
  - Session tracking and 30-minute inactivity: Task 2.
  - PDF view vs download: Task 4.
  - Search sequence with original and normalized terms: Tasks 2 and 5.
  - Person drill-down and sessions: Tasks 6 and 7.
  - Monthly rehearsal metrics, maestro excluded, no “Outros”, streak positive: Tasks 6 and 7.
  - Admin audit labels and details: Task 8.
  - Accent fixes for visible text: Task 7.
  - Query performance and pagination: Tasks 1, 6, 7, and 9.

- Completion-marker scan:
  - No incomplete markers are present.
  - Each task includes concrete files, commands, and expected outcomes.

- Type consistency:
  - Event names match the approved spec.
  - Dashboard section names are `uso_acervo`, `pessoas`, `ensaios`, and `alteracoes`.
  - Frontend labels are human-facing Portuguese while event names remain technical internally.
