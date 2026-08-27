import { describe, test, expect } from '@jest/globals';
import { getPostLoginDestination } from './navigation';

describe('getPostLoginDestination', () => {
  test('preserva rota, busca e hash internos', () => {
    expect(getPostLoginDestination({
      pathname: '/acervo/marchas/96',
      search: '?v=abc',
      hash: '#detalhes'
    })).toBe('/acervo/marchas/96?v=abc#detalhes');
    expect(getPostLoginDestination('/acervo/marchas/96?v=abc#detalhes'))
      .toBe('/acervo/marchas/96?v=abc#detalhes');
  });

  test.each([
    [undefined],
    ['https://site-malicioso.example'],
    ['//site-malicioso.example'],
    ['/login'],
    ['/login/'],
    ['/login?origem=compartilhamento'],
    ['/login#pin'],
    ['/login/?origem=compartilhamento#pin']
  ])('rejeita destino inseguro ou circular: %p', (destination) => {
    expect(getPostLoginDestination(destination)).toBe('/');
  });
});
