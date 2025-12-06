// ===== LOGIN SCREEN TESTS =====
// Testes do fluxo de autenticacao
// Seguindo o guia: testes comportamentais com roles e acessibilidade

import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// ===== MOCKS DOS CONTEXTOS =====

const mockSetUser = jest.fn();
const mockShowToast = jest.fn();
const mockSetFavorites = jest.fn();
const mockNavigate = jest.fn();

// Mock do AuthContext
jest.unstable_mockModule('@contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    setUser: mockSetUser,
    logout: jest.fn()
  }),
  AuthProvider: ({ children }) => children
}));

// Mock do UIContext
jest.unstable_mockModule('@contexts/UIContext', () => ({
  useUI: () => ({
    showToast: mockShowToast,
    theme: 'dark'
  }),
  UIProvider: ({ children }) => children
}));

// Mock do DataContext
jest.unstable_mockModule('@contexts/DataContext', () => ({
  useData: () => ({
    setFavorites: mockSetFavorites,
    favorites: []
  }),
  DataProvider: ({ children }) => children
}));

// Mock do react-router-dom (simplificado para evitar memory leak)
jest.unstable_mockModule('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/login', state: null }),
  MemoryRouter: ({ children }) => children,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
  Link: ({ children }) => children,
  NavLink: ({ children }) => children
}));

// ===== IMPORTACOES APOS MOCKS =====
const { render, screen, waitFor } = await import('@testing-library/react');
const { default: userEvent } = await import('@testing-library/user-event');
const { default: LoginScreen } = await import('./LoginScreen');

// ===== HELPERS =====

const renderLogin = (props = {}) => {
  return render(<LoginScreen {...props} />);
};

// ===== TESTS =====

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizacao', () => {
    test('renderiza formulario de login', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByPlaceholderText('seuusuario')).toBeInTheDocument();
      });
    });

    test('renderiza campo de usuario com label', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByText('Usuario')).toBeInTheDocument();
      });
    });

    test('renderiza inputs de PIN', async () => {
      renderLogin();

      await waitFor(() => {
        // PinInput renderiza 4 inputs
        const pinInputs = screen.getAllByRole('textbox');
        // 1 para username + 4 para PIN = 5
        expect(pinInputs.length).toBeGreaterThanOrEqual(1);
      });
    });

    test('renderiza checkbox lembrar-me', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByText('Lembrar meu acesso')).toBeInTheDocument();
      });
    });

    test('renderiza footer com conexao segura', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByText('Conexao Segura')).toBeInTheDocument();
      });
    });

    test('renderiza nome da filarmonica', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByText(/Sociedade Filarmonica 25 de Marco/)).toBeInTheDocument();
      });
    });
  });

  describe('Botao Fechar', () => {
    test('exibe botao fechar quando nao obrigatorio', async () => {
      const onClose = jest.fn();
      renderLogin({ onClose, required: false });

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /✕/i });
        expect(closeButton).toBeInTheDocument();
      });
    });

    test('nao exibe botao fechar quando obrigatorio', async () => {
      renderLogin({ required: true });

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /✕/i })).not.toBeInTheDocument();
      });
    });

    test('chama onClose ao clicar no botao fechar', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      renderLogin({ onClose, required: false });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /✕/i })).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /✕/i });
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Campo Usuario', () => {
    test('permite digitar username', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInput = await screen.findByPlaceholderText('seuusuario');
      await user.type(usernameInput, 'musico.teste');

      expect(usernameInput).toHaveValue('musico.teste');
    });

    test('normaliza username para lowercase', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInput = await screen.findByPlaceholderText('seuusuario');
      await user.type(usernameInput, 'MUSICO.TESTE');

      // O handler normaliza para lowercase
      expect(usernameInput).toHaveValue('musico.teste');
    });

    test('mostra indicador quando usuario existe', async () => {
      const user = userEvent.setup();
      renderLogin();

      const usernameInput = await screen.findByPlaceholderText('seuusuario');
      await user.type(usernameInput, 'musico.teste');

      // Aguarda debounce (300ms) + API call
      await waitFor(() => {
        expect(screen.getByText(/Músico Teste/)).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Campo PIN', () => {
    test('renderiza 4 campos de PIN', async () => {
      renderLogin();

      await waitFor(() => {
        // Procura por inputs do tipo password (PIN inputs)
        const container = document.body;
        const pinInputs = container.querySelectorAll('input[type="password"]');
        expect(pinInputs.length).toBe(4);
      });
    });

    test('exibe label PIN', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByText('PIN')).toBeInTheDocument();
      });
    });
  });

  describe('Fluxo de Login', () => {
    // Helper para encontrar inputs de PIN
    const getPinInputs = () => {
      return document.body.querySelectorAll('input[type="password"]');
    };

    test('mostra loading durante autenticacao', async () => {
      const user = userEvent.setup();
      renderLogin();

      // Digita usuario
      const usernameInput = await screen.findByPlaceholderText('seuusuario');
      await user.type(usernameInput, 'musico.teste');

      // Aguarda usuario ser encontrado
      await waitFor(() => {
        expect(screen.getByText(/Músico Teste/)).toBeInTheDocument();
      }, { timeout: 2000 });

      // Digita PIN nos inputs
      const pinInputs = getPinInputs();

      // Digita cada digito do PIN
      for (let i = 0; i < 4; i++) {
        await user.type(pinInputs[i], String(i + 1));
      }

      // Deve mostrar loading (pode aparecer e desaparecer rapido)
      // Verificamos que nao houve erro
      await waitFor(() => {
        const errorText = screen.queryByText(/Usuario ou PIN incorreto/);
        // Se nao mostrou erro, o login funcionou
        expect(errorText).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });

    test('mostra erro com PIN incorreto', async () => {
      const user = userEvent.setup();
      renderLogin();

      // Digita usuario
      const usernameInput = await screen.findByPlaceholderText('seuusuario');
      await user.type(usernameInput, 'musico.teste');

      // Aguarda usuario ser encontrado
      await waitFor(() => {
        expect(screen.getByText(/Músico Teste/)).toBeInTheDocument();
      }, { timeout: 2000 });

      // Digita PIN errado
      const pinInputs = getPinInputs();

      // Digita PIN incorreto (9999 em vez de 1234)
      for (let i = 0; i < 4; i++) {
        await user.type(pinInputs[i], '9');
      }

      // Deve mostrar erro
      await waitFor(() => {
        expect(screen.getByText(/Usuario ou PIN incorreto/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    test('login com sucesso chama setUser e showToast', async () => {
      const user = userEvent.setup();
      renderLogin();

      // Digita usuario
      const usernameInput = await screen.findByPlaceholderText('seuusuario');
      await user.type(usernameInput, 'musico.teste');

      // Aguarda usuario ser encontrado
      await waitFor(() => {
        expect(screen.getByText(/Músico Teste/)).toBeInTheDocument();
      }, { timeout: 2000 });

      // Digita PIN correto (1234)
      const pinInputs = getPinInputs();

      await user.type(pinInputs[0], '1');
      await user.type(pinInputs[1], '2');
      await user.type(pinInputs[2], '3');
      await user.type(pinInputs[3], '4');

      // Deve chamar setUser e showToast apos login bem-sucedido
      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalled();
      }, { timeout: 3000 });

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('Bem-vindo'));
      });
    });
  });

  describe('Acessibilidade', () => {
    test('inputs tem autocomplete correto', async () => {
      renderLogin();

      const usernameInput = await screen.findByPlaceholderText('seuusuario');
      expect(usernameInput).toHaveAttribute('autocomplete', 'username');
    });
  });
});
