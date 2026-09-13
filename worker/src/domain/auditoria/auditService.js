import { errorResponse, jsonResponse } from '../../infrastructure/index.js';
import { parseAnalyticsPeriod } from '../analytics/periodUtils.js';

export const AUDIT_ACTIVITY_TYPES = [
  'nova_partitura',
  'novo_repertorio',
  'update_repertorio',
  'delete_repertorio',
  'add_repertorio',
  'remove_repertorio',
  'reorder_repertorio',
  'update_partitura',
  'delete_partitura',
  'nova_parte',
  'update_parte',
  'delete_parte',
  'aviso_criado',
  'aviso_atualizado',
  'aviso_ativado',
  'aviso_desativado',
  'aviso_excluido'
];

const AUDIT_ACTIVITY_PLACEHOLDERS = AUDIT_ACTIVITY_TYPES.map(() => '?').join(', ');
const emptyResults = (result) => result?.results || [];

function parsePagination(url) {
  const rawLimit = Number.parseInt(url.searchParams.get('atividades_limit') ?? '', 10);
  const rawOffset = Number.parseInt(url.searchParams.get('atividades_offset') ?? '', 10);
  return {
    limit: Math.min(Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 15, 100),
    offset: Number.isFinite(rawOffset) && rawOffset > 0 ? rawOffset : 0,
  };
}

export async function getAuditActivitiesData(env, start, end, url) {
  const usuarioId = url.searchParams.get('atividade_usuario_id');
  const { limit, offset } = parsePagination(url);
  const params = [start, end, ...AUDIT_ACTIVITY_TYPES];
  const usuarioFilter = usuarioId ? 'AND a.usuario_id = ?' : '';
  if (usuarioId) params.push(usuarioId);

  const atividades = await env.DB.prepare(`
    SELECT
      a.id,
      a.tipo,
      a.titulo,
      a.detalhes,
      a.criado_em,
      u.nome as usuario_nome,
      u.id as usuario_id
    FROM atividades a
    LEFT JOIN usuarios u ON a.usuario_id = u.id
    WHERE a.criado_em >= ? AND a.criado_em < ?
      AND a.tipo IN (${AUDIT_ACTIVITY_PLACEHOLDERS})
      ${usuarioFilter}
    ORDER BY a.criado_em DESC
    LIMIT ? OFFSET ?
  `).bind(...params, limit, offset).all();

  const total = await env.DB.prepare(`
    SELECT COUNT(*) as total
    FROM atividades a
    WHERE a.criado_em >= ? AND a.criado_em < ?
      AND a.tipo IN (${AUDIT_ACTIVITY_PLACEHOLDERS})
      ${usuarioFilter}
  `).bind(...params).first();

  const usuarios = await env.DB.prepare(`
    SELECT DISTINCT u.id, u.nome
    FROM atividades a
    JOIN usuarios u ON u.id = a.usuario_id
    WHERE a.criado_em >= ? AND a.criado_em < ?
      AND a.tipo IN (${AUDIT_ACTIVITY_PLACEHOLDERS})
      AND u.admin = 1
    ORDER BY u.nome ASC
  `).bind(start, end, ...AUDIT_ACTIVITY_TYPES).all();

  return {
    usuarios: emptyResults(usuarios),
    atividades: emptyResults(atividades),
    total: Number(total?.total || 0),
  };
}

export async function getAuditActivities(request, env) {
  try {
    const url = new URL(request.url);
    const period = parseAnalyticsPeriod(url);
    const data = await getAuditActivitiesData(env, period.atual.inicio, period.atual.fim, url);
    return jsonResponse({ periodo: period, ...data }, 200, request);
  } catch (error) {
    console.error('Audit activities error:', error);
    return errorResponse('Erro ao carregar auditoria', 500, request);
  }
}
