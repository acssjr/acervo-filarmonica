import { describe, expect, it, vi } from 'vitest';
import { env as testEnv } from 'cloudflare:test';
import { createJwt } from '../src/infrastructure/auth/jwt.js';
import { getJwtSecret } from '../src/infrastructure/response/helpers.js';
import { checkUser, login } from '../src/domain/auth/loginService.js';
import {
  checkRateLimit,
  resetRateLimit,
  checkTrackingRateLimit,
  checkUserRateLimit
} from '../src/infrastructure/ratelimit/rateLimiter.js';

function limiter(success = true) {
  return { limit: vi.fn().mockResolvedValue({ success }) };
}

describe('configuração de segurança', () => {
  it('não cria fallback previsível quando JWT_SECRET está ausente', async () => {
    expect(() => getJwtSecret({})).toThrow('JWT_SECRET não configurado');
    await expect(createJwt({ userId: 1 }, '')).rejects.toThrow('JWT_SECRET não configurado');
  });

  it('bloqueia autenticação em produção sem o limitador de login', async () => {
    const result = await checkRateLimit({ ENVIRONMENT: 'production' }, 'login:127.0.0.1');

    expect(result).toMatchObject({
      allowed: false,
      configurationError: true,
      retryAfter: 60
    });
  });

  it('mantém desenvolvimento utilizável e sinaliza proteção degradada', async () => {
    const result = await checkRateLimit({ ENVIRONMENT: 'development' }, 'login:127.0.0.1');

    expect(result).toMatchObject({ allowed: true, degraded: true });
  });

  it('mantém cinco tentativas de login por cinco minutos e separa a consulta de usuário', async () => {
    const loginLimiter = limiter();
    const userLimiter = limiter(false);
    const key = `login:test:${crypto.randomUUID()}`;
    const env = {
      DB: testEnv.DB,
      LOGIN_RATE_LIMITER: loginLimiter,
      CHECK_USER_RATE_LIMITER: userLimiter
    };

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect((await checkRateLimit(env, key)).allowed).toBe(true);
    }
    const blockedLogin = await checkRateLimit(env, key);
    expect(blockedLogin.allowed).toBe(false);
    expect(blockedLogin.retryAfter).toBeGreaterThan(0);
    expect(blockedLogin.retryAfter).toBeLessThanOrEqual(300);
    expect((await checkUserRateLimit(env, 'checkuser:ip'))).toMatchObject({
      allowed: false,
      retryAfter: 60
    });
    expect(userLimiter.limit).toHaveBeenCalledWith({ key: 'checkuser:ip' });
    expect(loginLimiter.limit).toHaveBeenCalledWith({ key });

    await resetRateLimit(env, key);
    expect((await checkRateLimit(env, key)).allowed).toBe(true);
    await resetRateLimit(env, key);
  });

  it('retorna 503 na consulta de usuário quando o limitador não está configurado', async () => {
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

  it('retorna 503 no login quando o limitador não está configurado', async () => {
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

  it('rejeita username excessivo antes de criar contador no banco', async () => {
    const request = new Request('https://test.local/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'a'.repeat(65), pin: '1234' })
    });

    const response = await login(request, { ENVIRONMENT: 'production' });

    expect(response.status).toBe(400);
  });

  it('prefere a identidade autenticada ao IP no limite de tracking', async () => {
    const trackingLimiter = limiter();
    const result = await checkTrackingRateLimit(
      { TRACKING_RATE_LIMITER: trackingLimiter },
      42,
      '203.0.113.10'
    );

    expect(result.allowed).toBe(true);
    expect(trackingLimiter.limit).toHaveBeenCalledWith({ key: 'tracking:user:42' });
  });

  it('bloqueia login em produção quando o contador no banco falha', async () => {
    const failingDb = {
      prepare: vi.fn().mockImplementation(() => {
        throw new Error('database offline');
      })
    };

    const result = await checkRateLimit(
      { ENVIRONMENT: 'production', DB: failingDb, LOGIN_RATE_LIMITER: limiter() },
      'login:127.0.0.1'
    );

    expect(result).toMatchObject({
      allowed: false,
      configurationError: true,
      retryAfter: 300
    });
  });

  it('bloqueia tracking em produção quando o binding falha', async () => {
    const failingLimiter = {
      limit: vi.fn().mockRejectedValue(new Error('rate limiter offline'))
    };

    const result = await checkTrackingRateLimit(
      { ENVIRONMENT: 'production', TRACKING_RATE_LIMITER: failingLimiter },
      42,
      '203.0.113.10'
    );

    expect(result).toMatchObject({
      allowed: false,
      configurationError: true,
      retryAfter: 60
    });
  });
});
