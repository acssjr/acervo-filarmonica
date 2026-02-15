// ===== BATCH PARSER =====
// Funcoes para analise em lote de pastas de partituras
// Detecta subpastas contendo PDFs e extrai metadados automaticamente

import { extrairInstrumento, normalizarTexto } from './instrumentParser';
import { analisarMetadados } from './metadataParser';
import type { Categoria } from './metadataParser';

// ----- Types -----

export interface Arquivo {
  file: File;
  nomeOriginal: string;
  instrumento: string;
  reconhecido: boolean;
}

export interface Pasta {
  id: string;
  caminho: string;
  nomePasta: string;
  titulo: string;
  categoria: string;
  categoriaConfianca: number;
  categoriaFonte: string;
  compositor: string;
  arranjador: string;
  arquivos: Arquivo[];
  selecionada: boolean;
  status: 'ready' | 'attention' | 'problem';
  statusMotivo: string | null;
  duplicada: boolean;
}

export interface Estatisticas {
  total: number;
  prontas: number;
  atencao: number;
  problemas: number;
  totalArquivos: number;
  instrumentosReconhecidos: number;
  instrumentosNaoReconhecidos: number;
}

export interface ProcessarLoteResult {
  pastas: Pasta[];
  estatisticas: Estatisticas;
}

interface DuplicataResult {
  duplicada: boolean;
  partituraExistente: PartituraExistente | null;
}

interface PartituraExistente {
  titulo: string;
  [key: string]: unknown;
}

interface FileInfo {
  file: File;
  path: string;
  fullPath: string;
}

interface ProgressInfo {
  processadas: number;
  total: number;
  percentual: number;
  pastaAtual: string;
}

interface StatusResult {
  status: 'ready' | 'attention' | 'problem';
  motivo: string | null;
  duplicada: boolean;
}

// ----- Helpers -----

/**
 * Verifica se um titulo ja existe nas partituras do acervo
 */
export const verificarDuplicata = (titulo: string, partiturasExistentes: unknown[] = []): DuplicataResult => {
  if (!titulo || partiturasExistentes.length === 0) {
    return { duplicada: false, partituraExistente: null };
  }

  const tituloNorm = normalizarTexto(titulo);

  for (const partitura of partiturasExistentes) {
    const p = partitura as PartituraExistente;
    const partituraTituloNorm = normalizarTexto(p.titulo || '');
    if (tituloNorm === partituraTituloNorm) {
      return { duplicada: true, partituraExistente: p };
    }
  }

  return { duplicada: false, partituraExistente: null };
};

/**
 * Contador incremental para garantir IDs unicos mesmo em processamento rapido
 */
let idCounter = 0;

/**
 * Gera um ID unico para cada pasta detectada
 */
const generateId = (): string => {
  idCounter++;
  return `pasta-${Date.now()}-${idCounter}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Le todos os arquivos de uma entrada de diretorio recursivamente
 */
export const readDirectoryRecursively = async (entry: FileSystemEntry, path = ''): Promise<FileInfo[]> => {
  const results: FileInfo[] = [];

  if (entry.isFile) {
    const file = await new Promise<File>((resolve) => (entry as FileSystemFileEntry).file(resolve));
    results.push({
      file,
      path: path + file.name,
      fullPath: path
    });
  } else if (entry.isDirectory) {
    const reader = (entry as FileSystemDirectoryEntry).createReader();
    const entries = await new Promise<FileSystemEntry[]>((resolve) => {
      const allEntries: FileSystemEntry[] = [];
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
 */
export const groupFilesByFolder = (files: FileInfo[]): Map<string, FileInfo[]> => {
  const groups = new Map<string, FileInfo[]>();

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
    groups.get(folderPath)!.push(fileInfo);
  }

  return groups;
};

/**
 * Determina o status de uma pasta com base nos dados analisados
 */
const determinarStatus = (
  pastaData: { arquivos: Arquivo[]; categoria: string; titulo: string },
  partiturasExistentes: unknown[] = []
): StatusResult => {
  const { arquivos, categoria, titulo } = pastaData;

  // Verifica problemas criticos
  if (!arquivos || arquivos.length === 0) {
    return { status: 'problem', motivo: 'Nenhum arquivo PDF encontrado', duplicada: false };
  }

  if (!titulo || titulo.trim() === '') {
    return { status: 'problem', motivo: 'Título não detectado', duplicada: false };
  }

  // Verifica duplicatas - BLOQUEIA upload de partituras que ja existem
  const { duplicada } = verificarDuplicata(titulo, partiturasExistentes);
  if (duplicada) {
    return {
      status: 'problem',
      motivo: 'Já existe no acervo',
      duplicada: true
    };
  }

  // Conta instrumentos nao reconhecidos
  const naoReconhecidos = arquivos.filter(a => !a.reconhecido).length;
  const totalArquivos = arquivos.length;
  const percentualNaoReconhecido = (naoReconhecidos / totalArquivos) * 100;

  // Verifica se precisa atencao
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
 */
export const analisarPasta = (
  folderPath: string,
  files: FileInfo[],
  categorias: Categoria[] = [],
  partiturasExistentes: unknown[] = []
): Pasta => {
  // Extrai nome da pasta (ultimo segmento do caminho)
  // Normaliza separadores de caminho (Windows usa \, web usa /)
  const caminhoNormalizado = (folderPath || '').replace(/\\/g, '/');
  const pathParts = caminhoNormalizado.split('/').filter(p => p.trim());
  const nomePasta = pathParts[pathParts.length - 1] || 'Pasta sem nome';

  // Analisa metadados usando a funcao multi-camada
  const metadados = analisarMetadados(caminhoNormalizado, nomePasta, categorias);

  // Analisa cada arquivo para extrair instrumentos
  const arquivos: Arquivo[] = files.map(({ file }) => {
    const { instrumento, reconhecido } = extrairInstrumento(file.name);
    return {
      file,
      nomeOriginal: file.name,
      instrumento,
      reconhecido
    };
  });

  // Monta objeto da pasta
  const pastaData: Pasta = {
    id: generateId(),
    caminho: caminhoNormalizado,
    nomePasta,
    titulo: metadados.titulo,
    categoria: metadados.categoria || '',
    categoriaConfianca: metadados.categoriaConfianca,
    categoriaFonte: metadados.categoriaFonte,
    compositor: metadados.compositor,
    arranjador: metadados.arranjador,
    arquivos,
    selecionada: true,
    status: 'ready',
    statusMotivo: null,
    duplicada: false
  };

  // Determina status (inclui verificacao de duplicatas)
  const { status, motivo, duplicada } = determinarStatus(pastaData, partiturasExistentes);
  pastaData.status = status;
  pastaData.statusMotivo = motivo;
  pastaData.duplicada = duplicada;

  return pastaData;
};

/**
 * Calcula estatisticas a partir de uma lista de pastas analisadas
 */
const calcularEstatisticas = (pastas: Pasta[]): Estatisticas => {
  return pastas.reduce((acc, pasta) => {
    acc.total++;
    if (pasta.status === 'ready') acc.prontas++;
    else if (pasta.status === 'attention') acc.atencao++;
    else if (pasta.status === 'problem') acc.problemas++;

    acc.totalArquivos += pasta.arquivos.length;
    acc.instrumentosReconhecidos += pasta.arquivos.filter(a => a.reconhecido).length;
    acc.instrumentosNaoReconhecidos += pasta.arquivos.filter(a => !a.reconhecido).length;

    return acc;
  }, {
    total: 0,
    prontas: 0,
    atencao: 0,
    problemas: 0,
    totalArquivos: 0,
    instrumentosReconhecidos: 0,
    instrumentosNaoReconhecidos: 0
  } as Estatisticas);
};

/**
 * Processa um lote de arquivos arrastados e retorna as partituras detectadas
 * Aceita DataTransferItemList ou array de FileSystemEntry (entries ja extraidas)
 */
export const processarLote = async (
  items: DataTransferItemList | FileSystemEntry[],
  categorias: Categoria[] = [],
  partiturasExistentes: unknown[] = [],
  onProgress: ((info: ProgressInfo) => void) | null = null
): Promise<ProcessarLoteResult> => {
  const allFiles: FileInfo[] = [];

  // Le todas as entradas de diretorio
  if (Array.isArray(items)) {
    // Entries ja extraidas (seguro apos o evento de drop)
    for (const entry of items) {
      const files = await readDirectoryRecursively(entry, '');
      allFiles.push(...files);
    }
  } else {
    // DataTransferItemList (deve ser chamado durante o evento)
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry?.();
      if (entry) {
        const files = await readDirectoryRecursively(entry, '');
        allFiles.push(...files);
      }
    }
  }

  // Agrupa por pasta
  const grupos = groupFilesByFolder(allFiles);
  const totalPastas = grupos.size;
  let processadas = 0;

  // Analisa cada pasta
  const pastas: Pasta[] = [];
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

  // Calcula estatisticas
  const estatisticas = calcularEstatisticas(pastas);

  return { pastas, estatisticas };
};

/**
 * Processa arquivos de um input de diretorio (fallback para input file)
 */
export const processarFileList = async (
  fileList: FileList,
  categorias: Categoria[] = [],
  partiturasExistentes: unknown[] = [],
  onProgress: ((info: ProgressInfo) => void) | null = null
): Promise<ProcessarLoteResult> => {
  const files: FileInfo[] = Array.from(fileList)
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
  const pastas: Pasta[] = [];
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

  // Calcula estatisticas
  const estatisticas = calcularEstatisticas(pastas);

  return { pastas, estatisticas };
};

/**
 * Filtra pastas por status
 * Accepts any array with a status field for compatibility with consumer types
 */
export const filtrarPorStatus = <T extends { status: string }>(pastas: T[], status: string): T[] => {
  if (status === 'all') return pastas;
  return pastas.filter(p => p.status === status);
};

export interface ResultadoLote {
  percentual: number;
  tipo: 'success' | 'partial' | 'failure';
}

/**
 * Calcula percentual de sucesso do lote
 */
export const calcularResultado = (estatisticas: { total: number; prontas: number }): ResultadoLote => {
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
