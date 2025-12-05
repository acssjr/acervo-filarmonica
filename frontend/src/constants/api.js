// ===== CONFIGURACAO DA API =====
// URL base e configuracoes de conexao com o backend

// URL da API - usar variavel de ambiente em producao
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://acervo-filarmonica-api.acssjr.workers.dev';

// Tempo de expiracao do token (em segundos)
export const TOKEN_EXPIRY_SECONDS = 24 * 60 * 60; // 24 horas

// Buffer antes de considerar token expirado (em ms)
export const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minutos
