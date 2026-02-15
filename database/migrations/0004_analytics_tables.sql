-- database/migrations/0004_analytics_tables.sql
-- Tabela de Logs de Buscas
CREATE TABLE IF NOT EXISTS logs_buscas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    termo TEXT NOT NULL,
    resultados_count INTEGER DEFAULT 0,
    usuario_id INTEGER,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_logs_buscas_data ON logs_buscas(data DESC);
CREATE INDEX IF NOT EXISTS idx_logs_buscas_termo ON logs_buscas(termo);

-- Reestruturação da logs_download para incluir usuario_id e Foreign Keys
-- (Apenas se a coluna usuario_id ainda não existir)
-- Nota: Como o D1 não tem IF NOT EXISTS em ALTER TABLE, usamos uma abordagem de recriação.

PRAGMA foreign_keys=OFF;
CREATE TABLE IF NOT EXISTS logs_download_v2 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partitura_id INTEGER NOT NULL,
    instrumento_id TEXT,
    usuario_id INTEGER,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip TEXT,
    FOREIGN KEY (partitura_id) REFERENCES partituras(id),
    FOREIGN KEY (instrumento_id) REFERENCES instrumentos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tenta copiar dados da tabela antiga (se existir)
-- Ignoramos erros se a tabela antiga não existir
INSERT OR IGNORE INTO logs_download_v2 (id, partitura_id, instrumento_id, data, ip)
SELECT id, partitura_id, instrumento_id, data, ip FROM logs_download;

-- Substituir a tabela antiga pela nova
DROP TABLE IF EXISTS logs_download;
ALTER TABLE logs_download_v2 RENAME TO logs_download;
PRAGMA foreign_keys=ON;
