// ===== UPLOAD BATCH =====
// Gerenciador de upload em lote de partituras
// Upload em chunks com tratamento de erros por pasta

import { API } from '@services/api';

/**
 * Configuração padrão do upload em lote
 */
const DEFAULT_CONFIG = {
  chunkSize: 5, // Número de pastas por chunk
  delayBetweenChunks: 500, // Delay em ms entre chunks
  retryAttempts: 2, // Tentativas de retry por pasta
  retryDelay: 1000 // Delay em ms entre tentativas
};

/**
 * Aguarda um tempo específico
 * @param {number} ms - Milissegundos
 * @returns {Promise}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Faz upload de uma única pasta usando a API existente
 * @param {Object} pasta - Dados da pasta a ser enviada
 * @returns {Promise<{ success: boolean, error?: string, result?: Object }>}
 */
const uploadSinglePasta = async (pasta) => {
  try {
    const formData = new FormData();
    formData.append('titulo', pasta.titulo?.trim() || pasta.nomePasta);
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
  } catch (error) {
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
};

/**
 * Faz upload de uma pasta com retry
 * @param {Object} pasta - Dados da pasta
 * @param {number} maxAttempts - Número máximo de tentativas
 * @param {number} retryDelay - Delay entre tentativas
 * @returns {Promise<{ success: boolean, error?: string, result?: Object, attempts: number }>}
 */
const uploadWithRetry = async (pasta, maxAttempts = 2, retryDelay = 1000) => {
  let attempts = 0;
  let lastError = null;

  while (attempts < maxAttempts) {
    attempts++;
    const result = await uploadSinglePasta(pasta);

    if (result.success) {
      return { ...result, attempts };
    }

    lastError = result.error;

    // Não faz retry na última tentativa
    if (attempts < maxAttempts) {
      await sleep(retryDelay);
    }
  }

  return { success: false, error: lastError, attempts };
};

/**
 * Divide array em chunks
 * @param {Array} array - Array para dividir
 * @param {number} size - Tamanho de cada chunk
 * @returns {Array<Array>} Array de chunks
 */
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Faz upload de um lote de pastas em chunks
 * @param {Array} pastas - Lista de pastas para upload (apenas as selecionadas e prontas)
 * @param {Object} options - Opções de configuração
 * @param {Function} options.onPastaStart - Callback quando inicia uma pasta
 * @param {Function} options.onPastaComplete - Callback quando completa uma pasta
 * @param {Function} options.onPastaError - Callback quando erro em uma pasta
 * @param {Function} options.onChunkComplete - Callback quando completa um chunk
 * @param {Function} options.onProgress - Callback de progresso geral
 * @param {Object} config - Configuração (chunkSize, delays, etc)
 * @returns {Promise<{ resultados: Array, estatisticas: Object }>}
 */
export const uploadLote = async (pastas, options = {}, config = {}) => {
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
        tempoTotal: 0
      }
    };
  }

  // Divide em chunks
  const chunks = chunkArray(pastasParaUpload, chunkSize);
  const resultados = [];
  let processadas = 0;
  let sucessos = 0;
  let erros = 0;
  const startTime = Date.now();

  // Processa cada chunk
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];

    // Processa cada pasta do chunk (sequencialmente para não sobrecarregar)
    for (const pasta of chunk) {
      // Notifica início
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

    // Delay entre chunks (exceto no último)
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
 * @param {number} totalPastas - Número total de pastas
 * @param {number} totalArquivos - Número total de arquivos
 * @returns {{ tempoEstimado: number, tempoFormatado: string }}
 */
export const estimarTempo = (totalPastas, totalArquivos) => {
  // Estimativa: ~2s por pasta + ~0.5s por arquivo
  const tempoEstimado = (totalPastas * 2000) + (totalArquivos * 500);

  // Formata para exibição
  const segundos = Math.ceil(tempoEstimado / 1000);
  let tempoFormatado;

  if (segundos < 60) {
    tempoFormatado = `~${segundos} segundos`;
  } else {
    const minutos = Math.ceil(segundos / 60);
    tempoFormatado = `~${minutos} minuto${minutos > 1 ? 's' : ''}`;
  }

  return { tempoEstimado, tempoFormatado };
};

/**
 * Formata duração em milissegundos para string legível
 * @param {number} ms - Duração em milissegundos
 * @returns {string} Duração formatada
 */
export const formatarDuracao = (ms) => {
  const segundos = Math.floor(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const segsRestantes = segundos % 60;

  if (minutos > 0) {
    return `${minutos}m ${segsRestantes}s`;
  }
  return `${segundos}s`;
};

/**
 * Gera resumo do upload para exibição
 * @param {Object} estatisticas - Estatísticas do upload
 * @returns {Object} Resumo formatado
 */
export const gerarResumo = (estatisticas) => {
  const { total, sucesso, erro, tempoTotal } = estatisticas;
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
