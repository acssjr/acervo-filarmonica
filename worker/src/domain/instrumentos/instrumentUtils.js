const BOMBARDINO_ROOT = /^(bombardino|euphonium|eufonio)\b/i;

function normalizeInstrumentToken(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[♭]/g, 'b')
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function parseBombardinoInstrument(value) {
  const normalized = normalizeInstrumentToken(value);
  if (!BOMBARDINO_ROOT.test(normalized)) {
    return { isBombardino: false, tonality: null, voice: null, solo: false };
  }

  const remainder = normalized.replace(BOMBARDINO_ROOT, '').trim();
  let tonality = 'c';

  if (/\b(?:bb|sib|si\s*b(?:emol)?)\b/.test(remainder)) {
    tonality = 'bb';
  } else if (/\b(?:eb|mib|mi\s*b(?:emol)?)\b/.test(remainder)) {
    tonality = 'eb';
  } else if (/\btc\b/.test(remainder)) {
    tonality = 'tc';
  } else if (/\bbc\b/.test(remainder)) {
    tonality = 'bc';
  } else if (/\b(?:c|do)\b/.test(remainder)) {
    tonality = 'c';
  }

  const combinedVoiceMatch = remainder.match(/\b(\d+)\s*(?:e|\/|-)\s*(\d+)\s*$/);
  const voiceMatch = combinedVoiceMatch ? null : remainder.match(/\b(\d+)\s*$/);
  return {
    isBombardino: true,
    tonality,
    voice: voiceMatch ? Number.parseInt(voiceMatch[1], 10) : null,
    combinedVoice: combinedVoiceMatch
      ? `${combinedVoiceMatch[1]} e ${combinedVoiceMatch[2]}`
      : null,
    solo: /\bsolo\b/.test(remainder)
  };
}

export function canonicalizeInstrumentName(value) {
  const trimmed = String(value || '').replace(/\s+/g, ' ').trim();
  const parsed = parseBombardinoInstrument(trimmed);
  if (!parsed.isBombardino) return trimmed;

  const tonalityLabels = {
    bb: 'Bb',
    c: 'C',
    eb: 'Eb',
    tc: 'TC',
    bc: 'BC'
  };
  const suffix = [
    parsed.solo ? 'Solo' : null,
    parsed.combinedVoice || parsed.voice
  ].filter(Boolean).join(' ');

  return `Bombardino ${tonalityLabels[parsed.tonality]}${suffix ? ` ${suffix}` : ''}`;
}

export function areInstrumentTonalitiesCompatible(requested, candidate) {
  const requestedBombardino = parseBombardinoInstrument(requested);
  const candidateBombardino = parseBombardinoInstrument(candidate);

  if (!requestedBombardino.isBombardino || !candidateBombardino.isBombardino) {
    return true;
  }

  return requestedBombardino.tonality === candidateBombardino.tonality;
}

export function isBombardinoInstrument(value) {
  return parseBombardinoInstrument(value).isBombardino;
}
