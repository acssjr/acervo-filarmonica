import { describe, expect, test } from '@jest/globals';
import { resolveNotificationDestination } from './notificationNavigation';

const sheets = [
  { id: '42', title: 'Coisa nº 1', category: 'arranjos' },
  { id: '84', title: 'Marcha Única', category: 'marchas' }
];

describe('resolveNotificationDestination', () => {
  test('abre a partitura exata usando o ID persistido', () => {
    expect(resolveNotificationDestination({
      type: 'nova_parte',
      title: 'Título antigo',
      entityType: 'partitura',
      entityId: 42
    }, sheets)).toBe('/acervo/arranjos/42');
  });

  test('abre a tela de repertório para atividades de repertório', () => {
    expect(resolveNotificationDestination({
      type: 'update_repertorio',
      entityType: 'repertorio',
      entityId: 7
    }, sheets)).toBe('/repertorio');
  });

  test('mantém compatibilidade quando o título antigo tem uma única correspondência', () => {
    expect(resolveNotificationDestination({
      type: 'nova_partitura',
      title: 'marcha unica'
    }, sheets)).toBe('/acervo/marchas/84');
  });

  test('não escolhe arbitrariamente quando títulos antigos estão duplicados', () => {
    const duplicates = [
      ...sheets,
      { id: '85', title: 'Marcha Única', category: 'dobrados' }
    ];

    expect(resolveNotificationDestination({
      type: 'nova_parte',
      title: 'Marcha Única'
    }, duplicates)).toBe('/acervo');
  });

  test('usa a tela geral quando o destino não existe mais', () => {
    expect(resolveNotificationDestination({
      type: 'nova_partitura',
      entityType: 'partitura',
      entityId: 999
    }, sheets)).toBe('/acervo');
  });
});
