-- Migration 009: Adicionar tabela de configurações de ensaio (youtube_url)
CREATE TABLE IF NOT EXISTS ensaios_config (
    data_ensaio DATE PRIMARY KEY,
    youtube_url TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
