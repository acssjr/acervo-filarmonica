ALTER TABLE partituras ADD COLUMN audio_key TEXT;
ALTER TABLE partituras ADD COLUMN audio_mime TEXT;
ALTER TABLE partituras ADD COLUMN audio_name TEXT;
ALTER TABLE partituras ADD COLUMN audio_size INTEGER;
ALTER TABLE partituras ADD COLUMN youtube_url TEXT;

CREATE INDEX IF NOT EXISTS idx_partituras_midia
ON partituras(ativo, titulo)
WHERE audio_key IS NOT NULL OR youtube_url IS NOT NULL;
