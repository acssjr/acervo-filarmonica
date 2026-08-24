-- =============================================
-- ACERVO DIGITAL - SCHEMA DO BANCO DE DADOS
-- Sociedade Filarmônica 25 de Março
-- =============================================

-- Tabela de Categorias/Gêneros
CREATE TABLE IF NOT EXISTS categorias (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    emoji TEXT NOT NULL,
    cor TEXT NOT NULL,
    descricao TEXT,
    ordem INTEGER DEFAULT 0
);

-- Inserir categorias padrão (sincronizado com produção)
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

-- Tabela de Partituras
CREATE TABLE IF NOT EXISTS partituras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    compositor TEXT NOT NULL,
    arranjador TEXT,
    categoria_id TEXT NOT NULL,
    ano INTEGER,
    descricao TEXT,
    arquivo_nome TEXT NOT NULL,
    arquivo_tamanho INTEGER,
    downloads INTEGER DEFAULT 0,
    destaque INTEGER DEFAULT 0,
    ativo INTEGER DEFAULT 1,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_partituras_categoria ON partituras(categoria_id);
CREATE INDEX IF NOT EXISTS idx_partituras_titulo ON partituras(titulo);
CREATE INDEX IF NOT EXISTS idx_partituras_compositor ON partituras(compositor);
CREATE INDEX IF NOT EXISTS idx_partituras_destaque ON partituras(destaque);

-- Tabela de Usuários (Admins)
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    nome_exibicao TEXT,
    pin_hash TEXT NOT NULL,
    pin_salt TEXT,  -- Salt para PBKDF2 (NULL = formato legado plaintext, será migrado no login)
    admin INTEGER DEFAULT 0,
    ativo INTEGER DEFAULT 1,
    instrumento_id TEXT,
    foto_url TEXT,
    convidado INTEGER DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso DATETIME,
    FOREIGN KEY (instrumento_id) REFERENCES instrumentos(id)
);

-- NOTA: Não há mais admin padrão hardcoded por segurança
-- Para criar o primeiro admin, use o script de setup ou crie manualmente:
-- INSERT INTO usuarios (username, nome, pin_hash, pin_salt, admin) VALUES ('seu_admin', 'Nome', 'hash_pbkdf2', 'salt', 1);

-- Tabela de Instrumentos
CREATE TABLE IF NOT EXISTS instrumentos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    familia TEXT NOT NULL,
    ordem INTEGER DEFAULT 0
);

-- Inserir instrumentos
INSERT OR IGNORE INTO instrumentos (id, nome, familia, ordem) VALUES
    ('flauta', 'Flauta', 'Madeiras', 1),
    ('flautim', 'Flautim', 'Madeiras', 2),
    ('oboe', 'Oboé', 'Madeiras', 3),
    ('clarinete-eb', 'Clarinete Eb (Requinta)', 'Madeiras', 4),
    ('clarinete-bb', 'Clarinete Bb', 'Madeiras', 5),
    ('clarinete-baixo', 'Clarinete Baixo', 'Madeiras', 6),
    ('fagote', 'Fagote', 'Madeiras', 7),
    ('saxofone-soprano', 'Saxofone Soprano', 'Madeiras', 8),
    ('saxofone-alto', 'Saxofone Alto', 'Madeiras', 9),
    ('saxofone-tenor', 'Saxofone Tenor', 'Madeiras', 10),
    ('saxofone-baritono', 'Saxofone Barítono', 'Madeiras', 11),
    ('trompete', 'Trompete', 'Metais', 12),
    ('flugelhorn', 'Flugelhorn', 'Metais', 13),
    ('trompa', 'Trompa', 'Metais', 14),
    ('trombone', 'Trombone', 'Metais', 15),
    ('trombone-baixo', 'Trombone Baixo', 'Metais', 16),
    ('euphonium', 'Eufônio', 'Metais', 17),
    ('bombardino', 'Bombardino', 'Metais', 18),
    ('tuba', 'Tuba', 'Metais', 19),
    ('tuba-eb', 'Tuba Eb', 'Metais', 20),
    ('tuba-bb', 'Tuba Bb', 'Metais', 21),
    ('timpano', 'Tímpano', 'Percussão', 22),
    ('caixa', 'Caixa', 'Percussão', 23),
    ('bombo', 'Bombo', 'Percussão', 24),
    ('pratos', 'Pratos', 'Percussão', 25),
    ('percussao', 'Percussão Geral', 'Percussão', 26),
    ('regente', 'Regente', 'Outros', 27);

-- Tabela de Partes (arquivos individuais por instrumento)
CREATE TABLE IF NOT EXISTS partes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partitura_id INTEGER NOT NULL,
    instrumento TEXT NOT NULL,
    arquivo_nome TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (partitura_id) REFERENCES partituras(id)
);

CREATE INDEX IF NOT EXISTS idx_partes_partitura ON partes(partitura_id);

-- Tabela de Favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    partitura_id INTEGER NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (partitura_id) REFERENCES partituras(id),
    UNIQUE(usuario_id, partitura_id)
);

CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(usuario_id);

-- Tabela de Atividades (log de ações)
CREATE TABLE IF NOT EXISTS atividades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    detalhes TEXT,
    usuario_id INTEGER,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_atividades_criado ON atividades(criado_em DESC);

-- Tabela de Logs de Download
CREATE TABLE IF NOT EXISTS logs_download (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partitura_id INTEGER NOT NULL,
    instrumento_id TEXT,
    usuario_id INTEGER,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip TEXT,
    FOREIGN KEY (partitura_id) REFERENCES partituras(id),
    FOREIGN KEY (instrumento_id) REFERENCES instrumentos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- View para estatísticas
CREATE VIEW IF NOT EXISTS v_estatisticas AS
SELECT
    (SELECT COUNT(*) FROM partituras WHERE ativo = 1) as total_partituras,
    (SELECT SUM(downloads) FROM partituras) as total_downloads,
    (SELECT COUNT(*) FROM categorias) as total_categorias,
    (SELECT COUNT(*) FROM usuarios WHERE ativo = 1) as total_usuarios;

-- Tabela de Presencas em Ensaios
CREATE TABLE IF NOT EXISTS presencas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    data_ensaio DATE NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    criado_por INTEGER,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id),
    UNIQUE(usuario_id, data_ensaio)
);

CREATE INDEX IF NOT EXISTS idx_presencas_usuario ON presencas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_presencas_data ON presencas(data_ensaio DESC);
CREATE INDEX IF NOT EXISTS idx_presencas_usuario_data ON presencas(usuario_id, data_ensaio DESC);

-- Tabela de Partituras Tocadas em Ensaios
CREATE TABLE IF NOT EXISTS ensaios_partituras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_ensaio DATE NOT NULL,
    partitura_id INTEGER NOT NULL,
    ordem INTEGER DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    criado_por INTEGER,
    FOREIGN KEY (partitura_id) REFERENCES partituras(id) ON DELETE CASCADE,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id),
    UNIQUE(data_ensaio, partitura_id)
);

CREATE INDEX IF NOT EXISTS idx_ensaios_partituras_data ON ensaios_partituras(data_ensaio);
CREATE INDEX IF NOT EXISTS idx_ensaios_partituras_partitura ON ensaios_partituras(partitura_id);

-- Tabela de Avisos (admin → músicos)
CREATE TABLE IF NOT EXISTS avisos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    ativo INTEGER DEFAULT 1,
    inicia_em DATETIME DEFAULT NULL,
    expira_em DATETIME DEFAULT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    criado_por INTEGER,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

-- Registro de leitura de avisos
CREATE TABLE IF NOT EXISTS avisos_lidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aviso_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    lido_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aviso_id) REFERENCES avisos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE(aviso_id, usuario_id)
);

CREATE INDEX IF NOT EXISTS idx_avisos_ativo ON avisos(ativo, criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_avisos_agendamento ON avisos(ativo, inicia_em, expira_em);
CREATE INDEX IF NOT EXISTS idx_avisos_lidos_usuario ON avisos_lidos(usuario_id, aviso_id);

-- Tabela de Logs de Buscas
CREATE TABLE IF NOT EXISTS logs_buscas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    termo TEXT NOT NULL,
    resultados_count INTEGER DEFAULT 0,
    usuario_id INTEGER,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_logs_buscas_data ON logs_buscas(data DESC);
CREATE INDEX IF NOT EXISTS idx_logs_buscas_termo ON logs_buscas(termo);

-- Repertórios de apresentação
CREATE TABLE IF NOT EXISTS repertorios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    ativo INTEGER DEFAULT 0,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_apresentacao DATE,
    criado_por INTEGER,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_repertorios_ativo ON repertorios(ativo);
CREATE INDEX IF NOT EXISTS idx_repertorios_data ON repertorios(data_apresentacao);

CREATE TABLE IF NOT EXISTS repertorio_partituras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repertorio_id INTEGER NOT NULL,
    partitura_id INTEGER NOT NULL,
    ordem INTEGER DEFAULT 0,
    adicionado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (repertorio_id) REFERENCES repertorios(id) ON DELETE CASCADE,
    FOREIGN KEY (partitura_id) REFERENCES partituras(id) ON DELETE CASCADE,
    UNIQUE(repertorio_id, partitura_id)
);

CREATE INDEX IF NOT EXISTS idx_repertorio_partituras_repertorio ON repertorio_partituras(repertorio_id);
CREATE INDEX IF NOT EXISTS idx_repertorio_partituras_partitura ON repertorio_partituras(partitura_id);

-- Configurações globais
CREATE TABLE IF NOT EXISTS configuracoes (
    chave TEXT PRIMARY KEY,
    valor TEXT NOT NULL,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO configuracoes (chave, valor) VALUES
    ('modo_recesso', 'false'),
    ('dias_ensaio', '[1,3]'),
    ('hora_ensaio', '19');

CREATE TABLE IF NOT EXISTS ensaios_config (
    data_ensaio DATE PRIMARY KEY,
    youtube_url TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessões e eventos de uso do acervo
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

CREATE INDEX IF NOT EXISTS idx_logs_download_usuario ON logs_download(usuario_id);
