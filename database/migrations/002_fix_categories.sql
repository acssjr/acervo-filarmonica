-- =============================================
-- MIGRACAO: Corrigir categorias
-- Data: 2025-12-09
-- Problema: IDs no singular e categorias faltantes
-- =============================================

-- PASSO 1: Inserir novas categorias (as que estao faltando completamente)
INSERT OR IGNORE INTO categorias (id, nome, emoji, cor, descricao, ordem) VALUES
    ('dobrados', 'Dobrados', '🎺', '#e74c3c', 'Marchas militares brasileiras', 1),
    ('marchas', 'Marchas', '🥁', '#3498db', 'Marchas tradicionais', 2),
    ('marchas-funebres', 'Marchas Fúnebres', '✝️', '#555555', 'Marchas fúnebres', 3),
    ('marchas-religiosas', 'Marchas Religiosas', '⛪', '#8B4513', 'Marchas religiosas e processionais', 4),
    ('fantasias', 'Fantasias', '✨', '#27ae60', 'Fantasias e suítes', 5),
    ('polacas', 'Polacas', '👑', '#e67e22', 'Polacas e polonaises', 6),
    ('boleros', 'Boleros', '☀️', '#e91e63', 'Boleros espanhóis', 7),
    ('valsas', 'Valsas', '💃', '#9b59b6', 'Valsas clássicas e brasileiras', 8),
    ('arranjos', 'Arranjos', '🎛️', '#00bcd4', 'Arranjos diversos', 9),
    ('hinos', 'Hinos', '🏴', '#ffc107', 'Hinos em geral', 10),
    ('hinos-civicos', 'Hinos Cívicos', '🏛️', '#2196F3', 'Hinos cívicos e patrióticos', 11),
    ('hinos-religiosos', 'Hinos Religiosos', '⛪', '#795548', 'Hinos sacros e religiosos', 12),
    ('preludios', 'Prelúdios', '✨', '#673AB7', 'Prelúdios e aberturas', 13);

-- PASSO 2: Atualizar partituras que usam IDs antigos (singular -> plural)
UPDATE partituras SET categoria_id = 'dobrados' WHERE categoria_id = 'dobrado';
UPDATE partituras SET categoria_id = 'marchas' WHERE categoria_id = 'marcha';
UPDATE partituras SET categoria_id = 'fantasias' WHERE categoria_id = 'fantasia';
UPDATE partituras SET categoria_id = 'polacas' WHERE categoria_id = 'polaca';
UPDATE partituras SET categoria_id = 'boleros' WHERE categoria_id = 'bolero';
UPDATE partituras SET categoria_id = 'valsas' WHERE categoria_id = 'valsa';
UPDATE partituras SET categoria_id = 'arranjos' WHERE categoria_id = 'arranjo';

-- PASSO 3: Remover categorias antigas (singular) que nao sao mais usadas
DELETE FROM categorias WHERE id = 'dobrado';
DELETE FROM categorias WHERE id = 'marcha';
DELETE FROM categorias WHERE id = 'fantasia';
DELETE FROM categorias WHERE id = 'polaca';
DELETE FROM categorias WHERE id = 'bolero';
DELETE FROM categorias WHERE id = 'valsa';
DELETE FROM categorias WHERE id = 'arranjo';

-- Verificar resultado
SELECT id, nome, ordem FROM categorias ORDER BY ordem;
