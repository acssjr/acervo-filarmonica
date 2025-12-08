// ===== METADATA PARSER =====
// Funções para extrair metadados de nomes de pastas e detectar categorias
// Extraído de UploadPastaModal.jsx para reutilização

import { normalizarTexto } from './instrumentParser';

// Categorias conhecidas para detecção automatica
const CATEGORIAS_CONHECIDAS = [
  'dobrado', 'marcha', 'valsa', 'fantasia', 'polaca',
  'bolero', 'hino', 'marcha funebre', 'marcha funebre',
  'preludio', 'preludio', 'arranjo', 'hino religioso'
];

// Mapeamento de termos para IDs de categoria
const MAPEAMENTO_CATEGORIAS = {
  'dobrado': 'dobrado',
  'dobrados': 'dobrado',
  'marcha funebre': 'marcha-funebre',
  'marcha fúnebre': 'marcha-funebre',
  'marchas funebres': 'marcha-funebre',
  'marcha': 'marcha',
  'marchas': 'marcha',
  'valsa': 'valsa',
  'valsas': 'valsa',
  'fantasia': 'fantasia',
  'fantasias': 'fantasia',
  'suite': 'fantasia',
  'polaca': 'polaca',
  'polacas': 'polaca',
  'bolero': 'bolero',
  'boleros': 'bolero',
  'hino religioso': 'hino-religioso',
  'hinos religiosos': 'hino-religioso',
  'sacro': 'hino-religioso',
  'hino': 'hino',
  'hinos': 'hino',
  'preludio': 'preludio',
  'prelúdio': 'preludio',
  'preludios': 'preludio',
  'arranjo': 'arranjo',
  'arranjos': 'arranjo'
};

/**
 * Parseia nome da pasta para extrair titulo, categoria, compositor, arranjador
 * Padrao esperado: "Titulo - Categoria - Compositor" ou "Titulo - Arr: Arranjador"
 * @param {string} nome - Nome da pasta
 * @returns {{ titulo: string, categoriaDetectada: string, compositor: string, arranjador: string }}
 */
export const parsearNomePasta = (nome) => {
  if (!nome) {
    return { titulo: '', categoriaDetectada: '', compositor: '', arranjador: '' };
  }

  const partes = nome.split(/\s*-\s*/);
  let titulo = '';
  let categoriaDetectada = '';
  let compositor = '';
  let arranjador = '';
  let temArranjador = false;

  if (partes.length > 0) {
    titulo = partes[0].trim();
  }

  for (let i = 1; i < partes.length; i++) {
    const parte = partes[i].trim();
    const parteLower = parte.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Detecta arranjador
    if (/^arr[:\s]/i.test(parte) || /arranjo/i.test(parte)) {
      arranjador = parte.replace(/^(arr[:\s]*|arranjo[\.\:\s]*)/i, '').trim();
      temArranjador = true;
    }
    // Detecta categoria
    else if (CATEGORIAS_CONHECIDAS.some(cat => parteLower === cat || parteLower.includes(cat))) {
      categoriaDetectada = parte;
    }
    // Assume compositor
    else if (!compositor) {
      compositor = parte;
    }
  }

  // Se tem arranjador mas nao tem categoria, assume "Arranjo"
  if (temArranjador && !categoriaDetectada) {
    categoriaDetectada = 'Arranjo';
  }

  return { titulo, categoriaDetectada, compositor, arranjador };
};

/**
 * Detecta categoria pelo nome usando mapeamento
 * @param {string} nome - Nome para buscar categoria
 * @param {Array} categorias - Lista de categorias disponiveis [{id, nome}]
 * @returns {string|null} ID da categoria ou null se nao encontrada
 */
export const detectarCategoria = (nome, categorias = []) => {
  if (!nome) return null;

  const nomeNorm = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Ordena termos por comprimento (maior primeiro) para evitar falsos positivos
  // Ex: "marcha funebre" deve ser detectado antes de "marcha"
  const termos = Object.keys(MAPEAMENTO_CATEGORIAS).sort((a, b) => b.length - a.length);

  for (const termo of termos) {
    if (nomeNorm.includes(termo)) {
      const categoriaId = MAPEAMENTO_CATEGORIAS[termo];
      // Verifica se a categoria existe na lista fornecida
      if (categorias.length === 0 || categorias.some(c => c.id === categoriaId)) {
        return categoriaId;
      }
    }
  }

  return null;
};

/**
 * Detecta categoria pela estrutura de pastas (pasta-pai)
 * Ex: "Repertorio/Dobrados/Dois Coracoes" -> categoria = dobrado
 * @param {string} caminhoPasta - Caminho completo da pasta
 * @param {Array} categorias - Lista de categorias disponiveis [{id, nome}]
 * @returns {{ id: string, fonte: string, confianca: number } | null}
 */
export const detectarCategoriaPorEstrutura = (caminhoPasta, categorias = []) => {
  if (!caminhoPasta) return null;

  // Normaliza separadores de caminho
  const caminhoNormalizado = caminhoPasta.replace(/\\/g, '/');
  const partes = caminhoNormalizado.split('/').filter(p => p.trim());

  // Itera das pastas mais proximas (exceto a ultima que e o nome da partitura) para as mais distantes
  for (let i = partes.length - 2; i >= 0; i--) {
    const pastaPai = partes[i];
    const pastaNorm = normalizarTexto(pastaPai);

    // Busca no mapeamento
    const termos = Object.keys(MAPEAMENTO_CATEGORIAS).sort((a, b) => b.length - a.length);
    for (const termo of termos) {
      const termoNorm = normalizarTexto(termo);
      if (pastaNorm === termoNorm || pastaNorm.includes(termoNorm)) {
        const categoriaId = MAPEAMENTO_CATEGORIAS[termo];
        // Verifica se a categoria existe na lista fornecida
        if (categorias.length === 0 || categorias.some(c => c.id === categoriaId)) {
          return {
            id: categoriaId,
            fonte: 'pasta-pai',
            confianca: 0.95
          };
        }
      }
    }

    // Busca correspondencia direta com nomes de categoria
    for (const cat of categorias) {
      const catNorm = normalizarTexto(cat.nome);
      if (pastaNorm === catNorm || pastaNorm.includes(catNorm) || catNorm.includes(pastaNorm)) {
        return {
          id: cat.id,
          fonte: 'pasta-pai',
          confianca: 0.95
        };
      }
    }
  }

  return null;
};

/**
 * Remove categoria do inicio do titulo se presente
 * Ex: "Dobrado Dois Coracoes" -> "Dois Coracoes"
 * @param {string} titulo - Titulo original
 * @param {string} categoriaId - ID da categoria detectada
 * @returns {string} Titulo limpo
 */
export const limparCategoriaDoTitulo = (titulo, categoriaId) => {
  if (!titulo || !categoriaId) return titulo;

  const tituloNorm = normalizarTexto(titulo);

  // Busca termos que correspondem a essa categoria
  const termosCategoria = Object.entries(MAPEAMENTO_CATEGORIAS)
    .filter(([_, id]) => id === categoriaId)
    .map(([termo, _]) => termo);

  for (const termo of termosCategoria) {
    const termoNorm = normalizarTexto(termo);
    // Verifica se o titulo comeca com o termo da categoria
    if (tituloNorm.startsWith(termoNorm)) {
      // Remove o termo do inicio e limpa espacos
      const regex = new RegExp(`^${termo}\\s*`, 'i');
      const tituloLimpo = titulo.replace(regex, '').trim();
      if (tituloLimpo) {
        return tituloLimpo;
      }
    }
  }

  return titulo;
};

/**
 * Analisa uma pasta e extrai todos os metadados com deteccao multi-camada
 * @param {string} caminhoPasta - Caminho completo da pasta
 * @param {string} nomePasta - Nome da pasta (ultimo segmento)
 * @param {Array} categorias - Lista de categorias disponiveis
 * @returns {{ titulo, categoria, categoriaConfianca, categoriaFonte, compositor, arranjador }}
 */
export const analisarMetadados = (caminhoPasta, nomePasta, categorias = []) => {
  const resultado = {
    titulo: nomePasta,
    categoria: null,
    categoriaConfianca: 0,
    categoriaFonte: 'nenhuma',
    compositor: '',
    arranjador: ''
  };

  // Camada 1: Detecta por estrutura de pastas (mais confiavel - 95%)
  const categoriaPorEstrutura = detectarCategoriaPorEstrutura(caminhoPasta, categorias);
  if (categoriaPorEstrutura) {
    resultado.categoria = categoriaPorEstrutura.id;
    resultado.categoriaConfianca = categoriaPorEstrutura.confianca;
    resultado.categoriaFonte = categoriaPorEstrutura.fonte;
  }

  // Camada 2: Parse do nome da pasta
  const parseado = parsearNomePasta(nomePasta);
  resultado.titulo = parseado.titulo || nomePasta;
  resultado.compositor = parseado.compositor;
  resultado.arranjador = parseado.arranjador;

  // Se ainda nao tem categoria, tenta pelo nome parseado (85%)
  if (!resultado.categoria && parseado.categoriaDetectada) {
    const catId = detectarCategoria(parseado.categoriaDetectada, categorias);
    if (catId) {
      resultado.categoria = catId;
      resultado.categoriaConfianca = 0.85;
      resultado.categoriaFonte = 'nome-pasta';
    }
  }

  // Camada 3: Tenta detectar categoria no titulo (75%)
  if (!resultado.categoria) {
    const catNoTitulo = detectarCategoria(resultado.titulo, categorias);
    if (catNoTitulo) {
      resultado.categoria = catNoTitulo;
      resultado.categoriaConfianca = 0.75;
      resultado.categoriaFonte = 'titulo';
      // Limpa categoria do titulo
      resultado.titulo = limparCategoriaDoTitulo(resultado.titulo, catNoTitulo);
    }
  }

  return resultado;
};

// Exporta constantes para uso externo
export { CATEGORIAS_CONHECIDAS, MAPEAMENTO_CATEGORIAS };
