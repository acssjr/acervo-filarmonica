import { describe, expect, it } from 'vitest';
import { createRouter } from '../src/routes/index.js';

describe('inventário do Worker modular', () => {
  it('não registra método e caminho duplicados', () => {
    const router = createRouter();
    const keys = router.routes.map((route) => `${route.method} ${route.path}`);

    expect(new Set(keys).size).toBe(keys.length);
  });

  it('contém as rotas críticas que já existiam no produto', () => {
    const router = createRouter();
    const keys = new Set(router.routes.map((route) => `${route.method} ${route.path}`));

    for (const route of [
      'POST /api/login',
      'GET /api/partituras',
      'GET /api/perfil/foto/:filename',
      'GET /api/repertorio/:id/download',
      'GET /api/repertorio/:id/disponibilidade-download',
      'GET /api/admin/analytics/dashboard'
    ]) {
      expect(keys.has(route), `rota ausente: ${route}`).toBe(true);
    }
  });
});
