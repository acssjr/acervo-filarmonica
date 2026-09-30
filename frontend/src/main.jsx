// ===== MAIN ENTRY POINT =====

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import OverlayScrollbars from '@components/common/OverlayScrollbars';
import '@styles/index.css';
import { checkAndClearOldData } from '@services/storage';
import { AuthProvider } from '@contexts/AuthContext';
import { DataProvider } from '@contexts/DataContext';
import { UIProvider } from '@contexts/UIContext';
import { NotificationProvider } from '@contexts/NotificationContext';
import { initializePostHog } from '@services/posthog';

// Verifica versao dos dados
checkAndClearOldData();
initializePostHog();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <UIProvider>
          <NotificationProvider>
            <App />
            <OverlayScrollbars />
          </NotificationProvider>
        </UIProvider>
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
);
