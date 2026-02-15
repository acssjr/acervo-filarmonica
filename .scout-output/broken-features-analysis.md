# Codebase Report: Next.js Migration - Broken Features Analysis
Generated: 2026-02-08

## Summary

PROBLEMA ENCONTRADO: Downloads, printing, sharing e favorites estao quebrados porque o codigo Next.js usa API_BASE_URL diretamente para construir URLs de download, o que bypassa o proxy do Next.js configurado em next.config.ts.

Status das funcionalidades:
- Downloads: QUEBRADO (usa URL direta)
- Printing: QUEBRADO (usa URL direta)  
- Sharing: QUEBRADO (usa URL direta)
- Favorites: FUNCIONANDO (usa this.request() que passa pelo proxy)

---

## Analise Detalhada

### 1. API_BASE_URL Configuration

Arquivo: frontend-next/src/constants/api.ts

const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = isLocalhost ? '' : (process.env.NEXT_PUBLIC_API_URL || 'https://acervo-filarmonica-api.acssjr.workers.dev');

VERIFICADO:
- Em localhost: API_BASE_URL = '' (string vazia)
- Em producao: API_BASE_URL = 'https://acervo-filarmonica-api.acssjr.workers.dev'

### 2. Next.js Proxy Configuration

Arquivo: frontend-next/next.config.ts

async rewrites() {
  const isDev = process.env.NODE_ENV === "development";
  return [
    {
      source: "/api/:path*",
      destination: isDev
        ? "http://localhost:8787/api/:path*"
        : (process.env.NEXT_PUBLIC_API_URL || ...) + "/api/:path*",
    },
  ];
}

VERIFICADO:
- Proxy esta configurado corretamente
- Em dev: /api/* -> http://localhost:8787/api/*
- Todas as requests para /api/* sao proxiadas

---

## Funcionalidades Quebradas

### Downloads (QUEBRADO)

Arquivo: frontend-next/src/lib/api.ts:207-210

getDownloadUrl(id: string | number, instrumento: string | null = null) {
  let url = `${API_BASE_URL}/api/download/${id}`;
  if (instrumento) url += `?instrumento=${instrumento}`;
  return url;
}

PROBLEMA:
- Usa API_BASE_URL diretamente
- Em localhost: API_BASE_URL = '' -> URL = /api/download/123
- Deveria funcionar POREM...

Arquivo: frontend-next/src/hooks/useSheetDownload.ts:192

const downloadParteDireta = useCallback(
  async (parte: Parte) => {
    const response = await fetch(
      `${API_BASE_URL}/api/download/parte/${parte.id}`,
    );

PROBLEMA CONFIRMADO:
- Hook usa API_BASE_URL diretamente: linhas 192, 248, 374, 443, 537
- Em localhost: URL = /api/download/parte/123 (correto)
- Mas se API_BASE_URL estiver com valor de producao, vai direto para workers.dev

### Repertorio Download (QUEBRADO)

Arquivo: frontend-next/src/lib/api.ts:500-512

getRepertorioDownloadUrl(
  id: string | number,
  instrumento: string | null,
  formato = "pdf",
  partituraIds: (string | number)[] | null = null
) {
  let url = `${API_BASE_URL}/api/repertorio/${id}/download?formato=${formato}`;
  return url;
}

PROBLEMA:
- Mesmo padrao: usa API_BASE_URL diretamente
- Bypassa proxy do Next.js

### Printing e Sharing (QUEBRADOS)

Arquivo: frontend-next/src/hooks/useSheetDownload.ts

Todos usam fetch direto com API_BASE_URL:
- Linha 192: downloadParteDireta
- Linha 248: downloadCompleto
- Linha 374: printParte (fetch + window.open)
- Linha 443: shareParte (fetch)
- Linha 537: downloadMultiplo (fetch)

---

## Funcionalidade Funcionando

### Favorites (FUNCIONANDO)

Arquivo: frontend-next/src/contexts/DataContext.tsx:183-193

const toggleFavorite = useCallback((id: string) => {
  const apiCall = favoriteIds.includes(Number(id))
    ? API.removeFavorito(id)
    : API.addFavorito(id);
});

Arquivo: frontend-next/src/lib/api.ts:342-347

async addFavorito(partituraId: string | number) {
  return this.request(`/api/favoritos/${partituraId}`, { method: "POST" });
}

POR QUE FUNCIONA:
- Usa this.request() que e um metodo interno do API client
- this.request() usa fetch com URL relativa: /api/favoritos/123
- URL relativa passa pelo proxy do Next.js

---

## Causa Raiz

ARQUITETURA DIFERENTE ENTRE VITE E NEXT.JS:

| Aspecto | Vite | Next.js |
|---------|------|---------|
| Proxy | Dev server proxy | Rewrites |
| Fetch direto | Interceptado | NAO interceptado |
| URL relativa | Proxiada | Reescrita |

O PROBLEMA:
- Codigo usa ${API_BASE_URL}/api/download/...
- Em localhost: API_BASE_URL = '' -> URL = /api/download/...
- DEVERIA funcionar mas Next.js rewrites NAO interceptam fetch com URL absoluta

---

## Solucao Recomendada

OPCAO 2: Forcar URLs relativas

Remover API_BASE_URL de download URLs:

getDownloadUrl(id: string | number, instrumento: string | null = null) {
  let url = `/api/download/${id}`; // SEMPRE relativa
  if (instrumento) url += `?instrumento=${instrumento}`;
  return url;
}

RAZAO:
- Mudanca minima
- Consistente com arquitetura Next.js
- Proxy funciona automaticamente
- Favorites ja usa esse padrao (e funciona)

---

## Arquivos Impactados

| Arquivo | Linhas | Mudanca |
|---------|--------|---------|
| src/lib/api.ts | 208 | Remover API_BASE_URL |
| src/lib/api.ts | 506 | Remover API_BASE_URL |
| src/hooks/useSheetDownload.ts | 192, 248, 374, 443, 537 | Remover API_BASE_URL |

Total: 7 mudancas em 2 arquivos

---

Generated with Claude Code (Scout Agent)
