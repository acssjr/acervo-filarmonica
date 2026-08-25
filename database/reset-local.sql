PRAGMA foreign_keys = OFF;

DELETE FROM tracking_events;
DELETE FROM tracking_sessions;
DELETE FROM avisos_lidos;
DELETE FROM avisos;
DELETE FROM ensaios_config;
DELETE FROM ensaios_partituras;
DELETE FROM presencas;
DELETE FROM repertorio_partituras;
DELETE FROM repertorios;
DELETE FROM logs_buscas;
DELETE FROM logs_download;
DELETE FROM atividades;
DELETE FROM favoritos;
DELETE FROM partes;
DELETE FROM partituras;
DELETE FROM usuarios;

DELETE FROM sqlite_sequence WHERE name IN (
  'tracking_events',
  'avisos_lidos',
  'avisos',
  'ensaios_partituras',
  'presencas',
  'repertorio_partituras',
  'repertorios',
  'logs_buscas',
  'logs_download',
  'atividades',
  'favoritos',
  'partes',
  'partituras',
  'usuarios'
);

PRAGMA foreign_keys = ON;
