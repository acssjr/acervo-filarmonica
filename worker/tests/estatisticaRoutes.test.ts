import { describe, expect, it, vi } from 'vitest';
import { trackingRateLimitMiddleware } from '../src/routes/estatisticaRoutes.js';

describe('trackingRateLimitMiddleware', () => {
  it('blocks tracking requests when the rate limit window is exhausted', async () => {
    const next = vi.fn();
    const env = {
      RATE_LIMIT: {
        get: vi.fn().mockResolvedValue({
          count: 5,
          firstAttempt: Date.now()
        }),
        put: vi.fn()
      }
    } as any;

    const response = await trackingRateLimitMiddleware(
      new Request('https://example.test/api/tracking/events', {
        headers: { 'CF-Connecting-IP': '203.0.113.1' }
      }),
      env,
      next
    );

    expect(response?.status).toBe(429);
    expect(next).not.toHaveBeenCalled();
  });
});
