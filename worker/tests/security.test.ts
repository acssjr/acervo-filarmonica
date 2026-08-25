import { describe, expect, it, vi } from 'vitest';
import { createJwt } from '../src/infrastructure/auth/jwt.js';
import { getJwtSecret } from '../src/infrastructure/response/helpers.js';
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
