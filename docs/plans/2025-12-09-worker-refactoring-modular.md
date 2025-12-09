# Refatoracao do Worker para Monolito Modular

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refatorar o arquivo `worker/index.js` (2014 linhas) em uma arquitetura Monolito Modular seguindo principios de Arquitetura Hexagonal, conforme melhores praticas de 2025.

**Architecture:** Monolito Modular com separacao em camadas: Config, Infrastructure (CORS, JWT, Hashing, Response), Domain (Auth, Partituras, Usuarios, Categorias, Favoritos, Atividades), e Adapters (HTTP Router, Middleware). Seguindo o principio de Portas e Adaptadores onde o Core de negocio nao depende de infraestrutura.

**Tech Stack:** Cloudflare Workers, D1 Database, R2 Storage, Web Crypto API (JWT HS256, PBKDF2)

**Referencias:**
- Guia Tecnico Arquitetura Web Moderna 2025 (Capitulo 1: Monolito Modular, Arquitetura Hexagonal)
- CLAUDE.md do projeto (ambiente local com wrangler dev)

---

## Estrutura Final Proposta

```
worker/
├── index.js                    # Entry point (minimo, apenas importa e exporta)
├── src/
│   ├── config/
│   │   ├── constants.js        # ALLOWED_ORIGINS, JWT config, PBKDF2 config
│   │   └── index.js
│   │
│   ├── infrastructure/
│   │   ├── security/
│   │   │   ├── cors.js         # isOriginAllowed, getCorsHeaders
│   │   │   ├── crypto.js       # base64Url encode/decode, converters
│   │   │   └── index.js
│   │   │
│   │   ├── auth/
│   │   │   ├── jwt.js          # createJwt, verifyJwt
│   │   │   ├── hashing.js      # hashPin, verifyPin, generateSalt
│   │   │   └── index.js
│   │   │
│   │   ├── ratelimit/
│   │   │   ├── rateLimiter.js  # checkRateLimit, resetRateLimit
│   │   │   └── index.js
│   │   │
│   │   ├── response/
│   │   │   ├── helpers.js      # jsonResponse, errorResponse
│   │   │   └── index.js
│   │   │
│   │   └── index.js
│   │
│   ├── domain/
│   │   ├── auth/
│   │   │   ├── authService.js      # verifyUserFromJwt, verifyAdmin, verifyUser
│   │   │   ├── loginService.js     # login, checkUser, changePin
│   │   │   └── index.js
│   │   │
│   │   ├── partituras/
│   │   │   ├── partituraService.js # CRUD partituras
│   │   │   ├── parteService.js     # CRUD partes
│   │   │   ├── downloadService.js  # download partitura/parte
│   │   │   └── index.js
│   │   │
│   │   ├── usuarios/
│   │   │   ├── usuarioService.js   # CRUD usuarios (admin)
│   │   │   ├── perfilService.js    # getPerfil, updatePerfil, uploadFoto
│   │   │   └── index.js
│   │   │
│   │   ├── categorias/
│   │   │   ├── categoriaService.js # CRUD categorias
│   │   │   └── index.js
│   │   │
│   │   ├── favoritos/
│   │   │   ├── favoritoService.js  # getFavoritos, add, remove
│   │   │   └── index.js
│   │   │
│   │   ├── atividades/
│   │   │   ├── atividadeService.js # getAtividades, registrar
│   │   │   └── index.js
│   │   │
│   │   ├── estatisticas/
│   │   │   ├── estatisticaService.js
│   │   │   └── index.js
│   │   │
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── router.js           # Classe Router com middleware support
│   │   ├── authRoutes.js       # /api/login, /api/check-user, /api/change-pin
│   │   ├── partituraRoutes.js  # /api/partituras/*
│   │   ├── usuarioRoutes.js    # /api/usuarios/*
│   │   ├── categoriaRoutes.js  # /api/categorias/*
│   │   ├── favoritoRoutes.js   # /api/favoritos/*
│   │   ├── atividadeRoutes.js  # /api/atividades/*
│   │   ├── adminRoutes.js      # /api/admin/*
│   │   ├── healthRoutes.js     # /api/health
│   │   └── index.js
│   │
│   └── middleware/
│       ├── corsMiddleware.js
│       ├── authMiddleware.js
│       ├── adminMiddleware.js
│       ├── rateLimitMiddleware.js
│       └── index.js
│
└── package.json (se necessario para imports)
```

---

## Fase 1: Infraestrutura Base

### Task 1.1: Criar estrutura de pastas

**Files:**
- Create: `worker/src/config/constants.js`
- Create: `worker/src/config/index.js`

**Step 1: Criar pasta config e arquivo constants.js**

```javascript
// worker/src/config/constants.js

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
```

**Step 2: Criar index.js para re-export**

```javascript
// worker/src/config/index.js
export * from './constants.js';
```

**Step 3: Verificar que arquivos foram criados**

Run: `ls worker/src/config/`
Expected: `constants.js  index.js`

**Step 4: Commit**

```bash
git add worker/src/config/
git commit -m "refactor(worker): criar modulo config com constantes"
```

---

### Task 1.2: Criar modulo de seguranca (CORS e Crypto helpers)

**Files:**
- Create: `worker/src/infrastructure/security/cors.js`
- Create: `worker/src/infrastructure/security/crypto.js`
- Create: `worker/src/infrastructure/security/index.js`

**Step 1: Criar cors.js**

```javascript
// worker/src/infrastructure/security/cors.js
import { ALLOWED_ORIGINS, PAGES_SUBDOMAIN_PATTERN } from '../../config/index.js';

// Verifica se origem e permitida
export function isOriginAllowed(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (PAGES_SUBDOMAIN_PATTERN.test(origin)) return true;
  return false;
}

// Gera CORS headers baseado na origem
export function getCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (origin && isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  } else if (!origin) {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  return headers;
}
```

**Step 2: Criar crypto.js**

```javascript
// worker/src/infrastructure/security/crypto.js

// Base64 URL encode
export function base64UrlEncode(data) {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Base64 URL decode
export function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// String para ArrayBuffer
export function stringToArrayBuffer(str) {
  return new TextEncoder().encode(str);
}

// ArrayBuffer para Hex
export function arrayBufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Hex para ArrayBuffer
export function hexToArrayBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}
```

**Step 3: Criar index.js**

```javascript
// worker/src/infrastructure/security/index.js
export * from './cors.js';
export * from './crypto.js';
```

**Step 4: Commit**

```bash
git add worker/src/infrastructure/security/
git commit -m "refactor(worker): criar modulo security (CORS, crypto helpers)"
```

---

### Task 1.3: Criar modulo de autenticacao (JWT e Hashing)

**Files:**
- Create: `worker/src/infrastructure/auth/jwt.js`
- Create: `worker/src/infrastructure/auth/hashing.js`
- Create: `worker/src/infrastructure/auth/index.js`

**Step 1: Criar jwt.js**

```javascript
// worker/src/infrastructure/auth/jwt.js
import { JWT_EXPIRY_HOURS, JWT_ALGORITHM } from '../../config/index.js';
import { base64UrlEncode, base64UrlDecode, stringToArrayBuffer } from '../security/crypto.js';

// Criar JWT
export async function createJwt(payload, secret) {
  const header = { alg: JWT_ALGORITHM, typ: 'JWT' };

  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + (JWT_EXPIRY_HOURS * 3600)
  };

  const encodedHeader = base64UrlEncode(stringToArrayBuffer(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(stringToArrayBuffer(JSON.stringify(fullPayload)));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, stringToArrayBuffer(dataToSign));
  const encodedSignature = base64UrlEncode(signature);

  return `${dataToSign}.${encodedSignature}`;
}

// Verificar JWT
export async function verifyJwt(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;

    const key = await crypto.subtle.importKey(
      'raw',
      stringToArrayBuffer(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureBytes = base64UrlDecode(encodedSignature);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      stringToArrayBuffer(dataToVerify)
    );

    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlDecode(encodedPayload));
    const payload = JSON.parse(payloadJson);

    // Verificar expiracao
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch (e) {
    console.error('JWT verification error:', e);
    return null;
  }
}
```

**Step 2: Criar hashing.js**

```javascript
// worker/src/infrastructure/auth/hashing.js
import { PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH } from '../../config/index.js';
import { arrayBufferToHex, hexToArrayBuffer, stringToArrayBuffer } from '../security/crypto.js';

// Gerar salt aleatorio
export function generateSalt() {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  return arrayBufferToHex(saltBytes.buffer);
}

// Hash de PIN com PBKDF2
export async function hashPin(pin, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(pin),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(hexToArrayBuffer(salt)),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    PBKDF2_KEY_LENGTH
  );

  return arrayBufferToHex(derivedBits);
}

// Verificar PIN
export async function verifyPin(pin, storedHash, salt) {
  const computedHash = await hashPin(pin, salt);
  return computedHash === storedHash;
}
```

**Step 3: Criar index.js**

```javascript
// worker/src/infrastructure/auth/index.js
export * from './jwt.js';
export * from './hashing.js';
```

**Step 4: Commit**

```bash
git add worker/src/infrastructure/auth/
git commit -m "refactor(worker): criar modulo auth (JWT, hashing PBKDF2)"
```

---

### Task 1.4: Criar modulo de Rate Limiting

**Files:**
- Create: `worker/src/infrastructure/ratelimit/rateLimiter.js`
- Create: `worker/src/infrastructure/ratelimit/index.js`

**Step 1: Criar rateLimiter.js**

```javascript
// worker/src/infrastructure/ratelimit/rateLimiter.js
import { MAX_LOGIN_ATTEMPTS, RATE_LIMIT_WINDOW_SECONDS } from '../../config/index.js';

// Verificar rate limit
export async function checkRateLimit(env, key) {
  // Se KV nao esta configurado, permite
  if (!env.RATE_LIMIT) {
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS };
  }

  const now = Date.now();
  const windowKey = `ratelimit:${key}`;

  try {
    const data = await env.RATE_LIMIT.get(windowKey, 'json');

    if (!data) {
      // Primeira tentativa
      await env.RATE_LIMIT.put(windowKey, JSON.stringify({
        count: 1,
        firstAttempt: now
      }), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });

      return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - 1 };
    }

    const windowStart = data.firstAttempt;
    const windowEnd = windowStart + (RATE_LIMIT_WINDOW_SECONDS * 1000);

    if (now > windowEnd) {
      // Janela expirou, resetar
      await env.RATE_LIMIT.put(windowKey, JSON.stringify({
        count: 1,
        firstAttempt: now
      }), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });

      return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - 1 };
    }

    if (data.count >= MAX_LOGIN_ATTEMPTS) {
      const retryAfter = Math.ceil((windowEnd - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter };
    }

    // Incrementar contador
    await env.RATE_LIMIT.put(windowKey, JSON.stringify({
      count: data.count + 1,
      firstAttempt: data.firstAttempt
    }), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });

    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - data.count - 1 };
  } catch (e) {
    console.error('Rate limit error:', e);
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS };
  }
}

// Resetar rate limit (apos login bem sucedido)
export async function resetRateLimit(env, key) {
  if (!env.RATE_LIMIT) return;

  try {
    await env.RATE_LIMIT.delete(`ratelimit:${key}`);
  } catch (e) {
    console.error('Reset rate limit error:', e);
  }
}
```

**Step 2: Criar index.js**

```javascript
// worker/src/infrastructure/ratelimit/index.js
export * from './rateLimiter.js';
```

**Step 3: Commit**

```bash
git add worker/src/infrastructure/ratelimit/
git commit -m "refactor(worker): criar modulo ratelimit"
```

---

### Task 1.5: Criar modulo de Response Helpers

**Files:**
- Create: `worker/src/infrastructure/response/helpers.js`
- Create: `worker/src/infrastructure/response/index.js`

**Step 1: Criar helpers.js**

```javascript
// worker/src/infrastructure/response/helpers.js
import { getCorsHeaders } from '../security/cors.js';

// Resposta JSON padronizada
export function jsonResponse(data, status = 200, request = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(request ? getCorsHeaders(request) : {})
  };

  return new Response(JSON.stringify(data), { status, headers });
}

// Resposta de erro padronizada
export function errorResponse(message, status = 400, request = null) {
  return jsonResponse({ error: message }, status, request);
}

// Obter JWT secret do ambiente
export function getJwtSecret(env) {
  // Usa JWT_SECRET se definido, senao deriva do database_id
  return env.JWT_SECRET || `acervo-jwt-${env.DB?.database_id || 'dev'}`;
}
```

**Step 2: Criar index.js**

```javascript
// worker/src/infrastructure/response/index.js
export * from './helpers.js';
```

**Step 3: Commit**

```bash
git add worker/src/infrastructure/response/
git commit -m "refactor(worker): criar modulo response helpers"
```

---

### Task 1.6: Criar index.js da infrastructure

**Files:**
- Create: `worker/src/infrastructure/index.js`

**Step 1: Criar index.js**

```javascript
// worker/src/infrastructure/index.js

// Security
export * from './security/index.js';

// Auth (JWT, Hashing)
export * from './auth/index.js';

// Rate Limiting
export * from './ratelimit/index.js';

// Response Helpers
export * from './response/index.js';
```

**Step 2: Commit**

```bash
git add worker/src/infrastructure/index.js
git commit -m "refactor(worker): criar index da infrastructure"
```

---

## Fase 2: Domain Services

### Task 2.1: Criar Auth Service (verificacao de usuario)

**Files:**
- Create: `worker/src/domain/auth/authService.js`
- Create: `worker/src/domain/auth/index.js`

**Step 1: Criar authService.js**

```javascript
// worker/src/domain/auth/authService.js
import { verifyJwt } from '../../infrastructure/auth/jwt.js';
import { getJwtSecret } from '../../infrastructure/response/helpers.js';

// Verificar usuario a partir do JWT ou formato legado
export async function verifyUserFromJwt(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;

  // Formato: "Bearer <token>"
  const token = authHeader.replace('Bearer ', '');
  if (!token) return null;

  // Tentar JWT primeiro
  const secret = getJwtSecret(env);
  const payload = await verifyJwt(token, secret);

  if (payload && payload.userId) {
    // Buscar usuario atualizado do banco
    const user = await env.DB.prepare(
      'SELECT id, username, nome, admin, instrumento_id, foto_url, ativo FROM usuarios WHERE id = ? AND ativo = 1'
    ).bind(payload.userId).first();

    if (user) {
      // Buscar nome do instrumento se tiver
      if (user.instrumento_id) {
        const instrumento = await env.DB.prepare(
          'SELECT nome FROM instrumentos WHERE id = ?'
        ).bind(user.instrumento_id).first();
        user.instrumento_nome = instrumento?.nome || null;
      }
      return user;
    }
  }

  // Fallback: formato legado "username:pin" (para migracao gradual)
  if (token.includes(':')) {
    const [username, pin] = token.split(':');
    const user = await env.DB.prepare(
      'SELECT id, username, nome, admin, instrumento_id, foto_url, pin, pin_salt, pin_hash, ativo FROM usuarios WHERE username = ? AND ativo = 1'
    ).bind(username).first();

    if (user) {
      // Verificar PIN (formato antigo ou novo)
      let pinValid = false;

      if (user.pin_hash && user.pin_salt) {
        // Novo formato PBKDF2
        const { verifyPin } = await import('../../infrastructure/auth/hashing.js');
        pinValid = await verifyPin(pin, user.pin_hash, user.pin_salt);
      } else if (user.pin === pin) {
        // Formato antigo (plaintext) - migrar para novo
        pinValid = true;
      }

      if (pinValid) {
        if (user.instrumento_id) {
          const instrumento = await env.DB.prepare(
            'SELECT nome FROM instrumentos WHERE id = ?'
          ).bind(user.instrumento_id).first();
          user.instrumento_nome = instrumento?.nome || null;
        }
        return user;
      }
    }
  }

  return null;
}

// Verificar se e admin
export async function verifyAdmin(request, env) {
  const user = await verifyUserFromJwt(request, env);
  if (!user || !user.admin) return null;
  return user;
}

// Verificar se e usuario autenticado (qualquer)
export async function verifyUser(request, env) {
  return await verifyUserFromJwt(request, env);
}
```

**Step 2: Criar index.js**

```javascript
// worker/src/domain/auth/index.js
export * from './authService.js';
```

**Step 3: Commit**

```bash
git add worker/src/domain/auth/
git commit -m "refactor(worker): criar domain auth service"
```

---

### Task 2.2: Criar Login Service

**Files:**
- Create: `worker/src/domain/auth/loginService.js`
- Modify: `worker/src/domain/auth/index.js`

**Step 1: Criar loginService.js**

```javascript
// worker/src/domain/auth/loginService.js
import { createJwt } from '../../infrastructure/auth/jwt.js';
import { hashPin, verifyPin, generateSalt } from '../../infrastructure/auth/hashing.js';
import { checkRateLimit, resetRateLimit } from '../../infrastructure/ratelimit/rateLimiter.js';
import { jsonResponse, errorResponse, getJwtSecret } from '../../infrastructure/response/helpers.js';
import { JWT_EXPIRY_HOURS } from '../../config/index.js';

// Verificar se usuario existe
export async function checkUser(request, env) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== 'string') {
      return errorResponse('Username obrigatorio', 400, request);
    }

    const user = await env.DB.prepare(
      'SELECT id, nome, instrumento_id FROM usuarios WHERE username = ? AND ativo = 1'
    ).bind(username.toLowerCase().trim()).first();

    if (!user) {
      return jsonResponse({ exists: false }, 200, request);
    }

    // Buscar instrumento
    let instrumento = null;
    if (user.instrumento_id) {
      const inst = await env.DB.prepare(
        'SELECT nome FROM instrumentos WHERE id = ?'
      ).bind(user.instrumento_id).first();
      instrumento = inst?.nome || null;
    }

    return jsonResponse({
      exists: true,
      nome: user.nome,
      instrumento
    }, 200, request);
  } catch (e) {
    console.error('Check user error:', e);
    return errorResponse('Erro ao verificar usuario', 500, request);
  }
}

// Login
export async function login(request, env) {
  try {
    const { username, pin } = await request.json();

    if (!username || !pin) {
      return errorResponse('Username e PIN obrigatorios', 400, request);
    }

    // Rate limiting por IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateCheck = await checkRateLimit(env, `login:${ip}`);

    if (!rateCheck.allowed) {
      return errorResponse(
        `Muitas tentativas. Tente novamente em ${rateCheck.retryAfter} segundos.`,
        429,
        request
      );
    }

    // Buscar usuario
    const user = await env.DB.prepare(
      'SELECT id, username, nome, admin, instrumento_id, foto_url, pin, pin_salt, pin_hash FROM usuarios WHERE username = ? AND ativo = 1'
    ).bind(username.toLowerCase().trim()).first();

    if (!user) {
      return errorResponse('Credenciais invalidas', 401, request);
    }

    // Verificar PIN
    let pinValid = false;
    let needsMigration = false;

    if (user.pin_hash && user.pin_salt) {
      pinValid = await verifyPin(pin, user.pin_hash, user.pin_salt);
    } else if (user.pin === pin) {
      pinValid = true;
      needsMigration = true;
    }

    if (!pinValid) {
      return errorResponse('Credenciais invalidas', 401, request);
    }

    // Migrar PIN para novo formato se necessario
    if (needsMigration) {
      const salt = generateSalt();
      const hash = await hashPin(pin, salt);
      await env.DB.prepare(
        'UPDATE usuarios SET pin_hash = ?, pin_salt = ?, pin = NULL WHERE id = ?'
      ).bind(hash, salt, user.id).run();
    }

    // Resetar rate limit apos sucesso
    await resetRateLimit(env, `login:${ip}`);

    // Buscar instrumento
    let instrumento_nome = null;
    if (user.instrumento_id) {
      const inst = await env.DB.prepare(
        'SELECT nome FROM instrumentos WHERE id = ?'
      ).bind(user.instrumento_id).first();
      instrumento_nome = inst?.nome || null;
    }

    // Criar JWT
    const secret = getJwtSecret(env);
    const token = await createJwt({
      userId: user.id,
      username: user.username,
      admin: user.admin
    }, secret);

    return jsonResponse({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        nome: user.nome,
        admin: user.admin,
        instrumento_id: user.instrumento_id,
        instrumento_nome,
        foto_url: user.foto_url
      },
      expiresIn: JWT_EXPIRY_HOURS * 3600
    }, 200, request);
  } catch (e) {
    console.error('Login error:', e);
    return errorResponse('Erro no login', 500, request);
  }
}

// Alterar PIN
export async function changePin(request, env, user) {
  try {
    const { currentPin, newPin } = await request.json();

    if (!currentPin || !newPin) {
      return errorResponse('PIN atual e novo obrigatorios', 400, request);
    }

    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      return errorResponse('Novo PIN deve ter 4 digitos', 400, request);
    }

    // Buscar dados atuais do usuario
    const userData = await env.DB.prepare(
      'SELECT pin, pin_hash, pin_salt FROM usuarios WHERE id = ?'
    ).bind(user.id).first();

    // Verificar PIN atual
    let currentValid = false;
    if (userData.pin_hash && userData.pin_salt) {
      currentValid = await verifyPin(currentPin, userData.pin_hash, userData.pin_salt);
    } else if (userData.pin === currentPin) {
      currentValid = true;
    }

    if (!currentValid) {
      return errorResponse('PIN atual incorreto', 401, request);
    }

    // Gerar novo hash
    const salt = generateSalt();
    const hash = await hashPin(newPin, salt);

    await env.DB.prepare(
      'UPDATE usuarios SET pin_hash = ?, pin_salt = ?, pin = NULL WHERE id = ?'
    ).bind(hash, salt, user.id).run();

    return jsonResponse({ success: true, message: 'PIN alterado com sucesso' }, 200, request);
  } catch (e) {
    console.error('Change PIN error:', e);
    return errorResponse('Erro ao alterar PIN', 500, request);
  }
}
```

**Step 2: Atualizar index.js**

```javascript
// worker/src/domain/auth/index.js
export * from './authService.js';
export * from './loginService.js';
```

**Step 3: Commit**

```bash
git add worker/src/domain/auth/
git commit -m "refactor(worker): criar login service com JWT e migracao PBKDF2"
```

---

### Task 2.3: Criar Atividades Service

**Files:**
- Create: `worker/src/domain/atividades/atividadeService.js`
- Create: `worker/src/domain/atividades/index.js`

**Step 1: Criar atividadeService.js**

```javascript
// worker/src/domain/atividades/atividadeService.js
import { jsonResponse, errorResponse } from '../../infrastructure/response/helpers.js';

// Registrar atividade (helper usado por outros services)
export async function registrarAtividade(env, tipo, titulo, detalhes = null, usuarioId = null) {
  try {
    await env.DB.prepare(
      'INSERT INTO atividades (tipo, titulo, detalhes, usuario_id, criado_em) VALUES (?, ?, ?, ?, datetime("now"))'
    ).bind(tipo, titulo, detalhes, usuarioId).run();
  } catch (e) {
    console.error('Erro ao registrar atividade:', e);
  }
}

// Listar atividades recentes
export async function getAtividades(request, env, limit = 20) {
  try {
    const { results } = await env.DB.prepare(
      `SELECT a.id, a.tipo, a.titulo, a.detalhes, a.criado_em, u.nome as usuario_nome
       FROM atividades a
       LEFT JOIN usuarios u ON a.usuario_id = u.id
       ORDER BY a.criado_em DESC
       LIMIT ?`
    ).bind(limit).all();

    return jsonResponse(results, 200, request);
  } catch (e) {
    console.error('Get atividades error:', e);
    return errorResponse('Erro ao buscar atividades', 500, request);
  }
}

// Listar atividades do usuario
export async function getAtividadesUsuario(request, env, user) {
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, tipo, titulo, detalhes, criado_em
       FROM atividades
       WHERE usuario_id = ?
       ORDER BY criado_em DESC
       LIMIT 50`
    ).bind(user.id).all();

    return jsonResponse(results, 200, request);
  } catch (e) {
    console.error('Get atividades usuario error:', e);
    return errorResponse('Erro ao buscar atividades', 500, request);
  }
}
```

**Step 2: Criar index.js**

```javascript
// worker/src/domain/atividades/index.js
export * from './atividadeService.js';
```

**Step 3: Commit**

```bash
git add worker/src/domain/atividades/
git commit -m "refactor(worker): criar atividades service"
```

---

### Task 2.4: Criar Favoritos Service

**Files:**
- Create: `worker/src/domain/favoritos/favoritoService.js`
- Create: `worker/src/domain/favoritos/index.js`

**Step 1: Criar favoritoService.js**

```javascript
// worker/src/domain/favoritos/favoritoService.js
import { jsonResponse, errorResponse } from '../../infrastructure/response/helpers.js';
import { registrarAtividade } from '../atividades/atividadeService.js';

// Listar favoritos do usuario (com dados da partitura)
export async function getFavoritos(request, env, user) {
  try {
    const { results } = await env.DB.prepare(
      `SELECT p.id, p.titulo, p.compositor, p.categoria_id, c.nome as categoria_nome, f.criado_em
       FROM favoritos f
       JOIN partituras p ON f.partitura_id = p.id
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE f.usuario_id = ? AND p.ativo = 1
       ORDER BY f.criado_em DESC`
    ).bind(user.id).all();

    return jsonResponse(results, 200, request);
  } catch (e) {
    console.error('Get favoritos error:', e);
    return errorResponse('Erro ao buscar favoritos', 500, request);
  }
}

// Listar apenas IDs dos favoritos (para checagem rapida)
export async function getFavoritosIds(request, env, user) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT partitura_id FROM favoritos WHERE usuario_id = ?'
    ).bind(user.id).all();

    return jsonResponse(results.map(r => r.partitura_id), 200, request);
  } catch (e) {
    console.error('Get favoritos ids error:', e);
    return errorResponse('Erro ao buscar favoritos', 500, request);
  }
}

// Adicionar favorito
export async function addFavorito(partituraId, request, env, user) {
  try {
    // Verificar se partitura existe
    const partitura = await env.DB.prepare(
      'SELECT id, titulo FROM partituras WHERE id = ? AND ativo = 1'
    ).bind(partituraId).first();

    if (!partitura) {
      return errorResponse('Partitura nao encontrada', 404, request);
    }

    // Verificar se ja e favorito
    const existing = await env.DB.prepare(
      'SELECT id FROM favoritos WHERE usuario_id = ? AND partitura_id = ?'
    ).bind(user.id, partituraId).first();

    if (existing) {
      return jsonResponse({ success: true, message: 'Ja e favorito' }, 200, request);
    }

    // Adicionar
    await env.DB.prepare(
      'INSERT INTO favoritos (usuario_id, partitura_id, criado_em) VALUES (?, ?, datetime("now"))'
    ).bind(user.id, partituraId).run();

    // Registrar atividade
    await registrarAtividade(env, 'favorito_add', partitura.titulo, null, user.id);

    return jsonResponse({ success: true }, 201, request);
  } catch (e) {
    console.error('Add favorito error:', e);
    return errorResponse('Erro ao adicionar favorito', 500, request);
  }
}

// Remover favorito
export async function removeFavorito(partituraId, request, env, user) {
  try {
    await env.DB.prepare(
      'DELETE FROM favoritos WHERE usuario_id = ? AND partitura_id = ?'
    ).bind(user.id, partituraId).run();

    return jsonResponse({ success: true }, 200, request);
  } catch (e) {
    console.error('Remove favorito error:', e);
    return errorResponse('Erro ao remover favorito', 500, request);
  }
}
```

**Step 2: Criar index.js**

```javascript
// worker/src/domain/favoritos/index.js
export * from './favoritoService.js';
```

**Step 3: Commit**

```bash
git add worker/src/domain/favoritos/
git commit -m "refactor(worker): criar favoritos service"
```

---

## Fase 3: Router e Integracao (Proximas Tasks)

### Task 3.1: Criar Router Class

**Files:**
- Create: `worker/src/routes/router.js`

**Descricao:** Criar classe Router que suporta:
- Registro de rotas por method + path
- Path params (/api/partituras/:id)
- Middleware pipeline
- CORS preflight automatico

---

### Task 3.2: Criar Route Files

**Files:**
- Create: `worker/src/routes/authRoutes.js`
- Create: `worker/src/routes/partituraRoutes.js`
- Create: `worker/src/routes/categoriaRoutes.js`
- Create: `worker/src/routes/usuarioRoutes.js`
- Create: `worker/src/routes/favoritoRoutes.js`
- Create: `worker/src/routes/atividadeRoutes.js`
- Create: `worker/src/routes/adminRoutes.js`
- Create: `worker/src/routes/healthRoutes.js`
- Create: `worker/src/routes/index.js`

---

### Task 3.3: Criar Middleware

**Files:**
- Create: `worker/src/middleware/corsMiddleware.js`
- Create: `worker/src/middleware/authMiddleware.js`
- Create: `worker/src/middleware/adminMiddleware.js`
- Create: `worker/src/middleware/index.js`

---

### Task 3.4: Atualizar Entry Point

**Files:**
- Modify: `worker/index.js`

**Descricao:** Refatorar o index.js principal para:
1. Importar router configurado
2. Delegar fetch handler para router
3. Manter compatibilidade com wrangler.toml

---

## Fase 4: Domain Services Restantes

### Task 4.1: Partituras Service
### Task 4.2: Partes Service
### Task 4.3: Download Service
### Task 4.4: Categorias Service
### Task 4.5: Usuarios Service (Admin)
### Task 4.6: Perfil Service
### Task 4.7: Estatisticas Service
### Task 4.8: Instrumentos Service

---

## Fase 5: Testes e Validacao

### Task 5.1: Testar localmente com wrangler dev
### Task 5.2: Rodar testes do frontend
### Task 5.3: Deploy e validacao em producao

---

## Checklist de Validacao Final

- [ ] Todas as rotas funcionando identico ao original
- [ ] JWT login/verificacao funcionando
- [ ] PBKDF2 hash funcionando
- [ ] Rate limiting funcionando
- [ ] CORS funcionando para todos dominios
- [ ] Upload de arquivos funcionando
- [ ] Download de PDFs funcionando
- [ ] Testes do frontend passando
- [ ] Build de producao OK
- [ ] Deploy bem sucedido

---

## Notas Importantes

1. **Manter compatibilidade:** O refactoring deve ser transparente - mesmas rotas, mesmas respostas
2. **Testar incrementalmente:** Cada fase deve ser testada antes de prosseguir
3. **Ambiente local:** Usar `npm run api` para testar (conforme CLAUDE.md)
4. **Commits frequentes:** Um commit por task completada
5. **Nao quebrar producao:** Testar exaustivamente antes de deploy
