CREATE TABLE partitura_editaveis (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL
);

CREATE TABLE partitura_editavel_versoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    editavel_id TEXT NOT NULL REFERENCES partitura_editaveis(id),
    arquivo_chave TEXT NOT NULL UNIQUE,
    arquivo_nome TEXT NOT NULL,
    formato TEXT NOT NULL CHECK (formato IN ('sib', 'musx')),
    tamanho INTEGER NOT NULL,
    sha256 TEXT NOT NULL,
    metadados TEXT NOT NULL,
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    criado_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    UNIQUE (editavel_id, sha256)
);

CREATE INDEX idx_editavel_versoes ON partitura_editavel_versoes(editavel_id, id DESC);
