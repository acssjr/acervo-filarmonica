# User Walkthrough - Plano de Implementação

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Criar walkthrough guiado para músicos na primeira vez que acessam a plataforma após login.

**Architecture:** Reutilizar TutorialOverlay existente generalizando-o para aceitar steps como prop. Criar novo UserWalkthrough wrapper com 9 passos específicos. Hook useUserWalkthrough controla quando exibir.

**Tech Stack:** React, framer-motion (já instalado), localStorage, CSS-in-JS inline

---

## Task 1: Adicionar data-attributes aos componentes de navegação

**Files:**
- Modify: `frontend/src/components/layout/BottomNav.jsx`
- Modify: `frontend/src/components/layout/DesktopSidebar.jsx`

**Step 1: Adicionar data-nav ao BottomNav**

Editar `BottomNav.jsx` linha ~82-88, adicionar `data-nav={tab.id}` ao button:

```jsx
<motion.button
  key={tab.id}
  data-nav={tab.id}
  aria-label={tab.label}
  aria-current={isActive ? 'page' : undefined}
  className={`${styles.tabButton} ${isActive ? styles.active : styles.inactive}`}
```

**Step 2: Adicionar data-sidebar ao DesktopSidebar**

Editar `DesktopSidebar.jsx`. No array `navItems` linha ~55-59, os IDs já existem. Precisamos passar para o SidebarNavItem.

Editar o uso de SidebarNavItem linha ~177-186:

```jsx
{navItems.map(item => (
  <SidebarNavItem
    key={item.id}
    data-sidebar={item.id}
    icon={item.icon}
    label={item.label}
    isActive={activeTab === item.id}
    collapsed={sidebarCollapsed}
    onClick={() => handleNavigation(item.path)}
  />
))}
```

**Step 3: Atualizar SidebarNavItem para aceitar data-sidebar**

Ler e modificar `frontend/src/components/layout/sidebar/SidebarNavItem.jsx` para passar o data-attribute ao elemento raiz.

---

## Task 2: Adicionar data-attributes aos elementos da Home

**Files:**
- Modify: `frontend/src/components/music/FeaturedSheets.jsx`
- Modify: `frontend/src/components/music/FileCard.jsx`
- Modify: `frontend/src/screens/HomeScreen.jsx`

**Step 1: Adicionar data-walkthrough ao FeaturedSheets**

Editar `FeaturedSheets.jsx` linha ~93, adicionar atributo ao container:

```jsx
<div
  data-walkthrough="featured"
  style={{ marginBottom: '32px', width: '100%', overflow: 'visible' }}
>
```

**Step 2: Adicionar data-walkthrough ao FileCard**

Editar `FileCard.jsx` linha ~28-35, adicionar ao motion.div:

```jsx
<motion.div
  data-walkthrough="sheet-card"
  className={`file-card ${styles.card}`}
```

E adicionar ao botão de favorito (linha ~45-52):

```jsx
<button
  data-walkthrough="favorite-btn"
  aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
```

**Step 3: Adicionar data-walkthrough à seção de categorias na HomeScreen**

Editar `HomeScreen.jsx` linha ~91-103, adicionar ao container de categorias:

```jsx
<div
  data-walkthrough="categories"
  style={{ padding: '0 20px', marginBottom: '24px' }}
>
```

---

## Task 3: Adicionar data-attributes à barra de busca

**Files:**
- Modify: `frontend/src/components/common/HomeHeader.jsx`

**Step 1: Ler HomeHeader para encontrar SearchBar**

Ler arquivo e identificar onde está a SearchBar ou input de busca.

**Step 2: Adicionar data-walkthrough="search" ao container de busca**

Adicionar o atributo ao elemento apropriado.

---

## Task 4: Adicionar data-attributes ao SheetDetailModal

**Files:**
- Modify: `frontend/src/components/modals/SheetDetailModal.jsx`

**Step 1: Adicionar data-walkthrough ao botão de download rápido**

Editar linha ~414-448, adicionar ao botão principal de download:

```jsx
<button
  data-walkthrough="quick-download"
  onClick={() => download.handleSelectInstrument(isMaestro ? 'Grade' : userInstrument)}
```

**Step 2: Adicionar data-walkthrough à área de opções**

Editar linha ~469-550, adicionar ao container dos botões de ações:

```jsx
<div
  data-walkthrough="sheet-options"
  style={{ display: 'flex', gap: '8px' }}
>
```

---

## Task 5: Generalizar TutorialOverlay para aceitar steps como prop

**Files:**
- Modify: `frontend/src/components/onboarding/TutorialOverlay.jsx`

**Step 1: Modificar props do componente**

Editar linha ~56, adicionar `steps` como prop com fallback para TUTORIAL_STEPS interno:

```jsx
const TutorialOverlay = ({
  isOpen,
  onClose,
  onExpandFirst,
  onCollapseFirst,
  steps = TUTORIAL_STEPS,
  storageKey = STORAGE_KEY,
  onStepChange
}) => {
```

**Step 2: Substituir TUTORIAL_STEPS por steps**

Substituir todas as ocorrências de `TUTORIAL_STEPS` por `steps`:
- Linha ~64: `const step = steps[currentStep];`
- Linha ~263: `if (currentStep === steps.length - 1)`
- Linha ~370: `{steps.map((_, i) => (`
- Linha ~395: `Passo {currentStep + 1} de {steps.length}`
- Linha ~508: `{currentStep === steps.length - 1 ?`

**Step 3: Usar storageKey prop**

Substituir `STORAGE_KEY` por `storageKey` nas funções:
- Linha ~278: `Storage.set(storageKey, true);`
- Linha ~285: `Storage.set(storageKey, true);`

**Step 4: Adicionar callback onStepChange**

Adicionar chamada no handleNext e handlePrevious para notificar mudança de passo:

```jsx
const handleNext = () => {
  if (currentStep === steps.length - 1) {
    handleFinish();
    return;
  }
  const nextStep = currentStep + 1;
  setCurrentStep(nextStep);
  onStepChange?.(nextStep, steps[nextStep]);
};

const handlePrevious = () => {
  if (currentStep > 0) {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    onStepChange?.(prevStep, steps[prevStep]);
  }
};
```

---

## Task 6: Criar definição dos passos do walkthrough

**Files:**
- Create: `frontend/src/components/onboarding/walkthroughSteps.js`

**Step 1: Criar arquivo com os 9 passos**

```javascript
// ===== WALKTHROUGH STEPS =====
// Definição dos passos do walkthrough para usuários

export const USER_WALKTHROUGH_STEPS = [
  {
    id: 'search',
    targetSelector: '[data-walkthrough="search"]',
    title: 'Busque partituras',
    description: 'Digite o nome da obra, compositor ou gênero para encontrar rapidamente.',
    position: 'bottom',
    highlightPadding: 12
  },
  {
    id: 'featured',
    targetSelector: '[data-walkthrough="featured"]',
    title: 'Destaques',
    description: 'Aqui aparecem as partituras recém-adicionadas e as mais acessadas.',
    position: 'bottom',
    highlightPadding: 16
  },
  {
    id: 'categories',
    targetSelector: '[data-walkthrough="categories"]',
    title: 'Gêneros musicais',
    description: 'Explore por categoria: dobrados, marchas, valsas e muito mais.',
    position: 'bottom',
    highlightPadding: 12
  },
  {
    id: 'favorite-btn',
    targetSelector: '[data-walkthrough="favorite-btn"]',
    title: 'Favorite suas partituras',
    description: 'Toque no coração para salvar e acessar depois rapidamente.',
    position: 'left',
    highlightPadding: 8
  },
  {
    id: 'sheet-card',
    targetSelector: '[data-walkthrough="sheet-card"]',
    title: 'Abra uma partitura',
    description: 'Toque em qualquer card para ver os detalhes e opções de download.',
    position: 'bottom',
    highlightPadding: 8,
    action: 'openModal'
  },
  {
    id: 'quick-download',
    targetSelector: '[data-walkthrough="quick-download"]',
    title: 'Download rápido',
    description: 'Baixe direto a parte do seu instrumento com um toque.',
    position: 'bottom',
    highlightPadding: 8,
    requiresModal: true
  },
  {
    id: 'sheet-options',
    targetSelector: '[data-walkthrough="sheet-options"]',
    title: 'Mais opções',
    description: 'Escolha outro instrumento, imprima ou envie para um colega.',
    position: 'top',
    highlightPadding: 8,
    requiresModal: true
  },
  {
    id: 'nav-favoritos',
    targetSelector: {
      mobile: '[data-nav="favorites"]',
      desktop: '[data-sidebar="favorites"]'
    },
    title: 'Seus favoritos',
    description: 'Acesse aqui todas as partituras que você salvou.',
    position: 'top',
    highlightPadding: 8,
    action: 'closeModal'
  },
  {
    id: 'nav-repertorio',
    targetSelector: {
      mobile: '[data-nav="repertorio"]',
      desktop: '[data-sidebar="repertorio"]'
    },
    title: 'Repertório',
    description: 'Veja as coleções organizadas para ensaios e apresentações.',
    position: 'top',
    highlightPadding: 8,
    finalStep: true
  }
];

export const USER_WALKTHROUGH_STORAGE_KEY = 'walkthrough_user_completed';
```

---

## Task 7: Criar hook useUserWalkthrough

**Files:**
- Create: `frontend/src/components/onboarding/useUserWalkthrough.js`

**Step 1: Criar hook**

```javascript
// ===== USE USER WALKTHROUGH =====
// Hook para controlar exibição do walkthrough de usuário

import { useState, useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useData } from '@contexts/DataContext';
import Storage from '@services/storage';
import { USER_WALKTHROUGH_STORAGE_KEY } from './walkthroughSteps';

export const useUserWalkthrough = () => {
  const { user } = useAuth();
  const { sheets, loading } = useData();
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughPending, setWalkthroughPending] = useState(false);

  useEffect(() => {
    // Não mostra se não estiver autenticado
    if (!user) return;

    // Verifica se já completou
    const completed = Storage.get(USER_WALKTHROUGH_STORAGE_KEY, false);
    if (completed) return;

    // Não mostra enquanto carrega
    if (loading) return;

    // Não mostra se não tiver partituras
    if (!sheets || sheets.length === 0) return;

    // Marca como pendente
    setWalkthroughPending(true);

    // Delay para garantir UI pronta
    const timer = setTimeout(() => {
      setShowWalkthrough(true);
      setWalkthroughPending(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      setWalkthroughPending(false);
    };
  }, [user, sheets, loading]);

  const completeWalkthrough = () => {
    Storage.set(USER_WALKTHROUGH_STORAGE_KEY, true);
    setShowWalkthrough(false);
  };

  return [showWalkthrough, setShowWalkthrough, walkthroughPending, completeWalkthrough];
};
```

---

## Task 8: Criar componente UserWalkthrough

**Files:**
- Create: `frontend/src/components/onboarding/UserWalkthrough.jsx`

**Step 1: Criar componente wrapper**

```jsx
// ===== USER WALKTHROUGH =====
// Walkthrough guiado para usuários na primeira vez

import { useState, useCallback, useEffect } from 'react';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { useMediaQuery } from '@hooks/useMediaQuery';
import TutorialOverlay from './TutorialOverlay';
import { USER_WALKTHROUGH_STEPS, USER_WALKTHROUGH_STORAGE_KEY } from './walkthroughSteps';

const UserWalkthrough = ({ isOpen, onClose }) => {
  const { setSelectedSheet } = useUI();
  const { sheets } = useData();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const [currentStep, setCurrentStep] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Processa steps para usar seletor correto baseado no dispositivo
  const processedSteps = USER_WALKTHROUGH_STEPS.map(step => {
    if (typeof step.targetSelector === 'object') {
      return {
        ...step,
        targetSelector: isMobile ? step.targetSelector.mobile : step.targetSelector.desktop
      };
    }
    return step;
  });

  // Handler para mudança de passo
  const handleStepChange = useCallback((stepIndex, step) => {
    setCurrentStep(stepIndex);

    // Ação: abrir modal
    if (step.action === 'openModal' && sheets.length > 0) {
      // Abre o modal com a primeira partitura
      const firstSheet = sheets[0];
      setSelectedSheet(firstSheet);
      setModalOpen(true);
    }

    // Ação: fechar modal
    if (step.action === 'closeModal') {
      setSelectedSheet(null);
      setModalOpen(false);
    }
  }, [sheets, setSelectedSheet]);

  // Limpa modal ao fechar walkthrough
  useEffect(() => {
    if (!isOpen && modalOpen) {
      setSelectedSheet(null);
      setModalOpen(false);
    }
  }, [isOpen, modalOpen, setSelectedSheet]);

  const handleClose = useCallback(() => {
    setSelectedSheet(null);
    setModalOpen(false);
    onClose();
  }, [onClose, setSelectedSheet]);

  return (
    <TutorialOverlay
      isOpen={isOpen}
      onClose={handleClose}
      steps={processedSteps}
      storageKey={USER_WALKTHROUGH_STORAGE_KEY}
      onStepChange={handleStepChange}
    />
  );
};

export default UserWalkthrough;
```

---

## Task 9: Atualizar export do onboarding

**Files:**
- Create or Modify: `frontend/src/components/onboarding/index.js`

**Step 1: Criar/atualizar arquivo de exports**

```javascript
export { default as TutorialOverlay, useTutorial } from './TutorialOverlay';
export { default as UserWalkthrough } from './UserWalkthrough';
export { useUserWalkthrough } from './useUserWalkthrough';
export { USER_WALKTHROUGH_STEPS, USER_WALKTHROUGH_STORAGE_KEY } from './walkthroughSteps';
```

---

## Task 10: Integrar UserWalkthrough na HomeScreen

**Files:**
- Modify: `frontend/src/screens/HomeScreen.jsx`

**Step 1: Importar componentes**

Adicionar no topo do arquivo:

```jsx
import UserWalkthrough from '@components/onboarding/UserWalkthrough';
import { useUserWalkthrough } from '@components/onboarding/useUserWalkthrough';
```

**Step 2: Usar hook no componente**

Adicionar após os outros hooks (linha ~23):

```jsx
const [showWalkthrough, setShowWalkthrough] = useUserWalkthrough();
```

**Step 3: Renderizar UserWalkthrough**

Adicionar antes do fechamento do return (antes do último `</div>`):

```jsx
<UserWalkthrough
  isOpen={showWalkthrough}
  onClose={() => setShowWalkthrough(false)}
/>
```

---

## Task 11: Ajustar TutorialOverlay para suportar modal externo

**Files:**
- Modify: `frontend/src/components/onboarding/TutorialOverlay.jsx`

**Step 1: Ajustar z-index para ficar acima do modal**

O SheetDetailModal usa z-index 2000-2001. O TutorialOverlay precisa ficar acima quando ativo.

Editar linha ~296-301:

```jsx
<div style={{
  position: 'fixed',
  inset: 0,
  zIndex: 10000, // já está correto
  pointerEvents: 'auto'
}}>
```

Confirmar que está acima do modal (z-index 2001).

---

## Task 12: Atualizar texto do botão final

**Files:**
- Modify: `frontend/src/components/onboarding/TutorialOverlay.jsx`

**Step 1: Adicionar prop para customizar texto do botão final**

Adicionar prop `finalButtonText` com default "Finalizar":

```jsx
const TutorialOverlay = ({
  isOpen,
  onClose,
  onExpandFirst,
  onCollapseFirst,
  steps = TUTORIAL_STEPS,
  storageKey = STORAGE_KEY,
  onStepChange,
  finalButtonText = 'Finalizar'
}) => {
```

**Step 2: Usar prop no botão**

Editar linha ~508-511:

```jsx
{currentStep === steps.length - 1 ? (
  <>
    {finalButtonText}
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  </>
)
```

**Step 3: Passar texto customizado no UserWalkthrough**

Editar `UserWalkthrough.jsx`:

```jsx
<TutorialOverlay
  isOpen={isOpen}
  onClose={handleClose}
  steps={processedSteps}
  storageKey={USER_WALKTHROUGH_STORAGE_KEY}
  onStepChange={handleStepChange}
  finalButtonText="Começar a explorar!"
/>
```

---

## Task 13: Testar localmente

**Step 1: Iniciar servidor local**

```bash
# Terminal 1
npm run api

# Terminal 2
cd frontend && npm run dev
```

**Step 2: Limpar localStorage para testar walkthrough**

No console do navegador:
```javascript
localStorage.removeItem('walkthrough_user_completed');
```

**Step 3: Fazer login e verificar walkthrough**

1. Acessar http://localhost:5173
2. Login com usuário de teste (musico/1234)
3. Verificar se walkthrough aparece após 1.5s
4. Navegar pelos 9 passos
5. Verificar abertura/fechamento do modal nos passos 5-8
6. Verificar que botão final mostra "Começar a explorar!"
7. Recarregar página - não deve aparecer novamente

**Step 4: Testar em mobile (DevTools)**

1. Abrir DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Selecionar dispositivo mobile (375px)
4. Limpar localStorage novamente
5. Recarregar e verificar:
   - Passos 8-9 destacam BottomNav (não sidebar)
   - Tooltips ajustam posição corretamente

---

## Task 14: Commit das alterações

**Step 1: Verificar lint**

```bash
npm run lint:worker
cd frontend && npm run lint
```

**Step 2: Criar branch e commit**

```bash
git checkout -b feat/user-walkthrough
git add .
git commit -m "$(cat <<'EOF'
feat: adicionar walkthrough para primeira vez do usuário

- Generaliza TutorialOverlay para aceitar steps como prop
- Cria UserWalkthrough com 9 passos guiados
- Hook useUserWalkthrough controla exibição
- Adiciona data-attributes nos elementos de navegação
- Integra na HomeScreen após primeiro login

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

**Step 3: Push e criar PR**

```bash
git push -u origin feat/user-walkthrough
gh pr create --title "feat: walkthrough para primeira vez do usuário" --body "$(cat <<'EOF'
## Summary
- Adiciona walkthrough guiado para músicos na primeira vez que acessam
- 9 passos: busca, destaques, categorias, favoritar, card, modal download, opções, nav favoritos, nav repertório
- Reutiliza TutorialOverlay existente generalizado

## Test plan
- [ ] Login com usuário novo → walkthrough aparece
- [ ] Navegar pelos 9 passos sem erros
- [ ] Modal abre no passo 5 e fecha no passo 8
- [ ] Recarregar página → não aparece novamente
- [ ] Testar em mobile (DevTools 375px)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
