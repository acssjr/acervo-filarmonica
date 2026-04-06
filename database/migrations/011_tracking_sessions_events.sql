CREATE TABLE IF NOT EXISTS tracking_sessions (
  id TEXT PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  inicio_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  fim_em DATETIME,
  fim_motivo TEXT,
  ultimo_evento_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_tracking_sessions_usuario_inicio
  ON tracking_sessions(usuario_id, inicio_em DESC);

CREATE INDEX IF NOT EXISTS idx_tracking_sessions_ultimo_evento
  ON tracking_sessions(ultimo_evento_em DESC);

CREATE TABLE IF NOT EXISTS tracking_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  usuario_id INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  origem TEXT,
  partitura_id INTEGER,
  parte_id INTEGER,
  repertorio_id INTEGER,
  termo_original TEXT,
  termo_normalizado TEXT,
  resultados_count INTEGER,
  metadata_json TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES tracking_sessions(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (partitura_id) REFERENCES partituras(id),
  FOREIGN KEY (parte_id) REFERENCES partes(id),
  FOREIGN KEY (repertorio_id) REFERENCES repertorios(id)
);

CREATE INDEX IF NOT EXISTS idx_tracking_events_criado
  ON tracking_events(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_usuario_criado
  ON tracking_events(usuario_id, criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_session
  ON tracking_events(session_id, criado_em ASC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_tipo_criado
  ON tracking_events(tipo, criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_partitura_criado
  ON tracking_events(partitura_id, criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_parte_criado
  ON tracking_events(parte_id, criado_em DESC);
