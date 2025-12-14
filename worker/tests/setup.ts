/**
 * Setup de testes - inicializa o banco D1 com schema
 *
 * Nota: O @cloudflare/vitest-pool-workers usa o miniflare que cria
 * um banco D1 em memória. Precisamos executar o schema via batch.
 */

import { env } from 'cloudflare:test';
import { beforeAll } from 'vitest';

// SQL para criar tabelas (cada statement separado)
const STATEMENTS = [
  // Categorias
  `CREATE TABLE IF NOT EXISTS categorias (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    emoji TEXT NOT NULL DEFAULT '',
    cor TEXT NOT NULL DEFAULT '#000',
    descricao TEXT,
    ordem INTEGER DEFAULT 0
  )`,

  // Partituras
  `CREATE TABLE IF NOT EXISTS partituras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    compositor TEXT NOT NULL,
    arranjador TEXT,
    categoria_id TEXT NOT NULL,
    ano INTEGER,
    descricao TEXT,
    arquivo_nome TEXT NOT NULL,
    arquivo_tamanho INTEGER,
    downloads INTEGER DEFAULT 0,
    destaque INTEGER DEFAULT 0,
    ativo INTEGER DEFAULT 1,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Usuarios
  `CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    pin_hash TEXT NOT NULL,
    pin_salt TEXT,
    admin INTEGER DEFAULT 0,
    ativo INTEGER DEFAULT 1,
    instrumento_id TEXT,
    foto_url TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso DATETIME
  )`,

  // Partes
  `CREATE TABLE IF NOT EXISTS partes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partitura_id INTEGER NOT NULL,
    instrumento TEXT NOT NULL,
    arquivo_nome TEXT NOT NULL
  )`,

  // Favoritos
  `CREATE TABLE IF NOT EXISTS favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    partitura_id INTEGER NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Instrumentos
  `CREATE TABLE IF NOT EXISTS instrumentos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    familia TEXT,
    ordem INTEGER DEFAULT 0
  )`,

  // Atividades
  `CREATE TABLE IF NOT EXISTS atividades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    titulo TEXT,
    subtitulo TEXT,
    usuario_id INTEGER,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Repertorios
  `CREATE TABLE IF NOT EXISTS repertorios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    ativo INTEGER DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Repertorio Partituras
  `CREATE TABLE IF NOT EXISTS repertorio_partituras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repertorio_id INTEGER NOT NULL,
    partitura_id INTEGER NOT NULL,
    ordem INTEGER DEFAULT 0
  )`,

  // View de estatísticas
  `CREATE VIEW IF NOT EXISTS v_estatisticas AS
  SELECT
    (SELECT COUNT(*) FROM partituras WHERE ativo = 1) as total_partituras,
    (SELECT COUNT(*) FROM usuarios WHERE ativo = 1) as total_usuarios,
    (SELECT COUNT(*) FROM partes) as total_partes,
    (SELECT COALESCE(SUM(downloads), 0) FROM partituras) as total_downloads`,

  // Dados de teste - categorias
  `INSERT OR REPLACE INTO categorias (id, nome, emoji, cor, ordem) VALUES
    ('dobrados', 'Dobrados', '🎺', '#e74c3c', 1)`,

  `INSERT OR REPLACE INTO categorias (id, nome, emoji, cor, ordem) VALUES
    ('marchas', 'Marchas', '🥁', '#3498db', 2)`,

  // Dados de teste - usuarios
  `INSERT OR REPLACE INTO usuarios (id, username, nome, pin_hash, admin, ativo) VALUES
    (1, 'admin', 'Administrador', '1234', 1, 1)`,

  `INSERT OR REPLACE INTO usuarios (id, username, nome, pin_hash, admin, ativo) VALUES
    (2, 'musico', 'Músico Teste', '1234', 0, 1)`,
];

beforeAll(async () => {
  // Executa cada statement individualmente via prepare().run()
  for (const sql of STATEMENTS) {
    try {
      await env.DB.prepare(sql).run();
    } catch (e) {
      // Ignora erros de tabela já existente
      const msg = (e as Error).message;
      if (!msg.includes('already exists')) {
        console.warn(`Schema warning: ${msg}`);
      }
    }
  }
});
