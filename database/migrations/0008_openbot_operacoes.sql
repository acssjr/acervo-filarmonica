CREATE TABLE openbot_operacoes (
    id TEXT PRIMARY KEY,
    metodo TEXT NOT NULL,
    destino TEXT NOT NULL,
    dados TEXT,
    estado TEXT NOT NULL DEFAULT 'pendente',
    criado_em INTEGER NOT NULL,
    decidido_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    decidido_em INTEGER,
    http_status INTEGER,
    resultado TEXT
);
CREATE INDEX idx_openbot_operacoes_pendentes ON openbot_operacoes(estado, criado_em DESC);
