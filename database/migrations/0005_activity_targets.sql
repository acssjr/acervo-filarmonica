-- Destino navegável das atividades exibidas como notificações.
-- Colunas opcionais preservam todos os registros anteriores.
ALTER TABLE atividades ADD COLUMN entidade_tipo TEXT;
ALTER TABLE atividades ADD COLUMN entidade_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_atividades_entidade
  ON atividades(entidade_tipo, entidade_id);
