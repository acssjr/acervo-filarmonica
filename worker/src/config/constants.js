// Domínios permitidos para CORS
export const ALLOWED_ORIGINS = [
  'https://acervo.filarmonica25demarco.com',
  'https://partituras.app',
  'https://acervo-filarmonica.pages.dev',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
];

// Padrão para subdomínios do Cloudflare Pages
export const PAGES_SUBDOMAIN_PATTERN = /^https:\/\/[a-z0-9]+\.acervo-filarmonica\.pages\.dev$/;

// Configuração JWT
export const JWT_EXPIRY_HOURS = 24;
export const JWT_EXPIRY_HOURS_REMEMBER = 24 * 30; // 30 dias quando "lembrar acesso"
export const JWT_ALGORITHM = 'HS256';

// Configuração PBKDF2
export const PBKDF2_ITERATIONS = 100000;
export const PBKDF2_KEY_LENGTH = 256;

// Rate limiting
export const MAX_LOGIN_ATTEMPTS = 5;
export const RATE_LIMIT_WINDOW_SECONDS = 300; // 5 minutos

// Upload limits
export const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
