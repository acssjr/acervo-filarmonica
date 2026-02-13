/**
 * ACERVO DIGITAL - API
 * Sociedade Filarmônica 25 de Março
 *
 * Cloudflare Worker para gerenciar partituras
 *
 * SEGURANÇA:
 * - JWT com HMAC SHA-256 (Web Crypto API)
 * - Hash de PIN com PBKDF2 (100.000 iterações)
 * - CORS com whitelist de domínios
 * - Rate limiting no login
 */

// ============ CONFIGURAÇÃO ============

// Domínios permitidos para CORS
const ALLOWED_ORIGINS = [
  'https://acervo.filarmonica25demarco.com',
  'https://acervo-filarmonica.pages.dev',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
];

// Padrão para subdomínios do Cloudflare Pages (ex: abc123.acervo-filarmonica.pages.dev)
const PAGES_SUBDOMAIN_PATTERN = /^https:\/\/[a-z0-9]+\.acervo-filarmonica\.pages\.dev$/;

// Configuração JWT
const JWT_EXPIRY_HOURS = 24;
const JWT_ALGORITHM = 'HS256';

// Configuração PBKDF2
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEY_LENGTH = 256;

// Rate limiting
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_SECONDS = 300; // 5 minutos

// ============ HELPERS DE SEGURANÇA ============

// Verifica se origem é permitida
function isOriginAllowed(origin) {
  if (!origin) return false;
  // Verifica lista estática
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Verifica padrão de subdomínios do Pages
  if (PAGES_SUBDOMAIN_PATTERN.test(origin)) return true;
  return false;
}

// Gera CORS headers baseado na origem
function getCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };

  if (origin && isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  } else if (!origin) {
    // Requisições sem origin (ex: curl, postman) - permite em dev
    headers['Access-Control-Allow-Origin'] = '*';
  }

  return headers;
}

// Base64 URL encode/decode
function base64UrlEncode(data) {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function stringToArrayBuffer(str) {
  return new TextEncoder().encode(str);
}

function arrayBufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToArrayBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// ============ JWT (Web Crypto API) ============

async function createJwt(payload, secret) {
  const header = { alg: JWT_ALGORITHM, typ: 'JWT' };

  // Adiciona expiração
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (JWT_EXPIRY_HOURS * 60 * 60);
  const fullPayload = { ...payload, iat: now, exp };

  const headerB64 = base64UrlEncode(stringToArrayBuffer(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(stringToArrayBuffer(JSON.stringify(fullPayload)));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Criar chave HMAC
  const key = await crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Assinar
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    stringToArrayBuffer(unsignedToken)
  );

  const signatureB64 = base64UrlEncode(signature);
  return `${unsignedToken}.${signatureB64}`;
}

async function verifyJwt(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const unsignedToken = `${headerB64}.${payloadB64}`;

    // Verificar assinatura
    const key = await crypto.subtle.importKey(
      'raw',
      stringToArrayBuffer(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signature = base64UrlDecode(signatureB64);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      stringToArrayBuffer(unsignedToken)
    );

    if (!isValid) return null;

    // Decodificar payload
    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload = JSON.parse(payloadJson);

    // Verificar expiração
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Token expirado
    }

    return payload;
  } catch (e) {
    console.error('Erro ao verificar JWT:', e);
    return null;
  }
}

// ============ PBKDF2 HASH (Web Crypto API) ============

async function hashPin(pin, salt) {
  const pinBuffer = stringToArrayBuffer(pin);
  const saltBuffer = stringToArrayBuffer(salt);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    pinBuffer,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: saltBuffer,
      iterations: PBKDF2_ITERATIONS,
    },
    keyMaterial,
    PBKDF2_KEY_LENGTH
  );

  return arrayBufferToHex(derivedBits);
}

async function verifyPin(pin, storedHash, salt) {
  const computedHash = await hashPin(pin, salt);
  return computedHash === storedHash;
}

// Gera salt aleatório
function generateSalt() {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  return arrayBufferToHex(saltBytes);
}

// ============ RATE LIMITING ============

async function checkRateLimit(env, key) {
  // Se não tiver KV configurado, permite (para não quebrar)
  if (!env.RATE_LIMIT) {
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS };
  }

  const now = Date.now();
  const windowKey = `ratelimit:${key}`;

  try {
    const data = await env.RATE_LIMIT.get(windowKey, { type: 'json' });

    if (!data) {
      // Primeira tentativa
      await env.RATE_LIMIT.put(windowKey, JSON.stringify({
        count: 1,
        firstAttempt: now
      }), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });

      return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - 1 };
    }

    // Verifica se janela expirou
    if (now - data.firstAttempt > RATE_LIMIT_WINDOW_SECONDS * 1000) {
      // Nova janela
      await env.RATE_LIMIT.put(windowKey, JSON.stringify({
        count: 1,
        firstAttempt: now
      }), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });

      return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - 1 };
    }

    // Dentro da janela
    if (data.count >= MAX_LOGIN_ATTEMPTS) {
      const retryAfter = Math.ceil((data.firstAttempt + RATE_LIMIT_WINDOW_SECONDS * 1000 - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter };
    }

    // Incrementa contador
    await env.RATE_LIMIT.put(windowKey, JSON.stringify({
      count: data.count + 1,
      firstAttempt: data.firstAttempt
    }), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });

    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS - data.count - 1 };

  } catch (e) {
    console.error('Erro no rate limiting:', e);
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS }; // Em caso de erro, permite
  }
}

async function resetRateLimit(env, key) {
  if (!env.RATE_LIMIT) return;

  try {
    await env.RATE_LIMIT.delete(`ratelimit:${key}`);
  } catch (e) {
    // Ignora erro
  }
}

// ============ HELPERS GERAIS ============

// Helper: Resposta JSON
function jsonResponse(data, status = 200, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...getCorsHeaders(request),
    },
  });
}

// Helper: Erro
function errorResponse(message, status = 400, request) {
  return jsonResponse({ error: message }, status, request);
}

// Helper: Registrar atividade
async function registrarAtividade(env, tipo, titulo, detalhes = null, usuarioId = null) {
  try {
    await env.DB.prepare(`
      INSERT INTO atividades (tipo, titulo, detalhes, usuario_id)
      VALUES (?, ?, ?, ?)
    `).bind(tipo, titulo, detalhes, usuarioId).run();
  } catch (e) {
    console.error('Erro ao registrar atividade:', e);
  }
}

// Helper: Obter secret JWT do ambiente
function getJwtSecret(env) {
  // Usa variável de ambiente ou gera baseado no database_id
  return env.JWT_SECRET || `acervo-jwt-secret-${env.DB?.databaseId || 'default'}`;
}

// ============ AUTENTICAÇÃO ============

// Verificar JWT e retornar usuário
async function verifyUserFromJwt(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  // Tenta verificar como JWT primeiro
  const payload = await verifyJwt(token, getJwtSecret(env));

  if (payload && payload.userId) {
    // Token JWT válido - busca usuário
    const user = await env.DB.prepare(
      'SELECT * FROM usuarios WHERE id = ? AND ativo = 1'
    ).bind(payload.userId).first();

    if (user) {
      user._isAdmin = payload.isAdmin || false;
    }

    return user;
  }

  // Fallback: tenta o formato antigo (username:pin) para compatibilidade
  // TODO: Remover após migração completa
  if (token.includes(':')) {
    const [username, pin] = token.split(':');

    // Busca usuário
    const user = await env.DB.prepare(
      'SELECT * FROM usuarios WHERE username = ? AND ativo = 1'
    ).bind(username).first();

    if (!user) return null;

    // Verifica PIN
    // Se pin_salt existe, usa PBKDF2; senão, compara direto (legado)
    if (user.pin_salt) {
      const isValid = await verifyPin(pin, user.pin_hash, user.pin_salt);
      if (!isValid) return null;
    } else {
      // Formato legado (plaintext) - ainda suporta para migração
      if (user.pin_hash !== pin) return null;
    }

    return user;
  }

  return null;
}

// Verificar autenticação admin
async function verifyAdmin(request, env) {
  const user = await verifyUserFromJwt(request, env);
  if (!user) return null;
  if (user.admin !== 1 && !user._isAdmin) return null;
  return user;
}

// Verificar autenticação usuário (qualquer usuário logado)
async function verifyUser(request, env) {
  return await verifyUserFromJwt(request, env);
}

// ============ PARTITURAS ============

// Listar todas as partituras
async function getPartituras(request, env) {
  const url = new URL(request.url);
  const categoria = url.searchParams.get('categoria');
  const busca = url.searchParams.get('busca');
  const destaque = url.searchParams.get('destaque');

  let query = `
    SELECT p.*, c.nome as categoria_nome, c.emoji as categoria_emoji, c.cor as categoria_cor,
           (SELECT COUNT(*) FROM partes WHERE partitura_id = p.id) as total_partes
    FROM partituras p
    JOIN categorias c ON p.categoria_id = c.id
    WHERE p.ativo = 1
  `;
  const params = [];

  if (categoria) {
    query += ' AND p.categoria_id = ?';
    params.push(categoria);
  }

  if (busca) {
    query += ' AND (p.titulo LIKE ? OR p.compositor LIKE ?)';
    params.push(`%${busca}%`, `%${busca}%`);
  }

  if (destaque === '1') {
    query += ' AND p.destaque = 1';
  }

  query += ' ORDER BY p.titulo ASC';

  const stmt = env.DB.prepare(query);
  const result = await (params.length ? stmt.bind(...params) : stmt).all();

  return jsonResponse(result.results, 200, request);
}

// Obter uma partitura
async function getPartitura(id, request, env) {
  const result = await env.DB.prepare(`
    SELECT p.*, c.nome as categoria_nome, c.emoji as categoria_emoji, c.cor as categoria_cor
    FROM partituras p
    JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ? AND p.ativo = 1
  `).bind(id).first();

  if (!result) {
    return errorResponse('Partitura não encontrada', 404, request);
  }

  return jsonResponse(result, 200, request);
}

// Download de partitura - REQUER AUTENTICAÇÃO
async function downloadPartitura(id, request, env) {
  // Verifica autenticação
  const user = await verifyUser(request, env);
  if (!user) {
    return errorResponse('Autenticação necessária para download', 401, request);
  }

  try {
    const partitura = await env.DB.prepare(
      'SELECT * FROM partituras WHERE id = ? AND ativo = 1'
    ).bind(id).first();

    if (!partitura) {
      return errorResponse('Partitura não encontrada', 404, request);
    }

    const arquivo = await env.BUCKET.get(partitura.arquivo_nome);

    if (!arquivo) {
      return errorResponse('Arquivo não encontrado', 404, request);
    }

    await env.DB.prepare(
      'UPDATE partituras SET downloads = downloads + 1 WHERE id = ?'
    ).bind(id).run();

    // Registra atividade de download
    await registrarAtividade(env, 'download', partitura.titulo, null, user.id);

    // Log de download
    try {
      await env.DB.prepare(
        'INSERT INTO logs_download (partitura_id, instrumento_id, ip) VALUES (?, NULL, ?)'
      ).bind(id, request.headers.get('CF-Connecting-IP')).run();
    } catch (logError) {
      console.error('Erro ao registrar log:', logError);
    }

    return new Response(arquivo.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${partitura.titulo}.pdf"`,
        ...getCorsHeaders(request),
      },
    });
  } catch (error) {
    return errorResponse('Erro no download', 500, request);
  }
}

// Download de uma parte específica - REQUER AUTENTICAÇÃO
async function downloadParte(parteId, request, env) {
  // Verifica autenticação
  const user = await verifyUser(request, env);
  if (!user) {
    return errorResponse('Autenticação necessária para download', 401, request);
  }

  try {
    const parte = await env.DB.prepare(`
      SELECT p.*, pt.titulo as partitura_titulo, pt.id as partitura_id
      FROM partes p
      JOIN partituras pt ON p.partitura_id = pt.id
      WHERE p.id = ? AND pt.ativo = 1
    `).bind(parteId).first();

    if (!parte) {
      return errorResponse('Parte não encontrada', 404, request);
    }

    const arquivo = await env.BUCKET.get(parte.arquivo_nome);

    if (!arquivo) {
      return errorResponse('Arquivo não encontrado no storage', 404, request);
    }

    // Incrementa downloads da partitura
    await env.DB.prepare(
      'UPDATE partituras SET downloads = downloads + 1 WHERE id = ?'
    ).bind(parte.partitura_id).run();

    // Registra atividade de download
    await registrarAtividade(env, 'download', parte.partitura_titulo, parte.instrumento, user.id);

    // Log de download
    try {
      await env.DB.prepare(
        'INSERT INTO logs_download (partitura_id, instrumento_id, ip) VALUES (?, NULL, ?)'
      ).bind(parte.partitura_id, request.headers.get('CF-Connecting-IP')).run();
    } catch (logError) {
      console.error('Erro ao registrar log:', logError);
    }

    const nomeArquivo = `${parte.partitura_titulo} - ${parte.instrumento}.pdf`;

    // Usa Content-Disposition: inline quando requisicao eh AJAX (X-Requested-With)
    // Isso evita que gerenciadores de download (IDM, etc) interceptem a requisicao
    const isAjaxRequest = request.headers.get('X-Requested-With') === 'XMLHttpRequest';
    const disposition = isAjaxRequest ? 'inline' : 'attachment';

    return new Response(arquivo.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename="${nomeArquivo}"`,
        // Cache-Control: no-cache para sempre buscar versão atualizada
        // (importante quando admin substitui uma parte)
        'Cache-Control': 'private, no-cache',
        ...getCorsHeaders(request),
      },
    });
  } catch (error) {
    return errorResponse('Erro no download', 500, request);
  }
}

// Criar partitura (Admin)
async function createPartitura(request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  const formData = await request.formData();
  const titulo = formData.get('titulo');
  const compositor = formData.get('compositor');
  const arranjador = formData.get('arranjador');
  const categoria = formData.get('categoria');
  const ano = formData.get('ano');
  const descricao = formData.get('descricao');
  const destaque = formData.get('destaque') === '1' ? 1 : 0;
  const arquivo = formData.get('arquivo');

  if (!titulo || !compositor || !categoria || !arquivo) {
    return errorResponse('Campos obrigatórios: titulo, compositor, categoria, arquivo', 400, request);
  }

  const timestamp = Date.now();
  const nomeArquivo = `${timestamp}_${arquivo.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  await env.BUCKET.put(nomeArquivo, arquivo.stream(), {
    httpMetadata: { contentType: 'application/pdf' },
  });

  const result = await env.DB.prepare(`
    INSERT INTO partituras (titulo, compositor, arranjador, categoria_id, ano, descricao, arquivo_nome, arquivo_tamanho, destaque)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    titulo,
    compositor,
    arranjador || null,
    categoria,
    ano ? parseInt(ano) : null,
    descricao || null,
    nomeArquivo,
    arquivo.size,
    destaque
  ).run();

  // Registra atividade
  await registrarAtividade(env, 'nova_partitura', titulo, compositor, admin.id);

  return jsonResponse({
    success: true,
    id: result.meta.last_row_id,
    message: 'Partitura adicionada com sucesso!'
  }, 201, request);
}

// Upload de pasta com múltiplas partes (Admin)
async function uploadPastaPartitura(request, env) {
  try {
    const admin = await verifyAdmin(request, env);
    if (!admin) {
      return errorResponse('Não autorizado', 401, request);
    }

    const formData = await request.formData();
    const titulo = formData.get('titulo');
    const compositor = formData.get('compositor') || '';
    const arranjador = formData.get('arranjador') || '';
    const categoria = formData.get('categoria');
    const ano = formData.get('ano');
    const totalArquivos = parseInt(formData.get('total_arquivos') || '0');

    if (!titulo || !categoria || totalArquivos === 0) {
      return errorResponse('Campos obrigatórios: titulo, categoria, arquivos', 400, request);
    }

    // Cria a partitura principal
    const result = await env.DB.prepare(`
      INSERT INTO partituras (titulo, compositor, arranjador, categoria_id, ano, arquivo_nome, arquivo_tamanho, destaque)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `).bind(
      titulo,
      compositor,
      arranjador || null,
      categoria,
      ano ? parseInt(ano) : null,
      'multiplas_partes',
      0
    ).run();

    const partituraId = result.meta.last_row_id;
    const timestamp = Date.now();
    let partesAdicionadas = 0;

    // Processa cada arquivo
    for (let i = 0; i < totalArquivos; i++) {
      const arquivo = formData.get(`arquivo_${i}`);
      const instrumento = formData.get(`instrumento_${i}`);

      if (!arquivo || !instrumento) continue;

      const arrayBuffer = await arquivo.arrayBuffer();

      // Validar magic bytes do PDF (%PDF-)
      const bytes = new Uint8Array(arrayBuffer.slice(0, 5));
      const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2D;

      if (!isPdf) {
        // Se arquivo inválido, deleta a partitura criada e retorna erro
        await env.DB.prepare('DELETE FROM partituras WHERE id = ?').bind(partituraId).run();
        return errorResponse(`Arquivo "${arquivo.name}" não é um PDF válido`, 400, request);
      }

      const nomeArquivoStorage = `${timestamp}_${partituraId}_${instrumento.replace(/[^a-zA-Z0-9.-]/g, '_')}.pdf`;

      await env.BUCKET.put(nomeArquivoStorage, arrayBuffer, {
        httpMetadata: { contentType: 'application/pdf' }
      });

      await env.DB.prepare(`
        INSERT INTO partes (partitura_id, instrumento, arquivo_nome)
        VALUES (?, ?, ?)
      `).bind(partituraId, instrumento, nomeArquivoStorage).run();

      partesAdicionadas++;
    }

    await registrarAtividade(env, 'nova_partitura', titulo, `${compositor} • ${partesAdicionadas} partes`, admin.id);

    return jsonResponse({
      success: true,
      id: partituraId,
      partes_criadas: partesAdicionadas,
      message: `Partitura criada com ${partesAdicionadas} partes!`
    }, 201, request);

  } catch (error) {
    console.error('Erro no upload:', error);
    return errorResponse('Erro no upload', 500, request);
  }
}

// Listar partes de uma partitura
async function getPartesPartitura(partituraId, request, env) {
  const partes = await env.DB.prepare(`
    SELECT id, instrumento, arquivo_nome, criado_em
    FROM partes
    WHERE partitura_id = ?
    ORDER BY
      CASE
        WHEN instrumento = 'Grade' THEN 0
        WHEN instrumento LIKE 'Flautim%' THEN 1
        WHEN instrumento LIKE 'Flauta%' THEN 2
        WHEN instrumento LIKE 'Requinta%' THEN 3
        WHEN instrumento LIKE 'Clarinete%' THEN 4
        WHEN instrumento LIKE 'Sax. Soprano%' THEN 5
        WHEN instrumento LIKE 'Sax. Alto%' THEN 6
        WHEN instrumento LIKE 'Sax. Tenor%' THEN 7
        WHEN instrumento LIKE 'Sax. Barítono%' THEN 8
        WHEN instrumento LIKE 'Trompete%' THEN 9
        WHEN instrumento LIKE 'Trompa F%' THEN 10
        WHEN instrumento LIKE 'Trompa Eb%' THEN 11
        WHEN instrumento LIKE 'Barítono%' THEN 12
        WHEN instrumento LIKE 'Trombone%' THEN 13
        WHEN instrumento LIKE 'Bombardino%' THEN 14
        WHEN instrumento LIKE 'Baixo%' THEN 15
        WHEN instrumento LIKE 'Caixa%' THEN 16
        WHEN instrumento LIKE 'Bombo%' THEN 17
        WHEN instrumento LIKE 'Pratos%' THEN 18
        ELSE 99
      END,
      instrumento
  `).bind(partituraId).all();

  return jsonResponse(partes.results, 200, request);
}

// Adicionar nova parte a uma partitura (Admin)
async function addParte(partituraId, request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  try {
    const formData = await request.formData();
    const instrumento = formData.get('instrumento');
    const arquivo = formData.get('arquivo');

    if (!instrumento || !arquivo) {
      return errorResponse('Instrumento e arquivo são obrigatórios', 400, request);
    }

    const partitura = await env.DB.prepare(
      'SELECT * FROM partituras WHERE id = ?'
    ).bind(partituraId).first();

    if (!partitura) {
      return errorResponse('Partitura não encontrada', 404, request);
    }

    const arrayBuffer = await arquivo.arrayBuffer();

    // Validar magic bytes do PDF (%PDF-)
    const bytes = new Uint8Array(arrayBuffer.slice(0, 5));
    const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2D;

    if (!isPdf) {
      return errorResponse('Arquivo não é um PDF válido', 400, request);
    }

    const timestamp = Date.now();
    const nomeArquivoStorage = `${timestamp}_${partituraId}_${instrumento.replace(/[^a-zA-Z0-9.-]/g, '_')}.pdf`;

    await env.BUCKET.put(nomeArquivoStorage, arrayBuffer, {
      httpMetadata: { contentType: 'application/pdf' }
    });

    const result = await env.DB.prepare(`
      INSERT INTO partes (partitura_id, instrumento, arquivo_nome)
      VALUES (?, ?, ?)
    `).bind(partituraId, instrumento, nomeArquivoStorage).run();

    return jsonResponse({
      success: true,
      id: result.meta.last_row_id,
      message: 'Parte adicionada com sucesso!'
    }, 201, request);

  } catch (error) {
    return errorResponse('Erro ao adicionar parte', 500, request);
  }
}

// Substituir arquivo de uma parte (Admin)
async function substituirParte(parteId, request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  try {
    const formData = await request.formData();
    const arquivo = formData.get('arquivo');

    if (!arquivo) {
      return errorResponse('Arquivo é obrigatório', 400, request);
    }

    const parte = await env.DB.prepare(
      'SELECT * FROM partes WHERE id = ?'
    ).bind(parteId).first();

    if (!parte) {
      return errorResponse('Parte não encontrada', 404, request);
    }

    const arrayBuffer = await arquivo.arrayBuffer();

    // Validar magic bytes do PDF (%PDF-)
    const bytes = new Uint8Array(arrayBuffer.slice(0, 5));
    const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2D;

    if (!isPdf) {
      return errorResponse('Arquivo não é um PDF válido', 400, request);
    }

    if (parte.arquivo_nome) {
      await env.BUCKET.delete(parte.arquivo_nome);
    }

    const timestamp = Date.now();
    const nomeArquivoStorage = `${timestamp}_${parte.partitura_id}_${parte.instrumento.replace(/[^a-zA-Z0-9.-]/g, '_')}.pdf`;

    await env.BUCKET.put(nomeArquivoStorage, arrayBuffer, {
      httpMetadata: { contentType: 'application/pdf' }
    });

    await env.DB.prepare(`
      UPDATE partes SET arquivo_nome = ?, criado_em = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(nomeArquivoStorage, parteId).run();

    return jsonResponse({ success: true, message: 'Parte substituída com sucesso!' }, 200, request);

  } catch (error) {
    return errorResponse('Erro ao substituir parte', 500, request);
  }
}

// Remover uma parte (Admin)
async function deleteParte(parteId, request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  try {
    const parte = await env.DB.prepare(
      'SELECT * FROM partes WHERE id = ?'
    ).bind(parteId).first();

    if (!parte) {
      return errorResponse('Parte não encontrada', 404, request);
    }

    if (parte.arquivo_nome) {
      await env.BUCKET.delete(parte.arquivo_nome);
    }

    await env.DB.prepare('DELETE FROM partes WHERE id = ?').bind(parteId).run();

    return jsonResponse({ success: true, message: 'Parte removida com sucesso!' }, 200, request);

  } catch (error) {
    return errorResponse('Erro ao remover parte', 500, request);
  }
}

// Atualizar partitura (Admin)
async function updatePartitura(id, request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  const data = await request.json();
  const { titulo, compositor, arranjador, categoria, categoria_id, ano, descricao, destaque } = data;

  const categoriaFinal = categoria || categoria_id;

  await env.DB.prepare(`
    UPDATE partituras
    SET titulo = ?, compositor = ?, arranjador = ?, categoria_id = ?, ano = ?, descricao = ?, destaque = ?, atualizado_em = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    titulo,
    compositor,
    arranjador || null,
    categoriaFinal,
    ano || null,
    descricao || null,
    destaque ? 1 : 0,
    id
  ).run();

  return jsonResponse({ success: true, message: 'Partitura atualizada!' }, 200, request);
}

// Deletar partitura (Admin) - soft delete
async function deletePartitura(id, request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  await env.DB.prepare(
    'UPDATE partituras SET ativo = 0, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(id).run();

  return jsonResponse({ success: true, message: 'Partitura removida!' }, 200, request);
}

// ============ CATEGORIAS E INSTRUMENTOS ============

async function getCategorias(request, env) {
  const result = await env.DB.prepare(`
    SELECT c.*, COUNT(p.id) as total_partituras
    FROM categorias c
    LEFT JOIN partituras p ON c.id = p.categoria_id AND p.ativo = 1
    GROUP BY c.id
    ORDER BY c.ordem ASC
  `).all();
  return jsonResponse(result.results, 200, request);
}

async function createCategoria(request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  const { id, nome, emoji, cor, descricao } = await request.json();

  if (!id || !nome || !emoji || !cor) {
    return errorResponse('Campos obrigatórios: id, nome, emoji, cor', 400, request);
  }

  if (!/^[a-z0-9-]+$/.test(id)) {
    return errorResponse('ID deve conter apenas letras minúsculas, números e hífen', 400, request);
  }

  const exists = await env.DB.prepare(
    'SELECT id FROM categorias WHERE id = ?'
  ).bind(id).first();

  if (exists) {
    return errorResponse('Este ID de categoria já existe', 400, request);
  }

  const maxOrdem = await env.DB.prepare(
    'SELECT MAX(ordem) as max FROM categorias'
  ).first();
  const novaOrdem = (maxOrdem?.max || 0) + 1;

  await env.DB.prepare(`
    INSERT INTO categorias (id, nome, emoji, cor, descricao, ordem)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(id, nome, emoji, cor, descricao || null, novaOrdem).run();

  return jsonResponse({
    success: true,
    message: 'Categoria criada com sucesso!'
  }, 201, request);
}

async function updateCategoria(id, request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  const { nome, emoji, cor, descricao, ordem } = await request.json();

  const updates = [];
  const params = [];

  if (nome !== undefined) {
    updates.push('nome = ?');
    params.push(nome);
  }
  if (emoji !== undefined) {
    updates.push('emoji = ?');
    params.push(emoji);
  }
  if (cor !== undefined) {
    updates.push('cor = ?');
    params.push(cor);
  }
  if (descricao !== undefined) {
    updates.push('descricao = ?');
    params.push(descricao || null);
  }
  if (ordem !== undefined) {
    updates.push('ordem = ?');
    params.push(ordem);
  }

  if (updates.length === 0) {
    return errorResponse('Nenhum campo para atualizar', 400, request);
  }

  params.push(id);

  await env.DB.prepare(`
    UPDATE categorias SET ${updates.join(', ')} WHERE id = ?
  `).bind(...params).run();

  return jsonResponse({ success: true, message: 'Categoria atualizada!' }, 200, request);
}

async function deleteCategoria(id, request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  const partituras = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM partituras WHERE categoria_id = ? AND ativo = 1'
  ).bind(id).first();

  if (partituras.count > 0) {
    return errorResponse(`Não é possível remover: ${partituras.count} partitura(s) vinculada(s)`, 400, request);
  }

  await env.DB.prepare('DELETE FROM categorias WHERE id = ?').bind(id).run();

  return jsonResponse({ success: true, message: 'Categoria removida!' }, 200, request);
}

async function reorderCategorias(request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  const { ordens } = await request.json();

  if (!ordens || !Array.isArray(ordens)) {
    return errorResponse('Formato inválido', 400, request);
  }

  for (const item of ordens) {
    await env.DB.prepare(
      'UPDATE categorias SET ordem = ? WHERE id = ?'
    ).bind(item.ordem, item.id).run();
  }

  return jsonResponse({ success: true, message: 'Ordem atualizada!' }, 200, request);
}

async function getInstrumentos(request, env) {
  const result = await env.DB.prepare(
    'SELECT * FROM instrumentos ORDER BY ordem ASC'
  ).all();
  return jsonResponse(result.results, 200, request);
}

async function getEstatisticas(request, env) {
  const result = await env.DB.prepare('SELECT * FROM v_estatisticas').first();
  return jsonResponse(result, 200, request);
}

async function getEstatisticasAdmin(request, env) {
  const basico = await env.DB.prepare('SELECT * FROM v_estatisticas').first();

  const usuariosAtivos = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM usuarios WHERE ativo = 1 AND admin = 0'
  ).first();

  const ultimosDownloads = await env.DB.prepare(`
    SELECT l.*, p.titulo, u.nome as usuario_nome
    FROM logs_download l
    JOIN partituras p ON l.partitura_id = p.id
    LEFT JOIN usuarios u ON l.ip = u.username
    ORDER BY l.data DESC
    LIMIT 10
  `).all();

  const topPartituras = await env.DB.prepare(`
    SELECT id, titulo, compositor, downloads
    FROM partituras
    WHERE ativo = 1
    ORDER BY downloads DESC
    LIMIT 5
  `).all();

  return jsonResponse({
    ...basico,
    musicos_ativos: usuariosAtivos.count,
    ultimos_downloads: ultimosDownloads.results,
    top_partituras: topPartituras.results
  }, 200, request);
}

// Buscar atividades recentes
async function getAtividades(request, env, limit = 20) {
  try {
    const result = await env.DB.prepare(`
      SELECT a.*, u.nome as usuario_nome
      FROM atividades a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.criado_em DESC
      LIMIT ?
    `).bind(limit).all();

    return jsonResponse(result.results, 200, request);
  } catch (e) {
    return jsonResponse([], 200, request);
  }
}

// Buscar atividades de um usuário específico
async function getAtividadesUsuario(request, env) {
  const user = await verifyUser(request, env);
  if (!user) {
    return errorResponse('Não autorizado', 401, request);
  }

  try {
    const result = await env.DB.prepare(`
      SELECT a.*, u.nome as usuario_nome
      FROM atividades a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.usuario_id = ? OR a.tipo = 'nova_partitura'
      ORDER BY a.criado_em DESC
      LIMIT 20
    `).bind(user.id).all();

    return jsonResponse(result.results, 200, request);
  } catch (e) {
    return jsonResponse([], 200, request);
  }
}

// ============ AUTENTICAÇÃO ============

// Verificar se usuário existe (para o tick verde no login)
// Rate limiting para evitar enumeração de usuários
async function checkUser(request, env) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limiting - 10 tentativas por minuto (mais permissivo que login)
  const rateLimit = await checkRateLimit(env, `checkuser:${ip}`);
  if (!rateLimit.allowed) {
    return jsonResponse({
      exists: false,
      error: 'Muitas tentativas. Aguarde um momento.'
    }, 429, request);
  }

  const { username } = await request.json();

  if (!username || username.length < 2) {
    return jsonResponse({ exists: false }, 200, request);
  }

  const user = await env.DB.prepare(
    'SELECT username, nome, instrumento_id FROM usuarios WHERE username = ? AND ativo = 1'
  ).bind(username.toLowerCase()).first();

  if (!user) {
    return jsonResponse({ exists: false }, 200, request);
  }

  let instrumentoNome = null;
  if (user.instrumento_id) {
    const instrumento = await env.DB.prepare(
      'SELECT nome FROM instrumentos WHERE id = ?'
    ).bind(user.instrumento_id).first();
    instrumentoNome = instrumento?.nome;
  }

  // Super admin sempre mostra nome generico
  const nomeExibido = user.username === 'admin' ? 'Administrador' : user.nome;

  return jsonResponse({
    exists: true,
    nome: nomeExibido,
    instrumento: instrumentoNome || 'Músico'
  }, 200, request);
}

async function login(request, env) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const { username, pin } = await request.json();

  // Validação básica
  if (!username || !pin) {
    return errorResponse('Usuário e PIN são obrigatórios', 400, request);
  }

  // Rate limiting por IP
  const rateLimit = await checkRateLimit(env, `login:${ip}`);
  if (!rateLimit.allowed) {
    return jsonResponse({
      error: `Muitas tentativas. Tente novamente em ${rateLimit.retryAfter} segundos.`,
      retryAfter: rateLimit.retryAfter
    }, 429, request);
  }

  // Busca usuário
  const user = await env.DB.prepare(
    'SELECT id, username, nome, admin, instrumento_id, foto_url, pin_hash, pin_salt FROM usuarios WHERE username = ? AND ativo = 1'
  ).bind(username.toLowerCase()).first();

  if (!user) {
    return errorResponse('Usuário ou PIN inválido', 401, request);
  }

  // Verifica PIN
  let pinValid = false;

  if (user.pin_salt) {
    // Novo formato: PBKDF2 hash
    pinValid = await verifyPin(pin, user.pin_hash, user.pin_salt);
  } else {
    // Formato legado: plaintext (para migração)
    pinValid = user.pin_hash === pin;

    // Se PIN válido no formato antigo, migra para o novo
    if (pinValid) {
      const newSalt = generateSalt();
      const newHash = await hashPin(pin, newSalt);

      await env.DB.prepare(
        'UPDATE usuarios SET pin_hash = ?, pin_salt = ? WHERE id = ?'
      ).bind(newHash, newSalt, user.id).run();

      console.log(`Migrated PIN hash for user ${user.username}`);
    }
  }

  if (!pinValid) {
    return errorResponse('Usuário ou PIN inválido', 401, request);
  }

  // Login bem-sucedido - reseta rate limit
  await resetRateLimit(env, `login:${ip}`);

  // Atualiza último acesso
  await env.DB.prepare(
    'UPDATE usuarios SET ultimo_acesso = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(user.id).run();

  // Buscar nome do instrumento
  let instrumentoNome = null;
  if (user.instrumento_id) {
    const instrumento = await env.DB.prepare(
      'SELECT nome FROM instrumentos WHERE id = ?'
    ).bind(user.instrumento_id).first();
    instrumentoNome = instrumento?.nome;
  }

  // Gera JWT
  const token = await createJwt({
    userId: user.id,
    username: user.username,
    isAdmin: user.admin === 1
  }, getJwtSecret(env));

  // Super admin sempre mostra nome generico
  const nomeExibido = user.username === 'admin' ? 'Administrador' : user.nome;

  return jsonResponse({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      nome: nomeExibido,
      admin: user.admin === 1,
      instrumento_id: user.instrumento_id,
      instrumento_nome: instrumentoNome,
      foto_url: user.foto_url,
    },
    token,
    expiresIn: JWT_EXPIRY_HOURS * 60 * 60
  }, 200, request);
}

async function changePin(request, env) {
  const user = await verifyUser(request, env);
  if (!user) {
    return errorResponse('Não autorizado', 401, request);
  }

  const { currentPin, newPin } = await request.json();

  if (!currentPin || !newPin) {
    return errorResponse('PIN atual e novo PIN são obrigatórios', 400, request);
  }

  if (!/^\d{4}$/.test(newPin)) {
    return errorResponse('O novo PIN deve ter exatamente 4 dígitos', 400, request);
  }

  // PINs óbvios não permitidos
  const obviousPins = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321', '0123', '3210'];
  if (obviousPins.includes(newPin)) {
    return errorResponse('Este PIN é muito fácil de adivinhar. Escolha outro.', 400, request);
  }

  // Verifica PIN atual
  let currentPinValid = false;
  if (user.pin_salt) {
    currentPinValid = await verifyPin(currentPin, user.pin_hash, user.pin_salt);
  } else {
    currentPinValid = user.pin_hash === currentPin;
  }

  if (!currentPinValid) {
    return errorResponse('PIN atual incorreto', 401, request);
  }

  if (currentPin === newPin) {
    return errorResponse('O novo PIN deve ser diferente do atual', 400, request);
  }

  // Gera novo hash
  const newSalt = generateSalt();
  const newHash = await hashPin(newPin, newSalt);

  await env.DB.prepare(
    'UPDATE usuarios SET pin_hash = ?, pin_salt = ? WHERE id = ?'
  ).bind(newHash, newSalt, user.id).run();

  // Gera novo token
  const newToken = await createJwt({
    userId: user.id,
    username: user.username,
    isAdmin: user.admin === 1
  }, getJwtSecret(env));

  return jsonResponse({
    success: true,
    message: 'PIN alterado com sucesso!',
    token: newToken
  }, 200, request);
}

// ============ USUÁRIOS (ADMIN) ============

async function getUsuarios(request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  const result = await env.DB.prepare(`
    SELECT u.id, u.username, u.nome, u.admin, u.ativo, u.instrumento_id, u.foto_url, u.criado_em, u.ultimo_acesso,
           i.nome as instrumento_nome
    FROM usuarios u
    LEFT JOIN instrumentos i ON u.instrumento_id = i.id
    ORDER BY u.nome ASC
  `).all();

  return jsonResponse(result.results, 200, request);
}

async function getUsuario(id, request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  const user = await env.DB.prepare(`
    SELECT u.id, u.username, u.nome, u.admin, u.ativo, u.instrumento_id, u.foto_url, u.criado_em, u.ultimo_acesso,
           i.nome as instrumento_nome
    FROM usuarios u
    LEFT JOIN instrumentos i ON u.instrumento_id = i.id
    WHERE u.id = ?
  `).bind(id).first();

  if (!user) {
    return errorResponse('Usuário não encontrado', 404, request);
  }

  return jsonResponse(user, 200, request);
}

async function createUsuario(request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  const { username, nome, pin, instrumento_id, admin: isAdmin } = await request.json();

  if (!username || !nome || !pin) {
    return errorResponse('Campos obrigatórios: username, nome, pin', 400, request);
  }

  if (!/^[a-z0-9]+$/.test(username)) {
    return errorResponse('Username deve conter apenas letras minúsculas e números, sem espaços', 400, request);
  }

  if (!/^\d{4}$/.test(pin)) {
    return errorResponse('PIN deve ter exatamente 4 dígitos', 400, request);
  }

  const exists = await env.DB.prepare(
    'SELECT id FROM usuarios WHERE username = ?'
  ).bind(username).first();

  if (exists) {
    return errorResponse('Este username já está em uso', 400, request);
  }

  // Hash do PIN
  const salt = generateSalt();
  const hash = await hashPin(pin, salt);

  const result = await env.DB.prepare(`
    INSERT INTO usuarios (username, nome, pin_hash, pin_salt, instrumento_id, admin)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    username,
    nome,
    hash,
    salt,
    instrumento_id || null,
    isAdmin ? 1 : 0
  ).run();

  return jsonResponse({
    success: true,
    id: result.meta.last_row_id,
    message: 'Usuário criado com sucesso!'
  }, 201, request);
}

async function updateUsuario(id, request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  // Verifica se está tentando alterar o super admin (@admin)
  const targetUser = await env.DB.prepare(
    'SELECT username FROM usuarios WHERE id = ?'
  ).bind(id).first();

  if (targetUser && targetUser.username === 'admin') {
    // Apenas o próprio super admin pode se alterar
    if (admin.username !== 'admin') {
      return errorResponse('Não é permitido alterar o super admin', 403, request);
    }
  }

  const { nome, pin, instrumento_id, admin: isAdmin, ativo } = await request.json();

  const updates = [];
  const params = [];

  if (nome !== undefined) {
    updates.push('nome = ?');
    params.push(nome);
  }

  if (pin !== undefined) {
    if (!/^\d{4}$/.test(pin)) {
      return errorResponse('PIN deve ter exatamente 4 dígitos', 400, request);
    }
    const salt = generateSalt();
    const hash = await hashPin(pin, salt);
    updates.push('pin_hash = ?', 'pin_salt = ?');
    params.push(hash, salt);
  }

  if (instrumento_id !== undefined) {
    updates.push('instrumento_id = ?');
    params.push(instrumento_id || null);
  }

  if (isAdmin !== undefined) {
    updates.push('admin = ?');
    params.push(isAdmin ? 1 : 0);
  }

  if (ativo !== undefined) {
    updates.push('ativo = ?');
    params.push(ativo ? 1 : 0);
  }

  if (updates.length === 0) {
    return errorResponse('Nenhum campo para atualizar', 400, request);
  }

  params.push(id);

  await env.DB.prepare(`
    UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?
  `).bind(...params).run();

  return jsonResponse({ success: true, message: 'Usuário atualizado!' }, 200, request);
}

// ============ MANUTENÇÃO (ADMIN) ============

async function cleanUserNames(request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  // Remove zeros e números do final dos nomes
  // Também corrige nomes que terminam com "0" literal
  const result = await env.DB.prepare(`
    UPDATE usuarios
    SET nome = CASE
      WHEN nome LIKE '%0' THEN SUBSTR(nome, 1, LENGTH(nome) - 1)
      WHEN nome LIKE '%1' THEN SUBSTR(nome, 1, LENGTH(nome) - 1)
      WHEN nome LIKE '%2' THEN SUBSTR(nome, 1, LENGTH(nome) - 1)
      WHEN nome LIKE '%3' THEN SUBSTR(nome, 1, LENGTH(nome) - 1)
      WHEN nome LIKE '%4' THEN SUBSTR(nome, 1, LENGTH(nome) - 1)
      WHEN nome LIKE '%5' THEN SUBSTR(nome, 1, LENGTH(nome) - 1)
      WHEN nome LIKE '%6' THEN SUBSTR(nome, 1, LENGTH(nome) - 1)
      WHEN nome LIKE '%7' THEN SUBSTR(nome, 1, LENGTH(nome) - 1)
      WHEN nome LIKE '%8' THEN SUBSTR(nome, 1, LENGTH(nome) - 1)
      WHEN nome LIKE '%9' THEN SUBSTR(nome, 1, LENGTH(nome) - 1)
      ELSE nome
    END
    WHERE nome GLOB '*[0-9]'
  `).run();

  return jsonResponse({
    success: true,
    message: `${result.meta.changes} nomes corrigidos!`,
    changes: result.meta.changes
  }, 200, request);
}

async function configurarSuperAdmin(request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  // Apenas o próprio super admin pode configurar-se
  if (admin.username !== 'admin') {
    return errorResponse('Apenas o super admin pode usar esta função', 403, request);
  }

  const { nome } = await request.json();

  if (nome) {
    await env.DB.prepare(
      "UPDATE usuarios SET nome = ? WHERE username = 'admin'"
    ).bind(nome).run();
  }

  return jsonResponse({
    success: true,
    message: 'Super admin configurado!'
  }, 200, request);
}

async function deleteUsuario(id, request, env) {
  const admin = await verifyAdmin(request, env);
  if (!admin) {
    return errorResponse('Não autorizado', 401, request);
  }

  if (admin.id === parseInt(id)) {
    return errorResponse('Você não pode desativar sua própria conta', 400, request);
  }

  // Verifica se está tentando desativar o super admin (@admin)
  const targetUser = await env.DB.prepare(
    'SELECT username FROM usuarios WHERE id = ?'
  ).bind(id).first();

  if (targetUser && targetUser.username === 'admin') {
    return errorResponse('Não é permitido desativar o super admin', 403, request);
  }

  await env.DB.prepare(
    'UPDATE usuarios SET ativo = 0 WHERE id = ?'
  ).bind(id).run();

  return jsonResponse({ success: true, message: 'Usuário desativado!' }, 200, request);
}

// ============ PERFIL (PRÓPRIO USUÁRIO) ============

async function getPerfil(request, env) {
  const user = await verifyUser(request, env);
  if (!user) {
    return errorResponse('Não autorizado', 401, request);
  }

  let instrumentoNome = null;
  if (user.instrumento_id) {
    const instrumento = await env.DB.prepare(
      'SELECT nome FROM instrumentos WHERE id = ?'
    ).bind(user.instrumento_id).first();
    instrumentoNome = instrumento?.nome;
  }

  return jsonResponse({
    id: user.id,
    username: user.username,
    nome: user.nome,
    admin: user.admin === 1,
    instrumento_id: user.instrumento_id,
    instrumento_nome: instrumentoNome,
    foto_url: user.foto_url,
  }, 200, request);
}

async function updatePerfil(request, env) {
  const user = await verifyUser(request, env);
  if (!user) {
    return errorResponse('Não autorizado', 401, request);
  }

  const { nome, instrumento_id } = await request.json();

  const updates = [];
  const params = [];

  if (nome !== undefined && nome.trim()) {
    updates.push('nome = ?');
    params.push(nome.trim());
  }

  if (instrumento_id !== undefined) {
    updates.push('instrumento_id = ?');
    params.push(instrumento_id || null);
  }

  if (updates.length === 0) {
    return errorResponse('Nenhum campo para atualizar', 400, request);
  }

  params.push(user.id);

  await env.DB.prepare(`
    UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?
  `).bind(...params).run();

  return jsonResponse({ success: true, message: 'Perfil atualizado!' }, 200, request);
}

// Upload de foto de perfil - com validação de magic bytes
async function uploadFotoPerfil(request, env) {
  const user = await verifyUser(request, env);
  if (!user) {
    return errorResponse('Não autorizado', 401, request);
  }

  const formData = await request.formData();
  const foto = formData.get('foto');

  if (!foto) {
    return errorResponse('Nenhuma foto enviada', 400, request);
  }

  // Verificar tamanho (max 2MB)
  if (foto.size > 2 * 1024 * 1024) {
    return errorResponse('Imagem muito grande (máximo 2MB)', 400, request);
  }

  // Verificar tipo MIME
  if (!foto.type.startsWith('image/')) {
    return errorResponse('Arquivo deve ser uma imagem', 400, request);
  }

  // Validar magic bytes
  const arrayBuffer = await foto.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer.slice(0, 8));

  const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
  const isGif = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
  const isWebp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;

  if (!isJpeg && !isPng && !isGif && !isWebp) {
    return errorResponse('Formato de imagem inválido. Use JPEG, PNG, GIF ou WebP.', 400, request);
  }

  // Determinar extensão baseada nos magic bytes
  let ext = 'jpg';
  if (isPng) ext = 'png';
  else if (isGif) ext = 'gif';
  else if (isWebp) ext = 'webp';

  const nomeArquivo = `perfil_${user.id}_${Date.now()}.${ext}`;

  // Upload para R2
  await env.BUCKET.put(nomeArquivo, arrayBuffer, {
    httpMetadata: { contentType: foto.type },
  });

  // Deletar foto antiga se existir
  if (user.foto_url) {
    try {
      await env.BUCKET.delete(user.foto_url);
    } catch (e) {
      // Ignora erro se arquivo não existir
    }
  }

  // Atualizar no banco
  await env.DB.prepare(
    'UPDATE usuarios SET foto_url = ? WHERE id = ?'
  ).bind(nomeArquivo, user.id).run();

  return jsonResponse({
    success: true,
    foto_url: nomeArquivo,
    message: 'Foto atualizada!'
  }, 200, request);
}

// ============ FAVORITOS ============

async function getFavoritos(request, env) {
  const user = await verifyUser(request, env);
  if (!user) {
    return errorResponse('Não autorizado', 401, request);
  }

  const result = await env.DB.prepare(`
    SELECT p.*, c.nome as categoria_nome, c.emoji as categoria_emoji, c.cor as categoria_cor
    FROM favoritos f
    JOIN partituras p ON f.partitura_id = p.id
    JOIN categorias c ON p.categoria_id = c.id
    WHERE f.usuario_id = ? AND p.ativo = 1
    ORDER BY f.criado_em DESC
  `).bind(user.id).all();

  return jsonResponse(result.results, 200, request);
}

async function getFavoritosIds(request, env) {
  const user = await verifyUser(request, env);
  if (!user) {
    return errorResponse('Não autorizado', 401, request);
  }

  const result = await env.DB.prepare(
    'SELECT partitura_id FROM favoritos WHERE usuario_id = ?'
  ).bind(user.id).all();

  return jsonResponse(result.results.map(f => f.partitura_id), 200, request);
}

async function addFavorito(partituraId, request, env) {
  const user = await verifyUser(request, env);
  if (!user) {
    return errorResponse('Não autorizado', 401, request);
  }

  const partitura = await env.DB.prepare(
    'SELECT id, titulo FROM partituras WHERE id = ? AND ativo = 1'
  ).bind(partituraId).first();

  if (!partitura) {
    return errorResponse('Partitura não encontrada', 404, request);
  }

  try {
    await env.DB.prepare(
      'INSERT INTO favoritos (usuario_id, partitura_id) VALUES (?, ?)'
    ).bind(user.id, partituraId).run();

    await registrarAtividade(env, 'favorito', partitura.titulo, null, user.id);
  } catch (e) {
    // Já é favorito
  }

  return jsonResponse({ success: true, message: 'Adicionado aos favoritos!' }, 200, request);
}

async function removeFavorito(partituraId, request, env) {
  const user = await verifyUser(request, env);
  if (!user) {
    return errorResponse('Não autorizado', 401, request);
  }

  await env.DB.prepare(
    'DELETE FROM favoritos WHERE usuario_id = ? AND partitura_id = ?'
  ).bind(user.id, partituraId).run();

  return jsonResponse({ success: true, message: 'Removido dos favoritos!' }, 200, request);
}

// ============ ROUTER ============

export default {
  async fetch(request, env, ctx) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: getCorsHeaders(request) });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // ============ ROTAS PÚBLICAS ============

      if (path === '/api/partituras' && method === 'GET') {
        return await getPartituras(request, env);
      }

      if (path.match(/^\/api\/partituras\/(\d+)$/) && method === 'GET') {
        const id = path.split('/')[3];
        return await getPartitura(id, request, env);
      }

      if (path.match(/^\/api\/download\/(\d+)$/) && method === 'GET') {
        const id = path.split('/')[3];
        return await downloadPartitura(id, request, env);
      }

      if (path.match(/^\/api\/download\/parte\/(\d+)$/) && method === 'GET') {
        const id = path.split('/')[4];
        return await downloadParte(id, request, env);
      }

      if (path === '/api/categorias' && method === 'GET') {
        return await getCategorias(request, env);
      }

      if (path === '/api/instrumentos' && method === 'GET') {
        return await getInstrumentos(request, env);
      }

      if (path === '/api/estatisticas' && method === 'GET') {
        return await getEstatisticas(request, env);
      }

      if (path === '/api/atividades' && method === 'GET') {
        return await getAtividades(request, env, 20);
      }

      if (path === '/api/login' && method === 'POST') {
        return await login(request, env);
      }

      if (path === '/api/check-user' && method === 'POST') {
        return await checkUser(request, env);
      }

      // ============ ROTAS AUTENTICADAS (QUALQUER USUÁRIO) ============

      if (path === '/api/change-pin' && method === 'POST') {
        return await changePin(request, env);
      }

      if (path === '/api/perfil' && method === 'GET') {
        return await getPerfil(request, env);
      }

      if (path === '/api/perfil' && method === 'PUT') {
        return await updatePerfil(request, env);
      }

      if (path === '/api/perfil/foto' && method === 'POST') {
        return await uploadFotoPerfil(request, env);
      }

      if (path === '/api/favoritos' && method === 'GET') {
        return await getFavoritos(request, env);
      }

      if (path === '/api/minhas-atividades' && method === 'GET') {
        return await getAtividadesUsuario(request, env);
      }

      if (path === '/api/favoritos/ids' && method === 'GET') {
        return await getFavoritosIds(request, env);
      }

      if (path.match(/^\/api\/favoritos\/(\d+)$/) && method === 'POST') {
        const id = path.split('/')[3];
        return await addFavorito(id, request, env);
      }

      if (path.match(/^\/api\/favoritos\/(\d+)$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        return await removeFavorito(id, request, env);
      }

      // ============ ROTAS ADMIN ============

      if (path === '/api/partituras/upload-pasta' && method === 'POST') {
        return await uploadPastaPartitura(request, env);
      }

      if (path === '/api/partituras' && method === 'POST') {
        return await createPartitura(request, env);
      }

      if (path.match(/^\/api\/partituras\/(\d+)\/partes$/) && method === 'GET') {
        const id = path.split('/')[3];
        return await getPartesPartitura(id, request, env);
      }

      if (path.match(/^\/api\/partituras\/(\d+)\/partes$/) && method === 'POST') {
        const id = path.split('/')[3];
        return await addParte(id, request, env);
      }

      if (path.match(/^\/api\/partes\/(\d+)\/substituir$/) && method === 'PUT') {
        const id = path.split('/')[3];
        return await substituirParte(id, request, env);
      }

      if (path.match(/^\/api\/partes\/(\d+)$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        return await deleteParte(id, request, env);
      }

      if (path.match(/^\/api\/partituras\/(\d+)$/) && method === 'PUT') {
        const id = path.split('/')[3];
        return await updatePartitura(id, request, env);
      }

      if (path.match(/^\/api\/partituras\/(\d+)$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        return await deletePartitura(id, request, env);
      }

      if (path === '/api/usuarios' && method === 'GET') {
        return await getUsuarios(request, env);
      }

      if (path.match(/^\/api\/usuarios\/(\d+)$/) && method === 'GET') {
        const id = path.split('/')[3];
        return await getUsuario(id, request, env);
      }

      if (path === '/api/usuarios' && method === 'POST') {
        return await createUsuario(request, env);
      }

      if (path.match(/^\/api\/usuarios\/(\d+)$/) && method === 'PUT') {
        const id = path.split('/')[3];
        return await updateUsuario(id, request, env);
      }

      if (path.match(/^\/api\/usuarios\/(\d+)$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        return await deleteUsuario(id, request, env);
      }

      if (path === '/api/categorias' && method === 'POST') {
        return await createCategoria(request, env);
      }

      if (path.match(/^\/api\/categorias\/([a-z0-9-]+)$/) && method === 'PUT') {
        const id = path.split('/')[3];
        return await updateCategoria(id, request, env);
      }

      if (path.match(/^\/api\/categorias\/([a-z0-9-]+)$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        return await deleteCategoria(id, request, env);
      }

      if (path === '/api/categorias/reorder' && method === 'POST') {
        return await reorderCategorias(request, env);
      }

      if (path === '/api/admin/estatisticas' && method === 'GET') {
        return await getEstatisticasAdmin(request, env);
      }

      if (path === '/api/admin/manutencao/limpar-nomes' && method === 'POST') {
        return await cleanUserNames(request, env);
      }

      if (path === '/api/admin/manutencao/super-admin' && method === 'POST') {
        return await configurarSuperAdmin(request, env);
      }

      // ============ HEALTH CHECK ============

      if (path === '/api/health') {
        return jsonResponse({
          status: 'ok',
          timestamp: new Date().toISOString(),
          security: {
            jwt: true,
            pbkdf2: true,
            cors: 'whitelist',
            rateLimit: !!env.RATE_LIMIT
          }
        }, 200, request);
      }

      // 404
      return errorResponse('Endpoint não encontrado', 404, request);

    } catch (error) {
      console.error('Erro:', error);
      return errorResponse('Erro interno do servidor', 500, request);
    }
  },
};
