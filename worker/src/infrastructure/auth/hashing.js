// worker/src/infrastructure/auth/hashing.js

import { PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH } from '../../config/index.js';
import {
  arrayBufferToHex,
  stringToArrayBuffer,
} from '../security/crypto.js';

/**
 * Gera um salt aleatório de 16 bytes
 * @returns {string} Salt em formato hexadecimal
 */
export function generateSalt() {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  return arrayBufferToHex(saltBytes);
}

/**
 * Cria hash do PIN usando PBKDF2
 * @param {string} pin - PIN a ser hasheado
 * @param {string} salt - Salt em formato hexadecimal
 * @returns {Promise<string>} Hash em formato hexadecimal
 */
export async function hashPin(pin, salt) {
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

/**
 * Verifica se o PIN corresponde ao hash armazenado
 * @param {string} pin - PIN a ser verificado
 * @param {string} storedHash - Hash armazenado
 * @param {string} salt - Salt usado no hash
 * @returns {Promise<boolean>} true se o PIN está correto
 */
export async function verifyPin(pin, storedHash, salt) {
  const computedHash = await hashPin(pin, salt);
  return computedHash === storedHash;
}
