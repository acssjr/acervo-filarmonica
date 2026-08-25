import { describe, expect, it, vi } from 'vitest';
import { capturePostHog } from '../src/infrastructure/posthog/posthogClient.js';

describe('telemetria best-effort', () => {
  it('absorve falhas do provedor', async () => {
    const shutdown = vi.fn();
    const env = {
      POSTHOG_CLIENT_FACTORY: () => ({
        capture: () => { throw new Error('provider offline'); },
        shutdown
      })
    };
    await expect(capturePostHog(env, { event: 'teste', distinctId: '1' }))
      .resolves.toBeUndefined();
    expect(shutdown).toHaveBeenCalledTimes(1);
  });

  it('absorve falhas no encerramento do cliente', async () => {
    const env = {
      POSTHOG_CLIENT_FACTORY: () => ({
        capture: vi.fn(),
        shutdown: vi.fn().mockRejectedValue(new Error('flush offline'))
      })
    };

    await expect(capturePostHog(env, { event: 'teste', distinctId: '1' }))
      .resolves.toBeUndefined();
  });

  it('agenda o flush com waitUntil quando há contexto', async () => {
    let release;
    const pending = new Promise<void>(resolve => { release = resolve; });
    const waitUntil = vi.fn();
    const env = {
      POSTHOG_CLIENT_FACTORY: () => ({ capture: vi.fn(), shutdown: () => pending })
    };

    (env as typeof env & { __executionCtx: { waitUntil: typeof waitUntil } }).__executionCtx = { waitUntil };
    await capturePostHog(env, { event: 'teste', distinctId: '1' });
    expect(waitUntil).toHaveBeenCalledTimes(1);
    release!();
    await waitUntil.mock.calls[0][0];
  });
});
