-- Contador atomico de tentativas de login.
-- Mantem a politica de 5 tentativas por 5 minutos sem compartilhar a cota
-- entre contas diferentes que acessam pela mesma rede.
CREATE TABLE IF NOT EXISTS login_rate_limits (
    chave TEXT PRIMARY KEY,
    tentativas INTEGER NOT NULL DEFAULT 0,
    janela_inicio INTEGER NOT NULL,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_login_rate_limits_atualizado
    ON login_rate_limits(atualizado_em);
