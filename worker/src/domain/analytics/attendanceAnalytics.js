const VALID_FAMILIES = ['Madeiras', 'Metais', 'Percussão'];
const FAMILY_FILTER = `i.familia IN ('Madeiras', 'Metais', 'Percussão')`;
const ELIGIBLE_USER_FILTER = `
  u.ativo = 1
  AND u.admin = 0
  AND COALESCE(u.convidado, 0) = 0
`;

const emptyResults = (result) => result?.results || [];

function toNumber(value) {
  return Number(value || 0);
}

async function queryUsers(env) {
  const result = await env.DB.prepare(`
    SELECT u.id, u.nome, u.foto_url, i.nome as instrumento, i.familia
    FROM usuarios u
    JOIN instrumentos i ON i.id = u.instrumento_id
    WHERE ${ELIGIBLE_USER_FILTER}
      AND ${FAMILY_FILTER}
    ORDER BY u.nome COLLATE NOCASE ASC
  `).all();

  return emptyResults(result);
}

async function queryRehearsals(env, start, end) {
  const result = await env.DB.prepare(`
    SELECT DISTINCT p.data_ensaio
    FROM presencas p
    JOIN usuarios u ON u.id = p.usuario_id
    JOIN instrumentos i ON i.id = u.instrumento_id
    WHERE p.data_ensaio >= ? AND p.data_ensaio < ?
      AND ${ELIGIBLE_USER_FILTER}
      AND ${FAMILY_FILTER}
    ORDER BY p.data_ensaio ASC
  `).bind(start, end).all();

  return emptyResults(result).map((item) => item.data_ensaio);
}

async function queryAttendanceRows(env, start, end) {
  const result = await env.DB.prepare(`
    SELECT DISTINCT p.usuario_id, p.data_ensaio
    FROM presencas p
    JOIN usuarios u ON u.id = p.usuario_id
    JOIN instrumentos i ON i.id = u.instrumento_id
    WHERE p.data_ensaio >= ? AND p.data_ensaio < ?
      AND ${ELIGIBLE_USER_FILTER}
      AND ${FAMILY_FILTER}
  `).bind(start, end).all();

  return emptyResults(result);
}

function summarize(users, rehearsals, rows) {
  const expected = users.length * rehearsals.length;
  const presencas = rows.length;

  return {
    ensaios_realizados: rehearsals.length,
    presencas_total: presencas,
    presencas_esperadas: expected,
    taxa_media: expected ? Math.round((presencas / expected) * 100) : null,
    musicos_com_presenca: new Set(rows.map((row) => row.usuario_id)).size,
    sem_ensaios: rehearsals.length === 0,
  };
}

function buildRanking(users, rehearsals, rows) {
  const rehearsalCount = rehearsals.length;
  const countByUser = new Map();
  for (const row of rows) {
    countByUser.set(row.usuario_id, (countByUser.get(row.usuario_id) || 0) + 1);
  }

  const sorted = users
    .map((user) => {
      const presencas = countByUser.get(user.id) || 0;
      return {
        ...user,
        presencas,
        ensaios: rehearsalCount,
        taxa: rehearsalCount ? Math.round((presencas / rehearsalCount) * 100) : null,
        estado: rehearsalCount ? 'com_dados' : 'sem_ensaios',
      };
    })
    .sort((a, b) => {
      if (a.taxa === null && b.taxa !== null) return 1;
      if (a.taxa !== null && b.taxa === null) return -1;
      if ((b.taxa || 0) !== (a.taxa || 0)) return (b.taxa || 0) - (a.taxa || 0);
      if (b.presencas !== a.presencas) return b.presencas - a.presencas;
      return a.nome.localeCompare(b.nome, 'pt-BR');
    });

  let previousKey = null;
  let previousPosition = 0;
  return sorted.map((item, index) => {
    const key = `${item.taxa}:${item.presencas}`;
    const posicao = key === previousKey ? previousPosition : index + 1;
    previousKey = key;
    previousPosition = posicao;
    return { ...item, posicao };
  });
}

function buildFamilySummary(users, rehearsals, rows) {
  return VALID_FAMILIES.map((familia) => {
    const familyUsers = users.filter((user) => user.familia === familia);
    const familyUserIds = new Set(familyUsers.map((user) => user.id));
    const familyPresences = rows.filter((row) => familyUserIds.has(row.usuario_id)).length;
    const expected = familyUsers.length * rehearsals.length;
    return {
      familia,
      musicos: familyUsers.length,
      ensaios: rehearsals.length,
      presencas: familyPresences,
      esperadas: expected,
      taxa: expected ? Math.round((familyPresences / expected) * 100) : null,
      estado: rehearsals.length ? 'com_dados' : 'sem_ensaios',
    };
  });
}

async function queryTrend(env, start, end) {
  const result = await env.DB.prepare(`
    SELECT p.data_ensaio as data, COUNT(DISTINCT p.usuario_id) as presentes
    FROM presencas p
    JOIN usuarios u ON u.id = p.usuario_id
    JOIN instrumentos i ON i.id = u.instrumento_id
    WHERE p.data_ensaio >= ? AND p.data_ensaio < ?
      AND ${ELIGIBLE_USER_FILTER}
      AND ${FAMILY_FILTER}
    GROUP BY p.data_ensaio
    ORDER BY p.data_ensaio ASC
  `).bind(start, end).all();
  return emptyResults(result).map((item) => ({ ...item, presentes: toNumber(item.presentes) }));
}

export async function getAttendanceAnalytics(env, period) {
  const users = await queryUsers(env);
  const rehearsals = await queryRehearsals(env, period.atual.inicio, period.atual.fim);
  const rows = await queryAttendanceRows(env, period.atual.inicio, period.atual.fim);
  const previousRehearsals = await queryRehearsals(env, period.comparacao.inicio, period.comparacao.fim);
  const previousRows = await queryAttendanceRows(env, period.comparacao.inicio, period.comparacao.fim);

  return {
    resumo: summarize(users, rehearsals, rows),
    ranking: buildRanking(users, rehearsals, rows),
    naipes: buildFamilySummary(users, rehearsals, rows),
    tendencia: await queryTrend(env, period.atual.inicio, period.atual.fim),
    amostra: {
      ensaios_atual: rehearsals.length,
      ensaios_comparacao: previousRehearsals.length,
      presencas_atual: rows.length,
      presencas_comparacao: previousRows.length,
    },
    comparacao: {
      resumo: summarize(users, previousRehearsals, previousRows),
    },
  };
}
