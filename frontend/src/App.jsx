// ===== MAIN APP COMPONENT =====
// Com React Router para navegacao por URLs em PT-BR
// Otimizado: prefetching de telas, transições rápidas

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '@components/common/PageTransition';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import Toast from '@components/common/Toast';
import BottomNav from '@components/layout/BottomNav';
import DesktopLayout from '@components/layout/DesktopLayout';

// Modals - carregados sempre (necessários globalmente)
import SheetDetailModal from '@components/modals/SheetDetailModal';
import NotificationsPanel from '@components/modals/NotificationsPanel';
import ShareCartModal from '@components/modals/ShareCartModal';
import UpdateNotification from '@components/common/UpdateNotification';
import ShareCartFAB from '@components/common/ShareCartFAB';

// Onboarding - renderizado no nivel do App para ficar acima dos modals
import UserWalkthrough from '@components/onboarding/UserWalkthrough';
import { useUserWalkthrough } from '@components/onboarding/useUserWalkthrough';

// Login - carregado sempre (primeira tela)
import LoginScreen from '@screens/LoginScreen';

// ===== TELAS PRINCIPAIS (Eager Load) =====
// Carregadas imediatamente - mais rápido para navegação
import HomeScreen from '@screens/HomeScreen';
import LibraryScreen from '@screens/LibraryScreen';

// ===== TELAS SECUNDÁRIAS (Lazy Load com Prefetch) =====
const SearchScreen = lazy(() => import('@screens/SearchScreen'));
const FavoritesScreen = lazy(() => import('@screens/FavoritesScreen'));
const RepertorioScreen = lazy(() => import('@screens/RepertorioScreen'));
const GenresScreen = lazy(() => import('@screens/GenresScreen'));
const ComposersScreen = lazy(() => import('@screens/ComposersScreen'));
const ProfileScreen = lazy(() => import('@screens/ProfileScreen'));
const AdminApp = lazy(() => import('@screens/admin').then(m => ({ default: m.AdminApp })));

// Prefetch de telas secundárias em background
const prefetchScreens = () => {
  // Usa requestIdleCallback para não bloquear a thread principal
  const schedulePrefetch = (callback) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 100);
    }
  };

  // Prefetch Search e Favorites (mais usadas)
  schedulePrefetch(() => {
    import('@screens/SearchScreen');
    import('@screens/FavoritesScreen');
  });

  // Prefetch outras telas após 2s
  schedulePrefetch(() => {
    import('@screens/RepertorioScreen');
    import('@screens/ProfileScreen');
    import('@screens/GenresScreen');
  });
};

// Loading Screen Component - versão minimalista e rápida
const LoadingScreen = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px'
  }}>
    <div style={{
      width: '72px',
      height: '72px',
      borderRadius: '50%',
      background: 'linear-gradient(145deg, #D4AF37 0%, #B8860B 100%)',
      padding: '3px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '8px'
      }}>
        <img
          src="/assets/images/ui/brasao-256x256.png"
          alt="Brasao"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    </div>
    <div style={{
      width: '32px',
      height: '32px',
      border: '3px solid var(--border)',
      borderTopColor: 'var(--primary)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Carregando acervo...</p>
  </div>
);

// Page Loader minimalista para transições rápidas
const PageLoader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      padding: '40px'
    }}
  >
    <div style={{
      width: '32px',
      height: '32px',
      border: '3px solid var(--border)',
      borderTopColor: 'var(--primary)',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite'
    }} />
  </motion.div>
);

// Componente de protecao de rotas
// Permite admins acessarem area de musico (para usar AdminToggle)
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const { isLoading } = useData();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admins podem acessar area de musico (toggle entre admin/musico)
  return children;
};

// Componente de rota admin
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const { isLoading } = useData();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};



// Layout para usuario comum (com BottomNav e DesktopLayout)
// Otimizado: sem AnimatePresence mode="wait", transições mais rápidas
const UserLayout = ({ children }) => {
  const location = useLocation();

  // Mapeia path para tab ativa
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/acervo')) return 'library';
    if (path === '/buscar') return 'search';
    if (path === '/favoritos') return 'favorites';
    if (path === '/repertorio') return 'repertorio';
    if (path === '/perfil') return 'profile';
    if (path === '/generos') return 'genres';
    if (path.startsWith('/compositores')) return 'composers';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <DesktopLayout activeTab={activeTab}>
      {/* Sem AnimatePresence mode="wait" - remove delay de transição */}
      <Suspense fallback={<PageLoader />}>
        <PageTransition key={location.pathname}>
          {children}
        </PageTransition>
      </Suspense>
      <BottomNav activeTab={activeTab} />
    </DesktopLayout>
  );
};

// Wrapper para LibraryScreen que injeta categoria da URL
const LibraryWithCategory = () => {
  const { categoria } = useParams();
  return <LibraryScreen categoryFromUrl={categoria} />;
};

// Wrapper para LibraryScreen com partitura aberta
const LibraryWithSheet = () => {
  const { categoria, partituraId } = useParams();
  return <LibraryScreen categoryFromUrl={categoria} sheetIdFromUrl={partituraId} />;
};

// Wrapper para ComposersScreen com compositor selecionado
const ComposerWithSlug = () => {
  const { slug } = useParams();
  return <ComposersScreen composerSlugFromUrl={slug} />;
};

// Walkthrough global - renderizado no nivel do App para ficar acima de tudo
const GlobalUserWalkthrough = () => {
  const [showWalkthrough, setShowWalkthrough] = useUserWalkthrough();
  return (
    <UserWalkthrough
      isOpen={showWalkthrough}
      onClose={() => setShowWalkthrough(false)}
    />
  );
};

// App Content - providers estao no main.jsx
const AppContent = () => {
  const { toast, clearToast } = useUI();

  // Inicia prefetch após carregamento inicial
  useEffect(() => {
    // Pequeno delay para não competir com o carregamento inicial
    const timer = setTimeout(prefetchScreens, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Routes>
        {/* Rota de Login */}
        <Route path="/login" element={<LoginRoute />} />

        {/* Rotas Admin */}
        <Route path="/admin" element={
          <AdminRoute>
            <Suspense fallback={<PageLoader />}>
              <AdminApp />
            </Suspense>
          </AdminRoute>
        } />
        <Route path="/admin/:secao" element={
          <AdminRoute>
            <Suspense fallback={<PageLoader />}>
              <AdminApp />
            </Suspense>
          </AdminRoute>
        } />

        {/* Rotas de Usuario */}
        <Route path="/" element={
          <ProtectedRoute>
            <UserLayout><HomeScreen /></UserLayout>
          </ProtectedRoute>
        } />

        {/* Acervo - principal */}
        <Route path="/acervo" element={
          <ProtectedRoute>
            <UserLayout><LibraryScreen /></UserLayout>
          </ProtectedRoute>
        } />

        {/* Acervo - por categoria (ex: /acervo/dobrados) */}
        <Route path="/acervo/:categoria" element={
          <ProtectedRoute>
            <UserLayout><LibraryWithCategory /></UserLayout>
          </ProtectedRoute>
        } />

        {/* Acervo - partitura especifica (ex: /acervo/dobrados/123) */}
        <Route path="/acervo/:categoria/:partituraId" element={
          <ProtectedRoute>
            <UserLayout><LibraryWithSheet /></UserLayout>
          </ProtectedRoute>
        } />

        {/* Buscar */}
        <Route path="/buscar" element={
          <ProtectedRoute>
            <UserLayout><SearchScreen /></UserLayout>
          </ProtectedRoute>
        } />

        {/* Favoritos */}
        <Route path="/favoritos" element={
          <ProtectedRoute>
            <UserLayout><FavoritesScreen /></UserLayout>
          </ProtectedRoute>
        } />

        {/* Repertorio */}
        <Route path="/repertorio" element={
          <ProtectedRoute>
            <UserLayout><RepertorioScreen /></UserLayout>
          </ProtectedRoute>
        } />

        {/* Generos */}
        <Route path="/generos" element={
          <ProtectedRoute>
            <UserLayout><GenresScreen /></UserLayout>
          </ProtectedRoute>
        } />

        {/* Compositores */}
        <Route path="/compositores" element={
          <ProtectedRoute>
            <UserLayout><ComposersScreen /></UserLayout>
          </ProtectedRoute>
        } />

        {/* Compositor especifico (ex: /compositores/estevam-moura) */}
        <Route path="/compositores/:slug" element={
          <ProtectedRoute>
            <UserLayout><ComposerWithSlug /></UserLayout>
          </ProtectedRoute>
        } />

        {/* Perfil */}
        <Route path="/perfil" element={
          <ProtectedRoute>
            <UserLayout><ProfileScreen /></UserLayout>
          </ProtectedRoute>
        } />

        {/* Redirects de rotas antigas para novas */}
        <Route path="/library" element={<Navigate to="/acervo" replace />} />
        <Route path="/library/:category" element={<Navigate to="/acervo" replace />} />
        <Route path="/search" element={<Navigate to="/buscar" replace />} />
        <Route path="/favorites" element={<Navigate to="/favoritos" replace />} />
        <Route path="/genres" element={<Navigate to="/generos" replace />} />
        <Route path="/composers" element={<Navigate to="/compositores" replace />} />
        <Route path="/profile" element={<Navigate to="/perfil" replace />} />
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Fallback - redireciona para home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Modals (globais) */}
      <SheetDetailModal />
      <NotificationsPanel />
      <ShareCartModal />

      {/* FAB do carrinho de compartilhamento */}
      <ShareCartFAB />

      {/* Notificação de atualização */}
      <UpdateNotification />

      {toast ? <Toast message={toast.message} type={toast.type} onClose={clearToast} /> : null}

      {/* User Walkthrough - DEVE ser o ultimo para ficar acima de tudo */}
      <GlobalUserWalkthrough />
    </>
  );
};

// Componente de rota de login
const LoginRoute = () => {
  const { user } = useAuth();
  const { isLoading } = useData();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Se ja logado, redireciona para pagina inicial
  // Todos os usuarios (incluindo admin) vao para / (home com musicas)
  // Admin pode acessar area administrativa via AdminToggle no header
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <LoginScreen required={true} />;
};

// Main App - providers estao no main.jsx
const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
