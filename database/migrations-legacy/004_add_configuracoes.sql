-- Migration: Adicionar tabela de configuracoes globais
-- Data: 2025-12-21

CREATE TABLE IF NOT EXISTS configuracoes (
  chave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserir valor padrao para modo recesso
INSERT OR IGNORE INTO configuracoes (chave, valor) VALUES ('modo_recesso', 'false');
