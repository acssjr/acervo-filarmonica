# Changelog

Todas as mudancas notaveis neste projeto serao documentadas neste arquivo.

O formato e baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semantico](https://semver.org/lang/pt-BR/).

---

## [2.4.0] - 2025-12-06

### Proteção do Super Admin e Melhorias na Gestão de Músicos

**Objetivo:** Proteger o administrador master e melhorar a experiência de gerenciamento de músicos no painel admin.

### Adicionado

- **Proteção Total do Super Admin (@admin)**
  - Super admin não aparece na lista de músicos (invisível para outros admins)
  - Outros admins não podem resetar PIN do super admin
  - Outros admins não podem desativar o super admin
  - Backend protege alterações via API (403 Forbidden)
  - Nome genérico "Administrador" exibido no login em vez do nome real

- **Badge "Admin" na Lista de Músicos**
  - Administradores agora têm badge dourado "ADMIN" ao lado do nome
  - Estilo consistente com a identidade visual (dourado sobre fundo transparente)

- **Animação de Loading no Login**
  - Barras de equalizer musical animadas durante autenticação
  - Gradiente dourado para combinar com tema da filarmônica
  - Texto "Entrando..." abaixo das barras

- **Animação CSS `@keyframes equalizer`**
  - Animação de 5 barras simulando equalizer de áudio
  - Delay escalonado para efeito de onda

### Corrigido

- **Bug de Zeros Aparecendo nos Nomes**
  - Problema: `{user.admin && <Badge />}` quando `user.admin = 0` (SQLite integer)
  - JavaScript: `0 && <Component>` retorna `0`, React renderiza "0" como texto
  - Solução: `{!!user.admin && <Badge />}` - double negation converte para boolean

### Removido

- **Seção de Manutenção Temporária**
  - Removidos botões "Limpar números dos nomes" e "Renomear Super Admin"
  - Funções `handleLimparNomes` e `limpandoNomes` state removidos
  - Endpoint de manutenção mantido no backend para uso futuro

### Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `worker/index.js` | Proteção do super admin em `checkUser`, `login`, `updateUsuario` |
| `screens/admin/AdminMusicos.jsx` | Filtro para ocultar super admin, badge Admin, fix `!!user.admin` |
| `screens/admin/AdminConfig.jsx` | Removida seção de manutenção |
| `screens/LoginScreen.jsx` | Animação de equalizer no loading |
| `styles/animations.css` | `@keyframes equalizer` |
| `services/api.js` | Endpoints de manutenção (mantidos) |

### Segurança

- Super admin (`@admin`) é a única conta que pode se auto-editar
- Tentativas de outros admins editarem o super admin retornam erro 403
- Nome real do super admin nunca é exposto via API

---

## [2.3.3] - 2025-12-06

### Admin Toggle e Melhorias de Login

**Objetivo:** Permitir que administradores alternem entre o modo usuário e admin sem precisar deslogar.

### Adicionado

- **Toggle Admin (Desktop e Mobile)**
  - Novo componente `AdminToggle.jsx` com ícone de chave SVG
  - Visível apenas para usuários com `isAdmin: true`
  - Clique alterna instantaneamente entre `/` (acervo) e `/admin` (painel)
  - Cores diferenciadas:
    - Modo usuário: fundo vinho (`#722F37`) com ícone dourado
    - Modo admin: fundo dourado (`#D4AF37`) com ícone escuro
  - Ícone rotaciona 45° ao entrar no modo admin
  - Animações suaves de fade-out/fade-in durante transição

- **Ícone Key em icons.jsx**
  - SVG de chave para o toggle admin
  - Estilo consistente com demais ícones (stroke, viewBox 24x24)

- **Animações CSS para transição admin**
  - `@keyframes adminFadeOut` - fade + scale down (0.15s)
  - `@keyframes adminFadeIn` - fade + scale up (0.2s)
  - Classes: `body.admin-transition-out`, `body.admin-transition-in`
  - Respeita `prefers-reduced-motion`

### Corrigido

- **Verificação de usuário no login mais precisa**
  - Debounce aumentado de 150ms para 400ms
  - Mínimo de caracteres para verificar: 2 → 3
  - Loading indicator aparece apenas após 200ms de delay
  - Evita "Não encontrado" enquanto usuário ainda digita

### Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `components/common/AdminToggle.jsx` | Novo componente |
| `components/common/HeaderActions.jsx` | Adicionado `<AdminToggle />` |
| `components/layout/DesktopHeader.jsx` | Adicionado `<AdminToggle />` |
| `constants/icons.jsx` | Adicionado ícone `Key` |
| `styles/animations.css` | Animações de transição admin |
| `hooks/useLoginForm.js` | Debounce e validação melhorados |

### Próximos Passos

- Marcar usuários "Antonio Júnior" e "Antonio Neves" como `admin: true` no banco D1
- Testar toggle em desktop e mobile com usuário admin

---

## [2.3.2] - 2025-12-06

### Carrossel de Compositores e Melhorias de UX

**Objetivo:** Redesenhar a seção de compositores no mobile com carrossel elegante e corrigir bugs de scroll.

### Adicionado

- **Carrossel de Compositores (Mobile)**
  - Novo componente `ComposerCarousel.jsx` com design hero cards
  - Glassmorphism com backdrop-filter blur no overlay de texto
  - Fotos dos compositores com zoom-out para melhor visualização
  - Auto-scroll com animação marquee (mesma do FeaturedSheets)
  - Badge "Destaque" no primeiro compositor
  - Indicador "Arraste →" antes da primeira interação
  - Exibe top 3 compositores priorizando: Estevam Moura, Tertuliano Santos, Amando Nobre

### Corrigido

- **Scroll da tela de Compositores**
  - Página abria com scroll no meio ao navegar do carrossel
  - Adicionado `window.scrollTo(0, 0)` no mount do ComposersScreen

- **Efeito de overscroll (bounce/rubber-band)**
  - Restaurado `overscrollBehaviorX: 'contain'` no ComposerCarousel
  - Aplicado também no FeaturedSheets para consistência
  - Efeito de "esticar e voltar" ao arrastar além do limite

### Alterado

- **HomeScreen.jsx**
  - Removida a grid de compositores (layout antigo bugado)
  - Adicionado `ComposerCarousel` renderizado apenas no mobile (`useIsMobile`)

- **ComposerCarousel.jsx** - Especificações visuais:
  - Cards: 220px x 140px com borderRadius 14px
  - Foto com `inset: -10%` para efeito zoom-out
  - `backgroundPosition: center 30%` para enquadrar rostos
  - Padding lateral: 20px
  - Gap entre cards: 12px

---

## [2.3.1] - 2025-12-06

### Busca com Transliteração e Melhorias de UX

**Objetivo:** Permitir busca de partituras com grafias antigas portuguesas e melhorar experiência do usuário.

### Adicionado

- **Transliteração de Grafias Antigas**
  - Busca por "ninfas" agora encontra "Nymphas" (grafia antiga)
  - Suporte a conversões: ph→f, th→t, y→i, rh→r, etc.
  - Regras de duplicação: ll→l, nn→n, pp→p, ss→s, tt→t, cc→c, ff→f
  - Aplicado em `DesktopHeader.jsx` e `SearchScreen.jsx`

- **Seção de Compositores na Home (Mobile)**
  - Grid 2x3 com os 6 compositores mais populares
  - Avatar com inicial e contagem de partituras
  - Botão "Ver Todos" direcionando para `/compositores`

- **Botão de Logout no Admin**
  - Adicionado na sidebar do painel administrativo
  - Ícone vermelho com hover effect
  - Redireciona para `/login` após logout

### Corrigido

- **Dois botões X na barra de busca**
  - Alterado `type="search"` para `type="text"` em todos os inputs de busca
  - CSS adicionado para esconder botão X nativo do WebKit/Edge
  - Arquivos: `SearchBar.jsx`, `DesktopHeader.jsx`, `SearchScreen.jsx`, `base.css`

### Alterado

- **base.css** - Regras CSS para ocultar controles nativos de input search:
  ```css
  input::-webkit-search-cancel-button,
  input::-webkit-search-decoration,
  input::-ms-clear,
  input::-ms-reveal {
    display: none;
    -webkit-appearance: none;
  }
  ```

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
