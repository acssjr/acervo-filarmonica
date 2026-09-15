import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import {
  excluirEnsaio,
  getTodasPresencas,
  registrarPresencas,
  removerPresenca,
} from '../src/domain/presenca/presencaService.js';

describe('ocorrências de ensaio', () => {
  it('preserva o ensaio quando a última presença é removida e o exclui explicitamente', async () => {
    const rehearsalDate = '2026-01-05';

    await registrarPresencas(env, rehearsalDate, [2], 1);
    await removerPresenca(env, rehearsalDate, 2);

    const afterPresenceRemoval = await getTodasPresencas(env);
    expect(afterPresenceRemoval.ensaios).toEqual(expect.arrayContaining([
      expect.objectContaining({ data_ensaio: rehearsalDate, total_presencas: 0 }),
    ]));

    await excluirEnsaio(env, rehearsalDate);
    const afterRehearsalRemoval = await getTodasPresencas(env);
    expect(afterRehearsalRemoval.ensaios).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ data_ensaio: rehearsalDate }),
    ]));
  });
});
