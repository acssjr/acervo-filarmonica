// ===== INSTRUMENT PARSER =====
// Funções para normalização e reconhecimento de nomes de instrumentos
// Extraído de UploadPastaModal.jsx para reutilização

// Mapeamento de algarismos romanos para arábicos
const romanosParaArabicos = {
  'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5,
  'vi': 6, 'vii': 7, 'viii': 8, 'ix': 9, 'x': 10
};

// Converte romano ou arábico para número
const converterParaNumero = (valor) => {
  const valorLower = valor.toLowerCase();
  if (romanosParaArabicos[valorLower]) {
    return romanosParaArabicos[valorLower];
  }
  const num = parseInt(valor, 10);
  return isNaN(num) ? null : num;
};

// Detecta número romano, arábico ou ordinal no início do texto
// Retorna { numero: number | null, resto: string, combinado: boolean, numerosCombinados: string | null }
const extrairNumeroPrefixo = (texto) => {
  // Padrão para "I e II", "1 e 2" no início (partes combinadas)
  const matchCombinado = texto.match(/^(i+|iv|v|vi+|ix|x|\d+)\s*e\s*(i+|iv|v|vi+|ix|x|\d+)\s*/i);
  if (matchCombinado) {
    const num1 = converterParaNumero(matchCombinado[1]);
    const num2 = converterParaNumero(matchCombinado[2]);
    const numerosCombinados = (num1 && num2) ? `${num1} e ${num2}` : null;
    return { numero: null, resto: texto.slice(matchCombinado[0].length), combinado: true, numerosCombinados };
  }

  // Padrão para número ordinal no início (1º, 2º, 1°, 2°, 1ª, 2ª)
  const matchOrdinal = texto.match(/^(\d+)[ºª°]\s*/i);
  if (matchOrdinal) {
    const num = parseInt(matchOrdinal[1], 10);
    if (num >= 1 && num <= 10) {
      return { numero: num, resto: texto.slice(matchOrdinal[0].length), combinado: false, numerosCombinados: null };
    }
  }

  // Padrão para número romano sozinho no início (I, II, III, IV, etc.)
  const matchRomano = texto.match(/^(i{1,3}|iv|v|vi{0,3}|ix|x)\s+/i);
  if (matchRomano) {
    const romano = matchRomano[1].toLowerCase();
    const num = romanosParaArabicos[romano];
    if (num) {
      return { numero: num, resto: texto.slice(matchRomano[0].length), combinado: false, numerosCombinados: null };
    }
  }

  // Padrão para número arábico sozinho no início (1, 2, 3, etc.)
  const matchArabico = texto.match(/^(\d+)\s+/);
  if (matchArabico) {
    const num = parseInt(matchArabico[1], 10);
    if (num >= 1 && num <= 10) {
      return { numero: num, resto: texto.slice(matchArabico[0].length), combinado: false, numerosCombinados: null };
    }
  }

  return { numero: null, resto: texto, combinado: false, numerosCombinados: null };
};

// Mapeamento completo: nome normalizado → nome correto/padrão
export const nomesPadrao = {
  // Grade / Regente
  'grade': 'Grade',
  'score': 'Grade',
  'conductor': 'Grade',
  'full score': 'Grade',
  'partitura': 'Grade',
  'maestro': 'Grade',
  'regente': 'Grade',

  // Flautas (incluindo combinações I e II)
  'flautim': 'Flautim',
  'piccolo': 'Flautim',
  'flauta': 'Flauta',
  'flute': 'Flauta',
  'flauta 1': 'Flauta 1',
  'flauta 2': 'Flauta 2',
  'flauta i': 'Flauta 1',
  'flauta ii': 'Flauta 2',
  'flauta 1 e 2': 'Flauta',
  'flauta i e ii': 'Flauta',
  'flautas': 'Flauta',
  'flautas 1 e 2': 'Flauta',
  'flautas i e ii': 'Flauta',
  'flute 1': 'Flauta 1',
  'flute 2': 'Flauta 2',
  'flutes': 'Flauta',

  // Oboé
  'oboe': 'Oboé',
  'oboes': 'Oboé',
  'oboe 1': 'Oboé 1',
  'oboe 2': 'Oboé 2',
  'oboe i': 'Oboé 1',
  'oboe ii': 'Oboé 2',
  'oboe 1 e 2': 'Oboé',
  'oboe i e ii': 'Oboé',
  'oboes 1 e 2': 'Oboé',
  'oboes i e ii': 'Oboé',

  // Fagote
  'fagote': 'Fagote',
  'fagotes': 'Fagote',
  'fagote 1': 'Fagote 1',
  'fagote 2': 'Fagote 2',
  'fagote i': 'Fagote 1',
  'fagote ii': 'Fagote 2',
  'fagote 1 e 2': 'Fagote',
  'fagote i e ii': 'Fagote',
  'fagotes 1 e 2': 'Fagote',
  'fagotes i e ii': 'Fagote',
  'bassoon': 'Fagote',
  'bassoons': 'Fagote',

  // Requinta
  'requinta': 'Requinta',
  'requinta eb': 'Requinta',
  'eb clarinet': 'Requinta',

  // Clarinete Baixo
  'clarinete baixo': 'Clarinete Baixo',
  'clarineta baixo': 'Clarinete Baixo',
  'clarinet baixo': 'Clarinete Baixo',
  'bass clarinet': 'Clarinete Baixo',
  'clarinet bass': 'Clarinete Baixo',
  'clarone': 'Clarinete Baixo',

  // Clarinetes
  'clarinete bb': 'Clarinete Bb',
  'clarinete bb 1': 'Clarinete Bb 1',
  'clarinete bb 2': 'Clarinete Bb 2',
  'clarinete bb 3': 'Clarinete Bb 3',
  'clarinete': 'Clarinete Bb',
  'clarinete 1': 'Clarinete Bb 1',
  'clarinete 2': 'Clarinete Bb 2',
  'clarinete 3': 'Clarinete Bb 3',
  'clarinetes': 'Clarinete Bb',
  'clarinetes bb': 'Clarinete Bb',
  'clarinetes in bb': 'Clarinete Bb',
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
  'clarinets': 'Clarinete Bb',
  'clarinets in bb': 'Clarinete Bb',
  'bb clarinet': 'Clarinete Bb',
  'bb clarinet 1': 'Clarinete Bb 1',
  'bb clarinet 2': 'Clarinete Bb 2',
  'bb clarinet 3': 'Clarinete Bb 3',
  'clarinet in bb': 'Clarinete Bb',

  // Saxofones
  'sax soprano': 'Sax. Soprano',
  'sax. soprano': 'Sax. Soprano',
  'saxofone soprano': 'Sax. Soprano',
  'soprano sax': 'Sax. Soprano',
  'soprano saxophone': 'Sax. Soprano',
  'saxophone soprano': 'Sax. Soprano',

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
  'saxophone alto': 'Sax. Alto',

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
  'saxophone tenor': 'Sax. Tenor',

  'sax baritono': 'Sax. Barítono',
  'sax. baritono': 'Sax. Barítono',
  'saxofone baritono': 'Sax. Barítono',
  'baritone sax': 'Sax. Barítono',
  'baritono sax': 'Sax. Barítono',
  'bari sax': 'Sax. Barítono',
  'baritone saxophone': 'Sax. Barítono',
  'saxophone baritone': 'Sax. Barítono',

  // Sax Horn (novo!)
  'sax horn': 'Sax Horn Eb',
  'sax horn eb': 'Sax Horn Eb',
  'saxhorn': 'Sax Horn Eb',
  'saxhorn eb': 'Sax Horn Eb',
  'sax-horn': 'Sax Horn Eb',
  'sax-horn eb': 'Sax Horn Eb',
  'alto horn': 'Sax Horn Eb',
  'tenor horn': 'Sax Horn Eb',

  // Trompetes
  'trompete bb': 'Trompete Bb',
  'trompete bb 1': 'Trompete Bb 1',
  'trompete bb 2': 'Trompete Bb 2',
  'trompete bb 3': 'Trompete Bb 3',
  'trompete': 'Trompete Bb',
  'trompete 1': 'Trompete Bb 1',
  'trompete 2': 'Trompete Bb 2',
  'trompete 3': 'Trompete Bb 3',
  'trompetes': 'Trompete Bb',
  'trompetes bb': 'Trompete Bb',
  'trumpet': 'Trompete Bb',
  'trumpet 1': 'Trompete Bb 1',
  'trumpet 2': 'Trompete Bb 2',
  'trumpet 3': 'Trompete Bb 3',
  'trumpets': 'Trompete Bb',
  'trumpets bb': 'Trompete Bb',
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
  'trompa f 3': 'Trompa F 3',
  'trompa f 4': 'Trompa F 4',
  'trompa eb': 'Trompa Eb',
  'trompa eb 1': 'Trompa Eb 1',
  'trompa eb 2': 'Trompa Eb 2',
  'trompa': 'Trompa F',
  'trompa 1': 'Trompa F 1',
  'trompa 2': 'Trompa F 2',
  'trompa 3': 'Trompa F 3',
  'trompa 4': 'Trompa F 4',
  'trompas': 'Trompa F',
  'trompas in f': 'Trompa F',
  'horn': 'Trompa F',
  'horn 1': 'Trompa F 1',
  'horn 2': 'Trompa F 2',
  'horn 3': 'Trompa F 3',
  'horn 4': 'Trompa F 4',
  'horns': 'Trompa F',
  'french horn': 'Trompa F',
  'f horn': 'Trompa F',
  'eb horn': 'Trompa Eb',
  'horn in f': 'Trompa F',
  'horn in f 1': 'Trompa F 1',
  'horn in f 2': 'Trompa F 2',
  'horns in f': 'Trompa F',
  'horn in eb': 'Trompa Eb',
  'horn in eb 1': 'Trompa Eb 1',
  'horn in eb 2': 'Trompa Eb 2',
  'horns in eb': 'Trompa Eb',

  // Barítono (com acento!)
  'baritono bb': 'Barítono Bb',
  'baritono bb 1': 'Barítono Bb 1',
  'baritono bb 2': 'Barítono Bb 2',
  'baritono': 'Barítono Bb',
  'baritono 1': 'Barítono Bb 1',
  'baritono 2': 'Barítono Bb 2',
  'baritone': 'Barítono Bb',
  'baritone 1': 'Barítono Bb 1',
  'baritone 2': 'Barítono Bb 2',
  'baritone tc': 'Barítono TC',
  'baritone t c': 'Barítono TC',
  'baritone bc': 'Barítono BC',
  'baritone b c': 'Barítono BC',

  // Trombones
  'trombone': 'Trombone',
  'trombone 1': 'Trombone 1',
  'trombone 2': 'Trombone 2',
  'trombone 3': 'Trombone 3',
  'trombones': 'Trombone',

  // Bombardinos / Eufônio
  'bombardino': 'Bombardino',
  'bombardino bb': 'Bombardino',
  'bombardino c': 'Bombardino',
  'bombardino eb': 'Bombardino',
  'euphonium': 'Bombardino',
  'euphonium 1': 'Bombardino',
  'euphonium 2': 'Bombardino',
  'euphonium bombardino': 'Bombardino',
  'eufonio': 'Bombardino',

  // Tubas/Baixos
  'baixo eb': 'Baixo Eb',
  'baixo bb': 'Baixo Bb',
  'baixo': 'Baixo Eb',
  'tuba': 'Tuba',
  'tuba eb': 'Tuba Eb',
  'tuba bb': 'Tuba Bb',
  'tuba c': 'Tuba C',
  'bass': 'Baixo Eb',
  'eb bass': 'Baixo Eb',
  'bb bass': 'Baixo Bb',
  'c bass': 'Baixo C',
  'bass tuba': 'Tuba',
  'contrabass': 'Tuba',

  // Percussão (com acento!)
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

  // Tímpano
  'timpano': 'Tímpano',
  'timpani': 'Tímpano',
  'timpanos': 'Tímpano',
  'kettle drum': 'Tímpano',
  'kettledrum': 'Tímpano',

  // Triângulo
  'triangulo': 'Triângulo',
  'triangle': 'Triângulo',

  // Glockenspiel
  'glockenspiel': 'Glockenspiel',
  'glock': 'Glockenspiel',
  'bells': 'Glockenspiel',
  'orchestra bells': 'Glockenspiel',

  // Zabumba
  'zabumba': 'Zabumba',

  // Jam Block
  'jam block': 'Jam Block',
  'jamblock': 'Jam Block',
  'wood block': 'Wood Block',
  'woodblock': 'Wood Block',

  // Percussão múltipla/geral
  'percussao': 'Percussão',
  'percussion': 'Percussão',
  'drums': 'Percussão',
  'bateria': 'Percussão',
  'drum set': 'Percussão',
  'bombo pratos': 'Bombo e Pratos',
  'bumbo pratos': 'Bombo e Pratos',
  'bombo e pratos': 'Bombo e Pratos',
  'bumbo e pratos': 'Bombo e Pratos'
};

// Cache para chaves ordenadas (inicializado uma vez)
let chavesOrdenadasCache = null;

/**
 * Retorna chaves do nomesPadrao ordenadas por tamanho (maior para menor)
 * Usa cache para evitar reprocessamento em cada chamada (380+ chaves)
 * @returns {string[]} Array de chaves ordenadas
 */
const getChavesOrdenadas = () => {
  if (chavesOrdenadasCache === null) {
    chavesOrdenadasCache = Object.keys(nomesPadrao).sort((a, b) => b.length - a.length);
  }
  return chavesOrdenadasCache;
};

/**
 * Corrige encoding corrompido (UTF-8 lido como Latin-1)
 * Ex: "JoÃ£o" → "João", "BarÃ­tono" → "Barítono"
 * @param {string} texto - Texto potencialmente corrompido
 * @returns {string} Texto corrigido
 */
export const corrigirEncoding = (texto) => {
  if (!texto) return '';

  // Mapeamento de sequências corrompidas comuns (UTF-8 → caractere correto)
  const correcoes = {
    'Ã£': 'ã', 'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
    'Ã§': 'ç', 'Ã±': 'ñ', 'Ã¢': 'â', 'Ãª': 'ê', 'Ã®': 'î', 'Ã´': 'ô',
    'Ã»': 'û', 'Ã ': 'à', 'Ã¨': 'è', 'Ã¬': 'ì', 'Ã²': 'ò', 'Ã¹': 'ù',
    'Ã€': 'À', 'Ã‰': 'É', 'Ã': 'Í', 'Ã"': 'Ó', 'Ãš': 'Ú',
    'Ã‡': 'Ç', 'Ãƒ': 'Ã', 'Ã•': 'Õ',
    // Sequências menores (cuidado com ordem)
    'ã': 'ã', 'á': 'á', 'é': 'é', 'í': 'í', 'ó': 'ó', 'ú': 'ú', 'ç': 'ç'
  };

  let resultado = texto;

  // Aplica correções do maior para o menor padrão
  const padroes = Object.keys(correcoes).sort((a, b) => b.length - a.length);
  for (const padrao of padroes) {
    resultado = resultado.split(padrao).join(correcoes[padrao]);
  }

  return resultado;
};

/**
 * Normaliza texto removendo acentos e padronizando espaços
 * @param {string} texto - Texto a normalizar
 * @returns {string} Texto normalizado
 */
export const normalizarTexto = (texto) => {
  if (!texto) return '';

  // Primeiro corrige encoding corrompido
  const textoCorrigido = corrigirEncoding(texto);

  return textoCorrigido
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_\-.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Extrai instrumento do nome do arquivo PDF
 * Suporta formatos:
 * - "01 - Clarinete Bb 1.pdf" (número de ordem + instrumento + número)
 * - "15 III Trompete Bb.pdf" (número de ordem + romano + instrumento)
 * - "1º Trompete.pdf" (ordinal + instrumento)
 * - "I e II Clarinetes in Bb.pdf" (combinação romana + instrumento)
 * - "21_Cel._Pedra_-_Dobrado_-_Caixa-clara.pdf" (padrão com múltiplos hífens)
 * @param {string} nomeArquivo - Nome do arquivo
 * @returns {{ instrumento: string, reconhecido: boolean }}
 */
export const extrairInstrumento = (nomeArquivo) => {
  if (!nomeArquivo) return { instrumento: '', reconhecido: false };

  // Primeiro corrige encoding do nome do arquivo
  let nome = corrigirEncoding(nomeArquivo);

  // Remove extensão .pdf
  nome = nome.replace(/\.pdf$/i, '');

  // Remove número de ordem inicial (ex: "01", "15", "27")
  // MAS preserva:
  // - números ordinais (1º, 2º, 1°, 2°, 1ª, 2ª) que indicam voz do instrumento
  // - números seguidos de " e " que indicam partes combinadas (1 e 2)
  nome = nome.replace(/^\d+(?![ºª°]|\s*e\s*\d)[\s\-_.]*/, '');

  // Para arquivos com padrão "Nome_-_Tipo_-_Autor_-_Instrumento", pega o último segmento
  // Isso preserva instrumentos com hífen como "Caixa-clara"
  if (nome.includes('_-_') || nome.includes(' - ')) {
    const separador = nome.includes('_-_') ? '_-_' : ' - ';
    const partes = nome.split(separador);
    // Pega a última parte que deve ser o instrumento
    const ultimaParte = partes[partes.length - 1].trim();
    // Só usa se não for uma palavra muito curta ou vazia
    if (ultimaParte.length > 2) {
      nome = ultimaParte;
    }
  }

  // Remove parênteses e seu conteúdo para análise (ex: "(T.C)" -> guardamos para depois)
  const matchParenteses = nome.match(/\(([^)]+)\)/);
  const conteudoParenteses = matchParenteses ? matchParenteses[1].toLowerCase() : null;
  let nomeParaAnalise = nome.replace(/\s*\([^)]+\)\s*/g, ' ').trim();

  // Verifica se há número/romano no INÍCIO indicando a voz (I, II, III, 1, 2, 3, 1º, 2º)
  const prefixoInfo = extrairNumeroPrefixo(nomeParaAnalise);
  const numeroPrefixo = prefixoInfo.numero;
  let partesCombinadas = prefixoInfo.combinado;
  let numerosCombinados = prefixoInfo.numerosCombinados;
  nomeParaAnalise = prefixoInfo.resto;

  // Normaliza o nome para busca
  const nomeNormalizado = normalizarTexto(nomeParaAnalise);

  // Verifica se há combinação no FINAL (ex: "Flautas I e II", "Trompete 1 e 2")
  const matchCombinadoFinal = nomeNormalizado.match(/\s+(i+|iv|v|vi+|ix|x|\d+)\s*e\s*(i+|iv|v|vi+|ix|x|\d+)$/i);
  if (matchCombinadoFinal && !partesCombinadas) {
    const num1 = converterParaNumero(matchCombinadoFinal[1]);
    const num2 = converterParaNumero(matchCombinadoFinal[2]);
    if (num1 && num2) {
      partesCombinadas = true;
      numerosCombinados = `${num1} e ${num2}`;
    }
  }

  // Remove combinação do final para obter o nome base
  let nomeBaseNormalizado = nomeNormalizado.replace(/\s+(i+|iv|v|vi+|ix|x|\d+)\s*e\s*(i+|iv|v|vi+|ix|x|\d+)$/i, '').trim();

  // Verifica se há número no FINAL (ex: "Clarinete Bb 1")
  const matchNumeroFinal = nomeBaseNormalizado.match(/\s+(\d+)$/);
  const numeroFinal = matchNumeroFinal ? parseInt(matchNumeroFinal[1], 10) : null;
  nomeBaseNormalizado = nomeBaseNormalizado.replace(/\s+\d+$/, '').trim();

  // Determina o número da voz (prioridade: prefixo > final)
  const numeroVoz = numeroPrefixo || numeroFinal;

  // Função para adicionar número à identificação final
  const formatarResultado = (instrumentoBase) => {
    // Se partes combinadas, adiciona "1 e 2" (ou similar) ao nome
    if (partesCombinadas && numerosCombinados) {
      return `${instrumentoBase} ${numerosCombinados}`;
    }
    // Se já tem número no nome base, usa ele
    if (/\d$/.test(instrumentoBase)) {
      return instrumentoBase;
    }
    // Adiciona número da voz se existir
    if (numeroVoz) {
      return `${instrumentoBase} ${numeroVoz}`;
    }
    return instrumentoBase;
  };

  // Tenta busca exata primeiro
  if (nomesPadrao[nomeBaseNormalizado]) {
    return { instrumento: formatarResultado(nomesPadrao[nomeBaseNormalizado]), reconhecido: true };
  }

  // Tenta com o nome completo normalizado (pode ter número)
  if (nomesPadrao[nomeNormalizado]) {
    return { instrumento: formatarResultado(nomesPadrao[nomeNormalizado]), reconhecido: true };
  }

  // Busca parcial usando cache otimizado (maior para menor para evitar falsos positivos)
  const chavesOrdenadas = getChavesOrdenadas();
  for (const chave of chavesOrdenadas) {
    if (nomeBaseNormalizado.includes(chave) || nomeBaseNormalizado.endsWith(chave)) {
      return { instrumento: formatarResultado(nomesPadrao[chave]), reconhecido: true };
    }
  }

  // Verifica conteúdo dos parênteses para casos como "Euphonium (bombardino)"
  if (conteudoParenteses && nomesPadrao[conteudoParenteses]) {
    return { instrumento: formatarResultado(nomesPadrao[conteudoParenteses]), reconhecido: true };
  }

  // Se não reconheceu, retorna nome original (corrigido de encoding)
  const nomeRetorno = nome.trim();
  // Tenta ao menos adicionar o número da voz se identificado
  if (numeroVoz && !/\d/.test(nomeRetorno)) {
    return { instrumento: `${nomeRetorno} ${numeroVoz}`, reconhecido: false };
  }
  return { instrumento: nomeRetorno, reconhecido: false };
};
