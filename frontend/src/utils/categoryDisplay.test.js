import { describe, expect, test } from '@jest/globals';
import { getSingularCategoryName } from '../../shared/categoryDisplay.js';

describe('getSingularCategoryName', () => {
  test.each([
    ['Dobrados', 'Dobrado'],
    ['Marchas', 'Marcha'],
    ['Marchas Fúnebres', 'Marcha Fúnebre'],
    ['Marchas Religiosas', 'Marcha Religiosa'],
    ['Fantasias', 'Fantasia'],
    ['Polacas', 'Polaca'],
    ['Boleros', 'Bolero'],
    ['Valsas', 'Valsa'],
    ['Arranjos', 'Arranjo'],
    ['Hinos', 'Hino'],
    ['Hinos Cívicos', 'Hino Cívico'],
    ['Hinos Religiosos', 'Hino Religioso'],
    ['Prelúdios', 'Prelúdio']
  ])('converte %s apenas para exibição compartilhada', (plural, singular) => {
    expect(getSingularCategoryName(plural)).toBe(singular);
  });

  test('mantém uma categoria desconhecida sem tentar alterar o cadastro', () => {
    expect(getSingularCategoryName('Música Popular')).toBe('Música Popular');
  });
});
