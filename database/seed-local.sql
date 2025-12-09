-- =============================================
-- SEED PARA AMBIENTE LOCAL (wrangler dev)
-- Dados de teste isolados da produção
-- =============================================

-- IMPORTANTE: Este arquivo é usado APENAS para desenvolvimento local
-- NÃO executar em produção!

-- Usuário admin de teste (PIN: 1234 - formato legado, será migrado no primeiro login)
INSERT OR IGNORE INTO usuarios (id, username, nome, pin_hash, pin_salt, admin, ativo, instrumento_id) VALUES
    (1, 'admin', 'Admin Teste', '1234', NULL, 1, 1, 'regente'),
    (2, 'musico', 'Músico Teste', '1234', NULL, 0, 1, 'clarinete-bb');

-- Partitura de exemplo (sem arquivo PDF - apenas para testar listagem)
INSERT OR IGNORE INTO partituras (id, titulo, compositor, arranjador, categoria_id, ano, descricao, arquivo_nome, destaque, ativo) VALUES
    (1, 'Dobrado Teste', 'Compositor Teste', 'Arranjador Teste', 'dobrados', 2024, 'Partitura de exemplo para testes locais', 'teste.pdf', 1, 1),
    (2, 'Valsa de Teste', 'Autor Exemplo', NULL, 'valsas', 2023, 'Outra partitura de teste', 'valsa-teste.pdf', 0, 1);

-- Atividade de exemplo
INSERT OR IGNORE INTO atividades (tipo, titulo, detalhes, usuario_id) VALUES
    ('upload', 'Seed executado', 'Banco local inicializado com dados de teste', 1);
