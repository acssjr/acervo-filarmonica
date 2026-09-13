import {
  parseAnalyticsPeriod,
  projectValue,
} from '../src/domain/analytics/periodUtils.js';

describe('analytics period utilities', () => {
  it('compara o mês atual somente aos mesmos dias do mês anterior', () => {
    const period = parseAnalyticsPeriod(
      new URL('https://test.local/api/admin/analytics/dashboard'),
      new Date('2026-09-14T12:00:00Z')
    );

    expect(period.atual).toMatchObject({
      inicio: '2026-09-01',
      fim: '2026-09-15',
      diasDecorridos: 14,
      diasTotais: 30,
      incompleto: true,
    });
    expect(period.comparacao).toEqual({ inicio: '2026-08-01', fim: '2026-08-15' });
  });

  it('usa um intervalo imediatamente anterior de mesma duração para datas personalizadas', () => {
    const period = parseAnalyticsPeriod(
      new URL('https://test.local/api/admin/analytics/dashboard?inicio=2026-09-10&fim=2026-09-20'),
      new Date('2026-10-01T12:00:00Z')
    );

    expect(period.atual).toMatchObject({
      inicio: '2026-09-10',
      fim: '2026-09-20',
      diasDecorridos: 10,
      diasTotais: 10,
      incompleto: false,
    });
    expect(period.comparacao).toEqual({ inicio: '2026-08-31', fim: '2026-09-10' });
  });

  it('limita um período atual ainda em andamento ao dia observado', () => {
    const period = parseAnalyticsPeriod(
      new URL('https://test.local/api/admin/analytics/dashboard?inicio=2026-09-01&fim=2026-10-01'),
      new Date('2026-09-14T12:00:00Z')
    );

    expect(period.atual).toMatchObject({
      inicio: '2026-09-01',
      fim: '2026-09-15',
      diasDecorridos: 14,
      diasTotais: 30,
      incompleto: true,
    });
  });

  it('não projeta sem dias observados suficientes', () => {
    expect(projectValue(12, { diasDecorridos: 0, diasTotais: 30 }).disponivel).toBe(false);
    expect(projectValue(12, { diasDecorridos: 2, diasTotais: 30 }).disponivel).toBe(false);
  });

  it('projeta com fator explícito e confiança baseada na amostra', () => {
    expect(projectValue(140, { diasDecorridos: 14, diasTotais: 30 })).toEqual({
      disponivel: true,
      valor: 300,
      fator: 30 / 14,
      confianca: 'alta',
    });
  });
});
