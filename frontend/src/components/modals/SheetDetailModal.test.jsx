// ===== SHEET DETAIL MODAL TESTS =====
// Testes do modal de detalhes da partitura
// Seguindo o guia: testes comportamentais com roles e acessibilidade
// Usa mocks de modulos ESM para contextos

import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { http, HttpResponse } from 'msw';
import { server } from '../../__tests__/mocks/server.js';

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
let mockFavoritesSet = new Set();

// Mock de categorias para testes
const mockCategoriesMap = new Map([
  ['dobrados', { id: 'dobrados', name: 'Dobrados' }],
  ['marchas', { id: 'marchas', name: 'Marchas' }],
  ['marcha', { id: 'marcha', name: 'Marchas' }] // fallback para testes legados
]);

// Mock de instrumentos para testes
const mockInstrumentNames = [
  'Grade', 'Flautim', 'Flauta', 'Requinta',
  'Clarinete Bb', 'Trompete Bb', 'Trombone'
];

// Mock do AuthContext
jest.unstable_mockModule('@contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: jest.fn()
  }),
  AuthProvider: ({ children }) => children
}));

// Mock do UIContext
const mockAddToShareCart = jest.fn();

jest.unstable_mockModule('@contexts/UIContext', () => ({
  useUI: () => ({
    selectedSheet: mockSelectedSheet,
    setSelectedSheet: mockSetSelectedSheet,
    showToast: mockShowToast,
    sidebarCollapsed: false,
    setSidebarCollapsed: jest.fn(),
    // Carrinho de compartilhamento
    addToShareCart: mockAddToShareCart,
    removeFromShareCart: jest.fn(),
    shareCart: []
  }),
  UIProvider: ({ children }) => children
}));

// Mock do DataContext
jest.unstable_mockModule('@contexts/DataContext', () => ({
  useData: () => ({
    favorites: mockFavorites,
    favoritesSet: mockFavoritesSet,
    toggleFavorite: mockToggleFavorite,
    sheets: [],
    isLoading: false,
    categoriesMap: mockCategoriesMap,
    instrumentNames: mockInstrumentNames
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
    // Estado do visualizador PDF embutido
    pdfViewer: { isOpen: false, url: null, title: '', instrument: '' },
    downloadParteDireta: jest.fn(),
    handleSelectInstrument: jest.fn(),
    handleSelectParteEspecifica: jest.fn(),
    handleConfirmDownload: jest.fn(),
    handleCancelDownload: jest.fn(),
    closePartePicker: jest.fn(),
    closePdfViewer: jest.fn(),
    // Funcoes de compartilhamento/impressao/visualizacao
    handlePrintInstrument: jest.fn(),
    handleViewInstrument: jest.fn(),
    handleShareInstrument: jest.fn(),
    canShareFiles: jest.fn(() => false)
  }),
  // Exporta funcao auxiliar usada pelo SheetDetailModal
  findParteExata: jest.fn((instrumento, partes) => {
    if (!partes || partes.length === 0) return null;
    return partes.find(p => p.instrumento === instrumento) || partes[0];
  })
}));

// Mock do PDFViewerModal (evita erro DOMMatrix do pdfjs-dist no Jest)
jest.unstable_mockModule('./PDFViewerModal', () => ({
  default: () => null
}));

// Nota: fetch e mockado pelo MSW no jest.setup.js

// ===== IMPORTACOES APOS MOCKS =====
const { act, render, screen, waitFor } = await import('@testing-library/react');
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
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, value: jest.fn() });
    Object.defineProperty(HTMLMediaElement.prototype, 'load', { configurable: true, value: jest.fn() });
    mockSelectedSheet = null;
    mockFavorites = [];
    mockFavoritesSet = new Set();
  });

  describe('Renderizacao', () => {
    test('ignora uma resposta atrasada da partitura anterior', async () => {
      let resolveFirst;
      server.use(http.get('*/api/partituras/:id', async ({ params }) => {
        if (params.id === '1') return new Promise(resolve => { resolveFirst = resolve; });
        return HttpResponse.json({ id: 2, has_audio: false, youtube_url: 'https://youtu.be/segunda' });
      }));
      mockSelectedSheet = createMockSheet();
      const modal = renderModal();
      await waitFor(() => expect(resolveFirst).toBeDefined());

      mockSelectedSheet = createMockSheet({ id: 2, title: 'Segunda partitura' });
      modal.rerender(<MemoryRouter><SheetDetailModal /></MemoryRouter>);
      expect(await screen.findByRole('link', { name: /Ver no YouTube/ })).toHaveAttribute('href', 'https://youtu.be/segunda');

      await act(async () => {
        resolveFirst(HttpResponse.json({ id: 1, has_audio: true, youtube_url: 'https://youtu.be/primeira' }));
      });
      expect(screen.queryByRole('button', { name: 'Ouvir partitura' })).not.toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Ver no YouTube/ })).toHaveAttribute('href', 'https://youtu.be/segunda');
    });

    test('mantém o modal e a mídia conhecida quando a atualização falha', async () => {
      mockSelectedSheet = createMockSheet({ hasAudio: true });
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      server.use(http.get('*/api/partituras/:id', () => HttpResponse.json({ error: 'Indisponível' }, { status: 503 })));
      try {
        renderModal();
        await waitFor(() => expect(consoleError).toHaveBeenCalledWith('Erro ao buscar mídia da partitura:', expect.any(Error)));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Ouvir partitura' })).toBeInTheDocument();
      } finally {
        consoleError.mockRestore();
      }
    });

    test('busca o áudio cadastrado ao abrir uma partitura vinda do repertório', async () => {
      mockSelectedSheet = createMockSheet();
      server.use(http.get('*/api/partituras/:id', () => HttpResponse.json({
        id: 1, has_audio: true, audio_name: 'Marcha.mp3', audio_mime: 'audio/mpeg',
        youtube_url: 'https://youtu.be/abc'
      })));
      renderModal();

      expect(await screen.findByRole('button', { name: 'Ouvir partitura' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Ver no YouTube/ })).toHaveAttribute('href', 'https://youtu.be/abc');
    });

    test('atualiza os dados antigos da sessão após cadastrar áudio no admin', async () => {
      mockSelectedSheet = createMockSheet({ hasAudio: false });
      server.use(http.get('*/api/partituras/:id', () => HttpResponse.json({ id: 1, has_audio: true })));
      renderModal();

      expect(await screen.findByRole('button', { name: 'Ouvir partitura' })).toBeInTheDocument();
    });

    test('remove os controles quando a API confirma que o áudio foi removido', async () => {
      mockSelectedSheet = createMockSheet({ hasAudio: true, youtubeUrl: 'https://youtu.be/abc' });
      server.use(http.get('*/api/partituras/:id', () => HttpResponse.json({ id: 1, has_audio: false, youtube_url: null })));
      renderModal();

      await waitFor(() => expect(screen.queryByRole('button', { name: 'Ouvir partitura' })).not.toBeInTheDocument());
      expect(screen.queryByRole('link', { name: /Ver no YouTube/ })).not.toBeInTheDocument();
      expect(screen.getByText('Áudio ainda não disponível')).toBeInTheDocument();
    });

    test('mostra o botão de áudio e o link externo no modal quando cadastrados', async () => {
      mockSelectedSheet = createMockSheet({ hasAudio: true, youtubeUrl: 'https://www.youtube.com/watch?v=abc' });
      renderModal();

      expect(await screen.findByRole('button', { name: 'Ouvir partitura' })).toBeInTheDocument();
      const link = screen.getByRole('link', { name: /Ver no YouTube/ });
      expect(link).toHaveAttribute('href', 'https://www.youtube.com/watch?v=abc');
      expect(link).toHaveAttribute('target', '_blank');
    });

    test('mostra a indisponibilidade do arquivo junto ao link do YouTube', async () => {
      mockSelectedSheet = createMockSheet({ hasAudio: false, youtubeUrl: 'https://youtu.be/abc' });
      renderModal();

      expect(await screen.findByRole('link', { name: /Ver no YouTube/ })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Ouvir partitura' })).not.toBeInTheDocument();
      expect(screen.getByText('Áudio ainda não disponível')).toBeInTheDocument();
    });

    test('mantém a seção de áudio visível sem arquivo nem link', async () => {
      mockSelectedSheet = createMockSheet({ hasAudio: false, youtubeUrl: null });
      renderModal();

      expect(await screen.findByRole('region', { name: 'Áudio oficial da partitura' })).toBeInTheDocument();
      expect(screen.getByText('Áudio ainda não disponível')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Ouvir partitura' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /Ver no YouTube/ })).not.toBeInTheDocument();
    });

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

    test('exibe "Meu Instrumento" no botao de download', async () => {
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
      mockFavoritesSet = new Set();
      renderModal();

      await waitFor(() => {
        const favButton = screen.getByRole('button', { name: /adicionar.*favoritos/i });
        expect(favButton).toBeInTheDocument();
      });
    });

    test('exibe botao de remover dos favoritos quando favoritado', async () => {
      mockSelectedSheet = createMockSheet({ id: 1 });
      mockFavorites = [1];
      mockFavoritesSet = new Set([1]);
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
      mockFavoritesSet = new Set();
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
      mockFavoritesSet = new Set();
      const { unmount } = renderModal();

      await waitFor(() => {
        const favButton = screen.getByRole('button', { name: /adicionar.*favoritos/i });
        expect(favButton).toHaveAttribute('aria-pressed', 'false');
      });
      unmount();

      // Favoritado
      mockFavorites = [1];
      mockFavoritesSet = new Set([1]);
      renderModal();

      await waitFor(() => {
        const favButton = screen.getByRole('button', { name: /remover.*favoritos/i });
        expect(favButton).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });

  describe('Opcoes de compartilhamento', () => {
    test('botao Enviar oferece cópia e link mesmo sem Web Share de arquivos', async () => {
      const user = userEvent.setup();
      mockSelectedSheet = createMockSheet();
      renderModal();

      const sendButton = await screen.findByRole('button', { name: /compartilhar partitura/i });
      await user.click(sendButton);

      expect(screen.getByRole('dialog', { name: /como deseja enviar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviar cópia/i })).toBeDisabled();
      expect(screen.getByText('Não disponível neste navegador')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /compartilhar link/i })).toHaveFocus();
    });

    test('Escape fecha apenas as opções e mantém os detalhes da partitura abertos', async () => {
      const user = userEvent.setup();
      mockSelectedSheet = createMockSheet();
      renderModal();

      await user.click(await screen.findByRole('button', { name: /compartilhar partitura/i }));
      await user.keyboard('{Escape}');

      expect(screen.queryByRole('dialog', { name: /como deseja enviar/i })).not.toBeInTheDocument();
      expect(screen.getByRole('dialog', { name: 'Dobrado Teste' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /compartilhar partitura/i })).toHaveFocus();
      expect(mockSetSelectedSheet).not.toHaveBeenCalled();
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
    test('modal tem role="dialog"', async () => {
      mockSelectedSheet = createMockSheet();
      renderModal();

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    test('modal tem aria-modal="true"', async () => {
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
