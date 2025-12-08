// ===== CONFIGURACAO DA API =====
// URL base e configuracoes de conexao com o backend

// URL da API
// Em localhost (dev/preview): usa proxy do Vite (URL relativa)
// Em producao: usa URL completa do Cloudflare Workers
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
export const API_BASE_URL = isLocalhost ? '' : 'https://api.partituras25.com';

// Tempo de expiracao do token (em segundos)
export const TOKEN_EXPIRY_SECONDS = 24 * 60 * 60; // 24 horas

// Buffer antes de considerar token expirado (em ms)
export const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minutos
