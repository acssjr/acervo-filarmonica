# Analytics Rollback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restaurar o analytics admin para a estrutura anterior ao redesign, mantendo filtro de período funcional e feed de atividade recente com detalhes administrativos expansíveis.

**Architecture:** O backend volta a expor o payload legado como contrato principal, aplicando `inicio` e `fim` em todas as consultas usadas pela tela antiga e filtrando `atividade_recente` para eventos administrativos auditáveis. O frontend volta para a composição visual anterior do analytics, adiciona os campos de período ao carregamento e reaproveita o detalhamento atual apenas no feed de atividade recente, com expansão inline e paginação.

**Tech Stack:** Cloudflare Workers + D1 + Vitest no worker; React + Vite + Jest Testing Library no frontend.

---

## File Map

- Modify: `worker/src/domain/analytics/analyticsService.js`
  Responsabilidade: voltar o endpoint para o shape legado, aplicar período nas queries antigas e serializar `atividade_recente` com itens administrativos detalhados.

- Modify: `worker/tests/routes.test.ts`
  Responsabilidade: travar o contrato do endpoint restaurado, cobrindo período e paginação das atividades administrativas.

- Modify: `frontend/src/screens/admin/AdminAnalytics.jsx`
  Responsabilidade: restaurar a UI antiga do analytics, enviar `inicio` e `fim`, manter "Carregar mais" e permitir expandir detalhes de atividades.

- Create: `frontend/src/screens/admin/AdminAnalytics.test.jsx`
  Responsabilidade: cobrir a tela restaurada, o query string de período e a expansão de detalhes no feed de atividade.

- No change expected: `frontend/src/services/api.js`
  Observação: `API.getAnalyticsDashboard(queryString = '')` já aceita query string e pode ser reaproveitado sem alteração.

## Task 1: Lock the worker contract with failing tests

**Files:**
- Modify: `worker/tests/routes.test.ts`
- Test: `worker/tests/routes.test.ts`

- [ ] **Step 1: Write a failing test for the restored legacy payload with audit-only recent activity**

Add this block inside `describe('GET /api/admin/analytics/dashboard', () => { ... })`:

```ts
    it('retorna o payload legado com atividade_recente administrativa detalhada no período', async () => {
      await env.DB.prepare(`
        INSERT INTO atividades (tipo, titulo, detalhes, usuario_id, criado_em)
        VALUES
          ('download', 'Download comum', 'Trompete Bb', 2, '2099-04-10 09:00:00'),
          ('update_partitura', 'Partitura atualizada', 'titulo: "Antigo" -> "Novo"', 1, '2099-04-10 10:00:00'),
          ('update_repertorio', 'Repertorio atualizado', 'ordem: "1" -> "2"', 1, '2099-04-11 11:00:00')
      `).run();

      const response = await SELF.fetch('https://test.local/api/admin/analytics/dashboard?inicio=2099-04-01&fim=2099-05-01', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(response.status).toBe(200);
      const data = await response.json() as {
        resumo: Record<string, unknown>;
        downloads_timeline: Array<unknown>;
        atividade_recente: Array<{ tipo: string; usuario_nome?: string; detalhes?: string }>;
        total_atividades: number;
      };

      expect(data).toHaveProperty('resumo');
      expect(data).toHaveProperty('downloads_timeline');
      expect(data).toHaveProperty('atividade_recente');
      expect(data.atividade_recente.map((item) => item.tipo)).toEqual(['update_repertorio', 'update_partitura']);
      expect(data.atividade_recente[0]).toEqual(expect.objectContaining({
        usuario_nome: 'Admin Teste',
        detalhes: 'ordem: "1" -> "2"',
      }));
      expect(data.total_atividades).toBe(2);
    });
```

- [ ] **Step 2: Write a failing test for paginated activity loading in the same period**

Add this second test right below the previous one:

```ts
    it('pagina atividade_recente com atividades_limit e atividades_offset sem incluir eventos fora da auditoria', async () => {
      await env.DB.prepare(`
        INSERT INTO atividades (tipo, titulo, detalhes, usuario_id, criado_em)
        VALUES
          ('update_partitura', 'Alteracao 1', 'campo: "A" -> "B"', 1, '2099-04-20 09:00:00'),
          ('update_partitura', 'Alteracao 2', 'campo: "B" -> "C"', 1, '2099-04-20 09:10:00'),
          ('update_partitura', 'Alteracao 3', 'campo: "C" -> "D"', 1, '2099-04-20 09:20:00'),
          ('visualizacao', 'Evento ignorado', 'Grade', 2, '2099-04-20 09:30:00')
      `).run();

      const response = await SELF.fetch('https://test.local/api/admin/analytics/dashboard?inicio=2099-04-01&fim=2099-05-01&atividades_limit=2&atividades_offset=1', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(response.status).toBe(200);
      const data = await response.json() as {
        atividade_recente: Array<{ titulo: string; tipo: string }>;
        total_atividades: number;
      };

      expect(data.total_atividades).toBe(3);
      expect(data.atividade_recente).toHaveLength(2);
      expect(data.atividade_recente.map((item) => item.titulo)).toEqual(['Alteracao 2', 'Alteracao 1']);
      expect(data.atividade_recente.every((item) => item.tipo === 'update_partitura')).toBe(true);
    });
```

- [ ] **Step 3: Run the worker test file to verify the new tests fail for the current implementation**

Run:

```bash
npm run test -- worker/tests/routes.test.ts
```

Expected: FAIL because the current endpoint still exposes the redesign sections as primary shape and does not restore the legacy contract used by the old screen.

- [ ] **Step 4: Commit the red test**

```bash
git add worker/tests/routes.test.ts
git commit -m "test: cover analytics rollback contract"
```

## Task 2: Restore the worker endpoint on top of the legacy contract

**Files:**
- Modify: `worker/src/domain/analytics/analyticsService.js`
- Test: `worker/tests/routes.test.ts`

- [ ] **Step 1: Introduce a helper that paginates only audit activity types inside the requested period**

In `worker/src/domain/analytics/analyticsService.js`, keep the existing `AUDIT_ACTIVITY_TYPES` constant and add a focused helper shaped like this:

```js
async function getAuditActivityFeed(env, start, end, url) {
  const rawLimit = Number.parseInt(url.searchParams.get('atividades_limit') ?? '', 10);
  const rawOffset = Number.parseInt(url.searchParams.get('atividades_offset') ?? '', 10);
  const limit = Math.min(Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 15, 100);
  const offset = Number.isFinite(rawOffset) && rawOffset > 0 ? rawOffset : 0;

  const atividades = await env.DB.prepare(`
    SELECT
      a.id,
      a.tipo,
      a.titulo,
      a.detalhes,
      a.criado_em,
      u.nome as usuario_nome
    FROM atividades a
    LEFT JOIN usuarios u ON u.id = a.usuario_id
    WHERE a.criado_em >= ? AND a.criado_em < ?
      AND a.tipo IN (${AUDIT_ACTIVITY_PLACEHOLDERS})
    ORDER BY a.criado_em DESC
    LIMIT ? OFFSET ?
  `).bind(start, end, ...AUDIT_ACTIVITY_TYPES, limit, offset).all();

  const total = await env.DB.prepare(`
    SELECT COUNT(*) as total
    FROM atividades a
    WHERE a.criado_em >= ? AND a.criado_em < ?
      AND a.tipo IN (${AUDIT_ACTIVITY_PLACEHOLDERS})
  `).bind(start, end, ...AUDIT_ACTIVITY_TYPES).first();

  return {
    items: emptyResults(atividades),
    total: total?.total || 0
  };
}
```

- [ ] **Step 2: Replace the fixed-window legacy queries with period-aware bindings**

Update the legacy queries so they respect `start` and `end` instead of `date('now', '-30 days')` or `date('now', '-90 days')`. For example:

```js
const resumo = await env.DB.prepare(`
  SELECT
    (SELECT COUNT(*) FROM usuarios WHERE ativo = 1 AND admin = 0) as musicos_ativos,
    (SELECT COUNT(*) FROM partituras WHERE ativo = 1) as total_partituras,
    (SELECT COALESCE(SUM(downloads), 0) FROM partituras) as total_downloads,
    (SELECT COUNT(DISTINCT usuario_id) FROM presencas WHERE data_ensaio >= ? AND data_ensaio < ?) as presentes_ultimo_periodo,
    (SELECT COUNT(DISTINCT data_ensaio) FROM presencas WHERE data_ensaio >= ? AND data_ensaio < ?) as ensaios_ultimo_periodo
`).bind(start, end, start, end).first();

const downloadsTimeline = await env.DB.prepare(`
  SELECT strftime('%Y-%m-%d', data) as data, COUNT(*) as total
  FROM logs_download
  WHERE data >= ? AND data < ?
  GROUP BY strftime('%Y-%m-%d', data)
  ORDER BY data ASC
`).bind(start, end).all();
```

Apply the same `start` and `end` pattern to:

- `termosSemResultado`
- `topTermos`
- `presencasFamilia`
- `tendenciaPresenca`
- any other query still anchored to `now`

- [ ] **Step 3: Return the legacy payload as the primary response and plug the audit feed into `atividade_recente`**

Reshape the main handler to use the old top-level keys plus the new audit feed:

```js
export async function getAnalyticsDashboard(request, env, _params, _context) {
  try {
    const url = new URL(request.url);
    const { start, end } = getPeriod(url);
    const atividadeRecente = await getAuditActivityFeed(env, start, end, url);

    return jsonResponse({
      periodo: { inicio: start, fim: end },
      resumo: {
        ...(resumo || {}),
        ensaios_ultimo_mes: resumo?.ensaios_ultimo_periodo || 0,
        presentes_ultimo_mes: resumo?.presentes_ultimo_periodo || 0
      },
      downloads_timeline: emptyResults(downloadsTimeline),
      top_partituras: emptyResults(topPartituras),
      instrumentos_dist: emptyResults(instrumentosDist),
      presencas_familia: emptyResults(presencasFamilia),
      musicos_mais_ativos: emptyResults(musicosMaisAtivos),
      ultimo_acesso: emptyResults(ultimoAcesso),
      tendencia_presenca: emptyResults(tendenciaPresenca),
      top_search_terms: emptyResults(topTermos),
      failed_search_terms: emptyResults(termosSemResultado),
      atividade_recente: atividadeRecente.items,
      total_atividades: atividadeRecente.total
    }, 200, request);
  } catch (error) {
    console.error('Analytics error:', error);
    return jsonResponse({ error: 'Erro ao carregar analytics', details: error.message }, 500, request);
  }
}
```

Note: do not keep the section-based redesign flow as the source of truth for the restored screen.

- [ ] **Step 4: Run the worker tests again to verify the backend contract is green**

Run:

```bash
npm run test -- worker/tests/routes.test.ts
```

Expected: PASS for the new rollback tests and existing analytics route tests that remain compatible with the restored contract.

- [ ] **Step 5: Run worker lint after the query rewrite**

Run:

```bash
npm run lint:worker
```

Expected: PASS with zero warnings.

- [ ] **Step 6: Commit the backend restoration**

```bash
git add worker/src/domain/analytics/analyticsService.js worker/tests/routes.test.ts
git commit -m "fix: restore legacy analytics backend"
```

## Task 3: Lock the restored admin screen with failing frontend tests

**Files:**
- Create: `frontend/src/screens/admin/AdminAnalytics.test.jsx`
- Test: `frontend/src/screens/admin/AdminAnalytics.test.jsx`

- [ ] **Step 1: Create a focused admin analytics screen test with API and formatter mocks**

Create `frontend/src/screens/admin/AdminAnalytics.test.jsx` with this base structure:

```jsx
import { describe, test, expect, jest, beforeEach } from '@jest/globals';

const mockGetAnalyticsDashboard = jest.fn();

jest.unstable_mockModule('@services/api', () => ({
  API: {
    getAnalyticsDashboard: mockGetAnalyticsDashboard
  }
}));

jest.unstable_mockModule('@hooks/useMediaQuery', () => ({
  useMediaQuery: () => false
}));

jest.unstable_mockModule('@utils/formatters', () => ({
  formatTimeAgo: jest.fn(() => '1h'),
  getAtividadeInfo: jest.fn(() => ({ action: 'Partitura atualizada', color: '#5B8DEF' }))
}));

const { render, screen, fireEvent, waitFor } = await import('@testing-library/react');
const { default: AdminAnalytics } = await import('./AdminAnalytics');
```

- [ ] **Step 2: Write a failing test for the initial period query and legacy sections**

Add this test:

```jsx
  test('carrega a estrutura legada e envia início e fim no primeiro request', async () => {
    mockGetAnalyticsDashboard.mockResolvedValueOnce({
      resumo: { musicos_ativos: 45, total_downloads: 12, ensaios_ultimo_mes: 3, presentes_ultimo_mes: 18 },
      downloads_timeline: [{ data: '2026-04-01', total: 2 }],
      top_partituras: [{ id: 1, titulo: 'Caboclo', compositor: 'Autor', downloads: 4 }],
      instrumentos_dist: [],
      presencas_familia: [],
      musicos_mais_ativos: [],
      ultimo_acesso: [],
      tendencia_presenca: [],
      top_search_terms: [],
      failed_search_terms: [],
      atividade_recente: [],
      total_atividades: 0
    });

    render(<AdminAnalytics />);

    await waitFor(() => {
      expect(screen.getByText(/Analytics & Insights/i)).toBeInTheDocument();
      expect(screen.getByText(/Atividade Recente/i)).toBeInTheDocument();
    });

    expect(mockGetAnalyticsDashboard).toHaveBeenCalledWith(expect.stringMatching(/^\?inicio=\d{4}-\d{2}-\d{2}&fim=\d{4}-\d{2}-\d{2}$/));
  });
```

- [ ] **Step 3: Write a failing test for inline expansion of administrative details**

Add this test:

```jsx
  test('expande detalhes de uma atividade administrativa quando o item possui detalhes', async () => {
    mockGetAnalyticsDashboard.mockResolvedValueOnce({
      resumo: { musicos_ativos: 45, total_downloads: 12, ensaios_ultimo_mes: 3, presentes_ultimo_mes: 18 },
      downloads_timeline: [],
      top_partituras: [],
      instrumentos_dist: [],
      presencas_familia: [],
      musicos_mais_ativos: [],
      ultimo_acesso: [],
      tendencia_presenca: [],
      top_search_terms: [],
      failed_search_terms: [],
      atividade_recente: [
        {
          id: 99,
          tipo: 'update_partitura',
          titulo: 'Partitura atualizada',
          usuario_nome: 'Admin Teste',
          detalhes: 'titulo: "Antigo" -> "Novo"',
          criado_em: '2026-04-20 12:00:00'
        }
      ],
      total_atividades: 1
    });

    render(<AdminAnalytics />);

    const toggle = await screen.findByRole('button', { name: /ver detalhes/i });
    fireEvent.click(toggle);

    expect(screen.getByText('titulo: "Antigo" -> "Novo"')).toBeInTheDocument();
    expect(screen.getByText(/Admin Teste/i)).toBeInTheDocument();
  });
```

- [ ] **Step 4: Write a failing test for "Carregar mais" using the current period**

Add this test:

```jsx
  test('carrega mais atividades usando o mesmo período ativo', async () => {
    mockGetAnalyticsDashboard
      .mockResolvedValueOnce({
        resumo: { musicos_ativos: 45, total_downloads: 12, ensaios_ultimo_mes: 3, presentes_ultimo_mes: 18 },
        downloads_timeline: [],
        top_partituras: [],
        instrumentos_dist: [],
        presencas_familia: [],
        musicos_mais_ativos: [],
        ultimo_acesso: [],
        tendencia_presenca: [],
        top_search_terms: [],
        failed_search_terms: [],
        atividade_recente: [{ id: 1, tipo: 'update_partitura', titulo: 'Alteracao 1', detalhes: 'A', criado_em: '2026-04-20 10:00:00' }],
        total_atividades: 2
      })
      .mockResolvedValueOnce({
        atividade_recente: [{ id: 2, tipo: 'update_repertorio', titulo: 'Alteracao 2', detalhes: 'B', criado_em: '2026-04-20 11:00:00' }],
        total_atividades: 2
      });

    render(<AdminAnalytics />);

    const button = await screen.findByRole('button', { name: /carregar mais/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockGetAnalyticsDashboard).toHaveBeenLastCalledWith(expect.stringMatching(/inicio=.*fim=.*atividades_limit=30&atividades_offset=1/));
      expect(screen.getByText('Alteracao 2')).toBeInTheDocument();
    });
  });
```

- [ ] **Step 5: Run the new frontend test file and confirm it fails**

Run:

```bash
cd frontend
npm test -- --runInBand src/screens/admin/AdminAnalytics.test.jsx
```

Expected: FAIL because the current `AdminAnalytics.jsx` still renders the redesign layout and does not provide the restored legacy structure or expandable old feed.

- [ ] **Step 6: Commit the red frontend test**

```bash
git add frontend/src/screens/admin/AdminAnalytics.test.jsx
git commit -m "test: cover legacy analytics screen rollback"
```

## Task 4: Restore the admin screen and preserve expandable audit details

**Files:**
- Modify: `frontend/src/screens/admin/AdminAnalytics.jsx`
- Test: `frontend/src/screens/admin/AdminAnalytics.test.jsx`

- [ ] **Step 1: Rebuild `AdminAnalytics` from the pre-redesign structure, but keep period state in the top-level load flow**

Start from the older screen composition and wire the period into the initial request:

```jsx
const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingMoreAtividades, setLoadingMoreAtividades] = useState(false);
  const [periodStart, setPeriodStart] = useState(monthStart);
  const [periodEnd, setPeriodEnd] = useState(monthEnd);
  const isMobile = useMediaQuery('(max-width: 767px)');

  const buildQuery = () => `?inicio=${periodStart}&fim=${periodEnd}`;

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await API.getAnalyticsDashboard(buildQuery());
      setData(result);
    } catch (err) {
      console.error('Erro analytics:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [periodStart, periodEnd]);
```

- [ ] **Step 2: Put the period controls into the legacy header instead of keeping the redesign tab/filter bar**

Use the older header and place two date fields next to the refresh button:

```jsx
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: '12px', marginBottom: isMobile ? '20px' : '28px' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '700', margin: '0 0 6px 0', background: GOLD_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Analytics & Insights
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>
            Análise completa do acervo e engajamento no período selecionado
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <DateField label="Início" value={periodStart} onChange={setPeriodStart} />
          <DateField label="Fim" value={periodEnd} onChange={setPeriodEnd} />
          <button
            onClick={loadAnalytics}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <RefreshCw size={14} /> Atualizar
          </button>
        </div>
      </div>
```

- [ ] **Step 3: Keep the old feed position, but add inline expansion only when a recent activity contains useful detail**

Replace the simplified feed body with an expandable row model:

```jsx
const ActivityFeed = ({ items, totalCount, onLoadMore, loadingMore }) => {
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const toggleItem = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {items.map((item) => {
        const info = getAtividadeInfo(item.tipo, true);
        const hasDetails = Boolean(item.detalhes);
        const expanded = expandedIds.has(item.id);

        return (
          <div key={item.id} style={{ padding: '12px', borderRadius: '10px', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '12px' }}>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                  {info.action}: {item.titulo}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                  {[item.usuario_nome, expanded ? item.detalhes : compactText(item.detalhes, 120)].filter(Boolean).join(' - ')}
                </div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                {formatTimeAgo(item.criado_em, true)}
              </span>
            </div>

            {hasDetails && (
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                style={{
                  marginTop: '10px',
                  border: 'none',
                  background: 'transparent',
                  color: GOLD,
                  fontWeight: 700,
                  padding: 0,
                  cursor: 'pointer'
                }}
              >
                {expanded ? 'Ocultar detalhes' : 'Ver detalhes'}
              </button>
            )}
          </div>
        );
      })}
```

- [ ] **Step 4: Keep "Carregar mais" on the old feed and preserve deduplication**

Use the old merge strategy, but keep the current period in the query:

```jsx
  const loadMoreAtividades = async () => {
    if (!data || loadingMoreAtividades) return;
    setLoadingMoreAtividades(true);
    try {
      const offset = data.atividade_recente?.length || 0;
      const result = await API.getAnalyticsDashboard(
        `${buildQuery()}&atividades_limit=30&atividades_offset=${offset}`
      );

      if (result.atividade_recente?.length > 0) {
        setData((prev) => {
          const merged = [...(prev.atividade_recente || []), ...result.atividade_recente];
          const deduped = Array.from(new Map(merged.map((item) => [item.id, item])).values());
          return {
            ...prev,
            atividade_recente: deduped,
            total_atividades: result.total_atividades ?? prev.total_atividades
          };
        });
      }
    } finally {
      setLoadingMoreAtividades(false);
    }
  };
```

- [ ] **Step 5: Update the KPI labels that were hard-coded to "30d" so they match the new period filter without changing the old visual hierarchy**

Adjust only the labels, not the overall layout:

```jsx
<KpiCard
  icon={CalendarDays}
  label="Ensaios no período"
  value={data.resumo?.ensaios_ultimo_mes || 0}
  color={COLORS.green}
  isMobile={isMobile}
/>
<KpiCard
  icon={UserCheck}
  label="Presentes no período"
  value={data.resumo?.presentes_ultimo_mes || 0}
  color={COLORS.purple}
  isMobile={isMobile}
/>
```

- [ ] **Step 6: Run the frontend screen test and keep iterating until it passes**

Run:

```bash
cd frontend
npm test -- --runInBand src/screens/admin/AdminAnalytics.test.jsx
```

Expected: PASS.

- [ ] **Step 7: Run a nearby admin regression test before closing the task**

Run:

```bash
cd frontend
npm test -- --runInBand src/screens/admin/AdminDashboard.test.jsx src/screens/admin/AdminAnalytics.test.jsx
```

Expected: PASS for both files.

- [ ] **Step 8: Commit the frontend rollback**

```bash
git add frontend/src/screens/admin/AdminAnalytics.jsx frontend/src/screens/admin/AdminAnalytics.test.jsx
git commit -m "fix: restore legacy analytics screen"
```

## Task 5: Final verification and handoff

**Files:**
- Modify: none
- Test: `worker/tests/routes.test.ts`
- Test: `frontend/src/screens/admin/AdminAnalytics.test.jsx`
- Test: `frontend/src/screens/admin/AdminDashboard.test.jsx`

- [ ] **Step 1: Run the backend test file one last time**

```bash
npm run test -- worker/tests/routes.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run the frontend analytics regression again**

```bash
cd frontend
npm test -- --runInBand src/screens/admin/AdminAnalytics.test.jsx
```

Expected: PASS.

- [ ] **Step 3: Run worker lint one last time**

```bash
npm run lint:worker
```

Expected: PASS with zero warnings.

- [ ] **Step 4: Manually verify the restored screen in the app**

Run:

```bash
npm run dev
```

Manual checklist:

- analytics abre com a estrutura antiga;
- mudar `Início` e `Fim` refaz o request e altera os números;
- o feed "Atividade Recente" continua no lugar antigo;
- "Ver detalhes" expande o texto de auditoria administrativa;
- "Carregar mais" anexa novos itens sem duplicar os antigos.

- [ ] **Step 5: Commit the final verification state**

```bash
git add worker/src/domain/analytics/analyticsService.js worker/tests/routes.test.ts frontend/src/screens/admin/AdminAnalytics.jsx frontend/src/screens/admin/AdminAnalytics.test.jsx
git commit -m "test: verify analytics rollback"
```
