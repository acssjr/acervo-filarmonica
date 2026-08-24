export function parsePositiveId(value) {
  const normalized = typeof value === 'number' ? value : Number(String(value));
  return Number.isSafeInteger(normalized) && normalized > 0 ? normalized : null;
}

export function isIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

export function normalizeHttpUrl(value, { nullable = true } = {}) {
  if (value === null || value === undefined || value === '') {
    if (nullable) return null;
    throw new Error('URL é obrigatória');
  }
  let url;
  try {
    url = new URL(String(value));
  } catch {
    throw new Error('URL inválida');
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('URL deve usar HTTP ou HTTPS');
  }
  return url.toString();
}

export function parsePagination(searchParams, defaults = {}) {
  const defaultLimit = defaults.limit ?? 20;
  const maxLimit = defaults.maxLimit ?? 100;
  const rawLimit = Number(searchParams.get('limit'));
  const rawOffset = Number(searchParams.get('offset'));
  return {
    limit: Number.isSafeInteger(rawLimit) && rawLimit > 0
      ? Math.min(rawLimit, maxLimit)
      : defaultLimit,
    offset: Number.isSafeInteger(rawOffset) && rawOffset >= 0 ? rawOffset : 0
  };
}

export function sanitizeHeaderFilename(value, fallback = 'arquivo.pdf') {
  const unsafeCharacters = new Set(['"', '\\', '/', ';']);
  const safeCharacters = Array.from(String(value || '').normalize('NFKC'))
    .map(character => {
      const code = character.charCodeAt(0);
      return code < 32 || code === 127 || unsafeCharacters.has(character) ? '_' : character;
    })
    .join('');
  const cleaned = safeCharacters
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
  return cleaned || fallback;
}

export function isUniqueConstraintError(error) {
  return /(?:UNIQUE constraint failed|constraint failed: UNIQUE)/i.test(error?.message || '');
}

export function validateOrderItems(items, idKey = 'id') {
  if (!Array.isArray(items) || items.length === 0) return false;
  const seen = new Set();
  return items.every(item => {
    const id = parsePositiveId(item?.[idKey]);
    const ordem = Number(item?.ordem);
    if (!id || !Number.isSafeInteger(ordem) || ordem < 0 || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}
