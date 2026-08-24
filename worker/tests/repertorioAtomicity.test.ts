import { describe, expect, it, vi } from 'vitest';
import { reorderPartiturasRepertorio } from '../src/domain/repertorios/repertorioService.js';

describe('atomicidade de alterações de repertório', () => {
  it('entrega toda a reordenação a um único batch e propaga falhas', async () => {
    const statement = {
      bind: vi.fn().mockReturnThis(),
      run: vi.fn()
    };
    const env = {
      DB: {
        prepare: vi.fn(() => statement),
        batch: vi.fn().mockRejectedValue(new Error('D1 batch aborted'))
      }
    };
    const request = new Request('https://test.local/api/repertorio/1/reorder', {
      method: 'PUT',
      body: JSON.stringify({})
    });
    Object.defineProperty(request, 'json', {
      value: async () => ({
        ordens: [
          { partitura_id: 11, ordem: 0 },
          { partitura_id: 12, ordem: 1 }
        ]
      })
    });

    await expect(reorderPartiturasRepertorio(1, request, env, { id: 1 }))
      .rejects.toThrow('D1 batch aborted');
    expect(env.DB.batch).toHaveBeenCalledTimes(1);
    expect(env.DB.batch.mock.calls[0][0]).toHaveLength(2);
    expect(statement.run).not.toHaveBeenCalled();
  });
});

