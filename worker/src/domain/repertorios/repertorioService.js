// worker/src/domain/repertorios/repertorioService.js
import { jsonResponse, errorResponse, getCorsHeaders } from '../../infrastructure/index.js';
import { registrarAtividade } from '../atividades/index.js';

// ============ LEITURA ============

/**
 * Obter repertório ativo com suas partituras
 */
export async function getRepertorioAtivo(request, env) {
  const repertorio = await env.DB.prepare(`
    SELECT r.*,
           (SELECT COUNT(*) FROM repertorio_partituras WHERE repertorio_id = r.id) as total_partituras,
           u.nome as criado_por_nome
    FROM repertorios r
    LEFT JOIN usuarios u ON r.criado_por = u.id
    WHERE r.ativo = 1
    LIMIT 1
  `).first();

  if (!repertorio) {
    return jsonResponse(null, 200, request);
  }

  // Buscar partituras do repertório
  const partituras = await env.DB.prepare(`
    SELECT p.*, rp.ordem, c.nome as categoria_nome, c.emoji as categoria_emoji, c.cor as categoria_cor,
           (SELECT COUNT(*) FROM partes WHERE partitura_id = p.id) as total_partes
    FROM repertorio_partituras rp
    JOIN partituras p ON rp.partitura_id = p.id
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE rp.repertorio_id = ? AND p.ativo = 1
    ORDER BY rp.ordem ASC
  `).bind(repertorio.id).all();

  return jsonResponse({
    ...repertorio,
    partituras: partituras.results
  }, 200, request);
}

/**
 * Obter repertório por ID com suas partituras
 */
export async function getRepertorio(id, request, env) {
  const repertorio = await env.DB.prepare(`
    SELECT r.*,
           (SELECT COUNT(*) FROM repertorio_partituras WHERE repertorio_id = r.id) as total_partituras,
           u.nome as criado_por_nome
    FROM repertorios r
    LEFT JOIN usuarios u ON r.criado_por = u.id
    WHERE r.id = ?
  `).bind(id).first();

  if (!repertorio) {
    return errorResponse('Repertório não encontrado', 404, request);
  }

  // Buscar partituras do repertório
  const partituras = await env.DB.prepare(`
    SELECT p.*, rp.ordem, c.nome as categoria_nome, c.emoji as categoria_emoji, c.cor as categoria_cor,
           (SELECT COUNT(*) FROM partes WHERE partitura_id = p.id) as total_partes
    FROM repertorio_partituras rp
    JOIN partituras p ON rp.partitura_id = p.id
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE rp.repertorio_id = ? AND p.ativo = 1
    ORDER BY rp.ordem ASC
  `).bind(id).all();

  return jsonResponse({
    ...repertorio,
    partituras: partituras.results
  }, 200, request);
}

/**
 * Listar todos os repertórios (para histórico - admin)
 */
export async function listRepertorios(request, env) {
  const result = await env.DB.prepare(`
    SELECT r.*,
           (SELECT COUNT(*) FROM repertorio_partituras WHERE repertorio_id = r.id) as total_partituras,
           u.nome as criado_por_nome
    FROM repertorios r
    LEFT JOIN usuarios u ON r.criado_por = u.id
    ORDER BY r.ativo DESC, r.data_criacao DESC
  `).all();

  return jsonResponse(result.results, 200, request);
}

/**
 * Verificar se partitura está no repertório ativo
 */
export async function isPartituraInRepertorioAtivo(partituraId, request, env) {
  const result = await env.DB.prepare(`
    SELECT rp.id
    FROM repertorio_partituras rp
    JOIN repertorios r ON rp.repertorio_id = r.id
    WHERE rp.partitura_id = ? AND r.ativo = 1
  `).bind(partituraId).first();

  return jsonResponse({ inRepertorio: !!result }, 200, request);
}

// Ordem das famílias de instrumentos para banda de música
// Segue a ordem tradicional: Grade, Madeiras agudas→graves, Metais agudos→graves, Percussão
const FAMILIAS_ORDEM = [
  // Grade/Maestro (índice 0)
  ['grade', 'maestro', 'regente', 'conductor', 'score'],
  // Flautim (índice 1)
  ['flautim', 'piccolo'],
  // Flauta (índice 2)
  ['flauta', 'flute'],
  // Oboé (índice 3)
  ['oboe', 'oboé'],
  // Requinta (índice 4)
  ['requinta'],
  // Clarinete (índice 5)
  ['clarinete', 'clarineta', 'clarinet'],
  // Fagote (índice 6)
  ['fagote', 'bassoon'],
  // Sax Soprano (índice 7)
  ['sax. soprano', 'sax soprano', 'saxofone soprano', 'soprano sax'],
  // Sax Alto (índice 8)
  ['sax. alto', 'sax alto', 'saxofone alto', 'alto sax'],
  // Sax Tenor (índice 9)
  ['sax. tenor', 'sax tenor', 'saxofone tenor', 'tenor sax'],
  // Sax Barítono (índice 10)
  ['sax. barítono', 'sax. baritono', 'sax baritono', 'saxofone baritono', 'baritone sax'],
  // Trompete (índice 11)
  ['trompete', 'trumpet'],
  // Trompa (índice 12)
  ['trompa', 'horn'],
  // Barítono (índice 13)
  ['barítono tc', 'baritono tc', 'barítono bc', 'baritono bc', 'barítono', 'baritono', 'baritone'],
  // Trombone (índice 14)
  ['trombone'],
  // Bombardino (índice 15)
  ['bombardino', 'euphonium', 'eufônio', 'eufonio'],
  // Baixo/Tuba (índice 16)
  ['baixo', 'tuba', 'bass'],
  // Caixa (índice 17)
  ['caixa', 'snare'],
  // Bombo (índice 18)
  ['bombo', 'bumbo'],
  // Pratos (índice 19)
  ['pratos', 'prato', 'cymbal'],
  // Tímpano (índice 20)
  ['timpano', 'tímpano', 'timpani'],
  // Percussão geral (índice 21)
  ['percussão', 'percussao', 'percussion']
];

/**
 * Função para ordenar instrumentos na ordem tradicional de banda
 * Mantém instrumentos do mesmo tipo agrupados e ordenados por nome completo
 * Ex: Trompa Eb 1, Trompa Eb 2, Trompa F 1, Trompa F 2
 *
 * @param {string} instrumento - Nome do instrumento
 * @returns {string} - Chave de ordenação (formato: "XX_nome_completo")
 */
function getOrdemInstrumento(instrumento) {
  const lower = instrumento.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Encontrar família do instrumento
  let familiaIndex = FAMILIAS_ORDEM.length; // Default: final da lista

  for (let i = 0; i < FAMILIAS_ORDEM.length; i++) {
    for (const termo of FAMILIAS_ORDEM[i]) {
      const termoNorm = termo.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (lower.includes(termoNorm) || lower.startsWith(termoNorm.split(' ')[0])) {
        familiaIndex = i;
        break;
      }
    }
    if (familiaIndex === i) break;
  }

  // Retorna chave de ordenação: índice da família + nome completo
  // Isso agrupa por família e depois ordena alfabeticamente dentro da família
  const familiaStr = String(familiaIndex).padStart(2, '0');
  return `${familiaStr}_${lower}`;
}

/**
 * Obter lista de instrumentos disponíveis em um repertório
 * (baseado nas partes das partituras do repertório)
 */
export async function getRepertorioInstrumentos(id, request, env) {
  const result = await env.DB.prepare(`
    SELECT DISTINCT pa.instrumento
    FROM repertorio_partituras rp
    JOIN partituras p ON rp.partitura_id = p.id
    JOIN partes pa ON pa.partitura_id = p.id
    WHERE rp.repertorio_id = ? AND p.ativo = 1
  `).bind(id).all();

  // Extrair instrumentos e ordenar na ordem tradicional de banda
  // Agrupa por família e depois ordena alfabeticamente dentro de cada família
  const instrumentos = result.results
    .map(r => r.instrumento)
    .sort((a, b) => getOrdemInstrumento(a).localeCompare(getOrdemInstrumento(b)));

  return jsonResponse(instrumentos, 200, request);
}

// ============ CRUD ADMIN ============

/**
 * Criar novo repertório
 */
export async function createRepertorio(request, env, admin) {
  const data = await request.json();
  const { nome, descricao, data_apresentacao, ativo } = data;

  if (!nome || nome.trim() === '') {
    return errorResponse('Nome do repertório é obrigatório', 400, request);
  }

  // Se criando como ativo, arquivar o atual
  if (ativo) {
    await env.DB.prepare(
      'UPDATE repertorios SET ativo = 0 WHERE ativo = 1'
    ).run();
  }

  const result = await env.DB.prepare(`
    INSERT INTO repertorios (nome, descricao, data_apresentacao, ativo, criado_por)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    nome.trim(),
    descricao?.trim() || null,
    data_apresentacao || null,
    ativo ? 1 : 0,
    admin.id
  ).run();

  await registrarAtividade(env, 'novo_repertorio', nome, null, admin.id);

  return jsonResponse({
    success: true,
    id: result.meta.last_row_id,
    message: 'Repertório criado com sucesso!'
  }, 201, request);
}

/**
 * Atualizar repertório
 */
export async function updateRepertorio(id, request, env, admin) {
  const data = await request.json();
  const { nome, descricao, data_apresentacao, ativo } = data;

  const existing = await env.DB.prepare(
    'SELECT * FROM repertorios WHERE id = ?'
  ).bind(id).first();

  if (!existing) {
    return errorResponse('Repertório não encontrado', 404, request);
  }

  // Se ativando este repertorio, desativar os outros
  if (ativo && !existing.ativo) {
    await env.DB.prepare(
      'UPDATE repertorios SET ativo = 0 WHERE ativo = 1'
    ).run();
  }

  await env.DB.prepare(`
    UPDATE repertorios
    SET nome = ?, descricao = ?, data_apresentacao = ?, ativo = ?
    WHERE id = ?
  `).bind(
    nome?.trim() || existing.nome,
    descricao?.trim() || existing.descricao,
    data_apresentacao || existing.data_apresentacao,
    ativo !== undefined ? (ativo ? 1 : 0) : existing.ativo,
    id
  ).run();

  return jsonResponse({
    success: true,
    message: 'Repertório atualizado!'
  }, 200, request);
}

/**
 * Deletar repertório
 */
export async function deleteRepertorio(id, request, env, admin) {
  const existing = await env.DB.prepare(
    'SELECT * FROM repertorios WHERE id = ?'
  ).bind(id).first();

  if (!existing) {
    return errorResponse('Repertório não encontrado', 404, request);
  }

  // Deletar associações primeiro (cascade deveria fazer, mas garantir)
  await env.DB.prepare(
    'DELETE FROM repertorio_partituras WHERE repertorio_id = ?'
  ).bind(id).run();

  await env.DB.prepare(
    'DELETE FROM repertorios WHERE id = ?'
  ).bind(id).run();

  return jsonResponse({
    success: true,
    message: 'Repertório removido!'
  }, 200, request);
}

// ============ GERENCIAMENTO DE PARTITURAS ============

/**
 * Adicionar partitura ao repertório
 */
export async function addPartituraToRepertorio(repertorioId, request, env, admin) {
  const data = await request.json();
  const { partitura_id } = data;

  if (!partitura_id) {
    return errorResponse('partitura_id é obrigatório', 400, request);
  }

  // Verificar se repertório existe
  const repertorio = await env.DB.prepare(
    'SELECT * FROM repertorios WHERE id = ?'
  ).bind(repertorioId).first();

  if (!repertorio) {
    return errorResponse('Repertório não encontrado', 404, request);
  }

  // Verificar se partitura existe
  const partitura = await env.DB.prepare(
    'SELECT id, titulo FROM partituras WHERE id = ? AND ativo = 1'
  ).bind(partitura_id).first();

  if (!partitura) {
    return errorResponse('Partitura não encontrada', 404, request);
  }

  // Obter próxima ordem
  const maxOrdem = await env.DB.prepare(
    'SELECT MAX(ordem) as max FROM repertorio_partituras WHERE repertorio_id = ?'
  ).bind(repertorioId).first();

  const novaOrdem = (maxOrdem?.max || 0) + 1;

  try {
    await env.DB.prepare(`
      INSERT INTO repertorio_partituras (repertorio_id, partitura_id, ordem)
      VALUES (?, ?, ?)
    `).bind(repertorioId, partitura_id, novaOrdem).run();

    await registrarAtividade(env, 'add_repertorio', partitura.titulo, null, admin.id);
  } catch (e) {
    // Já existe no repertório
    return jsonResponse({
      success: true,
      message: 'Partitura já está no repertório'
    }, 200, request);
  }

  return jsonResponse({
    success: true,
    message: 'Adicionado ao repertório!'
  }, 200, request);
}

/**
 * Remover partitura do repertório
 */
export async function removePartituraFromRepertorio(repertorioId, partituraId, request, env, admin) {
  await env.DB.prepare(
    'DELETE FROM repertorio_partituras WHERE repertorio_id = ? AND partitura_id = ?'
  ).bind(repertorioId, partituraId).run();

  return jsonResponse({
    success: true,
    message: 'Removido do repertório!'
  }, 200, request);
}

/**
 * Reordenar partituras no repertório
 */
export async function reorderPartiturasRepertorio(repertorioId, request, env, admin) {
  const data = await request.json();
  const { ordens } = data; // Array de { partitura_id, ordem }

  if (!ordens || !Array.isArray(ordens)) {
    return errorResponse('ordens deve ser um array', 400, request);
  }

  for (const item of ordens) {
    await env.DB.prepare(
      'UPDATE repertorio_partituras SET ordem = ? WHERE repertorio_id = ? AND partitura_id = ?'
    ).bind(item.ordem, repertorioId, item.partitura_id).run();
  }

  return jsonResponse({
    success: true,
    message: 'Ordem atualizada!'
  }, 200, request);
}

/**
 * Duplicar repertório (cria cópia com as mesmas partituras)
 */
export async function duplicarRepertorio(id, request, env, admin) {
  const original = await env.DB.prepare(
    'SELECT * FROM repertorios WHERE id = ?'
  ).bind(id).first();

  if (!original) {
    return errorResponse('Repertório não encontrado', 404, request);
  }

  // Criar cópia
  const result = await env.DB.prepare(`
    INSERT INTO repertorios (nome, descricao, ativo, criado_por)
    VALUES (?, ?, 0, ?)
  `).bind(
    `${original.nome} (cópia)`,
    original.descricao,
    admin.id
  ).run();

  const novoId = result.meta.last_row_id;

  // Copiar partituras
  await env.DB.prepare(`
    INSERT INTO repertorio_partituras (repertorio_id, partitura_id, ordem)
    SELECT ?, partitura_id, ordem FROM repertorio_partituras WHERE repertorio_id = ?
  `).bind(novoId, id).run();

  return jsonResponse({
    success: true,
    id: novoId,
    message: 'Repertório duplicado!'
  }, 201, request);
}

// ============ DOWNLOAD EM LOTE ============

/**
 * Download do repertório em lote (PDF ou ZIP)
 */
export async function downloadRepertorio(id, request, env, user) {
  const url = new URL(request.url);
  const instrumento = url.searchParams.get('instrumento');
  const formato = url.searchParams.get('formato') || 'pdf';
  const partiturasParam = url.searchParams.get('partituras'); // IDs separados por vírgula

  // Usar instrumento do usuário se não especificado
  let targetInstrumento = instrumento;
  if (!targetInstrumento && user.instrumento) {
    targetInstrumento = user.instrumento;
  }

  if (!targetInstrumento) {
    return errorResponse('Instrumento não especificado', 400, request);
  }

  // Buscar repertório
  const repertorio = await env.DB.prepare(
    'SELECT * FROM repertorios WHERE id = ?'
  ).bind(id).first();

  if (!repertorio) {
    return errorResponse('Repertório não encontrado', 404, request);
  }

  // Buscar partituras do repertório
  const partituras = await env.DB.prepare(`
    SELECT p.*, rp.ordem
    FROM repertorio_partituras rp
    JOIN partituras p ON rp.partitura_id = p.id
    WHERE rp.repertorio_id = ? AND p.ativo = 1
    ORDER BY rp.ordem ASC
  `).bind(id).all();

  if (!partituras.results.length) {
    return errorResponse('Repertório vazio', 404, request);
  }

  // Filtrar partituras selecionadas (se especificado)
  let partiturasFiltradas = partituras.results;
  if (partiturasParam) {
    const selectedIds = partiturasParam.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    if (selectedIds.length > 0) {
      partiturasFiltradas = partituras.results.filter(p => selectedIds.includes(p.id));
    }
  }

  if (!partiturasFiltradas.length) {
    return errorResponse('Nenhuma partitura selecionada encontrada', 404, request);
  }

  // Buscar partes correspondentes ao instrumento
  const partes = [];
  for (const partitura of partiturasFiltradas) {
    const parte = await findMatchingPart(env, partitura.id, targetInstrumento);
    if (parte) {
      partes.push({
        ...parte,
        partitura_titulo: partitura.titulo,
        ordem: partitura.ordem
      });
    }
  }

  if (partes.length === 0) {
    return errorResponse(
      `Nenhuma parte encontrada para ${targetInstrumento}`,
      404,
      request
    );
  }

  // Gerar arquivo
  if (formato === 'zip') {
    return await generateZipDownload(env, partes, repertorio, targetInstrumento, request);
  } else {
    return await generatePdfDownload(env, partes, repertorio, targetInstrumento, request);
  }
}

/**
 * Extrai o nome base do instrumento (sem tonalidade e sem número)
 * Ex: "Bombardino C" → "bombardino"
 * Ex: "Clarinete Bb 1" → "clarinete"
 * Ex: "Trompa F 2" → "trompa"
 * Ex: "Flauta" → "flauta" (não remove F do início)
 */
function getInstrumentBase(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
    // Remove tonalidades APENAS quando precedidas de espaço (palavra isolada)
    // Isso evita remover o "F" de "Flauta" ou "C" de "Caixa"
    .replace(/\s+(em\s+)?(do|si\s*b|si\s*bemol|mi\s*b|mi\s*bemol|bb|eb|c|f)(\s+|$)/gi, ' ')
    .replace(/\s+\d+\s*$/, '') // Remove números no final
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Verifica se um instrumento é genérico (sem tonalidade específica)
 * Ex: "Bombardino" → true
 * Ex: "Bombardino C" → false
 * Ex: "Bombardino Bb" → false
 * Ex: "Flauta" → true (F aqui não é tonalidade)
 */
function isGenericInstrument(name) {
  const lower = name.toLowerCase();
  // Se contém tonalidade específica PRECEDIDA DE ESPAÇO, não é genérico
  // Isso evita falso positivo em "Flauta" (F não é tonalidade aqui)
  const hasTonality = /\s(bb|eb|c|f|do|si\s*b|mi\s*b)(\s|$)/i.test(lower);
  return !hasTonality;
}

/**
 * Sinônimos de instrumentos
 */
const INSTRUMENT_SYNONYMS = {
  'bombardino': ['euphonium', 'eufonio'],
  'euphonium': ['bombardino', 'eufonio'],
  'eufonio': ['bombardino', 'euphonium'],
  'sax': ['saxofone', 'saxophone'],
  'saxofone': ['sax', 'saxophone'],
  'clarinete': ['clarineta', 'clarinet'],
  'clarineta': ['clarinete', 'clarinet'],
  'tuba': ['baixo'],
  'baixo': ['tuba'],
  'caixa': ['snare'],
  'bombo': ['bumbo', 'bass drum'],
  'bumbo': ['bombo', 'bass drum'],
  // Flauta e Flautim são intercambiáveis em muitas partituras de banda
  'flauta': ['flautim', 'piccolo'],
  'flautim': ['flauta', 'piccolo'],
  'piccolo': ['flautim', 'flauta']
};

/**
 * Verifica se dois instrumentos são do mesmo tipo base
 */
function isSameInstrumentFamily(name1, name2) {
  const base1 = getInstrumentBase(name1).split(' ')[0];
  const base2 = getInstrumentBase(name2).split(' ')[0];

  if (base1 === base2) return true;
  if (INSTRUMENT_SYNONYMS[base1]?.includes(base2)) return true;
  if (INSTRUMENT_SYNONYMS[base2]?.includes(base1)) return true;

  return false;
}

/**
 * Verifica se uma parte combinada (ex: "Flauta/Flautim") contém o instrumento buscado
 * Detecta padrões como: "Flauta/Flautim", "Flauta-Flautim", "Flauta / Flautim"
 */
function isComboPartMatch(parteNome, instrumentoBuscado) {
  const parteNomeLower = parteNome.toLowerCase();
  const instrumentoLower = instrumentoBuscado.toLowerCase();
  const instrumentoBase = getInstrumentBase(instrumentoBuscado).split(' ')[0];

  // Verifica se é uma parte combinada (contém / ou -)
  if (!parteNomeLower.includes('/') && !parteNomeLower.includes('-')) {
    return false;
  }

  // Separa os instrumentos da combinação
  const partes = parteNomeLower.split(/[\/\-]/).map(p => p.trim());

  // Verifica se algum dos instrumentos da combinação corresponde
  for (const p of partes) {
    const pBase = getInstrumentBase(p).split(' ')[0];
    if (pBase === instrumentoBase) return true;
    if (INSTRUMENT_SYNONYMS[pBase]?.includes(instrumentoBase)) return true;
    if (INSTRUMENT_SYNONYMS[instrumentoBase]?.includes(pBase)) return true;
  }

  return false;
}

/**
 * Encontrar parte correspondente ao instrumento
 * Estratégia:
 * 1. Match exato (case-insensitive)
 * 2. Match em partes combinadas (ex: "Flauta/Flautim" para busca de "Flauta")
 * 3. Se selecionou específico (ex: "Bombardino C"), só aceita genérico ("Bombardino") como fallback
 * 4. Se selecionou genérico (ex: "Bombardino"), aceita qualquer da família
 * 5. Fallback para sinônimos (ex: Flauta -> Flautim se não houver Flauta)
 * 6. NÃO faz fallback de específico para outro específico diferente (exceto sinônimos)
 */
async function findMatchingPart(env, partituraId, instrumento) {
  // Buscar todas as partes desta partitura
  const partes = await env.DB.prepare(`
    SELECT * FROM partes WHERE partitura_id = ?
  `).bind(partituraId).all();

  if (!partes.results.length) return null;

  const instrLower = instrumento.toLowerCase();
  const instrBase = getInstrumentBase(instrumento).split(' ')[0];

  // 1. Match exato (case-insensitive)
  let parte = partes.results.find(p =>
    p.instrumento.toLowerCase() === instrLower
  );
  if (parte) return parte;

  // 2. Match em partes combinadas (ex: "Flauta/Flautim" para busca de "Flauta")
  const comboMatch = partes.results.find(p => isComboPartMatch(p.instrumento, instrumento));
  if (comboMatch) return comboMatch;

  // 3. Se selecionou instrumento específico (com tonalidade)
  //    Só aceita fallback para versão genérica (sem tonalidade)
  if (!isGenericInstrument(instrumento)) {
    // Buscar versão genérica da mesma família
    const genericMatch = partes.results.find(p =>
      isSameInstrumentFamily(instrumento, p.instrumento) &&
      isGenericInstrument(p.instrumento)
    );

    // Se encontrou genérico, usa ele
    // Se não encontrou, retorna null (não pega outro específico diferente)
    return genericMatch || null;
  }

  // 4. Se selecionou instrumento genérico (sem tonalidade)
  //    Aceita qualquer da mesma família, preferindo genérico ou primeiro numerado
  const familyMatches = partes.results.filter(p =>
    isSameInstrumentFamily(instrumento, p.instrumento)
  );

  if (familyMatches.length > 0) {
    // Ordena: genéricos primeiro, depois por nome
    familyMatches.sort((a, b) => {
      const aGeneric = isGenericInstrument(a.instrumento);
      const bGeneric = isGenericInstrument(b.instrumento);
      if (aGeneric && !bGeneric) return -1;
      if (!aGeneric && bGeneric) return 1;
      return a.instrumento.localeCompare(b.instrumento);
    });
    return familyMatches[0];
  }

  // 5. Fallback para sinônimos (ex: Flauta -> Flautim se não houver Flauta)
  const synonyms = INSTRUMENT_SYNONYMS[instrBase];
  if (synonyms) {
    for (const synonym of synonyms) {
      const synonymMatch = partes.results.find(p => {
        const pBase = getInstrumentBase(p.instrumento).split(' ')[0];
        return pBase === synonym;
      });
      if (synonymMatch) return synonymMatch;
    }
  }

  return null;
}

/**
 * Gerar download de PDF concatenado
 */
async function generatePdfDownload(env, partes, repertorio, instrumento, request) {
  // Importar pdf-lib dinamicamente
  const { PDFDocument } = await import('pdf-lib');

  const mergedPdf = await PDFDocument.create();

  for (const parte of partes) {
    try {
      const arquivo = await env.BUCKET.get(parte.arquivo_nome);
      if (arquivo) {
        const buffer = await arquivo.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }
    } catch (e) {
      console.error(`Erro ao processar ${parte.arquivo_nome}:`, e);
    }
  }

  const mergedBytes = await mergedPdf.save();
  const nomeArquivo = sanitizeFilename(
    `Repertorio_${repertorio.nome}_${instrumento}.pdf`
  );

  return new Response(mergedBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${nomeArquivo}"`,
      ...getCorsHeaders(request)
    }
  });
}

/**
 * Gerar download de ZIP com PDFs separados
 */
async function generateZipDownload(env, partes, repertorio, instrumento, request) {
  // Usar fflate para gerar ZIP
  const { zipSync, strToU8 } = await import('fflate');

  const files = {};

  for (const parte of partes) {
    try {
      const arquivo = await env.BUCKET.get(parte.arquivo_nome);
      if (arquivo) {
        const buffer = await arquivo.arrayBuffer();
        const nomeArquivo = sanitizeFilename(
          `${String(parte.ordem).padStart(2, '0')}_${parte.partitura_titulo}_${parte.instrumento}.pdf`
        );
        files[nomeArquivo] = new Uint8Array(buffer);
      }
    } catch (e) {
      console.error(`Erro ao processar ${parte.arquivo_nome}:`, e);
    }
  }

  const zipData = zipSync(files);
  const nomeArquivo = sanitizeFilename(
    `Repertorio_${repertorio.nome}_${instrumento}.zip`
  );

  return new Response(zipData, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${nomeArquivo}"`,
      ...getCorsHeaders(request)
    }
  });
}

/**
 * Sanitizar nome de arquivo
 */
function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_');
}
