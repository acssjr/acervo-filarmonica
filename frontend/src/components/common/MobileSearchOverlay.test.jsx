import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockNavigate = jest.fn();
const mockSetMobileSearchOpen = jest.fn();
const mockSetActiveTab = jest.fn();
const mockSetGlobalSearch = jest.fn();
const mockTrackSearch = jest.fn(() => Promise.resolve());
const mockTrackEvent = jest.fn();

let mockMobileSearchOpen = true;
let mockTheme = 'dark';
let mockSheets = [];
let mockCategoriesMap = new Map();
let mockDebouncedValue;

jest.unstable_mockModule('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

jest.unstable_mockModule('@contexts/UIContext', () => ({
  useUI: () => ({
    mobileSearchOpen: mockMobileSearchOpen,
    setMobileSearchOpen: mockSetMobileSearchOpen,
    theme: mockTheme
  })
}));

jest.unstable_mockModule('@contexts/DataContext', () => ({
  useData: () => ({
    sheets: mockSheets,
    categoriesMap: mockCategoriesMap,
    setActiveTab: mockSetActiveTab,
    setSearchQuery: mockSetGlobalSearch
  })
}));

jest.unstable_mockModule('@hooks/useScrollLock', () => ({
  useScrollLock: () => {}
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

jest.unstable_mockModule('@components/common/CategoryIcon', () => ({
  default: () => null
}));

jest.unstable_mockModule('@constants/icons', () => ({
  Icons: {
    Search: () => null,
    Close: () => null,
    ChevronRight: () => null
  }
}));

jest.unstable_mockModule('gsap', () => ({
  default: {
    registerPlugin: jest.fn(),
    set: jest.fn(),
    to: jest.fn(),
    fromTo: jest.fn(),
    killTweensOf: jest.fn()
  }
}));

jest.unstable_mockModule('@gsap/react', async () => {
  const React = await import('react');

  return {
    useGSAP: (callback) => {
      React.useLayoutEffect(() => {
        callback?.();
      }, [callback]);
    }
  };
});

const { default: MobileSearchOverlay } = await import('./MobileSearchOverlay.jsx');

describe('MobileSearchOverlay', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSetMobileSearchOpen.mockClear();
    mockSetActiveTab.mockClear();
    mockSetGlobalSearch.mockClear();
    mockTrackSearch.mockClear();
    mockTrackEvent.mockClear();

    mockMobileSearchOpen = true;
    mockTheme = 'dark';
    mockDebouncedValue = undefined;
    mockCategoriesMap = new Map([
      ['dobrados', { id: 'dobrados', name: 'Dobrados' }]
    ]);
    mockSheets = [{
      id: '123',
      title: 'Azul da Cor do Mar',
      composer: 'Tim Maia',
      category: 'dobrados',
      featured: true
    }];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('ao tocar numa sugestão abre a rota da partitura em vez da tela de busca', () => {
    render(<MobileSearchOverlay />);

    fireEvent.click(screen.getByText('Azul da Cor do Mar'));

    expect(mockSetMobileSearchOpen).toHaveBeenCalledWith(false);
    expect(mockSetGlobalSearch).toHaveBeenCalledWith('Azul da Cor do Mar');
    expect(mockSetActiveTab).toHaveBeenCalledWith('library');
    expect(mockNavigate).toHaveBeenCalledWith('/acervo/dobrados/123');
    expect(mockNavigate).not.toHaveBeenCalledWith('/buscar?q=Azul%20da%20Cor%20do%20Mar');
  });

  test('ao tocar num resultado filtrado normaliza a categoria e abre a rota da partitura', () => {
    render(<MobileSearchOverlay />);

    fireEvent.change(
      screen.getByPlaceholderText('Buscar partituras, compositores...'),
      { target: { value: 'Azul' } }
    );
    fireEvent.click(screen.getByText('Azul da Cor do Mar'));

    expect(mockSetMobileSearchOpen).toHaveBeenCalledWith(false);
    expect(mockSetGlobalSearch).toHaveBeenCalledWith('Azul da Cor do Mar');
    expect(mockSetActiveTab).toHaveBeenCalledWith('library');
    expect(mockNavigate).toHaveBeenCalledWith('/acervo/dobrados/123');
    expect(mockNavigate).not.toHaveBeenCalledWith('/acervo/[object Object]/123');
  });

  test('envia total bruto de resultados no tracking mesmo renderizando só oito itens', () => {
    jest.useFakeTimers();
    mockSheets = Array.from({ length: 9 }, (_, index) => ({
      id: String(index + 1),
      title: `Azul da Cor do Mar ${index + 1}`,
      composer: 'Tim Maia',
      category: 'dobrados',
      featured: false
    }));

    render(<MobileSearchOverlay />);

    fireEvent.change(
      screen.getByPlaceholderText('Buscar partituras, compositores...'),
      { target: { value: 'Azul' } }
    );
    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(mockTrackEvent).toHaveBeenCalledWith(expect.objectContaining({
      tipo: 'busca_digitada',
      resultados_count: 9
    }));

    jest.useRealTimers();
  });

  test('nao registra busca digitada ate o debounce corresponder ao termo atual', () => {
    jest.useFakeTimers();
    mockDebouncedValue = 'Azul';
    mockSheets = [
      {
        id: '1',
        title: 'Azul da Cor do Mar',
        composer: 'Tim Maia',
        category: 'dobrados',
        featured: false
      },
      {
        id: '2',
        title: 'Marcha Um',
        composer: 'Banda',
        category: 'dobrados',
        featured: false
      },
      {
        id: '3',
        title: 'Marcha Dois',
        composer: 'Banda',
        category: 'dobrados',
        featured: false
      }
    ];

    const { rerender } = render(<MobileSearchOverlay />);

    fireEvent.change(
      screen.getByPlaceholderText('Buscar partituras, compositores...'),
      { target: { value: 'Marcha' } }
    );
    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(mockTrackEvent).not.toHaveBeenCalledWith(expect.objectContaining({
      tipo: 'busca_digitada',
      termo_original: 'Marcha'
    }));

    mockDebouncedValue = 'Marcha';
    rerender(<MobileSearchOverlay />);
    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(mockTrackEvent).toHaveBeenCalledWith(expect.objectContaining({
      tipo: 'busca_digitada',
      termo_original: 'Marcha',
      resultados_count: 2
    }));

    jest.useRealTimers();
  });

  test('reseta dedupe de busca realizada quando a busca e limpa', () => {
    jest.useFakeTimers();

    render(<MobileSearchOverlay />);

    const input = screen.getByPlaceholderText('Buscar partituras, compositores...');
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

    jest.useRealTimers();
  });
});
