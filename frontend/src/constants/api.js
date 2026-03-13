// ===== CONFIGURAÇÃO DA API =====
// URL base e configurações de conexão com o backend

// URL da API
// Em localhost (dev/preview): usa proxy do Vite (URL relativa)
// Em produção: usa URL completa do Cloudflare Workers
// Em dev: string vazia — usa proxy do Vite (/api → localhost:8787 ou prod)
// Em produção (build): pode ser injetada via VITE_API_BASE_URL no .env ou CI
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Tempo de expiração do token (em segundos)
export const TOKEN_EXPIRY_SECONDS = 24 * 60 * 60; // 24 horas

// Buffer antes de considerar token expirado (em ms)
export const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minutos
