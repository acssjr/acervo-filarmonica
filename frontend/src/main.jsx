// ===== MAIN ENTRY POINT =====

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@styles/index.css';
import { checkAndClearOldData } from '@services/storage';
import { AuthProvider } from '@contexts/AuthContext';
import { DataProvider } from '@contexts/DataContext';
import { UIProvider } from '@contexts/UIContext';
import { NotificationProvider } from '@contexts/NotificationContext';

// Verifica versao dos dados
checkAndClearOldData();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <UIProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </UIProvider>
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
);
