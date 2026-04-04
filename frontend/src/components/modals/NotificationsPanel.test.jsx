import { describe, test, expect, jest, beforeEach } from '@jest/globals';

const mockSetShowNotifications = jest.fn();
const mockRefreshNotifications = jest.fn();

jest.unstable_mockModule('@contexts/UIContext', () => ({
  useUI: () => ({
    showNotifications: true,
    setShowNotifications: mockSetShowNotifications,
    theme: 'dark'
  })
}));

jest.unstable_mockModule('@contexts/DataContext', () => ({
  useData: () => ({
    sheets: []
  })
}));

jest.unstable_mockModule('@contexts/NotificationContext', () => ({
  useNotifications: () => ({
    notifications: [],
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
});
