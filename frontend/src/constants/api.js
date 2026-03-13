// ===== CONFIGURAÇÃO DA API =====
// URL base e configurações de conexão com o backend

// URL da API
// Em localhost (dev/preview): usa proxy do Vite (URL relativa)
// Em produção: usa URL completa do Cloudflare Workers
let VITE_API_BASE_URL = '';
let IS_DEV = false;

try {
    // Lida de forma segura com o substituidor estático do Vite
    VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    IS_DEV = import.meta.env.DEV;
} catch (e) {
    // Cai no catch quando roda através do Jest, onde import.meta.env é undefined
}

export const API_BASE_URL = VITE_API_BASE_URL || (IS_DEV ? '' : 'https://acervo-filarmonica-api.acssjr.workers.dev');

// Tempo de expiração do token (em segundos)
export const TOKEN_EXPIRY_SECONDS = 24 * 60 * 60; // 24 horas

// Buffer antes de considerar token expirado (em ms)
export const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minutos
