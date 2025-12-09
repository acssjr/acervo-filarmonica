// ===== DATA CONTEXT =====
// Gerencia dados de partituras, categorias e favoritos
// Separado para evitar re-renders quando UI muda

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Storage from '@services/storage';
import { API, USE_API } from '@services/api';
import { CATEGORIES as FALLBACK_CATEGORIES } from '@constants/categories';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

// Gera dados de exemplo para fallback
const generateSampleData = () => [
  { id: '1', title: 'Verde e Branco', composer: 'Estevam Moura', category: 'dobrados', year: 1940, downloads: 567, featured: true },
  { id: '2', title: 'Magnata', composer: 'Estevam Moura', category: 'dobrados', year: 1945, downloads: 489, featured: true },
  { id: '3', title: 'Tusca', composer: 'Estevam Moura', category: 'dobrados', year: 1942, downloads: 423, featured: false },
  { id: '4', title: 'Dois Coracoes', composer: 'Pedro Salgado', category: 'dobrados', year: 1935, downloads: 512, featured: true },
  { id: '5', title: 'Os Corujas', composer: 'Heraclio Guerreiro', category: 'dobrados', year: 1920, downloads: 298, featured: true },
];

export const DataProvider = ({ children }) => {
  // Partituras
  const [sheets, setSheets] = useState(() => Storage.get('sheets', generateSampleData()));
  const [isLoading, setIsLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(false);

  // Categorias - fonte única de verdade (API com fallback para constantes)
  const [categories, setCategories] = useState(() => {
    const stored = Storage.get('categories', null);
    return stored || FALLBACK_CATEGORIES;
  });

  // Favoritos
  const [favorites, setFavorites] = useState(() => Storage.get('favorites', []));

  // Navegacao
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedComposer, setSelectedComposer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Carrega dados da API ao iniciar
  useEffect(() => {
    const loadFromAPI = async () => {
      if (!USE_API) {
        setIsLoading(false);
        return;
      }

      try {
        const isOnline = await API.healthCheck();
        setApiOnline(isOnline);

        if (isOnline) {
          // Carrega partituras e categorias em paralelo
          const [partituras, categoriasApi] = await Promise.all([
            API.getPartituras(),
            API.getCategorias()
          ]);

          if (partituras && partituras.length > 0) {
            const mappedSheets = partituras.map(p => ({
              id: String(p.id),
              title: p.titulo,
              composer: p.compositor,
              category: p.categoria_id,
              year: p.ano,
              downloads: p.downloads || 0,
              featured: p.destaque === 1,
              hasFile: !!p.arquivo_nome,
              apiId: p.id
            }));
            setSheets(mappedSheets);
            Storage.set('sheets', mappedSheets);
          }

          // Atualiza categorias da API
          if (categoriasApi && categoriasApi.length > 0) {
            const mappedCategories = categoriasApi.map(c => ({
              id: c.id,
              name: c.nome
            }));
            setCategories(mappedCategories);
            Storage.set('categories', mappedCategories);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar da API:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFromAPI();
  }, []);

  // Persiste dados
  useEffect(() => { Storage.set('sheets', sheets); }, [sheets]);
  useEffect(() => { Storage.set('favorites', favorites); }, [favorites]);
  useEffect(() => { Storage.set('categories', categories); }, [categories]);

  // Helper: cria map de categorias para lookup O(1)
  const categoriesMap = new Map(categories.map(cat => [cat.id, cat]));

  // Carrega favoritos do usuario apos login
  const loadUserFavorites = useCallback(async () => {
    const token = Storage.get('authToken', null);
    if (!USE_API || !token) return;

    try {
      const favoritosIds = await API.getFavoritosIds();
      if (favoritosIds && Array.isArray(favoritosIds)) {
        const favoritosStr = favoritosIds.map(id => String(id));
        setFavorites(favoritosStr);
        Storage.set('favorites', favoritosStr);
      }
    } catch (e) {
      // Silencioso - favoritos nao sao criticos
    }
  }, []);

  const toggleFavorite = useCallback(async (id) => {
    const isFavorito = favorites.includes(id);
    setFavorites(prev => isFavorito ? prev.filter(f => f !== id) : [...prev, id]);

    const token = Storage.get('authToken', null);
    if (USE_API && token) {
      try {
        if (isFavorito) {
          await API.removeFavorito(id);
        } else {
          await API.addFavorito(id);
        }
      } catch (error) {
        // Reverte em caso de erro
        setFavorites(prev => isFavorito ? [...prev, id] : prev.filter(f => f !== id));
        console.error('Erro ao sincronizar favorito:', error);
      }
    }
  }, [favorites]);

  const addSheet = useCallback((sheet) => {
    setSheets(prev => [...prev, sheet]);
  }, []);

  return (
    <DataContext.Provider value={{
      sheets,
      setSheets,
      addSheet,
      favorites,
      setFavorites,
      toggleFavorite,
      loadUserFavorites,
      categories,
      categoriesMap,
      activeTab,
      setActiveTab,
      selectedCategory,
      setSelectedCategory,
      selectedComposer,
      setSelectedComposer,
      searchQuery,
      setSearchQuery,
      isLoading,
      apiOnline
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
