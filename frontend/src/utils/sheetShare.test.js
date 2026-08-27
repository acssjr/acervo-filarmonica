import { describe, test, expect, jest } from '@jest/globals';
import { buildSheetShareText, buildSheetShareUrl, shareSheetLink } from './sheetShare';

const sheet = {
  id: 96,
  title: "Senhora Sant'Anna",
  composer: 'Tertuliano Santos',
  category: 'marchas',
  updatedAt: '2026-08-27T12:00:00.000Z'
};

describe('sheetShare', () => {
  test('monta URL canônica codificada com versão', () => {
    const url = buildSheetShareUrl({ ...sheet, category: 'marchas festivas' }, { origin: 'https://acervo.exemplo.com/' });

    expect(url).toBe('https://acervo.exemplo.com/acervo/marchas%20festivas/96?v=mtbh0g00-genre-singular-v1');
  });

  test('monta a mensagem com peça, compositor e gênero', () => {
    expect(buildSheetShareText(sheet, 'Marchas')).toBe(
      "🎺 Partitura disponível no Acervo Digital!\n\n“Senhora Sant'Anna”, de Tertuliano Santos\nGênero: Marcha\n\nAcesse e encontre a sua parte:"
    );
  });

  test('copia o link e abre o compartilhamento nativo', async () => {
    const clipboard = { writeText: jest.fn().mockResolvedValue(undefined) };
    const share = jest.fn().mockResolvedValue(undefined);

    const result = await shareSheetLink({
      sheet,
      categoryName: 'Marchas',
      origin: 'https://acervo.exemplo.com',
      navigatorObject: { clipboard, share }
    });

    expect(clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('/acervo/marchas/96'));
    expect(share).toHaveBeenCalledWith(expect.objectContaining({
      title: "Senhora Sant'Anna | Acervo Digital",
      text: expect.stringContaining('Tertuliano Santos'),
      url: expect.stringContaining('/acervo/marchas/96')
    }));
    expect(result.status).toBe('shared');
    expect(result.copied).toBe(true);
  });

  test('usa somente o clipboard quando Web Share não existe', async () => {
    const clipboard = { writeText: jest.fn().mockResolvedValue(undefined) };

    const result = await shareSheetLink({
      sheet,
      categoryName: 'Marchas',
      origin: 'https://acervo.exemplo.com',
      navigatorObject: { clipboard }
    });

    expect(clipboard.writeText).toHaveBeenCalledWith(
      expect.stringMatching(/Tertuliano Santos[\s\S]*https:\/\/acervo\.exemplo\.com\/acervo\/marchas\/96/)
    );
    expect(result).toEqual(expect.objectContaining({ status: 'copied', copied: true }));
  });

  test('cancelar o menu nativo não é tratado como erro', async () => {
    const abortError = new Error('cancelado');
    abortError.name = 'AbortError';
    const result = await shareSheetLink({
      sheet,
      categoryName: 'Marchas',
      origin: 'https://acervo.exemplo.com',
      navigatorObject: {
        clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
        share: jest.fn().mockRejectedValue(abortError)
      }
    });

    expect(result.status).toBe('cancelled');
  });
});
