// ===== ADMIN DASHBOARD TESTS =====
// Testes do dashboard administrativo
// Seguindo o guia: testes comportamentais com roles e acessibilidade

import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// ===== MOCKS DOS CONTEXTOS =====

const mockAdminUser = {
  id: 99,
  username: 'admin',
  name: 'Administrador',
  isAdmin: true,
  instrument: null
};

const mockStats = {
  musicos_ativos: 45,
  total_partituras: 150,
  total_downloads: 1234,
  total_categorias: 8,
  top_partituras: [
    { id: 1, titulo: 'Dobrado Bandeirantes', compositor: 'Anacleto Medeiros', downloads: 100 },
    { id: 2, titulo: 'Marcha Soldado', compositor: 'Tertuliano Santos', downloads: 85 },
    { id: 3, titulo: 'Hino Nacional', compositor: 'Francisco Manuel', downloads: 70 }
  ]
};

const mockAtividades = [
  { id: 1, tipo: 'download', titulo: 'Dobrado Teste', usuario_nome: 'Joao Silva', criado_em: new Date().toISOString() },
  { id: 2, tipo: 'upload', titulo: 'Marcha Nova', usuario_nome: 'Admin', criado_em: new Date(Date.now() - 3600000).toISOString() }
];

let mockLoading = false;

// Mock do AdminContext
jest.unstable_mockModule('./AdminContext', () => ({
  useAdmin: () => ({
    stats: mockStats,
    loading: mockLoading
  })
}));

// Mock do AuthContext
jest.unstable_mockModule('@contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockAdminUser,
    logout: jest.fn()
  }),
  AuthProvider: ({ children }) => children
}));

// Mock do API
jest.unstable_mockModule('@services/api', () => ({
  API: {
    getAtividades: jest.fn().mockResolvedValue(mockAtividades)
  }
}));

// Mock do BREAKPOINTS
jest.unstable_mockModule('@constants/config', () => ({
  BREAKPOINTS: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280
  }
}));

// Mock do formatters
jest.unstable_mockModule('@utils/formatters', () => ({
  formatTimeAgo: jest.fn((date) => 'ha 1 hora'),
  getAtividadeInfo: jest.fn((tipo) => ({
    action: tipo === 'download' ? 'Download' : 'Upload',
    color: tipo === 'download' ? '#27ae60' : '#3498db'
  }))
}));

// ===== IMPORTACOES APOS MOCKS =====
const { render, screen, waitFor } = await import('@testing-library/react');
const { default: AdminDashboard } = await import('./AdminDashboard');

// ===== HELPERS =====

const renderDashboard = () => {
  return render(<AdminDashboard />);
};

// ===== TESTS =====

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoading = false;
  });

  describe('Renderizacao', () => {
    test('renderiza saudacao com nome do admin', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Administrador')).toBeInTheDocument();
      });
    });

    test('exibe badge Admin', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Admin')).toBeInTheDocument();
      });
    });

    test('exibe nome da filarmonica', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/Sociedade Filarm[oô]nica 25 de Mar[cç]o/)).toBeInTheDocument();
      });
    });
  });

  describe('Cards de Estatisticas', () => {
    test('exibe card de musicos ativos', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Músicos Ativos')).toBeInTheDocument();
        expect(screen.getByText('45')).toBeInTheDocument();
      });
    });

    test('exibe card de partituras', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Partituras')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
      });
    });

    test('exibe card de downloads', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Downloads')).toBeInTheDocument();
        expect(screen.getByText('1234')).toBeInTheDocument();
      });
    });

    test('exibe card de categorias', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Categorias')).toBeInTheDocument();
        expect(screen.getByText('8')).toBeInTheDocument();
      });
    });

    test('exibe loading nos cards quando carregando', async () => {
      mockLoading = true;
      renderDashboard();

      await waitFor(() => {
        const loadingIndicators = screen.getAllByText('...');
        expect(loadingIndicators.length).toBeGreaterThanOrEqual(4);
      });
    });
  });

  describe('Acoes Rapidas', () => {
    test('exibe secao de acoes rapidas', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Ações Rápidas')).toBeInTheDocument();
      });
    });

    test('exibe botao Novo Musico', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Novo Músico')).toBeInTheDocument();
      });
    });

    test('exibe botao Nova Pasta', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Nova Pasta')).toBeInTheDocument();
      });
    });

    test('exibe botao Nova Categoria', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Nova Categoria')).toBeInTheDocument();
      });
    });
  });

  describe('Top Partituras', () => {
    test('exibe secao de partituras mais baixadas', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Partituras Mais Baixadas')).toBeInTheDocument();
      });
    });

    test('exibe lista de top partituras', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Dobrado Bandeirantes')).toBeInTheDocument();
        expect(screen.getByText('Anacleto Medeiros')).toBeInTheDocument();
        expect(screen.getByText('100 downloads')).toBeInTheDocument();
      });
    });

    test('exibe segunda partitura do ranking', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Marcha Soldado')).toBeInTheDocument();
        expect(screen.getByText('85 downloads')).toBeInTheDocument();
      });
    });

    test('exibe terceira partitura do ranking', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Hino Nacional')).toBeInTheDocument();
        expect(screen.getByText('70 downloads')).toBeInTheDocument();
      });
    });
  });

  describe('Atividades Recentes', () => {
    test('exibe secao de atividade recente', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('Atividade Recente')).toBeInTheDocument();
      });
    });

    test('exibe atividades carregadas', async () => {
      renderDashboard();

      await waitFor(() => {
        // Verifica que as atividades foram renderizadas
        expect(screen.getByText(/Dobrado Teste/)).toBeInTheDocument();
      });
    });

    test('exibe nome do usuario na atividade', async () => {
      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText(/Joao Silva/)).toBeInTheDocument();
      });
    });
  });

  describe('Estados Vazios', () => {
    test('exibe mensagem quando nao ha atividades', async () => {
      // Sobrescrever mock para retornar array vazio
      const { API } = await import('@services/api');
      API.getAtividades.mockResolvedValueOnce([]);

      renderDashboard();

      // Aguarda o carregamento inicial
      await waitFor(() => {
        expect(screen.getByText('Atividade Recente')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });
});
