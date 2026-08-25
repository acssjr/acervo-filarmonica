-- Migration 007: Tabela de Avisos
-- Sistema de avisos do admin para músicos

-- Tabela de avisos
CREATE TABLE IF NOT EXISTS avisos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    ativo INTEGER DEFAULT 1,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    criado_por INTEGER,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

-- Registro de leitura de avisos por usuario
CREATE TABLE IF NOT EXISTS avisos_lidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aviso_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    lido_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aviso_id) REFERENCES avisos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE(aviso_id, usuario_id)
);

CREATE INDEX IF NOT EXISTS idx_avisos_ativo ON avisos(ativo, criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_avisos_lidos_usuario ON avisos_lidos(usuario_id, aviso_id);
