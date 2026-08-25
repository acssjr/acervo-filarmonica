// worker/src/domain/partituras/partituraService.js
import {
  STORAGE_PREFIXES,
  MAX_PDF_BATCH_COUNT,
  accumulatePdfBatchBytes,
  buildStorageKey,
  deleteBestEffort,
  errorResponse,
  jsonResponse,
  putWithDbCompensation,
  readAndValidatePdf
} from '../../infrastructure/index.js';
import { registrarAtividade } from '../atividades/index.js';
import { buildUpdateDetails, describeBoolean } from '../atividades/auditUtils.js';
import { capturePostHog } from '../../infrastructure/posthog/posthogClient.js';
import { canonicalizeInstrumentName } from '../instrumentos/instrumentUtils.js';

/**
 * Listar todas as partituras
 *
 * Extraido de: worker/index.js linhas 396-432
 */
export async function getPartituras(request, env) {
  const url = new URL(request.url);
  const categoria = url.searchParams.get('categoria');
  const busca = url.searchParams.get('busca');
  const destaque = url.searchParams.get('destaque');

  let query = `
    SELECT p.*, c.nome as categoria_nome, c.emoji as categoria_emoji, c.cor as categoria_cor,
           (SELECT COUNT(*) FROM partes WHERE partitura_id = p.id) as total_partes
    FROM partituras p
    JOIN categorias c ON p.categoria_id = c.id
    WHERE p.ativo = 1
  `;
  const params = [];

  if (categoria) {
    query += ' AND p.categoria_id = ?';
    params.push(categoria);
  }

  if (busca) {
    query += ' AND (p.titulo LIKE ? OR p.compositor LIKE ? OR p.arranjador LIKE ?)';
    params.push(`%${busca}%`, `%${busca}%`, `%${busca}%`);
  }

  if (destaque === '1') {
    query += ' AND p.destaque = 1';
  }

  query += ' ORDER BY p.titulo ASC';

  const stmt = env.DB.prepare(query);
  const result = await (params.length ? stmt.bind(...params) : stmt).all();

  return jsonResponse(result.results, 200, request);
}

/**
 * Obter uma partitura
 *
 * Extraido de: worker/index.js linhas 434-448
 */
export async function getPartitura(id, request, env) {
  const result = await env.DB.prepare(`
    SELECT p.*, c.nome as categoria_nome, c.emoji as categoria_emoji, c.cor as categoria_cor
    FROM partituras p
    JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ? AND p.ativo = 1
  `).bind(id).first();

  if (!result) {
    return errorResponse('Partitura não encontrada', 404, request);
  }

  return jsonResponse(result, 200, request);
}

/**
 * Criar partitura (Admin)
 *
 * Extraido de: worker/index.js linhas 565-616
 */
export async function createPartitura(request, env, admin) {
  const formData = await request.formData();
  const titulo = formData.get('titulo');
  const compositor = formData.get('compositor');
  const arranjador = formData.get('arranjador');
  const categoria = formData.get('categoria');
  const ano = formData.get('ano');
  const descricao = formData.get('descricao');
  const destaque = formData.get('destaque') === '1' ? 1 : 0;
  const arquivo = formData.get('arquivo');

  if (!titulo || !compositor || !categoria || !arquivo) {
    return errorResponse('Campos obrigatórios: titulo, compositor, categoria, arquivo', 400, request);
  }

  // Verifica se já existe partitura com mesmo título (normalizado)
  const tituloNorm = titulo.trim().toLowerCase();
  const duplicada = await env.DB.prepare(`
    SELECT id, titulo FROM partituras
    WHERE LOWER(TRIM(titulo)) = ? AND ativo = 1
  `).bind(tituloNorm).first();

  if (duplicada) {
    return errorResponse(`Já existe uma partitura com o título "${duplicada.titulo}"`, 409, request);
  }

  let arrayBuffer;
  try {
    arrayBuffer = await readAndValidatePdf(arquivo);
  } catch (error) {
    return errorResponse(error.message, 400, request);
  }

  const timestamp = Date.now();
  const nomeArquivo = buildStorageKey(
    STORAGE_PREFIXES.partituras,
    `${timestamp}_${arquivo.name}`
  );

  const result = await putWithDbCompensation({
    bucket: env.BUCKET,
    key: nomeArquivo,
    value: arrayBuffer,
    options: { httpMetadata: { contentType: 'application/pdf' } },
    commit: () => env.DB.prepare(`
      INSERT INTO partituras (titulo, compositor, arranjador, categoria_id, ano, descricao, arquivo_nome, arquivo_tamanho, destaque)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      titulo,
      compositor,
      arranjador || null,
      categoria,
      ano ? parseInt(ano) : null,
      descricao || null,
      nomeArquivo,
      arquivo.size,
      destaque
    ).run()
  });

  // Registra atividade
  await registrarAtividade(env, 'nova_partitura', titulo, compositor, admin.id);

  // PostHog: capture partitura creation event
  await capturePostHog(env, {
      distinctId: `user_${admin.id}`,
      event: 'partitura_created',
      properties: {
        partitura_id: result.meta.last_row_id,
        titulo,
        compositor,
        arranjador: arranjador || null,
        categoria_id: categoria,
        destaque: destaque === 1,
        upload_type: 'single',
      },
    });

  return jsonResponse({
    success: true,
    id: result.meta.last_row_id,
    message: 'Partitura adicionada com sucesso!'
  }, 201, request);
}

/**
 * Upload de pasta com múltiplas partes (Admin)
 *
 * Extraido de: worker/index.js linhas 618-702
 */
export async function uploadPastaPartitura(request, env, admin) {
  try {
    const formData = await request.formData();
    const titulo = formData.get('titulo');
    const compositor = formData.get('compositor') || '';
    const arranjador = formData.get('arranjador') || '';
    const categoria = formData.get('categoria');
    const ano = formData.get('ano');
    const totalArquivos = parseInt(formData.get('total_arquivos') || '0');

    if (!titulo || !categoria || !Number.isInteger(totalArquivos) || totalArquivos <= 0) {
      return errorResponse('Campos obrigatórios: titulo, categoria, arquivos', 400, request);
    }
    if (totalArquivos > MAX_PDF_BATCH_COUNT) {
      return errorResponse(`O lote pode conter no máximo ${MAX_PDF_BATCH_COUNT} arquivos`, 400, request);
    }

    // Verifica se já existe partitura com mesmo título (normalizado)
    const tituloNorm = titulo.trim().toLowerCase();
    const duplicada = await env.DB.prepare(`
      SELECT id, titulo FROM partituras
      WHERE LOWER(TRIM(titulo)) = ? AND ativo = 1
    `).bind(tituloNorm).first();

    if (duplicada) {
      return errorResponse(`Já existe uma partitura com o título "${duplicada.titulo}"`, 409, request);
    }

    const timestamp = Date.now();
    const arquivosValidados = [];
    let totalBytesValidados = 0;

    // Valida o lote inteiro antes de criar qualquer registro ou objeto.
    for (let i = 0; i < totalArquivos; i++) {
      const arquivo = formData.get(`arquivo_${i}`);
      const instrumentoInformado = formData.get(`instrumento_${i}`);
      if (!arquivo || !instrumentoInformado) {
        return errorResponse(`Arquivo ou instrumento ausente na posição ${i + 1}`, 400, request);
      }
      const instrumento = canonicalizeInstrumentName(instrumentoInformado);
      if (!instrumento) {
        return errorResponse(`Arquivo ou instrumento ausente na posição ${i + 1}`, 400, request);
      }
      try {
        const arrayBuffer = await readAndValidatePdf(arquivo);
        totalBytesValidados = accumulatePdfBatchBytes(totalBytesValidados, arrayBuffer);
        arquivosValidados.push({
          arquivo,
          instrumento,
          arrayBuffer,
          index: i
        });
      } catch (error) {
        return errorResponse(error.message, 400, request);
      }
    }

    const result = await env.DB.prepare(`
      INSERT INTO partituras (titulo, compositor, arranjador, categoria_id, ano, arquivo_nome, arquivo_tamanho, destaque)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `).bind(
      titulo,
      compositor,
      arranjador || null,
      categoria,
      ano ? parseInt(ano) : null,
      'multiplas_partes',
      0
    ).run();

    const partituraId = result.meta.last_row_id;
    const uploadedKeys = [];

    try {
      const insertStatements = [];
      for (const item of arquivosValidados) {
        const nomeArquivoStorage = buildStorageKey(
          STORAGE_PREFIXES.partes,
          `${timestamp}_${partituraId}_${item.index}_${item.instrumento}.pdf`
        );

        await env.BUCKET.put(nomeArquivoStorage, item.arrayBuffer, {
          httpMetadata: { contentType: 'application/pdf' }
        });
        uploadedKeys.push(nomeArquivoStorage);
        insertStatements.push(env.DB.prepare(`
          INSERT INTO partes (partitura_id, instrumento, arquivo_nome)
          VALUES (?, ?, ?)
        `).bind(partituraId, item.instrumento, nomeArquivoStorage));
      }
      await env.DB.batch(insertStatements);
    } catch (error) {
      await Promise.all(uploadedKeys.map(key => deleteBestEffort(env.BUCKET, key)));
      await env.DB.prepare('DELETE FROM partituras WHERE id = ?').bind(partituraId).run();
      throw error;
    }

    const partesAdicionadas = arquivosValidados.length;

    await registrarAtividade(env, 'nova_partitura', titulo, `${compositor} • ${partesAdicionadas} partes`, admin.id);

    // PostHog: capture folder upload event
    await capturePostHog(env, {
        distinctId: `user_${admin.id}`,
        event: 'partitura_uploaded_with_parts',
        properties: {
          partitura_id: partituraId,
          titulo,
          compositor,
          categoria_id: categoria,
          partes_count: partesAdicionadas,
          upload_type: 'folder',
        },
      });

    return jsonResponse({
      success: true,
      id: partituraId,
      partes_criadas: partesAdicionadas,
      message: `Partitura criada com ${partesAdicionadas} partes!`
    }, 201, request);

  } catch (error) {
    console.error('Erro no upload:', error);
    return errorResponse('Erro no upload', 500, request);
  }
}

/**
 * Atualizar partitura (Admin)
 *
 * Extraido de: worker/index.js linhas 880-908
 */
function buildPartituraUpdateDetails(before, after) {
  return buildUpdateDetails(before, after, [
    { key: 'titulo', label: 'Título' },
    { key: 'compositor', label: 'Compositor' },
    { key: 'arranjador', label: 'Arranjador' },
    { key: 'categoria_id', label: 'Categoria' },
    { key: 'ano', label: 'Ano' },
    { key: 'descricao', label: 'Descrição' },
    { key: 'destaque', label: 'Destaque', format: describeBoolean }
  ]);
}

export async function deleteBucketObjects(bucket, keys) {
  const validKeys = [...new Set((keys || []).filter(Boolean))];
  await Promise.allSettled(validKeys.map(key => bucket.delete(key)));
}

export function getPartituraDeleteKeys(partitura, partes = []) {
  return [
    partitura?.arquivo_nome,
    ...partes.map(parte => parte?.arquivo_nome)
  ].filter(Boolean);
}

async function capturePartituraDeleted(env, user, partituraId, titulo, executionCtx = null) {
  await capturePostHog(env, {
    distinctId: `user_${user.id}`,
    event: 'partitura_deleted',
    properties: {
      partitura_id: partituraId,
      titulo,
    },
  }, executionCtx);
}

function runAfterResponse(context, task) {
  if (context?.executionCtx?.waitUntil) {
    context.executionCtx.waitUntil(task.catch(error => {
      console.error('Erro em tarefa de fundo:', error);
    }));
    return Promise.resolve();
  }

  return task;
}

export async function updatePartitura(id, request, env, user) {
  try {
    const data = await request.json();
    const { titulo, compositor, arranjador, categoria, categoria_id, ano, descricao, destaque } = data;

    const tituloFinal = typeof titulo === 'string' ? titulo.trim() : '';
    if (!tituloFinal) {
      return errorResponse('Título é obrigatório', 400, request);
    }

    const categoriaFinal = categoria ?? categoria_id ?? null;

    if (!categoriaFinal) {
      return errorResponse('Categoria é obrigatória', 400, request);
    }

    const partituraAtual = await env.DB.prepare(`
      SELECT titulo, compositor, arranjador, categoria_id, ano, descricao, destaque
      FROM partituras
      WHERE id = ?
    `).bind(id).first();

    if (!partituraAtual) {
      return errorResponse('Partitura não encontrada', 404, request);
    }

    const duplicada = await env.DB.prepare(`
      SELECT id, titulo FROM partituras
      WHERE id <> ? AND LOWER(TRIM(titulo)) = ? AND ativo = 1
    `).bind(id, tituloFinal.toLowerCase()).first();

    if (duplicada) {
      return errorResponse(`Já existe uma partitura com o título "${duplicada.titulo}"`, 409, request);
    }

    const novaPartitura = {
      titulo: tituloFinal,
      compositor: compositor ?? partituraAtual.compositor,
      arranjador: arranjador ?? null,
      categoria_id: categoriaFinal,
      ano: ano ?? null,
      descricao: descricao ?? null,
      destaque: destaque ? 1 : 0,
    };
    const detalhes = buildPartituraUpdateDetails(partituraAtual, novaPartitura);

    const updateResult = await env.DB.prepare(`
      UPDATE partituras
      SET titulo = ?, compositor = ?, arranjador = ?, categoria_id = ?, ano = ?, descricao = ?, destaque = ?, atualizado_em = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      novaPartitura.titulo,
      novaPartitura.compositor,
      novaPartitura.arranjador,
      novaPartitura.categoria_id,
      novaPartitura.ano,
      novaPartitura.descricao,
      novaPartitura.destaque,
      id
    ).run();

    if (updateResult.meta?.changes === 0) {
      return errorResponse('Partitura não encontrada', 404, request);
    }

    await registrarAtividade(env, 'update_partitura', tituloFinal, detalhes, user.id);

    return jsonResponse({ success: true, message: 'Partitura atualizada!' }, 200, request);
  } catch (error) {
    console.error('Erro ao atualizar partitura:', error);
    return errorResponse('Erro ao atualizar partitura', 500, request);
  }
}

export async function deletePartitura(id, request, env, user, context = null) {
  // Busca info antes de deletar para log
  const partitura = await env.DB.prepare('SELECT titulo, arquivo_nome FROM partituras WHERE id = ?').bind(id).first();

  if (!partitura) {
    return errorResponse('Partitura não encontrada', 404, request);
  }

  // 1. Buscar todas as partes para deletar arquivos do R2
  const partes = await env.DB.prepare(
    'SELECT id, arquivo_nome FROM partes WHERE partitura_id = ?'
  ).bind(id).all();

  const arquivosParaRemover = getPartituraDeleteKeys(partitura, partes.results || []);

  // 3. & 4. Deletar registros relacionados e a partitura (transacionalmente)
  await env.DB.batch([
    env.DB.prepare(`
      UPDATE tracking_events
      SET partitura_id = NULL, parte_id = NULL
      WHERE partitura_id = ? OR parte_id IN (SELECT id FROM partes WHERE partitura_id = ?)
    `).bind(id, id),
    env.DB.prepare('DELETE FROM logs_download WHERE partitura_id = ?').bind(id),
    env.DB.prepare('DELETE FROM partes WHERE partitura_id = ?').bind(id),
    env.DB.prepare('DELETE FROM favoritos WHERE partitura_id = ?').bind(id),
    env.DB.prepare('DELETE FROM repertorio_partituras WHERE partitura_id = ?').bind(id),
    env.DB.prepare('DELETE FROM ensaios_partituras WHERE partitura_id = ?').bind(id),
    env.DB.prepare('DELETE FROM partituras WHERE id = ?').bind(id)
  ]);

  await registrarAtividade(env, 'delete_partitura', partitura.titulo, 'Partitura removida permanentemente', user.id);

  await runAfterResponse(context, deleteBucketObjects(env.BUCKET, arquivosParaRemover));
  await capturePartituraDeleted(env, user, id, partitura.titulo, context?.executionCtx);

  return jsonResponse({ success: true, message: 'Partitura removida permanentemente!' }, 200, request);
}

/**
 * Corrigir partes de Bombardino de uma partitura (Admin)
 * Deleta partes existentes de Bombardino e faz upload das novas com nomes corretos
 */
export async function corrigirBombardinosPartitura(partituraId, request, env, admin) {
  try {
    const formData = await request.formData();
    const totalArquivos = parseInt(formData.get('total_arquivos') || '0');

    if (!Number.isInteger(totalArquivos) || totalArquivos <= 0) {
      return errorResponse('Nenhum arquivo enviado', 400, request);
    }
    if (totalArquivos > MAX_PDF_BATCH_COUNT) {
      return errorResponse(`O lote pode conter no máximo ${MAX_PDF_BATCH_COUNT} arquivos`, 400, request);
    }

    const partitura = await env.DB.prepare(
      'SELECT id, titulo FROM partituras WHERE id = ? AND ativo = 1'
    ).bind(partituraId).first();

    if (!partitura) {
      return errorResponse('Partitura não encontrada', 404, request);
    }

    // 1. Pre-validar e armazenar buffers antes de deletar
    const timestamp = Date.now();
    const novosArquivos = [];
    let totalBytesValidados = 0;
    for (let i = 0; i < totalArquivos; i++) {
      const arquivo = formData.get(`arquivo_${i}`);
      const instrumentoInformado = formData.get(`instrumento_${i}`);
      if (!arquivo || !instrumentoInformado) {
        return errorResponse('Arquivo/instrumento ausente', 400, request);
      }
      const instrumento = canonicalizeInstrumentName(instrumentoInformado);
      if (!instrumento) {
        return errorResponse('Arquivo/instrumento ausente', 400, request);
      }
      let arrayBuffer;
      try {
        arrayBuffer = await readAndValidatePdf(arquivo);
        totalBytesValidados = accumulatePdfBatchBytes(totalBytesValidados, arrayBuffer);
      } catch (error) {
        return errorResponse(error.message, 400, request);
      }
      const nomeArquivoStorage = buildStorageKey(
        STORAGE_PREFIXES.partes,
        `${timestamp}_${partituraId}_${i}_${instrumento}.pdf`
      );
      novosArquivos.push({ instrumento, arrayBuffer, nomeArquivoStorage });
    }

    // 2. Buscar partes de Bombardino existentes
    const partesAntigas = await env.DB.prepare(
      "SELECT id, arquivo_nome FROM partes WHERE partitura_id = ? AND instrumento LIKE 'Bombardino%'"
    ).bind(partituraId).all();

    // Envia o novo conjunto primeiro. Se o D1 falhar, só os novos objetos são
    // compensados; os registros e PDFs antigos permanecem intactos.
    const uploadedFiles = [];
    try {
      for (const item of novosArquivos) {
        await env.BUCKET.put(item.nomeArquivoStorage, item.arrayBuffer, {
          httpMetadata: { contentType: 'application/pdf' }
        });
        uploadedFiles.push(item.nomeArquivoStorage);
      }

      const batch = [
        env.DB.prepare(`
          UPDATE tracking_events SET parte_id = NULL
          WHERE parte_id IN (
            SELECT id FROM partes
            WHERE partitura_id = ? AND instrumento LIKE 'Bombardino%'
          )
        `).bind(partituraId),
        env.DB.prepare(
          "DELETE FROM partes WHERE partitura_id = ? AND instrumento LIKE 'Bombardino%'"
        ).bind(partituraId),
        ...novosArquivos.map(item => env.DB.prepare(
          'INSERT INTO partes (partitura_id, instrumento, arquivo_nome) VALUES (?, ?, ?)'
        ).bind(partituraId, item.instrumento, item.nomeArquivoStorage))
      ];
      await env.DB.batch(batch);
    } catch (error) {
      await Promise.all(uploadedFiles.map(key => deleteBestEffort(env.BUCKET, key)));
      throw error;
    }

    await Promise.all((partesAntigas.results || [])
      .map(parte => deleteBestEffort(env.BUCKET, parte.arquivo_nome)));

    const partesAdicionadas = uploadedFiles.length;
    const partesRemovidas = (partesAntigas.results || []).length;

    await registrarAtividade(
      env,
      'update_parte',
      partitura.titulo,
      `Bombardinos corrigidos: ${partesRemovidas} partes removidas, ${partesAdicionadas} partes adicionadas`,
      admin?.id ?? null
    );

    return jsonResponse({
      success: true,
      partes_removidas: partesRemovidas,
      partes_adicionadas: partesAdicionadas,
      message: `Bombardinos corrigidos: ${partesAdicionadas} partes atualizadas!`
    }, 200, request);

  } catch (error) {
    console.error('Erro ao corrigir bombardinos:', error);
    return errorResponse('Erro ao corrigir bombardinos', 500, request);
  }
}
