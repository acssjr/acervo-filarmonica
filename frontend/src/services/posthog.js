// PostHog carregado sob demanda para não aumentar o custo da primeira tela.
// A telemetria é opcional: sem configuração, o Acervo continua funcionando.

const VITE_ENV = import.meta.env || {};
const POSTHOG_KEY = VITE_ENV.VITE_PUBLIC_POSTHOG_KEY?.trim();
const POSTHOG_HOST = VITE_ENV.VITE_PUBLIC_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com';
const POSTHOG_DEBUG = VITE_ENV.VITE_PUBLIC_POSTHOG_DEBUG === 'true';
const IS_ENABLED = Boolean(POSTHOG_KEY) && (VITE_ENV.PROD || POSTHOG_DEBUG);

let client = null;
let clientPromise = null;

const withoutQueryString = (value) => {
  if (typeof value !== 'string') return value;

  try {
    const url = new URL(value, window.location.origin);
    return `${url.origin}${url.pathname}`;
  } catch {
    return value.split('?')[0].split('#')[0];
  }
};

const sanitizeEvent = (captureResult) => {
  if (!captureResult?.properties) return captureResult;

  const properties = { ...captureResult.properties };
  ['$current_url', '$referrer'].forEach((key) => {
    if (properties[key]) properties[key] = withoutQueryString(properties[key]);
  });

  const setOnce = captureResult.$set_once
    ? { ...captureResult.$set_once }
    : null;
  ['$initial_current_url', '$initial_referrer'].forEach((key) => {
    if (setOnce?.[key]) setOnce[key] = withoutQueryString(setOnce[key]);
  });

  delete properties.username;
  delete properties.nome;
  delete properties.email;
  delete properties.pin;
  delete properties.termo_original;

  return {
    ...captureResult,
    properties,
    ...(setOnce ? { $set_once: setOnce } : {}),
  };
};

export const createPostHogConfig = () => ({
  api_host: POSTHOG_HOST,
  defaults: '2025-11-30',
  autocapture: {
    css_selector_ignorelist: [
      '.ph-no-capture',
      '.ph-no-autocapture',
      '[data-ph-no-autocapture]',
      '[data-private]',
    ],
    element_attribute_ignorelist: ['value', 'data-value', 'data-token'],
    capture_copied_text: false,
  },
  capture_pageview: 'history_change',
  capture_pageleave: true,
  capture_exceptions: true,
  capture_performance: { web_vitals: true },
  person_profiles: 'identified_only',
  persistence: 'localStorage',
  mask_all_element_attributes: false,
  mask_all_text: false,
  mask_personal_data_properties: true,
  custom_personal_data_properties: ['token', 'auth', 'email', 'username', 'user'],
  disable_session_recording: true,
  enable_recording_console_log: false,
  session_recording: {
    maskAllInputs: false,
    maskInputOptions: { password: true },
    blockSelector: '.ph-no-capture, [data-private]',
    recordHeaders: false,
    recordBody: false,
    captureCanvas: false,
    sampleRate: 1,
    session_idle_threshold_ms: 5 * 60 * 1000,
    maskCapturedNetworkRequestFn: (request) => ({
      ...request,
      name: withoutQueryString(request.name),
    }),
  },
  before_send: sanitizeEvent,
  debug: POSTHOG_DEBUG,
});

const loadClient = async () => {
  if (!IS_ENABLED) return null;
  if (client) return client;
  if (clientPromise) return clientPromise;

  clientPromise = import('posthog-js').then(({ default: posthog }) => {
    posthog.init(POSTHOG_KEY, createPostHogConfig());

    client = posthog;
    return client;
  }).catch((error) => {
    clientPromise = null;
    console.warn('PostHog indisponível; telemetria desativada nesta sessão.', error);
    return null;
  });

  return clientPromise;
};

export const initializePostHog = () => {
  if (!IS_ENABLED) return;

  const initialize = () => void loadClient();
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(initialize, { timeout: 2000 });
  } else {
    window.setTimeout(initialize, 0);
  }
};

export const buildPostHogPersonProperties = (user) => {
  const displayName = [user?.nome_exibicao, user?.name, user?.nome]
    .find((value) => typeof value === 'string' && value.trim())
    ?.trim()
    .replace(/\s+/g, ' ');

  return {
    ...(displayName ? { name: displayName } : {}),
    role: user?.isAdmin ? 'admin' : 'musico',
    instrumento: user?.instrument || null,
  };
};

export const identifyPostHogUser = async (user) => {
  if (!user?.id) return;
  const posthog = await loadClient();
  if (!posthog) return;

  const personProperties = buildPostHogPersonProperties(user);
  posthog.identify(`user_${user.id}`, personProperties);
  posthog.register({
    role: personProperties.role,
    instrumento: personProperties.instrumento,
  });
  posthog.startSessionRecording(true);
};

export const resetPostHogUser = async () => {
  const posthog = client || await loadClient();
  if (!posthog) return;

  posthog.stopSessionRecording();
  posthog.reset(true);
};

export const capturePostHogEvent = async (event, properties = {}) => {
  if (!event) return;
  const posthog = await loadClient();
  posthog?.capture(event, properties);
};

export const captureAcervoEvent = (event) => {
  if (!event?.tipo) return;

  const properties = {
    origem: event.origem || null,
    partitura_id: event.partitura_id || null,
    parte_id: event.parte_id || null,
    resultados_count: Number.isFinite(event.resultados_count) ? event.resultados_count : null,
    instrumento: event.metadata?.instrumento || null,
  };

  void capturePostHogEvent(event.tipo, properties);
};

export const captureLoginFailure = (reason) => {
  void capturePostHogEvent('login_failed', { reason });
};
