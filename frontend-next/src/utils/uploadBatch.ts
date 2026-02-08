// ===== UPLOAD BATCH =====
// Gerenciador de upload em lote de partituras
// Upload em chunks com tratamento de erros por pasta

import { API } from '@/lib/api';

// ----- Types -----

interface PastaArquivo {
  file: File;
  instrumento: string;
}

interface PastaParaUpload {
  id: string;
  titulo: string;
  nomePasta?: string;
  compositor?: string;
  arranjador?: string;
  categoria?: string;
  ano?: string;
  caminho?: string;
  selecionada: boolean;
  arquivos: PastaArquivo[];
}

interface SingleUploadResult {
  success: boolean;
  error?: string;
  result?: unknown;
}

interface RetryUploadResult extends SingleUploadResult {
  attempts: number;
}

export interface UploadResultado {
  pastaId: string;
  titulo: string;
  caminho?: string;
  success: boolean;
  error?: string;
  result?: unknown;
  attempts: number;
}

export interface UploadEstatisticas {
  total: number;
  sucesso: number;
  erro: number;
  tempoTotal: number;
  tempoMedio: number;
}

export interface UploadResultados {
  resultados: UploadResultado[];
  estatisticas: UploadEstatisticas;
}

export interface UploadProgress {
  processadas: number;
  total: number;
  percentual: number;
  sucessos: number;
  erros: number;
  pastaAtual: string;
}

export interface UploadOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPastaStart?: (info: { pasta: any; processadas: number; total: number }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPastaComplete?: (info: { pasta: any; resultado: any; processadas: number; total: number }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPastaError?: (info: { pasta: any; error: unknown; processadas: number; total: number }) => void;
  onChunkComplete?: (info: { chunkIndex: number; totalChunks: number; processadas: number; total: number }) => void;
  onProgress?: (progress: UploadProgress) => void;
}

interface UploadConfig {
  chunkSize?: number;
  delayBetweenChunks?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

// ----- Config -----

/**
 * Configuracao padrao do upload em lote
 */
const DEFAULT_CONFIG = {
  chunkSize: 5, // Numero de pastas por chunk
  delayBetweenChunks: 500, // Delay em ms entre chunks
  retryAttempts: 2, // Tentativas de retry por pasta
  retryDelay: 1000 // Delay em ms entre tentativas
};

// ----- Helpers -----

/**
 * Aguarda um tempo especifico
 */
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Faz upload de uma unica pasta usando a API existente
 */
const uploadSinglePasta = async (pasta: PastaParaUpload): Promise<SingleUploadResult> => {
  try {
    const formData = new FormData();
    formData.append('titulo', pasta.titulo?.trim() || pasta.nomePasta || '');
    formData.append('compositor', pasta.compositor?.trim() || '');
    formData.append('arranjador', pasta.arranjador?.trim() || '');
    formData.append('categoria', pasta.categoria || '');
    formData.append('ano', pasta.ano || '');
    formData.append('total_arquivos', pasta.arquivos.length.toString());

    pasta.arquivos.forEach((item, index) => {
      formData.append(`arquivo_${index}`, item.file);
      formData.append(`instrumento_${index}`, item.instrumento);
    });

    const result = await API.uploadPastaPartitura(formData);
    return { success: true, result };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return { success: false, error: message };
  }
};

/**
 * Faz upload de uma pasta com retry
 */
const uploadWithRetry = async (
  pasta: PastaParaUpload,
  maxAttempts = 2,
  retryDelay = 1000
): Promise<RetryUploadResult> => {
  let attempts = 0;
  let lastError: string | undefined;

  while (attempts < maxAttempts) {
    attempts++;
    const result = await uploadSinglePasta(pasta);

    if (result.success) {
      return { ...result, attempts };
    }

    lastError = result.error;

    // Nao faz retry na ultima tentativa
    if (attempts < maxAttempts) {
      await sleep(retryDelay);
    }
  }

  return { success: false, error: lastError, attempts };
};

/**
 * Divide array em chunks
 */
const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// ----- Public API -----

/**
 * Faz upload de um lote de pastas em chunks
 */
export const uploadLote = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pastas: any[],
  options: UploadOptions = {},
  config: UploadConfig = {}
): Promise<UploadResultados> => {
  const {
    onPastaStart,
    onPastaComplete,
    onPastaError,
    onChunkComplete,
    onProgress
  } = options;

  const {
    chunkSize = DEFAULT_CONFIG.chunkSize,
    delayBetweenChunks = DEFAULT_CONFIG.delayBetweenChunks,
    retryAttempts = DEFAULT_CONFIG.retryAttempts,
    retryDelay = DEFAULT_CONFIG.retryDelay
  } = config;

  // Filtra apenas pastas selecionadas
  const pastasParaUpload = pastas.filter(p => p.selecionada);
  const total = pastasParaUpload.length;

  if (total === 0) {
    return {
      resultados: [],
      estatisticas: {
        total: 0,
        sucesso: 0,
        erro: 0,
        tempoTotal: 0,
        tempoMedio: 0
      }
    };
  }

  // Divide em chunks
  const chunks = chunkArray(pastasParaUpload, chunkSize);
  const resultados: UploadResultado[] = [];
  let processadas = 0;
  let sucessos = 0;
  let erros = 0;
  const startTime = Date.now();

  // Processa cada chunk
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];

    // Processa cada pasta do chunk (sequencialmente para nao sobrecarregar)
    for (const pasta of chunk) {
      // Notifica inicio
      if (onPastaStart) {
        onPastaStart({ pasta, processadas, total });
      }

      // Faz upload com retry
      const resultado = await uploadWithRetry(pasta, retryAttempts, retryDelay);

      // Registra resultado
      resultados.push({
        pastaId: pasta.id,
        titulo: pasta.titulo,
        caminho: pasta.caminho,
        ...resultado
      });

      processadas++;

      if (resultado.success) {
        sucessos++;
        if (onPastaComplete) {
          onPastaComplete({ pasta, resultado, processadas, total });
        }
      } else {
        erros++;
        if (onPastaError) {
          onPastaError({ pasta, error: resultado.error, processadas, total });
        }
      }

      // Atualiza progresso geral
      if (onProgress) {
        onProgress({
          processadas,
          total,
          percentual: Math.round((processadas / total) * 100),
          sucessos,
          erros,
          pastaAtual: pasta.titulo
        });
      }
    }

    // Notifica fim do chunk
    if (onChunkComplete) {
      onChunkComplete({
        chunkIndex,
        totalChunks: chunks.length,
        processadas,
        total
      });
    }

    // Delay entre chunks (exceto no ultimo)
    if (chunkIndex < chunks.length - 1) {
      await sleep(delayBetweenChunks);
    }
  }

  const tempoTotal = Date.now() - startTime;

  return {
    resultados,
    estatisticas: {
      total,
      sucesso: sucessos,
      erro: erros,
      tempoTotal,
      tempoMedio: Math.round(tempoTotal / total)
    }
  };
};

/**
 * Calcula estimativa de tempo para o upload
 */
export const estimarTempo = (totalPastas: number, totalArquivos?: number): { tempoEstimado: number; tempoFormatado: string } => {
  // Estimativa: ~2s por pasta + ~0.5s por arquivo
  const tempoEstimado = (totalPastas * 2000) + ((totalArquivos || 0) * 500);

  // Formata para exibicao
  const segundos = Math.ceil(tempoEstimado / 1000);
  let tempoFormatado: string;

  if (segundos < 60) {
    tempoFormatado = `~${segundos} segundos`;
  } else {
    const minutos = Math.ceil(segundos / 60);
    tempoFormatado = `~${minutos} minuto${minutos > 1 ? 's' : ''}`;
  }

  return { tempoEstimado, tempoFormatado };
};

/**
 * Formata duracao em milissegundos para string legivel
 */
export const formatarDuracao = (ms: number): string => {
  const segundos = Math.floor(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const segsRestantes = segundos % 60;

  if (minutos > 0) {
    return `${minutos}m ${segsRestantes}s`;
  }
  return `${segundos}s`;
};

export interface ResumoUpload {
  mensagem: string;
  tipo: 'success' | 'partial' | 'error';
  percentualSucesso: number;
  duracao: string;
}

/**
 * Gera resumo do upload para exibicao
 */
export const gerarResumo = (estatisticas: { total?: number; sucesso: number; erro: number; tempoTotal?: number }): ResumoUpload => {
  const total = estatisticas.total ?? (estatisticas.sucesso + estatisticas.erro);
  const { sucesso, erro } = estatisticas;
  const tempoTotal = estatisticas.tempoTotal ?? 0;
  const percentualSucesso = total > 0 ? Math.round((sucesso / total) * 100) : 0;

  return {
    mensagem: erro === 0
      ? `${sucesso} partitura${sucesso !== 1 ? 's' : ''} enviada${sucesso !== 1 ? 's' : ''} com sucesso!`
      : `${sucesso} de ${total} partitura${total !== 1 ? 's' : ''} enviada${sucesso !== 1 ? 's' : ''} (${erro} erro${erro !== 1 ? 's' : ''})`,
    tipo: erro === 0 ? 'success' : (sucesso > 0 ? 'partial' : 'error'),
    percentualSucesso,
    duracao: formatarDuracao(tempoTotal)
  };
};
