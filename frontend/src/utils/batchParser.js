// ===== BATCH PARSER =====
// Funções para análise em lote de pastas de partituras
// Detecta subpastas contendo PDFs e extrai metadados automaticamente

import { extrairInstrumento, normalizarTexto } from './instrumentParser';
import { analisarMetadados } from './metadataParser';

/**
 * Verifica se um titulo ja existe nas partituras do acervo
 * @param {string} titulo - Titulo da partitura sendo importada
 * @param {Array} partiturasExistentes - Lista de partituras existentes [{titulo, ...}]
 * @returns {{ duplicada: boolean, partituraExistente: Object | null }}
 */
export const verificarDuplicata = (titulo, partiturasExistentes = []) => {
  if (!titulo || partiturasExistentes.length === 0) {
    return { duplicada: false, partituraExistente: null };
  }

  const tituloNorm = normalizarTexto(titulo);

  for (const partitura of partiturasExistentes) {
    const partituraTituloNorm = normalizarTexto(partitura.titulo || '');
    if (tituloNorm === partituraTituloNorm) {
      return { duplicada: true, partituraExistente: partitura };
    }
  }

  return { duplicada: false, partituraExistente: null };
};

/**
 * Contador incremental para garantir IDs únicos mesmo em processamento rápido
 */
let idCounter = 0;

/**
 * Gera um ID único para cada pasta detectada
 * @returns {string} ID único
 */
const generateId = () => {
  idCounter++;
  return `pasta-${Date.now()}-${idCounter}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Lê todos os arquivos de uma entrada de diretório recursivamente
 * @param {FileSystemEntry} entry - Entrada do sistema de arquivos
 * @param {string} path - Caminho relativo atual
 * @returns {Promise<Array<{file: File, path: string}>>} Lista de arquivos com caminhos
 */
export const readDirectoryRecursively = async (entry, path = '') => {
  const results = [];

  if (entry.isFile) {
    const file = await new Promise((resolve) => entry.file(resolve));
    results.push({
      file,
      path: path + file.name,
      fullPath: path
    });
  } else if (entry.isDirectory) {
    const reader = entry.createReader();
    const entries = await new Promise((resolve) => {
      const allEntries = [];
      const readEntries = () => {
        reader.readEntries((batch) => {
          if (batch.length === 0) {
            resolve(allEntries);
          } else {
            allEntries.push(...batch);
            readEntries();
          }
        });
      };
      readEntries();
    });

    for (const childEntry of entries) {
      const childResults = await readDirectoryRecursively(
        childEntry,
        path + entry.name + '/'
      );
      results.push(...childResults);
    }
  }

  return results;
};

/**
 * Agrupa arquivos por pasta (cada pasta com PDFs = uma partitura)
 * @param {Array<{file: File, path: string, fullPath: string}>} files - Lista de arquivos
 * @returns {Map<string, Array<{file: File, path: string}>>} Mapa de pasta -> arquivos
 */
export const groupFilesByFolder = (files) => {
  const groups = new Map();

  // Filtra apenas PDFs
  const pdfFiles = files.filter(f => f.file.name.toLowerCase().endsWith('.pdf'));

  for (const fileInfo of pdfFiles) {
    // Normaliza separadores de caminho (Windows usa \, web usa /)
    const normalizedPath = (fileInfo.path || '').replace(/\\/g, '/');
    // Pega a pasta imediata (pai direto do arquivo)
    const pathParts = normalizedPath.split('/');
    pathParts.pop(); // Remove o nome do arquivo
    const folderPath = pathParts.join('/');

    if (!groups.has(folderPath)) {
      groups.set(folderPath, []);
    }
    groups.get(folderPath).push(fileInfo);
  }

  return groups;
};

/**
 * Determina o status de uma pasta com base nos dados analisados
 * @param {Object} pastaData - Dados da pasta analisada
 * @param {Array} partiturasExistentes - Lista de partituras existentes para detectar duplicatas
 * @returns {{ status: string, motivo: string | null, duplicada: boolean }}
 */
const determinarStatus = (pastaData, partiturasExistentes = []) => {
  const { arquivos, categoria, titulo } = pastaData;

  // Verifica problemas críticos
  if (!arquivos || arquivos.length === 0) {
    return { status: 'problem', motivo: 'Nenhum arquivo PDF encontrado', duplicada: false };
  }

  if (!titulo || titulo.trim() === '') {
    return { status: 'problem', motivo: 'Título não detectado', duplicada: false };
  }

  // Verifica duplicatas
  const { duplicada, partituraExistente } = verificarDuplicata(titulo, partiturasExistentes);
  if (duplicada) {
    const categoriaExistente = partituraExistente.categoria || 'sem categoria';
    return {
      status: 'attention',
      motivo: `Já existe no acervo (${categoriaExistente})`,
      duplicada: true
    };
  }

  // Conta instrumentos não reconhecidos
  const naoReconhecidos = arquivos.filter(a => !a.reconhecido).length;
  const totalArquivos = arquivos.length;
  const percentualNaoReconhecido = (naoReconhecidos / totalArquivos) * 100;

  // Verifica se precisa atenção
  if (!categoria) {
    return { status: 'attention', motivo: 'Categoria não detectada', duplicada: false };
  }

  if (percentualNaoReconhecido > 50) {
    return { status: 'attention', motivo: `${naoReconhecidos} de ${totalArquivos} instrumentos não reconhecidos`, duplicada: false };
  }

  if (naoReconhecidos > 0) {
    return { status: 'attention', motivo: `${naoReconhecidos} instrumento(s) não reconhecido(s)`, duplicada: false };
  }

  // Tudo OK
  return { status: 'ready', motivo: null, duplicada: false };
};

/**
 * Analisa uma pasta individual e extrai todos os metadados
 * @param {string} folderPath - Caminho da pasta
 * @param {Array<{file: File, path: string}>} files - Arquivos da pasta
 * @param {Array} categorias - Lista de categorias disponíveis
 * @param {Array} partiturasExistentes - Lista de partituras existentes para detectar duplicatas
 * @returns {Object} Dados da pasta analisada
 */
export const analisarPasta = (folderPath, files, categorias = [], partiturasExistentes = []) => {
  // Extrai nome da pasta (último segmento do caminho)
  // Normaliza separadores de caminho (Windows usa \, web usa /)
  const caminhoNormalizado = (folderPath || '').replace(/\\/g, '/');
  const pathParts = caminhoNormalizado.split('/').filter(p => p.trim());
  const nomePasta = pathParts[pathParts.length - 1] || 'Pasta sem nome';

  // Analisa metadados usando a função multi-camada
  const metadados = analisarMetadados(caminhoNormalizado, nomePasta, categorias);

  // Analisa cada arquivo para extrair instrumentos
  const arquivos = files.map(({ file }) => {
    const { instrumento, reconhecido } = extrairInstrumento(file.name);
    return {
      file,
      nomeOriginal: file.name,
      instrumento,
      reconhecido
    };
  });

  // Monta objeto da pasta
  const pastaData = {
    id: generateId(),
    caminho: caminhoNormalizado,
    nomePasta,
    titulo: metadados.titulo,
    categoria: metadados.categoria,
    categoriaConfianca: metadados.categoriaConfianca,
    categoriaFonte: metadados.categoriaFonte,
    compositor: metadados.compositor,
    arranjador: metadados.arranjador,
    arquivos,
    selecionada: true
  };

  // Determina status (inclui verificação de duplicatas)
  const { status, motivo, duplicada } = determinarStatus(pastaData, partiturasExistentes);
  pastaData.status = status;
  pastaData.statusMotivo = motivo;
  pastaData.duplicada = duplicada;

  return pastaData;
};

/**
 * Processa um lote de arquivos arrastados e retorna as partituras detectadas
 * @param {DataTransferItemList} items - Items do DataTransfer
 * @param {Array} categorias - Lista de categorias disponíveis
 * @param {Array} partiturasExistentes - Lista de partituras existentes para detectar duplicatas
 * @param {Function} onProgress - Callback de progresso (opcional)
 * @returns {Promise<{ pastas: Array, estatisticas: Object }>}
 */
export const processarLote = async (items, categorias = [], partiturasExistentes = [], onProgress = null) => {
  const allFiles = [];

  // Lê todas as entradas de diretório
  for (let i = 0; i < items.length; i++) {
    const entry = items[i].webkitGetAsEntry?.();
    if (entry) {
      const files = await readDirectoryRecursively(entry, '');
      allFiles.push(...files);
    }
  }

  // Agrupa por pasta
  const grupos = groupFilesByFolder(allFiles);
  const totalPastas = grupos.size;
  let processadas = 0;

  // Analisa cada pasta
  const pastas = [];
  for (const [folderPath, files] of grupos) {
    const pastaAnalisada = analisarPasta(folderPath, files, categorias, partiturasExistentes);
    pastas.push(pastaAnalisada);
    processadas++;

    if (onProgress) {
      onProgress({
        processadas,
        total: totalPastas,
        percentual: Math.round((processadas / totalPastas) * 100),
        pastaAtual: folderPath
      });
    }
  }

  // Calcula estatísticas
  const estatisticas = {
    total: pastas.length,
    prontas: pastas.filter(p => p.status === 'ready').length,
    atencao: pastas.filter(p => p.status === 'attention').length,
    problemas: pastas.filter(p => p.status === 'problem').length,
    totalArquivos: pastas.reduce((acc, p) => acc + p.arquivos.length, 0),
    instrumentosReconhecidos: pastas.reduce(
      (acc, p) => acc + p.arquivos.filter(a => a.reconhecido).length,
      0
    ),
    instrumentosNaoReconhecidos: pastas.reduce(
      (acc, p) => acc + p.arquivos.filter(a => !a.reconhecido).length,
      0
    )
  };

  return { pastas, estatisticas };
};

/**
 * Processa arquivos de um input de diretório (fallback para input file)
 * @param {FileList} fileList - Lista de arquivos do input
 * @param {Array} categorias - Lista de categorias disponíveis
 * @param {Array} partiturasExistentes - Lista de partituras existentes para detectar duplicatas
 * @param {Function} onProgress - Callback de progresso (opcional)
 * @returns {Promise<{ pastas: Array, estatisticas: Object }>}
 */
export const processarFileList = async (fileList, categorias = [], partiturasExistentes = [], onProgress = null) => {
  const files = Array.from(fileList)
    .filter(f => f.name.toLowerCase().endsWith('.pdf'))
    .map(f => ({
      file: f,
      path: f.webkitRelativePath || f.name,
      fullPath: f.webkitRelativePath ? f.webkitRelativePath.split('/').slice(0, -1).join('/') : ''
    }));

  // Agrupa por pasta
  const grupos = groupFilesByFolder(files.map(f => ({ ...f, path: f.path })));
  const totalPastas = grupos.size;
  let processadas = 0;

  // Analisa cada pasta
  const pastas = [];
  for (const [folderPath, folderFiles] of grupos) {
    const pastaAnalisada = analisarPasta(folderPath, folderFiles, categorias, partiturasExistentes);
    pastas.push(pastaAnalisada);
    processadas++;

    if (onProgress) {
      onProgress({
        processadas,
        total: totalPastas,
        percentual: Math.round((processadas / totalPastas) * 100),
        pastaAtual: folderPath
      });
    }
  }

  // Calcula estatísticas
  const estatisticas = {
    total: pastas.length,
    prontas: pastas.filter(p => p.status === 'ready').length,
    atencao: pastas.filter(p => p.status === 'attention').length,
    problemas: pastas.filter(p => p.status === 'problem').length,
    totalArquivos: pastas.reduce((acc, p) => acc + p.arquivos.length, 0),
    instrumentosReconhecidos: pastas.reduce(
      (acc, p) => acc + p.arquivos.filter(a => a.reconhecido).length,
      0
    ),
    instrumentosNaoReconhecidos: pastas.reduce(
      (acc, p) => acc + p.arquivos.filter(a => !a.reconhecido).length,
      0
    )
  };

  return { pastas, estatisticas };
};

/**
 * Filtra pastas por status
 * @param {Array} pastas - Lista de pastas
 * @param {string} status - Status para filtrar ('ready' | 'attention' | 'problem' | 'all')
 * @returns {Array} Pastas filtradas
 */
export const filtrarPorStatus = (pastas, status) => {
  if (status === 'all') return pastas;
  return pastas.filter(p => p.status === status);
};

/**
 * Calcula percentual de sucesso do lote
 * @param {Object} estatisticas - Estatísticas do lote
 * @returns {{ percentual: number, tipo: 'success' | 'partial' | 'failure' }}
 */
export const calcularResultado = (estatisticas) => {
  const { total, prontas } = estatisticas;

  if (total === 0) {
    return { percentual: 0, tipo: 'failure' };
  }

  const percentual = Math.round((prontas / total) * 100);

  if (percentual === 100) {
    return { percentual, tipo: 'success' };
  } else if (percentual >= 50) {
    return { percentual, tipo: 'partial' };
  } else {
    return { percentual, tipo: 'failure' };
  }
};
