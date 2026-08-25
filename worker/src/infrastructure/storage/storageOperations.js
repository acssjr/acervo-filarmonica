export const MAX_PDF_SIZE = 25 * 1024 * 1024;
export const MAX_PDF_BATCH_COUNT = 100;
export const MAX_PDF_BATCH_BYTES = 64 * 1024 * 1024;

export function accumulatePdfBatchBytes(currentBytes, arrayBuffer, maxBytes = MAX_PDF_BATCH_BYTES) {
  const totalBytes = currentBytes + arrayBuffer.byteLength;
  if (totalBytes > maxBytes) {
    throw new Error(`O tamanho total do lote excede ${Math.floor(maxBytes / 1024 / 1024)} MB`);
  }
  return totalBytes;
}

export function isPdfBuffer(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer.slice(0, 5));
  return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44
    && bytes[3] === 0x46 && bytes[4] === 0x2D;
}

export async function readAndValidatePdf(file, maxSize = MAX_PDF_SIZE) {
  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new Error('Arquivo PDF ausente');
  }
  if (file.size > maxSize) {
    throw new Error(`Arquivo excede o limite de ${Math.floor(maxSize / 1024 / 1024)}MB`);
  }
  const allowedTypes = ['', 'application/pdf', 'application/octet-stream'];
  if (!allowedTypes.includes(String(file.type || '').toLowerCase())) {
    throw new Error('Tipo de arquivo inválido; envie um PDF');
  }

  const arrayBuffer = await file.arrayBuffer();
  if (!isPdfBuffer(arrayBuffer)) {
    throw new Error(`Arquivo "${file.name || 'sem nome'}" não é um PDF válido`);
  }
  return arrayBuffer;
}

export async function deleteBestEffort(bucket, key) {
  if (!key) return;
  try {
    await bucket.delete(key);
  } catch (error) {
    console.error(`Não foi possível remover o objeto ${key}:`, error);
  }
}

export async function putWithDbCompensation({ bucket, key, value, options, commit }) {
  await bucket.put(key, value, options);
  try {
    return await commit();
  } catch (error) {
    await deleteBestEffort(bucket, key);
    throw error;
  }
}

export async function replaceStoredObject({ bucket, oldKey, newKey, value, options, commit }) {
  const result = await putWithDbCompensation({
    bucket,
    key: newKey,
    value,
    options,
    commit
  });
  await deleteBestEffort(bucket, oldKey);
  return result;
}
