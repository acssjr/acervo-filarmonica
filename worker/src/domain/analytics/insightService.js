const MIN_REHEARSALS_FOR_ALERT = 2;
const DROP_THRESHOLD = 10;

function numberOrNull(value) {
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function percentageDelta(current, previous) {
  if (previous === null || previous === 0 || current === null) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function buildPresenceDrop(atual, comparacao, amostras) {
  const currentRate = numberOrNull(atual?.attendance?.resumo?.taxa_media);
  const previousRate = numberOrNull(comparacao?.attendance?.resumo?.taxa_media);
  const currentRehearsals = numberOrNull(
    amostras?.ensaios_atual ?? atual?.attendance?.resumo?.ensaios_realizados
  ) || 0;
  const previousRehearsals = numberOrNull(
    amostras?.ensaios_comparacao ?? comparacao?.attendance?.resumo?.ensaios_realizados
  ) || 0;
  if (
    currentRate === null ||
    previousRate === null ||
    currentRehearsals < MIN_REHEARSALS_FOR_ALERT ||
    previousRehearsals < MIN_REHEARSALS_FOR_ALERT
  ) return null;

  const delta = currentRate - previousRate;
  if (delta > -DROP_THRESHOLD) return null;

  return {
    id: 'queda_presenca',
    tipo: 'alerta',
    titulo: 'A presença caiu no período',
    descricao: `A presença média caiu de ${previousRate}% para ${currentRate}% (${delta} p.p.).`,
    severidade: delta <= -20 ? 'alta' : 'media',
    evidencias: {
      atual: currentRate,
      comparacao: previousRate,
      delta,
      ensaios_atual: currentRehearsals,
      ensaios_comparacao: previousRehearsals,
    },
    confianca: currentRehearsals >= 4 && previousRehearsals >= 4 ? 'alta' : 'media',
  };
}

function buildAccessDrop(atual, comparacao, amostras) {
  const currentAccess = numberOrNull(atual?.sheets?.resumo?.acessos_pdf);
  const previousAccess = numberOrNull(comparacao?.sheets?.resumo?.acessos_pdf);
  const currentSamples = numberOrNull(amostras?.acessos_atual ?? atual?.sheets?.resumo?.partituras_com_acao) || 0;
  const previousSamples = numberOrNull(amostras?.acessos_comparacao ?? comparacao?.sheets?.resumo?.partituras_com_acao) || 0;
  if (currentAccess === null || previousAccess === null || previousAccess === 0) return null;
  if (currentSamples < 1 || previousSamples < 1) return null;
  const delta = percentageDelta(currentAccess, previousAccess);
  if (delta === null || delta > -DROP_THRESHOLD) return null;

  return {
    id: 'queda_acessos',
    tipo: 'alerta',
    titulo: 'Os acessos às partituras estão em queda',
    descricao: `Os acessos a PDFs caíram ${Math.abs(delta)}% em relação ao período comparável.`,
    severidade: delta <= -25 ? 'alta' : 'media',
    evidencias: {
      atual: currentAccess,
      comparacao: previousAccess,
      delta,
      partituras_atual: currentSamples,
      partituras_comparacao: previousSamples,
    },
    confianca: currentAccess >= 10 && previousAccess >= 10 ? 'alta' : 'media',
  };
}

function buildRecognition(atual) {
  const insights = [];
  const topEngagement = atual?.engagement?.ranking?.[0];
  if (topEngagement) {
    insights.push({
      id: 'destaque_engajamento',
      tipo: 'reconhecimento',
      titulo: 'Quem mais movimentou o acervo',
      descricao: `${topEngagement.nome} realizou ${topEngagement.total_acoes} ações úteis no período.`,
      severidade: 'info',
      evidencias: {
        usuario_id: topEngagement.id,
        nome: topEngagement.nome,
        total_acoes: topEngagement.total_acoes,
      },
      confianca: 'alta',
    });
  }

  const topAttendance = atual?.attendance?.ranking?.find((item) => item.estado === 'com_dados');
  if (topAttendance) {
    insights.push({
      id: 'destaque_assiduidade',
      tipo: 'reconhecimento',
      titulo: 'Maior assiduidade nos ensaios',
      descricao: `${topAttendance.nome} esteve presente em ${topAttendance.taxa}% dos ensaios.`,
      severidade: 'info',
      evidencias: {
        usuario_id: topAttendance.id,
        nome: topAttendance.nome,
        taxa: topAttendance.taxa,
        presencas: topAttendance.presencas,
        ensaios: topAttendance.ensaios,
      },
      confianca: topAttendance.ensaios >= 3 ? 'alta' : 'media',
    });
  }
  return insights;
}

export function buildAnalyticsInsights({ atual = {}, comparacao = {}, amostras = {} }) {
  const alerts = [
    buildPresenceDrop(atual, comparacao, amostras),
    buildAccessDrop(atual, comparacao, amostras),
  ].filter(Boolean);

  return [...alerts, ...buildRecognition(atual)];
}
