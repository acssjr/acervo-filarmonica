# Changelog

Todas as mudancas notaveis neste projeto serao documentadas neste arquivo.

O formato e baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semantico](https://semver.org/lang/pt-BR/).

---

## [2.3.0] - 2025-12-06

### Testes Automatizados e CI/CD

**Objetivo:** Implementar infraestrutura completa de testes para garantir qualidade do codigo em cada deploy.

### Adicionado

- **Testes Unitarios (Jest + Testing Library)**
  - 215 testes cobrindo componentes criticos
  - MSW (Mock Service Worker) para interceptar requisicoes de API
  - Cobertura: LoginScreen 100%, AdminDashboard 82%, Hooks 60%+

- **Testes E2E (Playwright)**
  - 8 testes com mocks (rodam no CI automaticamente)
  - 8 testes com backend real (rodam localmente/manual)
  - Mocks em `tests/mocks/api-mocks.ts`
  - Scripts: `npm run test:e2e`, `test:e2e:ui`, `test:e2e:headed`

- **CI/CD (GitHub Actions)**
  - Pipeline automatico em cada push/PR
  - Jobs: Jest → E2E Mocked → Build
  - Testes com backend real disponiveis via workflow_dispatch
  - Upload de artefatos (coverage, build, playwright report)

- **Arquivos de Teste Criados**
  - `frontend/src/screens/LoginScreen.test.jsx` - 18 testes
  - `frontend/src/screens/admin/AdminDashboard.test.jsx` - 20 testes
  - `frontend/src/__tests__/mocks/handlers.js` - MSW handlers
  - `tests/login.spec.ts` - E2E com backend real
  - `tests/login-mocked.spec.ts` - E2E com mocks
  - `tests/mocks/api-mocks.ts` - Mocks do Playwright
  - `.github/workflows/ci.yml` - Pipeline CI/CD

### Configurado

- **Jest** com suporte a ESM modules (`jest.unstable_mockModule`)
- **Playwright** com webServer automatico (inicia Vite)
- **MSW** interceptando URLs relativas e absolutas

### Fluxo de CI

```
Push/PR
   ↓
┌─────────────────┐    ┌─────────────────┐
│   Jest (215)    │    │  E2E Mocked (8) │
│   ~17 segundos  │    │   ~4 segundos   │
└────────┬────────┘    └────────┬────────┘
         │                      │
         └──────────┬───────────┘
                    ↓
            ┌───────────────┐
            │     Build     │
            │   Vite prod   │
            └───────────────┘
```

### Comandos Disponiveis

```bash
# Testes unitarios
cd frontend && npm test                    # Roda todos
cd frontend && npm test -- LoginScreen     # Roda arquivo especifico
cd frontend && npm run test:coverage       # Com cobertura

# Testes E2E
npm run test:e2e                           # Headless
npm run test:e2e:headed                    # Visual
npm run test:e2e:ui                        # Interface interativa
```

---

## [2.2.0] - 2025-12-05

### Arquitetura - Split de React Contexts

**Problema resolvido:** O `AppContext` monolitico tinha 19+ estados, causando re-renders desnecessarios em toda a aplicacao quando qualquer estado mudava.

### Adicionado

- **AuthContext** (`frontend/src/contexts/AuthContext.jsx`)
  - Estados: `user`, `isAuthenticated`
  - Acoes: `setUser`, `logout`
  - Hook: `useAuth()`

- **UIContext** (`frontend/src/contexts/UIContext.jsx`)
  - Estados: `theme`, `themeMode`, `toast`, `selectedSheet`, `showNotifications`
  - Acoes: `setThemeMode`, `showToast`, `clearToast`, `setSelectedSheet`, `setShowNotifications`
  - Hook: `useUI()`

- **DataContext** (`frontend/src/contexts/DataContext.jsx`)
  - Estados: `sheets`, `favorites`, `categories`, `selectedCategory`, `selectedComposer`, `isLoading`
  - Acoes: `setSheets`, `setFavorites`, `toggleFavorite`, `setSelectedCategory`, `setSelectedComposer`
  - Hook: `useData()`

- **NotificationContext** (`frontend/src/contexts/NotificationContext.jsx`)
  - Estados: `notifications`, `unreadCount`
  - Acoes: `addNotification`, `markNotificationAsRead`, `markAllNotificationsAsRead`
  - Hook: `useNotifications()`

### Alterado

- **main.jsx** - Providers aninhados na ordem correta:
  ```
  AuthProvider > DataProvider > UIProvider > NotificationProvider > App
  ```

- **~30 componentes migrados** de `useApp()` para hooks especificos:

  | Componente | Hooks utilizados |
  |------------|------------------|
  | App.jsx | useAuth, useUI, useData |
  | LoginScreen.jsx | useAuth, useUI, useData |
  | HomeScreen.jsx | useAuth, useData |
  | ProfileScreen.jsx | useAuth, useUI |
  | LibraryScreen.jsx | useAuth, useData, useUI |
  | SearchScreen.jsx | useData |
  | FavoritesScreen.jsx | useData |
  | GenresScreen.jsx | useData |
  | ComposersScreen.jsx | useData |
  | AdminApp.jsx | useAuth, useUI |
  | AdminConfig.jsx | useAuth, useUI |
  | AdminDashboard.jsx | useAuth |
  | AdminPartituras.jsx | useUI |
  | AdminCategorias.jsx | useUI |
  | AdminMusicos.jsx | useUI |
  | BottomNav.jsx | useUI |
  | DesktopLayout.jsx | useUI |
  | DesktopHeader.jsx | useUI, useData, useNotifications |
  | DesktopSidebar.jsx | useUI, useData |
  | SheetDetailModal.jsx | useAuth, useUI, useData |
  | NotificationsPanel.jsx | useUI, useData, useNotifications |
  | ChangePinModal.jsx | useUI |
  | HeaderActions.jsx | useUI, useNotifications |
  | HomeHeader.jsx | useUI |
  | ThemeSelector.jsx | useUI |
  | FileCard.jsx | useUI |
  | FeaturedCard.jsx | useUI |
  | FeaturedSheets.jsx | useUI |
  | CategoryCard.jsx | useUI |
  | useAppNavigation.js | useData |

### Removido

- **AppContext.jsx** - Context monolitico removido completamente
- **useApp()** - Hook legado removido

### Beneficios

1. **Performance**: Mudancas em `theme` nao causam re-render em componentes que so usam `sheets`
2. **Manutencao**: Responsabilidades claramente separadas por dominio
3. **Testabilidade**: Contexts menores sao mais faceis de mockar em testes
4. **Bundle**: Possibilidade futura de code-splitting por contexto

---

## [2.0.0] - 2025-12-04

### Seguranca

- JWT com expiracao de 24h
- PBKDF2 para hash de senhas (100k iteracoes)
- Rate limiting no endpoint de login
- CORS restrito com whitelist de dominios
- Token expiration callback automatico
- Logout centralizado

### Acessibilidade

- Contraste WCAG (cor #9A9A9A para texto muted)
- aria-label nos botoes de favorito/download
- React.memo com comparacao customizada no FileCard

### Interface

- Toggle de tema no header admin
- Redirecionamento automatico para admin quando apropriado

---

## Proximas Etapas (Planejado)

- [ ] Rate limiting em `/api/check-user`
- [ ] Remover admin hardcoded do schema.sql
- [ ] Lazy loading nas screens (React.lazy + Suspense)
- [ ] Debounce em persistencia localStorage
- [ ] Error Boundaries
- [ ] Modularizacao do backend (worker 1800+ linhas)
- [x] ~~Testes unitarios basicos~~ (v2.3.0 - 215 testes)
- [x] ~~CI/CD automatizado~~ (v2.3.0 - GitHub Actions)
- [ ] Aumentar cobertura de testes (Contexts, Utils)
