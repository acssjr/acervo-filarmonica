// ===== METADATA PARSER =====
// Funcoes para extrair metadados de nomes de pastas e detectar categorias
// Extraido de UploadPastaModal.jsx para reutilizacao

import { normalizarTexto } from './instrumentParser';

// Categorias conhecidas para deteccao automatica
const CATEGORIAS_CONHECIDAS: string[] = [
  'dobrado', 'marcha', 'valsa', 'fantasia', 'polaca',
  'bolero', 'hino', 'marcha funebre', 'marcha religiosa',
  'preludio', 'arranjo', 'hino religioso', 'hino civico'
];

// Mapeamento de termos para IDs de categoria
// IMPORTANTE: Termos mais especificos devem vir antes dos genericos
// A funcao detectarCategoria ordena por comprimento, entao isso e automatico
const MAPEAMENTO_CATEGORIAS: Record<string, string> = {
  'dobrado': 'dobrado',
  'dobrados': 'dobrado',
  // Marchas - especificas primeiro
  'marcha funebre': 'marcha-funebre',
  'marcha fúnebre': 'marcha-funebre',
  'marchas funebres': 'marcha-funebre',
  'marchas fúnebres': 'marcha-funebre',
  'marcha religiosa': 'marcha-religiosa',
  'marchas religiosas': 'marcha-religiosa',
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
  // Hinos - especificos primeiro
  'hino religioso': 'hino-religioso',
  'hinos religiosos': 'hino-religioso',
  'sacro': 'hino-religioso',
  'hino civico': 'hino-civico',
  'hinos civicos': 'hino-civico',
  'hino cívico': 'hino-civico',
  'hinos cívicos': 'hino-civico',
  'hino municipal': 'hino-civico',
  'hino nacional': 'hino-civico',
  'hino estadual': 'hino-civico',
  'hino': 'hino',
  'hinos': 'hino',
  'preludio': 'preludio',
  'prelúdio': 'preludio',
  'preludios': 'preludio',
  'arranjo': 'arranjo',
  'arranjos': 'arranjo'
};

export interface Categoria {
  id: string;
  nome: string;
}

export interface ParseNomePastaResult {
  titulo: string;
  categoriaDetectada: string;
  compositor: string;
  arranjador: string;
}

/**
 * Parseia nome da pasta para extrair titulo, categoria, compositor, arranjador
 * Padrao esperado: "Titulo - Categoria - Compositor" ou "Titulo - Arr: Arranjador"
 */
export const parsearNomePasta = (nome: string): ParseNomePastaResult => {
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
      arranjador = parte.replace(/^(arr[:\s]*|arranjo[.:\s]*)/i, '').trim();
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
 */
export const detectarCategoria = (nome: string, categorias: Categoria[] = []): string | null => {
  if (!nome) return null;

  const nomeNorm = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Ordena termos por comprimento (maior primeiro) para evitar falsos positivos
  // Ex: "marcha funebre" deve ser detectado antes de "marcha"
  const termos = Object.keys(MAPEAMENTO_CATEGORIAS).sort((a, b) => b.length - a.length);

  for (const termo of termos) {
    // Normaliza o termo tambem para comparacao consistente
    const termoNorm = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (nomeNorm.includes(termoNorm)) {
      const categoriaId = MAPEAMENTO_CATEGORIAS[termo];
      // Verifica se a categoria existe na lista fornecida
      if (categorias.length === 0 || categorias.some(c => c.id === categoriaId)) {
        return categoriaId;
      }
    }
  }

  return null;
};

export interface CategoriaEstrutura {
  id: string;
  fonte: string;
  confianca: number;
}

/**
 * Detecta categoria pela estrutura de pastas (pasta-pai)
 * Ex: "Repertorio/Dobrados/Dois Coracoes" -> categoria = dobrado
 */
export const detectarCategoriaPorEstrutura = (caminhoPasta: string, categorias: Categoria[] = []): CategoriaEstrutura | null => {
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
 */
export const limparCategoriaDoTitulo = (titulo: string, categoriaId: string): string => {
  if (!titulo || !categoriaId) return titulo;

  const tituloNorm = normalizarTexto(titulo);

  // Busca termos que correspondem a essa categoria
  // IMPORTANTE: Ordena por comprimento (maior primeiro) para evitar remover termo parcial
  // Ex: "Marchas Religiosas I" deve remover "Marchas Religiosas", nao apenas "Marchas"
  const termosCategoria = Object.entries(MAPEAMENTO_CATEGORIAS)
    .filter(([, id]) => id === categoriaId)
    .map(([termo]) => termo)
    .sort((a, b) => b.length - a.length);

  for (const termo of termosCategoria) {
    const termoNorm = normalizarTexto(termo);
    // Verifica se o titulo comeca com o termo da categoria
    if (tituloNorm.startsWith(termoNorm)) {
      // Remove o termo do inicio e limpa espacos
      // Escapa caracteres especiais de regex no termo
      const termoEscapado = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`^${termoEscapado}\\s*`, 'i');
      const tituloLimpo = titulo.replace(regex, '').trim();
      if (tituloLimpo) {
        return tituloLimpo;
      }
    }
  }

  return titulo;
};

export interface MetadataResult {
  titulo: string;
  categoria: string | null;
  categoriaConfianca: number;
  categoriaFonte: string;
  compositor: string;
  arranjador: string;
}

/**
 * Analisa uma pasta e extrai todos os metadados com deteccao multi-camada
 */
export const analisarMetadados = (caminhoPasta: string, nomePasta: string, categorias: Categoria[] = []): MetadataResult => {
  const resultado: MetadataResult = {
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

export default analisarMetadados;
