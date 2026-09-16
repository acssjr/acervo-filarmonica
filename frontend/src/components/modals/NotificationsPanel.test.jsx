import { describe, test, expect, jest, beforeEach } from '@jest/globals';

const mockSetShowNotifications = jest.fn();
const mockRefreshNotifications = jest.fn();
let mockNotifications = [];
let mockSheets = [];

jest.unstable_mockModule('@contexts/UIContext', () => ({
  useUI: () => ({
    showNotifications: true,
    setShowNotifications: mockSetShowNotifications,
    theme: 'dark'
  })
}));

jest.unstable_mockModule('@contexts/DataContext', () => ({
  useData: () => ({
    sheets: mockSheets
  })
}));

jest.unstable_mockModule('@contexts/NotificationContext', () => ({
  useNotifications: () => ({
    notifications: mockNotifications,
    loading: false,
    markNotificationAsRead: jest.fn(),
    markAllNotificationsAsRead: jest.fn(),
    refreshNotifications: mockRefreshNotifications
  })
}));

jest.unstable_mockModule('@hooks/useResponsive', () => ({
  useIsMobile: () => false
}));

jest.unstable_mockModule('@hooks/useScrollLock', () => ({
  useScrollLock: jest.fn()
}));

jest.unstable_mockModule('@constants/icons', () => ({
  Icons: {
    Music: () => null,
    ListMusic: () => null
  }
}));

jest.unstable_mockModule('@components/common/EmptyState', () => ({
  default: ({ title }) => <div>{title}</div>
}));

const { render, screen } = await import('@testing-library/react');
const { MemoryRouter } = await import('react-router-dom');
const { default: NotificationsPanel } = await import('./NotificationsPanel.jsx');

describe('NotificationsPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNotifications = [];
    mockSheets = [];
  });

  test('renderiza textos acentuados corretamente no cabeçalho e estado vazio', () => {
    render(
      <MemoryRouter>
        <NotificationsPanel />
      </MemoryRouter>
    );

    expect(screen.getByText('Notificações')).toBeInTheDocument();
    expect(screen.getByText('Nenhuma notificação')).toBeInTheDocument();
    expect(mockRefreshNotifications).toHaveBeenCalled();
  });

  test('mostra uma descrição clara da mudança realizada', () => {
    mockNotifications = [{
      id: 'activity-12',
      type: 'nova_parte',
      title: 'Coisa nº 1',
      description: 'Parte Trompete Bb 1 adicionada por Antonio Neves.',
      label: 'Nova parte',
      iconName: 'Music',
      date: new Date().toISOString(),
      read: false,
      entityType: 'partitura',
      entityId: 42
    }];

    render(
      <MemoryRouter>
        <NotificationsPanel />
      </MemoryRouter>
    );

    expect(screen.getByText('Parte Trompete Bb 1 adicionada por Antonio Neves.')).toBeInTheDocument();
  });
});
