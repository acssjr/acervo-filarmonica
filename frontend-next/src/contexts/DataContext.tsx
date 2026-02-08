"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import Storage from "@lib/storage";
import { API, USE_API } from "@lib/api";
import { CATEGORIES as FALLBACK_CATEGORIES, type Category } from "@constants/categories";
import { DEFAULT_INSTRUMENTS as FALLBACK_INSTRUMENTS, type Instrument } from "@constants/instruments";

interface Sheet {
  id: string;
  title: string;
  composer: string;
  category: string;
  year: number;
  downloads: number;
  featured: boolean;
  hasFile?: boolean;
  apiId?: number;
}

interface DataContextType {
  sheets: Sheet[];
  setSheets: (sheets: Sheet[]) => void;
  addSheet: (sheet: Sheet) => void;
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
  toggleFavorite: (id: string) => void;
  loadUserFavorites: () => Promise<void>;
  categories: Category[];
  categoriesMap: Map<string, Category>;
  instruments: Instrument[];
  instrumentNames: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedComposer: string | null;
  setSelectedComposer: (composer: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  apiOnline: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
};

const generateSampleData = (): Sheet[] => [
  { id: "1", title: "Verde e Branco", composer: "Estevam Moura", category: "dobrados", year: 1940, downloads: 567, featured: true },
  { id: "2", title: "Magnata", composer: "Estevam Moura", category: "dobrados", year: 1945, downloads: 489, featured: true },
  { id: "3", title: "Tusca", composer: "Estevam Moura", category: "dobrados", year: 1942, downloads: 423, featured: false },
  { id: "4", title: "Dois Coracoes", composer: "Pedro Salgado", category: "dobrados", year: 1935, downloads: 512, featured: true },
  { id: "5", title: "Os Corujas", composer: "Heraclio Guerreiro", category: "dobrados", year: 1920, downloads: 298, featured: true },
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [sheets, setSheets] = useState<Sheet[]>(() =>
    Storage.get<Sheet[]>("sheets", generateSampleData())
  );
  const [isLoading, setIsLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(false);

  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = Storage.get<Category[] | null>("categories", null);
    return stored || FALLBACK_CATEGORIES;
  });

  const [instruments, setInstruments] = useState<Instrument[]>(() => {
    const stored = Storage.get<Instrument[] | null>("instruments", null);
    return stored || FALLBACK_INSTRUMENTS;
  });

  const [favorites, setFavorites] = useState<string[]>(() =>
    Storage.get<string[]>("favorites", [])
  );

  const [activeTab, setActiveTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedComposer, setSelectedComposer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
          const [partituras, categoriasApi, instrumentosApi] = await Promise.all([
            API.getPartituras(),
            API.getCategorias(),
            API.getInstrumentos(),
          ]);
          if (partituras && partituras.length > 0) {
            const mappedSheets: Sheet[] = partituras.map((p: any) => ({
              id: String(p.id),
              title: p.titulo,
              composer: p.compositor,
              category: p.categoria_id,
              year: p.ano,
              downloads: p.downloads || 0,
              featured: p.destaque === 1,
              hasFile: !!p.arquivo_nome,
              apiId: p.id,
            }));
            setSheets(mappedSheets);
            Storage.set("sheets", mappedSheets);
          }
          if (categoriasApi && categoriasApi.length > 0) {
            const mappedCategories: Category[] = categoriasApi.map((c: any) => ({
              id: c.id,
              name: c.nome,
            }));
            setCategories(mappedCategories);
            Storage.set("categories", mappedCategories);
          }
          if (instrumentosApi && instrumentosApi.length > 0) {
            const mappedInstruments: Instrument[] = instrumentosApi.map((i: any) => ({
              id: i.id,
              nome: i.nome,
            }));
            setInstruments(mappedInstruments);
            Storage.set("instruments", mappedInstruments);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar da API:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFromAPI();
  }, []);

  useEffect(() => { Storage.set("sheets", sheets); }, [sheets]);
  useEffect(() => { Storage.set("favorites", favorites); }, [favorites]);
  useEffect(() => { Storage.set("categories", categories); }, [categories]);
  useEffect(() => { Storage.set("instruments", instruments); }, [instruments]);

  const categoriesMap = useMemo(
    () => new Map(categories.map((cat) => [cat.id, cat])),
    [categories]
  );

  const instrumentNames = useMemo(
    () => instruments.map((i) => i.nome),
    [instruments]
  );

  const loadUserFavorites = useCallback(async () => {
    const token = Storage.get<string | null>("authToken", null);
    if (!USE_API || !token) return;
    try {
      const favoritosIds = await API.getFavoritosIds();
      if (favoritosIds && Array.isArray(favoritosIds)) {
        const favoritosStr = favoritosIds.map((id: any) => String(id));
        setFavorites(favoritosStr);
        Storage.set("favorites", favoritosStr);
      }
    } catch {
      // Silencioso
    }
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    const token = Storage.get<string | null>("authToken", null);
    setFavorites((prev) => {
      const wasFavorito = prev.includes(id);
      const newFavorites = wasFavorito
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      if (USE_API && token) {
        const apiCall = wasFavorito
          ? API.removeFavorito(id)
          : API.addFavorito(id);
        apiCall.catch(() => {
          setFavorites((currentState) => {
            const isCurrentlyFavorito = currentState.includes(id);
            const expectedState = !wasFavorito;
            if (isCurrentlyFavorito === expectedState) {
              return wasFavorito
                ? [...currentState, id]
                : currentState.filter((f) => f !== id);
            }
            return currentState;
          });
        });
      }
      return newFavorites;
    });
  }, []);

  const addSheet = useCallback((sheet: Sheet) => {
    setSheets((prev) => [...prev, sheet]);
  }, []);

  return (
    <DataContext.Provider
      value={{
        sheets,
        setSheets,
        addSheet,
        favorites,
        setFavorites,
        toggleFavorite,
        loadUserFavorites,
        categories,
        categoriesMap,
        instruments,
        instrumentNames,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        selectedComposer,
        setSelectedComposer,
        searchQuery,
        setSearchQuery,
        isLoading,
        apiOnline,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
