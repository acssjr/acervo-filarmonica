import { env, SELF } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';

async function createAdminToken(userId = 1): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    userId,
    isAdmin: 1,
    exp: Math.floor(Date.now() / 1000) + 3600,
  }));
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(env.JWT_SECRET || 'test-jwt-secret-for-testing'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${header}.${payload}`));
  const encoded = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${header}.${payload}.${encoded}`;
}

describe('analytics contract routes', () => {
  let token: string;

  beforeAll(async () => {
    token = await createAdminToken();
  });

  it('retorna visão geral com período, resumo, insights e rankings', async () => {
    const response = await SELF.fetch(
      'https://test.local/api/admin/analytics/overview?inicio=2099-08-01&fim=2099-09-01',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(response.status).toBe(200);
    const data = await response.json() as Record<string, unknown>;
    expect(data).toHaveProperty('periodo');
    expect(data).toHaveProperty('resumo');
    expect(data).toHaveProperty('insights');
    expect(data).toHaveProperty('rankings');
  });

  it('retorna o detalhe solicitado e rejeita visão desconhecida', async () => {
    const response = await SELF.fetch(
      'https://test.local/api/admin/analytics/detail?view=engajamento&inicio=2099-08-01&fim=2099-09-01',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toHaveProperty('engajamento');

    const invalid = await SELF.fetch(
      'https://test.local/api/admin/analytics/detail?view=desconhecida',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(invalid.status).toBe(400);
  });

  it('mantém auditoria separada do analytics', async () => {
    const response = await SELF.fetch(
      'https://test.local/api/admin/auditoria?inicio=2099-08-01&fim=2099-09-01',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(response.status).toBe(200);
    const data = await response.json() as Record<string, unknown>;
    expect(data).toHaveProperty('usuarios');
    expect(data).toHaveProperty('atividades');
    expect(data).toHaveProperty('total');
  });
});
