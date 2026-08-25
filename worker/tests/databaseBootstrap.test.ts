import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { SCHEMA_MIGRATIONS } from './schema.generated.js';

describe('baseline do banco', () => {
  it('executa todas as migrations ativas em ordem', () => {
    expect(SCHEMA_MIGRATIONS).toEqual([
      '0001_baseline.sql',
      '0002_logs_download_instrument_text.sql',
      '0003_fix_bombardino_tonalidades.sql'
    ]);
  });

  it('contém todas as estruturas exigidas pelo backend atual', async () => {
    const requiredTables = [
      'configuracoes',
      'ensaios_config',
      'repertorios',
      'repertorio_partituras',
      'tracking_sessions',
      'tracking_events'
    ];

    const placeholders = requiredTables.map(() => '?').join(', ');
    const result = await env.DB.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table' AND name IN (${placeholders})
    `).bind(...requiredTables).all<{ name: string }>();

    expect(result.results.map((row) => row.name).sort()).toEqual(requiredTables.sort());
  });

  it('inclui nome_exibicao no cadastro de usuários', async () => {
    const columns = await env.DB.prepare('PRAGMA table_info(usuarios)').all<{ name: string }>();

    expect(columns.results.map((column) => column.name)).toContain('nome_exibicao');
  });

  it('mantém Bombardino C e Bombardino Bb como opções distintas', async () => {
    const result = await env.DB.prepare(`
      SELECT id, nome FROM instrumentos
      WHERE id IN ('bombardino', 'bombardino-bb')
      ORDER BY ordem
    `).all<{ id: string; nome: string }>();

    expect(result.results).toEqual([
      { id: 'bombardino', nome: 'Bombardino C' },
      { id: 'bombardino-bb', nome: 'Bombardino Bb' }
    ]);
  });
});
