import { createPostHogConfig } from './posthog';

describe('PostHog session replay privacy', () => {
  it('exibe textos e campos comuns, mantendo senhas e elementos privados protegidos', () => {
    const config = createPostHogConfig();

    expect(config.mask_all_text).toBe(false);
    expect(config.session_recording).toEqual(expect.objectContaining({
      maskAllInputs: false,
      maskInputOptions: { password: true },
      blockSelector: '.ph-no-capture, [data-private]',
      recordHeaders: false,
      recordBody: false,
    }));
    expect(config.session_recording).not.toHaveProperty('maskTextSelector');
  });
});
