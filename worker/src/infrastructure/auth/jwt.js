// worker/src/infrastructure/auth/jwt.js

import { JWT_EXPIRY_HOURS, JWT_ALGORITHM } from '../../config/index.js';
import {
  base64UrlEncode,
  base64UrlDecode,
  stringToArrayBuffer,
} from '../security/crypto.js';

/**
 * Cria um JWT usando HMAC SHA-256
 * @param {Object} payload - Dados a serem incluídos no token
 * @param {string} secret - Chave secreta para assinar o token
 * @returns {Promise<string>} Token JWT assinado
 */
export async function createJwt(payload, secret) {
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

/**
 * Verifica e decodifica um JWT
 * @param {string} token - Token JWT a ser verificado
 * @param {string} secret - Chave secreta para verificar a assinatura
 * @returns {Promise<Object|null>} Payload decodificado ou null se inválido
 */
export async function verifyJwt(token, secret) {
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
