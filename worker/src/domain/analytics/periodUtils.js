const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MIN_PROJECTION_DAYS = 3;

export class AnalyticsPeriodValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AnalyticsPeriodValidationError';
  }
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function parseDateOnly(value, label) {
  if (!DATE_ONLY_PATTERN.test(value)) {
    throw new AnalyticsPeriodValidationError(`${label} inválida`);
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || formatDate(date) !== value) {
    throw new AnalyticsPeriodValidationError(`${label} inválida`);
  }

  return date;
}

function dateOnlyFromDate(value) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function addDays(date, amount) {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + amount);
  return result;
}

function daysBetween(start, end) {
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

function firstOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function firstOfNextMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
}

function previousInterval(start, duration) {
  const end = new Date(start.getTime());
  const comparisonStart = addDays(end, -duration);
  return {
    inicio: formatDate(comparisonStart),
    fim: formatDate(end),
  };
}

function comparisonInterval(start, duration) {
  if (start.getUTCDate() === 1) {
    const previousMonthStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() - 1, 1));
    return {
      inicio: formatDate(previousMonthStart),
      fim: formatDate(addDays(previousMonthStart, duration)),
    };
  }

  return previousInterval(start, duration);
}

export function projectValue(value, period) {
  const daysElapsed = Number(period?.diasDecorridos || 0);
  const daysTotal = Number(period?.diasTotais || 0);

  if (daysElapsed < MIN_PROJECTION_DAYS || daysTotal <= daysElapsed) {
    return {
      disponivel: false,
      valor: null,
      fator: null,
      confianca: 'indisponivel',
    };
  }

  const fator = daysTotal / daysElapsed;
  return {
    disponivel: true,
    valor: Math.round(Number(value || 0) * fator),
    fator,
    confianca: daysElapsed >= 10 ? 'alta' : 'media',
  };
}

export function serializeAnalyticsPeriod(period) {
  return {
    inicio: period.atual.inicio,
    fim: period.atual.fim,
    fim_solicitado: period.atual.fimSolicitado,
    dias_decorridos: period.atual.diasDecorridos,
    dias_totais: period.atual.diasTotais,
    incompleto: period.atual.incompleto,
    comparacao: period.comparacao,
    projecao: period.projecao,
  };
}

export function parseAnalyticsPeriod(url, now = new Date()) {
  const today = dateOnlyFromDate(now);
  const observedEnd = addDays(today, 1);
  const defaultStart = firstOfMonth(today);
  const defaultEnd = firstOfNextMonth(today);
  const requestedStartValue = url.searchParams.get('inicio') || formatDate(defaultStart);
  const requestedEndValue = url.searchParams.get('fim') || formatDate(defaultEnd);
  const requestedStart = parseDateOnly(requestedStartValue, 'Data de início');
  const requestedEnd = parseDateOnly(requestedEndValue, 'Data de fim');

  if (requestedEnd <= requestedStart) {
    throw new AnalyticsPeriodValidationError('Data de fim deve ser posterior à data de início');
  }

  const shouldClampToToday = requestedStart <= today && requestedEnd > observedEnd;
  const effectiveEnd = shouldClampToToday ? observedEnd : requestedEnd;
  const diasTotais = daysBetween(requestedStart, requestedEnd);
  const diasDecorridos = Math.max(0, Math.min(diasTotais, daysBetween(requestedStart, effectiveEnd)));
  const incompleto = effectiveEnd < requestedEnd;
  const comparisonDuration = incompleto ? diasDecorridos : diasTotais;
  const atual = {
    inicio: formatDate(requestedStart),
    fim: formatDate(effectiveEnd),
    fimSolicitado: formatDate(requestedEnd),
    diasDecorridos,
    diasTotais,
    incompleto,
  };
  const comparacao = comparisonInterval(requestedStart, comparisonDuration);
  const projecao = projectValue(null, atual);

  return {
    atual,
    comparacao,
    projecao,
  };
}
