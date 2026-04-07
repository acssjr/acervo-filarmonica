import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockNavigate = jest.fn();
const mockToggleFavorite = jest.fn();
const mockTrackSearch = jest.fn(() => Promise.resolve());
const mockTrackEvent = jest.fn();

let mockSheets = [];
let mockCategoriesMap = new Map();
let mockDebouncedValue;

jest.unstable_mockModule('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

jest.unstable_mockModule('@contexts/DataContext', () => ({
  useData: () => ({
    sheets: mockSheets,
    favoritesSet: new Set(),
    toggleFavorite: mockToggleFavorite,
    categoriesMap: mockCategoriesMap
  })
}));

jest.unstable_mockModule('@hooks/useDebounce', () => ({
  default: (value) => (mockDebouncedValue === undefined ? value : mockDebouncedValue)
}));

jest.unstable_mockModule('@services/api', () => ({
  API: {
    trackSearch: mockTrackSearch,
    trackEvent: mockTrackEvent
  }
}));

jest.unstable_mockModule('@components/common/Header', () => ({
  default: ({ title }) => title
}));

jest.unstable_mockModule('@components/common/CategoryIcon', () => ({
  default: () => null
}));

jest.unstable_mockModule('@constants/icons', () => ({
  Icons: {
    Search: () => null,
    Heart: () => null
  }
}));

const { default: SearchScreen } = await import('./SearchScreen.jsx');

describe('SearchScreen tracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDebouncedValue = undefined;
    mockCategoriesMap = new Map([
      ['dobrados', { id: 'dobrados', name: 'Dobrados' }]
    ]);
    mockSheets = [
      {
        id: '1',
        title: 'Azul da Cor do Mar',
        composer: 'Tim Maia',
        category: 'dobrados'
      },
      {
        id: '2',
        title: 'Marcha Um',
        composer: 'Banda',
        category: 'dobrados'
      },
      {
        id: '3',
        title: 'Marcha Dois',
        composer: 'Banda',
        category: 'dobrados'
      }
    ];
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('nao registra busca digitada ate o debounce corresponder ao termo atual', () => {
    jest.useFakeTimers();
    mockDebouncedValue = 'Azul';

    const { rerender } = render(<SearchScreen />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Marcha' } });
    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(mockTrackEvent).not.toHaveBeenCalledWith(expect.objectContaining({
      tipo: 'busca_digitada',
      termo_original: 'Marcha'
    }));

    mockDebouncedValue = 'Marcha';
    rerender(<SearchScreen />);
    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(mockTrackEvent).toHaveBeenCalledWith(expect.objectContaining({
      tipo: 'busca_digitada',
      termo_original: 'Marcha',
      resultados_count: 2
    }));
  });

  test('reseta dedupe de busca realizada quando a busca e limpa', () => {
    jest.useFakeTimers();

    render(<SearchScreen />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Azul' } });
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.change(input, { target: { value: 'Azul' } });
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockTrackSearch).toHaveBeenCalledTimes(2);
  });
});
