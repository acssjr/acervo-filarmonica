// worker/src/domain/partituras/downloadService.js
import { errorResponse, getCorsHeaders } from '../../infrastructure/index.js';
import { registrarAtividade } from '../atividades/index.js';

/**
 * Download de partitura - REQUER AUTENTICAÇÃO
 *
 * Extraido de: worker/index.js linhas 450-499
 */
export async function downloadPartitura(id, request, env, user) {
  try {
    const partitura = await env.DB.prepare(
      'SELECT * FROM partituras WHERE id = ? AND ativo = 1'
    ).bind(id).first();

    if (!partitura) {
      return errorResponse('Partitura não encontrada', 404, request);
    }

    const arquivo = await env.BUCKET.get(partitura.arquivo_nome);

    if (!arquivo) {
      return errorResponse('Arquivo não encontrado', 404, request);
    }

    await env.DB.prepare(
      'UPDATE partituras SET downloads = downloads + 1 WHERE id = ?'
    ).bind(id).run();

    // Registra atividade de download
    await registrarAtividade(env, 'download', partitura.titulo, null, user.id);

    // Log de download
    try {
      await env.DB.prepare(
        'INSERT INTO logs_download (partitura_id, instrumento_id, ip) VALUES (?, NULL, ?)'
      ).bind(id, request.headers.get('CF-Connecting-IP')).run();
    } catch (logError) {
      console.error('Erro ao registrar log:', logError);
    }

    return new Response(arquivo.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${partitura.titulo}.pdf"`,
        ...getCorsHeaders(request),
      },
    });
  } catch (error) {
    return errorResponse('Erro no download', 500, request);
  }
}

/**
 * Download de uma parte específica - REQUER AUTENTICAÇÃO
 *
 * Extraido de: worker/index.js linhas 501-563
 */
export async function downloadParte(parteId, request, env, user) {
  try {
    const parte = await env.DB.prepare(`
      SELECT p.*, pt.titulo as partitura_titulo, pt.id as partitura_id
      FROM partes p
      JOIN partituras pt ON p.partitura_id = pt.id
      WHERE p.id = ? AND pt.ativo = 1
    `).bind(parteId).first();

    if (!parte) {
      return errorResponse('Parte não encontrada', 404, request);
    }

    const arquivo = await env.BUCKET.get(parte.arquivo_nome);

    if (!arquivo) {
      return errorResponse('Arquivo não encontrado no storage', 404, request);
    }

    // Incrementa downloads da partitura
    await env.DB.prepare(
      'UPDATE partituras SET downloads = downloads + 1 WHERE id = ?'
    ).bind(parte.partitura_id).run();

    // Registra atividade de download
    await registrarAtividade(env, 'download', parte.partitura_titulo, parte.instrumento, user.id);

    // Log de download
    try {
      await env.DB.prepare(
        'INSERT INTO logs_download (partitura_id, instrumento_id, ip) VALUES (?, NULL, ?)'
      ).bind(parte.partitura_id, request.headers.get('CF-Connecting-IP')).run();
    } catch (logError) {
      console.error('Erro ao registrar log:', logError);
    }

    const nomeArquivo = `${parte.partitura_titulo} - ${parte.instrumento}.pdf`;

    // Usa Content-Disposition: inline quando requisicao eh AJAX (X-Requested-With)
    // Isso evita que gerenciadores de download (IDM, etc) interceptem a requisicao
    const isAjaxRequest = request.headers.get('X-Requested-With') === 'XMLHttpRequest';
    const disposition = isAjaxRequest ? 'inline' : 'attachment';

    return new Response(arquivo.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename="${nomeArquivo}"`,
        // Cache-Control para evitar re-downloads desnecessarios
        'Cache-Control': 'private, max-age=300',
        ...getCorsHeaders(request),
      },
    });
  } catch (error) {
    return errorResponse('Erro no download', 500, request);
  }
}
