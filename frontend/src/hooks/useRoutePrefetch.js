// ===== ROUTE PREFETCH =====
// Shared prefetch utility for route components
// Used by both BottomNav and DesktopSidebar

import { useCallback } from 'react';

// Centralized route-to-component import map
const ROUTE_IMPORTS = {
    '/': () => import('@screens/HomeScreen'),
    '/acervo': () => import('@screens/LibraryScreen'),
    '/buscar': () => import('@screens/SearchScreen'),
    '/favoritos': () => import('@screens/FavoritesScreen'),
    '/repertorio': () => import('@screens/RepertorioScreen'),
    '/perfil': () => import('@screens/ProfileScreen'),
    '/generos': () => import('@screens/GenresScreen'),
    '/compositores': () => import('@screens/ComposersScreen'),
};

/**
 * Prefetch a route component in the background.
 * Uses requestIdleCallback when available, falls back to setTimeout.
 */
export function prefetchRoute(path) {
    const importFn = ROUTE_IMPORTS[path];
    if (!importFn) return;

    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => importFn(), { timeout: 500 });
    } else {
        setTimeout(() => importFn(), 50);
    }
}

/**
 * Hook that returns a stable prefetch callback.
 */
export function useRoutePrefetch() {
    return useCallback((path) => {
        prefetchRoute(path);
    }, []);
}
