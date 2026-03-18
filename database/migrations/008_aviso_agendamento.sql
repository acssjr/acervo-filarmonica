-- Migration 008: Agendamento de avisos
-- Adiciona campos para controle de validade e programação de avisos

ALTER TABLE avisos ADD COLUMN inicia_em DATETIME DEFAULT NULL;
ALTER TABLE avisos ADD COLUMN expira_em DATETIME DEFAULT NULL;

-- inicia_em: quando o aviso começa a ser exibido (NULL = imediato)
-- expira_em: quando o aviso deixa de ser exibido (NULL = nunca expira)

CREATE INDEX IF NOT EXISTS idx_avisos_agendamento ON avisos(ativo, inicia_em, expira_em);
