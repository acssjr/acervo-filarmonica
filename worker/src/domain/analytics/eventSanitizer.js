const DIACRITICS_REGEX = /[\u0300-\u036f]/g;

export function normalizeSearchTerm(term) {
  if (typeof term !== 'string') {
    return '';
  }

  return term
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isEmail(term) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(term);
}

function isCpf(term) {
  return /^(?:\d{3}\.?\d{3}\.?\d{3}-?\d{2})$/.test(term);
}

function isBrazilianPhone(term) {
  const normalized = term.trim();

  return (
    /^\+55\s?\(?\d{2}\)?\s?\d{4,5}[-.\s]?\d{4}$/.test(normalized) ||
    /^\(?\d{2}\)?\s?\d{4,5}[-.\s]?\d{4}$/.test(normalized) ||
    /^\d{11}$/.test(normalized) ||
    /^\d{13}$/.test(normalized)
  );
}

function isNumericPin(term) {
  return /^\d{4,6}$/.test(term);
}

export function isSensitiveSearchTerm(term) {
  if (typeof term !== 'string') {
    return false;
  }

  const normalized = term.trim();
  if (!normalized) {
    return false;
  }

  return (
    isEmail(normalized) ||
    isCpf(normalized) ||
    isBrazilianPhone(normalized) ||
    isNumericPin(normalized)
  );
}

export function maskSensitiveSearchTerm(term) {
  return isSensitiveSearchTerm(term) ? '[termo ocultado]' : term;
}
