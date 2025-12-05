// ===== ADMIN CONTEXT =====
// Estado global do painel administrativo

import { createContext, useContext } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export default AdminContext;
