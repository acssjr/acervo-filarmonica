/**
 * Testes de Integração de Rotas
 *
 * Estes testes rodam no runtime workerd real, validando:
 * 1. Rotas existem e respondem corretamente
 * 2. Métodos HTTP corretos são aceitos/rejeitados
 * 3. Middlewares de autenticação funcionam
 *
 * @see docs/TESTING-STRATEGY.md
 */

import { env, SELF } from 'cloudflare:test';
import { describe, it, expect, beforeAll } from 'vitest';

// Helper para criar token JWT de teste
async function createTestToken(userId: number, isAdmin: boolean = false): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    userId,
    isAdmin: isAdmin ? 1 : 0,
    exp: Math.floor(Date.now() / 1000) + 3600,
  }));

  // Importa a chave para assinar
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(env.JWT_SECRET || 'test-jwt-secret-for-testing'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const data = encoder.encode(`${header}.${payload}`);
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${header}.${payload}.${signatureBase64}`;
}

describe('Health Check', () => {
  it('GET /api/health retorna 200', async () => {
    const response = await SELF.fetch('https://test.local/api/health');
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status');
  });
});

describe('Rotas Públicas', () => {
  describe('GET /api/partituras', () => {
    it('retorna 200 sem autenticação', async () => {
      const response = await SELF.fetch('https://test.local/api/partituras');
      expect(response.status).toBe(200);
    });

    it('aceita query params', async () => {
      const response = await SELF.fetch('https://test.local/api/partituras?busca=teste&categoria=1');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/categorias', () => {
    it('retorna 200 sem autenticação', async () => {
      const response = await SELF.fetch('https://test.local/api/categorias');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/estatisticas', () => {
    it('retorna 200 sem autenticação', async () => {
      const response = await SELF.fetch('https://test.local/api/estatisticas');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/atividades', () => {
    it('retorna 200 sem autenticação', async () => {
      const response = await SELF.fetch('https://test.local/api/atividades');
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/login', () => {
    it('aceita POST', async () => {
      const response = await SELF.fetch('https://test.local/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'invalid', pin: '0000' }),
      });
      // 401 é esperado para credenciais inválidas, mas a rota existe
      expect([200, 401]).toContain(response.status);
    });

    it('rejeita GET', async () => {
      const response = await SELF.fetch('https://test.local/api/login');
      expect(response.status).toBe(404);
    });
  });
});

describe('Rotas Autenticadas', () => {
  let userToken: string;

  beforeAll(async () => {
    userToken = await createTestToken(2, false); // usuário 2 é músico comum
  });

  describe('GET /api/favoritos', () => {
    it('retorna 401 sem token', async () => {
      const response = await SELF.fetch('https://test.local/api/favoritos');
      expect(response.status).toBe(401);
    });

    it('retorna 200 com token válido', async () => {
      const response = await SELF.fetch('https://test.local/api/favoritos', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/perfil', () => {
    it('retorna 401 sem token', async () => {
      const response = await SELF.fetch('https://test.local/api/perfil');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/repertorio/ativo', () => {
    it('retorna 401 ou 404 sem token', async () => {
      const response = await SELF.fetch('https://test.local/api/repertorio/ativo');
      // 401 se middleware de auth rejeitou, 404 se não há repertório ativo
      expect([401, 404]).toContain(response.status);
    });
  });
});

describe('Rotas Admin', () => {
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    userToken = await createTestToken(2, false); // usuário comum
    adminToken = await createTestToken(1, true);  // admin
  });

  describe('GET /api/usuarios', () => {
    it('rejeita sem token (401 ou 403)', async () => {
      const response = await SELF.fetch('https://test.local/api/usuarios');
      // adminMiddleware pode retornar 401 (não autenticado) ou 403 (não autorizado)
      expect([401, 403]).toContain(response.status);
    });

    it('retorna 403 com token de usuário comum', async () => {
      const response = await SELF.fetch('https://test.local/api/usuarios', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(response.status).toBe(403);
    });

    it('retorna 200 com token admin', async () => {
      const response = await SELF.fetch('https://test.local/api/usuarios', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/categorias', () => {
    it('rejeita sem token (401 ou 403)', async () => {
      const response = await SELF.fetch('https://test.local/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: 'Teste' }),
      });
      expect([401, 403]).toContain(response.status);
    });

    it('retorna 403 com token de usuário comum', async () => {
      const response = await SELF.fetch('https://test.local/api/categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ nome: 'Teste' }),
      });
      expect(response.status).toBe(403);
    });
  });
});

describe('Rotas de Partes (BUG FIX)', () => {
  /**
   * Estes testes validam especificamente as rotas que tiveram bugs de endpoint:
   * - PUT /api/partes/:id/substituir (não /api/partituras/:id/partes/:parteId)
   * - DELETE /api/partes/:id (não /api/partituras/:id/partes/:parteId)
   */

  let adminToken: string;

  beforeAll(async () => {
    adminToken = await createTestToken(1, true);
  });

  describe('PUT /api/partes/:id/substituir', () => {
    it('rota existe e requer admin (401 ou 403 sem token)', async () => {
      const response = await SELF.fetch('https://test.local/api/partes/1/substituir', {
        method: 'PUT',
      });
      // Rota existe, mas requer autenticação admin
      expect([401, 403]).toContain(response.status);
    });

    it('rota ERRADA retorna 404', async () => {
      // Endpoint antigo/errado que não deve existir
      const response = await SELF.fetch('https://test.local/api/partituras/1/partes/1/substituir', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/partes/:id', () => {
    it('rota existe e requer admin (401 ou 403 sem token)', async () => {
      const response = await SELF.fetch('https://test.local/api/partes/1', {
        method: 'DELETE',
      });
      expect([401, 403]).toContain(response.status);
    });

    it('rota ERRADA retorna 404', async () => {
      // Endpoint antigo/errado que não deve existir
      const response = await SELF.fetch('https://test.local/api/partituras/1/partes/1', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/partituras/:id/partes', () => {
    it('rota existe e requer autenticação', async () => {
      const response = await SELF.fetch('https://test.local/api/partituras/1/partes');
      expect(response.status).toBe(401);
    });
  });
});

describe('Métodos HTTP incorretos', () => {
  it('DELETE em /api/partituras (sem ID) retorna 404', async () => {
    const response = await SELF.fetch('https://test.local/api/partituras', {
      method: 'DELETE',
    });
    expect(response.status).toBe(404);
  });

  it('PUT em /api/login retorna 404', async () => {
    const response = await SELF.fetch('https://test.local/api/login', {
      method: 'PUT',
    });
    expect(response.status).toBe(404);
  });

  it('POST em /api/estatisticas retorna 404', async () => {
    const response = await SELF.fetch('https://test.local/api/estatisticas', {
      method: 'POST',
    });
    expect(response.status).toBe(404);
  });
});
