-- Partes usam nomes instrumentais livres, como "Trompete Bb 1".
-- Portanto logs_download.instrumento_id é um rótulo histórico, não uma FK.
CREATE TABLE logs_download_v2 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partitura_id INTEGER NOT NULL,
    instrumento_id TEXT,
    usuario_id INTEGER,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip TEXT,
    FOREIGN KEY (partitura_id) REFERENCES partituras(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO logs_download_v2 (id, partitura_id, instrumento_id, usuario_id, data, ip)
SELECT id, partitura_id, instrumento_id, usuario_id, data, ip
FROM logs_download;

DROP TABLE logs_download;
ALTER TABLE logs_download_v2 RENAME TO logs_download;

CREATE INDEX IF NOT EXISTS idx_logs_download_usuario ON logs_download(usuario_id);
