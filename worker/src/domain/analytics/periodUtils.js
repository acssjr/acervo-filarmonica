const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MIN_PROJECTION_DAYS = 3;

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function parseDateOnly(value, label) {
  if (!DATE_ONLY_PATTERN.test(value)) {
    throw new Error(`${label} inválida`);
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || formatDate(date) !== value) {
    throw new Error(`${label} inválida`);
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
    throw new Error('Data de fim deve ser posterior à data de início');
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
