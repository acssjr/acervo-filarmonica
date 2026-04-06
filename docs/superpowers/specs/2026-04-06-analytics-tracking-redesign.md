# Analytics and Tracking Redesign

Date: 2026-04-06

## Goal

Redesign the admin analytics experience so an administrator who did not design the screen can quickly understand what each area answers. The dashboard should prioritize real usage of the sheet music archive, while keeping rehearsal metrics separate and making admin changes auditable.

The main navigation will be organized by administrator questions:

- **Uso do acervo**: what is being opened, viewed, downloaded, and searched.
- **Pessoas**: who is using the archive and what journey each person followed.
- **Ensaios**: monthly attendance, streaks, and rehearsal participation.
- **Alterações**: what admins changed in the archive, parts, and repertoire.

Frontend changes must follow the existing brand language: dark UI, gold as the main accent, simple cards, restrained borders, clear hierarchy, and direct product copy. Visible user-facing text touched by this work should have correct Portuguese accents.

## Tracking Model

D1 will be the source of truth for the admin dashboard. PostHog must not be required for this feature, since it is not considered reliable in the current project and the admin dashboard needs direct joins with users, partituras, partes, repertórios, and presenças.

Add two tracking tables:

- `tracking_sessions`
  - `id`
  - `usuario_id`
  - `inicio_em`
  - `fim_em`
  - `fim_motivo`
  - Session starts at login or at the first authenticated action if an existing token is already valid.
  - Session ends on explicit logout or after 30 minutes without tracked activity.

- `tracking_events`
  - `id`
  - `session_id`
  - `usuario_id`
  - `tipo`
  - `origem`
  - `criado_em`
  - Optional entity references: `partitura_id`, `parte_id`, `repertorio_id`
  - Search fields when applicable: `termo_original`, `termo_normalizado`, `resultados_count`
  - A small metadata JSON field only for data that materially improves analysis.

Indexes should support dashboard queries without reading broad payloads:

- `criado_em`
- `usuario_id, criado_em`
- `session_id`
- `tipo, criado_em`
- `partitura_id, criado_em`
- `parte_id, criado_em`

The default dashboard period is the current month. Every detailed query must use a period filter and pagination.

## Events

Track these initial events:

- `partitura_aberta`: details modal or page opened successfully.
- `pdf_visualizado_grade`: full score or grade viewed in the in-browser renderer.
- `pdf_visualizado_parte`: specific part viewed in the in-browser renderer.
- `download_grade`: full score or grade downloaded to the device.
- `download_parte`: specific part downloaded to the device.
- `busca_digitada`: search input changed, including the typed sequence.
- `busca_realizada`: stable or submitted search with result count.
- `favorito_adicionado`
- `favorito_removido`
- `sessao_iniciada`
- `sessao_encerrada`

Important rules:

- Viewing with the eye icon is not a download, even if the backend request uses a download-like route.
- Repeated PDF views count as separate events.
- Timeline events remain separate. If a user views and then downloads the same PDF, show both actions.
- Search stores both original and normalized terms.
- Search terms that look sensitive, such as PINs, email, phone, CPF-like values, or similar patterns, should be masked in the dashboard and preferably masked before persistence.
- Downloads must include origin context when available: acervo, busca, favoritos, repertorio, carrinho_compartilhamento, detalhe_partitura, or another explicit source.

Admin-facing labels should be human:

- `Abriu partitura`
- `Visualizou grade`
- `Visualizou parte`
- `Baixou grade`
- `Baixou parte`
- `Buscou por termo`
- `Favoritou partitura`

Technical event names should not be shown by default in the UI.

## Uso Do Acervo

This tab answers: "What is being used?"

Default period: current month, with a customizable date range.

Top cards:

- Partituras abertas
- PDFs visualizados
- Downloads reais
- Conversão para visualização
- Conversão para download
- Buscas sem resultado

Main sections:

- Funnel: `abriu partitura -> visualizou PDF -> baixou arquivo`
- Ranking by partitura: opens, PDF views, downloads, and download conversion.
- Ranking by part/instrument: most viewed and downloaded parts.
- Informational insight cards:
  - high view count with low download count
  - search terms with no results
  - direct downloads without prior view
  - most active users in the period

Insights are informational in this version. Do not add correction actions or new workflows yet.

## Pessoas

This tab answers: "Who is using the archive?"

Default period: current month.

Behavior:

- Filter by person.
- Show a summary first:
  - partituras opened
  - PDF views
  - real downloads
  - searches
  - favorites
  - sessions
- Show the most opened/viewed/downloaded partituras for that person.
- Show a paginated session timeline after the summary.

Timeline should group events by session but keep events separate:

- login or session start
- search input / search performed
- partitura opened
- grade or part viewed
- grade or part downloaded
- favorite changes
- session end

## Ensaios

This tab answers: "How is attendance going?"

It must remain separate from archive usage analytics.

Default period: current month.

Rules:

- Only use rehearsals actually registered in the system.
- Do not calculate expected attendance from configured rehearsal days that have not been registered yet.
- Maestro/admin users are excluded from attendance metrics.
- Valid families are only Madeiras, Metais, and Percussão. Do not show "Outros". If data falls outside those families, treat it as a data issue rather than a chart category.
- Streak means physical presence. Any absence breaks the streak, even if justified.

Top cards:

- Presença média do mês
- Maior streak ativo
- Músicos com presença perfeita no mês
- Ensaios registrados no mes

Main sections:

- Positive streak ranking by musician.
- Monthly attendance by musician, for example `4/4 ensaios - 100%`.
- Attendance by family using clear text:
  - `Madeiras: 139 presenças registradas de 180 esperadas`
  - Expand detail: `15 músicos ativos x 12 ensaios registrados = 180 presenças esperadas`

Avoid the label "presenças possíveis" in the UI because it is unclear. Use "presenças esperadas" and provide the calculation in an expandable explanation.

## Alterações

This tab answers: "What changed?"

It is an admin audit view.

Filters:

- admin/person
- action type
- period

Events should be shown in human language, never as raw technical identifiers like `update_partitura`.

Examples:

- `Partitura atualizada: Verde X Branco`
  - `Compositor: "A" -> "B"`
  - `Destaque: "nao" -> "sim"`
- `Parte atualizada: Verde X Branco`
  - `Instrumento renomeado: "Trompete" -> "Trompete Bb 1"`
- `Parte removida: Verde X Branco`
  - `Parte removida: Trompete Bb 1`

## Data Retention

Keep detailed events indefinitely for now. Do not design annual export or cleanup in this iteration.

Performance requirements:

- Default to current month.
- Require period filters for heavy views.
- Use pagination for timelines and event lists.
- Keep event metadata small.
- Add indexes before relying on dashboard queries.

Future export or archival can be designed later if database growth becomes a practical issue.

## Out Of Scope For This Iteration

- PostHog dashboards.
- Annual retrospective export.
- Data cleanup workflow.
- Actionable correction buttons from insights.
- Rewriting unrelated admin screens.
- Refactoring non-user-facing comments or internal variable names just for accent fixes.

## Open Implementation Notes

- The existing frontend can temporarily show broken/empty new metrics if pointed at an older production Worker. Deployment order should account for this: backend first or backwards-compatible frontend fallback.
- The current activity log can continue to exist during migration, but new journey analytics should use the new tracking tables.
- Existing activity labels should still be corrected so admin previews never show raw names like `update_partitura`.
