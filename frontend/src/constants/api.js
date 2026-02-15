// ===== CONFIGURAÇÃO DA API =====
// URL base e configurações de conexão com o backend

// URL da API
// Em localhost (dev/preview): usa proxy do Vite (URL relativa)
// Em produção: usa URL completa do Cloudflare Workers
// TEMP: Apontando para API de produção para teste local
export const API_BASE_URL = 'https://acervo-filarmonica-api.acssjr.workers.dev';

// Tempo de expiração do token (em segundos)
export const TOKEN_EXPIRY_SECONDS = 24 * 60 * 60; // 24 horas

// Buffer antes de considerar token expirado (em ms)
export const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minutos
