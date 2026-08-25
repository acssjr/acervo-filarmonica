-- Migration 0004: Analytics Tables
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

-- Adiciona coluna usuario_id à tabela logs_download (se ainda não existir)
-- Nota: SQLite/D1 suporta ALTER TABLE ADD COLUMN de forma idempotente com IF NOT EXISTS não disponível,
-- mas como esta migration só é executada uma vez pelo sistema de migrações, ADD COLUMN é suficiente.
ALTER TABLE logs_download ADD COLUMN usuario_id INTEGER REFERENCES usuarios(id);
