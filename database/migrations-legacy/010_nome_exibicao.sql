-- Migration 010: Adiciona coluna nome_exibicao para músicos definirem
-- como querem ser chamados no sistema (ex: "Carlos" em vez de "Antônio Carlos")
ALTER TABLE usuarios ADD COLUMN nome_exibicao TEXT;
