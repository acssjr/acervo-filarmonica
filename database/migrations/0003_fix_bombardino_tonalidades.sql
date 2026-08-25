-- Normaliza o catálogo: o antigo "Bombardino" representa Bombardino C.
UPDATE instrumentos
SET nome = 'Bombardino C'
WHERE id = 'bombardino' AND nome = 'Bombardino';

-- Abre espaço para Bombardino Bb logo após Bombardino C.
UPDATE instrumentos
SET ordem = ordem + 1
WHERE ordem >= 19
  AND NOT EXISTS (SELECT 1 FROM instrumentos WHERE id = 'bombardino-bb');

INSERT OR IGNORE INTO instrumentos (id, nome, familia, ordem)
VALUES ('bombardino-bb', 'Bombardino Bb', 'Metais', 19);

-- Genéricos cujo PDF/partes de referência confirmam escrita em C.
UPDATE partes
SET instrumento = 'Bombardino C'
WHERE id IN (78, 118, 869, 1336, 1488)
  AND instrumento = 'Bombardino';

-- Genéricos cujo próprio PDF identifica explicitamente Bb/Sib.
UPDATE partes
SET instrumento = 'Bombardino Bb'
WHERE id IN (207, 1202, 1221, 1262, 1302, 1326)
  AND instrumento = 'Bombardino';

-- Cadastrados como Bb, mas conferidos contra Grade/Trombone em escrita de C.
UPDATE partes
SET instrumento = 'Bombardino C'
WHERE id IN (1604, 1889)
  AND instrumento = 'Bombardino Bb';

-- Os registros 1450 e 1473 não são removidos: os objetos estão ausentes no
-- R2 e devem aparecer como indisponíveis até que um administrador os reenvie.
