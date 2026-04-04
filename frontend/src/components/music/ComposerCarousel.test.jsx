import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockNavigate = jest.fn();

jest.unstable_mockModule('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

jest.unstable_mockModule('@hooks/useInfiniteCarousel', () => ({
  useInfiniteCarousel: () => ({
    innerRef: { current: null },
    outerProps: {}
  })
}));

jest.unstable_mockModule('@hooks/usePressAnimation', () => ({
  usePressAnimation: () => ({
    ref: { current: null },
    handlers: {}
  })
}));

const { default: ComposerCarousel } = await import('./ComposerCarousel.jsx');

describe('ComposerCarousel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('leva para o compositor específico ao clicar no card', () => {
    render(
      <ComposerCarousel
        composers={[
          { name: 'Tertuliano Santos', count: 9 },
          { name: 'Amando Nobre', count: 4 }
        ]}
      />
    );

    fireEvent.click(screen.getAllByText('Tertuliano Santos')[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/compositores/tertuliano-santos');
  });

  test('mantém o botão Ver Todos apontando para a listagem geral', () => {
    render(
      <ComposerCarousel
        composers={[
          { name: 'Tertuliano Santos', count: 9 },
          { name: 'Amando Nobre', count: 4 }
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /ver todos/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/compositores');
  });
});
