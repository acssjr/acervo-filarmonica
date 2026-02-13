-- Migration 005: Adicionar tabelas de presença em ensaios
-- Tabelas: presencas, ensaios_partituras

CREATE TABLE IF NOT EXISTS presencas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    data_ensaio DATE NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    criado_por INTEGER,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id),
    UNIQUE(usuario_id, data_ensaio)
);

CREATE INDEX IF NOT EXISTS idx_presencas_usuario ON presencas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_presencas_data ON presencas(data_ensaio DESC);
CREATE INDEX IF NOT EXISTS idx_presencas_usuario_data ON presencas(usuario_id, data_ensaio DESC);

CREATE TABLE IF NOT EXISTS ensaios_partituras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_ensaio DATE NOT NULL,
    partitura_id INTEGER NOT NULL,
    ordem INTEGER DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    criado_por INTEGER,
    FOREIGN KEY (partitura_id) REFERENCES partituras(id) ON DELETE CASCADE,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id),
    UNIQUE(data_ensaio, partitura_id)
);

CREATE INDEX IF NOT EXISTS idx_ensaios_partituras_data ON ensaios_partituras(data_ensaio);
CREATE INDEX IF NOT EXISTS idx_ensaios_partituras_partitura ON ensaios_partituras(partitura_id);
