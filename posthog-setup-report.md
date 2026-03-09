# PostHog Setup Report — Acervo Digital Filarmônica 25 de Março

## Overview

PostHog analytics has been integrated into the Cloudflare Worker backend using the `posthog-node` SDK (v5.26.2). The integration tracks 13 server-side events across 6 domain service files.

---

## Configuration

| Setting | Value |
|---------|-------|
| SDK | `posthog-node` v5.26.2 |
| Host | `https://us.i.posthog.com` |
| Environment | Cloudflare Workers (edge serverless) |
| API Key | Set via `npx wrangler secret put POSTHOG_API_KEY` |
| `POSTHOG_HOST` | Set in `wrangler.toml` `[vars]` |

### Serverless Pattern

Because Cloudflare Workers terminate immediately after each request, the client is configured with:

```js
new PostHog(apiKey, {
  host,
  flushAt: 1,
  flushInterval: 0,
  enableExceptionAutocapture: true,
});
```

And `await client.shutdown()` is called after every `capture()` to ensure events are flushed before the Worker exits.

### Null-Safe Graceful Degradation

`createPostHogClient(env)` returns `null` if `POSTHOG_API_KEY` is not set. All capture calls are guarded by `if (posthog) { ... }`, so the API works normally without analytics if the key is missing.

---

## Files Created / Modified

| File | Change |
|------|--------|
| `worker/src/infrastructure/posthog/posthogClient.js` | **NEW** — PostHog client factory for Cloudflare Workers |
| `worker/src/domain/auth/loginService.js` | Added `identify()`, `user_logged_in`, `user_pin_changed` |
| `worker/src/domain/partituras/downloadService.js` | Added `partitura_downloaded`, `parte_downloaded` |
| `worker/src/domain/partituras/partituraService.js` | Added `partitura_created`, `partitura_uploaded_with_parts`, `partitura_deleted` |
| `worker/src/domain/favoritos/favoritoService.js` | Added `favorito_added`, `favorito_removed` |
| `worker/src/domain/repertorios/repertorioService.js` | Added `repertorio_created`, `repertorio_downloaded` |
| `worker/src/domain/usuarios/usuarioService.js` | Added `usuario_created`, `usuario_deactivated` |
| `wrangler.toml` | Added `POSTHOG_HOST` to `[vars]`; added comment for secret key |
| `package.json` | Added `posthog-node: ^5.26.2` to `dependencies` |

---

## Events Tracked

| Event | File | Description |
|-------|------|-------------|
| `user_logged_in` | `loginService.js` | Successful login; also calls `identify()` with user profile |
| `user_pin_changed` | `loginService.js` | User successfully changes their PIN |
| `partitura_downloaded` | `downloadService.js` | Full partitura (score) downloaded |
| `parte_downloaded` | `downloadService.js` | Individual instrument part downloaded |
| `partitura_created` | `partituraService.js` | Admin creates a new partitura (single file) |
| `partitura_uploaded_with_parts` | `partituraService.js` | Admin uploads a folder of parts for a partitura |
| `partitura_deleted` | `partituraService.js` | Admin permanently deletes a partitura |
| `favorito_added` | `favoritoService.js` | User adds a partitura to favorites |
| `favorito_removed` | `favoritoService.js` | User removes a partitura from favorites |
| `repertorio_created` | `repertorioService.js` | Admin creates a new repertório |
| `repertorio_downloaded` | `repertorioService.js` | User bulk-downloads a repertório |
| `usuario_created` | `usuarioService.js` | Admin creates a new user |
| `usuario_deactivated` | `usuarioService.js` | Admin deactivates a user |

---

## User Identification

On each successful login, `posthog.identify()` is called with:

- `$set`: `username`, `nome`, `is_admin`, `instrumento` (updated on every login)
- `$set_once`: `first_login` (set only the first time)

`distinctId` format: `user_${user.id}` (e.g., `user_1`, `user_42`)

---

## PostHog Dashboard

**Dashboard:** [Analytics basics](https://us.posthog.com/project/329665/dashboard/1325108) (ID: 1325108)

### Insights

| Insight | ID | URL |
|---------|----|-----|
| Logins & Downloads Over Time | 7153425 | [cZXMTUaP](https://us.posthog.com/project/329665/insights/cZXMTUaP) |
| Login → Download Funnel | 7153433 | [hLQHruQy](https://us.posthog.com/project/329665/insights/hLQHruQy) |
| Content Management Activity | 7153434 | [smtMoB9s](https://us.posthog.com/project/329665/insights/smtMoB9s) |
| Favoritos Engagement | 7153436 | [NFLTejee](https://us.posthog.com/project/329665/insights/NFLTejee) |
| Repertório Downloads & New Users | 7153439 | [AgJfGLXt](https://us.posthog.com/project/329665/insights/AgJfGLXt) |

---

## Deployment Note

Before deploying to production, set the PostHog API key as a Wrangler secret:

```bash
npx wrangler secret put POSTHOG_API_KEY
```

This ensures the key is encrypted and not exposed in `wrangler.toml`.
