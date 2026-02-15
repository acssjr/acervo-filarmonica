const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = isLocalhost ? '' : (process.env.NEXT_PUBLIC_API_URL || 'https://acervo-filarmonica-api.acssjr.workers.dev');
export const TOKEN_EXPIRY_SECONDS = 24 * 60 * 60;
export const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000;
