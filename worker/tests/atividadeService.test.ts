import { afterEach, describe, expect, it, vi } from 'vitest';
import { registrarAtividade } from '../src/domain/atividades/atividadeService.js';

describe('registrarAtividade', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('relança o erro quando o insert em atividades falha', async () => {
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
    ).rejects.toThrow('DB offline');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao registrar atividade:', dbError);
  });
});
