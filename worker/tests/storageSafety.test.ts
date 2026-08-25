import { describe, expect, it, vi } from 'vitest';
import {
  STORAGE_PREFIXES,
  accumulatePdfBatchBytes,
  buildAssetKey,
  buildStorageKey,
  isAssetKey,
  putWithDbCompensation,
  readAndValidatePdf,
  replaceStoredObject
} from '../src/infrastructure/storage/index.js';
import { serveAsset } from '../src/domain/assets/assetService.js';

describe('segurança do armazenamento R2', () => {
  it('isola cada tipo de arquivo em seu namespace', () => {
    expect(buildStorageKey(STORAGE_PREFIXES.partes, 'Clarinete Bb.pdf'))
      .toBe('partes/Clarinete_Bb.pdf');
    expect(buildAssetKey('backgrounds', 'foto principal.webp'))
      .toBe('assets/backgrounds/foto_principal.webp');
    expect(isAssetKey('assets/backgrounds/foto.webp')).toBe(true);
    expect(isAssetKey('partes/foto.webp')).toBe(false);
    expect(isAssetKey('assets/../partes/segredo.pdf')).toBe(false);
  });

  it('valida o conteúdo real e o tamanho de PDFs', async () => {
    const pdf = new File([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31])], 'parte.pdf');
    await expect(readAndValidatePdf(pdf)).resolves.toBeInstanceOf(ArrayBuffer);

    const falso = new File(['nao e pdf'], 'falso.pdf', { type: 'application/pdf' });
    await expect(readAndValidatePdf(falso)).rejects.toThrow('não é um PDF válido');
    const mimeInvalido = new File([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])], 'imagem.png', { type: 'image/png' });
    await expect(readAndValidatePdf(mimeInvalido)).rejects.toThrow('Tipo de arquivo inválido');
    await expect(readAndValidatePdf(pdf, 2)).rejects.toThrow('excede o limite');
  });

  it('limita o tamanho agregado de buffers PDF', () => {
    const primeiroTotal = accumulatePdfBatchBytes(0, new ArrayBuffer(4), 6);

    expect(primeiroTotal).toBe(4);
    expect(() => accumulatePdfBatchBytes(primeiroTotal, new ArrayBuffer(3), 6))
      .toThrow('tamanho total do lote excede');
  });

  it('remove o upload novo quando o commit no D1 falha', async () => {
    const bucket = {
      put: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined)
    };
    const failure = new Error('D1 offline');

    await expect(putWithDbCompensation({
      bucket,
      key: 'partes/nova.pdf',
      value: new ArrayBuffer(0),
      commit: () => Promise.reject(failure)
    })).rejects.toBe(failure);

    expect(bucket.delete).toHaveBeenCalledWith('partes/nova.pdf');
  });

  it('só remove o objeto antigo depois de confirmar a troca no D1', async () => {
    const events: string[] = [];
    const bucket = {
      put: vi.fn(async () => events.push('put-new')),
      delete: vi.fn(async (key: string) => events.push(`delete:${key}`))
    };

    await replaceStoredObject({
      bucket,
      oldKey: 'partes/antiga.pdf',
      newKey: 'partes/nova.pdf',
      value: new ArrayBuffer(0),
      commit: async () => events.push('commit-db')
    });

    expect(events).toEqual(['put-new', 'commit-db', 'delete:partes/antiga.pdf']);
  });

  it('preserva o objeto antigo se o upload da substituição falhar', async () => {
    const bucket = {
      put: vi.fn().mockRejectedValue(new Error('R2 offline')),
      delete: vi.fn().mockResolvedValue(undefined)
    };
    const commit = vi.fn();

    await expect(replaceStoredObject({
      bucket,
      oldKey: 'partes/antiga.pdf',
      newKey: 'partes/nova.pdf',
      value: new ArrayBuffer(0),
      commit
    })).rejects.toThrow('R2 offline');

    expect(commit).not.toHaveBeenCalled();
    expect(bucket.delete).not.toHaveBeenCalled();
  });

  it('limita o fallback legado de assets à pasta de backgrounds', async () => {
    const request = new Request('https://example.com/api/assets/partes/segredo.pdf');
    const bucket = { get: vi.fn().mockResolvedValue(null) };

    const response = await serveAsset('partes/segredo.pdf', request, { BUCKET: bucket });

    expect(response.status).toBe(404);
    expect(bucket.get).toHaveBeenCalledTimes(1);
    expect(bucket.get).toHaveBeenCalledWith('assets/partes/segredo.pdf');
  });

  it('mantém a leitura de backgrounds legados sem namespace', async () => {
    const request = new Request('https://example.com/api/assets/backgrounds/login.webp');
    const legacyObject = {
      body: 'imagem',
      httpEtag: 'etag-legado',
      writeHttpMetadata: vi.fn()
    };
    const bucket = {
      get: vi.fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(legacyObject)
    };

    const response = await serveAsset('backgrounds/login.webp', request, { BUCKET: bucket });

    expect(response.status).toBe(200);
    expect(bucket.get.mock.calls).toEqual([
      ['assets/backgrounds/login.webp'],
      ['backgrounds/login.webp']
    ]);
  });
});
