// worker/src/domain/partituras/downloadService.js
import { errorResponse, getCorsHeaders } from '../../infrastructure/index.js';
import { registrarAtividade } from '../atividades/index.js';
import { createPostHogClient, shutdownPostHog } from '../../infrastructure/posthog/posthogClient.js';

/**
 * Download de partitura - REQUER AUTENTICAÇÃO
 *
 * Extraido de: worker/index.js linhas 450-499
 */
export async function downloadPartitura(id, request, env, user) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const userIsAdmin = user?.admin === 1 || user?._isAdmin === true;
    const isAdmin = action === 'admin' && userIsAdmin;
    const isView = action === 'view';

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

    if (!isAdmin) {
      if (!isView) {
        await env.DB.prepare(
          'UPDATE partituras SET downloads = downloads + 1 WHERE id = ?'
        ).bind(id).run();
      }

      // Registra atividade diferenciada
      await registrarAtividade(env, isView ? 'visualizacao' : 'download', partitura.titulo, null, user.id);

      // Log de download
      if (!isView) {
        try {
          await env.DB.prepare(
            'INSERT INTO logs_download (partitura_id, instrumento_id, ip, usuario_id) VALUES (?, NULL, ?, ?)'
          ).bind(id, request.headers.get('CF-Connecting-IP'), user.id).run();
        } catch (logError) {
          console.error('Erro ao registrar log:', logError);
        }
      }
    }

    if (!isAdmin) {
      try {
        const posthog = createPostHogClient(env);
        if (posthog) {
          posthog.capture({
            distinctId: `user_${user.id}`,
            event: 'partitura_downloaded',
            properties: {
              partitura_id: id,
              partitura_titulo: partitura.titulo,
              compositor: partitura.compositor,
              is_view: isView,
            },
          });
          await shutdownPostHog(posthog);
        }
      } catch (e) {
        console.error('PostHog capture failed:', e);
      }
    }

    const disposition = isView ? 'inline' : 'attachment';

    return new Response(arquivo.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename="${partitura.titulo}.pdf"`,
        ...getCorsHeaders(request, env),
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

    // Verifica o tipo de ação: admin (sem tracking), view (visualização), download (padrão)
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const userIsAdmin = user?.admin === 1 || user?._isAdmin === true;
    const isAdmin = action === 'admin' && userIsAdmin;
    const isView = action === 'view';

    // Admin preview: não conta nada (sem tracking, sem incremento)
    if (!isAdmin) {
      // Só incrementa downloads se for download real (não visualização)
      if (!isView) {
        await env.DB.prepare(
          'UPDATE partituras SET downloads = downloads + 1 WHERE id = ?'
        ).bind(parte.partitura_id).run();
      }

      // Registra atividade diferenciada
      await registrarAtividade(
        env,
        isView ? 'visualizacao' : 'download',
        parte.partitura_titulo,
        parte.instrumento,
        user.id
      );

      // Log de download (apenas para downloads reais, não visualizações)
      if (!isView) {
        try {
          await env.DB.prepare(
            'INSERT INTO logs_download (partitura_id, instrumento_id, ip, usuario_id) VALUES (?, ?, ?, ?)'
          ).bind(parte.partitura_id, parte.instrumento, request.headers.get('CF-Connecting-IP'), user.id).run();
        } catch (logError) {
          console.error('Erro ao registrar log:', logError);
        }
      }
    }

    // PostHog: capture individual parte download event (skip admin previews)
    if (!isAdmin) {
      try {
        const posthog = createPostHogClient(env);
        if (posthog) {
          posthog.capture({
            distinctId: `user_${user.id}`,
            event: 'parte_downloaded',
            properties: {
              parte_id: parteId,
              partitura_id: parte.partitura_id,
              partitura_titulo: parte.partitura_titulo,
              instrumento: parte.instrumento,
              is_view: isView,
            },
          });
          await shutdownPostHog(posthog);
        }
      } catch (e) {
        console.error('PostHog capture failed:', e);
      }
    }

    const nomeArquivo = `${parte.partitura_titulo} - ${parte.instrumento}.pdf`;

    // Usa Content-Disposition: inline quando requisicao eh AJAX (X-Requested-With)
    // Isso evita que gerenciadores de download (IDM, etc) interceptem a requisicao
    const isAjaxRequest = request.headers.get('X-Requested-With') === 'XMLHttpRequest';
    const disposition = (isView || isAjaxRequest) ? 'inline' : 'attachment';

    return new Response(arquivo.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename="${nomeArquivo}"`,
        // Cache-Control: no-cache para sempre buscar versão atualizada
        // (importante quando admin substitui uma parte)
        'Cache-Control': 'private, no-cache',
        ...getCorsHeaders(request, env),
      },
    });
  } catch (error) {
    return errorResponse('Erro no download', 500, request);
  }
}
