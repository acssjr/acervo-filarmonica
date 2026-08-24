# Backend Stabilization Implementation Plan

> **For agentic workers:** Execute inline in this branch. The user explicitly waived test-first/TDD; add regression tests immediately after each implementation batch and run the focused suite before continuing.

**Goal:** Make the modular Worker the single reliable backend, secure authentication and configuration, reconcile D1 migrations, protect R2/D1 operations, align the API contract and CI, and remove known dependency and development hazards without changing product behavior.

**Architecture:** Preserve the current React, Worker, D1 and R2 stack. Consolidate configuration and contracts around `worker/src/index.js`, introduce small infrastructure helpers for storage and background work, and migrate tooling toward one reproducible path.

**Tech Stack:** JavaScript/TypeScript, React 18, Vite 5, Cloudflare Workers, D1, R2, Vitest Workers pool, Jest, OpenAPI, ESLint.

---

### Task 1: Secure configuration and authorization

**Files:**
- Modify: `wrangler.toml`
- Modify: `worker/src/infrastructure/auth/jwt.js`
- Modify: `worker/src/domain/auth/authService.js`
- Modify: `worker/src/routes/estatisticaRoutes.js`
- Modify: `worker/src/infrastructure/ratelimit/rateLimiter.js`
- Modify: `worker/src/routes/healthRoutes.js`
- Test: `worker/tests/routes.test.ts`
- Test: `worker/tests/cors.test.ts`

- [ ] Remove the tracked JWT value from `wrangler.toml` and document `wrangler secret put JWT_SECRET` plus `.dev.vars` usage without adding a real secret.
- [ ] Make JWT signing and verification fail with a controlled configuration error when no secret exists.
- [ ] Remove token-role fallback from `verifyAdmin`; current D1 `usuarios.admin` is authoritative.
- [ ] Reorder tracking middleware to authenticate before applying the user/IP rate key.
- [ ] Make production rate-limit degradation visible without exposing internal binding details in the public health payload.
- [ ] Add regression tests for demoted admins, missing secrets and authenticated tracking keys.
- [ ] Run `npm test -- worker/tests/routes.test.ts worker/tests/cors.test.ts` and `npm run lint:worker`.

### Task 2: Establish a canonical D1 bootstrap and migration path

**Files:**
- Create: `database/migrations/012_reconcile_schema.sql`
- Create: `scripts/db-bootstrap.cjs`
- Modify: `package.json`
- Modify: `database/schema.sql`
- Modify: `worker/tests/setup.ts`
- Create: `worker/tests/databaseBootstrap.test.ts`
- Modify: `INSTALL.md`

- [ ] Inventory the production schema implied by migrations and service queries.
- [ ] Add a reconciliation migration for missing indexes/objects using idempotent SQL supported by SQLite.
- [ ] Replace misleading scripts with `wrangler d1 migrations apply` commands for local and remote targets; keep remote commands explicit.
- [ ] Make reset local-only and cover every application table in foreign-key-safe order.
- [ ] Make test setup load the canonical schema plus reconciliation definitions rather than redefine tables independently.
- [ ] Add an integration test that constructs a fresh local schema and verifies tracking, repertories, configuration, ensaio config and display-name fields.
- [ ] Run the focused bootstrap test and the complete Worker suite.

### Task 3: Converge on the modular Worker and restore route parity

**Files:**
- Modify: `package.json`
- Modify: `scripts/dev.cjs`
- Modify: `scripts/setup.js` or replace with `scripts/setup.cjs`
- Modify: `worker/src/routes/perfilRoutes.js`
- Modify: `worker/src/domain/perfil/perfilService.js`
- Modify: `worker/src/domain/repertorios/repertorioService.js`
- Test: `worker/tests/routes.test.ts`
- Create: `worker/tests/routeInventory.test.ts`
- Document: `docs/ARCHITECTURE.md`

- [ ] Point every dev/start script at the `wrangler.toml` modular entrypoint.
- [ ] Remove the CommonJS/ESM mismatch in setup tooling.
- [ ] Add `GET /api/perfil/foto/:filename` to the modular router with R2 metadata and cache headers.
- [ ] Fix repertoire instrument fallback to use `instrumento_id` and its resolved instrument name.
- [ ] Add an inventory test for known modular routes and document `worker/index.js` as deprecated pending deletion.
- [ ] Run focused route tests, Worker lint and full Worker tests.

### Task 4: Make storage operations recoverable and namespace-safe

**Files:**
- Create: `worker/src/infrastructure/storage/storageKeys.js`
- Create: `worker/src/infrastructure/storage/storageOperations.js`
- Modify: `worker/src/infrastructure/index.js`
- Modify: `worker/src/domain/partituras/parteService.js`
- Modify: `worker/src/domain/partituras/partituraService.js`
- Modify: `worker/src/domain/perfil/perfilService.js`
- Modify: `worker/src/domain/assets/assetService.js`
- Test: `worker/tests/routes.test.ts`
- Create: `worker/tests/storageOperations.test.ts`

- [ ] Centralize safe names and prefixes for `partituras/`, `partes/`, `perfil/` and `assets/`.
- [ ] Add upload-with-compensation helper that deletes a newly uploaded object when its D1 mutation fails.
- [ ] Change replacements to upload new, update D1, then delete old; never delete old first.
- [ ] Validate PDF signature, MIME, size and batch count before storing any upload.
- [ ] Restrict asset list/delete operations to `assets/` and reject traversal or foreign prefixes.
- [ ] Preserve reads for legacy unprefixed keys while all new writes use namespaces.
- [ ] Add failure-injection tests for D1 errors after R2 upload and R2 errors during replacement.
- [ ] Run storage tests, route tests and the full Worker suite.

### Task 5: Make repertoire changes atomic and validate inputs

**Files:**
- Create: `worker/src/infrastructure/validation/validators.js`
- Modify: `worker/src/infrastructure/index.js`
- Modify: `worker/src/domain/repertorios/repertorioService.js`
- Modify: `worker/src/domain/presenca/presencaService.js`
- Modify: `worker/src/domain/ensaio/ensaioService.js`
- Modify: `worker/src/routes/configRoutes.js`
- Modify: `worker/src/domain/partituras/downloadService.js`
- Test: `worker/tests/routes.test.ts`
- Create: `worker/tests/validators.test.ts`

- [ ] Add strict positive-ID, ISO-date, HTTP URL, pagination and safe-header helpers.
- [ ] Use D1 batch for repertoire activation/deactivation, deletion, duplication and reorder operations.
- [ ] Preserve explicit empty strings on allowed update fields instead of replacing them with old values.
- [ ] Distinguish uniqueness conflicts from unrelated database failures.
- [ ] Sanitize download filenames and validate date/URL inputs at route boundaries.
- [ ] Add regression tests for partial repertoire failures and invalid inputs.
- [ ] Run focused and full Worker verification.

### Task 6: Align OpenAPI, generated types and CI

**Files:**
- Modify: `worker/openapi.yaml`
- Regenerate: `frontend/src/api-types.ts`
- Modify: `frontend/src/services/api-client.ts`
- Modify: `.github/workflows/ci.yml`
- Modify: `frontend/package.json`
- Create: `scripts/check-route-contract.cjs`
- Modify: `package.json`

- [ ] Add every active route and its relevant success/error response schema to OpenAPI.
- [ ] Correct the storage import and typed request/response mismatches in `api-client.ts`.
- [ ] Add a route-contract checker that reports router methods/paths absent from OpenAPI.
- [ ] Add API generation drift check and frontend typecheck to CI.
- [ ] Run API generation, route contract, typecheck, frontend lint, tests and build.

### Task 7: Decouple analytics and improve safe development defaults

**Files:**
- Modify: `worker/src/infrastructure/posthog/posthogClient.js`
- Modify: PostHog call sites under `worker/src/domain/`
- Modify: `frontend/vite.config.js`
- Modify: `scripts/dev.cjs`
- Test: `worker/tests/routes.test.ts`

- [ ] Introduce one best-effort capture helper using execution-context `waitUntil` when available.
- [ ] Ensure login and CRUD responses do not fail because PostHog is unavailable.
- [ ] Default Vite proxy to local API and require an explicit target for production.
- [ ] Add regression tests for analytics-provider failure.
- [ ] Run Worker tests and frontend build in local-target mode.

### Task 8: Update vulnerable dependencies and reduce loading regressions

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/package-lock.json`
- Modify: frontend lazy-loading imports identified by Vite
- Modify: root lockfile only if required

- [ ] Update `posthog-js`, `react-router-dom`, `protobufjs` chain and audited tooling to fixed compatible versions.
- [ ] Run `npm audit --omit=dev` and record any remaining advisory with applicability.
- [ ] Remove static imports that defeat existing lazy imports.
- [ ] Keep PDF viewer, Lottie and large admin-only modules out of the initial route where possible without changing UX.
- [ ] Run frontend typecheck, lint, 308+ tests and production build.

### Task 9: Verify, document and prepare controlled deployment

**Files:**
- Modify: `README.md`
- Modify: `INSTALL.md`
- Modify: `SECURITY.md`
- Create: `docs/DEPLOYMENT-CHECKLIST.md`
- Modify: `docs/CHANGELOG.md`

- [ ] Document local setup, secrets, migrations, one backend entrypoint and rollback procedure.
- [ ] Run complete Worker and frontend verification, audits, route contract and `git diff --check`.
- [ ] Run local HTTP smoke tests against Wrangler without touching remote D1/R2.
- [ ] Review the diff for accidental secrets and unrelated changes.
- [ ] Commit coherent implementation batches.
- [ ] Stop before remote secret rotation, migration or deploy and request explicit confirmation.

### Task 10: Frontend visual modernization follow-up

**Files:**
- Create after backend stabilization: `docs/superpowers/specs/2026-08-24-frontend-modernization-design.md`

- [ ] Inventory every current screen, state and responsive flow after backend contracts are stable.
- [ ] Present visual alternatives and obtain approval before changing the visual language.
- [ ] Create a separate implementation plan that preserves all current product capabilities.
