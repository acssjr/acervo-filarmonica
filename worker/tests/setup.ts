/**
 * Inicializa o D1 de testes a partir do mesmo baseline usado pelo Wrangler.
 */

import { env } from 'cloudflare:test';
import { beforeAll } from 'vitest';
import { SCHEMA_STATEMENTS } from './schema.generated.js';

const TEST_FIXTURES = [
  `INSERT OR REPLACE INTO categorias (id, nome, emoji, cor, ordem) VALUES
    ('dobrados', 'Dobrados', '🎺', '#e74c3c', 1)`,
  `INSERT OR REPLACE INTO categorias (id, nome, emoji, cor, ordem) VALUES
    ('marchas', 'Marchas', '🥁', '#3498db', 2)`,
  `INSERT OR REPLACE INTO usuarios (id, username, nome, pin_hash, admin, ativo) VALUES
    (1, 'admin', 'Administrador', '1234', 1, 1)`,
  `INSERT OR REPLACE INTO usuarios (id, username, nome, pin_hash, admin, ativo) VALUES
    (2, 'musico', 'Músico Teste', '1234', 0, 1)`
];

beforeAll(async () => {
  for (const sql of [...SCHEMA_STATEMENTS, ...TEST_FIXTURES]) {
    await env.DB.prepare(sql).run();
  }
});
