// ===== SHEET DETAIL MODAL TESTS =====
// Testes do modal de detalhes da partitura
// Seguindo o guia: testes comportamentais com roles e acessibilidade
// Usa mocks de modulos ESM para contextos

import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// ===== MOCKS DOS CONTEXTOS =====
// Devem ser definidos ANTES de importar o componente

const mockUser = {
  id: 1,
  username: 'joao.silva',
  nome: 'Joao Silva',
  instrument: 'Trompete Bb',
  instrumentoNormalizado: 'trompete',
  isAdmin: false
};

const mockSetSelectedSheet = jest.fn();
const mockShowToast = jest.fn();
const mockToggleFavorite = jest.fn();

let mockSelectedSheet = null;
let mockFavorites = [];

// Mock de categorias para testes
const mockCategoriesMap = new Map([
  ['dobrados', { id: 'dobrados', name: 'Dobrados' }],
  ['marchas', { id: 'marchas', name: 'Marchas' }],
  ['marcha', { id: 'marcha', name: 'Marchas' }] // fallback para testes legados
]);

// Mock do AuthContext
jest.unstable_mockModule('@contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: jest.fn()
  }),
  AuthProvider: ({ children }) => children
}));

// Mock do UIContext
jest.unstable_mockModule('@contexts/UIContext', () => ({
  useUI: () => ({
    selectedSheet: mockSelectedSheet,
    setSelectedSheet: mockSetSelectedSheet,
    showToast: mockShowToast,
    sidebarCollapsed: false,
    setSidebarCollapsed: jest.fn()
  }),
  UIProvider: ({ children }) => children
}));

// Mock do DataContext
jest.unstable_mockModule('@contexts/DataContext', () => ({
  useData: () => ({
    favorites: mockFavorites,
    toggleFavorite: mockToggleFavorite,
    sheets: [],
    isLoading: false,
    categoriesMap: mockCategoriesMap
  }),
  DataProvider: ({ children }) => children
}));

// Mock do useSheetDownload
jest.unstable_mockModule('@hooks/useSheetDownload', () => ({
  useSheetDownload: () => ({
    downloading: false,
    confirmInstrument: null,
    selectedParte: null,
    showPartePicker: false,
    partesDisponiveis: [],
    downloadParteDireta: jest.fn(),
    handleSelectInstrument: jest.fn(),
    handleSelectParteEspecifica: jest.fn(),
    handleConfirmDownload: jest.fn(),
    handleCancelDownload: jest.fn(),
    closePartePicker: jest.fn()
  })
}));

// Nota: fetch e mockado pelo MSW no jest.setup.js

// ===== IMPORTACOES APOS MOCKS =====
const { render, screen, waitFor } = await import('@testing-library/react');
const { default: userEvent } = await import('@testing-library/user-event');
const { MemoryRouter } = await import('react-router-dom');
const { default: SheetDetailModal } = await import('./SheetDetailModal');

// ===== HELPERS =====

const createMockSheet = (overrides = {}) => ({
  id: 1,
  title: 'Dobrado Teste',
  composer: 'Estevam Moura',
  category: 'dobrados',
  year: 2020,
  downloads: 100,
  featured: false,
  ...overrides
});

const renderModal = () => {
  return render(
    <MemoryRouter initialEntries={['/acervo/dobrados']}>
      <SheetDetailModal />
    </MemoryRouter>
  );
};

// ===== TESTS =====

describe('SheetDetailModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelectedSheet = null;
    mockFavorites = [];
  });

  describe('Renderizacao', () => {
    test('nao renderiza quando selectedSheet e null', () => {
      mockSelectedSheet = null;
      renderModal();

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('renderiza modal quando selectedSheet existe', async () => {
      mockSelectedSheet = createMockSheet();
      renderModal();

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    test('exibe titulo da partitura', async () => {
      mockSelectedSheet = createMockSheet({ title: 'Marcha Soldado' });
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('Marcha Soldado')).toBeInTheDocument();
      });
    });

    test('exibe compositor da partitura', async () => {
      mockSelectedSheet = createMockSheet({ composer: 'Heitor Villa-Lobos' });
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('Heitor Villa-Lobos')).toBeInTheDocument();
      });
    });

    test('exibe categoria da partitura', async () => {
      // 'marcha' (singular) mapeia para 'Marchas' no CATEGORIES_MAP
      mockSelectedSheet = createMockSheet({ category: 'marcha' });
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('Marchas')).toBeInTheDocument();
      });
    });
  });

  describe('Botao de Fechar', () => {
    test('tem botao de fechar acessivel', async () => {
      mockSelectedSheet = createMockSheet();
      renderModal();

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /fechar/i });
        expect(closeButton).toBeInTheDocument();
      });
    });

    test('fecha modal ao clicar no botao X', async () => {
      const user = userEvent.setup();
      mockSelectedSheet = createMockSheet();
      renderModal();

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /fechar/i });
      await user.click(closeButton);

      expect(mockSetSelectedSheet).toHaveBeenCalledWith(null);
    });
  });

  describe('Botao de Download', () => {
    test('exibe botao de download com instrumento do usuario', async () => {
      mockSelectedSheet = createMockSheet();
      renderModal();

      await waitFor(() => {
        const downloadButton = screen.getByRole('button', { name: /baixar partitura para trompete/i });
        expect(downloadButton).toBeInTheDocument();
      });
    });

    test('exibe \"Meu Instrumento\" no botao de download', async () => {
      mockSelectedSheet = createMockSheet();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('Meu Instrumento')).toBeInTheDocument();
        expect(screen.getByText('Trompete Bb')).toBeInTheDocument();
      });
    });
  });

  describe('Botao de Favoritar', () => {
    test('exibe botao de adicionar aos favoritos quando nao favoritado', async () => {
      mockSelectedSheet = createMockSheet({ id: 1 });
      mockFavorites = [];
      renderModal();

      await waitFor(() => {
        const favButton = screen.getByRole('button', { name: /adicionar.*favoritos/i });
        expect(favButton).toBeInTheDocument();
      });
    });

    test('exibe botao de remover dos favoritos quando favoritado', async () => {
      mockSelectedSheet = createMockSheet({ id: 1 });
      mockFavorites = [1];
      renderModal();

      await waitFor(() => {
        const favButton = screen.getByRole('button', { name: /remover.*favoritos/i });
        expect(favButton).toBeInTheDocument();
      });
    });

    test('chama toggleFavorite ao clicar no botao', async () => {
      const user = userEvent.setup();
      mockSelectedSheet = createMockSheet({ id: 42 });
      mockFavorites = [];
      renderModal();

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const favButton = screen.getByRole('button', { name: /adicionar.*favoritos/i });
      await user.click(favButton);

      expect(mockToggleFavorite).toHaveBeenCalledWith(42);
    });

    test('botao tem aria-pressed correto', async () => {
      // Nao favoritado
      mockSelectedSheet = createMockSheet({ id: 1 });
      mockFavorites = [];
      const { unmount } = renderModal();

      await waitFor(() => {
        const favButton = screen.getByRole('button', { name: /adicionar.*favoritos/i });
        expect(favButton).toHaveAttribute('aria-pressed', 'false');
      });
      unmount();

      // Favoritado
      mockFavorites = [1];
      renderModal();

      await waitFor(() => {
        const favButton = screen.getByRole('button', { name: /remover.*favoritos/i });
        expect(favButton).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });

  describe('Seletor de Instrumentos', () => {
    test('exibe botao para escolher outro instrumento', async () => {
      mockSelectedSheet = createMockSheet();
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('Outro Instrumento')).toBeInTheDocument();
      });
    });

    test('botao tem aria-expanded para acessibilidade', async () => {
      mockSelectedSheet = createMockSheet();
      renderModal();

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /outro instrumento/i });
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('Informacoes da Partitura', () => {
    test('exibe numero de downloads', async () => {
      mockSelectedSheet = createMockSheet({ downloads: 150 });
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('150')).toBeInTheDocument();
      });
    });

    test('exibe ano da partitura', async () => {
      mockSelectedSheet = createMockSheet({ year: 1925 });
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('1925')).toBeInTheDocument();
      });
    });

    test('exibe badge de destaque quando featured', async () => {
      mockSelectedSheet = createMockSheet({ featured: true });
      renderModal();

      await waitFor(() => {
        expect(screen.getByText('Destaque')).toBeInTheDocument();
      });
    });

    test('nao exibe badge de destaque quando nao featured', async () => {
      mockSelectedSheet = createMockSheet({ featured: false });
      renderModal();

      await waitFor(() => {
        expect(screen.queryByText('Destaque')).not.toBeInTheDocument();
      });
    });
  });

  describe('Acessibilidade', () => {
    test('modal tem role=\"dialog\"', async () => {
      mockSelectedSheet = createMockSheet();
      renderModal();

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    test('modal tem aria-modal=\"true\"', async () => {
      mockSelectedSheet = createMockSheet();
      renderModal();

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toHaveAttribute('aria-modal', 'true');
      });
    });

    test('modal tem aria-labelledby apontando para titulo', async () => {
      mockSelectedSheet = createMockSheet();
      renderModal();

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toHaveAttribute('aria-labelledby', 'sheet-detail-title');
      });
    });
  });
});
