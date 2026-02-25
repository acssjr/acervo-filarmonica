-- Migration 008: Corrigir nomes de Bombardino duplicados
-- 
-- Problema: instrumentParser.js mapeava todas as variantes de bombardino
-- (bombardino bb, bombardino c, bombardino eb) para o genérico 'Bombardino',
-- causando perda da tonalidade.
--
-- Estratégia: O arquivo_nome no R2 contém o nome do instrumento detectado.
-- Ex: "1700000000_42_Bombardino.pdf" 
-- Como AMBAS as partes foram salvas com instrumento='Bombardino', precisamos
-- diferenciar usando o arquivo_nome. Em partituras onde existem 2+ partes
-- com instrumento='Bombardino', renomeamos uma delas para 'Bombardino Bb'.
--
-- NOTA: Essa migração cobre o caso mais comum (2 partes de Bombardino, uma
-- delas sendo Bb). Casos mais complexos devem ser corrigidos manualmente
-- via interface admin (PUT /api/partes/:id/renomear).

-- Listar partituras afetadas (para diagnóstico - rodar antes da migração)
-- SELECT p.id, p.titulo, COUNT(*) as num_bombardinos
-- FROM partes pt
-- JOIN partituras p ON p.id = pt.partitura_id
-- WHERE pt.instrumento = 'Bombardino'
-- GROUP BY pt.partitura_id
-- HAVING COUNT(*) > 1;

-- Para cada partitura ATIVA com exatamente 2 partes de 'Bombardino',
-- renomear a que tem 'Bb' ou 'Sib' no arquivo_nome para 'Bombardino Bb':
UPDATE partes
SET instrumento = 'Bombardino Bb'
WHERE instrumento = 'Bombardino'
  AND (
    LOWER(arquivo_nome) LIKE '%bb%'
    OR LOWER(arquivo_nome) LIKE '%sib%'
  )
  AND partitura_id IN (
    SELECT pt3.partitura_id
    FROM partes pt3
    JOIN partituras p2 ON p2.id = pt3.partitura_id
    WHERE pt3.instrumento = 'Bombardino'
      AND p2.ativo = 1
    GROUP BY pt3.partitura_id
    HAVING COUNT(*) = 2
  );
