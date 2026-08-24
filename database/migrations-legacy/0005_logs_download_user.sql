-- database/migrations/0005_logs_download_user.sql
-- Adicionar coluna usuario_id na tabela logs_download para rastrear quem baixou

ALTER TABLE logs_download ADD COLUMN usuario_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_logs_download_usuario ON logs_download(usuario_id);
