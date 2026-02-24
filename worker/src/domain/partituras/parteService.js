// worker/src/domain/partituras/parteService.js
import { jsonResponse, errorResponse } from '../../infrastructure/index.js';

/**
 * Listar partes de uma partitura
 *
 * Extraido de: worker/index.js linhas 704-737
 */
export async function getPartesPartitura(partituraId, request, env) {
  const partes = await env.DB.prepare(`
    SELECT id, instrumento, arquivo_nome, criado_em
    FROM partes
    WHERE partitura_id = ?
    ORDER BY
      CASE
        WHEN instrumento = 'Grade' THEN 0
        WHEN instrumento LIKE 'Flautim%' THEN 1
        WHEN instrumento LIKE 'Flauta%' THEN 2
        WHEN instrumento LIKE 'Requinta%' THEN 3
        WHEN instrumento LIKE 'Clarinete%' THEN 4
        WHEN instrumento LIKE 'Sax. Soprano%' OR instrumento LIKE 'Sax Soprano%' THEN 5
        WHEN instrumento LIKE 'Sax. Alto%' OR instrumento LIKE 'Sax Alto%' THEN 6
        WHEN instrumento LIKE 'Sax. Tenor%' OR instrumento LIKE 'Sax Tenor%' THEN 7
        WHEN instrumento LIKE 'Sax. Barítono%' OR instrumento LIKE 'Sax Baritono%' OR instrumento LIKE 'Sax Barítono%' THEN 8
        WHEN instrumento LIKE 'Trompete%' THEN 9
        WHEN instrumento LIKE 'Trompa F%' THEN 10
        WHEN instrumento LIKE 'Trompa Eb%' OR instrumento LIKE 'Trompa%' THEN 11
        WHEN instrumento LIKE 'Barítono%' OR instrumento LIKE 'Baritono%' THEN 12
        WHEN instrumento LIKE 'Trombone%' THEN 13
        WHEN instrumento LIKE 'Bombardino%' THEN 14
        WHEN instrumento LIKE 'Baixo%' OR instrumento LIKE 'Tuba%' THEN 15
        WHEN instrumento LIKE 'Caixa%' THEN 16
        WHEN instrumento LIKE 'Bombo%' OR instrumento LIKE 'Bumbo%' THEN 17
        WHEN instrumento LIKE 'Pratos%' THEN 18
        ELSE 99
      END,
      instrumento
  `).bind(partituraId).all();

  return jsonResponse(partes.results, 200, request);
}

/**
 * Adicionar nova parte a uma partitura (Admin)
 *
 * Extraido de: worker/index.js linhas 739-794
 */
export async function addParte(partituraId, request, env) {
  try {
    const formData = await request.formData();
    const instrumento = formData.get('instrumento');
    const arquivo = formData.get('arquivo');

    if (!instrumento || !arquivo) {
      return errorResponse('Instrumento e arquivo são obrigatórios', 400, request);
    }

    const partitura = await env.DB.prepare(
      'SELECT * FROM partituras WHERE id = ?'
    ).bind(partituraId).first();

    if (!partitura) {
      return errorResponse('Partitura não encontrada', 404, request);
    }

    const arrayBuffer = await arquivo.arrayBuffer();

    // Validar magic bytes do PDF (%PDF-)
    const bytes = new Uint8Array(arrayBuffer.slice(0, 5));
    const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2D;

    if (!isPdf) {
      return errorResponse('Arquivo não é um PDF válido', 400, request);
    }

    const timestamp = Date.now();
    const nomeArquivoStorage = `${timestamp}_${partituraId}_${instrumento.replace(/[^a-zA-Z0-9.-]/g, '_')}.pdf`;

    await env.BUCKET.put(nomeArquivoStorage, arrayBuffer, {
      httpMetadata: { contentType: 'application/pdf' }
    });

    const result = await env.DB.prepare(`
      INSERT INTO partes (partitura_id, instrumento, arquivo_nome)
      VALUES (?, ?, ?)
    `).bind(partituraId, instrumento, nomeArquivoStorage).run();

    return jsonResponse({
      success: true,
      id: result.meta.last_row_id,
      message: 'Parte adicionada com sucesso!'
    }, 201, request);

  } catch (error) {
    return errorResponse('Erro ao adicionar parte', 500, request);
  }
}

/**
 * Substituir arquivo de uma parte (Admin)
 *
 * Extraido de: worker/index.js linhas 796-849
 */
export async function substituirParte(parteId, request, env) {
  try {
    const formData = await request.formData();
    const arquivo = formData.get('arquivo');

    if (!arquivo) {
      return errorResponse('Arquivo é obrigatório', 400, request);
    }

    const parte = await env.DB.prepare(
      'SELECT * FROM partes WHERE id = ?'
    ).bind(parteId).first();

    if (!parte) {
      return errorResponse('Parte não encontrada', 404, request);
    }

    const arrayBuffer = await arquivo.arrayBuffer();

    // Validar magic bytes do PDF (%PDF-)
    const bytes = new Uint8Array(arrayBuffer.slice(0, 5));
    const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2D;

    if (!isPdf) {
      return errorResponse('Arquivo não é um PDF válido', 400, request);
    }

    if (parte.arquivo_nome) {
      await env.BUCKET.delete(parte.arquivo_nome);
    }

    const timestamp = Date.now();
    const nomeArquivoStorage = `${timestamp}_${parte.partitura_id}_${parte.instrumento.replace(/[^a-zA-Z0-9.-]/g, '_')}.pdf`;

    await env.BUCKET.put(nomeArquivoStorage, arrayBuffer, {
      httpMetadata: { contentType: 'application/pdf' }
    });

    await env.DB.prepare(`
      UPDATE partes SET arquivo_nome = ?, criado_em = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(nomeArquivoStorage, parteId).run();

    return jsonResponse({ success: true, message: 'Parte substituída com sucesso!' }, 200, request);

  } catch (error) {
    return errorResponse('Erro ao substituir parte', 500, request);
  }
}

/**
 * Renomear instrumento de uma parte (Admin)
 * Permite corrigir o nome do instrumento sem re-upload
 */
export async function renomearParte(parteId, request, env) {
  try {
    const data = await request.json();
    const { instrumento } = data;

    if (!instrumento || !instrumento.trim()) {
      return errorResponse('Nome do instrumento é obrigatório', 400, request);
    }

    const parte = await env.DB.prepare(
      'SELECT * FROM partes WHERE id = ?'
    ).bind(parteId).first();

    if (!parte) {
      return errorResponse('Parte não encontrada', 404, request);
    }

    await env.DB.prepare(
      'UPDATE partes SET instrumento = ? WHERE id = ?'
    ).bind(instrumento.trim(), parteId).run();

    return jsonResponse({
      success: true,
      message: `Instrumento alterado para "${instrumento.trim()}"!`
    }, 200, request);

  } catch (error) {
    return errorResponse('Erro ao renomear parte', 500, request);
  }
}

/**
 * Remover uma parte (Admin)
 *
 * Extraido de: worker/index.js linhas 851-878
 */
export async function deleteParte(parteId, request, env) {
  try {
    const parte = await env.DB.prepare(
      'SELECT * FROM partes WHERE id = ?'
    ).bind(parteId).first();

    if (!parte) {
      return errorResponse('Parte não encontrada', 404, request);
    }

    if (parte.arquivo_nome) {
      await env.BUCKET.delete(parte.arquivo_nome);
    }

    await env.DB.prepare('DELETE FROM partes WHERE id = ?').bind(parteId).run();

    return jsonResponse({ success: true, message: 'Parte removida com sucesso!' }, 200, request);

  } catch (error) {
    return errorResponse('Erro ao remover parte', 500, request);
  }
}
