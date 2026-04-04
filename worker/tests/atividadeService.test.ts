import { afterEach, describe, expect, it, vi } from 'vitest';
import { registrarAtividade } from '../src/domain/atividades/atividadeService.js';

describe('registrarAtividade', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registra atividade com sucesso quando o insert funciona', async () => {
    const run = vi.fn().mockResolvedValue({ success: true });
    const bind = vi.fn(() => ({ run }));
    const prepare = vi.fn(() => ({ bind }));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const env = {
      DB: {
        prepare
      }
    } as unknown as Parameters<typeof registrarAtividade>[0];

    await expect(
      registrarAtividade(env, 'nova_parte', 'Partitura Teste', 'Clarinete Bb 1', 1)
    ).resolves.toBeUndefined();

    expect(prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO atividades'));
    expect(bind).toHaveBeenCalledWith('nova_parte', 'Partitura Teste', 'Clarinete Bb 1', 1);
    expect(run).toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('trata falhas no insert como não fatais e registra contexto no log', async () => {
    const dbError = new Error('DB offline');
    const run = vi.fn().mockRejectedValue(dbError);
    const bind = vi.fn(() => ({ run }));
    const prepare = vi.fn(() => ({ bind }));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const env = {
      DB: {
        prepare
      }
    } as unknown as Parameters<typeof registrarAtividade>[0];

    await expect(
      registrarAtividade(env, 'nova_parte', 'Partitura Teste', 'Clarinete Bb 1', 1)
    ).resolves.toBeUndefined();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao registrar atividade:', {
      tipo: 'nova_parte',
      titulo: 'Partitura Teste',
      detalhes: 'Clarinete Bb 1',
      usuarioId: 1,
      error: dbError
    });
  });
});
