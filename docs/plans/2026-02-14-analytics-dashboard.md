# Dashboard & Analytics Implementation Plan

**Goal:** Implement a comprehensive analytics dashboard for tracking musician engagement, sheet music downloads, and search behavior, using a hybrid approach (real-time SQL aggregation + event sourcing for search logs).

**Architecture:**
- **Backend:** New API endpoints in `worker` for aggregated statistics (using complex SQL queries). New `logs_buscas` table for tracking search terms.
- **Frontend:** Install `recharts` for visualization. Create `AdminAnalytics` screen with 3 tabs (Overview, Musicians, Engagement).
- **Tracking:** Implement search term tracking in `SearchInput` component.

**Tech Stack:** Cloudflare Workers (D1), React, Recharts, SQL.

---

## Tasks

### Task 1: Database Migration & Schema

**Files:**
- Create: `database/migrations/0004_analytics_tables.sql`
- Modify: `database/schema.sql`

**Step 1: Create migration file**
Create a new migration file to add the `logs_buscas` table.

```sql
-- database/migrations/0004_analytics_tables.sql
-- Tabela de Logs de Buscas
CREATE TABLE IF NOT EXISTS logs_buscas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    termo TEXT NOT NULL,
    resultados_count INTEGER DEFAULT 0,
    usuario_id INTEGER,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_logs_buscas_data ON logs_buscas(data DESC);
CREATE INDEX IF NOT EXISTS idx_logs_buscas_termo ON logs_buscas(termo);

-- Add usuario_id to logs_download
ALTER TABLE logs_download ADD COLUMN usuario_id INTEGER REFERENCES usuarios(id);
```

**Step 2: Update schema.sql reference**
Append the new table definition to `database/schema.sql` to keep it as the source of truth.

**Step 3: Run migration (Local)**
Run `npm run db:init` (or specific migration command if available) to apply changes locally.

---

### Task 2: Backend - Analytics Service & Endpoints

**Files:**
- Create: `worker/src/domain/analytics/analyticsService.js`
- Create: `worker/src/domain/analytics/trackingService.js`
- Modify: `worker/src/routes/estatisticaRoutes.js`
- Modify: `worker/src/routes/index.js`

**Step 1: Implement Tracking Service**
Create `worker/src/domain/analytics/trackingService.js` to handle search logs.

```javascript
import { jsonResponse, errorResponse } from '../../infrastructure/index.js';

export async function trackSearch(request, env, user) {
  try {
    const { termo, resultados_count } = await request.json();
    
    if (!termo) return errorResponse('Termo é obrigatório', 400);

    await env.DB.prepare(
      'INSERT INTO logs_buscas (termo, resultados_count, usuario_id) VALUES (?, ?, ?)'
    ).bind(termo, resultados_count, user?.id || null).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Erro ao registrar busca:', error);
    return errorResponse('Erro interno', 500);
  }
}
```

**Step 2: Implement Analytics Service (Aggregation)**
Create `worker/src/domain/analytics/analyticsService.js` with complex queries.

*Functions to implement:*
- `getDownloadsOverTime`: Group logs_download by date (last 30 days).
- `getInstrumentDistribution`: Count active users by instrument family.
- `getSearchStats`: Top terms and "Zero Result" terms.
- `getAttendanceTrends`: Average attendance percentage per rehearsal (last 10).

**Step 3: Register Routes**
Update `worker/src/routes/estatisticaRoutes.js` to include:
- `POST /api/tracking/search`
- `GET /api/admin/analytics/dashboard` (aggregates all charts data)

---

### Task 3: Frontend - Install Recharts & Set Up API

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/src/services/api.js`

**Step 1: Install Recharts**
Run `npm install recharts` in `frontend/`.

**Step 2: Add API methods**
Update `frontend/src/services/api.js` to include:
- `trackSearch(termo, count)`
- `getAnalyticsDashboard()`

---

### Task 4: Frontend - Analytics Components

**Files:**
- Create: `frontend/src/components/charts/LineChart.jsx`
- Create: `frontend/src/components/charts/BarChart.jsx`
- Create: `frontend/src/components/charts/PieChart.jsx`

**Step 1: Create Reusable Chart Wrappers**
Create localized wrappers for Recharts components to maintain consistent styling (colors, fonts, tooltips) across the app.

---

### Task 5: Frontend - Search Tracking Integration

**Files:**
- Modify: `frontend/src/components/common/Header.jsx` (or wherever search input lives)

**Step 1: Add Debounced Tracking**
In the search component, add a `useEffect` or debounce handler that calls `API.trackSearch` when a search is performed (and not just while typing).

---

### Task 6: Frontend - Admin Analytics Screen

**Files:**
- Create: `frontend/src/screens/admin/AdminAnalytics.jsx`
- Modify: `frontend/src/routes.jsx` (or main App router)

**Step 1: Create Screen Layout**
Implement the dashboard layout with 3 tabs:
1.  **Overview:** Timeline de downloads, Pizza de Instrumentos.
2.  **Engajamento:** Gráfico de Assiduidade, Tabela de Top Partituras.
3.  **Busca:** Tabela de "Termos sem resultado" e "Mais buscados".

**Step 2: Connect to Data**
Fetch data from `getAnalyticsDashboard` and pass to charts.

---

### Task 7: Validation & Refinement

**Files:**
- Test: Manual testing of all charts.
- Test: Verify search logs are being saved in DB.

**Step 1: Verify Mobile Responsiveness**
Ensure charts resize correctly on mobile screens.

**Step 2: Verify Dark Mode**
Check if chart colors contrast well in dark mode.
