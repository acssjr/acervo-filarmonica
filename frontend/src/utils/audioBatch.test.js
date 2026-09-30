import { describe, test, expect } from '@jest/globals';
import { matchAudioTitle, normalizeAudioTitle, readAudioDrop, isAudioFile } from './audioBatch';

describe('associação de áudios', () => {
  const sheets = [{ id: 1, titulo: 'Canção do Sertão' }, { id: 2, titulo: 'Marcha Nº 7' }, { id: 3, titulo: 'Marcha Nº 8' }];
  test('acentos, pontuação, extensão e sufixo de exportação', () => {
    expect(matchAudioTitle('CANCAO_DO_SERTAO - instrumentos virtuais.mp3', sheets).selectedId).toBe('1');
    expect(matchAudioTitle('Marcha n7.wav', sheets).selectedId).toBe('2');
    expect(normalizeAudioTitle('Marcha Nº 8')).not.toBe(normalizeAudioTitle('Marcha Nº 7'));
  });
  test('títulos repetidos e nomes parecidos exigem escolha', () => {
    expect(matchAudioTitle('Canção do Sertão.mp3', [...sheets, { id: 4, titulo: 'Canção do Sertão' }]).selectedId).toBe('');
    const match = matchAudioTitle('Canção Sertão.mp3', sheets);
    expect(match.selectedId).toBe('');
    expect(match.candidates[0].id).toBe(1);
    expect(matchAudioTitle('desconhecido.mp3', sheets).candidates).toEqual([]);
  });
  test('não inclui MIDI, PDFs ou arquivos vazios de nome', () => {
    expect(isAudioFile({ name: 'canção.MP3' })).toBe(true);
    expect(isAudioFile({ name: 'canção.mid' })).toBe(false);
    expect(isAudioFile({ name: 'canção.pdf' })).toBe(false);
    expect(matchAudioTitle('', sheets).selectedId).toBe('');
  });
  test('percorre todas as páginas de diretórios e subpastas', async () => {
    const file = name => ({ isFile: true, file: resolve => resolve({ name }) });
    const folder = pages => ({ isDirectory: true, createReader: () => { let i = 0; return { readEntries: resolve => resolve(pages[i++] || []) }; } });
    const entries = [folder([[file('um.mp3')], [folder([[file('dois.wav')]])]])];
    expect((await readAudioDrop({ entries, files: [] })).map(item => item.name)).toEqual(['um.mp3', 'dois.wav']);
    expect(await readAudioDrop({ entries: [], files: [{ name: 'solto.mp3' }] })).toEqual([{ name: 'solto.mp3' }]);
  });
});
