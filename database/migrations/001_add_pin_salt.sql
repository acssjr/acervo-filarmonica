-- Migration: Adicionar coluna pin_salt para suporte a PBKDF2
-- Data: 2025-12-04
-- Descrição: Adiciona suporte a hash de PIN seguro com salt

-- Adicionar coluna pin_salt se não existir
ALTER TABLE usuarios ADD COLUMN pin_salt TEXT;

-- Adicionar colunas instrumento_id e foto_url se não existirem
-- (SQLite não suporta ADD COLUMN IF NOT EXISTS, mas ignora erro se já existe)
ALTER TABLE usuarios ADD COLUMN instrumento_id TEXT;
ALTER TABLE usuarios ADD COLUMN foto_url TEXT;

-- Criar tabela de partes se não existir
CREATE TABLE IF NOT EXISTS partes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partitura_id INTEGER NOT NULL,
    instrumento TEXT NOT NULL,
    arquivo_nome TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (partitura_id) REFERENCES partituras(id)
);

CREATE INDEX IF NOT EXISTS idx_partes_partitura ON partes(partitura_id);

-- Criar tabela de favoritos se não existir
CREATE TABLE IF NOT EXISTS favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    partitura_id INTEGER NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (partitura_id) REFERENCES partituras(id),
    UNIQUE(usuario_id, partitura_id)
);

CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(usuario_id);

-- Criar tabela de atividades se não existir
CREATE TABLE IF NOT EXISTS atividades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    detalhes TEXT,
    usuario_id INTEGER,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_atividades_criado ON atividades(criado_em DESC);
