import { env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
import { getAuditActivitiesData } from '../src/domain/auditoria/auditService.js';

describe('audit service', () => {
  beforeAll(async () => {
    await env.DB.prepare(`
      INSERT INTO atividades (tipo, titulo, detalhes, usuario_id, criado_em)
      VALUES
        ('update_partitura', 'Auditoria válida', 'Título atualizado', 1, '2099-05-10 10:00:00'),
        ('download', 'Ação comum', 'Não deve aparecer', 2, '2099-05-10 10:01:00')
    `).run();
  });

  it('retorna somente atividades administrativas e aplica paginação', async () => {
    const data = await getAuditActivitiesData(
      env,
      '2099-05-01',
      '2099-06-01',
      new URL('https://test.local/api/admin/auditoria?atividades_limit=1')
    );

    expect(data.total).toBe(1);
    expect(data.atividades).toEqual([
      expect.objectContaining({ tipo: 'update_partitura', usuario_id: 1 }),
    ]);
    expect(data.usuarios).toEqual([
      expect.objectContaining({ id: 1, nome: 'Administrador' }),
    ]);
  });
});
