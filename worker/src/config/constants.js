// Dominios permitidos para CORS
export const ALLOWED_ORIGINS = [
  'https://partituras25.com',
  'https://acervo-filarmonica.pages.dev',
  'https://acervo.filarmonica25marco.org.br',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
];

// Padrao para subdominios do Cloudflare Pages
export const PAGES_SUBDOMAIN_PATTERN = /^https:\/\/[a-z0-9]+\.acervo-filarmonica\.pages\.dev$/;

// Configuracao JWT
export const JWT_EXPIRY_HOURS = 24;
export const JWT_ALGORITHM = 'HS256';

// Configuracao PBKDF2
export const PBKDF2_ITERATIONS = 100000;
export const PBKDF2_KEY_LENGTH = 256;

// Rate limiting
export const MAX_LOGIN_ATTEMPTS = 5;
export const RATE_LIMIT_WINDOW_SECONDS = 300; // 5 minutos

// Upload limits
export const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
