export const STORAGE_PREFIXES = Object.freeze({
  partituras: 'partituras/',
  partes: 'partes/',
  perfil: 'perfil/',
  assets: 'assets/'
});

export function sanitizeStorageName(value, fallback = 'arquivo') {
  const sanitized = String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^\.+/, '')
    .slice(0, 180);

  return sanitized || fallback;
}

export function buildStorageKey(prefix, filename) {
  if (!Object.values(STORAGE_PREFIXES).includes(prefix)) {
    throw new Error('Prefixo de armazenamento inválido');
  }
  return `${prefix}${sanitizeStorageName(filename)}`;
}

export function normalizeAssetSubpath(value = '') {
  const subpath = String(value).replace(/^\/+|\/+$/g, '');
  if (!subpath) return '';
  if (subpath.includes('..') || subpath.includes('\\')) {
    throw new Error('Caminho de asset inválido');
  }

  return subpath
    .split('/')
    .map(component => sanitizeStorageName(component))
    .join('/');
}

export function buildAssetKey(folder, filename) {
  const safeFolder = normalizeAssetSubpath(folder || 'general');
  const safeFilename = sanitizeStorageName(filename);
  return `${STORAGE_PREFIXES.assets}${safeFolder}/${safeFilename}`;
}

export function isAssetKey(key) {
  if (typeof key !== 'string' || !key.startsWith(STORAGE_PREFIXES.assets)) return false;
  try {
    return normalizeAssetSubpath(key.slice(STORAGE_PREFIXES.assets.length)) !== '';
  } catch {
    return false;
  }
}

