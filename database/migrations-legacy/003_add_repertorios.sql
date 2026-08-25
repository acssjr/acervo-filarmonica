-- =============================================
-- MIGRATION 003: Add Repertorios Feature
-- Funcionalidade de repertorio/setlist para apresentacoes
-- =============================================

-- Tabela de Repertorios (setlists)
CREATE TABLE IF NOT EXISTS repertorios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    ativo INTEGER DEFAULT 0,  -- Apenas UM pode ser ativo por vez
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_apresentacao DATE,
    criado_por INTEGER,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_repertorios_ativo ON repertorios(ativo);
CREATE INDEX IF NOT EXISTS idx_repertorios_data ON repertorios(data_apresentacao);

-- Tabela de associacao Repertorio <-> Partituras
CREATE TABLE IF NOT EXISTS repertorio_partituras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repertorio_id INTEGER NOT NULL,
    partitura_id INTEGER NOT NULL,
    ordem INTEGER DEFAULT 0,  -- Ordem na setlist
    adicionado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (repertorio_id) REFERENCES repertorios(id) ON DELETE CASCADE,
    FOREIGN KEY (partitura_id) REFERENCES partituras(id) ON DELETE CASCADE,
    UNIQUE(repertorio_id, partitura_id)
);

CREATE INDEX IF NOT EXISTS idx_repertorio_partituras_repertorio ON repertorio_partituras(repertorio_id);
CREATE INDEX IF NOT EXISTS idx_repertorio_partituras_partitura ON repertorio_partituras(partitura_id);
