// worker/src/infrastructure/posthog/posthogClient.js
// PostHog analytics client for Cloudflare Workers (serverless environment)
// Uses flushAt: 1 and flushInterval: 0 to send events immediately (required for short-lived processes)

import { PostHog } from 'posthog-node';

/**
 * Create a PostHog client configured for serverless/edge environments.
 * Each invocation creates a fresh client, captures events immediately,
 * and shuts down to flush before the response is returned.
 *
 * @param {object} env - Cloudflare Worker env bindings
 * @returns {PostHog|null} PostHog client instance, or null if not configured
 */
export function createPostHogClient(env) {
  const apiKey = env.POSTHOG_API_KEY;
  const host = env.POSTHOG_HOST || 'https://us.i.posthog.com';

  if (!apiKey) {
    return null;
  }

  return new PostHog(apiKey, {
    host,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true,
  });
}

/**
 * Shutdown the PostHog client after flushing all pending events.
 * Always call this at the end of a serverless request.
 *
 * @param {PostHog|null} client
 */
export async function shutdownPostHog(client) {
  if (client) {
    await client.shutdown();
  }
}

/**
 * Captura telemetria sem permitir que o provedor afete a resposta da API.
 * Quando há ExecutionContext, o flush continua depois que a resposta é liberada.
 */
export function capturePostHog(env, event, executionCtx = null, identify = null) {
  const backgroundContext = executionCtx || env.__executionCtx || null;
  const task = (async () => {
    try {
      const client = typeof env.POSTHOG_CLIENT_FACTORY === 'function'
        ? env.POSTHOG_CLIENT_FACTORY()
        : createPostHogClient(env);
      if (!client) return;
      if (identify) client.identify(identify);
      client.capture(event);
      await shutdownPostHog(client);
    } catch (error) {
      console.error('PostHog indisponível; evento ignorado:', error);
    }
  })();

  if (backgroundContext?.waitUntil) {
    backgroundContext.waitUntil(task);
    return Promise.resolve();
  }
  return task;
}
