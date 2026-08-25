import { describe, expect, it, vi } from 'vitest';
import { createJwt } from '../src/infrastructure/auth/jwt.js';
import { getJwtSecret } from '../src/infrastructure/response/helpers.js';
import { checkUser, login } from '../src/domain/auth/loginService.js';
import {
  checkRateLimit,
  checkTrackingRateLimit
} from '../src/infrastructure/ratelimit/rateLimiter.js';

describe('configuração de segurança', () => {
  it('não cria fallback previsível quando JWT_SECRET está ausente', async () => {
    expect(() => getJwtSecret({})).toThrow('JWT_SECRET não configurado');
    await expect(createJwt({ userId: 1 }, '')).rejects.toThrow('JWT_SECRET não configurado');
  });

  it('bloqueia autenticação em produção sem rate limit configurado', async () => {
    const result = await checkRateLimit({ ENVIRONMENT: 'production' }, 'login:127.0.0.1');

    expect(result).toMatchObject({
      allowed: false,
      remaining: 0,
      configurationError: true
    });
  });

  it('mantém desenvolvimento utilizável e sinaliza proteção degradada', async () => {
    const result = await checkRateLimit({ ENVIRONMENT: 'development' }, 'login:127.0.0.1');

    expect(result).toMatchObject({ allowed: true, degraded: true });
  });

  it('aplica limite e janela personalizados sem alterar o limite do login', async () => {
    let stored: { count: number; firstAttempt: number } | null = null;
    const kv = {
      get: vi.fn().mockImplementation(async () => stored),
      put: vi.fn().mockImplementation(async (_key: string, value: string) => {
        stored = JSON.parse(value);
      })
    };

    const env = { ENVIRONMENT: 'production', RATE_LIMIT: kv };
    const options = { maxAttempts: 2, windowSeconds: 60 };

    expect((await checkRateLimit(env, 'checkuser:test', options)).allowed).toBe(true);
    expect((await checkRateLimit(env, 'checkuser:test', options)).allowed).toBe(true);
    const blocked = await checkRateLimit(env, 'checkuser:test', options);

    expect(blocked).toMatchObject({ allowed: false, remaining: 0 });
    expect(kv.put).toHaveBeenCalledWith(
      'ratelimit:checkuser:test',
      expect.any(String),
      { expirationTtl: 60 }
    );
  });

  it('retorna 503 na consulta de usuário quando o rate limit não está configurado', async () => {
    const request = new Request('https://test.local/api/check-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'musico' })
    });

    const response = await checkUser(request, { ENVIRONMENT: 'production' });
    const body = await response.json() as { exists: boolean; error: string };

    expect(response.status).toBe(503);
    expect(body.exists).toBe(false);
    expect(body.error).toContain('temporariamente indisponível');
  });

  it('retorna 503 no login quando o rate limit não está configurado', async () => {
    const request = new Request('https://test.local/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'musico', pin: '1234' })
    });

    const response = await login(request, { ENVIRONMENT: 'production' });
    const body = await response.json() as { error: string };

    expect(response.status).toBe(503);
    expect(body.error).toContain('temporariamente indisponível');
  });

  it('prefere a identidade autenticada ao IP no limite de tracking', async () => {
    let storedKey = '';
    const kv = {
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockImplementation(async (key: string) => {
        storedKey = key;
      })
    };

    const result = await checkTrackingRateLimit({ RATE_LIMIT: kv }, 42, '203.0.113.10');

    expect(result.allowed).toBe(true);
    expect(storedKey).toBe('ratelimit:tracking:user:42');
  });

  it('bloqueia login em produção quando o KV falha', async () => {
    const kv = {
      get: vi.fn().mockRejectedValue(new Error('KV offline')),
      put: vi.fn()
    };

    const result = await checkRateLimit({ ENVIRONMENT: 'production', RATE_LIMIT: kv }, 'login:127.0.0.1');

    expect(result).toMatchObject({
      allowed: false,
      remaining: 0,
      configurationError: true
    });
  });

  it('bloqueia tracking em produção quando a escrita no KV falha', async () => {
    const kv = {
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockRejectedValue(new Error('KV offline'))
    };

    const result = await checkTrackingRateLimit(
      { ENVIRONMENT: 'production', RATE_LIMIT: kv },
      42,
      '203.0.113.10'
    );

    expect(result).toMatchObject({
      allowed: false,
      remaining: 0,
      configurationError: true
    });
  });
});
