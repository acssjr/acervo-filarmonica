// ===== HOOK DE NAVEGACAO =====
// Centraliza navegacao entre telas usando React Router
// Rotas em PT-BR

import { useNavigate } from 'react-router-dom';
import { useData } from '@contexts/DataContext';
// slugify removido - não utilizado atualmente

const useAppNavigation = () => {
  const navigate = useNavigate();
  const { setSelectedCategory, setSelectedComposer } = useData();

  // Mapeamento de tabs para paths
  const tabToPath = {
    home: '/',
    library: '/acervo',
    search: '/buscar',
    favorites: '/favoritos',
    profile: '/perfil',
    genres: '/generos',
    composers: '/compositores'
  };

  // Navega para uma tab (compativel com codigo legado)
  const goToTab = (tab) => {
    const path = tabToPath[tab] || '/';
    navigate(path);
  };

  // Navega para biblioteca com categoria
  const goToCategory = (categoryId) => {
    setSelectedCategory(null);
    setSelectedComposer(null);
    navigate(`/acervo/${categoryId}`);
  };

  // Navega para biblioteca com compositor
  const goToComposer = (composerName) => {
    setSelectedComposer(composerName);
    setSelectedCategory(null);
    navigate('/acervo');
  };

  // Navega para biblioteca limpa
  const goToLibrary = () => {
    setSelectedCategory(null);
    setSelectedComposer(null);
    navigate('/acervo');
  };

  return {
    goToTab,
    goToCategory,
    goToComposer,
    goToLibrary,
    navigate
  };
};

export default useAppNavigation;
