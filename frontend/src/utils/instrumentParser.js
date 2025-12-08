// ===== INSTRUMENT PARSER =====
// Funções para normalização e reconhecimento de nomes de instrumentos
// Extraído de UploadPastaModal.jsx para reutilização

// Mapeamento completo: nome normalizado → nome correto/padrão
export const nomesPadrao = {
  // Grade
  'grade': 'Grade',
  'score': 'Grade',
  'conductor': 'Grade',
  'full score': 'Grade',

  // Flautas
  'flautim': 'Flautim',
  'piccolo': 'Flautim',
  'flauta': 'Flauta',
  'flute': 'Flauta',

  // Requinta
  'requinta': 'Requinta',
  'requinta eb': 'Requinta',
  'eb clarinet': 'Requinta',

  // Clarinetes
  'clarinete bb': 'Clarinete Bb',
  'clarinete bb 1': 'Clarinete Bb 1',
  'clarinete bb 2': 'Clarinete Bb 2',
  'clarinete bb 3': 'Clarinete Bb 3',
  'clarinete': 'Clarinete Bb',
  'clarinete 1': 'Clarinete Bb 1',
  'clarinete 2': 'Clarinete Bb 2',
  'clarinete 3': 'Clarinete Bb 3',
  'clarineta bb': 'Clarinete Bb',
  'clarineta bb 1': 'Clarinete Bb 1',
  'clarineta bb 2': 'Clarinete Bb 2',
  'clarineta bb 3': 'Clarinete Bb 3',
  'clarineta': 'Clarinete Bb',
  'clarineta 1': 'Clarinete Bb 1',
  'clarineta 2': 'Clarinete Bb 2',
  'clarineta 3': 'Clarinete Bb 3',
  'clarinet': 'Clarinete Bb',
  'clarinet 1': 'Clarinete Bb 1',
  'clarinet 2': 'Clarinete Bb 2',
  'clarinet 3': 'Clarinete Bb 3',
  'bb clarinet': 'Clarinete Bb',
  'bb clarinet 1': 'Clarinete Bb 1',
  'bb clarinet 2': 'Clarinete Bb 2',
  'bb clarinet 3': 'Clarinete Bb 3',

  // Saxofones
  'sax soprano': 'Sax. Soprano',
  'sax. soprano': 'Sax. Soprano',
  'saxofone soprano': 'Sax. Soprano',
  'soprano sax': 'Sax. Soprano',
  'soprano saxophone': 'Sax. Soprano',

  'sax alto': 'Sax. Alto',
  'sax. alto': 'Sax. Alto',
  'sax alto 1': 'Sax. Alto 1',
  'sax. alto 1': 'Sax. Alto 1',
  'sax alto 2': 'Sax. Alto 2',
  'sax. alto 2': 'Sax. Alto 2',
  'saxofone alto': 'Sax. Alto',
  'alto sax': 'Sax. Alto',
  'alto sax 1': 'Sax. Alto 1',
  'alto sax 2': 'Sax. Alto 2',
  'alto saxophone': 'Sax. Alto',

  'sax tenor': 'Sax. Tenor',
  'sax. tenor': 'Sax. Tenor',
  'sax tenor 1': 'Sax. Tenor 1',
  'sax. tenor 1': 'Sax. Tenor 1',
  'sax tenor 2': 'Sax. Tenor 2',
  'sax. tenor 2': 'Sax. Tenor 2',
  'saxofone tenor': 'Sax. Tenor',
  'tenor sax': 'Sax. Tenor',
  'tenor sax 1': 'Sax. Tenor 1',
  'tenor sax 2': 'Sax. Tenor 2',
  'tenor saxophone': 'Sax. Tenor',

  'sax baritono': 'Sax. Baritono',
  'sax. baritono': 'Sax. Baritono',
  'saxofone baritono': 'Sax. Baritono',
  'baritone sax': 'Sax. Baritono',
  'baritono sax': 'Sax. Baritono',
  'bari sax': 'Sax. Baritono',
  'baritone saxophone': 'Sax. Baritono',

  // Trompetes
  'trompete bb': 'Trompete Bb',
  'trompete bb 1': 'Trompete Bb 1',
  'trompete bb 2': 'Trompete Bb 2',
  'trompete bb 3': 'Trompete Bb 3',
  'trompete': 'Trompete Bb',
  'trompete 1': 'Trompete Bb 1',
  'trompete 2': 'Trompete Bb 2',
  'trompete 3': 'Trompete Bb 3',
  'trumpet': 'Trompete Bb',
  'trumpet 1': 'Trompete Bb 1',
  'trumpet 2': 'Trompete Bb 2',
  'trumpet 3': 'Trompete Bb 3',
  'bb trumpet': 'Trompete Bb',
  'bb trumpet 1': 'Trompete Bb 1',
  'bb trumpet 2': 'Trompete Bb 2',
  'bb trumpet 3': 'Trompete Bb 3',
  'trumpet in bb': 'Trompete Bb',
  'trumpet in bb 1': 'Trompete Bb 1',
  'trumpet in bb 2': 'Trompete Bb 2',
  'trumpet in bb 3': 'Trompete Bb 3',

  // Trompas
  'trompa f': 'Trompa F',
  'trompa f 1': 'Trompa F 1',
  'trompa f 2': 'Trompa F 2',
  'trompa eb': 'Trompa Eb',
  'trompa eb 1': 'Trompa Eb 1',
  'trompa eb 2': 'Trompa Eb 2',
  'trompa': 'Trompa F',
  'trompa 1': 'Trompa F 1',
  'trompa 2': 'Trompa F 2',
  'horn': 'Trompa F',
  'horn 1': 'Trompa F 1',
  'horn 2': 'Trompa F 2',
  'french horn': 'Trompa F',
  'f horn': 'Trompa F',
  'eb horn': 'Trompa Eb',
  'horn in f': 'Trompa F',
  'horn in f 1': 'Trompa F 1',
  'horn in f 2': 'Trompa F 2',
  'horn in eb': 'Trompa Eb',
  'horn in eb 1': 'Trompa Eb 1',
  'horn in eb 2': 'Trompa Eb 2',

  // Baritonos
  'baritono bb': 'Baritono Bb',
  'baritono bb 1': 'Baritono Bb 1',
  'baritono bb 2': 'Baritono Bb 2',
  'baritono': 'Baritono Bb',
  'baritono 1': 'Baritono Bb 1',
  'baritono 2': 'Baritono Bb 2',
  'baritone': 'Baritono Bb',
  'baritone 1': 'Baritono Bb 1',
  'baritone 2': 'Baritono Bb 2',
  'baritone tc': 'Baritono Bb',
  'baritone bc': 'Baritono Bb',

  // Trombones
  'trombone': 'Trombone',
  'trombone 1': 'Trombone 1',
  'trombone 2': 'Trombone 2',
  'trombone 3': 'Trombone 3',

  // Bombardinos
  'bombardino': 'Bombardino',
  'bombardino bb': 'Bombardino',
  'bombardino c': 'Bombardino',
  'bombardino eb': 'Bombardino',
  'euphonium': 'Bombardino',
  'euphonium 1': 'Bombardino',
  'euphonium 2': 'Bombardino',

  // Tubas/Baixos
  'baixo eb': 'Baixo Eb',
  'baixo bb': 'Baixo Bb',
  'baixo': 'Baixo Eb',
  'tuba': 'Baixo Eb',
  'tuba eb': 'Baixo Eb',
  'tuba bb': 'Baixo Bb',
  'bass': 'Baixo Eb',
  'eb bass': 'Baixo Eb',
  'bb bass': 'Baixo Bb',

  // Percussao
  'caixa': 'Caixa',
  'caixa clara': 'Caixa',
  'caixa-clara': 'Caixa',
  'snare': 'Caixa',
  'snare drum': 'Caixa',
  'caixa ferro tamborim': 'Caixa',
  'caixa-ferro-tamborim': 'Caixa',
  'caixa e tamborim': 'Caixa',
  'tamborim': 'Caixa',

  'bombo': 'Bombo',
  'bumbo': 'Bombo',
  'bass drum': 'Bombo',

  'pratos': 'Pratos',
  'prato': 'Pratos',
  'cymbals': 'Pratos',
  'cymbal': 'Pratos',

  'percussao': 'Percussao',
  'percussion': 'Percussao',
  'drums': 'Percussao',
  'bateria': 'Percussao',
  'drum set': 'Percussao'
};

/**
 * Normaliza texto removendo acentos e padronizando espacos
 * @param {string} texto - Texto a normalizar
 * @returns {string} Texto normalizado
 */
export const normalizarTexto = (texto) => {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_\-.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Extrai instrumento do nome do arquivo PDF
 * @param {string} nomeArquivo - Nome do arquivo (ex: "01 - Clarinete Bb 1.pdf")
 * @returns {{ instrumento: string, reconhecido: boolean }}
 */
export const extrairInstrumento = (nomeArquivo) => {
  if (!nomeArquivo) return { instrumento: '', reconhecido: false };

  let nome = nomeArquivo.replace(/\.pdf$/i, '');
  nome = nome.replace(/^\d+[\s\-_\.]*/, '');
  // Usar \s+ (1+ espacos) para nao quebrar nomes com hifen como "Caixa-clara"
  nome = nome.replace(/^.+\s+-\s+/, '');

  const matchNumero = nome.match(/\s+(\d+)$/);
  const numeroFinal = matchNumero ? matchNumero[1] : null;
  const nomeBase = nome.replace(/\s+\d+$/, '').trim();
  const nomeNormalizado = normalizarTexto(nomeBase);

  const adicionarNumero = (instrumento) => {
    if (numeroFinal && !/\d$/.test(instrumento)) {
      return `${instrumento} ${numeroFinal}`;
    }
    return instrumento;
  };

  // Busca exata
  if (nomesPadrao[nomeNormalizado]) {
    return { instrumento: adicionarNumero(nomesPadrao[nomeNormalizado]), reconhecido: true };
  }

  // Busca parcial (maior para menor para evitar falsos positivos)
  const chaves = Object.keys(nomesPadrao).sort((a, b) => b.length - a.length);
  for (const chave of chaves) {
    if (nomeNormalizado.includes(chave) || nomeNormalizado.endsWith(chave)) {
      return { instrumento: adicionarNumero(nomesPadrao[chave]), reconhecido: true };
    }
  }

  return { instrumento: nome.trim(), reconhecido: false };
};
