export const AUDIO_ACCEPT = '.mp3,.wav,.m4a,.ogg,.webm';
export const MAX_AUDIO_BYTES = 80 * 1024 * 1024;
export const isAudioFile = file => /\.(mp3|wav|m4a|ogg|webm)$/i.test(file.name);

export function normalizeAudioTitle(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/\.(mp3|wav|m4a|ogg|webm)$/i, '')
    .replace(/\b(?:numero|n[º°ªo.]?)\s*(\d+)/g, 'numero $1')
    .replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

export function matchAudioTitle(filename, sheets) {
  const name = normalizeAudioTitle(filename);
  const clean = name.replace(/\s+(audio oficial|audio|oficial|instrumentos virtuais|instrumental|mix|master)$/, '').trim();
  const exact = sheets.filter(sheet => {
    const title = normalizeAudioTitle(sheet.titulo);
    return title && (title === name || title === clean);
  });
  if (exact.length) return { selectedId: exact.length === 1 ? String(exact[0].id) : '', candidates: exact, reason: exact.length === 1 ? 'Título correspondente' : 'Título repetido: escolha a partitura' };

  // Exports use "genre title _ composer _ institution". Parse before
  // normalization so field separators do not disappear into title tokens.
  const fields = String(filename || '').replace(/\.(mp3|wav|m4a|ogg|webm)$/i, '')
    .split(/\s+[_|–—-]\s*|\s*[_|–—-]\s+/).map(normalizeAudioTitle).filter(Boolean);
  const titleField = fields[0] || clean;
  const withoutGenre = titleField.replace(/^(dobrado|marcha|fantasia|arranjo|valsa|polca|maxixe)\s+/, '');
  let titleMatches = sheets.filter(sheet => normalizeAudioTitle(sheet.titulo) === titleField && titleField);
  if (!titleMatches.length && withoutGenre !== titleField) {
    titleMatches = sheets.filter(sheet => normalizeAudioTitle(sheet.titulo) === withoutGenre && withoutGenre);
  }
  if (titleMatches.length) {
    const isInstitution = value => /^(sociedade filarmonica|filarmonica 25 de marco)\b/.test(value);
    const composer = fields[1] && !isInstitution(fields[1]) ? fields[1] : '';
    const composerMatches = composer ? titleMatches.filter(sheet => normalizeAudioTitle(sheet.compositor) === composer) : [];
    const candidates = composerMatches.length ? composerMatches : titleMatches;
    const composerConflict = composer && fields.some(isInstitution) && !composerMatches.length
      && titleMatches.some(sheet => normalizeAudioTitle(sheet.compositor));
    const automatic = candidates.length === 1 && !composerConflict;
    return {
      selectedId: automatic ? String(candidates[0].id) : '', candidates,
      reason: composerConflict ? 'Compositor diferente: confirme a associação'
        : !automatic ? 'Título repetido: escolha a partitura'
          : composerMatches.length ? 'Título e compositor correspondentes' : 'Título correspondente'
    };
  }
  const tokens = new Set(withoutGenre.split(' ').filter(Boolean));
  const candidates = sheets.map(sheet => {
    const title = normalizeAudioTitle(sheet.titulo).split(' ').filter(Boolean);
    const overlap = title.filter(token => tokens.has(token)).length;
    return { sheet, score: overlap / Math.max(tokens.size, title.length, 1) };
  }).filter(item => item.score >= 0.5).sort((a, b) => b.score - a.score).slice(0, 5).map(item => item.sheet);
  return { selectedId: '', candidates, reason: candidates.length ? 'Título parecido: confirme a associação' : 'Selecione a partitura' };
}

// Capture entries before the drop event returns; browsers clear DataTransfer afterwards.
export function captureAudioDrop(dataTransfer) {
  return {
    entries: Array.from(dataTransfer.items || []).filter(item => item.kind === 'file').map(item => item.webkitGetAsEntry?.()).filter(Boolean),
    files: Array.from(dataTransfer.files || [])
  };
}

export async function readAudioDrop({ entries, files }) {
  if (!entries.length) return files;
  const result = [];
  async function walk(entry, parent = '') {
    if (entry.isFile) {
      const file = await new Promise((resolve, reject) => entry.file(resolve, reject));
      Object.defineProperty(file, 'batchRelativePath', { value: parent + file.name, configurable: true });
      result.push(file);
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      let batch;
      do {
        batch = await new Promise((resolve, reject) => reader.readEntries(resolve, reject));
        for (const child of batch) await walk(child, parent + (entry.name || '') + '/');
      } while (batch.length);
    }
  }
  for (const entry of entries) await walk(entry);
  return result;
}
